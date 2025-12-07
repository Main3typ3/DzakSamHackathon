"""
JSON-based data storage for ChainQuest Academy.
Handles user progress, XP, levels, and badges.
"""

import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
USERS_FILE = os.path.join(DATA_DIR, "users.json")
PROGRESS_FILE = os.path.join(DATA_DIR, "progress.json")


def ensure_data_dir():
    """Ensure data directory exists."""
    os.makedirs(DATA_DIR, exist_ok=True)


def load_json(filepath: str) -> Dict:
    """Load JSON file or return empty dict."""
    try:
        if os.path.exists(filepath):
            with open(filepath, "r") as f:
                return json.load(f)
    except (json.JSONDecodeError, IOError):
        pass
    return {}


def save_json(filepath: str, data: Dict):
    """Save data to JSON file."""
    ensure_data_dir()
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2, default=str)


XP_PER_LEVEL = 100
LEVEL_MULTIPLIER = 1.5

BADGES = {
    "first_lesson": {
        "id": "first_lesson",
        "name": "First Steps",
        "description": "Complete your first lesson",
        "icon": "rocket",
        "xp_reward": 10
    },
    "quiz_master": {
        "id": "quiz_master",
        "name": "Quiz Master",
        "description": "Get 5 quiz answers correct",
        "icon": "trophy",
        "xp_reward": 25
    },
    "blockchain_basics": {
        "id": "blockchain_basics",
        "name": "Blockchain Basics",
        "description": "Complete the Blockchain Fundamentals module",
        "icon": "cube",
        "xp_reward": 50
    },
    "wallet_wizard": {
        "id": "wallet_wizard",
        "name": "Wallet Wizard",
        "description": "Complete the Crypto Wallets module",
        "icon": "wallet",
        "xp_reward": 50
    },
    "smart_scholar": {
        "id": "smart_scholar",
        "name": "Smart Scholar",
        "description": "Complete the Smart Contracts module",
        "icon": "code",
        "xp_reward": 50
    },
    "defi_explorer": {
        "id": "defi_explorer",
        "name": "DeFi Explorer",
        "description": "Complete the DeFi module",
        "icon": "chart",
        "xp_reward": 50
    },
    "ai_chat_5": {
        "id": "ai_chat_5",
        "name": "Curious Mind",
        "description": "Ask the AI Tutor 5 questions",
        "icon": "chat",
        "xp_reward": 15
    },
    "perfect_quiz": {
        "id": "perfect_quiz",
        "name": "Perfect Score",
        "description": "Get 100% on any quiz",
        "icon": "star",
        "xp_reward": 30
    },
    "code_scholar": {
        "id": "code_scholar",
        "name": "Code Scholar",
        "description": "Explain your first smart contract",
        "icon": "code",
        "xp_reward": 30
    }
}


def calculate_level(xp: int) -> int:
    """Calculate level from XP."""
    level = 1
    xp_needed = XP_PER_LEVEL
    remaining_xp = xp
    
    while remaining_xp >= xp_needed:
        remaining_xp -= xp_needed
        level += 1
        xp_needed = int(XP_PER_LEVEL * (LEVEL_MULTIPLIER ** (level - 1)))
    
    return level


def xp_for_next_level(current_xp: int) -> Dict[str, int]:
    """Get XP progress towards next level."""
    level = calculate_level(current_xp)
    
    total_xp_for_current = 0
    xp_needed = XP_PER_LEVEL
    for l in range(1, level):
        total_xp_for_current += xp_needed
        xp_needed = int(XP_PER_LEVEL * (LEVEL_MULTIPLIER ** l))
    
    xp_into_level = current_xp - total_xp_for_current
    xp_for_level = int(XP_PER_LEVEL * (LEVEL_MULTIPLIER ** (level - 1)))
    
    return {
        "current": xp_into_level,
        "needed": xp_for_level,
        "percentage": int((xp_into_level / xp_for_level) * 100)
    }


