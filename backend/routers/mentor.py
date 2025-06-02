from fastapi import APIRouter

router = APIRouter()

@router.post("/agent")
def handle_mentor():
    return {"message": "Mentor agent is ready!"}
