"""
Adventure Mode Data - Story-based learning with branching narratives.
Implements the Blockchain Quest story with 3 chapters.
"""

from typing import Dict, List, Any

# NPC Characters for AI roleplay
NPCS = {
    "mentor": {
        "name": "Satoshi Sage",
        "role": "Wise blockchain mentor",
        "personality": "Patient, knowledgeable, uses analogies to explain concepts",
        "backstory": "A veteran of the early crypto days who now guides newcomers"
    },
    "rival": {
        "name": "Vitalik Venture",
        "role": "Competitive blockchain trader",
        "personality": "Clever, slightly cocky, but ultimately helpful",
        "backstory": "A successful trader who challenges you to think critically"
    },
    "guardian": {
        "name": "Crypto Guardian",
        "role": "Security expert",
        "personality": "Serious about security, protective, detail-oriented",
        "backstory": "Protects users from scams and teaches safe practices"
    },
    "explorer": {
        "name": "DeFi Delilah",
        "role": "DeFi protocol explorer",
        "personality": "Adventurous, enthusiastic, risk-aware",
        "backstory": "An expert who explores new DeFi protocols and teaches others"
    }
}

# Chapter 1: The Lost Wallet
CHAPTER_1 = {
    "id": "chapter_1",
    "title": "The Lost Wallet",
    "description": "Your journey begins when you discover a mysterious wallet address. Learn the fundamentals of blockchain and wallets to recover it.",
    "narrative_intro": """
🌟 **The Blockchain Quest Begins** 🌟

You wake up one morning to find a cryptic note slipped under your door:

*"The key to your fortune lies in understanding the chain. 
Find the lost wallet at: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb*"

Intrigued, you decide to embark on a quest to understand this mysterious world of blockchain and cryptocurrency. 

**Satoshi Sage**, a wise mentor, appears before you...
""",
    "challenges": [
        {
            "id": "ch1_q1",
            "type": "choice",
            "npc": "mentor",
            "narrative": """
**Satoshi Sage**: "Greetings, young seeker! I see you've found the note. Before we can help you find that wallet, you must understand what blockchain truly is."

He gestures to a shimmering network of lights in the air.

"Tell me, what do you think makes blockchain special?"
""",
            "question": "What is the fundamental feature that makes blockchain secure and trustworthy?",
            "choices": [
                "It's controlled by a single powerful company that ensures security",
                "It's a decentralized, distributed ledger that no single entity controls",
                "It uses the fastest servers in the world",
                "It requires government approval for every transaction"
            ],
            "correct": 1,
            "feedback_correct": """
**Satoshi Sage**: "Excellent! You grasp the core concept! 

Blockchain is indeed a *decentralized, distributed ledger*. Think of it like a book that everyone has a copy of. When a new page is added, everyone's copy updates. No single person can change the past pages because everyone else would notice the difference!

This decentralization is what makes blockchain revolutionary. Let's continue..."
""",
            "feedback_incorrect": """
**Satoshi Sage**: "Ah, I see the confusion. Let me clarify...

Blockchain's true power lies in its *decentralization*. Imagine a ledger that everyone can see and verify, but no single entity controls. That's blockchain! It's distributed across thousands of computers worldwide, making it nearly impossible to tamper with.

Let's try to understand this better..."
""",
            "xp_reward": 25
        },
        {
            "id": "ch1_q2",
            "type": "choice",
            "npc": "mentor",
            "narrative": """
**Satoshi Sage**: "Good! Now, that wallet address you found - it's the key to accessing cryptocurrency. But you must understand how wallets work."

He pulls out two shimmering keys - one golden, one silver.

"In the crypto world, wallets use a pair of keys. Which one do you think you should NEVER share?"
""",
            "question": "Which key in a cryptocurrency wallet must be kept absolutely secret?",
            "choices": [
                "The public key - it's like your home address",
                "The private key - it's like the key to your house",
                "Both keys should be shared freely",
                "Neither key matters for security"
            ],
            "correct": 1,
            "feedback_correct": """
**Satoshi Sage**: "Perfect understanding! 

Your *private key* is like the key to your house - guard it with your life! Anyone who has it can access and control your crypto assets.

Your *public key* (or wallet address), on the other hand, is like your home address - you can share it freely so people can send you cryptocurrency.

Remember: *Not your keys, not your crypto!*
""",
            "feedback_incorrect": """
**Satoshi Sage**: "This is crucial - let me emphasize it clearly:

Your *PRIVATE KEY* must be kept secret - it's like the key to your house! Anyone with access to it can control your cryptocurrency.

Your *PUBLIC KEY* (wallet address) can be shared freely - it's like your home address where people can send you funds.

The golden rule: *Not your keys, not your crypto!*
""",
            "xp_reward": 30
        },
        {
            "id": "ch1_q3",
            "type": "choice",
            "npc": "guardian",
            "narrative": """
**Crypto Guardian** materializes from the shadows, their presence commanding respect.

"Before you can access that wallet, I must test your knowledge of security. Many have lost fortunes due to carelessness."

They hold up a glowing shield with various security measures displayed on it.

"Tell me, which of these is the BEST practice for keeping your crypto wallet secure?"
""",
            "question": "What is the most secure way to store cryptocurrency for long-term holding?",
            "choices": [
                "Keep it in an email with your password",
                "Write your private key on a piece of paper and store it safely offline",
                "Post it on social media so you don't forget it",
                "Share it with friends for backup"
            ],
            "correct": 1,
            "feedback_correct": """
**Crypto Guardian**: "Wise choice, young guardian! 

Storing your private key *offline* on paper (or a hardware wallet) is indeed the most secure method. This is called 'cold storage' - like keeping your valuables in a safe rather than carrying them in your pocket.

For long-term holding:
- ✅ Hardware wallets or paper wallets (cold storage)
- ✅ Never share your private key
- ✅ Use strong passwords and 2FA
- ✅ Be wary of phishing attempts

You've proven yourself worthy. The path to the lost wallet is now clear!"
""",
            "feedback_incorrect": """
**Crypto Guardian**: "HALT! That would be disastrous for your security!

The most secure method is *cold storage* - keeping your private key offline, written on paper or stored in a hardware wallet. Think of it like keeping your valuables in a bank vault, not in your back pocket on a busy street.

Security rules:
- ❌ Never share your private key online
- ❌ Never store it in email or cloud services
- ❌ Never post it on social media
- ✅ Keep it offline in a secure location

Remember this well before continuing your quest!"
""",
            "xp_reward": 35
        }
    ],
    "narrative_conclusion": """
🎉 **Chapter 1 Complete: The Lost Wallet** 🎉

**Satoshi Sage**: "You've done well, young apprentice! You now understand:
- The fundamentals of blockchain technology
- How cryptocurrency wallets work
- The importance of private key security

The mysterious wallet address is now accessible to you! You've found *100 BlockChain Coins* inside!

But your journey doesn't end here. There's a strange smart contract attached to these coins..."

**Quest Continues in Chapter 2: The Smart Contract Mystery**
""",
    "completion_xp": 50,
    "completion_badge": "wallet_wizard"
}

