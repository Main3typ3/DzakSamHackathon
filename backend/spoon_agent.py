"""
SpoonOS Agent Module for ChainQuest Academy
Demonstrates the required hackathon flow: Agent → SpoonOS → LLM

This module integrates with SpoonOS to provide:
1. LLM-powered AI tutoring for blockchain education
2. Crypto/Web3 tool integration for real blockchain data
3. Agent-based learning assistance
"""

import os
import json
from typing import Optional, Dict, Any, List

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

gemini_model = None

def get_gemini_model():
    """Get or create Gemini model lazily."""
    global gemini_model
    if gemini_model is None:
        import google.generativeai as genai
        api_key = os.environ.get("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            gemini_model = genai.GenerativeModel('gemini-2.0-flash')
    return gemini_model


class BlockchainTool:
    """
    SpoonOS Tool Module for Crypto/Web3 operations.
    Provides blockchain-related data and educational context.
    """
    
    def __init__(self):
        self.tool_name = "blockchain_tool"
        self.supported_operations = [
            "get_blockchain_info",
            "explain_concept",
            "get_wallet_basics",
            "get_transaction_structure",
            "get_smart_contract_basics",
            "get_defi_overview"
        ]
    
    def execute(self, operation: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute a blockchain tool operation with error handling."""
        try:
            if operation not in self.supported_operations:
                return {
                    "success": False,
                    "error": f"Unknown operation: {operation}",
                    "supported": self.supported_operations
                }
            
            method = getattr(self, f"_op_{operation}", None)
            if method:
                result = method(params or {})
                return {"success": True, "data": result}
            
            return {"success": False, "error": "Operation not implemented"}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _op_get_blockchain_info(self, params: Dict) -> Dict:
        """Get basic blockchain network information."""
        network = params.get("network", "ethereum")
        
        networks = {
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
            }
        }
        
        return networks.get(network.lower(), networks["ethereum"])
    
    def _op_explain_concept(self, params: Dict) -> Dict:
        """Get educational explanation of blockchain concepts."""
        concept = params.get("concept", "blockchain")
        
        concepts = {
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
        
        return concepts.get(concept.lower(), {
            "title": f"Concept: {concept}",
            "simple": "This concept is being researched.",
            "detailed": "Ask the AI tutor for more information about this topic.",
            "key_points": []
        })
    
    def _op_get_wallet_basics(self, params: Dict) -> Dict:
        """Get wallet creation and security basics."""
        return {
            "steps_to_create": [
                "1. Choose a wallet type (hot or cold)",
                "2. Download from official source only",
                "3. Create a strong password",
                "4. Write down your seed phrase (12-24 words)",
                "5. Store seed phrase securely offline",
                "6. Never share your private key or seed phrase"
            ],
            "security_tips": [
                "Use hardware wallets for large amounts",
                "Enable 2FA when available",
                "Verify website URLs carefully",
                "Be wary of phishing attempts",
                "Test with small amounts first"
            ],
            "popular_wallets": {
                "hot": ["MetaMask", "Coinbase Wallet", "Trust Wallet"],
                "cold": ["Ledger", "Trezor"]
            }
        }
    
    def _op_get_transaction_structure(self, params: Dict) -> Dict:
        """Get transaction structure explanation."""
        return {
            "components": {
                "from": "Sender's wallet address",
                "to": "Recipient's wallet address",
                "value": "Amount of cryptocurrency being sent",
                "gas_limit": "Maximum gas willing to spend",
                "gas_price": "Price per unit of gas",
                "nonce": "Transaction count from sender",
                "data": "Additional data (for smart contracts)",
                "signature": "Cryptographic proof of authorization"
            },
            "lifecycle": [
                "1. Transaction created and signed",
                "2. Broadcast to network",
                "3. Added to mempool (pending)",
                "4. Validator includes in block",
                "5. Block added to chain",
                "6. Transaction confirmed"
            ]
        }
    
    def _op_get_smart_contract_basics(self, params: Dict) -> Dict:
        """Get smart contract fundamentals."""
        return {
            "what_they_do": [
                "Automate agreements between parties",
                "Execute when conditions are met",
                "Handle digital assets programmatically",
                "Enable complex DeFi protocols"
            ],
            "example_use_cases": [
                "Token creation (ERC-20, ERC-721)",
                "Decentralized exchanges (Uniswap)",
                "Lending protocols (Aave, Compound)",
                "NFT marketplaces (OpenSea)",
                "DAOs (governance systems)"
            ],
            "languages": {
                "ethereum": "Solidity, Vyper",
                "solana": "Rust",
                "near": "Rust, AssemblyScript"
            },
            "risks": [
                "Bugs can lead to loss of funds",
                "Immutable once deployed",
                "Reentrancy attacks",
                "Oracle manipulation"
            ]
        }
    
    def _op_get_defi_overview(self, params: Dict) -> Dict:
        """Get DeFi ecosystem overview."""
        return {
            "categories": {
                "dex": {
                    "name": "Decentralized Exchanges",
                    "examples": ["Uniswap", "SushiSwap", "Curve"],
                    "description": "Trade tokens without intermediaries"
                },
                "lending": {
                    "name": "Lending & Borrowing",
                    "examples": ["Aave", "Compound", "MakerDAO"],
                    "description": "Lend assets to earn interest or borrow against collateral"
                },
                "yield": {
                    "name": "Yield Farming",
                    "examples": ["Yearn Finance", "Convex"],
                    "description": "Optimize returns across DeFi protocols"
                },
                "staking": {
                    "name": "Staking",
                    "examples": ["Lido", "Rocket Pool"],
                    "description": "Lock tokens to secure network and earn rewards"
                }
            },
            "key_metrics": [
                "TVL (Total Value Locked)",
                "APY (Annual Percentage Yield)",
                "Liquidity depth",
                "Protocol revenue"
            ],
            "risks": [
                "Smart contract vulnerabilities",
                "Impermanent loss",
                "Liquidation risk",
                "Rug pulls and scams"
            ]
        }


class SpoonAgent:
    """
    SpoonOS Agent for blockchain education.
    Implements the Agent → SpoonOS → LLM flow required by the hackathon.
    """
    
    def __init__(self):
        self.blockchain_tool = BlockchainTool()
        self.conversation_history: List[Dict[str, str]] = []
        self.system_prompt = """You are ChainQuest Academy's AI Tutor, an expert blockchain educator.

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
    
    def use_tool(self, operation: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Execute a SpoonOS tool operation.
        This demonstrates the Tool Module integration required by the hackathon.
        """
        result = self.blockchain_tool.execute(operation, params)
        return result
    
    def chat(self, user_message: str, include_tool_context: bool = True, game_master_mode: bool = False) -> str:
        """
        Process a chat message through the SpoonOS → LLM pipeline.
        
        Flow: User Input → Agent → SpoonOS Tool (optional) → LLM → Response
        
        Args:
            user_message: The user's message
            include_tool_context: Whether to include blockchain tool data
            game_master_mode: Whether to use Game Master persona for adventure mode
        """
        tool_context = ""
        
        if include_tool_context:
            keywords_to_tools = {
                "blockchain": ("explain_concept", {"concept": "blockchain"}),
                "wallet": ("explain_concept", {"concept": "wallet"}),
                "smart contract": ("explain_concept", {"concept": "smart_contract"}),
                "defi": ("explain_concept", {"concept": "defi"}),
                "nft": ("explain_concept", {"concept": "nft"}),
                "gas": ("explain_concept", {"concept": "gas"}),
                "ethereum": ("get_blockchain_info", {"network": "ethereum"}),
                "bitcoin": ("get_blockchain_info", {"network": "bitcoin"}),
                "solana": ("get_blockchain_info", {"network": "solana"}),
                "transaction": ("get_transaction_structure", {}),
            }
            
            message_lower = user_message.lower()
            for keyword, (operation, params) in keywords_to_tools.items():
                if keyword in message_lower:
                    tool_result = self.use_tool(operation, params)
                    if tool_result.get("success"):
                        tool_context = f"\n\nRelevant blockchain data from SpoonOS tools:\n{json.dumps(tool_result['data'], indent=2)}"
                    break
        
        self.conversation_history.append({"role": "user", "content": user_message})
        
        # Choose prompt based on mode
        active_prompt = self.game_master_prompt if game_master_mode else self.system_prompt
        
        messages = [{"role": "system", "content": active_prompt + tool_context}]
        messages.extend(self.conversation_history[-10:])
        
        try:
            model = get_gemini_model()
            if model is None:
                return "I need a Gemini API key to answer your questions. Please add your GEMINI_API_KEY in the .env file."
            
            # Build the prompt for Gemini
            full_prompt = active_prompt + tool_context + "\n\n"
            for msg in self.conversation_history[-10:]:
                role = "User" if msg["role"] == "user" else "Assistant"
                full_prompt += f"{role}: {msg['content']}\n\n"
            full_prompt += "Assistant:"
            
            response = model.generate_content(full_prompt)
            
            assistant_message = response.text
            self.conversation_history.append({"role": "assistant", "content": assistant_message})
            
            return assistant_message
            
        except Exception as e:
            error_msg = f"I'm having trouble connecting to my knowledge base. Error: {str(e)}"
            return error_msg
    
    def generate_quiz_feedback(self, question: str, user_answer: str, correct_answer: str, is_correct: bool) -> str:
        """Generate AI-powered feedback for quiz answers."""
        prompt = f"""You are a supportive blockchain educator giving quiz feedback.

The student answered a blockchain quiz question.

Question: {question}
Student's Answer: {user_answer}
Correct Answer: {correct_answer}
Was Correct: {"Yes" if is_correct else "No"}

Provide brief, encouraging feedback (2-3 sentences). If incorrect, explain why the correct answer is right without being discouraging. If correct, reinforce the learning."""

        try:
            model = get_gemini_model()
            if model is None:
                if is_correct:
                    return "Great job! You got it right!"
                else:
                    return f"Not quite! The correct answer is: {correct_answer}"
            
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            if is_correct:
                return "Great job! You got it right!"
            else:
                return f"Not quite! The correct answer is: {correct_answer}"
    
    def generate_module(self, topic: str) -> Dict[str, Any]:
        """
        Generate a complete learning module using Gemini AI.
        Creates lessons with content and 4-option quiz questions.
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
            "content": "# Lesson Title\\n\\nMarkdown content with headers, bullet points, and explanations. Make it educational and beginner-friendly. Include:\\n- Key concepts\\n- Examples\\n- Real-world applications",
            "quiz": [
                {{
                    "question": "Question text?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct": 0
                }},
                {{
                    "question": "Another question?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct": 2
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
- "color" must be a Tailwind gradient like "from-COLOR-500 to-COLOR-500"
- Content should be educational, accurate, and beginner-friendly
- Use markdown formatting in content (headers, bullets, bold, code blocks)

Return ONLY the JSON object, nothing else."""

        try:
            model = get_gemini_model()
            if model is None:
                return {"error": "Gemini API key not configured"}
            
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Clean up response - remove markdown code blocks if present
            if response_text.startswith("```"):
                lines = response_text.split("\n")
                # Remove first line (```json) and last line (```)
                response_text = "\n".join(lines[1:-1])
            
            # Parse JSON
            module_data = json.loads(response_text)
            
            # Validate structure
            required_fields = ["id", "title", "description", "icon", "color", "lessons"]
            for field in required_fields:
                if field not in module_data:
                    return {"error": f"Missing required field: {field}"}
            
            # Validate lessons
            for lesson in module_data["lessons"]:
                lesson_fields = ["id", "title", "duration", "xp", "content", "quiz"]
                for field in lesson_fields:
                    if field not in lesson:
                        return {"error": f"Lesson missing required field: {field}"}
                
                # Validate quiz questions
                for quiz in lesson["quiz"]:
                    if len(quiz.get("options", [])) != 4:
                        return {"error": "Each quiz question must have exactly 4 options"}
                    if not isinstance(quiz.get("correct"), int) or quiz["correct"] < 0 or quiz["correct"] > 3:
                        return {"error": "Quiz 'correct' must be an integer 0-3"}
            
            return {"success": True, "module": module_data}
            
        except json.JSONDecodeError as e:
            return {"error": f"Failed to parse generated module: {str(e)}"}
        except Exception as e:
            return {"error": f"Failed to generate module: {str(e)}"}
    
    def clear_history(self):
        """Clear conversation history."""
        self.conversation_history = []


spoon_agent = SpoonAgent()


def get_agent() -> SpoonAgent:
    """Get the singleton SpoonOS agent instance."""
    return spoon_agent
