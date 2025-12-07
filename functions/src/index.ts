/**
 * ChainQuest Academy - Firebase Functions Backend
 * Converted from Python FastAPI to Node.js/TypeScript
 */

import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as jwt from "jsonwebtoken";

// Define secrets (primary and backup API keys)
const geminiApiKey = defineSecret("GEMINI_API_KEY");
const geminiApiKeyBackup = defineSecret("GEMINI_API_KEY_BACKUP");
const googleClientId = defineSecret("GOOGLE_CLIENT_ID");
const googleClientSecret = defineSecret("GOOGLE_CLIENT_SECRET");
const jwtSecret = defineSecret("JWT_SECRET");

// OAuth configuration
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
const FRONTEND_URL = "https://chainquest-academy.vercel.app";
const OAUTH_REDIRECT_URI = "https://us-central1-chainquest-academy.cloudfunctions.net/api/auth/google/callback";

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Express app
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// ============================================
// LESSON DATA (from lessons.py)
// ============================================

const MODULES = [
  {
    id: "blockchain",
    title: "Blockchain Fundamentals",
    description: "Learn the core concepts of blockchain technology",
    icon: "cube",
    color: "from-blue-500 to-cyan-500",
    lessons: [
      {
        id: "blockchain-1",
        title: "What is Blockchain?",
        duration: "5 min",
        xp: 20,
        content: `
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
        `,
        quiz: [
          {
            question: "What makes blockchain 'immutable'?",
            options: [
              "It can be easily changed",
              "Once data is recorded, it cannot be altered",
              "Only admins can modify it",
              "It deletes old data automatically",
            ],
            correct: 1,
          },
          {
            question: "What is a 'node' in blockchain?",
            options: [
              "A type of cryptocurrency",
              "A computer on the network that validates transactions",
              "A digital wallet",
              "A smart contract",
            ],
            correct: 1,
          },
        ],
      },
      {
        id: "blockchain-2",
        title: "Blocks and Chains",
        duration: "7 min",
        xp: 20,
        content: `
# Understanding Blocks and Chains

## What is a Block?

A block is a container for data. Each block contains:

- **Block Header**: Metadata about the block
- **Transaction Data**: The actual transactions
- **Hash**: A unique fingerprint of the block
- **Previous Hash**: Links to the prior block

## The Chain

Blocks are linked together using cryptographic hashes, forming a chain.

## Why Hashes Matter

If anyone tries to change data in an old block:
1. The block's hash changes
2. This breaks the link to the next block
3. All subsequent blocks become invalid
4. The network rejects the tampering
        `,
        quiz: [
          {
            question: "What links blocks together in a blockchain?",
            options: [
              "Serial numbers",
              "Cryptographic hashes",
              "Timestamps only",
              "User signatures",
            ],
            correct: 1,
          },
        ],
      },
      {
        id: "blockchain-3",
        title: "Consensus Mechanisms",
        duration: "8 min",
        xp: 20,
        content: `
# Consensus Mechanisms

How do thousands of computers agree on what's true? Through **consensus mechanisms**!

## Proof of Work (PoW)
- Miners compete to solve complex puzzles
- First to solve adds the next block
- Very energy-intensive

## Proof of Stake (PoS)
- Validators stake cryptocurrency
- Much more energy-efficient
- Stakers earn rewards
        `,
        quiz: [
          {
            question: "Which consensus mechanism does Ethereum currently use?",
            options: [
              "Proof of Work",
              "Proof of Stake",
              "Proof of Authority",
              "Proof of History",
            ],
            correct: 1,
          },
        ],
      },
    ],
  },
  {
    id: "wallet",
    title: "Crypto Wallets",
    description: "Master the art of storing and managing cryptocurrency",
    icon: "wallet",
    color: "from-purple-500 to-pink-500",
    lessons: [
      {
        id: "wallet-1",
        title: "Wallet Basics",
        duration: "6 min",
        xp: 20,
        content: `
# Crypto Wallets Explained

A **crypto wallet** stores your private keys - the passwords that prove you own your crypto.

## Public Key vs Private Key

- **Public Key** = Your email address (safe to share)
- **Private Key** = Your password (NEVER share!)

## Types of Wallets

### Hot Wallets (Connected to Internet)
- Mobile apps (Trust Wallet, MetaMask Mobile)
- Browser extensions (MetaMask)

### Cold Wallets (Offline Storage)
- Hardware wallets (Ledger, Trezor)
- Paper wallets
        `,
        quiz: [
          {
            question: "What does a crypto wallet actually store?",
            options: [
              "Your cryptocurrency coins",
              "Your private keys",
              "Your bank account info",
              "Your email address",
            ],
            correct: 1,
          },
        ],
      },
    ],
  },
  {
    id: "smart-contract",
    title: "Smart Contracts",
    description: "Discover self-executing code on the blockchain",
    icon: "code",
    color: "from-green-500 to-emerald-500",
    lessons: [
      {
        id: "smart-contract-1",
        title: "Smart Contract Basics",
        duration: "6 min",
        xp: 20,
        content: `
# What Are Smart Contracts?

**Smart contracts** are self-executing programs stored on a blockchain that automatically run when predetermined conditions are met.

## Key Properties

- **Automatic**: Execute without intermediaries
- **Immutable**: Cannot be changed once deployed
- **Transparent**: Code is visible on blockchain
- **Trustless**: No need to trust counterparties
        `,
        quiz: [
          {
            question: "What triggers a smart contract to execute?",
            options: [
              "Manual approval from developers",
              "Predetermined conditions being met",
              "Government authorization",
              "Bank verification",
            ],
            correct: 1,
          },
        ],
      },
    ],
  },
  {
    id: "defi",
    title: "DeFi Essentials",
    description: "Explore decentralized finance protocols and strategies",
    icon: "chart",
    color: "from-orange-500 to-red-500",
    lessons: [
      {
        id: "defi-1",
        title: "What is DeFi?",
        duration: "6 min",
        xp: 20,
        content: `
# Decentralized Finance (DeFi)

**DeFi** refers to financial services built on blockchain that operate without traditional intermediaries like banks.

## Core DeFi Services

1. **Lending & Borrowing** - Deposit crypto to earn interest
2. **Decentralized Exchanges (DEXs)** - Trade tokens without a central authority
3. **Yield Farming** - Provide liquidity for rewards
4. **Staking** - Lock tokens to earn rewards
        `,
        quiz: [
          {
            question: "What does TVL stand for in DeFi?",
            options: [
              "Total Virtual Ledger",
              "Token Validation Layer",
              "Total Value Locked",
              "Trading Volume Limit",
            ],
            correct: 2,
          },
        ],
      },
    ],
  },
];

