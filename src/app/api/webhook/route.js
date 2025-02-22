// app/api/webhook/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received Webhook Body:", body);

    // Handle game callback query
    if (body.callback_query && body.callback_query.game_short_name) {
      await answerCallbackQuery(
        body.callback_query.id,
        "https://fnfsgame.vercel.app/"
      );
      return NextResponse.json({ ok: true });
    }

    // Handle regular messages
    if (body.message) {
      const chatId = body.message.from.id;
      const text = body.message.text;

      // Handle /start command
      if (text === '/start') {
        // Send the video, then text and inline keyboard
        await sendVideoAndKeyboard(chatId);
        return NextResponse.json({ ok: true });
      }

      // Handle other messages
      await sendTelegramMessage(chatId, `You said: ${text}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// Helper function to send the video, then text and inline keyboard
async function sendVideoAndKeyboard(chatId) {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendVideo`;

  // Step 1: Send the video
  const videoResponse = await fetch(TELEGRAM_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      video: "https://fnfsbot.vercel.app/fnfsgif.mp4", // public 폴더 내에 있는 .mp4 영상 URL
      caption: "🎬 Enjoy the game introduction video!", // 영상에 대한 캡션 (선택 사항)
    }),
  });

  // Step 2: Send the text introduction
  const message = `
🎉 Welcome to Fused n Furious! 🏎💨

Get ready to race, earn, and dominate! Fused n Furious is more than just a game—it's a P2E revolution where every race brings new opportunities. 🚀🔥

🏁 *Claim Your N₂O* – Fuel up and boost your rewards!  
⚡️ *Compete & Earn* – Race your way to the top and stack your winnings!  
🔥 *Play, Win, Repeat* – The thrill never stops in this high-speed battle!  

The race for N₂O is *ON*! Are you ready to shift into high gear and take the lead? 💨🏆  

🚗 *Let’s race & earn!* 🚗
  `;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: "Play Game", // 버튼 이름
          callback_data: "play_game", // 버튼 클릭 시 전달되는 데이터
        },
      ],
      [
        {
          text: "Follow X", // 버튼 이름
          url: "https://x.com/Fnfs_Official", // 버튼 클릭 시 이동할 URL
        },
      ],
      [
        {
          text: "Join Official Telegram", // 버튼 이름
          url: "https://t.me/fnfs_official", // 버튼 클릭 시 이동할 URL
        },
      ],
    ],
  };

  // Step 3: Send the introduction text with inline keyboard
  const messageResponse = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      reply_markup: inlineKeyboard, // 인라인 키보드 추가
    }),
  });

  return { videoResponse, messageResponse };
}

// Helper function to answer callback query
async function answerCallbackQuery(callbackQueryId, url) {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`;

  const response = await fetch(TELEGRAM_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      url: url,
    }),
  });

  return response.json();
}

// Helper function to send a regular text message
async function sendTelegramMessage(chatId, message) {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(TELEGRAM_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  });

  return response.json();
}
