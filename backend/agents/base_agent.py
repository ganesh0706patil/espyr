from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAgent(ABC):
    def __init__(self, gemini_client):
        self.gemini = gemini_client
        
    @abstractmethod
    async def process(self, **kwargs) -> Dict[str, Any]:
        pass