# Chapter 2: The Smart Contract Mystery
CHAPTER_2 = {
    "id": "chapter_2",
    "title": "The Smart Contract Mystery",
    "description": "You've found the wallet, but the coins are locked in a smart contract. Solve the contract's puzzles to unlock your treasure.",
    "narrative_intro": """
🔮 **Chapter 2: The Smart Contract Mystery** 🔮

Looking at your newly discovered wallet, you notice something strange. The 100 BlockChain Coins are locked! They can only be released by solving a mysterious smart contract.

**Vitalik Venture**, a clever blockchain trader, appears with a knowing grin.

"Ah, I see you've encountered your first smart contract. These are fascinating pieces of code that execute automatically when conditions are met. Let me help you understand them..."
""",
    "challenges": [
        {
            "id": "ch2_q1",
            "type": "choice",
            "npc": "rival",
            "narrative": """
**Vitalik Venture**: "So, you want to unlock those coins? First, prove you understand what a smart contract actually is."

He waves his hand, and holographic code appears in the air.

"Look closely. What makes smart contracts 'smart'?"
""",
            "question": "What is the key feature of a smart contract?",
            "choices": [
                "It requires manual approval from a bank for each transaction",
                "It automatically executes when predetermined conditions are met",
                "It needs constant human intervention to function",
                "It can only be used for simple payments"
            ],
            "correct": 1,
            "feedback_correct": """
**Vitalik Venture**: "Impressive! You've grasped the essence!

Smart contracts are *self-executing* - they automatically carry out their coded instructions when conditions are met. Think of them as vending machines: you put in money (meet the condition), and the machine automatically gives you a snack (executes the contract).

No intermediaries, no delays, no human intervention needed. Just code and logic!
""",
            "feedback_incorrect": """
**Vitalik Venture**: "Not quite, but let me illuminate this for you.

Smart contracts are *self-executing* programs that run automatically when specific conditions are met. Think of a vending machine - you insert money, it automatically gives you a product. No cashier needed!

That's the power of smart contracts:
- ✅ Automatic execution
- ✅ No intermediaries
- ✅ Trustless (code is law)
- ✅ Transparent and immutable

Now let's try again with this understanding..."
""",
            "xp_reward": 30
        },
        {
            "id": "ch2_q2",
            "type": "choice",
            "npc": "rival",
            "narrative": """
**Vitalik Venture**: "Good! Now, let's examine this contract more closely."

He points to a section of the glowing code.

"This smart contract is written in Solidity. But which blockchain platform are we most likely using?"
""",
            "question": "Which blockchain platform is most famous for running smart contracts with Solidity?",
            "choices": [
                "Bitcoin - the original cryptocurrency",
                "Ethereum - the world computer",
                "Traditional bank systems",
                "Email servers"
            ],
            "correct": 1,
            "feedback_correct": """
**Vitalik Venture**: "Exactly right! You're sharp!

*Ethereum* is the pioneer of smart contracts! While Bitcoin was revolutionary for digital currency, Ethereum expanded blockchain to become a 'world computer' - a decentralized platform for running any kind of application.

Solidity is Ethereum's programming language, specifically designed for writing smart contracts. This is why Ethereum is often called the foundation of Web3 and DeFi!
""",
            "feedback_incorrect": """
**Vitalik Venture**: "Close, but let me clarify!

*Ethereum* is the blockchain that popularized smart contracts! While Bitcoin revolutionized digital currency, Ethereum took it further by creating a platform for decentralized applications (dApps).

Key facts:
- Ethereum uses Solidity for smart contracts
- It's called the 'world computer'
- Powers most DeFi and NFT applications
- Enables programmable blockchain applications

Bitcoin, while groundbreaking, is primarily for transfers, not complex contracts."
""",
            "xp_reward": 35
        },
        {
            "id": "ch2_q3",
            "type": "choice",
            "npc": "rival",
            "narrative": """
**Vitalik Venture**: "Alright, final test! The contract is about to unlock your coins, but you need to understand gas fees."

He pulls out a glowing fuel canister.

"To execute this smart contract on Ethereum, you'll need to pay 'gas'. What exactly is gas in the Ethereum network?"
""",
            "question": "What are gas fees on the Ethereum network?",
            "choices": [
                "Fees paid to hackers to protect your transactions",
                "Fees paid to miners/validators for processing transactions",
                "Monthly subscription fees for using Ethereum",
                "Free service provided by Ethereum"
            ],
            "correct": 1,
            "feedback_correct": """
**Vitalik Venture**: "Perfect! You're ready to unlock your coins!

*Gas fees* are payments to miners/validators who process and validate your transactions on the blockchain. Think of it as paying for the computational power and energy needed to execute your smart contract.

Why gas fees exist:
- ⛽ Compensate network validators
- 🛡️ Prevent spam transactions
- ⚖️ Prioritize transactions (higher gas = faster processing)
- 💰 Vary based on network congestion

*The smart contract executes successfully! Your 100 coins are now unlocked!*

But wait... there's a message attached: 'These coins can grow in the DeFi realm...'
""",
            "feedback_incorrect": """
**Vitalik Venture**: "Hold on! Understanding gas is crucial!

*Gas fees* are payments to the miners/validators who process your transaction. They're providing computational power to execute your smart contract, and they deserve compensation for their work and electricity costs.

Gas fees:
- ⛽ Pay for computational resources
- 🛡️ Prevent network spam
- 💰 Fluctuate with demand
- ⚡ Higher gas = faster execution

This is not free, but it's what keeps the decentralized network running! Let me explain again..."
""",
            "xp_reward": 40
        }
    ],
    "narrative_conclusion": """
🎉 **Chapter 2 Complete: The Smart Contract Mystery** 🎉

**Vitalik Venture**: "Excellent work! You've unlocked the smart contract and freed your coins. You now understand:
- What smart contracts are and how they work
- The role of Ethereum in smart contract execution
- How gas fees power the network

Your 100 BlockChain Coins are now fully accessible! But that mysterious message mentioned 'DeFi'...

There's one more chapter in your quest..."

**Quest Continues in Chapter 3: The DeFi Treasure**
""",
    "completion_xp": 60,
    "completion_badge": "smart_scholar"
}

