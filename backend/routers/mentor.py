from fastapi import APIRouter
from models.session import MentorRequest, MentorResponse
from agents.orchestrator import handle_mentor_request

router = APIRouter()

@router.post("/chat", response_model=MentorResponse)
async def mentor_chat(request: MentorRequest):
    try:
        print("Received request:", request)
        response = handle_mentor_request(request)
        return response
    except Exception as e:
        print("Error in handle_mentor_request:", str(e))
        # Optionally return a fallback response
        return MentorResponse(message=f"Internal error: {str(e)}")

