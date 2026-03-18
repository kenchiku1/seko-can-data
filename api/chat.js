export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'APIキーが未設定です' });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "gemini-1.5-flash",
          messages: [{ role: "user", content: prompt }]
        })
      }
    );

    const data = await response.json();

    // エラーレスポンスのチェック
    if (data.error) {
      return res.status(500).json({ error: JSON.stringify(data.error) });
    }

    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({ error: 'AIからの応答が空でした。詳細: ' + JSON.stringify(data) });
    }

    res.status(200).json({ result: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
