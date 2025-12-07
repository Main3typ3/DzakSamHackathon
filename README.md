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
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v7

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- OpenAI API key

### 1. Clone the repository
```bash
git clone git@github.com:Main3typ3/DzakSamHackathon.git
cd DzakSamHackathon
git checkout chainquest-academy
```

### 2. Set up the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure Environment
Create a `.env` file in the root directory:
```env
# OAuth Configuration (required for authentication)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback

# JWT Configuration (required for sessions)
JWT_SECRET=your-secret-key-change-this-in-production

# SpoonOS / OpenAI (optional, for AI tutor)
# OPENAI_API_KEY=your_openai_api_key_here
```

#### Setting up Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set authorized redirect URI to: `http://localhost:5173/auth/callback`
6. Copy the Client ID and Client Secret to your `.env` file
7. Generate a secure random string for `JWT_SECRET` (e.g., using `openssl rand -hex 32`)

### 4. Start the Backend
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Start the Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

### 6. Open the App
Visit http://localhost:5000 in your browser.

## Project Structure

```
├── backend/
│   ├── main.py           # FastAPI application entry point
│   ├── spoon_agent.py    # SpoonOS agent with blockchain tools
│   ├── data_store.py     # User progress and gamification storage
│   ├── lessons.py        # Learning content and quizzes
│   ├── .env              # Environment variables (create this)
│   ├── .env.example      # Example environment file
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── api.ts        # API client functions
│   │   ├── App.tsx       # Main React application
│   │   ├── components/   # Reusable UI components
│   │   └── pages/        # Page components
│   ├── package.json
│   └── vite.config.ts
├── data/                 # JSON storage for user progress
├── start_backend.sh      # Backend start script
└── start_frontend.sh     # Frontend start script
```

## Features

### Authentication & Onboarding
- **OAuth 2.0 Authentication** - Secure sign-in with Google
- **Animated Onboarding** - Multi-step splash screen for first-time users
- **Persistent Sessions** - JWT-based authentication with automatic token refresh
- **User Profiles** - Profile pictures and personalized experience

### Learning Modules
- **Blockchain Fundamentals** - Core concepts, blocks, chains, consensus
- **Crypto Wallets** - Wallet types, seed phrases, transactions
- **Smart Contracts** - Basics, token standards, security
- **DeFi Essentials** - DEXs, AMMs, risks

### Gamification
- XP system with leveling (100 XP per level)
- 8 achievement badges to unlock
- Progress tracking across all modules
- Quiz scores with personalized AI feedback

### AI Tutor
- Conversational chat interface
- Context-aware blockchain explanations
- Powered by OpenAI via SpoonOS agent pattern

## API Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/google` | GET | Initiate Google OAuth flow |
| `/api/auth/google/callback` | POST | Handle OAuth callback |
| `/api/auth/me` | GET | Get current user info |
| `/api/auth/logout` | POST | Logout user |

### Learning & Progress
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/modules` | GET | List all learning modules |
| `/api/modules/{id}` | GET | Get module details |
| `/api/lessons/{id}` | GET | Get lesson content |
| `/api/lessons/{id}/complete` | POST | Mark lesson complete |
| `/api/lessons/{id}/quiz` | POST | Submit quiz answers |
| `/api/chat` | POST | Chat with AI tutor |
| `/api/user/stats` | GET | Get user statistics |
| `/api/user/progress` | GET | Get detailed progress |

### Adventures
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/adventures` | GET | List all adventures |
| `/api/adventures/{id}` | GET | Get adventure details |
| `/api/adventures/{id}/answer` | POST | Submit adventure challenge answer |

## SpoonOS Integration

The application demonstrates the hackathon-required flow: **Agent → SpoonOS → LLM**

### Available Blockchain Tools
- `get_blockchain_info` - Network details (Ethereum, Bitcoin, Solana)
- `explain_concept` - Educational content for blockchain concepts
- `get_wallet_basics` - Wallet creation and security tips
- `get_transaction_structure` - Transaction lifecycle
- `get_smart_contract_basics` - Smart contract fundamentals
- `get_defi_overview` - DeFi ecosystem overview

## License

MIT
