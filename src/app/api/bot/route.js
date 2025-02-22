require('dotenv').config();
const { Bot } = require("grammy");

// Telegram 봇 토큰
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

// 봇 초기화
await bot.init();

// /start 명령어 처리
bot.command("start", async (ctx) => {
  const keyboard = {
    inline_keyboard: [
      [{ text: "Play Game", web_app: { url: "https://mgdggame.vercel.app/" } }],  // 게임 링크 수정
      [{ text: "Follow X", url: "https://x.com/MSDG_official" }],
      // [{ text: "Join Official Telegram", url: "https://t.me/fnfs_official" }],
    ],
  };

  const message = `
✨ Welcome, Planescaller! 🔮

The Aether Rift has opened, and powerful magic surges through the realms. You have been chosen to restore balance, solve arcane puzzles, and master the forces of Aetherion!

🔥 What you can do here:
🧩 Solve mystical puzzles to unlock powerful spells
⚔️ Earn MSDG tokens through Play-to-Earn battles
🌍 Shape the world of Aetherion with your strategy

🚀 Your adventure begins now! Tap below to enter the realm of magic.

🔹 [Start Your Journey]
  `;

  const pngUrl = 'https://msdgbot.vercel.app/msdgpic.png';  // public 폴더에 있는 이미지 파일 경로

  // ✅ GIF + 메시지 + 버튼을 한 번에 보냄
  await ctx.replyWithPhoto(pngUrl, {
    caption: message,
    reply_markup: keyboard,
    parse_mode: "Markdown",
  });
});

// ✅ Vercel 서버리스 API로 실행
export async function POST(req) {
  try {
    const body = await req.json();
    await bot.handleUpdate(body);
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Bot Error:", error);
    return new Response("Error", { status: 500 });
  }
}

