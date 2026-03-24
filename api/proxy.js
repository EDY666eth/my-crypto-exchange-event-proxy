export default async function handler(req, res) {
    // 1. 設定 CORS，允許你的 GitHub Pages 網頁來拿資料
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // 處理預檢請求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ error: '沒有提供目標網址 (url parameter missing)' });
    }

    try {
        // 2. 核心魔法：偽裝成超逼真的正常電腦瀏覽器，欺騙交易所的防火牆
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/xml, application/xml, text/plain, */*',
                'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`交易所伺服器阻擋或無回應，狀態碼: ${response.status}`);
        }

        // 3. 拿到資料後，原封不動回傳給你的前端網頁
        const data = await response.text();
        
        // 判斷回傳類型，給予正確的 Header
        if (data.trim().startsWith('<')) {
            res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        } else {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
        
        res.status(200).send(data);

    } catch (error) {
        res.status(500).json({ error: '代理伺服器抓取失敗', details: error.message });
    }
}
