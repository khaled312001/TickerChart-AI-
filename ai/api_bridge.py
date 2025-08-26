#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
API Bridge for PHP Frontend to Python AI Backend
جسر API للواجهة الأمامية PHP مع خلفية Python AI
"""

import os
import sys
import json
import logging
import requests
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/api_bridge.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
PYTHON_AI_SERVER = os.environ.get('PYTHON_AI_SERVER', 'http://127.0.0.1:8001')
PHP_SERVER = os.environ.get('PHP_SERVER', 'http://127.0.0.1:8000')

class APIBridge:
    def __init__(self):
        self.python_server_url = PYTHON_AI_SERVER
        self.php_server_url = PHP_SERVER
        self.session = requests.Session()
        self.session.timeout = 30
        
    def check_python_server(self):
        """Check if Python AI server is running"""
        try:
            response = self.session.get(f"{self.python_server_url}/health")
            return response.status_code == 200
        except requests.exceptions.RequestException as e:
            logger.error(f"Python server check failed: {e}")
            return False
    
    def forward_request(self, endpoint, method='GET', data=None):
        """Forward request to Python AI server"""
        try:
            url = f"{self.python_server_url}{endpoint}"
            
            if method.upper() == 'GET':
                response = self.session.get(url)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data)
            else:
                return {"error": f"Unsupported method: {method}"}, 405
            
            return response.json(), response.status_code
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request forwarding failed: {e}")
            return {"error": "AI server unavailable"}, 503

# Initialize API Bridge
api_bridge = APIBridge()

@app.route('/')
def home():
    """Home endpoint"""
    return jsonify({
        "service": "API Bridge",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "python_server": PYTHON_AI_SERVER,
        "php_server": PHP_SERVER
    })

@app.route('/health')
def health():
    """Health check endpoint"""
    python_server_healthy = api_bridge.check_python_server()
    
    return jsonify({
        "status": "healthy" if python_server_healthy else "degraded",
        "python_server": "connected" if python_server_healthy else "disconnected",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/trend-analysis', methods=['POST'])
def trend_analysis():
    """Forward trend analysis request to Python AI server"""
    try:
        data = request.get_json()
        logger.info(f"Trend analysis request: {data}")
        
        response, status_code = api_bridge.forward_request('/api/trend-analysis', 'POST', data)
        return jsonify(response), status_code
        
    except Exception as e:
        logger.error(f"Trend analysis error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/price-prediction', methods=['POST'])
def price_prediction():
    """Forward price prediction request to Python AI server"""
    try:
        data = request.get_json()
        logger.info(f"Price prediction request: {data}")
        
        response, status_code = api_bridge.forward_request('/api/price-prediction', 'POST', data)
        return jsonify(response), status_code
        
    except Exception as e:
        logger.error(f"Price prediction error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/risk-analysis', methods=['POST'])
def risk_analysis():
    """Forward risk analysis request to Python AI server"""
    try:
        data = request.get_json()
        logger.info(f"Risk analysis request: {data}")
        
        response, status_code = api_bridge.forward_request('/api/risk-analysis', 'POST', data)
        return jsonify(response), status_code
        
    except Exception as e:
        logger.error(f"Risk analysis error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/portfolio-analysis', methods=['POST'])
def portfolio_analysis():
    """Forward portfolio analysis request to Python AI server"""
    try:
        data = request.get_json()
        logger.info(f"Portfolio analysis request: {data}")
        
        response, status_code = api_bridge.forward_request('/api/portfolio-analysis', 'POST', data)
        return jsonify(response), status_code
        
    except Exception as e:
        logger.error(f"Portfolio analysis error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/stock-analysis', methods=['POST'])
def stock_analysis():
    """Forward stock analysis request to Python AI server"""
    try:
        data = request.get_json()
        logger.info(f"Stock analysis request: {data}")
        
        response, status_code = api_bridge.forward_request('/api/stock-analysis', 'POST', data)
        return jsonify(response), status_code
        
    except Exception as e:
        logger.error(f"Stock analysis error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/market-data', methods=['GET'])
def market_data():
    """Get market data from PHP server"""
    try:
        response = requests.get(f"{PHP_SERVER}/api/real-time-market-api.php?action=market_overview")
        return response.json(), response.status_code
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Market data request failed: {e}")
        return jsonify({"error": "Market data unavailable"}), 503

@app.route('/api/status')
def status():
    """Get status of all services"""
    python_healthy = api_bridge.check_python_server()
    
    try:
        php_response = requests.get(f"{PHP_SERVER}/test_simple.php", timeout=5)
        php_healthy = php_response.status_code == 200
    except:
        php_healthy = False
    
    return jsonify({
        "timestamp": datetime.now().isoformat(),
        "services": {
            "api_bridge": "healthy",
            "python_ai_server": "healthy" if python_healthy else "unhealthy",
            "php_server": "healthy" if php_healthy else "unhealthy"
        },
        "endpoints": {
            "python_server": PYTHON_AI_SERVER,
            "php_server": PHP_SERVER
        }
    })

if __name__ == '__main__':
    # Create logs directory if it doesn't exist
    os.makedirs('logs', exist_ok=True)
    
    port = int(os.environ.get('BRIDGE_PORT', 8002))
    host = os.environ.get('BRIDGE_HOST', '127.0.0.1')
    
    logger.info(f"Starting API Bridge on {host}:{port}")
    logger.info(f"Python AI Server: {PYTHON_AI_SERVER}")
    logger.info(f"PHP Server: {PHP_SERVER}")
    
    app.run(host=host, port=port, debug=False) 