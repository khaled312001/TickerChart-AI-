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
        const liveData = {
            tasi: {
                current: Math.random() * 1000 + 500,
                change: (Math.random() - 0.5) * 20,
                volume: Math.floor(Math.random() * 1000000),
                high: Math.random() * 1000 + 600,
                low: Math.random() * 500 + 400
            },
            top_gainers: [
                { symbol: 'SABIC', change: Math.random() * 5 + 1 },
                { symbol: 'STC', change: Math.random() * 4 + 1 },
                { symbol: 'RIYADH', change: Math.random() * 3 + 1 }
            ],
            top_losers: [
                { symbol: 'ALRAJHI', change: -(Math.random() * 3 + 1) },
                { symbol: 'SABIC', change: -(Math.random() * 2 + 1) },
                { symbol: 'STC', change: -(Math.random() * 2 + 1) }
            ],
            market_status: 'open',
            last_update: new Date().toISOString()
        };

        res.status(200).json(liveData);
    } catch (error) {
        console.error('Error in live-market-data API:', error);
        res.status(500).json({ 
            error: 'Failed to fetch live market data',
            message: error.message 
        });
    }
}; 