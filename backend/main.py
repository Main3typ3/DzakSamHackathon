"""
ChainQuest Academy - FastAPI Backend
A gamified blockchain education platform for the Scoop AI Hackathon.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from spoon_agent import get_agent
from data_store import get_store
from lessons import get_all_modules, get_module, get_lesson, get_all_lessons
from adventures import get_adventure, get_all_adventures, get_npc

app = FastAPI(
    title="ChainQuest Academy API",
    description="Gamified blockchain education with SpoonOS integration",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = "default"


class ChatResponse(BaseModel):
    response: str
    chat_count: int
    new_badges: List[Dict[str, Any]] = []


class QuizAnswerRequest(BaseModel):
    lesson_id: str
    answers: List[int]
    user_id: Optional[str] = "default"


class LessonCompleteRequest(BaseModel):
    lesson_id: str
    user_id: Optional[str] = "default"


class ToolRequest(BaseModel):
    operation: str
    params: Optional[Dict[str, Any]] = None


class AdventureAnswerRequest(BaseModel):
    chapter_id: str
    challenge_id: str
    answer: int
    user_id: Optional[str] = "default"


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "app": "ChainQuest Academy",
        "version": "1.0.0",
        "spoon_os": "integrated"
    }


@app.get("/api/modules")
async def list_modules(user_id: str = "default"):
    """Get all learning modules with user progress."""
    store = get_store()
    user = store.get_or_create_user(user_id)
    modules = get_all_modules()
    
    for module in modules:
        completed = 0
        total = len(module["lessons"])
        for lesson in module["lessons"]:
            if lesson["id"] in user.get("completed_lessons", []):
                completed += 1
        module["progress"] = {
            "completed": completed,
            "total": total,
            "percentage": int((completed / total) * 100) if total > 0 else 0
        }
    
    return {"modules": modules}


@app.get("/api/modules/{module_id}")
async def get_module_details(module_id: str, user_id: str = "default"):
    """Get a specific module with lessons."""
    module = get_module(module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    store = get_store()
    user = store.get_or_create_user(user_id)
    
    for lesson in module["lessons"]:
        lesson["completed"] = lesson["id"] in user.get("completed_lessons", [])
    
    return {"module": module}


@app.get("/api/lessons/{lesson_id}")
async def get_lesson_details(lesson_id: str, user_id: str = "default"):
    """Get a specific lesson with quiz."""
    lesson = get_lesson(lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    store = get_store()
    user = store.get_or_create_user(user_id)
    lesson["completed"] = lesson_id in user.get("completed_lessons", [])
    
    return {"lesson": lesson}


@app.post("/api/lessons/{lesson_id}/complete")
async def complete_lesson(lesson_id: str, request: LessonCompleteRequest):
    """Mark a lesson as completed."""
    lesson = get_lesson(lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    store = get_store()
    result = store.complete_lesson(request.user_id, lesson_id)
    
    return {
        "success": True,
        "xp_gained": result.get("xp_gained", 0),
        "leveled_up": result.get("leveled_up", False),
        "new_level": result.get("new_level"),
        "new_badges": result.get("new_badges", []),
        "already_completed": result.get("already_completed", False)
    }


@app.post("/api/lessons/{lesson_id}/quiz")
async def submit_quiz(lesson_id: str, request: QuizAnswerRequest):
    """Submit quiz answers and get feedback."""
    lesson = get_lesson(lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    quiz = lesson.get("quiz", [])
    if not quiz:
        raise HTTPException(status_code=400, detail="No quiz for this lesson")
    
    if len(request.answers) != len(quiz):
        raise HTTPException(status_code=400, detail="Answer count mismatch")
    
    agent = get_agent()
    results = []
    correct_count = 0
    
    for i, (question, user_answer) in enumerate(zip(quiz, request.answers)):
        is_correct = user_answer == question["correct"]
        if is_correct:
            correct_count += 1
        
        correct_option = question["options"][question["correct"]]
        user_option = question["options"][user_answer] if 0 <= user_answer < len(question["options"]) else "Invalid"
        
        try:
            feedback = agent.generate_quiz_feedback(
                question["question"],
                user_option,
                correct_option,
                is_correct
            )
        except Exception:
            feedback = "Great job!" if is_correct else f"The correct answer is: {correct_option}"
        
        results.append({
            "question": question["question"],
            "your_answer": user_option,
            "correct_answer": correct_option,
            "is_correct": is_correct,
            "feedback": feedback
        })
    
    store = get_store()
    score_result = store.record_quiz_score(
        request.user_id,
        lesson_id,
        correct_count,
        len(quiz)
    )
    
    return {
        "results": results,
        "score": correct_count,
        "total": len(quiz),
        "percentage": int((correct_count / len(quiz)) * 100),
        "xp_gained": score_result.get("xp_gained", 0),
        "leveled_up": score_result.get("leveled_up", False),
        "new_badges": score_result.get("new_badges", [])
    }


@app.post("/api/chat")
async def chat_with_tutor(request: ChatRequest):
    """Chat with the AI blockchain tutor."""
    agent = get_agent()
    store = get_store()
    
    try:
        response = agent.chat(request.message)
        chat_result = store.increment_chat_count(request.user_id)
        
        return ChatResponse(
            response=response,
            chat_count=chat_result["chat_count"],
            new_badges=chat_result.get("new_badges", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat/clear")
async def clear_chat_history():
    """Clear chat conversation history."""
    agent = get_agent()
    agent.clear_history()
    return {"success": True, "message": "Chat history cleared"}


@app.post("/api/tools/execute")
async def execute_tool(request: ToolRequest):
    """Execute a SpoonOS blockchain tool directly."""
    agent = get_agent()
    result = agent.use_tool(request.operation, request.params)
    
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Tool execution failed"))
    
    return result


@app.get("/api/tools/list")
async def list_tools():
    """List available SpoonOS blockchain tools."""
    agent = get_agent()
    return {
        "tools": agent.blockchain_tool.supported_operations,
        "description": "SpoonOS Blockchain Tool Module for educational data"
    }


@app.get("/api/user/stats")
async def get_user_stats(user_id: str = "default"):
    """Get user statistics and progress."""
    store = get_store()
    stats = store.get_user_stats(user_id)
    return {"stats": stats}


@app.get("/api/user/progress")
async def get_user_progress(user_id: str = "default"):
    """Get detailed user progress across all modules."""
    store = get_store()
    user = store.get_or_create_user(user_id)
    modules = get_all_modules()
    
    progress = []
    for module in modules:
        completed_lessons = []
        for lesson in module["lessons"]:
            if lesson["id"] in user.get("completed_lessons", []):
                completed_lessons.append(lesson["id"])
        
        progress.append({
            "module_id": module["id"],
            "module_title": module["title"],
            "completed_lessons": len(completed_lessons),
            "total_lessons": len(module["lessons"]),
            "percentage": int((len(completed_lessons) / len(module["lessons"])) * 100) if module["lessons"] else 0
        })
    
    return {
        "user_id": user_id,
        "xp": user["xp"],
        "level": user["level"],
        "modules": progress
    }


@app.get("/api/adventures")
async def list_adventures(user_id: str = "default"):
    """Get all adventure chapters with user progress."""
    adventures = get_all_adventures()
    store = get_store()
    user = store.get_or_create_user(user_id)
    
    # Add completion status and user progress
    completed_chapters = user.get("completed_chapters", [])
    adventure_progress = user.get("adventure_progress", {})
    
    for adventure in adventures:
        adventure["completed"] = adventure["id"] in completed_chapters
        # Add user progress for each adventure
        chapter_progress = adventure_progress.get(adventure["id"], {})
        adventure["user_progress"] = {
            "completed_challenges": chapter_progress.get("completed_challenges", []),
            "score": chapter_progress.get("score", 0),
            "total_challenges": len(adventure.get("challenges", []))
        }
    
    return {"adventures": adventures}


@app.get("/api/adventures/{chapter_id}")
async def get_adventure_chapter(chapter_id: str, user_id: str = "default"):
    """Get a specific adventure chapter."""
    adventure = get_adventure(chapter_id)
    if not adventure:
        raise HTTPException(status_code=404, detail="Adventure chapter not found")
    
    store = get_store()
    user = store.get_or_create_user(user_id)
    
    # Add completion and progress status
    completed_chapters = user.get("completed_chapters", [])
    adventure["completed"] = chapter_id in completed_chapters
    
    # Get user's progress on challenges
    adventure_progress = user.get("adventure_progress", {}).get(chapter_id, {})
    adventure["user_progress"] = adventure_progress
    
    return {"adventure": adventure}


@app.post("/api/adventures/{chapter_id}/answer")
async def submit_adventure_answer(chapter_id: str, request: AdventureAnswerRequest):
    """Submit an answer for an adventure challenge."""
    adventure = get_adventure(chapter_id)
    if not adventure:
        raise HTTPException(status_code=404, detail="Adventure chapter not found")
    
    # Find the challenge
    challenge = None
    for ch in adventure["challenges"]:
        if ch["id"] == request.challenge_id:
            challenge = ch
            break
    
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Check if answer is correct
    is_correct = request.answer == challenge["correct"]
    
    # Get AI feedback with Game Master persona
    agent = get_agent()
    npc = get_npc(challenge["npc"])
    
    # Validate answer index
    if not (0 <= request.answer < len(challenge['choices'])):
        raise HTTPException(status_code=400, detail="Invalid answer index")
    
    try:
        # Create Game Master prompt with validated data
        user_answer = challenge['choices'][request.answer]
        correct_answer = challenge['choices'][challenge['correct']]
        
        game_master_prompt = f"""You are {npc['name']}, a {npc['role']} in the Blockchain Quest adventure.
