"""
SpoonOS Agent Module for ChainQuest Academy
Implements the required hackathon flow: Agent → SpoonOS → LLM

This module integrates with SpoonOS SDK to provide:
1. LLM-powered AI tutoring for blockchain education via SpoonOS ChatBot
2. Tool-based blockchain interactions via ToolCallAgent
3. Streaming responses for real-time chat
4. Multi-LLM provider support (OpenRouter, Gemini, OpenAI, etc.)
"""

import os
import json
import asyncio
from typing import Optional, Dict, Any, List, AsyncGenerator

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# SpoonOS SDK imports
try:
    from spoon_ai.chat import ChatBot
    from spoon_ai.agents.toolcall import ToolCallAgent
    from spoon_ai.tools import ToolManager
    SPOON_SDK_AVAILABLE = True
except ImportError:
    SPOON_SDK_AVAILABLE = False
    print("Warning: spoon-ai-sdk not installed. Run: pip install spoon-ai-sdk spoon-toolkits")

# Try to import crypto tools from spoon-toolkits
try:
    from spoon_toolkits.crypto import (
        GetTokenPriceTool,
        Get24hStatsTool,
    )
    CRYPTO_TOOLS_AVAILABLE = True
except ImportError:
    CRYPTO_TOOLS_AVAILABLE = False
    print("Warning: spoon-toolkits crypto tools not available.")


# ============================================================================
# Educational Content Data (used by BlockchainEducationTool)
# ============================================================================

BLOCKCHAIN_CONCEPTS = {
    "blockchain": {
        "title": "What is a Blockchain?",
        "simple": "A digital ledger that records transactions across many computers.",
        "detailed": "A blockchain is a distributed, decentralized database that maintains a continuously growing list of records called blocks. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data.",
        "key_points": [
            "Decentralized - no single point of control",
            "Immutable - records cannot be changed once added",
            "Transparent - anyone can verify transactions",
            "Secure - protected by cryptography"
        ]
    },
    "wallet": {
        "title": "Crypto Wallets Explained",
        "simple": "A digital wallet to store, send, and receive cryptocurrency.",
        "detailed": "A cryptocurrency wallet is software or hardware that stores your private keys and allows you to interact with blockchains. It doesn't actually store crypto - it stores the keys that prove ownership.",
        "key_points": [
            "Public key - your wallet address (like an email)",
            "Private key - secret password (never share!)",
            "Hot wallet - connected to internet",
            "Cold wallet - offline, more secure"
        ]
    },
    "smart_contract": {
        "title": "Smart Contracts",
        "simple": "Self-executing code that runs on a blockchain.",
        "detailed": "Smart contracts are programs stored on a blockchain that automatically execute when predetermined conditions are met. They enable trustless transactions without intermediaries.",
        "key_points": [
            "Self-executing when conditions are met",
            "Immutable once deployed",
            "Transparent - code is visible",
            "Powers DeFi, NFTs, and DAOs"
        ]
    },
    "defi": {
        "title": "Decentralized Finance (DeFi)",
        "simple": "Financial services built on blockchain without banks.",
        "detailed": "DeFi refers to financial services built on blockchain networks that operate without traditional intermediaries like banks. It includes lending, borrowing, trading, and earning interest on crypto.",
        "key_points": [
            "No middlemen or banks required",
            "24/7 access from anywhere",
            "Transparent and auditable",
            "Higher risk, potentially higher rewards"
        ]
    },
    "nft": {
        "title": "Non-Fungible Tokens (NFTs)",
        "simple": "Unique digital items verified on blockchain.",
        "detailed": "NFTs are unique cryptographic tokens on a blockchain that represent ownership of digital or physical items. Unlike cryptocurrencies, each NFT is unique and cannot be exchanged 1:1 with another.",
        "key_points": [
            "Proof of ownership and authenticity",
            "Can represent art, music, collectibles",
            "Stored on blockchain permanently",
            "Can include royalties for creators"
        ]
    },
    "gas": {
        "title": "Gas Fees Explained",
        "simple": "Transaction fees paid to process blockchain operations.",
        "detailed": "Gas is the unit measuring computational effort to execute operations on Ethereum. Users pay gas fees to compensate validators for processing transactions and smart contract executions.",
        "key_points": [
            "Measured in Gwei (0.000000001 ETH)",
            "Higher demand = higher gas prices",
            "Complex operations cost more gas",
            "Failed transactions still cost gas"
        ]
    }
}

