export default async function handler(req, res) {
    // 允許跨域請求
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).json({ error: 'Missing url parameter' });

    // 你的 ScraperAPI 專屬金鑰
    const SCRAPER_API_KEY = 'f745470ece5234dd702e65f95c5424d9';

    // 🚀 【終極防護穿透引擎】 🚀
    // 加上 premium=true (啟動最高級住宅 IP，硬穿防火牆)
    // 加上 country_code=tw (強制鎖定台灣 IP，逼幣安吐出中文)
    const proxyUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(targetUrl)}&premium=true&country_code=tw`;

    try {
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error(`ScraperAPI 回傳錯誤: ${response.status}`);
        }

        const data = await response.text();
        
        // 判斷回傳類型
        if (data.trim().startsWith('<')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
        } else {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
        
        res.status(200).send(data);

    } catch (error) {
        res.status(500).json({ error: '住宅代理抓取失敗', details: error.message });
    }
}
