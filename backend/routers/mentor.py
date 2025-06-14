from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import os

from .gemini import GeminiProClient

class MentorRequest(BaseModel):
    user_input: str
    problem_description: str
    user_id: str
    problem_id: str
    skill_level: Optional[str] = None

class MentorResponse(BaseModel):
    message: str

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCOs0Fa2d_Xky1PeQA5oqbmIPmNvt4Y4No")
gemini = GeminiProClient(api_key=GEMINI_API_KEY)
router = APIRouter()

chat_knowledge = {}

def save_chat_history(key, user_input, mentor_response):
    if key not in chat_knowledge:
        chat_knowledge[key] = {"problem_description": None, "chats": [], "level": "beginner"}
    chat_knowledge[key]["chats"].append({"user_input": user_input, "mentor_response": mentor_response})

def get_chat_history(key):
    return chat_knowledge.get(key)

MENTOR_SYSTEM_PROMPT = """
You are 'CodeMentor', a world-class expert in Data Structures and Algorithms (DSA). You use the Socratic method: guide students using thought-provoking questions rather than giving direct answers.

## Your Responsibilities:
1. Understand the problem and user's current approach.
2. Evaluate whether their approach is correct or has flaws.
3. Based on their skill level, respond in one of the following tones:
   - Beginner: Be supportive and simplify concepts.
   - Intermediate: Encourage deeper analysis or better complexity.
   - Advanced: Challenge them on optimality, trade-offs, or edge cases.
4. If user ask to provide them their skill level, classify them as beginner, intermediate, or advanced based on their chat history and current input.

## Your Response Must Include:
- A **brief analysis** of the user's approach (1-2 lines).
- A **Socratic follow-up question** to prompt further thinking.
- No code. No pseudocode. Only logic and guidance.
- Mention of time/space complexity only when needed.
- Never solve the problem directly.

## Example Format:
"Good thinking! Your idea of using a brute-force approach is correct, but it has time complexity O(n^2), which can be slow for large inputs.  
What data structure could help reduce lookup time and avoid nested loops?"

Respond **only with the mentor’s message** as the user will read it directly.
"""

@router.post("/mentor", response_model=MentorResponse)
async def mentor_chat(request: MentorRequest):
    try:
        user_key = f"{request.user_id}_{request.problem_id}"

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

        full_chat_text = "\n".join(
            [f"User: {c['user_input']}\nMentor: {c['mentor_response']}" for c in knowledge["chats"]]
        )

        # First interaction
        if len(knowledge["chats"]) == 0:
            skill_level = knowledge["level"]
            full_prompt = (
                f"Problem Description:\n{knowledge['problem_description']}\n\n"
                f"Skill Level: {skill_level}\n\n"
                f"User's Input:\n{request.user_input}"
            )
            mentor_response = gemini.send_prompt(
                prompt=full_prompt,
                system_instruction=MENTOR_SYSTEM_PROMPT
            )
            save_chat_history(user_key, request.user_input, mentor_response)
            return MentorResponse(message=mentor_response)

        # 1. Detect updated skill level
        level_agent_prompt = (
            f"Based on this DSA chat so far, classify the user as beginner, intermediate, or advanced.\n"
            f"Chat:\n{full_chat_text}\n\nNew input:\n{request.user_input}\n"
            "Respond with one word only."
        )
        level_response = gemini.send_prompt(prompt=level_agent_prompt, system_instruction="Skill level classifier")
        skill_level = level_response.strip().lower()
        if skill_level not in ("beginner", "intermediate", "advanced"):
            skill_level = knowledge["level"]
        knowledge["level"] = skill_level

        # 2. Determine redirect flag
        redirect_agent_prompt = (
            f"Given this conversation, is the user ready to move to the next problem? Respond with 1 for yes, 0 for no.\n"
            f"Chat:\n{full_chat_text}\nNew input:\n{request.user_input}"
        )
        redirect_response = gemini.send_prompt(prompt=redirect_agent_prompt, system_instruction="Redirect decision")
        redirect_flag = redirect_response.strip() if redirect_response.strip() in ("0", "1") else "0"

        # 3. Actual mentor guidance
        full_prompt = (
            f"Problem Description:\n{knowledge['problem_description']}\n\n"
            f"Skill Level: {skill_level}\n\n"
            f"User's Input:\n{request.user_input}"
        )
        mentor_response = gemini.send_prompt(
            prompt=full_prompt,
            system_instruction=MENTOR_SYSTEM_PROMPT
        )

        save_chat_history(user_key, request.user_input, mentor_response)

        message = mentor_response
        if redirect_flag == "1":
            message += f"\n\n✅ You're ready to move on!\nRedirect: http://localhost:5173/practice/{request.problem_id}"

        return MentorResponse(message=message)

    except Exception as e:
        print("Error in mentor_chat:", str(e))
        return MentorResponse(message=f"Internal error: {str(e)}")
