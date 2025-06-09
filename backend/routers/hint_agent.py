from fastapi import APIRouter
from pydantic import BaseModel
from .gemini import GeminiProClient
import os

router = APIRouter()

# Load Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCOs0Fa2d_Xky1PeQA5oqbmIPmNvt4Y4No")
gemini = GeminiProClient(api_key=GEMINI_API_KEY)

# Request model
class HintRequest(BaseModel):
    problem_description: str
    user_input: str
    code: str
    skill_level: str

# Response model (optional, here we use a simple dict)
@router.post("/hint")
async def give_hint(request: HintRequest):
    try:
        system_prompt = (
            "You are a hint generator. Based on the user’s approach and code, provide a helpful hint "
            "without giving the full solution. Tailor the hint based on their skill level."
        )

        full_prompt = (
            f"Problem:\n{request.problem_description}\n\n"
            f"User's Approach:\n{request.user_input}\n\n"
            f"Skill Level: {request.skill_level}\n\n"
            f"Code:\n{request.code}"
        )

        result = gemini.send_prompt(prompt=full_prompt, system_instruction=system_prompt)

        return {"hint": result}

    except Exception as e:
        return {"error": str(e)}
