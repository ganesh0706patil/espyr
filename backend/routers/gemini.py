import requests

class GeminiProClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.api_url = (
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        )
        self.headers = {
            "Content-Type": "application/json"
        }

    def send_prompt(self, prompt: str, system_instruction: str = None) -> str:
        contents = []

        # Add system role if provided
        if system_instruction:
            contents.append({
                "role": "model",
                "parts": [{"text": system_instruction}]
            })

        # Add user input
        contents.append({
            "role": "user",
            "parts": [{"text": prompt}]
        })

        payload = {
            "contents": contents
        }

        try:
            response = requests.post(
                url=f"{self.api_url}?key={self.api_key}",
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            data = response.json()

            return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            return f"[Gemini Error] {str(e)}"