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
            "- Mention Time Complexity (TC) and Space Complexity (SC) if determinable.\n\n"
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
                "- Provide 2-3 lines of concise, constructive feedback explaining why the code was accepted or rejected.\n"
                "- Mention Time Complexity and Space Complexity only if the user query directly relates to them.\n"
                "- Do NOT give any correct code, solutions, or explicit fixes.\n"
                "- Do NOT deviate from this format or provide additional commentary.\n"
                "- Be strict and clear in your evaluation."

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

