from fastapi import APIRouter
from pydantic import BaseModel
from .gemini import GeminiProClient
import os
from typing import Optional

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCOs0Fa2d_Xky1PeQA5oqbmIPmNvt4Y4No")
gemini = GeminiProClient(api_key=GEMINI_API_KEY)

class CodeRequest(BaseModel):
    code: str
    question: str  # Include question for contextual analysis

class ChatRequest(BaseModel):
    type: str  # Required: "hint" or "submit"
    message: Optional[str] = ""
    code: str = ""
    question: str = ""

# Existing Analyze endpoint
@router.post("/analyze")
async def analyze_code(request: CodeRequest):
    try:
        system_prompt = (
            "You are an expert competitive programming assistant. Analyze the provided code in the context "
            "of the given problem. Do not solve the problem yourself or return the correct code.\n\n"
            "Instead, do the following:\n"
            "- Check whether the user's code correctly solves the problem.\n"
            "- Identify any logical, syntactic, or edge-case issues.\n"
            "- Mention if the approach is brute-force or optimized.\n"
            "- Give a 2–3 line concise feedback summary.\n"
            "- Mention Time Complexity (TC) and Space Complexity (SC) if the code is relatable do not give if the code is mostly wrong or there is no main code logic, determine if there is a code that have a time complexity.\n\n"
            "Avoid giving away the correct answer. Be concise and constructive."
        )

        full_prompt = (
            f"Problem Description:\n{request.question}\n\n"
            f"User's Code:\n{request.code}\n\n"
            f"Evaluate the code accordingly."
        )

        result = gemini.send_prompt(prompt=full_prompt, system_instruction=system_prompt)
        return {"feedback": result}

    except Exception as e:
        return {"error": str(e)}


# New /chat endpoint (for Hint, Submit, etc.)
@router.post("/chat")
async def chat_with_agent(request: ChatRequest):
    try:
        if request.type == "hint":
            system_prompt = (
                "You are a helpful programming assistant. The user is asking for a *hint* — not the full solution. "
                "Based on the problem description and their code (if any), guide them toward the next step, or suggest what concept they might be missing. "
                "Be encouraging, avoid spoilers or final answers. give in 2 lines"
            )
        elif request.type == "submit":
            system_prompt = (
                "You are an AI judge evaluating user-submitted code against a problem description.\n\n"
                "- If the code is fully correct and passes all edge cases, respond with exactly one word: 'ACCEPTED'.\n"
                "- If the code is incorrect or fails any edge cases, respond with 'REJECTED'. If the rejection is due to Time Limit Exceeded, add '(TLE)'; if due to Memory Limit Exceeded, add '(MLE)'; otherwise, just 'REJECTED'.\n"
                "- Provide 2-3 lines of concise, constructive, and professional feedback explaining the reason for rejection or acceptance.\n"
                "- When giving feedback for rejection, avoid direct code references or informal phrases. Instead, describe the logical or conceptual errors clearly.\n"
                "- Mention Time Complexity (TC) and Space Complexity (SC) only if the user query directly relates to them or if the code is accepted.\n"
                "- When relevant, use Theta (Θ) notation to describe algorithmic complexities in the feedback.\n"
                "- Do NOT provide any correct code, solutions, or explicit fixes.\n"
                "- Do NOT deviate from this format or provide additional commentary.\n"
                "- Be strict, clear, and professional in your evaluation.\n"
                "- Always ensure feedback is polished, concise, and easy to read.\n"
                "- If previous submission knowledge is available, incorporate that context into your evaluation briefly but do not reveal previous feedback explicitly.\n"
                "Ensure that the format of your respone must be good and clear, and do not give any code or solution.\n"


            )
        else:
            system_prompt = "You are a helpful programming assistant. Respond to the user's message."

        user_prompt = (
            f"{request.message}\n\n"
            f"Problem Description:\n{request.question}\n\n"
            f"User's Code:\n{request.code}"
        )

        result = gemini.send_prompt(prompt=user_prompt, system_instruction=system_prompt)
        return {"response": result}

    except Exception as e:
        return {"error": str(e)}

