from .base_agent import BaseAgent

class CodeAnalyzerAgent(BaseAgent):
    async def analyze_code(self, code: str, problem_description: str, skill_level: str, conversation_history: list) -> str:
        system_prompt = f"""
        You are a code analysis expert. Analyze the provided code for correctness and optimization.
        
        User skill level: {skill_level}
        
        Provide feedback on:
        1. Correctness relative to the problem
        2. Time Complexity (TC) and Space Complexity (SC)
        3. Optimization suggestions appropriate for their skill level
        
        Keep feedback concise (2-3 lines) and encouraging.
        """
        
        approach_context = ""
        if conversation_history:
            approach_context = f"User's discussed approach: {conversation_history[-1].get('content', '')}"
        
        full_prompt = f"""
        Problem: {problem_description}
        {approach_context}
        
        User's Code:
        {code}
        """
        
        return self.gemini.send_prompt(full_prompt, system_prompt)