const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('assets'));
app.use(express.static('.'));

// Cache storage
let marketCache = {};
let analysisCache = {};

// Load cache on startup
async function loadCache() {
    try {
        const marketData = await fs.readFile('./api/market_cache.json', 'utf8');
        marketCache = JSON.parse(marketData);
    } catch (error) {
        console.log('No market cache found, starting fresh');
    }
    
    try {
        const analysisData = await fs.readFile('./api/analysis_results.json', 'utf8');
        analysisCache = JSON.parse(analysisData);
    } catch (error) {
        console.log('No analysis cache found, starting fresh');
    }
}

// Save cache periodically
async function saveCache() {
    try {
        await fs.writeFile('./api/market_cache.json', JSON.stringify(marketCache, null, 2));
        await fs.writeFile('./api/analysis_results.json', JSON.stringify(analysisCache, null, 2));
    } catch (error) {
        console.error('Error saving cache:', error);
    }
}

// Market data API
app.get('/api/market-data', async (req, res) => {
    try {
        const { symbol = 'TASI' } = req.query;
        
        if (marketCache[symbol] && Date.now() - marketCache[symbol].timestamp < 300000) {
            return res.json(marketCache[symbol].data);
        }

        // Simulate market data (replace with real API)
        const mockData = {
            symbol: symbol,
            price: Math.random() * 1000 + 500,
            change: (Math.random() - 0.5) * 20,
            volume: Math.floor(Math.random() * 1000000),
            timestamp: new Date().toISOString()
        };

        marketCache[symbol] = {
            data: mockData,
            timestamp: Date.now()
        };

        res.json(mockData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch market data' });
    }
});

// AI Analysis API
app.get('/api/ai-analysis', async (req, res) => {
    try {
        const { symbol = 'TASI' } = req.query;
        
        if (analysisCache[symbol] && Date.now() - analysisCache[symbol].timestamp < 600000) {
            return res.json(analysisCache[symbol].data);
        }

        // Simulate AI analysis
        const analysis = {
            symbol: symbol,
            sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
            confidence: Math.random() * 100,
            recommendation: Math.random() > 0.5 ? 'buy' : 'sell',
            analysis: 'AI analysis based on market patterns and technical indicators',
            timestamp: new Date().toISOString()
        };

        analysisCache[symbol] = {
            data: analysis,
            timestamp: Date.now()
        };

        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate AI analysis' });
    }
});

// Sector indicators API
app.get('/api/sector-indicators', async (req, res) => {
    try {
        const sectors = ['Banking', 'Telecom', 'Energy', 'Materials', 'Real Estate'];
        const indicators = sectors.map(sector => ({
            sector: sector,
            performance: (Math.random() - 0.5) * 10,
            volume: Math.floor(Math.random() * 1000000),
            change: (Math.random() - 0.5) * 5
        }));

        res.json(indicators);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sector indicators' });
    }
});

// Live market data API
app.get('/api/live-market-data', async (req, res) => {
    try {
        const liveData = {
            tasi: {
                current: Math.random() * 1000 + 500,
                change: (Math.random() - 0.5) * 20,
                volume: Math.floor(Math.random() * 1000000)
            },
            timestamp: new Date().toISOString()
        };

        res.json(liveData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch live market data' });
    }
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static files
app.use('/assets', express.static('assets'));
app.use('/css', express.static('assets/css'));
app.use('/js', express.static('assets/js'));

// API routes for compatibility
app.get('/api/index', (req, res) => {
    res.json({ message: 'API is running' });
});

app.get('/api/config', (req, res) => {
    res.json({ 
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Schedule cache saving every 5 minutes
cron.schedule('*/5 * * * *', saveCache);

// Start server
app.listen(PORT, async () => {
    await loadCache();
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the application`);
}); 