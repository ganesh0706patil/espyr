from agents.mentor_agent import get_mentor_response
from agents.code_agent import analyze_code
from models.session import MentorRequest, MentorResponse, CodeAgentRequest, CodeAgentResponse

def handle_mentor_request(request: MentorRequest) -> MentorResponse:
    try:
        # dummy example
        message = f"Answering your question: '{request.user_input}' as a {request.skill_level} for problem {request.problem_id}."
        return MentorResponse(message="Some valid message")  # ✅ Correct
    except Exception as e:
        return MentorResponse(message=f"Internal error: {str(e)}")  # ✅ Correct field


def handle_code_agent_request(request: CodeAgentRequest) -> CodeAgentResponse:
    return analyze_code(request.code)