"""
Learning content for ChainQuest Academy.
Contains lessons, modules, and quizzes about blockchain.
"""

from typing import Dict, List, Any

MODULES = [
    {
        "id": "blockchain",
        "title": "Blockchain Fundamentals",
        "description": "Learn the core concepts of blockchain technology",
        "icon": "cube",
        "color": "from-blue-500 to-cyan-500",
        "lessons": [
            {
                "id": "blockchain-1",
                "title": "What is Blockchain?",
                "duration": "5 min",
                "xp": 20,
                "content": """
# What is Blockchain?

A **blockchain** is a digital ledger of transactions that is duplicated and distributed across a network of computers.

## Key Characteristics

- **Decentralized**: No single entity controls the network
- **Immutable**: Once data is recorded, it cannot be changed
- **Transparent**: Anyone can verify transactions
- **Secure**: Protected by cryptography

## How It Works

1. A transaction is requested
2. The transaction is broadcast to a network of computers (nodes)
3. Nodes validate the transaction using algorithms
4. Verified transactions are combined into a block
5. The new block is added to the existing blockchain
6. The transaction is complete

## Real-World Analogy

Think of blockchain like a Google Doc that everyone can view and add to, but no one can edit or delete what's already there. Every change is recorded permanently.
                """,
                "quiz": [
                    {
                        "question": "What makes blockchain 'immutable'?",
                        "options": [
                            "It can be easily changed",
                            "Once data is recorded, it cannot be altered",
                            "Only admins can modify it",
                            "It deletes old data automatically"
                        ],
                        "correct": 1
                    },
                    {
                        "question": "What is a 'node' in blockchain?",
                        "options": [
                            "A type of cryptocurrency",
                            "A computer on the network that validates transactions",
                            "A digital wallet",
                            "A smart contract"
                        ],
                        "correct": 1
                    }
                ]
            },
            {
                "id": "blockchain-2",
                "title": "Blocks and Chains",
                "duration": "7 min",
                "xp": 20,
                "content": """
# Understanding Blocks and Chains

## What is a Block?

A block is a container for data. Each block contains:

- **Block Header**: Metadata about the block
- **Transaction Data**: The actual transactions
- **Hash**: A unique fingerprint of the block
- **Previous Hash**: Links to the prior block

## The Chain

Blocks are linked together using cryptographic hashes, forming a chain. This is where "blockchain" gets its name!

```
Block 1 ──→ Block 2 ──→ Block 3 ──→ Block 4
  │            │            │            │
 Hash 1 ← Prev Hash 2 ← Prev Hash 3 ← Prev Hash 4
```

## Why Hashes Matter

If anyone tries to change data in an old block:
1. The block's hash changes
2. This breaks the link to the next block
3. All subsequent blocks become invalid
4. The network rejects the tampering

This is why blockchain is considered tamper-proof!
                """,
                "quiz": [
                    {
                        "question": "What links blocks together in a blockchain?",
                        "options": [
                            "Serial numbers",
                            "Cryptographic hashes",
                            "Timestamps only",
                            "User signatures"
                        ],
                        "correct": 1
                    }
                ]
            },
            {
                "id": "blockchain-3",
                "title": "Consensus Mechanisms",
                "duration": "8 min",
                "xp": 20,
                "content": """
# Consensus Mechanisms

How do thousands of computers agree on what's true? Through **consensus mechanisms**!

## Proof of Work (PoW)

Used by Bitcoin:
- Miners compete to solve complex puzzles
- First to solve adds the next block
- Requires significant computing power
- Very energy-intensive

## Proof of Stake (PoS)

Used by Ethereum:
- Validators stake (lock up) cryptocurrency
- Random selection based on stake size
- Much more energy-efficient
- Stakers earn rewards

## Comparison

| Aspect | Proof of Work | Proof of Stake |
|--------|---------------|----------------|
| Energy | High | Low |
| Speed | Slower | Faster |
| Hardware | Specialized | Standard |
| Entry | Buy mining rigs | Stake crypto |

## Why Consensus Matters

Without consensus, different nodes might have different versions of the truth. Consensus ensures everyone agrees on the same blockchain history.
                """,
                "quiz": [
                    {
                        "question": "Which consensus mechanism does Ethereum currently use?",
                        "options": [
                            "Proof of Work",
                            "Proof of Stake",
                            "Proof of Authority",
                            "Proof of History"
                        ],
                        "correct": 1
                    },
                    {
                        "question": "What is the main advantage of Proof of Stake over Proof of Work?",
                        "options": [
                            "It's older and more tested",
                            "It's more energy-efficient",
                            "It requires more hardware",
                            "It's completely free to participate"
                        ],
                        "correct": 1
                    }
                ]
            }
        ]
    },
    {
        "id": "wallet",
        "title": "Crypto Wallets",
        "description": "Master the art of storing and managing cryptocurrency",
        "icon": "wallet",
        "color": "from-purple-500 to-pink-500",
        "lessons": [
            {
                "id": "wallet-1",
                "title": "Wallet Basics",
                "duration": "6 min",
                "xp": 20,
                "content": """
# Crypto Wallets Explained

A **crypto wallet** doesn't actually store your cryptocurrency. Instead, it stores your private keys - the passwords that prove you own your crypto.

## Public Key vs Private Key

Think of it like email:
- **Public Key** = Your email address (safe to share)
- **Private Key** = Your password (NEVER share!)

## Types of Wallets

### Hot Wallets (Connected to Internet)
- Mobile apps (Trust Wallet, MetaMask Mobile)
- Browser extensions (MetaMask, Coinbase Wallet)
- Desktop apps
- Exchange wallets

### Cold Wallets (Offline Storage)
- Hardware wallets (Ledger, Trezor)
- Paper wallets
- Air-gapped computers

## Security Rule #1

**Never share your private key or seed phrase!**

Anyone with your private key can steal ALL your crypto. No recovery possible.
                """,
                "quiz": [
                    {
                        "question": "What does a crypto wallet actually store?",
                        "options": [
                            "Your cryptocurrency coins",
                            "Your private keys",
                            "Your bank account info",
                            "Your email address"
                        ],
                        "correct": 1
                    },
                    {
                        "question": "Which type of wallet is generally considered more secure?",
                        "options": [
                            "Hot wallet",
                            "Cold wallet",
                            "Exchange wallet",
                            "Mobile wallet"
                        ],
                        "correct": 1
                    }
                ]
            },
            {
                "id": "wallet-2",
                "title": "Seed Phrases",
                "duration": "5 min",
                "xp": 20,
                "content": """
# Understanding Seed Phrases

A **seed phrase** (also called recovery phrase or mnemonic) is a list of 12-24 words that can restore your entire wallet.

## Example Seed Phrase
```
apple banana cherry dog elephant 
frog grape house igloo jacket 
kite lemon (DO NOT USE THIS!)
```

## Why Seed Phrases Matter

- One seed phrase can recover ALL wallets and assets
- Generated when you first create a wallet
- Words come from a standard list (BIP-39)
- Order matters!

## Storage Best Practices

✅ **DO:**
- Write it on paper
- Store in a fireproof safe
- Consider metal backup plates
- Make multiple copies in secure locations

❌ **DON'T:**
- Store digitally (screenshots, notes apps)
- Email it to yourself
- Store in cloud services
- Share with anyone ever

## If Someone Gets Your Seed Phrase

They can:
- Access all your wallets
- Steal all your crypto
- You cannot stop them
- There is no "customer support"
                """,
                "quiz": [
                    {
                        "question": "How should you store your seed phrase?",
                        "options": [
                            "In a note on your phone",
                            "Written on paper in a secure location",
                            "In an email to yourself",
                            "On a cloud storage service"
                        ],
                        "correct": 1
                    }
                ]
            },
            {
                "id": "wallet-3",
                "title": "Making Transactions",
                "duration": "7 min",
                "xp": 20,
                "content": """
# How Crypto Transactions Work

## Anatomy of a Transaction

1. **From Address**: Your wallet's public address
2. **To Address**: Recipient's public address
3. **Amount**: How much crypto to send
4. **Gas Fee**: Payment for network processing
5. **Nonce**: Transaction counter (prevents duplicates)

## Transaction Lifecycle

```
Create → Sign → Broadcast → Pending → Confirmed
```

1. **Create**: You specify recipient and amount
2. **Sign**: Your private key authorizes it
3. **Broadcast**: Sent to the network
4. **Pending**: Waiting in mempool
5. **Confirmed**: Included in a block

## Confirmations

- 1 confirmation = included in 1 block
- More confirmations = more secure
- Bitcoin: 6 confirmations recommended
- Ethereum: 12-20 confirmations typical

## Common Mistakes to Avoid

⚠️ **Wrong address**: Crypto sent to wrong address is usually unrecoverable
⚠️ **Wrong network**: Sending ETH on wrong network can lose funds
⚠️ **Low gas**: Transaction may get stuck or fail
                """,
                "quiz": [
                    {
                        "question": "What happens if you send crypto to the wrong address?",
                        "options": [
                            "It automatically returns after 24 hours",
                            "Customer support can reverse it",
                            "It's usually unrecoverable",
                            "The blockchain rejects invalid addresses"
                        ],
                        "correct": 2
                    },
                    {
                        "question": "What is a 'gas fee'?",
                        "options": [
                            "A tax on cryptocurrency",
                            "Payment for network processing",
                            "A fee charged by your wallet",
                            "The cost of electricity"
                        ],
                        "correct": 1
                    }
                ]
            }
        ]
    },
    {
        "id": "smart-contract",
        "title": "Smart Contracts",
        "description": "Discover self-executing code on the blockchain",
        "icon": "code",
        "color": "from-green-500 to-emerald-500",
        "lessons": [
            {
                "id": "smart-contract-1",
                "title": "Smart Contract Basics",
                "duration": "6 min",
                "xp": 20,
                "content": """
# What Are Smart Contracts?

**Smart contracts** are self-executing programs stored on a blockchain that automatically run when predetermined conditions are met.

## Real-World Analogy

Think of a vending machine:
1. You insert money (condition met)
2. You select an item (trigger action)
3. Machine dispenses item (automatic execution)
4. No human needed!

Smart contracts work the same way, but for digital agreements.

## Key Properties

- **Automatic**: Execute without intermediaries
- **Immutable**: Cannot be changed once deployed
- **Transparent**: Code is visible on blockchain
- **Trustless**: No need to trust counterparties

## Simple Example

```
IF Alice sends 1 ETH to contract
AND current date > January 1, 2025
THEN send 1 ETH to Bob
ELSE hold the ETH
```

## What They Enable

- Token creation (cryptocurrencies)
- NFT minting and trading
- Decentralized exchanges
- Lending protocols
- DAOs (Decentralized Organizations)
                """,
                "quiz": [
                    {
                        "question": "What triggers a smart contract to execute?",
                        "options": [
                            "Manual approval from developers",
                            "Predetermined conditions being met",
                            "Government authorization",
                            "Bank verification"
                        ],
                        "correct": 1
                    }
                ]
            },
            {
                "id": "smart-contract-2",
                "title": "Token Standards",
                "duration": "8 min",
                "xp": 20,
                "content": """
# Token Standards Explained

Token standards are templates that define how tokens behave on a blockchain.

## ERC-20: Fungible Tokens

The most common token standard for cryptocurrencies.

**Fungible** = Each token is identical and interchangeable

Examples:
- USDC, USDT (stablecoins)
- LINK (Chainlink)
- UNI (Uniswap)

Key Functions:
- `transfer()` - Send tokens
- `balanceOf()` - Check balance
- `approve()` - Allow spending

## ERC-721: Non-Fungible Tokens (NFTs)

Each token is unique with a distinct ID.

**Non-Fungible** = Each token is one-of-a-kind

Examples:
- CryptoPunks
- Bored Ape Yacht Club
- Art NFTs

Key Functions:
- `ownerOf()` - Who owns this NFT?
- `transferFrom()` - Transfer ownership
- `tokenURI()` - Get metadata

## ERC-1155: Multi-Token Standard

Best of both worlds - can handle both fungible and non-fungible tokens in one contract.

Used for:
- Gaming items
- Collectible series
- Batch transfers
                """,
                "quiz": [
                    {
                        "question": "Which token standard is used for NFTs?",
                        "options": [
                            "ERC-20",
                            "ERC-721",
                            "ERC-1155",
                            "BTC-20"
                        ],
                        "correct": 1
                    },
                    {
                        "question": "What does 'fungible' mean in crypto?",
                        "options": [
                            "Unique and one-of-a-kind",
                            "Identical and interchangeable",
                            "Stored on a fungus",
                            "Created by a specific person"
                        ],
                        "correct": 1
                    }
                ]
            },
            {
                "id": "smart-contract-3",
                "title": "Smart Contract Security",
                "duration": "7 min",
                "xp": 20,
                "content": """
# Smart Contract Security

Smart contracts handle real value, so security is critical!

## Common Vulnerabilities

### 1. Reentrancy Attack
A malicious contract calls back into the vulnerable contract before the first execution completes.

Famous Example: The DAO hack (2016) - $60M stolen

### 2. Integer Overflow/Underflow
Numbers wrap around when they exceed maximum/minimum values.

### 3. Access Control Issues
Functions that should be restricted are publicly accessible.

### 4. Oracle Manipulation
External data sources can be manipulated to exploit contracts.

## Security Best Practices

✅ **For Users:**
- Only interact with audited contracts
- Check if code is verified on block explorer
- Start with small amounts
- Research the team behind projects

✅ **For Developers:**
- Get professional audits
- Use established libraries (OpenZeppelin)
- Implement proper access controls
- Test extensively before deployment

## Reading Audit Reports

Look for:
- Severity ratings (Critical, High, Medium, Low)
- Whether issues were fixed
- Who performed the audit
- When it was conducted
                """,
                "quiz": [
                    {
                        "question": "What was The DAO hack caused by?",
                        "options": [
                            "A stolen password",
                            "A reentrancy vulnerability",
                            "A server hack",
                            "Social engineering"
                        ],
                        "correct": 1
                    }
                ]
            }
        ]
    },
    {
        "id": "defi",
        "title": "DeFi Essentials",
        "description": "Explore decentralized finance protocols and strategies",
        "icon": "chart",
        "color": "from-orange-500 to-red-500",
        "lessons": [
            {
                "id": "defi-1",
                "title": "What is DeFi?",
                "duration": "6 min",
                "xp": 20,
                "content": """
# Decentralized Finance (DeFi)

**DeFi** refers to financial services built on blockchain that operate without traditional intermediaries like banks.

## DeFi vs Traditional Finance

| Traditional Finance | DeFi |
|---------------------|------|
| Banks control your money | You control your money |
| Limited hours | 24/7/365 access |
| Requires approval | Permissionless |
| Slow settlements | Fast transactions |
| Geographic restrictions | Global access |

## Core DeFi Services

1. **Lending & Borrowing**
   - Deposit crypto to earn interest
   - Borrow against your holdings

2. **Decentralized Exchanges (DEXs)**
   - Trade tokens without a central authority
   - No KYC required

3. **Yield Farming**
   - Provide liquidity for rewards
   - Optimize returns across protocols

4. **Staking**
   - Lock tokens to earn rewards
   - Help secure the network

## Key Metrics

- **TVL** (Total Value Locked): Money deposited in DeFi
- **APY** (Annual Percentage Yield): Expected yearly return
- **Liquidity**: How easily you can buy/sell
                """,
                "quiz": [
                    {
                        "question": "What does TVL stand for in DeFi?",
                        "options": [
                            "Total Virtual Ledger",
                            "Token Validation Layer",
                            "Total Value Locked",
                            "Trading Volume Limit"
                        ],
                        "correct": 2
                    }
                ]
            },
            {
                "id": "defi-2",
                "title": "DEXs and AMMs",
                "duration": "8 min",
                "xp": 20,
                "content": """
# Decentralized Exchanges

## How DEXs Work

Unlike centralized exchanges (Coinbase, Binance), DEXs:
- Don't hold your funds
- Use smart contracts for trades
- Allow direct wallet-to-wallet swaps

## Automated Market Makers (AMMs)

Traditional exchanges use order books. DEXs use **liquidity pools**.

### The Liquidity Pool Model

```
Pool: ETH/USDC
├── 100 ETH
└── 200,000 USDC
```

Price is determined by the ratio of assets!

### Constant Product Formula
```
x × y = k

ETH × USDC = constant
100 × 200,000 = 20,000,000
```

When you buy ETH:
- ETH decreases in pool
- USDC increases in pool
- Price of ETH goes up

## Popular DEXs

- **Uniswap**: Largest on Ethereum
- **SushiSwap**: Fork of Uniswap with extras
- **Curve**: Optimized for stablecoins
- **PancakeSwap**: Popular on BNB Chain

## Providing Liquidity

You can deposit tokens into pools and earn:
- Trading fees from swaps
- Sometimes additional token rewards

⚠️ **Impermanent Loss**: Your position can lose value compared to just holding
                """,
                "quiz": [
                    {
                        "question": "What determines prices on an AMM?",
                        "options": [
                            "Order books",
                            "The ratio of assets in liquidity pools",
                            "A central authority",
                            "Daily auctions"
                        ],
                        "correct": 1
                    },
                    {
                        "question": "What is impermanent loss?",
                        "options": [
                            "Losing your password",
                            "Value loss compared to just holding the assets",
                            "Temporary network downtime",
                            "A type of hack"
                        ],
                        "correct": 1
                    }
                ]
            },
            {
                "id": "defi-3",
                "title": "DeFi Risks",
                "duration": "7 min",
                "xp": 20,
                "content": """
# Understanding DeFi Risks

DeFi offers opportunity but comes with significant risks.

## Smart Contract Risk

- Bugs can lead to loss of funds
- Even audited contracts can have issues
- New protocols are especially risky

**Mitigation:**
- Stick to battle-tested protocols
- Check audit reports
- Start with small amounts

## Impermanent Loss

When providing liquidity, price changes can result in less value than simply holding.

**Example:**
- You deposit 1 ETH + 2000 USDC
- ETH price doubles
- You might end up with 0.7 ETH + 2800 USDC
- Worth less than if you just held!

## Rug Pulls

Malicious teams who:
- Launch a token/protocol
- Attract deposits
- Drain all funds and disappear

**Warning Signs:**
- Anonymous team
- No audit
- Too-good-to-be-true APYs
- Locked liquidity with short timeframe

## Oracle Manipulation

Price feeds can be manipulated to exploit protocols.

## Regulatory Risk

- DeFi regulations are evolving
- Some jurisdictions are cracking down
- Tax implications can be complex

## Risk Management Tips

1. Never invest more than you can lose
2. Diversify across protocols
3. Use well-established platforms
4. Understand what you're investing in
5. Keep funds in cold storage when possible
                """,
                "quiz": [
                    {
                        "question": "What is a 'rug pull' in DeFi?",
                        "options": [
                            "A type of trading strategy",
                            "When developers drain funds and disappear",
                            "A legitimate exit strategy",
                            "A network upgrade"
                        ],
                        "correct": 1
                    },
                    {
                        "question": "Which is NOT a warning sign of a potential scam?",
                        "options": [
                            "Anonymous team",
                            "No audit",
                            "Professional security audit from reputable firm",
                            "Extremely high APY promises"
                        ],
                        "correct": 2
                    }
                ]
            }
        ]
    }
]


def get_all_modules() -> List[Dict[str, Any]]:
    """Get all learning modules."""
    return MODULES


def get_module(module_id: str) -> Dict[str, Any]:
    """Get a specific module by ID."""
    for module in MODULES:
        if module["id"] == module_id:
            return module
    return None


def get_lesson(lesson_id: str) -> Dict[str, Any]:
    """Get a specific lesson by ID."""
    for module in MODULES:
        for lesson in module["lessons"]:
            if lesson["id"] == lesson_id:
                return {**lesson, "module_id": module["id"], "module_title": module["title"]}
    return None


def get_all_lessons() -> List[Dict[str, Any]]:
    """Get all lessons across all modules."""
    lessons = []
    for module in MODULES:
        for lesson in module["lessons"]:
            lessons.append({
                **lesson,
                "module_id": module["id"],
                "module_title": module["title"]
            })
    return lessons
