from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    sender: str  # 'mentor', 'user', or 'codeAgent'
    text: str

class MentorRequest(BaseModel):
    user_input: str
    skill_level: str
    problem_description: str

class MentorResponse(BaseModel):
    message: str

class CodeAgentRequest(BaseModel):
    code: str
    question: Optional[str] = None

class CodeAgentResponse(BaseModel):
    feedback: str

class Problem(BaseModel):
    id: int
    title: str
    description: str

class ProblemsResponse(BaseModel):
    problems: List[Problem]