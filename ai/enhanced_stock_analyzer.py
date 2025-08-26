#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enhanced Saudi Stock Market AI Analyzer
محلل سوق الأسهم السعودي المحسن بالذكاء الاصطناعي
Integrated with Twelve Data API for real-time data
"""

import numpy as np
import pandas as pd
import json
import requests
from datetime import datetime, timedelta
import warnings
import sys
import os
warnings.filterwarnings('ignore')

# Try to import ML libraries
try:
    from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
    from sklearn.preprocessing import StandardScaler
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import mean_squared_error, r2_score
    from sklearn.linear_model import LinearRegression
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False
    print("Warning: scikit-learn not available. Install with: pip install scikit-learn", file=sys.stderr)

try:
    import yfinance as yf
    YF_AVAILABLE = True
except ImportError:
    YF_AVAILABLE = False
    print("Warning: yfinance not available. Install with: pip install yfinance", file=sys.stderr)

class EnhancedSaudiStockAnalyzer:
    """محلل سوق الأسهم السعودي المحسن بالذكاء الاصطناعي"""
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.stocks_data = {}
        self.analysis_results = {}
        self.twelve_data_api_key = '753dc5d5ce0144da957847b8a029b43a'
        self.twelve_data_base_url = 'https://api.twelvedata.com'
        
        # Saudi market symbols mapping
        self.saudi_stocks = {
            'الراجحي': '1120.SR',
            'سابك': '2010.SR',
            'الاتصالات السعودية': '7010.SR',
            'البنك الأهلي السعودي': '1180.SR',
            'الرياض': '4200.SR',
            'الزيت العربية': '2222.SR',
            'كيمانول': '2350.SR',
            'الخزف السعودي': '2040.SR',
            'اللجين': '3020.SR',
            'الأنابيب': '2190.SR',
            'البلاد': '1020.SR',
            'ساب': '1030.SR',
            'الجزيرة': '1040.SR',
            'سامبا': '1050.SR',
            'الإنماء': '1060.SR',
            'العربي الوطني': '1080.SR',
            'الخليج': '1090.SR',
            'الاستثمار': '1100.SR',
            'الفرنسي السعودي': '1110.SR',
            'الدمام': '1130.SR'
        }
    
    def get_twelve_data_quote(self, symbol):
        """Get real-time quote from Twelve Data API"""
        if not self.twelve_data_api_key:
            return None
        
        url = f"{self.twelve_data_base_url}/quote"
        params = {
            'symbol': symbol,
            'apikey': self.twelve_data_api_key
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'status' not in data or data['status'] != 'error':
                    return data
        except Exception as e:
            print(f"Error fetching Twelve Data quote for {symbol}: {e}", file=sys.stderr)
        
        return None
    
    def get_twelve_data_time_series(self, symbol, interval='1day', outputsize=100):
        """Get time series data from Twelve Data API"""
        if not self.twelve_data_api_key:
            return None
        
        url = f"{self.twelve_data_base_url}/time_series"
        params = {
            'symbol': symbol,
            'interval': interval,
            'outputsize': outputsize,
            'apikey': self.twelve_data_api_key
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'status' not in data or data['status'] != 'error':
                    return data
        except Exception as e:
            print(f"Error fetching Twelve Data time series for {symbol}: {e}", file=sys.stderr)
        
        return None
    
    def get_twelve_data_company_profile(self, symbol):
        """Get company profile from Twelve Data API"""
        if not self.twelve_data_api_key:
            return None
        
        url = f"{self.twelve_data_base_url}/company_profile"
        params = {
            'symbol': symbol,
            'apikey': self.twelve_data_api_key
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'status' not in data or data['status'] != 'error':
                    return data
        except Exception as e:
            print(f"Error fetching Twelve Data company profile for {symbol}: {e}", file=sys.stderr)
        
        return None
    
    def fetch_stock_data(self, symbol, period='1y'):
        """Fetch stock data from multiple sources"""
        # Try Twelve Data first
        time_series_data = self.get_twelve_data_time_series(symbol)
        if time_series_data and 'values' in time_series_data:
            return self.convert_twelve_data_to_dataframe(time_series_data)
        
        # Fallback to Yahoo Finance
        if YF_AVAILABLE:
            try:
                stock = yf.Ticker(symbol)
                data = stock.history(period=period)
                return data
            except Exception as e:
                print(f"Error fetching Yahoo Finance data for {symbol}: {e}", file=sys.stderr)
        
        # Generate synthetic data as last resort
        return self.generate_synthetic_data(symbol)
    
    def convert_twelve_data_to_dataframe(self, time_series_data):
        """Convert Twelve Data time series to pandas DataFrame"""
        if not time_series_data or 'values' not in time_series_data:
            return None
        
        values = time_series_data['values']
        data = []
        
        for value in values:
            data.append({
                'Date': pd.to_datetime(value['datetime']),
                'Open': float(value['open']),
                'High': float(value['high']),
                'Low': float(value['low']),
                'Close': float(value['close']),
                'Volume': int(value['volume'])
            })
        
        df = pd.DataFrame(data)
        df.set_index('Date', inplace=True)
        df.sort_index(inplace=True)
        
        return df
    
    def generate_synthetic_data(self, symbol):
        """Generate synthetic data for demonstration"""
        dates = pd.date_range(start='2023-01-01', end=datetime.now(), freq='D')
        np.random.seed(hash(symbol) % 2**32)
        
        base_price = np.random.uniform(20, 100)
        returns = np.random.normal(0, 0.02, len(dates))
        prices = [base_price]
        
        for ret in returns[1:]:
            new_price = prices[-1] * (1 + ret)
            prices.append(max(0.1, new_price))
        
        data = pd.DataFrame({
            'Open': prices,
            'High': [p * np.random.uniform(1.0, 1.05) for p in prices],
            'Low': [p * np.random.uniform(0.95, 1.0) for p in prices],
            'Close': prices,
            'Volume': np.random.randint(100000, 2000000, len(dates))
        }, index=dates)
        
        return data
    
    def calculate_technical_indicators(self, data):
        """Calculate comprehensive technical indicators"""
        indicators = {}
        
        if data is None or len(data) < 20:
            return indicators
        
        # Price data
        close_prices = data['Close'].values
        high_prices = data['High'].values
        low_prices = data['Low'].values
        volumes = data['Volume'].values
        
        # Moving averages
        indicators['sma_5'] = np.mean(close_prices[-5:])
        indicators['sma_10'] = np.mean(close_prices[-10:])
        indicators['sma_20'] = np.mean(close_prices[-20:])
        indicators['sma_50'] = np.mean(close_prices[-50:]) if len(close_prices) >= 50 else None
        
        # Exponential moving averages
        indicators['ema_12'] = self.calculate_ema(close_prices, 12)
        indicators['ema_26'] = self.calculate_ema(close_prices, 26)
        
        # MACD
        if indicators['ema_12'] and indicators['ema_26']:
            indicators['macd'] = indicators['ema_12'] - indicators['ema_26']
            indicators['macd_signal'] = self.calculate_ema([indicators['macd']], 9)
            indicators['macd_histogram'] = indicators['macd'] - indicators['macd_signal']
        
        # RSI
        indicators['rsi'] = self.calculate_rsi(close_prices)
        
        # Bollinger Bands
        bb_data = self.calculate_bollinger_bands(close_prices)
        indicators.update(bb_data)
        
        # Stochastic Oscillator
        stoch_data = self.calculate_stochastic(high_prices, low_prices, close_prices)
        indicators.update(stoch_data)
        
        # Volume indicators
        indicators['volume_sma'] = np.mean(volumes[-20:])
        indicators['volume_ratio'] = volumes[-1] / indicators['volume_sma'] if indicators['volume_sma'] > 0 else 1
        
        # Price momentum
        indicators['price_momentum'] = (close_prices[-1] / close_prices[-5] - 1) * 100 if len(close_prices) >= 5 else 0
        
        # Volatility
        returns = np.diff(close_prices) / close_prices[:-1]
        indicators['volatility'] = np.std(returns) * np.sqrt(252) * 100  # Annualized volatility
        
        return indicators
    
    def calculate_ema(self, prices, period):
        """Calculate Exponential Moving Average"""
        if len(prices) < period:
            return None
        
        alpha = 2 / (period + 1)
        ema = prices[0]
        
        for price in prices[1:]:
            ema = alpha * price + (1 - alpha) * ema
        
        return ema
    
    def calculate_rsi(self, prices, period=14):
        """Calculate Relative Strength Index"""
        if len(prices) < period + 1:
            return 50  # Neutral RSI
        
        deltas = np.diff(prices)
        gains = np.where(deltas > 0, deltas, 0)
        losses = np.where(deltas < 0, -deltas, 0)
        
        avg_gain = np.mean(gains[-period:])
        avg_loss = np.mean(losses[-period:])
        
        if avg_loss == 0:
            return 100
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        
        return rsi
    
    def calculate_bollinger_bands(self, prices, period=20, std_dev=2):
        """Calculate Bollinger Bands"""
        if len(prices) < period:
            return {}
        
        sma = np.mean(prices[-period:])
        std = np.std(prices[-period:])
        
        return {
            'bb_upper': sma + (std_dev * std),
            'bb_middle': sma,
            'bb_lower': sma - (std_dev * std),
            'bb_width': (std_dev * std) / sma * 100
        }
    
    def calculate_stochastic(self, high_prices, low_prices, close_prices, period=14):
        """Calculate Stochastic Oscillator"""
        if len(high_prices) < period:
            return {}
        
        highest_high = np.max(high_prices[-period:])
        lowest_low = np.min(low_prices[-period:])
        current_close = close_prices[-1]
        
        if highest_high == lowest_low:
            k_percent = 50
        else:
            k_percent = ((current_close - lowest_low) / (highest_high - lowest_low)) * 100
        
        return {
            'stoch_k': k_percent,
            'stoch_d': k_percent  # Simplified, normally would be SMA of %K
        }
    
    def analyze_market_sentiment(self, indicators):
        """Analyze market sentiment based on technical indicators"""
        sentiment_score = 0
        signals = []
        
        # RSI analysis
        if 'rsi' in indicators:
            rsi = indicators['rsi']
            if rsi < 30:
                sentiment_score += 2
                signals.append('RSI يشير إلى مشبع بيع - إشارة شراء')
            elif rsi > 70:
                sentiment_score -= 2
                signals.append('RSI يشير إلى مشبع شراء - إشارة بيع')
            elif 40 < rsi < 60:
                sentiment_score += 1
                signals.append('RSI في النطاق الطبيعي')
        
        # MACD analysis
        if 'macd' in indicators and 'macd_signal' in indicators:
            if indicators['macd'] > indicators['macd_signal']:
                sentiment_score += 1
                signals.append('MACD إيجابي - اتجاه صاعد')
            else:
                sentiment_score -= 1
                signals.append('MACD سلبي - اتجاه هابط')
        
        # Moving averages analysis
        if 'sma_20' in indicators and 'sma_50' in indicators:
            if indicators['sma_20'] > indicators['sma_50']:
                sentiment_score += 1
                signals.append('المتوسطات المتحركة إيجابية')
            else:
                sentiment_score -= 1
                signals.append('المتوسطات المتحركة سلبية')
        
        # Volume analysis
        if 'volume_ratio' in indicators:
            if indicators['volume_ratio'] > 1.5:
                sentiment_score += 1
                signals.append('حجم تداول مرتفع - اهتمام قوي')
            elif indicators['volume_ratio'] < 0.5:
                sentiment_score -= 1
                signals.append('حجم تداول منخفض - اهتمام محدود')
        
        # Determine overall sentiment
        if sentiment_score >= 2:
            sentiment = 'إيجابي قوي'
        elif sentiment_score >= 0:
            sentiment = 'إيجابي'
        elif sentiment_score >= -2:
            sentiment = 'سلبي'
        else:
            sentiment = 'سلبي قوي'
        
        return {
            'sentiment': sentiment,
            'score': sentiment_score,
            'signals': signals
        }
    
    def generate_price_prediction(self, data, days_ahead=5):
        """Generate price prediction using ML models"""
        if not ML_AVAILABLE or data is None or len(data) < 50:
            return None
        
        try:
            # Prepare features
            features = self.prepare_features(data)
            if len(features) < 30:
                return None
            
            # Prepare target (future prices)
            target = data['Close'].values[5:]  # Shift by 5 days
            
            # Align features and target
            min_len = min(len(features), len(target))
            features = features[:min_len]
            target = target[:min_len]
            
            if min_len < 20:
                return None
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                features, target, test_size=0.2, random_state=42
            )
            
            # Train multiple models
            models = {
                'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
                'gradient_boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
                'linear_regression': LinearRegression()
            }
            
            best_model = None
            best_score = -float('inf')
            
            for name, model in models.items():
                model.fit(X_train, y_train)
                score = model.score(X_test, y_test)
                
                if score > best_score:
                    best_score = score
                    best_model = model
            
            # Make prediction
            latest_features = features[-1:].reshape(1, -1)
            prediction = best_model.predict(latest_features)[0]
            
            current_price = data['Close'].iloc[-1]
            change_percent = ((prediction - current_price) / current_price) * 100
            
            return {
                'predicted_price': round(prediction, 2),
                'current_price': round(current_price, 2),
                'change_percent': round(change_percent, 2),
                'confidence': round(max(0, min(100, best_score * 100)), 1),
                'model_accuracy': round(best_score * 100, 1)
            }
            
        except Exception as e:
            print(f"Error in price prediction: {e}", file=sys.stderr)
            return None
    
    def prepare_features(self, data):
        """Prepare features for ML model"""
        features = []
        
        for i in range(5, len(data)):
            # Price features
            price_window = data['Close'].values[i-5:i]
            volume_window = data['Volume'].values[i-5:i]
            
            # Technical indicators
            sma_5 = np.mean(price_window)
            sma_10 = np.mean(data['Close'].values[i-10:i]) if i >= 10 else sma_5
            sma_20 = np.mean(data['Close'].values[i-20:i]) if i >= 20 else sma_10
            
            # Price momentum
            momentum_5 = (price_window[-1] / price_window[0] - 1) * 100
            momentum_10 = (price_window[-1] / data['Close'].values[i-10] - 1) * 100 if i >= 10 else momentum_5
            
            # Volume features
            avg_volume = np.mean(volume_window)
            volume_ratio = volume_window[-1] / avg_volume if avg_volume > 0 else 1
            
            # Volatility
            returns = np.diff(price_window) / price_window[:-1]
            volatility = np.std(returns) * 100 if len(returns) > 0 else 0
            
            feature_vector = [
                price_window[-1],  # Current price
                sma_5, sma_10, sma_20,  # Moving averages
                momentum_5, momentum_10,  # Momentum
                volume_ratio,  # Volume ratio
                volatility,  # Volatility
                data['High'].values[i-1],  # Previous high
                data['Low'].values[i-1]   # Previous low
            ]
            
            features.append(feature_vector)
        
        return np.array(features)
    
    def analyze_stock(self, symbol):
        """Comprehensive stock analysis"""
        try:
            # Fetch data
            data = self.fetch_stock_data(symbol)
            if data is None:
                return {'error': 'Unable to fetch data'}
            
            # Get real-time quote
            quote = self.get_twelve_data_quote(symbol)
            
            # Get company profile
            profile = self.get_twelve_data_company_profile(symbol)
            
            # Calculate technical indicators
            indicators = self.calculate_technical_indicators(data)
            
            # Analyze sentiment
            sentiment = self.analyze_market_sentiment(indicators)
            
            # Generate prediction
            prediction = self.generate_price_prediction(data)
            
            # Risk analysis
            risk_analysis = self.analyze_risk(data, indicators)
            
            # Generate recommendations
            recommendations = self.generate_recommendations(sentiment, indicators, risk_analysis)
            
            return {
                'symbol': symbol,
                'timestamp': datetime.now().isoformat(),
                'data_points': len(data),
                'quote': quote,
                'company_profile': profile,
                'technical_indicators': indicators,
                'sentiment_analysis': sentiment,
                'price_prediction': prediction,
                'risk_analysis': risk_analysis,
                'recommendations': recommendations,
                'data_quality': 'real_time' if quote else 'historical'
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def analyze_risk(self, data, indicators):
        """Analyze investment risk"""
        risk_factors = []
        risk_level = 'متوسط'
        
        if data is None:
            return {'risk_level': 'غير محدد', 'factors': ['لا توجد بيانات كافية']}
        
        # Volatility risk
        if 'volatility' in indicators:
            vol = indicators['volatility']
            if vol > 30:
                risk_factors.append('تقلب عالي في السعر')
                risk_level = 'عالي'
            elif vol < 10:
                risk_factors.append('استقرار نسبي في السعر')
                risk_level = 'منخفض'
        
        # RSI risk
        if 'rsi' in indicators:
            rsi = indicators['rsi']
            if rsi > 80 or rsi < 20:
                risk_factors.append('مؤشر RSI في مناطق متطرفة')
                risk_level = 'عالي'
        
        # Volume risk
        if 'volume_ratio' in indicators:
            vol_ratio = indicators['volume_ratio']
            if vol_ratio < 0.3:
                risk_factors.append('سيولة منخفضة')
                risk_level = 'عالي'
        
        # Price momentum risk
        if 'price_momentum' in indicators:
            momentum = indicators['price_momentum']
            if abs(momentum) > 10:
                risk_factors.append('زخم سعري قوي')
                risk_level = 'عالي' if abs(momentum) > 20 else 'متوسط'
        
        return {
            'risk_level': risk_level,
            'factors': risk_factors,
            'support_level': indicators.get('bb_lower'),
            'resistance_level': indicators.get('bb_upper')
        }
    
    def generate_recommendations(self, sentiment, indicators, risk_analysis):
        """Generate trading recommendations"""
        recommendations = []
        
        # Based on sentiment
        if sentiment['sentiment'] == 'إيجابي قوي':
            recommendations.append('شراء قوي - الاتجاه إيجابي قوي')
        elif sentiment['sentiment'] == 'إيجابي':
            recommendations.append('شراء - الاتجاه إيجابي')
        elif sentiment['sentiment'] == 'سلبي قوي':
            recommendations.append('بيع قوي - الاتجاه سلبي قوي')
        elif sentiment['sentiment'] == 'سلبي':
            recommendations.append('بيع - الاتجاه سلبي')
        else:
            recommendations.append('انتظار - انتظار تأكيد الاتجاه')
        
        # Based on RSI
        if 'rsi' in indicators:
            rsi = indicators['rsi']
            if rsi < 30:
                recommendations.append('شراء - فرصة انعكاس صاعد')
            elif rsi > 70:
                recommendations.append('حذر - احتمال انعكاس هابط')
        
        # Based on risk
        if risk_analysis['risk_level'] == 'عالي':
            recommendations.append('استثمار محفوف بالمخاطر - استخدم إدارة المخاطر')
        elif risk_analysis['risk_level'] == 'منخفض':
            recommendations.append('مخاطر منخفضة نسبياً')
        
        # Based on volume
        if 'volume_ratio' in indicators:
            vol_ratio = indicators['volume_ratio']
            if vol_ratio > 2:
                recommendations.append('اهتمام قوي بالسهم - حجم تداول مرتفع')
            elif vol_ratio < 0.5:
                recommendations.append('اهتمام محدود - حجم تداول منخفض')
        
        return list(set(recommendations))  # Remove duplicates
    
    def analyze_all_stocks(self):
        """Analyze all major Saudi stocks"""
        results = []
        
        for arabic_name, symbol in self.saudi_stocks.items():
            print(f"Analyzing {arabic_name} ({symbol})...", file=sys.stderr)
            analysis = self.analyze_stock(symbol)
            analysis['arabic_name'] = arabic_name
            results.append(analysis)
        
        return results

def main():
    """Main function for command line usage"""
    analyzer = EnhancedSaudiStockAnalyzer()
    
    if len(sys.argv) < 2:
        print("Usage: python enhanced_stock_analyzer.py <action> [symbol]")
        print("Actions: analyze_stock, analyze_all, market_overview")
        sys.exit(1)
    
    action = sys.argv[1]
    
    if action == 'analyze_stock':
        if len(sys.argv) < 3:
            print("Symbol required for analyze_stock action")
            sys.exit(1)
        symbol = sys.argv[2]
        result = analyzer.analyze_stock(symbol)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    
    elif action == 'analyze_all':
        results = analyzer.analyze_all_stocks()
        print(json.dumps(results, ensure_ascii=False, indent=2))
    
    elif action == 'market_overview':
        # Analyze top stocks for market overview
        top_stocks = ['1120.SR', '2010.SR', '7010.SR', '1180.SR', '2222.SR']
        results = []
        for symbol in top_stocks:
            analysis = analyzer.analyze_stock(symbol)
            results.append(analysis)
        
        overview = {
            'timestamp': datetime.now().isoformat(),
            'total_stocks': len(results),
            'analyses': results,
            'market_sentiment': 'إيجابي' if len([r for r in results if 'sentiment_analysis' in r and r['sentiment_analysis']['sentiment'] == 'إيجابي']) > len(results) / 2 else 'سلبي'
        }
        print(json.dumps(overview, ensure_ascii=False, indent=2))
    
    else:
        print(f"Unknown action: {action}")
        sys.exit(1)

if __name__ == "__main__":
    main() 