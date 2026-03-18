export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'APIキーが未設定です' });

  try {
    // Googleのサーバーに、現在使えるモデルの一覧を直接問い合わせます
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: 'API Error: ' + JSON.stringify(data.error) });
    }

    if (!data.models) {
      return res.status(500).json({ error: 'モデル一覧が取得できませんでした。' });
    }

    // 使えるモデルの名前だけを抜き出して改行でつなぎます
    const modelNames = data.models.map(m => m.name).join('\n');

    // 画面の「解説」エリアに、使えるモデルの一覧を表示させます
    res.status(200).json({ result: "【現在利用可能なモデル一覧】\n" + modelNames });

  } catch (error) {
    res.status(500).json({ error: '通信エラー: ' + error.message });
  }
}
