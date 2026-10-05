
import { Telegraf, Context } from 'telegraf';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '';
const GAME_URL = 'https://auron-vanguard.web.app';

const bot = new Telegraf(TOKEN);

bot.start((ctx: Context) => {
  ctx.reply(
    'Welcome to Auron Vanguard!\nType /play to launch the game or /help for more info.'
  );
});

bot.help((ctx: Context) => {
  ctx.reply(
    `This bot is your gateway to Auron Vanguard.

Available commands:
/play - Launches the Auron Vanguard game.
/help - Shows this help message.`
  );
});

bot.command('play', (ctx: Context) => {
  ctx.reply('Tap the button below to play the game inside Telegram!', {
    reply_markup: {
      keyboard: [
        [
          {
            text: '▶️ Play Auron Vanguard',
            web_app: { url: GAME_URL }
          },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

bot.launch();
console.log('Bot is running...');
