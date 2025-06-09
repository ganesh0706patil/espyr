from typing import List
from models.session import ChatMessage

# Simple simulated mentor logic based on skill level and user input
def get_mentor_response(skill_level: str, user_message: str) -> List[ChatMessage]:
    messages = []

    if skill_level == "Beginner":
        messages.append(ChatMessage(sender="mentor", text="What do you think the approach could be?"))
        messages.append(ChatMessage(sender="user", text=user_message))
        messages.append(ChatMessage(sender="mentor", text="That's a good start! What happens if the input size is 10^4?"))
        messages.append(ChatMessage(sender="mentor", text="Hint: Can a hashmap help you reduce time?"))
    elif skill_level == "Intermediate":
        messages.append(ChatMessage(sender="user", text=user_message))
        messages.append(ChatMessage(sender="mentor", text="Great! Watch out for duplicates. What's the complexity?"))
        messages.append(ChatMessage(sender="mentor", text="Opening code editor for you..."))
    else:  # Advanced
        messages.append(ChatMessage(sender="user", text=user_message))
        messages.append(ChatMessage(sender="mentor", text="Nice recognition. Can you prove why it's optimal?"))
        messages.append(ChatMessage(sender="codeAgent", text="Edge case: sorted array with negative numbers. Try adjusting your solution."))
        messages.append(ChatMessage(sender="user", text="Adjusting and testing..."))
        messages.append(ChatMessage(sender="mentor", text="Perfect. Final complexity?"))

    return messages