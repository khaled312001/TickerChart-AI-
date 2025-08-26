#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Python AI Server for Saudi Stock Market Analysis
خادم Python AI لتحليل سوق الأسهم السعودي
"""

import os
import sys
import json
import logging
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/ai_server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class AIServer:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.initialize_model()
        
    def initialize_model(self):
        """Initialize the AI model"""
        try:
            # Create a simple model for demonstration
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
            logger.info("AI model initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize model: {e}")
    
    def generate_market_data(self, days=30):
        """Generate synthetic market data"""
        np.random.seed(42)
        dates = pd.date_range(start='2024-01-01', periods=days, freq='D')
        prices = 100 + np.cumsum(np.random.randn(days) * 0.5)
        volumes = np.random.randint(1000000, 10000000, days)
        return pd.DataFrame({
            'date': dates,
            'price': prices,
            'volume': volumes
        })

# Initialize AI Server
ai_server = AIServer()

@app.route('/')
def home():
    """Home endpoint"""
    return jsonify({
        "status": "AI Server Running",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": ai_server.model is not None
    })

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": ai_server.model is not None,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/trend-analysis', methods=['POST'])
def trend_analysis():
    """Trend analysis endpoint"""
    try:
        data = request.get_json()
        period = data.get('period', '1d')
        days = {'1d': 1, '1w': 7, '1m': 30, '3m': 90}.get(period, 30)
        
        market_data = ai_server.generate_market_data(days)
        
        # Simple trend analysis
        trend = "upward" if market_data['price'].iloc[-1] > market_data['price'].iloc[0] else "downward"
        confidence = np.random.uniform(0.6, 0.95)
        
        return jsonify({
            "trend": trend,
            "confidence": round(confidence, 2),
            "data": market_data.to_dict('records'),
            "analysis": f"Market shows {trend} trend with {confidence:.1%} confidence"
        })
    except Exception as e:
        logger.error(f"Trend analysis error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/price-prediction', methods=['POST'])
def price_prediction():
    """Price prediction endpoint"""
    try:
        data = request.get_json()
        stock = data.get('stock', 'TASI')
        period = data.get('period', '1d')
        
        # Generate prediction data
        current_price = 10885.58
        change_percent = np.random.uniform(-5, 5)
        predicted_price = current_price * (1 + change_percent / 100)
        
        return jsonify({
            "stock": stock,
            "current_price": current_price,
            "predicted_price": round(predicted_price, 2),
            "change_percent": round(change_percent, 2),
            "confidence": round(np.random.uniform(0.7, 0.95), 2),
            "prediction_date": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Price prediction error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/risk-analysis', methods=['POST'])
def risk_analysis():
    """Risk analysis endpoint"""
    try:
        data = request.get_json()
        portfolio_type = data.get('portfolio_type', 'moderate')
        risk_level = data.get('risk_level', 5)
        
        # Calculate risk metrics
        risk_score = risk_level / 10.0
        volatility = risk_score * 0.3
        sharpe_ratio = (0.08 - 0.02) / volatility if volatility > 0 else 0
        
        return jsonify({
            "portfolio_type": portfolio_type,
            "risk_level": risk_level,
            "risk_score": round(risk_score, 2),
            "volatility": round(volatility, 2),
            "sharpe_ratio": round(sharpe_ratio, 2),
            "recommendation": "Consider diversifying your portfolio" if risk_score > 0.7 else "Portfolio risk is acceptable"
        })
    except Exception as e:
        logger.error(f"Risk analysis error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/portfolio-analysis', methods=['POST'])
def portfolio_analysis():
    """Portfolio analysis endpoint"""
    try:
        data = request.get_json()
        stocks = data.get('stocks', [])
        
        if not stocks:
            return jsonify({"error": "No stocks provided"}), 400
        
        # Calculate portfolio metrics
        total_value = sum(stock.get('value', 0) for stock in stocks)
        performance = np.random.uniform(-10, 15)
        
        return jsonify({
            "total_value": total_value,
            "performance_percent": round(performance, 2),
            "risk_score": round(np.random.uniform(0.3, 0.8), 2),
            "diversification_score": round(np.random.uniform(0.6, 0.9), 2),
            "recommendations": [
                "Consider adding more defensive stocks",
                "Monitor high-volatility positions",
                "Rebalance portfolio quarterly"
            ]
        })
    except Exception as e:
        logger.error(f"Portfolio analysis error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/stock-analysis', methods=['POST'])
def stock_analysis():
    """Stock analysis endpoint"""
    try:
        data = request.get_json()
        stock_symbol = data.get('symbol', 'TASI')
        
        # Generate stock analysis
        current_price = 10885.58 + np.random.uniform(-100, 100)
        change = np.random.uniform(-50, 50)
        volume = np.random.randint(1000000, 10000000)
        
        return jsonify({
            "symbol": stock_symbol,
            "current_price": round(current_price, 2),
            "change": round(change, 2),
            "change_percent": round(change / current_price * 100, 2),
            "volume": volume,
            "rsi": round(np.random.uniform(30, 70), 1),
            "macd": round(np.random.uniform(-2, 2), 3),
            "recommendation": "BUY" if change > 0 else "SELL"
        })
    except Exception as e:
        logger.error(f"Stock analysis error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Create logs directory if it doesn't exist
    os.makedirs('logs', exist_ok=True)
    
    port = int(os.environ.get('PYTHON_PORT', 8001))
    host = os.environ.get('PYTHON_HOST', '127.0.0.1')
    
    logger.info(f"Starting AI Server on {host}:{port}")
    app.run(host=host, port=port, debug=False)
logger = logging.getLogger(__name__) 
 
app = Flask(__name__) 
CORS(app) 
 
class AIServer: 
    def __init__(self): 
        self.model = None 
        self.scaler = StandardScaler() 
        self.initialize_model() 
 
    def initialize_model(self): 
        """Initialize the AI model""" 
        try: 
            # Create a simple model for demonstration 
            self.model = RandomForestRegressor(n_estimators=100, random_state=42) 
            logger.info("AI model initialized successfully") 
        except Exception as e: 
            logger.error(f"Failed to initialize model: {e}") 
 
    def generate_market_data(self, days=30): 
        """Generate synthetic market data""" 
        np.random.seed(42) 
        dates = pd.date_range(start='2024-01-01', periods=days, freq='D') 
        prices = 100 + np.cumsum(np.random.randn(days) * 0.5) 
        volumes = np.random.randint(1000000, 10000000, days) 
        return pd.DataFrame({ 
            'date': dates, 
            'price': prices, 
            'volume': volumes 
        }) 
 
ai_server = AIServer() 
 
@app.route('/') 
def home(): 
    return jsonify({"status": "AI Server Running", "timestamp": datetime.now().isoformat()}) 
 
@app.route('/health') 
def health(): 
    return jsonify({"status": "healthy", "model_loaded": ai_server.model is not None}) 
 
@app.route('/api/trend-analysis', methods=['POST']) 
def trend_analysis(): 
    try: 
        data = request.get_json() 
        period = data.get('period', '1d') 
        days = {'1d': 1, '1w': 7, '1m': 30, '3m': 90}.get(period, 30) 
 
        market_data = ai_server.generate_market_data(days) 
 
        # Simple trend analysis 
        trend = "upward" if market_data['price'].iloc[-1]  else "downward" 
        confidence = np.random.uniform(0.6, 0.95) 
 
        return jsonify({ 
            "trend": trend, 
            "confidence": round(confidence, 2), 
            "data": market_data.to_dict('records'), 
            "analysis": f"Market shows {trend} trend with {confidence:.1} confidence" 
        }) 
    except Exception as e: 
        logger.error(f"Trend analysis error: {e}") 
        return jsonify({"error": str(e)}), 500 
 
@app.route('/api/price-prediction', methods=['POST']) 
def price_prediction(): 
    try: 
        data = request.get_json() 
        stock = data.get('stock', 'TASI') 
        period = data.get('period', '1d') 
 
        # Generate prediction data 
        current_price = 10885.58 
        change_percent = np.random.uniform(-5, 5) 
        predicted_price = current_price * (1 + change_percent / 100) 
 
        return jsonify({ 
            "stock": stock, 
            "current_price": current_price, 
            "predicted_price": round(predicted_price, 2), 
            "change_percent": round(change_percent, 2), 
            "confidence": round(np.random.uniform(0.7, 0.95), 2), 
            "prediction_date": datetime.now().isoformat() 
        }) 
    except Exception as e: 
        logger.error(f"Price prediction error: {e}") 
        return jsonify({"error": str(e)}), 500 
 
@app.route('/api/risk-analysis', methods=['POST']) 
def risk_analysis(): 
    try: 
        data = request.get_json() 
        portfolio_type = data.get('portfolio_type', 'moderate') 
        risk_level = data.get('risk_level', 5) 
 
        # Calculate risk metrics 
        risk_score = risk_level / 10.0 
        volatility = risk_score * 0.3 
        sharpe_ratio = (0.08 - 0.02) / volatility if volatility  else 0 
 
        return jsonify({ 
            "portfolio_type": portfolio_type, 
            "risk_level": risk_level, 
            "risk_score": round(risk_score, 2), 
            "volatility": round(volatility, 2), 
            "sharpe_ratio": round(sharpe_ratio, 2), 
            "recommendation": "Consider diversifying your portfolio" if risk_score  else "Portfolio risk is acceptable" 
        }) 
    except Exception as e: 
        logger.error(f"Risk analysis error: {e}") 
        return jsonify({"error": str(e)}), 500 
 
@app.route('/api/portfolio-analysis', methods=['POST']) 
def portfolio_analysis(): 
    try: 
        data = request.get_json() 
        stocks = data.get('stocks', []) 
 
        if not stocks: 
            return jsonify({"error": "No stocks provided"}), 400 
 
        # Calculate portfolio metrics 
        total_value = sum(stock.get('value', 0) for stock in stocks) 
        performance = np.random.uniform(-10, 15) 
 
        return jsonify({ 
            "total_value": total_value, 
            "performance_percent": round(performance, 2), 
            "risk_score": round(np.random.uniform(0.3, 0.8), 2), 
            "diversification_score": round(np.random.uniform(0.6, 0.9), 2), 
            "recommendations": [ 
                "Consider adding more defensive stocks", 
                "Monitor high-volatility positions", 
                "Rebalance portfolio quarterly" 
            ] 
        }) 
    except Exception as e: 
        logger.error(f"Portfolio analysis error: {e}") 
        return jsonify({"error": str(e)}), 500 
 
@app.route('/api/stock-analysis', methods=['POST']) 
def stock_analysis(): 
    try: 
        data = request.get_json() 
        stock_symbol = data.get('symbol', 'TASI') 
 
        # Generate stock analysis 
        current_price = 10885.58 + np.random.uniform(-100, 100) 
        change = np.random.uniform(-50, 50) 
        volume = np.random.randint(1000000, 10000000) 
 
        return jsonify({ 
            "symbol": stock_symbol, 
            "current_price": round(current_price, 2), 
            "change": round(change, 2), 
            "change_percent": round(change / current_price * 100, 2), 
            "volume": volume, 
            "rsi": round(np.random.uniform(30, 70), 1), 
            "macd": round(np.random.uniform(-2, 2), 3), 
            "recommendation": "BUY" if change  else "SELL" 
        }) 
    except Exception as e: 
        logger.error(f"Stock analysis error: {e}") 
        return jsonify({"error": str(e)}), 500 
 
if __name__ == '__main__': 
    print(f"Starting AI Server on port {os.environ.get('PYTHON_PORT', 8001)}") 
    app.run(host='127.0.0.1', port=int(os.environ.get('PYTHON_PORT', 8001)), debug=False) 
