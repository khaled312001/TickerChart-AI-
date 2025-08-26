module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const apiInfo = {
            name: 'TickerChart AI API',
            version: '2.0.0',
            status: 'running',
            endpoints: [
                '/api/market-data',
                '/api/ai-analysis',
                '/api/sector-indicators',
                '/api/live-market-data'
            ],
            description: 'API لتحليل الأسواق المالية السعودية باستخدام الذكاء الاصطناعي',
            timestamp: new Date().toISOString()
        };

        res.status(200).json(apiInfo);
    } catch (error) {
        console.error('Error in index API:', error);
        res.status(500).json({ 
            error: 'API error',
            message: error.message 
        });
    }
}; 