from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import os

from .gemini import GeminiProClient

# Define Pydantic models (adjust according to your models.session)
class MentorRequest(BaseModel):
    user_input: str
    problem_description: str
    user_id: str
    problem_id: str
    skill_level: Optional[str] = None  # optional, initial skill level from frontend

class MentorResponse(BaseModel):
    message: str

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCOs0Fa2d_Xky1PeQA5oqbmIPmNvt4Y4No")
gemini = GeminiProClient(api_key=GEMINI_API_KEY)
router = APIRouter()

# In-memory store for chat knowledge (replace with persistent DB in production)
chat_knowledge = {}  # key: user_id_problem_id, value: dict with keys: problem_description, chats[], level

def save_chat_history(key, user_input, mentor_response):
    if key not in chat_knowledge:
        chat_knowledge[key] = {"problem_description": None, "chats": [], "level": "beginner"}
    chat_knowledge[key]["chats"].append({"user_input": user_input, "mentor_response": mentor_response})

def get_chat_history(key):
    return chat_knowledge.get(key)

# Full mentor system prompt to instruct the AI
MENTOR_SYSTEM_PROMPT = (
    "You are a senior DSA mentor helping students improve their problem-solving skills.\n\n"
    "Your task is to evaluate the user's approach to a programming problem and provide constructive feedback.\n"
    "Follow these rules:\n"
    "1. Determine whether the user's approach correctly solves the problem.\n"
    "2. If incorrect or unrelated, explain why in 2-3 lines.\n"
    "3. If correct, classify the approach: Brute-force, Intermediate, or Optimal.\n"
    "4. Mention the Time Complexity (TC) and Space Complexity (SC) only if the user prompt is related.\n"
    "5. Provide only guidance, not direct answers or solution code.\n\n"
    "Consider the user's skill level:\n"
    "- Beginner: Encourage simple/brute-force logic.\n"
    "- Intermediate: Suggest improvements or edge-case thinking.\n"
    "- Advanced: Focus on optimization and performance trade-offs.\n\n"
    "Be concise, constructive, and never give away the actual solution code."
)

@router.post("/mentor", response_model=MentorResponse)
async def mentor_chat(request: MentorRequest):
    try:
        user_key = f"{request.user_id}_{request.problem_id}"

        # Load or initialize knowledge
        knowledge = get_chat_history(user_key)
        if knowledge is None:
            knowledge = {
                "problem_description": request.problem_description,
                "chats": [],
                "level": request.skill_level.lower() if request.skill_level else "beginner"
            }
            chat_knowledge[user_key] = knowledge
        elif knowledge["problem_description"] is None:
            knowledge["problem_description"] = request.problem_description
        
        # Compose full chat history text
        full_chat_text = "\n".join(
            [f"User: {c['user_input']}\nMentor: {c['mentor_response']}" for c in knowledge["chats"]]
        )

        # First chat (no prior chats)
        if len(knowledge["chats"]) == 0:
            skill_level = knowledge["level"]
            full_prompt = (
                f"Problem Description:\n{knowledge['problem_description']}\n\n"
                f"User Skill Level:\n{skill_level}\n\n"
                f"User's Input / Approach:\n{request.user_input}\n"
            )
            mentor_response = gemini.send_prompt(
                prompt=full_prompt,
                system_instruction=f"{MENTOR_SYSTEM_PROMPT}\nConsider the user's skill level: {skill_level}"
            )

            save_chat_history(user_key, request.user_input, mentor_response)
            return MentorResponse(message=mentor_response)

        # For subsequent chats:
        # 1) Skill Level Classification
        level_agent_prompt = (
            f"Based on the following conversation, classify the user's skill level as one of: beginner, intermediate, advanced.\n"
            f"Conversation so far:\n{full_chat_text}\n"
            f"New user input:\n{request.user_input}\n"
            "Respond with exactly one word: beginner, intermediate, or advanced."
        )
        level_response = gemini.send_prompt(prompt=level_agent_prompt, system_instruction="Classify user skill level.")
        skill_level = level_response.strip().lower()
        if skill_level not in ("beginner", "intermediate", "advanced"):
            skill_level = knowledge["level"]  # fallback
        knowledge["level"] = skill_level

        # 2) Redirect Decision
        redirect_agent_prompt = (
            f"Based on this conversation, is the user ready to move on? Respond with 1 if ready, 0 otherwise.\n"
            f"Conversation so far:\n{full_chat_text}\n"
            f"New user input:\n{request.user_input}\n"
        )
        redirect_response = gemini.send_prompt(prompt=redirect_agent_prompt, system_instruction="Ready to redirect decision.")
        redirect_flag = redirect_response.strip()
        if redirect_flag not in ("0", "1"):
            redirect_flag = "0"

        # 3) Mentor Agent with updated skill level
        full_prompt = (
            f"Problem Description:\n{knowledge['problem_description']}\n\n"
            f"User Skill Level:\n{skill_level}\n\n"
            f"User's Input / Approach:\n{request.user_input}\n"
        )
        mentor_response = gemini.send_prompt(
            prompt=full_prompt,
            system_instruction=f"{MENTOR_SYSTEM_PROMPT}\nConsider the user's skill level: {skill_level}"
        )

        save_chat_history(user_key, request.user_input, mentor_response)

        # Append redirect URL if flagged
        message = mentor_response
        if redirect_flag == "1":
            message += f"\n\nRedirect: http://localhost:5173/practice/{request.problem_id}"

        return MentorResponse(message=message)

    except Exception as e:
        print("Error in mentor_chat:", str(e))
        return MentorResponse(message=f"Internal error: {str(e)}")