# Chapter 3: The DeFi Treasure
CHAPTER_3 = {
    "id": "chapter_3",
    "title": "The DeFi Treasure",
    "description": "Your coins can grow exponentially in the DeFi ecosystem. Learn about decentralized finance and maximize your treasure!",
    "narrative_intro": """
💎 **Chapter 3: The DeFi Treasure** 💎

Your 100 BlockChain Coins pulse with potential. A portal opens before you, leading to the mystical realm of DeFi - Decentralized Finance.

**DeFi Delilah**, an enthusiastic explorer, greets you with excitement!

"Welcome to DeFi! Here, your coins can work for you! No banks, no middlemen - just pure financial innovation. Let me show you this incredible world..."
""",
    "challenges": [
        {
            "id": "ch3_q1",
            "type": "choice",
            "npc": "explorer",
            "narrative": """
**DeFi Delilah**: "First things first - do you understand what DeFi actually means?"

She gestures to a vast landscape of interconnected protocols and platforms.

"This entire ecosystem operates without traditional financial institutions. Can you tell me what DeFi stands for and represents?"
""",
            "question": "What is DeFi (Decentralized Finance)?",
            "choices": [
                "A new type of cryptocurrency created by banks",
                "Financial services built on blockchain without traditional intermediaries",
                "A government program for digital currency",
                "A centralized banking system for crypto"
            ],
            "correct": 1,
            "feedback_correct": """
**DeFi Delilah**: "Yes! You understand perfectly!

*DeFi* (Decentralized Finance) revolutionizes traditional finance by using blockchain and smart contracts to provide financial services WITHOUT banks, brokers, or other middlemen!

Think about it:
- 🏦 Traditional: Bank holds your money, charges fees, approves loans
- 💎 DeFi: You control your money, smart contracts handle everything automatically

You can lend, borrow, trade, earn interest - all without needing permission from any institution!
""",
            "feedback_incorrect": """
**DeFi Delilah**: "Let me illuminate the DeFi world for you!

*DeFi* (Decentralized Finance) means financial services built on blockchain WITHOUT traditional intermediaries like banks!

Imagine:
- 🚫 No bank approving your loan
- 🚫 No broker taking trading fees  
- ✅ Smart contracts handle everything
- ✅ You maintain full control
- ✅ Open 24/7 to anyone worldwide

It's finance reimagined for the blockchain age!
""",
            "xp_reward": 35
        },
        {
            "id": "ch3_q2",
            "type": "choice",
            "npc": "explorer",
            "narrative": """
**DeFi Delilah**: "Excellent! Now, let's explore how you can make your coins grow."

She shows you three shimmering pools of different colors.

"These are liquidity pools - one of DeFi's core innovations. What do you think they do?"
""",
            "question": "What is a liquidity pool in DeFi?",
            "choices": [
                "A swimming pool for crypto miners",
                "A pool of tokens that users provide to enable trading, earning fees in return",
                "A storage facility for unused cryptocurrencies",
                "A government vault for crypto taxes"
            ],
            "correct": 1,
            "feedback_correct": """
**DeFi Delilah**: "Perfect understanding! You're becoming a DeFi expert!

*Liquidity pools* are the heart of DeFi! They work like this:

1. Users deposit token pairs (like ETH/USDC) into a pool
2. Traders use these pools to swap tokens
3. Liquidity providers earn fees from each trade
4. Everyone benefits - traders get liquidity, providers earn passive income!

It's like being the house in a casino, but decentralized and fair! You earn a share of every transaction made with your liquidity.
""",
            "feedback_incorrect": """
**DeFi Delilah**: "Great question! Let me explain this key DeFi concept!

*Liquidity pools* are collections of tokens locked in smart contracts that enable decentralized trading:

How it works:
1. 💰 You deposit token pairs (e.g., ETH + USDC)
2. 🔄 Traders swap tokens using your pool
3. 💵 You earn a fee from each trade
4. 📈 Your tokens can grow through fees

It's how DeFi enables trading without traditional market makers! You become the liquidity provider and earn passive income!
""",
            "xp_reward": 40
        },
        {
            "id": "ch3_q3",
            "type": "choice",
            "npc": "explorer",
            "narrative": """
**DeFi Delilah**: "You're doing amazing! Now for the final lesson - the concept that makes DeFi truly powerful."

She creates a glowing chain that connects multiple protocols.

"In DeFi, we can 'stack' different protocols together to maximize returns. But this comes with a critical consideration. Do you know what it is?"
""",
            "question": "What is the main risk when participating in DeFi protocols?",
            "choices": [
                "The government will confiscate your crypto",
                "Smart contract vulnerabilities and protocol risks",
                "You must physically go to a bank branch",
                "DeFi protocols have no risks at all"
            ],
            "correct": 1,
            "feedback_correct": """
**DeFi Delilah**: "Wise answer! You understand both the opportunities AND the risks!

*Smart contract vulnerabilities* are the primary risk in DeFi:

Risks to be aware of:
- 🐛 Code bugs can be exploited by hackers
- 💸 Impermanent loss in liquidity pools
- 📉 Protocol failures or 'rug pulls'
- ⚖️ Regulatory uncertainty

But with knowledge and caution:
- ✅ Use audited protocols
- ✅ Diversify across platforms
- ✅ Never invest more than you can afford to lose
- ✅ Stay informed about protocol updates

You've completed your quest with wisdom! Your 100 coins are now positioned to grow in the DeFi ecosystem, and you have the knowledge to navigate it safely!
""",
            "feedback_incorrect": """
**DeFi Delilah**: "Important lesson here! DeFi is powerful but not without risks!

The main risk is *smart contract vulnerabilities*:

Real risks include:
- 🐛 Bugs in code can be exploited
- 💸 Protocols can fail or be hacked
- 📉 'Rug pulls' by malicious developers
- ⚖️ Impermanent loss in liquidity pools

Smart DeFi participation means:
- ✅ Research protocols thoroughly
- ✅ Use well-audited platforms
- ✅ Diversify your investments
- ✅ Start small while learning

DeFi offers amazing opportunities, but understanding the risks is crucial for success!
""",
            "xp_reward": 45
        }
    ],
    "narrative_conclusion": """
🏆 **QUEST COMPLETE: The DeFi Treasure** 🏆

**All Mentors Appear Together**

**Satoshi Sage**: "You've journeyed far, young seeker!"

**Vitalik Venture**: "From understanding blockchain basics..."

**Crypto Guardian**: "...to securing your wallet properly..."

**DeFi Delilah**: "...and now mastering the DeFi realm!"

✨ **Your Blockchain Quest is Complete!** ✨

You now possess:
- 🎓 Deep understanding of blockchain technology
- 🔐 Knowledge of wallet security
- 📜 Mastery of smart contracts
- 💎 DeFi expertise

Your 100 BlockChain Coins have been deposited into your wallet, and you now have the knowledge to navigate the crypto world safely and effectively!

**Congratulations, Blockchain Master!**

*Ready to test your knowledge in real lessons? Head to the Learn section to continue your education!*
""",
    "completion_xp": 100,
    "completion_badge": "defi_explorer"
}

# All Adventures
ADVENTURES = {
    "chapter_1": CHAPTER_1,
    "chapter_2": CHAPTER_2,
    "chapter_3": CHAPTER_3
}

def get_adventure(chapter_id: str) -> Dict[str, Any]:
    """Get a specific adventure chapter by ID."""
    return ADVENTURES.get(chapter_id)

def get_all_adventures() -> List[Dict[str, Any]]:
    """Get all adventure chapters in order."""
    return [CHAPTER_1, CHAPTER_2, CHAPTER_3]

def get_npc(npc_id: str) -> Dict[str, Any]:
    """Get NPC character data for AI roleplay."""
    return NPCS.get(npc_id)
