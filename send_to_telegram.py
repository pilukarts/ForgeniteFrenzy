
import os
import asyncio
from telegram import Bot

async def main():
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")

    if not token:
        raise ValueError("TELEGRAM_BOT_TOKEN is not set.")
    if not chat_id:
        raise ValueError("TELEGRAM_CHAT_ID is not set.")

    bot = Bot(token)
    await bot.send_message(chat_id=chat_id, text="Hello from GitHub Actions! This is a test from the updated script.")

    # To send a file instead of a message, uncomment and use the lines below:
    # file_to_send = "README.md"
    # if os.path.exists(file_to_send):
    #     await bot.send_document(chat_id=chat_id, document=open(file_to_send, 'rb'))
    #     print(f"File sent: {file_to_send}")
    # else:
    #     print(f"File not found: {file_to_send}")

if __name__ == "__main__":
    # This check is necessary because the default asyncio event loop policy
    # may differ on various systems, especially in CI/CD environments.
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
    asyncio.run(main())
