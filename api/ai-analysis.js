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

        // Simulate AI analysis
        const sentiment = Math.random() > 0.5 ? 'positive' : 'negative';
        const confidence = Math.random() * 100;
        const recommendation = Math.random() > 0.5 ? 'buy' : 'sell';
        
        const analysis = {
            symbol: symbol,
            sentiment: sentiment,
            confidence: confidence,
            recommendation: recommendation,
            analysis: `تحليل الذكاء الاصطناعي لـ ${symbol} يشير إلى ${sentiment === 'positive' ? 'اتجاه إيجابي' : 'اتجاه سلبي'} مع مستوى ثقة ${confidence.toFixed(1)}%`,
            technical_indicators: {
                rsi: Math.random() * 100,
                macd: (Math.random() - 0.5) * 2,
                moving_average: Math.random() * 1000 + 500
            },
            timestamp: new Date().toISOString()
        };

        res.status(200).json(analysis);
    } catch (error) {
        console.error('Error in ai-analysis API:', error);
        res.status(500).json({ 
            error: 'Failed to generate AI analysis',
            message: error.message 
        });
    }
}; 