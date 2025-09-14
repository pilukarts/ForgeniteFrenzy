
import os
import asyncio
from telegram import Bot

async def main():
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")

    if not token or not chat_id:
        print("Warning: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set.")
        print("Please configure these secrets in your GitHub repository settings to enable Telegram notifications.")
        print("Skipping Telegram notification.")
        return

    try:
        bot = Bot(token)
        await bot.send_message(chat_id=chat_id, text="Deployment in progress... A new version of Forgeite Frenzy is being forged!")
        print("Successfully sent Telegram notification.")
    except Exception as e:
        print(f"Error sending Telegram notification: {e}")


if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
    asyncio.run(main())