// ============================================
// GEMINI AI INTEGRATION
// ============================================

const getGeminiModel = (useBackup = false) => {
  const apiKey = useBackup 
    ? process.env.GEMINI_API_KEY_BACKUP 
    : process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error(useBackup ? "GEMINI_API_KEY_BACKUP not configured" : "GEMINI_API_KEY not configured");
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
};

// Helper function to generate content with fallback to backup key
const generateWithFallback = async (prompt: string): Promise<string> => {
  // Try primary key first
  try {
    const model = getGeminiModel(false);
    if (model) {
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Primary API key failed, trying backup:", errorMessage);
  }

  // Try backup key
  try {
    const backupModel = getGeminiModel(true);
    if (backupModel) {
      const result = await backupModel.generateContent(prompt);
      return result.response.text();
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Backup API key also failed:", errorMessage);
    throw new Error("Both API keys failed");
  }

  throw new Error("No API keys configured");
};

const BLOCKCHAIN_SYSTEM_PROMPT = `You are ChainQuest Academy's AI Teaching Assistant powered by SpoonOS.

You are an expert blockchain educator who helps students learn about:
- Blockchain fundamentals (consensus, cryptography, distributed systems)
- Cryptocurrency and tokenomics
- Smart contracts and Solidity
- DeFi protocols and strategies
- NFTs and digital ownership
- Web3 development

Teaching Style:
- Use simple analogies for complex concepts
- Provide real-world examples
- Be encouraging and supportive
- Keep responses concise but informative
- Use emojis sparingly to keep it engaging

Always stay on topic about blockchain and Web3. If asked about unrelated topics, gently redirect to blockchain education.`;

// ============================================
// ADVENTURES DATA
// ============================================

const ADVENTURES = [
  {
    id: "chapter_1",
    title: "The Lost Wallet",
    description: "Your journey begins when you discover a mysterious wallet address. Learn the fundamentals of blockchain and wallets to recover it.",
    icon: "🔑",
    color: "from-blue-500 to-cyan-500",
    challenges: [
      {
        id: "ch1_q1",
        question: "What is the fundamental feature that makes blockchain secure and trustworthy?",
        choices: [
          "It's controlled by a single powerful company",
          "It's a decentralized, distributed ledger",
          "It uses the fastest servers in the world",
          "It requires government approval"
        ],
        correct: 1,
        xp_reward: 25
      },
      {
        id: "ch1_q2",
        question: "Which key in a cryptocurrency wallet must be kept absolutely secret?",
        choices: [
          "The public key",
          "The private key",
          "Both keys should be shared",
          "Neither key matters"
        ],
        correct: 1,
        xp_reward: 30
      },
      {
        id: "ch1_q3",
        question: "What is the most secure way to store cryptocurrency for long-term holding?",
        choices: [
          "Keep it in an email",
          "Hardware wallet or paper wallet (cold storage)",
          "Post it on social media",
          "Share it with friends"
        ],
        correct: 1,
        xp_reward: 35
      }
    ],
    completion_xp: 50,
    completion_badge: { id: "wallet_wizard", name: "Wallet Wizard", icon: "🔐", description: "Mastered wallet security", xp_reward: 50 }
  },
  {
    id: "chapter_2",
    title: "The Smart Contract Mystery",
    description: "The coins are locked in a smart contract. Solve the contract's puzzles to unlock your treasure.",
    icon: "📜",
    color: "from-purple-500 to-pink-500",
    challenges: [
      {
        id: "ch2_q1",
        question: "What is a smart contract?",
        choices: [
          "A legal document for crypto",
          "Self-executing code on the blockchain",
          "A type of cryptocurrency",
          "A wallet feature"
        ],
        correct: 1,
        xp_reward: 30
      },
      {
        id: "ch2_q2",
        question: "Once deployed, can a smart contract be modified?",
        choices: [
          "Yes, anytime by anyone",
          "No, they are immutable once deployed",
          "Only by the government",
          "Only on weekends"
        ],
        correct: 1,
        xp_reward: 35
      },
      {
        id: "ch2_q3",
        question: "What is 'gas' in Ethereum?",
        choices: [
          "Fuel for mining machines",
          "The fee paid to execute transactions",
          "A type of token",
          "A wallet feature"
        ],
        correct: 1,
        xp_reward: 40
      }
    ],
    completion_xp: 75,
    completion_badge: { id: "contract_master", name: "Contract Master", icon: "📜", description: "Mastered smart contracts", xp_reward: 75 }
  },
  {
    id: "chapter_3",
    title: "The DeFi Treasure",
    description: "Navigate the world of DeFi to multiply your treasure and become a true blockchain master.",
    icon: "💎",
    color: "from-green-500 to-emerald-500",
    challenges: [
      {
        id: "ch3_q1",
        question: "What does DeFi stand for?",
        choices: [
          "Digital Finance",
          "Decentralized Finance",
          "Defined Finance",
          "Distributed Finance"
        ],
        correct: 1,
        xp_reward: 35
      },
      {
        id: "ch3_q2",
        question: "What is a liquidity pool?",
        choices: [
          "A swimming pool for crypto",
          "Tokens locked in a smart contract for trading",
          "A type of wallet",
          "A mining technique"
        ],
        correct: 1,
        xp_reward: 40
      },
      {
        id: "ch3_q3",
        question: "What is 'yield farming'?",
        choices: [
          "Growing vegetables with crypto",
          "Earning rewards by providing liquidity",
          "Mining cryptocurrency",
          "Buying NFTs"
        ],
        correct: 1,
        xp_reward: 45
      }
    ],
    completion_xp: 100,
    completion_badge: { id: "defi_explorer", name: "DeFi Explorer", icon: "💎", description: "Conquered the DeFi realm", xp_reward: 100 }
  }
];

// Adventure user progress storage
const adventureProgress: { [userId: string]: { [chapterId: string]: { completed_challenges: string[]; completed: boolean } } } = {};

// ============================================
// USER DATA STORE (in-memory for demo)
// ============================================

interface UserData {
  id: string;
  xp: number;
  level: number;
  completedLessons: string[];
  badges: { id: string; name: string; description: string; icon: string; xp_reward: number }[];
  streakDays: number;
  lastActive: string;
  quizScores: Record<string, { score: number; total: number; date: string }>;
  chatCount: number;
  correctAnswers: number;
}

const users: { [key: string]: UserData } = {};

const getOrCreateUser = (userId: string): UserData => {
  if (!users[userId]) {
    users[userId] = {
      id: userId,
      xp: 0,
      level: 1,
      completedLessons: [],
      badges: [],
      streakDays: 0,
      lastActive: new Date().toISOString(),
      quizScores: {},
      chatCount: 0,
      correctAnswers: 0,
    };
  }
  return users[userId];
};

// ============================================
// API ROUTES
// ============================================

// Root route
app.get("/", (req, res) => {
  res.json({
    name: "ChainQuest Academy API",
    version: "1.0.0",
    status: "running",
    endpoints: ["/health", "/modules", "/lessons/:id", "/chat", "/quiz/submit"],
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "ChainQuest Academy API",
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// OAUTH ENDPOINTS
// ============================================

// Helper function to create JWT token
const createJwtToken = (payload: object): string => {
  const secret = jwtSecret.value() || "fallback-secret-key";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

// Helper function to verify JWT token
const verifyJwtToken = (token: string): jwt.JwtPayload | null => {
  try {
    const secret = jwtSecret.value() || "fallback-secret-key";
    return jwt.verify(token, secret) as jwt.JwtPayload;
  } catch {
    return null;
  }
};

// Initiate Google OAuth flow
app.get("/auth/google", (req, res) => {
  const clientId = googleClientId.value();
  
  if (!clientId) {
    res.status(500).json({ error: "OAuth not configured" });
    return;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: OAUTH_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;
  res.json({ auth_url: authUrl });
});

// Handle Google OAuth callback (POST from frontend)
app.post("/auth/google/callback", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400).json({ error: "No authorization code provided" });
    return;
  }

  try {
    const clientId = googleClientId.value();
    const clientSecret = googleClientSecret.value();

    if (!clientId || !clientSecret) {
      res.status(500).json({ error: "OAuth not configured" });
      return;
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: OAUTH_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error("Token exchange failed:", tokenData);
      res.status(400).json({ error: "Failed to exchange code for token" });
      return;
    }

    // Get user info from Google
    const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userInfo = await userInfoResponse.json();

    // Create JWT token with user info
    const jwtPayload = {
      sub: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    };

    const accessToken = createJwtToken(jwtPayload);

    res.json({
      access_token: accessToken,
      token_type: "bearer",
      user: {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      },
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

// Handle Google OAuth callback (GET redirect from Google)
app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code as string;
  const error = req.query.error as string;

  if (error) {
    res.redirect(`${FRONTEND_URL}/login?error=${encodeURIComponent(error)}`);
    return;
  }

  if (!code) {
    res.redirect(`${FRONTEND_URL}/login?error=no_code`);
    return;
  }

  // Redirect to frontend with the code
  res.redirect(`${FRONTEND_URL}/auth/callback?code=${encodeURIComponent(code)}`);
});

// Get current user from JWT
app.get("/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyJwtToken(token);

  if (!payload) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  res.json({
    user: {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    },
  });
});

// Logout endpoint
app.post("/auth/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

// Get all modules
app.get("/modules", (req, res) => {
  const modulesWithProgress = MODULES.map((module) => ({
    ...module,
    progress: {
      completed: 0,
      total: module.lessons.length,
      percentage: 0,
    },
  }));
  res.json({ modules: modulesWithProgress });
});

// Get single module
app.get("/modules/:moduleId", (req, res) => {
  const module = MODULES.find((m) => m.id === req.params.moduleId);
  if (!module) {
    res.status(404).json({ error: "Module not found" });
    return;
  }
  res.json(module);
});

// Get lesson
app.get("/lessons/:lessonId", (req, res) => {
  for (const module of MODULES) {
    const lesson = module.lessons.find((l) => l.id === req.params.lessonId);
    if (lesson) {
      res.json({ ...lesson, module_id: module.id });
      return;
    }
  }
  res.status(404).json({ error: "Lesson not found" });
});

// Get user stats
app.get("/user/stats", (req, res) => {
  const userId = (req.query.user_id as string) || "default";
  const user = getOrCreateUser(userId);

  const xpNeeded = user.level * 100;
  const currentXpInLevel = user.xp % 100;

  // All possible badges
  const allBadges = [
    { id: "first_lesson", name: "First Steps", description: "Complete your first lesson", icon: "🎯", xp_reward: 10 },
    { id: "blockchain_master", name: "Blockchain Master", description: "Complete all blockchain lessons", icon: "⛓️", xp_reward: 50 },
    { id: "quiz_ace", name: "Quiz Ace", description: "Score 100% on any quiz", icon: "🏆", xp_reward: 25 },
    { id: "curious_mind", name: "Curious Mind", description: "Ask 10 questions to AI tutor", icon: "🧠", xp_reward: 20 },
    { id: "level_5", name: "Rising Star", description: "Reach level 5", icon: "⭐", xp_reward: 30 },
  ];

  res.json({
    stats: {
      xp: user.xp,
      level: user.level,
      level_progress: {
        current: currentXpInLevel,
        needed: xpNeeded,
        percentage: Math.round((currentXpInLevel / xpNeeded) * 100),
      },
      badges: user.badges,
      completed_lessons: user.completedLessons.length,
      quiz_scores: user.quizScores || {},
      ai_chat_count: user.chatCount || 0,
      correct_answers: user.correctAnswers || 0,
      all_badges: allBadges,
    },
  });
});

// Complete lesson
app.post("/lessons/:lessonId/complete", (req, res) => {
  const userId = req.body.user_id || "default";
  const user = getOrCreateUser(userId);
  const lessonId = req.params.lessonId;

  // Find lesson XP
  let xpEarned = 20;
  for (const module of MODULES) {
    const lesson = module.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      xpEarned = lesson.xp;
      break;
    }
  }

  if (!user.completedLessons.includes(lessonId)) {
    user.completedLessons.push(lessonId);
    user.xp += xpEarned;
    user.level = Math.floor(user.xp / 100) + 1;
  }

  res.json({
    success: true,
    xp_earned: xpEarned,
    total_xp: user.xp,
    level: user.level,
  });
});

// Submit quiz
app.post("/quiz/submit", (req, res) => {
  const { lessonId, answers, userId = "default" } = req.body;

  // Find quiz
  let quiz: Array<{ question: string; options: string[]; correct: number }> = [];
  for (const module of MODULES) {
    const lesson = module.lessons.find((l) => l.id === lessonId);
    if (lesson && lesson.quiz) {
      quiz = lesson.quiz;
      break;
    }
  }

  if (quiz.length === 0) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }

  // Grade quiz
  let correct = 0;
  const results = quiz.map((q, i) => {
    const isCorrect = answers[i] === q.correct;
    if (isCorrect) correct++;
    return {
      question: q.question,
      correct: isCorrect,
      correctAnswer: q.correct,
      userAnswer: answers[i],
    };
  });

  const score = Math.round((correct / quiz.length) * 100);
  const passed = score >= 70;

  // Award XP if passed
  const user = getOrCreateUser(userId);
  let xpEarned = 0;
  if (passed) {
    xpEarned = 10;
    user.xp += xpEarned;
    user.level = Math.floor(user.xp / 100) + 1;
  }

  res.json({
    score,
    passed,
    correct,
    total: quiz.length,
    results,
    xp_earned: xpEarned,
  });
});

// ============================================
// ADVENTURES ENDPOINTS
// ============================================

// Get all adventures
app.get("/adventures", (req, res) => {
  const userId = (req.query.user_id as string) || "default";
  const userProgress = adventureProgress[userId] || {};

  const adventuresWithProgress = ADVENTURES.map((adventure, index) => {
    const progress = userProgress[adventure.id] || { completed_challenges: [], completed: false };
    
    // Determine if unlocked (first chapter always unlocked, others need previous completed)
    let unlocked = index === 0;
    if (index > 0) {
      const prevAdventure = ADVENTURES[index - 1];
      const prevProgress = userProgress[prevAdventure.id];
      unlocked = prevProgress?.completed || false;
    }

    return {
      ...adventure,
      unlocked,
      completed: progress.completed,
      user_progress: {
        completed_challenges: progress.completed_challenges,
        total_challenges: adventure.challenges.length,
      },
    };
  });

  res.json({ adventures: adventuresWithProgress });
});

// Get single adventure
app.get("/adventures/:chapterId", (req, res) => {
  const chapterId = req.params.chapterId;
  const userId = (req.query.user_id as string) || "default";
  
  const adventure = ADVENTURES.find((a) => a.id === chapterId);
  if (!adventure) {
    res.status(404).json({ error: "Adventure not found" });
    return;
  }

  const userProgress = adventureProgress[userId] || {};
  const progress = userProgress[chapterId] || { completed_challenges: [], completed: false };

  res.json({
    adventure: {
      ...adventure,
      user_progress: {
        completed_challenges: progress.completed_challenges,
        total_challenges: adventure.challenges.length,
      },
    },
  });
});

// Submit adventure answer
app.post("/adventures/:chapterId/answer", (req, res) => {
  const chapterId = req.params.chapterId;
  const { challenge_id, answer, user_id } = req.body;
  const userId = user_id || "default";

  const adventure = ADVENTURES.find((a) => a.id === chapterId);
  if (!adventure) {
    res.status(404).json({ error: "Adventure not found" });
    return;
  }

  const challenge = adventure.challenges.find((c) => c.id === challenge_id);
  if (!challenge) {
    res.status(404).json({ error: "Challenge not found" });
    return;
  }

  // Initialize user progress if needed
  if (!adventureProgress[userId]) {
    adventureProgress[userId] = {};
  }
  if (!adventureProgress[userId][chapterId]) {
    adventureProgress[userId][chapterId] = { completed_challenges: [], completed: false };
  }

  const isCorrect = answer === challenge.correct;
  const progress = adventureProgress[userId][chapterId];

  // Add to completed challenges if correct and not already completed
  if (isCorrect && !progress.completed_challenges.includes(challenge_id)) {
    progress.completed_challenges.push(challenge_id);
    
    // Update user XP
    const user = getOrCreateUser(userId);
    user.xp += challenge.xp_reward;
    user.level = Math.floor(user.xp / 100) + 1;
  }

  // Check if chapter is complete
  const chapterComplete = progress.completed_challenges.length === adventure.challenges.length;
  if (chapterComplete && !progress.completed) {
    progress.completed = true;
    
    // Award completion XP and badge
    const user = getOrCreateUser(userId);
    user.xp += adventure.completion_xp;
    user.level = Math.floor(user.xp / 100) + 1;
    
    if (adventure.completion_badge && !user.badges.find((b) => b.id === adventure.completion_badge.id)) {
      user.badges.push(adventure.completion_badge);
    }
  }

  res.json({
    correct: isCorrect,
    xp_earned: isCorrect ? challenge.xp_reward : 0,
    chapter_complete: chapterComplete,
    completion_xp: chapterComplete ? adventure.completion_xp : 0,
    new_badges: chapterComplete && adventure.completion_badge ? [adventure.completion_badge] : [],
  });
});

// Generate a new module using AI
app.post("/modules/generate", async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    res.status(400).json({ error: "Topic is required" });
    return;
  }

  try {
    const prompt = `Generate a learning module about "${topic}" for a blockchain/crypto education platform.

Return a JSON object with this exact structure:
{
  "id": "unique-id-based-on-topic",
  "title": "Module Title",
  "description": "Brief description of what the learner will learn",
  "icon": "one of: cube, wallet, code, chart, coins, shield",
  "color": "one of: from-blue-500 to-cyan-500, from-purple-500 to-pink-500, from-green-500 to-emerald-500, from-orange-500 to-red-500",
  "lessons": [
    {
      "id": "lesson-1-id",
      "title": "Lesson Title",
      "duration": "X min",
      "xp": 20,
      "content": "Markdown content explaining the concept with headers, bullet points, and examples",
      "quiz": [
        {
          "question": "Quiz question?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct": 0
        }
      ]
    }
  ]
}

Create 2-3 lessons with 1-2 quiz questions each. Make the content educational and engaging.
Only return valid JSON, no markdown code blocks or extra text.`;

    const text = await generateWithFallback(prompt);

    // Try to parse the JSON response
    let moduleData;
    try {
      // Remove any markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      moduleData = JSON.parse(cleanedText);
    } catch {
      res.status(500).json({
        success: false,
        error: "Failed to parse AI response. Please try again.",
      });
      return;
    }

    // Add progress tracking
    moduleData.progress = {
      completed: 0,
      total: moduleData.lessons?.length || 0,
      percentage: 0,
    };

    res.json({
      success: true,
      module: moduleData,
      message: `Successfully generated module: ${moduleData.title}`,
    });
  } catch (error) {
    console.error("Generate module error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate module. Please try again.",
    });
  }
});

// Chat with AI
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  try {
    const prompt = `${BLOCKCHAIN_SYSTEM_PROMPT}

Student's question: ${message}

Please provide a helpful, educational response:`;

    const text = await generateWithFallback(prompt);
    res.json({ response: text });
  } catch (error) {
    console.error("Chat error:", error);
    res.json({
      response:
        "I encountered an issue processing your request. Let me help you with blockchain basics instead. What would you like to learn about?",
    });
  }
});

// Export the Express app as a Firebase Function (2nd gen) with secrets
export const api = onRequest(
  { secrets: [geminiApiKey, geminiApiKeyBackup, googleClientId, googleClientSecret, jwtSecret], cors: true },
  app
);
