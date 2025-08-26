#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Saudi Stock Market AI Analyzer
أداة الذكاء الاصطناعي لتحليل سوق الأسهم السعودي
"""

import numpy as np
import pandas as pd
import json
import requests
from datetime import datetime, timedelta
import warnings
import sys
warnings.filterwarnings('ignore')

# Try to import ML libraries (install if not available)
try:
	from sklearn.ensemble import RandomForestRegressor
	from sklearn.preprocessing import StandardScaler
	from sklearn.model_selection import train_test_split
	from sklearn.metrics import mean_squared_error, r2_score
	ML_AVAILABLE = True
except ImportError:
	ML_AVAILABLE = False
	# Send diagnostics to stderr to avoid breaking JSON output
	print("Warning: scikit-learn not available. Install with: pip install scikit-learn", file=sys.stderr)

try:
	import yfinance as yf
	YF_AVAILABLE = True
except ImportError:
	YF_AVAILABLE = False
	print("Warning: yfinance not available. Install with: pip install yfinance", file=sys.stderr)

class SaudiStockAnalyzer:
	"""محلل سوق الأسهم السعودي بالذكاء الاصطناعي"""
	
	def __init__(self):
		self.model = None
		self.scaler = StandardScaler()
		self.stocks_data = {}
		self.analysis_results = {}
		
		# Saudi market symbols mapping
		self.saudi_stocks = {
			'الراجحي': '1120.SR',
			'سابك': '2010.SR',
			'الاتصالات السعودية': '7010.SR',
			'البنك الأهلي': '1180.SR',
			'الرياض': '4200.SR',
			'الزيت العربية': '2222.SR',
			'كيمانول': '2350.SR',
			'الخزف السعودي': '2040.SR',
			'اللجين': '3020.SR',
			'الأنابيب': '2190.SR'
		}
	
	def fetch_stock_data(self, symbol, period='1y'):
		"""جلب بيانات الأسهم من Yahoo Finance"""
		if not YF_AVAILABLE:
			return self.generate_synthetic_data(symbol)
		
		try:
			stock = yf.Ticker(symbol)
			data = stock.history(period=period)
			return data
		except Exception as e:
			print(f"Error fetching data for {symbol}: {e}", file=sys.stderr)
			return self.generate_synthetic_data(symbol)
	
	def generate_synthetic_data(self, symbol):
		"""توليد بيانات اصطناعية للعرض التوضيحي"""
		dates = pd.date_range(start='2023-01-01', end=datetime.now(), freq='D')
		np.random.seed(hash(symbol) % 2**32)
		
		# Generate realistic price movements
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
		"""حساب المؤشرات الفنية"""
		indicators = {}
		
		# Moving averages
		indicators['SMA_20'] = data['Close'].rolling(window=20).mean()
		indicators['SMA_50'] = data['Close'].rolling(window=50).mean()
		indicators['EMA_12'] = data['Close'].ewm(span=12).mean()
		indicators['EMA_26'] = data['Close'].ewm(span=26).mean()
		
		# MACD
		indicators['MACD'] = indicators['EMA_12'] - indicators['EMA_26']
		indicators['MACD_Signal'] = indicators['MACD'].ewm(span=9).mean()
		indicators['MACD_Histogram'] = indicators['MACD'] - indicators['MACD_Signal']
		
		# RSI
		delta = data['Close'].diff()
		gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
		loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
		rs = gain / loss
		indicators['RSI'] = 100 - (100 / (1 + rs))
		
		# Bollinger Bands
		indicators['BB_Middle'] = data['Close'].rolling(window=20).mean()
		bb_std = data['Close'].rolling(window=20).std()
		indicators['BB_Upper'] = indicators['BB_Middle'] + (bb_std * 2)
		indicators['BB_Lower'] = indicators['BB_Middle'] - (bb_std * 2)
		
		# Volume indicators
		indicators['Volume_SMA'] = data['Volume'].rolling(window=20).mean()
		indicators['Volume_Ratio'] = data['Volume'] / indicators['Volume_SMA']
		
		return indicators
	
	def analyze_trend(self, data, indicators):
		"""تحليل الاتجاه العام للسهم"""
		current_price = data['Close'].iloc[-1]
		sma_20 = indicators['SMA_20'].iloc[-1]
		sma_50 = indicators['SMA_50'].iloc[-1]
		rsi = indicators['RSI'].iloc[-1]
		
		# Trend analysis
		if current_price > sma_20 > sma_50:
			trend = "صاعد"
			trend_strength = "قوي"
		elif current_price < sma_20 < sma_50:
			trend = "هابط"
			trend_strength = "قوي"
		elif current_price > sma_20 and sma_20 < sma_50:
			trend = "صاعد"
			trend_strength = "ضعيف"
		else:
			trend = "هابط"
			trend_strength = "ضعيف"
		
		# RSI analysis
		if rsi > 70:
			rsi_signal = "مفرط في الشراء"
		elif rsi < 30:
			rsi_signal = "مفرط في البيع"
		else:
			rsi_signal = "محايد"
		
		return {
			'trend': trend,
			'trend_strength': trend_strength,
			'rsi': round(rsi, 2),
			'rsi_signal': rsi_signal,
			'current_price': round(current_price, 2),
			'sma_20': round(sma_20, 2),
			'sma_50': round(sma_50, 2)
		}
	
	def predict_price(self, data, days_ahead=7):
		"""التنبؤ بأسعار الأسهم باستخدام التعلم الآلي"""
		if not ML_AVAILABLE:
			return self.simple_prediction(data, days_ahead)
		
		try:
			# Prepare features
			features = self.prepare_features(data)
			
			if len(features) < 50:  # Need sufficient data
				return self.simple_prediction(data, days_ahead)
			
			# Prepare target (future prices)
			target = data['Close'].shift(-1).dropna()
			features = features[:-1]  # Remove last row as we don't have future price
			
			# Split data
			X_train, X_test, y_train, y_test = train_test_split(
				features, target, test_size=0.2, random_state=42
			)
			
			# Scale features
			X_train_scaled = self.scaler.fit_transform(X_train)
			X_test_scaled = self.scaler.transform(X_test)
			
			# Train model
			self.model = RandomForestRegressor(n_estimators=100, random_state=42)
			self.model.fit(X_train_scaled, y_train)
			
			# Make predictions
			last_features = self.scaler.transform([features.iloc[-1]])
			prediction = self.model.predict(last_features)[0]
			
			# Calculate confidence based on model performance
			y_pred_test = self.model.predict(X_test_scaled)
			r2 = r2_score(y_test, y_pred_test)
			confidence = max(50, min(95, r2 * 100))
			
			return {
				'predicted_price': round(prediction, 2),
				'confidence': round(confidence, 1),
				'current_price': round(data['Close'].iloc[-1], 2),
				'predicted_change': round(prediction - data['Close'].iloc[-1], 2),
				'predicted_change_percent': round(((prediction - data['Close'].iloc[-1]) / data['Close'].iloc[-1]) * 100, 2),
				'days_ahead': days_ahead
			}
			
		except Exception as e:
			print(f"ML prediction failed: {e}", file=sys.stderr)
			return self.simple_prediction(data, days_ahead)
	
	def prepare_features(self, data):
		"""تحضير الميزات للتعلم الآلي"""
		features = pd.DataFrame()
		
		# Price features
		features['price'] = data['Close']
		features['price_change'] = data['Close'].pct_change()
		features['price_change_2d'] = data['Close'].pct_change(2)
		features['price_change_5d'] = data['Close'].pct_change(5)
		
		# Volume features
		features['volume'] = data['Volume']
		features['volume_change'] = data['Volume'].pct_change()
		features['volume_sma_ratio'] = data['Volume'] / data['Volume'].rolling(20).mean()
		
		# Technical indicators
		indicators = self.calculate_technical_indicators(data)
		features['rsi'] = indicators['RSI']
		features['macd'] = indicators['MACD']
		features['bb_position'] = (data['Close'] - indicators['BB_Lower']) / (indicators['BB_Upper'] - indicators['BB_Lower'])
		
		# Time features
		features['day_of_week'] = data.index.dayofweek
		features['month'] = data.index.month
		
		# Remove NaN values
		features = features.dropna()
		
		return features
	
	def simple_prediction(self, data, days_ahead):
		"""تنبؤ بسيط باستخدام المتوسط المتحرك"""
		current_price = data['Close'].iloc[-1]
		recent_returns = data['Close'].pct_change().tail(20).mean()
		
		# Simple trend-based prediction
		predicted_price = current_price * (1 + recent_returns * days_ahead)
		
		return {
			'predicted_price': round(predicted_price, 2),
			'confidence': 65.0,  # Lower confidence for simple prediction
			'current_price': round(current_price, 2),
			'predicted_change': round(predicted_price - current_price, 2),
			'predicted_change_percent': round(((predicted_price - current_price) / current_price) * 100, 2),
			'days_ahead': days_ahead,
			'method': 'simple_trend'
		}
	
	def analyze_risk(self, data, indicators):
		"""تحليل المخاطر"""
		current_price = data['Close'].iloc[-1]
		volatility = data['Close'].pct_change().std() * np.sqrt(252)  # Annualized volatility
		
		# Calculate Value at Risk (VaR)
		returns = data['Close'].pct_change().dropna()
		var_95 = np.percentile(returns, 5)
		
		# Risk assessment
		if volatility < 0.15:
			risk_level = "منخفض"
		elif volatility < 0.25:
			risk_level = "متوسط"
		else:
			risk_level = "عالي"
		
		# Support and resistance levels
		recent_high = data['High'].tail(20).max()
		recent_low = data['Low'].tail(20).min()
		
		return {
			'risk_level': risk_level,
			'volatility': round(volatility * 100, 2),
			'var_95': round(var_95 * 100, 2),
			'support_level': round(recent_low, 2),
			'resistance_level': round(recent_high, 2),
			'current_price': round(current_price, 2)
		}
	
	def generate_recommendations(self, analysis_results):
		"""توليد توصيات استثمارية"""
		recommendations = []
		
		for stock, analysis in analysis_results.items():
			trend = analysis.get('trend_analysis', {}).get('trend', '')
			risk = analysis.get('risk_analysis', {}).get('risk_level', '')
			prediction = analysis.get('price_prediction', {})
			
			if trend == "صاعد" and risk == "منخفض":
				recommendations.append(f"شراء {stock} - اتجاه إيجابي مع مخاطر منخفضة")
			elif trend == "صاعد" and risk == "متوسط":
				recommendations.append(f"شراء {stock} بحذر - اتجاه إيجابي مع مخاطر متوسطة")
			elif trend == "هابط" and risk == "عالي":
				recommendations.append(f"بيع {stock} - اتجاه سلبي مع مخاطر عالية")
			elif prediction.get('predicted_change_percent', 0) > 5:
				recommendations.append(f"شراء {stock} - توقع ارتفاع بنسبة {prediction['predicted_change_percent']}%")
			elif prediction.get('predicted_change_percent', 0) < -5:
				recommendations.append(f"بيع {stock} - توقع انخفاض بنسبة {abs(prediction['predicted_change_percent'])}%")
		
		return recommendations[:5]  # Return top 5 recommendations
	
	def analyze_all_stocks(self):
		"""تحليل جميع الأسهم السعودية"""
		results = {}
		
		for arabic_name, symbol in self.saudi_stocks.items():
			# Progress logs to stderr only
			print(f"تحليل {arabic_name}...", file=sys.stderr)
			
			# Fetch data
			data = self.fetch_stock_data(symbol)
			
			if data is not None and len(data) > 50:
				# Calculate indicators
				indicators = self.calculate_technical_indicators(data)
				
				# Perform analysis
				trend_analysis = self.analyze_trend(data, indicators)
				price_prediction = self.predict_price(data)
				risk_analysis = self.analyze_risk(data, indicators)
				
				results[arabic_name] = {
					'trend_analysis': trend_analysis,
					'price_prediction': price_prediction,
					'risk_analysis': risk_analysis,
					'technical_indicators': {
						'rsi': round(indicators['RSI'].iloc[-1], 2),
						'macd': round(indicators['MACD'].iloc[-1], 4),
						'bb_position': round((data['Close'].iloc[-1] - indicators['BB_Lower'].iloc[-1]) / 
							(indicators['BB_Upper'].iloc[-1] - indicators['BB_Lower'].iloc[-1]), 2)
					}
				}
		
		return results
	
	def save_analysis_results(self, filename='analysis_results.json'):
		"""حفظ نتائج التحليل"""
		with open(filename, 'w', encoding='utf-8') as f:
			json.dump(self.analysis_results, f, ensure_ascii=False, indent=2)
	
	def load_analysis_results(self, filename='analysis_results.json'):
		"""تحميل نتائج التحليل"""
		try:
			with open(filename, 'r', encoding='utf-8') as f:
				self.analysis_results = json.load(f)
		except FileNotFoundError:
			print(f"File {filename} not found", file=sys.stderr)
	
	def get_market_summary(self):
		"""ملخص السوق العام"""
		if not self.analysis_results:
			return {}
		
		total_stocks = len(self.analysis_results)
		bullish_stocks = sum(1 for analysis in self.analysis_results.values() 
					   if analysis.get('trend_analysis', {}).get('trend') == 'صاعد')
		bearish_stocks = sum(1 for analysis in self.analysis_results.values() 
					   if analysis.get('trend_analysis', {}).get('trend') == 'هابط')
		
		avg_confidence = np.mean([analysis.get('price_prediction', {}).get('confidence', 0) 
								for analysis in self.analysis_results.values()])
		
		return {
			'total_stocks': total_stocks,
			'bullish_stocks': bullish_stocks,
			'bearish_stocks': bearish_stocks,
			'neutral_stocks': total_stocks - bullish_stocks - bearish_stocks,
			'market_sentiment': 'إيجابي' if bullish_stocks > bearish_stocks else 'سلبي',
			'average_confidence': round(avg_confidence, 1),
			'timestamp': datetime.now().isoformat()
		}

	def analyze_portfolio(self, holdings):
		"""تحليل محفظة استثمارية.
		holdings: list of dicts [{"name": "الراجحي" or symbol, "weight": 30}, ...]
		"""
		# Normalize and map symbols
		clean = []
		for h in holdings or []:
			name = str(h.get('name') or h.get('symbol') or '').strip()
			weight = float(h.get('weight') or 0)
			if not name:
				continue
			symbol = self.saudi_stocks.get(name, name)
			clean.append({'name': name, 'symbol': symbol, 'weight': weight})
		
		if not clean:
			# Default simple portfolio
			clean = [
				{'name': 'الراجحي', 'symbol': self.saudi_stocks['الراجحي'], 'weight': 50},
				{'name': 'سابك', 'symbol': self.saudi_stocks['سابك'], 'weight': 50}
			]
		
		# Normalize weights to sum 1
		w_sum = sum(max(0.0, c['weight']) for c in clean)
		if w_sum <= 0:
			for c in clean:
				c['weight'] = 1.0 / len(clean)
		else:
			for c in clean:
				c['weight'] = max(0.0, c['weight']) / w_sum
		
		per_stock = []
		rets_matrix = []
		min_len = None
		
		for c in clean:
			data = self.fetch_stock_data(c['symbol'])
			if data is None or len(data) < 60:
				data = self.generate_synthetic_data(c['symbol'])
			
			# Daily returns
			daily = data['Close'].pct_change().dropna()
			if len(daily) == 0:
				daily = pd.Series([0.0])
			mu = float(daily.tail(60).mean()) * 252.0  # annualized expected return
			sigma = float(daily.tail(60).std()) * (252.0 ** 0.5)  # annualized volatility
			current_price = float(data['Close'].iloc[-1])
			trend = 'صاعد' if data['Close'].iloc[-1] > data['Close'].rolling(20).mean().iloc[-1] else 'هابط'
			
			per_stock.append({
				'name': c['name'],
				'symbol': c['symbol'],
				'weight': round(c['weight'], 4),
				'current_price': round(current_price, 2),
				'expected_return': round(mu * 100, 2),
				'volatility': round(sigma * 100, 2),
				'trend': trend
			})
			
			rets_matrix.append(daily.tail(120).reset_index(drop=True))
			min_len = len(rets_matrix[-1]) if min_len is None else min(min_len, len(rets_matrix[-1]))
		
		# Align returns length
		if min_len is None:
			min_len = 1
		align = [s.tail(min_len).values for s in rets_matrix]
		
		# Compute portfolio metrics
		weights = np.array([p['weight'] for p in per_stock])
		mus = np.array([p['expected_return'] for p in per_stock]) / 100.0
		sigmas = np.array([p['volatility'] for p in per_stock]) / 100.0
		
		# Estimate covariance matrix (if possible)
		try:
			if len(align) >= 2 and min_len > 5:
				R = np.vstack(align)
				cov = np.cov(R)
			else:
				cov = np.diag(sigmas ** 2)
		except Exception:
			cov = np.diag(sigmas ** 2)
		
		portfolio_return = float(np.dot(weights, mus))
		portfolio_vol = float(np.sqrt(weights @ cov @ weights))
		sharpe = (portfolio_return / portfolio_vol) if portfolio_vol > 0 else 0.0
		
		# Simple diversification score: 1 - sum(w^2)
		diversification = float(1.0 - float(np.sum(weights ** 2)))
		
		# Recommendations
		recs = []
		max_w = max(weights)
		max_name = per_stock[int(np.argmax(weights))]['name']
		if max_w > 0.4:
			recs.append(f"تقليل الوزن في {max_name} لأنه يتجاوز 40% من المحفظة")
		if portfolio_vol > 0.25:
			recs.append("خفض المخاطر العامة عبر زيادة التنويع أو إضافة أسهم دفاعية")
		for p in per_stock:
			if p['trend'] == 'هابط':
				recs.append(f"مراجعة مركز {p['name']} بسبب اتجاه هابط")
		if diversification < 0.5:
			recs.append("مستوى التنويع منخفض، حاول توزيع الأوزان على مزيد من الأسهم")
		
		return {
			'per_stock': per_stock,
			'expected_return': round(portfolio_return * 100, 2),
			'risk': round(portfolio_vol * 100, 2),
			'sharpe': round(sharpe, 2),
			'diversification': round(diversification, 2),
			'recommendations': recs
		}

def main():
	"""الدالة الرئيسية"""
	print("🚀 بدء تحليل سوق الأسهم السعودي بالذكاء الاصطناعي...", file=sys.stderr)
	
	analyzer = SaudiStockAnalyzer()
	
	# تحليل جميع الأسهم
	results = analyzer.analyze_all_stocks()
	analyzer.analysis_results = results
	
	# حفظ النتائج
	analyzer.save_analysis_results()
	
	# ملخص السوق
	summary = analyzer.get_market_summary()
	print("\n📊 ملخص السوق:", file=sys.stderr)
	print(f"إجمالي الأسهم المحللة: {summary['total_stocks']}", file=sys.stderr)
	print(f"الأسهم الصاعدة: {summary['bullish_stocks']}", file=sys.stderr)
	print(f"الأسهم الهابطة: {summary['bearish_stocks']}", file=sys.stderr)
	print(f"مزاج السوق: {summary['market_sentiment']}", file=sys.stderr)
	print(f"متوسط الثقة في التوقعات: {summary['average_confidence']}%", file=sys.stderr)
	
	# التوصيات
	recommendations = analyzer.generate_recommendations(results)
	print("\n💡 التوصيات الاستثمارية:", file=sys.stderr)
	for i, rec in enumerate(recommendations, 1):
		print(f"{i}. {rec}", file=sys.stderr)
	
	print(f"\n✅ تم حفظ النتائج في analysis_results.json", file=sys.stderr)
	return results

if __name__ == "__main__":
	main() 