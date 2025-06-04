from fastapi import APIRouter
from pydantic import BaseModel
from .gemini import GeminiProClient  # Make sure this is correctly imported
import os

router = APIRouter()

# Load Gemini API Key securely (recommended) — or hardcode for testing
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCOs0Fa2d_Xky1PeQA5oqbmIPmNvt4Y4No")
gemini = GeminiProClient(api_key=GEMINI_API_KEY)

# Request model
class CodeRequest(BaseModel):
    code: str
    question: str  # Include question so Gemini can evaluate in context

@router.post("/analyze")
async def analyze_code(request: CodeRequest):
    try:
        system_prompt = (
            "You are an expert coding assistant. Analyze the code for the given question. "
            "Check if it is correct and provide concise feedback (2 to 3 lines). do not provide the answer code"
        )

        full_prompt = f"Question:\n{request.question}\n\nUser's Code:\n{request.code}"

        result = gemini.send_prompt(prompt=full_prompt, system_instruction=system_prompt)

        return {"feedback": result}

    except Exception as e:
        return {"error": str(e)}
