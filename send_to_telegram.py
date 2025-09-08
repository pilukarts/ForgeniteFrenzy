import os
from telegram import Bot

token = os.environ.get("TELEGRAM_BOT_TOKEN")
chat_id = os.environ.get("TELEGRAM_CHAT_ID")

if not token:
    raise ValueError("TELEGRAM_BOT_TOKEN is not set.")
if not chat_id:
    raise ValueError("TELEGRAM_CHAT_ID is not set.")

bot = Bot(token)
bot.send_message(chat_id=chat_id, text="Hello from GitHub Actions!")

# To send a file instead of a message, uncomment and use the line below:
# bot.send_document(chat_id=chat_id, document=open('yourfile.txt', 'rb'))