NETWORK_INFO = {
    "ethereum": {
        "name": "Ethereum",
        "symbol": "ETH",
        "consensus": "Proof of Stake",
        "block_time": "~12 seconds",
        "smart_contracts": True,
        "launched": 2015
    },
    "bitcoin": {
        "name": "Bitcoin",
        "symbol": "BTC",
        "consensus": "Proof of Work",
        "block_time": "~10 minutes",
        "smart_contracts": False,
        "launched": 2009
    },
    "solana": {
        "name": "Solana",
        "symbol": "SOL",
        "consensus": "Proof of History + Proof of Stake",
        "block_time": "~400 milliseconds",
        "smart_contracts": True,
        "launched": 2020
    },
    "neo": {
        "name": "Neo",
        "symbol": "NEO",
        "consensus": "Delegated Byzantine Fault Tolerance",
        "block_time": "~15 seconds",
        "smart_contracts": True,
        "launched": 2016
    }
}


# ============================================================================
# SpoonOS ChatBot Wrapper
# ============================================================================

def get_chatbot(llm_provider: str = None, model_name: str = None) -> Optional["ChatBot"]:
    """
    Create a SpoonOS ChatBot instance.
    
    The ChatBot handles the SpoonOS → LLM communication.
    Supports multiple providers: openrouter, openai, anthropic, gemini, deepseek
    """
    if not SPOON_SDK_AVAILABLE:
        return None
    
    # Determine provider and model from environment or defaults
    if llm_provider is None:
        # Check which API keys are available
        if os.environ.get("OPENROUTER_API_KEY"):
            llm_provider = "openrouter"
            model_name = model_name or "openai/gpt-4o-mini"
        elif os.environ.get("GEMINI_API_KEY"):
            llm_provider = "gemini"
            model_name = model_name or "gemini-2.0-flash"
        elif os.environ.get("OPENAI_API_KEY"):
            llm_provider = "openai"
            model_name = model_name or "gpt-4o-mini"
        else:
            # Default to openrouter
            llm_provider = "openrouter"
            model_name = model_name or "openai/gpt-4o-mini"
    
    try:
        return ChatBot(llm_provider=llm_provider, model_name=model_name)
    except Exception as e:
        print(f"Error creating ChatBot: {e}")
        return None


# ============================================================================
# ChainQuest ToolCall Agent (for advanced tool-based interactions)
# ============================================================================

def create_chainquest_agent() -> Optional["ToolCallAgent"]:
    """
    Create a ChainQuest ToolCallAgent with blockchain tools.
    
    This agent can automatically decide which tools to use based on user queries.
    Implements the Agent → SpoonOS → Tools → LLM flow.
    """
    if not SPOON_SDK_AVAILABLE:
        return None
    
    # Build tool list
    tools = []
    
    # Add crypto tools if available
    if CRYPTO_TOOLS_AVAILABLE:
        tools.extend([
            GetTokenPriceTool(),
            Get24hStatsTool(),
        ])
    
    if not tools:
        return None
    
    tool_manager = ToolManager(tools)
    
    system_prompt = """You are ChainQuest Academy's Blockchain Explorer Agent.
    
You have access to real cryptocurrency tools to fetch live data.
Use these tools when users ask about:
- Current token/cryptocurrency prices
- 24-hour trading statistics
- Market data

For educational questions about blockchain concepts, provide clear explanations.
Always be helpful, accurate, and educational."""

    class ChainQuestAgent(ToolCallAgent):
        agent_name: str = "ChainQuest Blockchain Explorer"
        agent_description: str = "Educational blockchain agent with live crypto data"
        system_prompt: str = system_prompt
        max_steps: int = 5

    chatbot = get_chatbot()
    if chatbot is None:
        return None
    
    return ChainQuestAgent(llm=chatbot, available_tools=tool_manager)


# ============================================================================
# SpoonAgent - Main Agent Class
# ============================================================================

