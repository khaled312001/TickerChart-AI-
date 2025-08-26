<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>اختبار API الجديد</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test-section { margin: 20px 0; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
        .success { background: #d4edda; border-color: #c3e6cb; }
        .error { background: #f8d7da; border-color: #f5c6cb; }
        .loading { background: #d1ecf1; border-color: #bee5eb; }
        button { padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; cursor: pointer; }
        .btn-primary { background: #007bff; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-warning { background: #ffc107; color: black; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>🧪 اختبار API الجديد - TickerChart AI</h1>
    
    <div class="test-section">
        <h3>1. اختبار بيانات السوق</h3>
        <button class="btn-primary" onclick="testMarketData()">جلب بيانات السوق</button>
        <div id="marketDataResult"></div>
    </div>
    
    <div class="test-section">
        <h3>2. اختبار بيانات TASI</h3>
        <button class="btn-success" onclick="testTASIData()">جلب بيانات TASI</button>
        <div id="tasiDataResult"></div>
    </div>
    
    <div class="test-section">
        <h3>3. اختبار ملخص السوق</h3>
        <button class="btn-warning" onclick="testMarketSummary()">جلب ملخص السوق</button>
        <div id="summaryResult"></div>
    </div>
    
    <div class="test-section">
        <h3>4. اختبار جميع البيانات</h3>
        <button class="btn-primary" onclick="testAllData()">اختبار شامل</button>
        <div id="allDataResult"></div>
    </div>

    <script>
        async function testMarketData() {
            const resultDiv = document.getElementById('marketDataResult');
            resultDiv.innerHTML = '<div class="loading">جاري الاختبار...</div>';
            
            try {
                const response = await fetch('api/working_market_api.php?action=market_data');
                const data = await response.json();
                
                if (data.success) {
                    resultDiv.innerHTML = `
                        <div class="success">
                            <h4>✅ نجح الاختبار!</h4>
                            <p>تم جلب ${data.data.stocks ? data.data.stocks.length : 0} سهم</p>
                            <p>معدل النجاح: ${data.data.summary ? data.data.summary.success_rate : 'N/A'}%</p>
                            <p>آخر تحديث: ${data.timestamp}</p>
                            <details>
                                <summary>عرض البيانات التفصيلية</summary>
                                <pre>${JSON.stringify(data, null, 2)}</pre>
                            </details>
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <div class="error">
                            <h4>❌ فشل الاختبار</h4>
                            <p>الخطأ: ${data.error}</p>
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                        </div>
                    `;
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="error">
                        <h4>❌ خطأ في الاتصال</h4>
                        <p>الخطأ: ${error.message}</p>
                    </div>
                `;
            }
        }
        
        async function testTASIData() {
            const resultDiv = document.getElementById('tasiDataResult');
            resultDiv.innerHTML = '<div class="loading">جاري الاختبار...</div>';
            
            try {
                const response = await fetch('api/working_market_api.php?action=tasi_data&period=1mo');
                const data = await response.json();
                
                if (data.success) {
                    resultDiv.innerHTML = `
                        <div class="success">
                            <h4>✅ نجح اختبار TASI!</h4>
                            <p>تم جلب ${data.data.length} نقطة بيانات</p>
                            <p>آخر تحديث: ${data.timestamp}</p>
                            <details>
                                <summary>عرض البيانات التفصيلية</summary>
                                <pre>${JSON.stringify(data, null, 2)}</pre>
                            </details>
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <div class="error">
                            <h4>❌ فشل اختبار TASI</h4>
                            <p>الخطأ: ${data.error}</p>
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                        </div>
                    `;
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="error">
                        <h4>❌ خطأ في الاتصال</h4>
                        <p>الخطأ: ${error.message}</p>
                    </div>
                `;
            }
        }
        
        async function testMarketSummary() {
            const resultDiv = document.getElementById('summaryResult');
            resultDiv.innerHTML = '<div class="loading">جاري الاختبار...</div>';
            
            try {
                const response = await fetch('api/working_market_api.php?action=market_summary');
                const data = await response.json();
                
                if (data.success) {
                    resultDiv.innerHTML = `
                        <div class="success">
                            <h4>✅ نجح اختبار ملخص السوق!</h4>
                            <p>حجم التداول: ${data.data.total_volume}</p>
                            <p>قيمة التداول: ${data.data.total_value}</p>
                            <p>عدد الصفقات: ${data.data.total_deals}</p>
                            <p>الشركات النشطة: ${data.data.active_companies}</p>
                            <p>الشركات المرتفعة: ${data.data.up_companies}</p>
                            <p>الشركات المنخفضة: ${data.data.down_companies}</p>
                            <p>الشركات الثابتة: ${data.data.stable_companies}</p>
                            <p>آخر تحديث: ${data.timestamp}</p>
                            <details>
                                <summary>عرض البيانات التفصيلية</summary>
                                <pre>${JSON.stringify(data, null, 2)}</pre>
                            </details>
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <div class="error">
                            <h4>❌ فشل اختبار ملخص السوق</h4>
                            <p>الخطأ: ${data.error}</p>
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                        </div>
                    `;
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="error">
                        <h4>❌ خطأ في الاتصال</h4>
                        <p>الخطأ: ${error.message}</p>
                    </div>
                `;
            }
        }
        
        async function testAllData() {
            const resultDiv = document.getElementById('allDataResult');
            resultDiv.innerHTML = '<div class="loading">جاري الاختبار الشامل...</div>';
            
            try {
                // Test all endpoints
                const results = await Promise.allSettled([
                    fetch('api/working_market_api.php?action=market_data'),
                    fetch('api/working_market_api.php?action=tasi_data&period=1mo'),
                    fetch('api/working_market_api.php?action=market_summary')
                ]);
                
                let successCount = 0;
                let totalCount = results.length;
                
                results.forEach((result, index) => {
                    if (result.status === 'fulfilled' && result.value.ok) {
                        successCount++;
                    }
                });
                
                const successRate = (successCount / totalCount) * 100;
                
                resultDiv.innerHTML = `
                    <div class="${successRate >= 80 ? 'success' : successRate >= 50 ? 'warning' : 'error'}">
                        <h4>📊 نتائج الاختبار الشامل</h4>
                        <p>معدل النجاح: ${successRate.toFixed(1)}% (${successCount}/${totalCount})</p>
                        <p>حالة API: ${successRate >= 80 ? 'ممتاز' : successRate >= 50 ? 'جيد' : 'ضعيف'}</p>
                        <details>
                            <summary>تفاصيل النتائج</summary>
                            <pre>${JSON.stringify(results, null, 2)}</pre>
                        </details>
                    </div>
                `;
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="error">
                        <h4>❌ خطأ في الاختبار الشامل</h4>
                        <p>الخطأ: ${error.message}</p>
                    </div>
                `;
            }
        }
        
        // Auto-test on page load
        window.addEventListener('load', function() {
            console.log('🧪 بدء الاختبار التلقائي...');
            setTimeout(testAllData, 1000);
        });
    </script>
</body>
</html> 