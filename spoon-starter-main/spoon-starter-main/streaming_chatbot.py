"""
Simple streaming ChatBot demo .
"""
import asyncio
import os
from typing import Optional

from dotenv import load_dotenv

from spoon_ai.chat import ChatBot

load_dotenv()

# Public link used in the starter tweet; override with SPOON_STARTER_DEMO_LINK if you
# want the model to promote a specific live demo URL instead of the repo.
STARTER_DEMO_LINK = os.getenv(
    "SPOON_STARTER_DEMO_LINK", "https://github.com/XSpoonAi/spoon-starter"
)

SYSTEM_MESSAGE = (
    "You are a concise assistant. Always include real URLs rather than placeholders; "
    f"when mentioning the Spoon starter demo, use {STARTER_DEMO_LINK}."
)

Questions = [
    "Give me a concise overview of the Neo blockchain.",
    "List three real-world use cases for agentic OSes like SpoonOS.",
    f"Draft a short tweet announcing the Spoon starter demo. Include this link: {STARTER_DEMO_LINK}",
]

def create_chatbot() -> ChatBot:
    return ChatBot()

async def stream_chatbot_response(question: str, timeout: float = 60.0) -> None:
    chatbot = create_chatbot()
    messages = [{"role": "user", "content": question}]

    async for chunk in chatbot.astream(
        messages, system_msg=SYSTEM_MESSAGE, timeout=timeout
    ):
        print(chunk.delta, end="", flush=True)

async def main():
    print(" Streaming ChatBot Demo")
    print("=" * 50)

    for question in Questions:
        print("\n" + "=" * 50)
        print(f"Q: {question}")
        print("=" * 50)
        await stream_chatbot_response(question)

if __name__ == "__main__":
    asyncio.run(main())

