from fastapi import APIRouter
from pydantic import BaseModel
from .gemini import GeminiProClient
import os

router = APIRouter()

# Load Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCOs0Fa2d_Xky1PeQA5oqbmIPmNvt4Y4No")
gemini = GeminiProClient(api_key=GEMINI_API_KEY)

# Request model
class SubmitRequest(BaseModel):
    problem_description: str
    code: str

@router.post("/submit")
async def submit_code(request: SubmitRequest):
    try:
        system_prompt = (
            "You are a code judge. Evaluate if the code passes all test cases for the problem. "
            "Assume there are multiple hidden and edge cases. Return success/failure with a brief reason."
        )

        full_prompt = f"Problem:\n{request.problem_description}\n\nUser Code:\n{request.code}"

        result = gemini.send_prompt(prompt=full_prompt, system_instruction=system_prompt)

        return {"result": result}

    except Exception as e:
        return {"error": str(e)}
