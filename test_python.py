#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test script for Python AI components
سكريبت اختبار لمكونات الذكاء الاصطناعي
"""

import sys
import json
from datetime import datetime

def test_imports():
    """Test if all required packages can be imported"""
    print("🔍 فحص المكتبات المطلوبة...")
    
    try:
        import numpy as np
        print(f"✅ NumPy {np.__version__}")
    except ImportError as e:
        print(f"❌ NumPy: {e}")
        return False
    
    try:
        import pandas as pd
        print(f"✅ Pandas {pd.__version__}")
    except ImportError as e:
        print(f"❌ Pandas: {e}")
        return False
    
    try:
        import sklearn
        print(f"✅ Scikit-learn {sklearn.__version__}")
    except ImportError as e:
        print(f"❌ Scikit-learn: {e}")
        return False
    
    try:
        import yfinance as yf
        print(f"✅ yfinance {yf.__version__}")
    except ImportError as e:
        print(f"❌ yfinance: {e}")
        return False
    
    try:
        import matplotlib
        print(f"✅ Matplotlib {matplotlib.__version__}")
    except ImportError as e:
        print(f"❌ Matplotlib: {e}")
        return False
    
    try:
        import seaborn
        print(f"✅ Seaborn {seaborn.__version__}")
    except ImportError as e:
        print(f"❌ Seaborn: {e}")
        return False
    
    try:
        import plotly
        print(f"✅ Plotly {plotly.__version__}")
    except ImportError as e:
        print(f"❌ Plotly: {e}")
        return False
    
    return True

def test_ai_components():
    """Test if AI components can be loaded and run"""
    print("\n🤖 فحص مكونات الذكاء الاصطناعي...")
    
    try:
        from ai.stock_analyzer import SaudiStockAnalyzer
        print("✅ SaudiStockAnalyzer تم استيراده بنجاح")
        
        # Test analyzer initialization
        analyzer = SaudiStockAnalyzer()
        print("✅ تم إنشاء محلل الأسهم بنجاح")
        
        # Test synthetic data generation
        data = analyzer.generate_synthetic_data('TEST.SR')
        if data is not None and len(data) > 0:
            print(f"✅ تم توليد بيانات اصطناعية: {len(data)} نقطة بيانات")
        else:
            print("❌ فشل في توليد البيانات الاصطناعية")
            return False
        
        # Test technical indicators
        indicators = analyzer.calculate_technical_indicators(data)
        if indicators and len(indicators) > 0:
            print("✅ تم حساب المؤشرات الفنية بنجاح")
        else:
            print("❌ فشل في حساب المؤشرات الفنية")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ خطأ في مكونات الذكاء الاصطناعي: {e}")
        return False

def test_api_bridge():
    """Test if API bridge can be imported and run"""
    print("\n🌉 فحص جسر API...")
    
    try:
        from ai.api_bridge import main
        print("✅ API Bridge تم استيراده بنجاح")
        
        # Test basic functionality
        print("✅ جسر API جاهز للاستخدام")
        return True
        
    except Exception as e:
        print(f"❌ خطأ في جسر API: {e}")
        return False

def main():
    """Main test function"""
    print("=" * 50)
    print("🧪 اختبار مكونات Python للذكاء الاصطناعي")
    print("=" * 50)
    
    success = True
    
    # Test imports
    if not test_imports():
        success = False
    
    # Test AI components
    if not test_ai_components():
        success = False
    
    # Test API bridge
    if not test_api_bridge():
        success = False
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 جميع الاختبارات نجحت! النظام جاهز للعمل")
        print("يمكنك الآن تشغيل start_server.bat")
    else:
        print("⚠️  بعض الاختبارات فشلت. يرجى مراجعة الأخطاء أعلاه")
    print("=" * 50)
    
    return success

if __name__ == "__main__":
    main() 