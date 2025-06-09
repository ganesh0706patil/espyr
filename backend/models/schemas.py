from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    sender: str
    text: str

class MentorRequest(BaseModel):
    skill_level: str
    user_message: str

class MentorResponse(BaseModel):
    messages: List[ChatMessage]

class CodeAgentRequest(BaseModel):
    code: str
    question: Optional[str]

class CodeAgentResponse(BaseModel):
    feedback: str

class Problem(BaseModel):
    id: int
    title: str
    description: str

class ProblemsResponse(BaseModel):
    problems: List[Problem]