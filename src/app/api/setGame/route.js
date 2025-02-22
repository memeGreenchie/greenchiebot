import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    
    const gameShortName = 'fnfscrazycar';  // Telegram Bot에 설정된 short name
    const gameUrl = 'https://fnfsgame.vercel.app/';  // 실제 게임 URL

    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setGameShortName`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        game_short_name: gameShortName,  // 게임의 short name
        game_url: gameUrl,  // 실제 게임 URL
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return NextResponse.json({ message: 'Game successfully set.' });
    } else {
      throw new Error('Failed to set game');
    }
  } catch (error) {
    console.error('Error setting game:', error);
    return NextResponse.json({ message: 'Error setting game', error: error.message }, { status: 500 });
  }
}

