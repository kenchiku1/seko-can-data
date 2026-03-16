export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'APIキーが未設定' });

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 500 }
      })
    });

    const raw = await response.text();
    
    let data;
    try { data = JSON.parse(raw); }
    catch(e) { return res.status(500).json({ error: 'JSON解析エラー: ' + raw.substring(0,200) }); }

    if (!response.ok) {
      return res.status(500).json({ error: 'Geminiエラー: ' + JSON.stringify(data?.error) });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(500).json({ error: 'テキストなし: ' + JSON.stringify(data).substring(0,200) });

    res.status(200).json({ result: text });

  } catch (error) {
    res.status(500).json({ error: 'catchエラー: ' + error.message });
  }
}