Personality: {npc['personality']}
Backstory: {npc['backstory']}

The player just answered a question {'correctly' if is_correct else 'incorrectly'}.

Question: {challenge['question']}
Their answer: {user_answer}
Correct answer: {correct_answer}

Provide {'encouraging' if is_correct else 'teaching'} feedback in character as {npc['name']}.
Keep it brief (2-3 sentences) and engaging."""
        
        ai_feedback = agent.chat(game_master_prompt, game_master_mode=True)
    except Exception:
        # Fallback to predefined feedback
        ai_feedback = challenge["feedback_correct"] if is_correct else challenge["feedback_incorrect"]
    
    # Store progress
    store = get_store()
    user = store.get_or_create_user(request.user_id)
    
    # Initialize adventure progress structure
    if "adventure_progress" not in user:
        user["adventure_progress"] = {}
    if chapter_id not in user["adventure_progress"]:
        user["adventure_progress"][chapter_id] = {
            "completed_challenges": [],
            "score": 0,
            "total_challenges": len(adventure["challenges"])
        }
    
    # Update challenge completion
    chapter_progress = user["adventure_progress"][chapter_id]
    if request.challenge_id not in chapter_progress["completed_challenges"]:
        chapter_progress["completed_challenges"].append(request.challenge_id)
        if is_correct:
            chapter_progress["score"] += 1
    
    # Check if chapter is complete
    chapter_complete = len(chapter_progress["completed_challenges"]) >= len(adventure["challenges"])
    
    result = {
        "is_correct": is_correct,
        "feedback": ai_feedback,
        "xp_gained": challenge["xp_reward"] if is_correct else 0,
        "chapter_complete": chapter_complete,
        "score": chapter_progress["score"],
        "total_challenges": chapter_progress["total_challenges"]
    }
    
    # Award XP for correct answers
    if is_correct:
        xp_result = store.add_xp(request.user_id, challenge["xp_reward"])
        result["leveled_up"] = xp_result.get("leveled_up", False)
        result["new_level"] = xp_result.get("new_level")
    
    # If chapter complete, award completion bonus
    if chapter_complete and chapter_id not in user.get("completed_chapters", []):
        if "completed_chapters" not in user:
            user["completed_chapters"] = []
        user["completed_chapters"].append(chapter_id)
        
        # Award completion XP and badge
        completion_result = store.add_xp(request.user_id, adventure["completion_xp"])
        result["completion_xp"] = adventure["completion_xp"]
        result["leveled_up"] = completion_result.get("leveled_up", False)
        result["new_level"] = completion_result.get("new_level")
        
        # Award badge if specified
        if adventure.get("completion_badge"):
            badge_result = store.award_badge(request.user_id, adventure["completion_badge"])
            result["new_badges"] = badge_result.get("new_badges", [])
    
    # Save user progress
    store.save_user(request.user_id, user)
    
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
