
import { Telegraf, Context } from 'telegraf';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8275463245:AAEG-X1D8Y-xtppY_7WVJobn488WMxkYLEw';
const GAME_URL = 'https://forgeitedrenzy.online';

const bot = new Telegraf(TOKEN);

bot.start((ctx: Context) => {
  ctx.reply(
    'Welcome to Forgeite Frenzy!\nType /play to launch the game or /help for more info.'
  );
});

bot.help((ctx: Context) => {
  ctx.reply(
    `This bot is your gateway to Alliance Forge.

Available commands:
/play - Launches the Forgeite Frenzy game.
/help - Shows this help message.`
  );
});

bot.command('play', (ctx: Context) => {
  ctx.reply('Tap the button below to play the game inside Telegram!', {
    reply_markup: {
      keyboard: [
        [
          {
            text: '▶️ Play Forgeite Frenzy',
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
