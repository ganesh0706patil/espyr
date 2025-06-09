from .base_agent import BaseAgent
from models.session import SkillLevel

class SkillAssessorAgent(BaseAgent):
    async def assess_skill_level(self, user_input: str, problem_description: str, conversation_history: list) -> SkillLevel:
        system_prompt = """
        You are a skill assessment agent. Analyze the user's input and conversation history to determine their coding skill level.
        
        Criteria:
        - BEGINNER: Basic understanding, simple approaches, needs guidance on fundamentals
        - INTERMEDIATE: Good grasp of concepts, can think of multiple approaches, understands complexity
        - ADVANCED: Optimal solutions, considers edge cases, advanced algorithmic thinking
        
        Respond with only: "beginner", "intermediate", or "advanced"
        """
        
        conversation_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in conversation_history[-5:]])
        
        full_prompt = f"""
        Problem: {problem_description}
        Recent Conversation: {conversation_text}
        Current Input: {user_input}
        """
        
        result = self.gemini.send_prompt(full_prompt, system_prompt)
        
        # Clean and validate result
        skill_level = result.strip().lower()
        if skill_level in ["beginner", "intermediate", "advanced"]:
            return SkillLevel(skill_level)
        return SkillLevel.BEGINNER