
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var telegraf_1 = require("telegraf");
var TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8275463245:AAEG-X1D8Y-xtppY_7WVJobn488WMxkYLEw';
var GAME_URL = 'https://forgeitedrenzy.online';
var bot = new telegraf_1.Telegraf(TOKEN);
bot.start(function (ctx) {
    ctx.reply('Welcome to Forgeite Frenzy!\nType /play to launch the game or /help for more info.');
});
bot.help(function (ctx) {
    ctx.reply("This bot is your gateway to Alliance Forge.\n\nAvailable commands:\n/play - Launches the Forgeite Frenzy game.\n/help - Shows this help message.");
});
bot.command('play', function (ctx) {
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
