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
        const sectors = [
            'البنوك',
            'الاتصالات',
            'الطاقة',
            'المواد الأساسية',
            'العقارات',
            'الرعاية الصحية',
            'السلع الاستهلاكية',
            'التكنولوجيا'
        ];

        const indicators = sectors.map(sector => ({
            sector: sector,
            performance: (Math.random() - 0.5) * 10,
            volume: Math.floor(Math.random() * 1000000),
            change: (Math.random() - 0.5) * 5,
            market_cap: Math.floor(Math.random() * 1000000000),
            pe_ratio: Math.random() * 50 + 10,
            dividend_yield: Math.random() * 5
        }));

        res.status(200).json(indicators);
    } catch (error) {
        console.error('Error in sector-indicators API:', error);
        res.status(500).json({ 
            error: 'Failed to fetch sector indicators',
            message: error.message 
        });
    }
}; 