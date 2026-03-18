export default async function handler(req, res) {
  // アクセス許可の設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'APIキーが未設定です' });

  try {
    // 外部ツールを使わず、直接Googleに通信する最も原始的で確実な方法
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    // Googleからのエラー通知があればそのまま返す
    if (data.error) {
      return res.status(500).json({ error: JSON.stringify(data.error) });
    }

    // 回答テキストの抽出
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'AIからの応答が空でした。' });
    }

    res.status(200).json({ result: text });
  } catch (error) {
    res.status(500).json({ error: 'サーバー通信エラー: ' + error.message });
  }
}