class UserDataStore:
    """Manages user data and progress."""
    
    def __init__(self):
        ensure_data_dir()
    
    def get_or_create_user(self, user_id: str = "default") -> Dict[str, Any]:
        """Get user data or create new user."""
        users = load_json(USERS_FILE)
        
        if user_id not in users:
            users[user_id] = {
                "id": user_id,
                "xp": 0,
                "level": 1,
                "badges": [],
                "completed_lessons": [],
                "quiz_scores": {},
                "ai_chat_count": 0,
                "correct_answers": 0,
                "created_at": datetime.now().isoformat(),
                "last_active": datetime.now().isoformat(),
                # OAuth fields (optional, will be populated if OAuth user)
                "email": None,
                "name": None,
                "picture": None,
            }
            save_json(USERS_FILE, users)
        
        return users[user_id]
    
    def update_user(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update user data."""
        users = load_json(USERS_FILE)
        
        if user_id not in users:
            self.get_or_create_user(user_id)
            users = load_json(USERS_FILE)
        
        users[user_id].update(updates)
        users[user_id]["last_active"] = datetime.now().isoformat()
        users[user_id]["level"] = calculate_level(users[user_id]["xp"])
        
        save_json(USERS_FILE, users)
        return users[user_id]
    
    def add_xp(self, user_id: str, amount: int, reason: str = "") -> Dict[str, Any]:
        """Add XP to user and check for level up."""
        user = self.get_or_create_user(user_id)
        old_level = user["level"]
        
        new_xp = user["xp"] + amount
        user = self.update_user(user_id, {"xp": new_xp})
        
        new_level = user["level"]
        leveled_up = new_level > old_level
        
        return {
            "user": user,
            "xp_gained": amount,
            "leveled_up": leveled_up,
            "new_level": new_level if leveled_up else None,
            "level_progress": xp_for_next_level(new_xp)
        }
    
    def complete_lesson(self, user_id: str, lesson_id: str) -> Dict[str, Any]:
        """Mark lesson as completed and award XP."""
        user = self.get_or_create_user(user_id)
        
        if lesson_id in user["completed_lessons"]:
            return {"already_completed": True, "user": user}
        
        completed = user["completed_lessons"] + [lesson_id]
        self.update_user(user_id, {"completed_lessons": completed})
        
        result = self.add_xp(user_id, 20, f"Completed lesson: {lesson_id}")
        
        new_badges = []
        if len(completed) == 1:
            badge_result = self.award_badge(user_id, "first_lesson")
            if badge_result.get("awarded"):
                new_badges.append(badge_result["badge"])
        
        module_badges = {
            "blockchain": "blockchain_basics",
            "wallet": "wallet_wizard",
            "smart-contract": "smart_scholar",
            "defi": "defi_explorer"
        }
        
        for module_prefix, badge_id in module_badges.items():
            module_lessons = [l for l in completed if l.startswith(module_prefix)]
            if len(module_lessons) >= 3:
                badge_result = self.award_badge(user_id, badge_id)
                if badge_result.get("awarded"):
                    new_badges.append(badge_result["badge"])
        
        result["new_badges"] = new_badges
        result["already_completed"] = False
        return result
    
    def record_quiz_score(self, user_id: str, quiz_id: str, score: int, total: int) -> Dict[str, Any]:
        """Record quiz score and award XP."""
        user = self.get_or_create_user(user_id)
        
        quiz_scores = user.get("quiz_scores", {})
        quiz_scores[quiz_id] = {"score": score, "total": total, "date": datetime.now().isoformat()}
        
        correct_answers = user.get("correct_answers", 0) + score
        self.update_user(user_id, {
            "quiz_scores": quiz_scores,
            "correct_answers": correct_answers
        })
        
        xp_earned = score * 10
        result = self.add_xp(user_id, xp_earned, f"Quiz: {quiz_id}")
        
        new_badges = []
        
        if score == total:
            badge_result = self.award_badge(user_id, "perfect_quiz")
            if badge_result.get("awarded"):
                new_badges.append(badge_result["badge"])
        
        if correct_answers >= 5:
            badge_result = self.award_badge(user_id, "quiz_master")
            if badge_result.get("awarded"):
                new_badges.append(badge_result["badge"])
        
        result["new_badges"] = new_badges
        result["quiz_score"] = {"score": score, "total": total}
        return result
    
    def increment_chat_count(self, user_id: str) -> Dict[str, Any]:
        """Increment AI chat count and check for badge."""
        user = self.get_or_create_user(user_id)
        
        new_count = user.get("ai_chat_count", 0) + 1
        self.update_user(user_id, {"ai_chat_count": new_count})
        
        result = {"chat_count": new_count, "new_badges": []}
        
        if new_count >= 5:
            badge_result = self.award_badge(user_id, "ai_chat_5")
            if badge_result.get("awarded"):
                result["new_badges"].append(badge_result["badge"])
                xp_result = self.add_xp(user_id, BADGES["ai_chat_5"]["xp_reward"])
                result["xp_gained"] = BADGES["ai_chat_5"]["xp_reward"]
        
        return result
    
    def award_badge(self, user_id: str, badge_id: str) -> Dict[str, Any]:
        """Award a badge to user."""
        if badge_id not in BADGES:
            return {"awarded": False, "error": "Unknown badge"}
        
        user = self.get_or_create_user(user_id)
        
        if badge_id in user["badges"]:
            return {"awarded": False, "already_has": True}
        
        badges = user["badges"] + [badge_id]
        self.update_user(user_id, {"badges": badges})
        
        return {
            "awarded": True,
            "badge": BADGES[badge_id]
        }
    
    def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """Get comprehensive user statistics."""
        user = self.get_or_create_user(user_id)
        
        return {
            "xp": user["xp"],
            "level": user["level"],
            "level_progress": xp_for_next_level(user["xp"]),
            "badges": [BADGES[b] for b in user["badges"] if b in BADGES],
            "completed_lessons": len(user["completed_lessons"]),
            "quiz_scores": user.get("quiz_scores", {}),
            "ai_chat_count": user.get("ai_chat_count", 0),
            "correct_answers": user.get("correct_answers", 0),
            "all_badges": list(BADGES.values())
        }
    
    def save_user(self, user_id: str, user_data: Dict[str, Any]) -> None:
        """Save user data directly."""
        users = load_json(USERS_FILE)
        users[user_id] = user_data
        users[user_id]["last_active"] = datetime.now().isoformat()
        save_json(USERS_FILE, users)
    
    def record_code_explanation(self, user_id: str) -> Dict[str, Any]:
        """Record that user explained a contract and award badge/XP."""
        user = self.get_or_create_user(user_id)
        
        # Increment explanation count
        explanation_count = user.get("contracts_explained", 0) + 1
        self.update_user(user_id, {"contracts_explained": explanation_count})
        
        result = {
            "explanation_count": explanation_count,
            "new_badges": [],
            "xp_gained": 30  # 30 XP per contract explained
        }
        
        # Award XP
        xp_result = self.add_xp(user_id, 30, "Contract Explained")
        result["leveled_up"] = xp_result.get("leveled_up", False)
        result["new_level"] = xp_result.get("new_level")
        
        # Award Code Scholar badge for first explanation
        if explanation_count == 1:
            badge_result = self.award_badge(user_id, "code_scholar")
            if badge_result.get("awarded"):
                result["new_badges"].append(badge_result["badge"])
                # Add badge XP on top
                xp_result = self.add_xp(user_id, BADGES["code_scholar"]["xp_reward"])
                result["xp_gained"] += BADGES["code_scholar"]["xp_reward"]
        
        return result


data_store = UserDataStore()


def get_store() -> UserDataStore:
    """Get the singleton data store instance."""
    return data_store
