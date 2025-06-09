from .base_agent import BaseAgent

class ReadinessCheckerAgent(BaseAgent):
    async def check_readiness(self, user_input: str, problem_description: str, conversation_history: list, skill_level: str) -> bool:
        system_prompt = """
        You are a readiness assessment agent. Determine if the user is ready to start coding based on their approach understanding.
        
        The user is ready if they:
        1. Understand the problem clearly
        2. Have a clear approach/algorithm in mind
        3. Can explain their solution strategy
        4. Show confidence in their approach
        
        Respond with only: "1" (ready) or "0" (not ready)
        """
        
        conversation_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in conversation_history[-3:]])
        
        full_prompt = f"""
        Problem: {problem_description}
        User Skill Level: {skill_level}
        Recent Conversation: {conversation_text}
        Current Input: {user_input}
        """
        
        result = self.gemini.send_prompt(full_prompt, system_prompt)
        return result.strip() == "1"