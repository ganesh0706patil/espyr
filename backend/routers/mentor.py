from fastapi import APIRouter
from models.session import MentorRequest, MentorResponse
from .gemini import GeminiProClient
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCOs0Fa2d_Xky1PeQA5oqbmIPmNvt4Y4No")
gemini = GeminiProClient(api_key=GEMINI_API_KEY)
router = APIRouter()

@router.post("/chat", response_model=MentorResponse)
async def mentor_chat(request: MentorRequest):
    try:
        system_prompt = (
            "You are a senior DSA mentor helping students improve their problem-solving skills.\n\n"
            "Your task is to evaluate the user's approach to a programming problem and provide constructive feedback.\n"
            "Follow these rules:\n"
            "1. Determine whether the user's approach correctly solves the problem.\n"
            "2. If incorrect or unrelated, explain why in 2-3 lines.\n"
            "3. If correct, classify the approach: Brute-force, Intermediate, or Optimal.\n"
            "4. Mention the Time Complexity (TC) and Space Complexity (SC) if the user prompt is related else do not give to Time Complexity (TC) and Space Complexity (SC) .\n"
            "5. Provide only guidance, not direct answers or solution code.\n\n"
            "Consider the user's skill level:\n"
            "- Beginner: Encourage simple/brute-force logic.\n"
            "- Intermediate: Suggest improvements or edge-case thinking.\n"
            "- Advanced: Focus on optimization and performance trade-offs.\n\n"
            "Be concise, constructive, and never give away the actual solution code."
            
        )

        full_prompt = (
            f"Problem Description:\n{request.problem_description}\n\n"
            f"User Skill Level:\n{request.skill_level}\n\n"
            f"User's Input / Approach:\n{request.user_input}\n"
        )

        result = gemini.send_prompt(prompt=full_prompt, system_instruction=system_prompt)

        return MentorResponse(message=result)

    except Exception as e:
        print("Error in handle_mentor_request:", str(e))
        return MentorResponse(message=f"Internal error: {str(e)}")
