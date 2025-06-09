from .base_agent import BaseAgent

class SubmitAgent(BaseAgent):
    async def evaluate_submission(self, code: str, problem_description: str, skill_level: str) -> tuple[str, bool]:
        system_prompt = """
        You are a code judge. Evaluate if the submitted code correctly solves the problem.
        
        Consider:
        1. Algorithm correctness
        2. Edge case handling
        3. Expected output format
        4. Logical completeness
        
        Respond in this format:
        RESULT: [PASS/FAIL]
        FEEDBACK: [Brief explanation in 1-2 sentences]
        """
        
        full_prompt = f"""
        Problem: {problem_description}
        User's Skill Level: {skill_level}
        
        Submitted Code:
        {code}
        """
        
        result = self.gemini.send_prompt(full_prompt, system_prompt)
        
        # Parse result
        lines = result.strip().split('\n')
        is_correct = False
        feedback = result
        
        for line in lines:
            if line.startswith('RESULT:'):
                is_correct = 'PASS' in line.upper()
            elif line.startswith('FEEDBACK:'):
                feedback = line.replace('FEEDBACK:', '').strip()
        
        return feedback, is_correct