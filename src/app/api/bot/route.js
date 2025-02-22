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
      [{ text: "Play Game", web_app: { url: "https://greenchie-b59ec.web.app/" } }],  // 게임 링크 수정
      [{ text: "Follow X", url: "https://x.com/gncmeme" }],
      // [{ text: "Join Official Telegram", url: "https://t.me/fnfs_official" }],
    ],
  };

  const message = `
🎄🤪 Greenchie set out to prank the meme coins celebrating the holiday season, but along the way, he discovered that the real magic of crypto lies in joy 😆✨ and collaboration 🤝🚀.
Initially causing chaos by stealing coins 💰😈, he soon realized that working together is what makes the ride to the moon 🌕🚀 possible!
  `;

  const picUrl = 'https://msdgbot.vercel.app/greenchiemain.jpg';  // public 폴더에 있는 이미지 파일 경로

  // ✅ GIF + 메시지 + 버튼을 한 번에 보냄
  await ctx.replyWithPhoto(picUrl, {
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

