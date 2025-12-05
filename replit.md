# ChainQuest Academy

A gamified blockchain education web application built for the Scoop AI Hackathon. ChainQuest Academy makes learning blockchain technology fun, visual, and interactive.

## Overview

ChainQuest Academy is an educational platform that teaches blockchain fundamentals through:
- Interactive learning modules covering blockchain basics, wallets, smart contracts, and DeFi
- AI-powered tutor chat using SpoonOS integration (Agent → SpoonOS → LLM flow)
- Gamification system with XP points, levels, and achievement badges
- Quiz system with instant AI-powered feedback

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Server**: Uvicorn
- **LLM Integration**: OpenAI API via SpoonOS agent pattern
- **Storage**: JSON-file based storage for user progress

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6

## Project Structure

```
├── backend/
│   ├── main.py           # FastAPI application entry point
│   ├── spoon_agent.py    # SpoonOS agent with blockchain tools
│   ├── data_store.py     # User progress and gamification storage
│   ├── lessons.py        # Learning content and quizzes
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── api.ts        # API client functions
│   │   ├── App.tsx       # Main React application
│   │   ├── components/   # Reusable UI components
│   │   └── pages/        # Page components
│   ├── tailwind.config.js
│   └── vite.config.ts
└── data/                  # JSON storage for user progress
```

## SpoonOS Integration

The application demonstrates the hackathon-required flow: **Agent → SpoonOS → LLM**

### SpoonOS Agent Module (`backend/spoon_agent.py`)
- `SpoonAgent` class: Main agent orchestrating the AI tutor
- `BlockchainTool` class: SpoonOS Tool Module for crypto/Web3 operations
- Supported tool operations:
  - `get_blockchain_info` - Network details (Ethereum, Bitcoin, Solana)
  - `explain_concept` - Educational content for blockchain concepts
  - `get_wallet_basics` - Wallet creation and security tips
  - `get_transaction_structure` - Transaction lifecycle explanation
  - `get_smart_contract_basics` - Smart contract fundamentals
  - `get_defi_overview` - DeFi ecosystem overview

## Running the Application

### Workflows
1. **Backend API** (port 8000): `cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload`
2. **Frontend** (port 5000): `cd frontend && npm run dev`

### Environment Variables
- `OPENAI_API_KEY` - Required for AI tutor functionality

## Features

### Learning Modules
- Blockchain Fundamentals (3 lessons)
- Crypto Wallets (3 lessons)
- Smart Contracts (3 lessons)
- DeFi Essentials (3 lessons)

### Gamification
- XP system with leveling
- 8 achievement badges to earn
- Progress tracking across all modules
- Quiz scores with AI feedback

### AI Tutor
- Conversational interface for blockchain questions
- Context-aware responses using SpoonOS tools
- Supports topic-specific queries about crypto concepts

## API Endpoints

### Learning
- `GET /api/modules` - List all learning modules
- `GET /api/modules/{id}` - Get module details
- `GET /api/lessons/{id}` - Get lesson content
- `POST /api/lessons/{id}/complete` - Mark lesson complete
- `POST /api/lessons/{id}/quiz` - Submit quiz answers

### AI Tutor
- `POST /api/chat` - Send message to AI tutor
- `POST /api/chat/clear` - Clear chat history

### Progress
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/progress` - Get detailed progress

### SpoonOS Tools
- `GET /api/tools/list` - List available tools
- `POST /api/tools/execute` - Execute a tool operation

## Recent Changes
- Initial project setup (December 2024)
- Implemented full SpoonOS integration with blockchain tools
- Created gamification system with XP and badges
- Built responsive React frontend with Tailwind CSS
