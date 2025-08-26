const axios = require('axios');

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
        const { symbol = 'TASI' } = req.query;

        // Simulate market data (replace with real API calls)
        const mockData = {
            symbol: symbol,
            price: Math.random() * 1000 + 500,
            change: (Math.random() - 0.5) * 20,
            volume: Math.floor(Math.random() * 1000000),
            high: Math.random() * 1000 + 600,
            low: Math.random() * 500 + 400,
            open: Math.random() * 1000 + 500,
            timestamp: new Date().toISOString()
        };

        res.status(200).json(mockData);
    } catch (error) {
        console.error('Error in market-data API:', error);
        res.status(500).json({ 
            error: 'Failed to fetch market data',
            message: error.message 
        });
    }
}; 