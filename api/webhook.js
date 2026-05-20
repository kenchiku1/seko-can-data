const line = require('@line/bot-sdk');

// 環境変数からLINEの鍵を読み込む設定
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

export default async function handler(req, res) {
  // LINE以外からのアクセスは弾く
  if (req.method !== 'POST') {
    return res.status(200).send('Method Not Allowed');
  }

  try {
    const events = req.body.events;
    
    // イベントごとに処理を実行
    for (const event of events) {
      // ユーザーがテキストを送ってきた場合のテスト処理
      if (event.type === 'message' && event.message.type === 'text') {
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'Vercelとの接続テスト成功です！次のステップに進みましょう！'
        });
      }
    }
    
    // LINE側に「無事に受け取った」と返す（重要）
    res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
