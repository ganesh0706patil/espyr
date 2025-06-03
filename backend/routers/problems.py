from fastapi import APIRouter
from models.session import ProblemsResponse, Problem
import json
from pathlib import Path

router = APIRouter()

@router.get("/", response_model=ProblemsResponse)
async def get_problems():
    data_file = Path(__file__).parent.parent / "data" / "problems.json"
    with open(data_file, "r") as f:
        problems_data = json.load(f)
    problems = [Problem(**p) for p in problems_data]
    return ProblemsResponse(problems=problems)
