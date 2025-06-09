from models.session import CodeAgentResponse

def analyze_code(code: str) -> CodeAgentResponse:
    # Placeholder feedback logic
    feedback = "Code analysis is not implemented yet."
    if "for" in code:
        feedback = "Looks like you're using loops. Remember to check time complexity."
    return CodeAgentResponse(feedback=feedback)