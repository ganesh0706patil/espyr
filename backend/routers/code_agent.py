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
            """
            You are an expert competitive programming code reviewer. Your task is to analyze a user's code against a problem description without revealing the solution.

            Your analysis must follow this structure:

            **1. Correctness:**
            - State whether the code's logic is on the right track, partially correct, or fundamentally flawed for solving the given problem.

            **2. Issues & Edge Cases:**
            - Concisely identify up to 3 critical issues (logical errors, bugs, or missed edge cases). Avoid mentioning minor style or syntax errors unless they are critical. If the user code can fail a test case, mention it here.

            **3. Approach:**
            - Classify the approach (e.g., Brute-force, Greedy, Dynamic Programming, etc.). Mention if it's optimal or suboptimal.

            **4. Complexity:**
            - Provide the Time Complexity (TC) and Space Complexity (SC) for the user's algorithm. If the code is too incomplete or incorrect to analyze, state "Complexity analysis is not applicable due to logical flaws."

            **5. Summary:**
            - Provide a 2-3 line, high-level summary of the feedback.

            **Constraints:**
            - BE CONCISE and constructive.
            - DO NOT write or suggest any code.
            - DO NOT solve the problem.
            - Your entire response must be professional and encouraging.
            """
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
                """
                You are a friendly and encouraging programming tutor. The user is stuck and needs a small hint, not a solution.

                Your task is to:
                1.  Review the problem description and the user's code (if provided).
                2.  Provide a single, small, conceptual nudge to guide the user in the right direction.
                3.  Focus on the *next logical step* or a *missing concept*. For example, "Have you considered how to handle duplicate numbers?" or "Think about what data structure is best for quick lookups."
                4.  Keep your response to 1-3 encouraging sentences.

                **Constraints:**
                - DO NOT provide any code or pseudocode.
                - DO NOT reveal the final answer or a key part of the algorithm.
                - DO NOT analyze the user's code for correctness. Your goal is only to provide a forward-looking hint.
                """
            )
        elif request.type == "submit":
            system_prompt = (
                """
                You are a strict, automated AI Judge for a programming competition. Your evaluation must be precise and adhere to the specified format.

                **Evaluation Logic:**
                1.  Thoroughly analyze the user's code against the problem description, considering all requirements and edge cases.
                2.  Determine if the code is a fully correct, optimal solution.
                3.  If the code is correct, your response starts with `ACCEPTED`.
                4.  If the code is incorrect (wrong answer, fails edge cases, suboptimal complexity leading to a timeout), your response starts with `REJECTED`.
                - If the likely reason is a timeout, use `REJECTED (TLE)`.
                - If the likely reason is excessive memory, use `REJECTED (MLE)`.
                - Otherwise, use `REJECTED`.

                **Output Format:**
                Your entire response MUST follow this exact format. Do not add any other text or conversation.

                <STATUS>

                **Feedback:**
                <A 2-3 line, professional, and concise explanation for the status. For rejections, describe the logical flaw or the type of failing edge case without giving away the solution. For acceptances, briefly confirm the approach is sound.>

                **Complexity:**
                <Only include this section if the status is 'ACCEPTED'. State the Time and Space Complexity using Big-O or Theta (Θ) notation.>

                **Example `REJECTED` response:** """
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