class SpoonAgent:
    """
    SpoonOS Agent for blockchain education.
    Implements the Agent → SpoonOS → LLM flow required by the hackathon.
    
    This agent uses the SpoonOS SDK's ChatBot for LLM communication,
    demonstrating proper integration with the SpoonOS ecosystem.
    """
    
    def __init__(self):
        self.conversation_history: List[Dict[str, str]] = []
        self._chatbot: Optional["ChatBot"] = None
        self._tool_agent: Optional["ToolCallAgent"] = None
        
        self.system_prompt = """You are ChainQuest Academy's AI Tutor, an expert blockchain educator powered by SpoonOS.

Your role is to:
1. Explain blockchain concepts in simple, engaging terms
2. Answer questions about crypto, wallets, smart contracts, DeFi, and Web3
3. Provide accurate, educational information suitable for beginners
4. Use analogies and examples to make complex topics accessible
5. Encourage learning with a friendly, supportive tone

Guidelines:
- Keep explanations concise but informative
- Use bullet points for clarity when appropriate
- Acknowledge what you don't know
- Never give financial advice or price predictions
- Focus on education and understanding, not speculation

You have access to blockchain tools that provide structured educational content.
When asked about specific topics, use the tool data to enhance your responses."""
        
        self.game_master_prompt = """You are the Game Master of ChainQuest Academy's Blockchain Quest!

You guide players through an interactive story-based learning adventure. You embody various NPCs:
- Satoshi Sage: Wise mentor, patient and knowledgeable
- Vitalik Venture: Clever trader, slightly cocky but helpful
- Crypto Guardian: Serious security expert, protective
- DeFi Delilah: Enthusiastic DeFi explorer, adventurous

Your role as Game Master:
1. Stay in character when roleplaying NPCs
2. Make learning feel like an adventure
3. Provide narrative feedback that advances the story
4. Celebrate victories and encourage after setbacks
5. Keep responses engaging and story-focused

Guidelines:
- Use dramatic, narrative language
- Keep responses brief (2-4 sentences)
- Always stay in character
- Balance education with entertainment"""
    
    @property
    def chatbot(self) -> Optional["ChatBot"]:
        """Lazy initialization of SpoonOS ChatBot."""
        if self._chatbot is None:
            self._chatbot = get_chatbot()
        return self._chatbot
    
    @property
    def tool_agent(self) -> Optional["ToolCallAgent"]:
        """Lazy initialization of ToolCallAgent."""
        if self._tool_agent is None:
            self._tool_agent = create_chainquest_agent()
        return self._tool_agent
    
    def _get_educational_context(self, user_message: str) -> str:
        """
        Get relevant educational content based on user message.
        This provides structured blockchain data to enhance LLM responses.
        """
        context_parts = []
        message_lower = user_message.lower()
        
        # Check for concept keywords
        for concept_key, concept_data in BLOCKCHAIN_CONCEPTS.items():
            if concept_key.replace("_", " ") in message_lower or concept_key in message_lower:
                context_parts.append(f"\n### {concept_data['title']}\n{concept_data['detailed']}\nKey points: {', '.join(concept_data['key_points'])}")
                break
        
        # Check for network keywords
        for network_key, network_data in NETWORK_INFO.items():
            if network_key in message_lower:
                context_parts.append(f"\n### {network_data['name']} Network Info\n" + 
                    f"Symbol: {network_data['symbol']}, Consensus: {network_data['consensus']}, " +
                    f"Block time: {network_data['block_time']}, Smart Contracts: {network_data['smart_contracts']}")
                break
        
        if context_parts:
            return "\n\nRelevant blockchain data from SpoonOS tools:" + "".join(context_parts)
        return ""
    
    def chat(self, user_message: str, include_tool_context: bool = True, game_master_mode: bool = False) -> str:
        """
        Process a chat message through the SpoonOS → LLM pipeline.
        
        Flow: User Input → Agent → SpoonOS ChatBot → LLM → Response
        
        Args:
            user_message: The user's message
            include_tool_context: Whether to include blockchain educational data
            game_master_mode: Whether to use Game Master persona for adventure mode
        
        Returns:
            The AI assistant's response
        """
        # Get educational context if requested
        tool_context = ""
        if include_tool_context:
            tool_context = self._get_educational_context(user_message)
        
        # Add to conversation history
        self.conversation_history.append({"role": "user", "content": user_message})
        
        # Choose prompt based on mode
        active_prompt = self.game_master_prompt if game_master_mode else self.system_prompt
        full_system_prompt = active_prompt + tool_context
        
        # Build messages for SpoonOS ChatBot
        messages = []
        for msg in self.conversation_history[-10:]:
            messages.append({"role": msg["role"], "content": msg["content"]})
        
        # Try SpoonOS ChatBot first (the required hackathon flow)
        if SPOON_SDK_AVAILABLE and self.chatbot is not None:
            try:
                # Use synchronous wrapper for async streaming
                response_text = asyncio.run(self._chat_with_spoon(messages, full_system_prompt))
                self.conversation_history.append({"role": "assistant", "content": response_text})
                return response_text
            except Exception as e:
                print(f"SpoonOS ChatBot error: {e}")
                # Fall through to fallback
        
        # Fallback to direct Gemini if SpoonOS unavailable
        return self._fallback_chat(messages, full_system_prompt)
    
    async def _chat_with_spoon(self, messages: List[Dict], system_prompt: str) -> str:
        """
        Chat using SpoonOS ChatBot with streaming.
        
        This is the core SpoonOS integration - demonstrating:
        Agent → SpoonOS SDK (ChatBot) → LLM Provider → Response
        """
        response_parts = []
        
        async for chunk in self.chatbot.astream(messages, system_msg=system_prompt, timeout=60.0):
            response_parts.append(chunk.delta)
        
        return "".join(response_parts)
    
    async def astream_chat(self, user_message: str, include_tool_context: bool = True, 
                           game_master_mode: bool = False) -> AsyncGenerator[str, None]:
        """
        Async streaming chat using SpoonOS ChatBot.
        
        Yields chunks of the response as they arrive from the LLM.
        This provides real-time streaming for better UX.
        """
        # Get educational context
        tool_context = ""
        if include_tool_context:
            tool_context = self._get_educational_context(user_message)
        
        # Add to history
        self.conversation_history.append({"role": "user", "content": user_message})
        
        # Choose prompt
        active_prompt = self.game_master_prompt if game_master_mode else self.system_prompt
        full_system_prompt = active_prompt + tool_context
        
        # Build messages
        messages = [{"role": msg["role"], "content": msg["content"]} 
                    for msg in self.conversation_history[-10:]]
        
        if SPOON_SDK_AVAILABLE and self.chatbot is not None:
            response_parts = []
            try:
                async for chunk in self.chatbot.astream(messages, system_msg=full_system_prompt, timeout=60.0):
                    response_parts.append(chunk.delta)
                    yield chunk.delta
                
                # Save complete response to history
                full_response = "".join(response_parts)
                self.conversation_history.append({"role": "assistant", "content": full_response})
            except Exception as e:
                error_msg = f"Error: {str(e)}"
                yield error_msg
        else:
            # Fallback - yield complete response at once
            response = self._fallback_chat(messages, full_system_prompt)
            self.conversation_history.append({"role": "assistant", "content": response})
            yield response
    
    def _fallback_chat(self, messages: List[Dict], system_prompt: str) -> str:
        """
        Fallback to direct Gemini API if SpoonOS SDK is unavailable.
        This ensures the app still works without SpoonOS installed.
        """
        try:
            import google.generativeai as genai
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                return "Please configure OPENROUTER_API_KEY or GEMINI_API_KEY in the .env file."
            
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            # Build prompt
            full_prompt = system_prompt + "\n\n"
            for msg in messages:
                role = "User" if msg["role"] == "user" else "Assistant"
                full_prompt += f"{role}: {msg['content']}\n\n"
            full_prompt += "Assistant:"
            
            response = model.generate_content(full_prompt)
            return response.text
            
        except Exception as e:
            return f"I'm having trouble connecting. Error: {str(e)}"
    
    def generate_quiz_feedback(self, question: str, user_answer: str, correct_answer: str, is_correct: bool) -> str:
        """
        Generate AI-powered feedback for quiz answers using SpoonOS.
        
        Flow: Quiz Data → SpoonOS ChatBot → LLM → Feedback
        """
        prompt = f"""You are a supportive blockchain educator giving quiz feedback.

The student answered a blockchain quiz question.

Question: {question}
Student's Answer: {user_answer}
Correct Answer: {correct_answer}
Was Correct: {"Yes" if is_correct else "No"}

Provide brief, encouraging feedback (2-3 sentences). If incorrect, explain why the correct answer is right without being discouraging. If correct, reinforce the learning."""

        messages = [{"role": "user", "content": prompt}]
        
        # Try SpoonOS first
        if SPOON_SDK_AVAILABLE and self.chatbot is not None:
            try:
                response = asyncio.run(self._simple_chat(messages))
                return response
            except Exception as e:
                print(f"SpoonOS feedback error: {e}")
        
        # Fallback
        if is_correct:
            return "Great job! You got it right!"
        else:
            return f"Not quite! The correct answer is: {correct_answer}"
    
    async def _simple_chat(self, messages: List[Dict]) -> str:
        """Simple chat without system prompt for utility functions."""
        response_parts = []
        async for chunk in self.chatbot.astream(messages, timeout=30.0):
            response_parts.append(chunk.delta)
        return "".join(response_parts)
    
    def generate_module(self, topic: str) -> Dict[str, Any]:
        """
        Generate a complete learning module using SpoonOS → LLM.
        
        Creates lessons with content and quiz questions.
        """
        prompt = f"""You are an expert blockchain educator creating a learning module.

Generate a complete learning module about: "{topic}"

The module must be related to blockchain, cryptocurrency, Web3, or related technologies.

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{{
    "id": "unique-id-lowercase-with-hyphens",
    "title": "Module Title",
    "description": "Brief 1-2 sentence description of what students will learn",
    "icon": "cube",
    "color": "from-purple-500 to-pink-500",
    "lessons": [
        {{
            "id": "unique-lesson-id",
            "title": "Lesson Title",
            "duration": "5 min",
            "xp": 20,
            "content": "# Lesson Title\\n\\nMarkdown content with headers, bullet points, and explanations.",
            "quiz": [
                {{
                    "question": "Question text?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct": 0
                }}
            ]
        }}
    ]
}}

Requirements:
- Generate exactly 3 lessons
- Each lesson must have 2-3 quiz questions
- Each quiz question must have exactly 4 options
- "correct" is the 0-based index of the correct answer
- "icon" must be one of: "cube", "wallet", "code", "chart", "shield", "globe", "zap", "layers"

Return ONLY the JSON object, nothing else."""

        messages = [{"role": "user", "content": prompt}]
        
        try:
            # Try SpoonOS first
            if SPOON_SDK_AVAILABLE and self.chatbot is not None:
                response_text = asyncio.run(self._simple_chat(messages))
            else:
                # Fallback to Gemini
                import google.generativeai as genai
                api_key = os.environ.get("GEMINI_API_KEY")
                if not api_key:
                    return {"error": "No API key configured"}
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel('gemini-2.0-flash')
                response = model.generate_content(prompt)
                response_text = response.text
            
            # Clean up response
            response_text = response_text.strip()
            if response_text.startswith("```"):
                lines = response_text.split("\n")
                response_text = "\n".join(lines[1:-1])
            
            # Parse JSON
            module_data = json.loads(response_text)
            
            # Validate
            required_fields = ["id", "title", "description", "icon", "color", "lessons"]
            for field in required_fields:
                if field not in module_data:
                    return {"error": f"Missing required field: {field}"}
            
            return {"success": True, "module": module_data}
            
        except json.JSONDecodeError as e:
            return {"error": f"Failed to parse generated module: {str(e)}"}
        except Exception as e:
            return {"error": f"Failed to generate module: {str(e)}"}
    
    async def generate_contract(self, description: str) -> Dict[str, Any]:
        """
        Generate a Solidity smart contract from natural language description.
        
        Flow: User Description → SpoonOS ChatBot → LLM → Solidity Code
        
        Args:
            description: Natural language description of the desired contract
        
        Returns:
            Dictionary with code, explanation, and warnings
        """
        # Contract generation system prompt with security guidelines
        contract_prompt = f"""You are an expert Solidity smart contract developer. Generate secure, production-quality Solidity code based on the user's description.

User Request: "{description}"

Generate a complete Solidity smart contract that fulfills this request. Include:
1. Proper SPDX license and pragma statements
2. Security best practices (access control, reentrancy guards, etc.)
3. Clear, commented code
4. Standard patterns (ERC-20, ERC-721, etc.) when applicable

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{{
    "code": "// SPDX-License-Identifier: MIT\\npragma solidity ^0.8.0;\\n\\ncontract Example {{\\n    // Contract code here\\n}}",
    "explanation": "Plain English explanation of what the contract does, how it works, and key features (2-3 sentences)",
    "warnings": ["Warning 1", "Warning 2"]
}}

Security Guidelines:
- Always include access control for privileged functions
- Use SafeMath or Solidity ^0.8.0 for overflow protection
- Include events for important state changes
- Add reentrancy guards for external calls
- Validate inputs and handle edge cases
- Include pause/emergency stop mechanisms when appropriate

Common Contract Templates:
1. ERC-20 Token: Standard fungible token with totalSupply, balanceOf, transfer, approve, transferFrom
2. ERC-721 NFT: Non-fungible token with ownerOf, transferFrom, approve, tokenURI
3. Payment Splitter: Distributes payments to multiple addresses proportionally
4. Voting/DAO: Proposal creation, voting, execution with quorum
5. Escrow: Holds funds until conditions are met
6. Time Lock: Delays execution of transactions

Warnings to include (if applicable):
- "No access control - any address can call privileged functions"
- "No reentrancy protection - vulnerable to reentrancy attacks"
- "No input validation - may fail with invalid inputs"
- "Centralized control - owner has significant power"
- "No upgrade mechanism - contract is immutable"
- "Gas intensive operations - may hit block gas limit"
- "Requires external oracle - depends on off-chain data"

Return ONLY the JSON object, nothing else."""

        messages = [{"role": "user", "content": contract_prompt}]
        
        try:
            # Try SpoonOS first
            if SPOON_SDK_AVAILABLE and self.chatbot is not None:
                response_text = await self._simple_chat(messages)
            else:
                # Fallback to Gemini
                import google.generativeai as genai
                api_key = os.environ.get("GEMINI_API_KEY")
                if not api_key:
                    return {"error": "No API key configured"}
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel('gemini-2.0-flash')
                response = model.generate_content(contract_prompt)
                response_text = response.text
            
            # Clean up response
            response_text = response_text.strip()
            if response_text.startswith("```json"):
                lines = response_text.split("\n")
                response_text = "\n".join(lines[1:-1])
            elif response_text.startswith("```"):
                lines = response_text.split("\n")
                response_text = "\n".join(lines[1:-1])
            
            # Parse JSON
            contract_data = json.loads(response_text)
            
            # Validate structure
            required_fields = ["code", "explanation"]
            for field in required_fields:
                if field not in contract_data:
                    return {"error": f"Missing required field: {field}"}
            
            # Ensure warnings field exists
            if "warnings" not in contract_data:
                contract_data["warnings"] = []
            
            # Basic validation: check if code contains contract keyword
            if "contract " not in contract_data["code"]:
                return {"error": "Generated code does not appear to be a valid Solidity contract"}
            
            return {"success": True, "contract": contract_data}
            
        except json.JSONDecodeError as e:
            return {"error": f"Failed to parse generated contract: {str(e)}"}
        except Exception as e:
            return {"error": f"Failed to generate contract: {str(e)}"}
    
    def clear_history(self):
        """Clear conversation history."""
        self.conversation_history = []


# ============================================================================
# Singleton Instance
# ============================================================================

spoon_agent = SpoonAgent()


def get_agent() -> SpoonAgent:
    """Get the singleton SpoonOS agent instance."""
    return spoon_agent


# ============================================================================
# Utility Functions
# ============================================================================

def check_spoon_status() -> Dict[str, Any]:
    """Check SpoonOS SDK availability and configuration."""
    return {
        "spoon_sdk_available": SPOON_SDK_AVAILABLE,
        "crypto_tools_available": CRYPTO_TOOLS_AVAILABLE,
        "openrouter_configured": bool(os.environ.get("OPENROUTER_API_KEY")),
        "gemini_configured": bool(os.environ.get("GEMINI_API_KEY")),
        "openai_configured": bool(os.environ.get("OPENAI_API_KEY")),
    }
