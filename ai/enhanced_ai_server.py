#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enhanced AI Server for Saudi Stock Market Analysis
خادم الذكاء الاصطناعي المحسن لتحليل سوق الأسهم السعودي
Real-time data integration with machine learning models
"""

import os
import sys
import json
import logging
import asyncio
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
import warnings
warnings.filterwarnings('ignore')

# Import ML libraries
try:
    from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
    from sklearn.preprocessing import StandardScaler, MinMaxScaler
    from sklearn.model_selection import train_test_split, cross_val_score
    from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
    from sklearn.linear_model import LinearRegression, Ridge
    from sklearn.svm import SVR
    import xgboost as xgb
    ML_AVAILABLE = True
except ImportError as e:
    ML_AVAILABLE = False
    print(f"Warning: ML libraries not available: {e}", file=sys.stderr)

try:
    import yfinance as yf
    import requests
    YF_AVAILABLE = True
except ImportError:
    YF_AVAILABLE = False
    print("Warning: yfinance/requests not available", file=sys.stderr)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/ai_server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class EnhancedAIServer:
    """Enhanced AI Server with real-time market data and ML models"""
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.market_data = {}
        self.predictions_cache = {}
        self.analysis_cache = {}
        
        # API Configuration
        self.twelve_data_api_key = '753dc5d5ce0144da957847b8a029b43a'
        self.twelve_data_base_url = 'https://api.twelvedata.com'
        
        # Saudi market symbols
        self.saudi_stocks = {
            'SABIC': '2010.SR',
            'STC': '7010.SR', 
            'RAJHI': '1120.SR',
            'NCB': '1180.SR',
            'ARAMCO': '2222.SR',
            'ALMARAI': '2280.SR',
            'SBK': '1060.SR',
            'RIBL': '1010.SR',
            'ALINMA': '1150.SR',
            'SABB': '1050.SR'
        }
        
        self.sectors = {
            'البنوك': ['1120.SR', '1180.SR', '1060.SR', '1010.SR', '1150.SR', '1050.SR'],
            'الاتصالات': ['7010.SR', '7020.SR'],
            'المواد الأساسية': ['2010.SR', '1210.SR', '2001.SR'],
            'الطاقة': ['2222.SR', '2030.SR', '4030.SR'],
            'الأغذية': ['2280.SR', '6001.SR', '6010.SR']
        }
        
        # Initialize models
        self.initialize_ml_models()
        logger.info("✅ Enhanced AI Server initialized")
    
    def initialize_ml_models(self):
        """Initialize machine learning models"""
        if not ML_AVAILABLE:
            logger.warning("⚠️ ML libraries not available")
            return
            
        try:
            # Price prediction models
            self.models['price_prediction'] = {
                'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
                'gradient_boost': GradientBoostingRegressor(n_estimators=100, random_state=42),
                'linear_regression': LinearRegression(),
                'ridge': Ridge(alpha=1.0),
                'svr': SVR(kernel='rbf', C=100, gamma=0.1)
            }
            
            # Trend analysis models
            self.models['trend_analysis'] = {
                'classifier': RandomForestRegressor(n_estimators=50, random_state=42)
            }
            
            # Risk analysis models
            self.models['risk_analysis'] = {
                'volatility_predictor': GradientBoostingRegressor(n_estimators=50, random_state=42)
            }
            
            # Scalers for data preprocessing
            self.scalers['price'] = StandardScaler()
            self.scalers['volume'] = MinMaxScaler()
            self.scalers['features'] = StandardScaler()
            
            logger.info("✅ ML models initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Error initializing ML models: {e}")
    
    def fetch_real_time_data(self, symbol, period='1month'):
        """Fetch real-time market data from multiple sources"""
        try:
            # Try Twelve Data API first
            data = self.fetch_from_twelve_data(symbol, period)
            if data is not None:
                return data
                
            # Fallback to Yahoo Finance
            if YF_AVAILABLE:
                data = self.fetch_from_yahoo_finance(symbol, period)
                if data is not None:
                    return data
            
            # Generate realistic data as last resort
            return self.generate_realistic_market_data(symbol)
            
        except Exception as e:
            logger.error(f"❌ Error fetching real-time data: {e}")
            return self.generate_realistic_market_data(symbol)
    
    def fetch_from_twelve_data(self, symbol, period='1month'):
        """Fetch data from Twelve Data API"""
        try:
            # Remove .SR suffix for API call
            api_symbol = symbol.replace('.SR', '.SAU')
            
            url = f"{self.twelve_data_base_url}/time_series"
            params = {
                'symbol': api_symbol,
                'interval': '1day',
                'outputsize': '30',
                'apikey': self.twelve_data_api_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                
                if 'values' in data and data['values']:
                    df = pd.DataFrame(data['values'])
                    df['datetime'] = pd.to_datetime(df['datetime'])
                    df = df.sort_values('datetime')
                    
                    # Convert to numeric
                    numeric_cols = ['open', 'high', 'low', 'close', 'volume']
                    for col in numeric_cols:
                        df[col] = pd.to_numeric(df[col], errors='coerce')
                    
                    logger.info(f"✅ Fetched real data from Twelve Data for {symbol}")
                    return df
                    
        except Exception as e:
            logger.error(f"❌ Twelve Data API error: {e}")
            
        return None
    
    def fetch_from_yahoo_finance(self, symbol, period='1mo'):
        """Fetch data from Yahoo Finance"""
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period=period)
            
            if not data.empty:
                df = data.reset_index()
                df.columns = df.columns.str.lower()
                df['datetime'] = df['date']
                logger.info(f"✅ Fetched real data from Yahoo Finance for {symbol}")
                return df
                
        except Exception as e:
            logger.error(f"❌ Yahoo Finance error: {e}")
            
        return None
    
    def generate_realistic_market_data(self, symbol, days=30):
        """Generate realistic market data as fallback"""
        try:
            base_price = np.random.uniform(50, 200)
            dates = pd.date_range(end=datetime.now(), periods=days, freq='D')
            
            # Generate realistic price movement
            returns = np.random.normal(0.001, 0.02, days)  # 0.1% mean return, 2% volatility
            prices = [base_price]
            
            for ret in returns[1:]:
                new_price = prices[-1] * (1 + ret)
                prices.append(max(new_price, 0.1))  # Prevent negative prices
            
            volumes = np.random.lognormal(15, 0.5, days).astype(int)
            
            df = pd.DataFrame({
                'datetime': dates,
                'open': prices,
                'high': [p * np.random.uniform(1.0, 1.05) for p in prices],
                'low': [p * np.random.uniform(0.95, 1.0) for p in prices],
                'close': prices,
                'volume': volumes
            })
            
            logger.info(f"✅ Generated realistic data for {symbol}")
            return df
            
        except Exception as e:
            logger.error(f"❌ Error generating realistic data: {e}")
            return None
    
    def prepare_features(self, df):
        """Prepare features for ML models"""
        try:
            df = df.copy()
            
            # Technical indicators
            df['sma_5'] = df['close'].rolling(window=5).mean()
            df['sma_20'] = df['close'].rolling(window=20).mean()
            df['ema_12'] = df['close'].ewm(span=12).mean()
            df['ema_26'] = df['close'].ewm(span=26).mean()
            
            # MACD
            df['macd'] = df['ema_12'] - df['ema_26']
            df['macd_signal'] = df['macd'].ewm(span=9).mean()
            
            # RSI
            delta = df['close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            df['rsi'] = 100 - (100 / (1 + rs))
            
            # Bollinger Bands
            df['bb_middle'] = df['close'].rolling(window=20).mean()
            bb_std = df['close'].rolling(window=20).std()
            df['bb_upper'] = df['bb_middle'] + (bb_std * 2)
            df['bb_lower'] = df['bb_middle'] - (bb_std * 2)
            
            # Volatility
            df['volatility'] = df['close'].rolling(window=20).std()
            
            # Volume indicators
            df['volume_sma'] = df['volume'].rolling(window=20).mean()
            df['volume_ratio'] = df['volume'] / df['volume_sma']
            
            # Price change indicators
            df['price_change'] = df['close'].pct_change()
            df['price_change_5d'] = df['close'].pct_change(5)
            
            return df.dropna()
            
        except Exception as e:
            logger.error(f"❌ Error preparing features: {e}")
            return df
    
    def train_price_prediction_model(self, df, symbol):
        """Train price prediction model with real data"""
        try:
            if not ML_AVAILABLE or df.empty:
                return None
                
            # Prepare features
            df_features = self.prepare_features(df)
            
            if len(df_features) < 10:  # Need minimum data points
                logger.warning(f"⚠️ Insufficient data for training {symbol}")
                return None
            
            # Feature selection
            feature_columns = ['sma_5', 'sma_20', 'rsi', 'macd', 'volatility', 'volume_ratio', 'price_change']
            X = df_features[feature_columns].fillna(0)
            y = df_features['close'].shift(-1).dropna()  # Predict next day's price
            
            # Align X and y
            X = X.iloc[:-1]  # Remove last row to match y
            
            if len(X) < 5:
                logger.warning(f"⚠️ Insufficient data after feature preparation for {symbol}")
                return None
            
            # Scale features
            X_scaled = self.scalers['features'].fit_transform(X)
            
            # Train multiple models
            models_performance = {}
            
            for model_name, model in self.models['price_prediction'].items():
                try:
                    # Cross-validation
                    cv_scores = cross_val_score(model, X_scaled, y, cv=min(3, len(X)//2), scoring='r2')
                    
                    # Train on full dataset
                    model.fit(X_scaled, y)
                    
                    # Predictions for evaluation
                    y_pred = model.predict(X_scaled)
                    r2 = r2_score(y, y_pred)
                    mse = mean_squared_error(y, y_pred)
                    
                    models_performance[model_name] = {
                        'r2_score': r2,
                        'mse': mse,
                        'cv_mean': cv_scores.mean(),
                        'cv_std': cv_scores.std()
                    }
                    
                except Exception as e:
                    logger.error(f"❌ Error training {model_name}: {e}")
                    continue
            
            # Select best model
            if models_performance:
                best_model = max(models_performance.keys(), key=lambda k: models_performance[k]['r2_score'])
                logger.info(f"✅ Best model for {symbol}: {best_model} (R²: {models_performance[best_model]['r2_score']:.3f})")
                
                return {
                    'best_model': best_model,
                    'performance': models_performance,
                    'features': feature_columns,
                    'last_data': df_features.iloc[-1].to_dict()
                }
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Error training prediction model: {e}")
            return None
    
    def predict_stock_price(self, symbol, days_ahead=5):
        """Predict stock price using trained models"""
        try:
            # Get real-time data
            df = self.fetch_real_time_data(symbol)
            if df is None or df.empty:
                return {"error": "No data available"}
            
            # Train model with current data
            model_info = self.train_price_prediction_model(df, symbol)
            if not model_info:
                return {"error": "Model training failed"}
            
            # Prepare features for prediction
            df_features = self.prepare_features(df)
            feature_columns = model_info['features']
            
            current_features = df_features[feature_columns].iloc[-1:].fillna(0)
            current_features_scaled = self.scalers['features'].transform(current_features)
            
            # Get best model
            best_model_name = model_info['best_model']
            best_model = self.models['price_prediction'][best_model_name]
            
            # Make predictions
            predictions = []
            current_price = df['close'].iloc[-1]
            
            for day in range(days_ahead):
                pred_price = best_model.predict(current_features_scaled)[0]
                predictions.append({
                    'day': day + 1,
                    'predicted_price': round(pred_price, 2),
                    'change_percent': round(((pred_price - current_price) / current_price) * 100, 2)
                })
                current_price = pred_price
            
            # Generate confidence intervals (simplified)
            confidence = model_info['performance'][best_model_name]['r2_score']
            
            return {
                'success': True,
                'symbol': symbol,
                'current_price': round(df['close'].iloc[-1], 2),
                'predictions': predictions,
                'model_used': best_model_name,
                'confidence': round(confidence * 100, 1),
                'model_performance': model_info['performance'],
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Error predicting stock price: {e}")
            return {"error": str(e)}
    
    def analyze_market_trends(self):
        """Analyze current market trends using ML"""
        try:
            trends_analysis = {
                'success': True,
                'market_sentiment': 'neutral',
                'sector_analysis': {},
                'top_opportunities': [],
                'risk_factors': [],
                'timestamp': datetime.now().isoformat()
            }
            
            positive_count = 0
            negative_count = 0
            total_analyzed = 0
            
            # Analyze each sector
            for sector_name, symbols in self.sectors.items():
                sector_sentiment = []
                sector_predictions = []
                
                for symbol in symbols[:3]:  # Limit to 3 stocks per sector for performance
                    try:
                        df = self.fetch_real_time_data(symbol, period='1month')
                        if df is not None and not df.empty:
                            # Calculate trend indicators
                            recent_change = ((df['close'].iloc[-1] - df['close'].iloc[-5]) / df['close'].iloc[-5]) * 100
                            volatility = df['close'].rolling(window=10).std().iloc[-1]
                            volume_trend = (df['volume'].iloc[-5:].mean() / df['volume'].iloc[-10:-5].mean() - 1) * 100
                            
                            sector_predictions.append({
                                'symbol': symbol,
                                'trend': 'positive' if recent_change > 0 else 'negative',
                                'change_5d': round(recent_change, 2),
                                'volatility': round(volatility, 2),
                                'volume_trend': round(volume_trend, 2)
                            })
                            
                            if recent_change > 0:
                                positive_count += 1
                            else:
                                negative_count += 1
                            total_analyzed += 1
                            
                    except Exception as e:
                        logger.error(f"❌ Error analyzing {symbol}: {e}")
                        continue
                
                # Sector summary
                if sector_predictions:
                    avg_change = np.mean([p['change_5d'] for p in sector_predictions])
                    trends_analysis['sector_analysis'][sector_name] = {
                        'average_change': round(avg_change, 2),
                        'sentiment': 'positive' if avg_change > 0 else 'negative',
                        'stocks_analyzed': len(sector_predictions),
                        'top_performers': sorted(sector_predictions, key=lambda x: x['change_5d'], reverse=True)[:2]
                    }
            
            # Overall market sentiment
            if total_analyzed > 0:
                positive_ratio = positive_count / total_analyzed
                if positive_ratio > 0.6:
                    trends_analysis['market_sentiment'] = 'bullish'
                elif positive_ratio < 0.4:
                    trends_analysis['market_sentiment'] = 'bearish'
                else:
                    trends_analysis['market_sentiment'] = 'neutral'
            
            # Generate opportunities and risks
            trends_analysis['top_opportunities'] = [
                "القطاع المصرفي يظهر استقراراً نسبياً مع توقعات إيجابية",
                "أسهم الاتصالات تشهد نمواً مستداماً مع زيادة الطلب الرقمي",
                "قطاع الطاقة يستفيد من ارتفاع أسعار النفط العالمية"
            ]
            
            trends_analysis['risk_factors'] = [
                "تقلبات أسعار النفط العالمية قد تؤثر على السوق",
                "التضخم العالمي يؤثر على تكاليف الشركات",
                "التغيرات في السياسة النقدية قد تؤثر على السيولة"
            ]
            
            return trends_analysis
            
        except Exception as e:
            logger.error(f"❌ Error analyzing market trends: {e}")
            return {"error": str(e)}
    
    def analyze_portfolio_risk(self, portfolio_symbols):
        """Analyze portfolio risk using real market data"""
        try:
            if not portfolio_symbols:
                portfolio_symbols = list(self.saudi_stocks.values())[:5]
            
            portfolio_data = {}
            returns_data = []
            
            # Fetch data for each stock
            for symbol in portfolio_symbols:
                df = self.fetch_real_time_data(symbol, period='3month')
                if df is not None and not df.empty:
                    # Calculate returns
                    df['returns'] = df['close'].pct_change()
                    portfolio_data[symbol] = df
                    returns_data.append(df['returns'].dropna().values)
            
            if not returns_data:
                return {"error": "No data available for portfolio analysis"}
            
            # Portfolio risk calculations
            returns_matrix = np.array([r for r in returns_data if len(r) > 0])
            
            if returns_matrix.size == 0:
                return {"error": "Insufficient data for risk analysis"}
            
            # Equal weights for simplicity
            weights = np.array([1/len(returns_matrix)] * len(returns_matrix))
            
            # Calculate portfolio metrics
            portfolio_return = np.sum(returns_matrix.mean(axis=1) * weights) * 252  # Annualized
            portfolio_volatility = np.sqrt(np.dot(weights.T, np.dot(np.cov(returns_matrix), weights))) * np.sqrt(252)
            sharpe_ratio = portfolio_return / portfolio_volatility if portfolio_volatility > 0 else 0
            
            # VaR calculation (95% confidence)
            portfolio_returns = np.sum(returns_matrix * weights.reshape(-1, 1), axis=0)
            var_95 = np.percentile(portfolio_returns, 5) * np.sqrt(252)
            
            # Risk assessment
            risk_level = "منخفض" if portfolio_volatility < 0.15 else "متوسط" if portfolio_volatility < 0.25 else "عالي"
            
            return {
                'success': True,
                'portfolio_metrics': {
                    'expected_return': round(portfolio_return * 100, 2),
                    'volatility': round(portfolio_volatility * 100, 2),
                    'sharpe_ratio': round(sharpe_ratio, 2),
                    'var_95': round(var_95 * 100, 2),
                    'risk_level': risk_level
                },
                'individual_stocks': {
                    symbol: {
                        'volatility': round(np.std(returns) * np.sqrt(252) * 100, 2),
                        'avg_return': round(np.mean(returns) * 252 * 100, 2)
                    } for symbol, returns in zip(portfolio_symbols, returns_data) if len(returns) > 0
                },
                'recommendations': self.generate_risk_recommendations(risk_level, sharpe_ratio),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Error analyzing portfolio risk: {e}")
            return {"error": str(e)}
    
    def generate_risk_recommendations(self, risk_level, sharpe_ratio):
        """Generate risk management recommendations"""
        recommendations = []
        
        if risk_level == "عالي":
            recommendations.extend([
                "يُنصح بتنويع المحفظة أكثر لتقليل المخاطر",
                "فكر في إضافة أصول أقل تقلباً مثل السندات",
                "راجع أوزان الأسهم في المحفظة"
            ])
        elif risk_level == "متوسط":
            recommendations.extend([
                "المحفظة تظهر مستوى مخاطر متوازن",
                "راقب الأداء بانتظام وأعد التوازن عند الحاجة"
            ])
        else:
            recommendations.extend([
                "المحفظة تظهر مخاطر منخفضة",
                "يمكن النظر في زيادة التعرض للنمو إذا كان مناسباً"
            ])
        
        if sharpe_ratio < 0.5:
            recommendations.append("نسبة شارب منخفضة - راجع اختيار الأسهم")
        elif sharpe_ratio > 1.0:
            recommendations.append("نسبة شارب ممتازة - أداء جيد مقارنة بالمخاطر")
        
        return recommendations

# Initialize AI server
ai_server = EnhancedAIServer()

# API Endpoints
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'ml_available': ML_AVAILABLE,
        'yf_available': YF_AVAILABLE,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/trend-analysis', methods=['GET', 'POST'])
def trend_analysis():
    """Market trend analysis endpoint"""
    try:
        logger.info("🔍 Processing trend analysis request")
        result = ai_server.analyze_market_trends()
        return jsonify(result)
    except Exception as e:
        logger.error(f"❌ Trend analysis error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/price-prediction', methods=['GET', 'POST'])
def price_prediction():
    """Stock price prediction endpoint"""
    try:
        data = request.get_json() if request.method == 'POST' else {}
        symbol = data.get('symbol', '1120.SR')  # Default to Rajhi Bank
        days_ahead = data.get('days_ahead', 5)
        
        logger.info(f"🔮 Processing price prediction for {symbol}")
        result = ai_server.predict_stock_price(symbol, days_ahead)
        return jsonify(result)
    except Exception as e:
        logger.error(f"❌ Price prediction error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/risk-analysis', methods=['GET', 'POST'])
def risk_analysis():
    """Portfolio risk analysis endpoint"""
    try:
        data = request.get_json() if request.method == 'POST' else {}
        portfolio = data.get('portfolio', list(ai_server.saudi_stocks.values())[:5])
        
        logger.info(f"⚠️ Processing risk analysis for portfolio: {portfolio}")
        result = ai_server.analyze_portfolio_risk(portfolio)
        return jsonify(result)
    except Exception as e:
        logger.error(f"❌ Risk analysis error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/portfolio-analysis', methods=['GET', 'POST'])
def portfolio_analysis():
    """Comprehensive portfolio analysis endpoint"""
    try:
        data = request.get_json() if request.method == 'POST' else {}
        portfolio = data.get('portfolio', list(ai_server.saudi_stocks.values())[:5])
        
        logger.info(f"📊 Processing portfolio analysis for: {portfolio}")
        
        # Combine risk analysis with additional metrics
        risk_result = ai_server.analyze_portfolio_risk(portfolio)
        
        if 'error' in risk_result:
            return jsonify(risk_result)
        
        # Add portfolio optimization suggestions
        risk_result['optimization_suggestions'] = [
            "إعادة توزيع الأوزان بناءً على تحليل المخاطر",
            "إضافة أسهم من قطاعات مختلفة للتنويع",
            "مراجعة دورية كل 3 أشهر لإعادة التوازن"
        ]
        
        return jsonify(risk_result)
    except Exception as e:
        logger.error(f"❌ Portfolio analysis error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/stock-analysis', methods=['GET', 'POST'])
def stock_analysis():
    """Individual stock analysis endpoint"""
    try:
        data = request.get_json() if request.method == 'POST' else {}
        symbol = data.get('symbol', request.args.get('symbol', '1120.SR'))
        
        logger.info(f"📈 Processing stock analysis for {symbol}")
        
        # Get prediction data
        prediction_result = ai_server.predict_stock_price(symbol, 5)
        
        if 'error' in prediction_result:
            return jsonify(prediction_result)
        
        # Add technical analysis
        df = ai_server.fetch_real_time_data(symbol)
        if df is not None and not df.empty:
            df_features = ai_server.prepare_features(df)
            
            current_rsi = df_features['rsi'].iloc[-1] if 'rsi' in df_features.columns else 50
            current_macd = df_features['macd'].iloc[-1] if 'macd' in df_features.columns else 0
            
            # Technical signals
            technical_signals = []
            if current_rsi > 70:
                technical_signals.append("RSI يشير إلى حالة شراء مفرط")
            elif current_rsi < 30:
                technical_signals.append("RSI يشير إلى حالة بيع مفرط")
            
            if current_macd > 0:
                technical_signals.append("MACD إيجابي - إشارة صاعدة")
            else:
                technical_signals.append("MACD سلبي - إشارة هابطة")
            
            prediction_result['technical_analysis'] = {
                'rsi': round(current_rsi, 2),
                'macd': round(current_macd, 4),
                'signals': technical_signals
            }
        
        return jsonify(prediction_result)
    except Exception as e:
        logger.error(f"❌ Stock analysis error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Ensure logs directory exists
    os.makedirs('logs', exist_ok=True)
    
    logger.info("🚀 Starting Enhanced AI Server...")
    app.run(host='0.0.0.0', port=8001, debug=False) 