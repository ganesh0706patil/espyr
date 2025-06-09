from .base_agent import BaseAgent

class HintAgent(BaseAgent):
    async def generate_hint(self, code: str, problem_description: str, skill_level: str, conversation_history: list) -> str:
        system_prompt = f"""
        You are a hint generator. Provide helpful hints without giving away the complete solution.
        
        User skill level: {skill_level}
        
        Guidelines:
        - For beginners: Give more direct guidance on concepts
        - For intermediate: Point out specific issues or improvements
        - For advanced: Suggest optimization techniques or edge cases
        
        Provide a helpful hint that guides them toward the solution without solving it for them.
        """
        
        approach_context = ""
        if conversation_history:
            approach_context = f"User's original approach: {conversation_history[0].get('content', '')}"
        
        full_prompt = f"""
        Problem: {problem_description}
        {approach_context}
        
        Current Code:
        {code}
        """
        
        return self.gemini.send_prompt(full_prompt, system_prompt)