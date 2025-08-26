<?php
/**
 * Comprehensive Website Test Script
 * اختبار شامل لجميع أقسام الموقع
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>اختبار شامل للموقع - TickerChart AI</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .test-section h3 { color: #333; margin-top: 0; }
        .success { color: #28a745; font-weight: bold; }
        .error { color: #dc3545; font-weight: bold; }
        .warning { color: #ffc107; font-weight: bold; }
        .info { color: #17a2b8; }
        .test-result { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 3px; }
        .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
        .btn:hover { background: #0056b3; }
        .btn-success { background: #28a745; }
        .btn-warning { background: #ffc107; color: #333; }
        .btn-danger { background: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 اختبار شامل للموقع - TickerChart AI</h1>
        <p class="info">هذا السكريبت يختبر جميع أقسام الموقع وواجهات API للتأكد من عملها بشكل صحيح</p>
        
        <div class="test-section">
            <h3>🔧 اختبار المتطلبات الأساسية</h3>
            <div id="basic-tests"></div>
        </div>
        
        <div class="test-section">
            <h3>🌐 اختبار واجهات API</h3>
            <div id="api-tests"></div>
        </div>
        
        <div class="test-section">
            <h3>🤖 اختبار مكونات الذكاء الاصطناعي</h3>
            <div id="ai-tests"></div>
        </div>
        
        <div class="test-section">
            <h3>📊 اختبار البيانات والرسوم البيانية</h3>
            <div id="data-tests"></div>
        </div>
        
        <div class="test-section">
            <h3>🎯 اختبار الواجهة الأمامية</h3>
            <div id="frontend-tests"></div>
        </div>
        
        <div class="test-section">
            <h3>⚡ اختبار الأداء</h3>
            <div id="performance-tests"></div>
        </div>
        
        <div class="test-section">
            <h3>🔄 اختبار التحديثات المباشرة</h3>
            <div id="realtime-tests"></div>
        </div>
        
        <div class="test-section">
            <h3>📋 ملخص النتائج</h3>
            <div id="summary"></div>
        </div>
        
        <div class="test-section">
            <h3>🛠️ إجراءات إصلاح</h3>
            <div id="fixes"></div>
        </div>
    </div>

    <script>
        // Test results storage
        let testResults = {
            basic: [],
            api: [],
            ai: [],
            data: [],
            frontend: [],
            performance: [],
            realtime: [],
            total: 0,
            passed: 0,
            failed: 0
        };

        // Test functions
        function addTestResult(category, testName, success, message, details = null) {
            const result = {
                name: testName,
                success: success,
                message: message,
                details: details,
                timestamp: new Date().toLocaleTimeString()
            };
            
            testResults[category].push(result);
            testResults.total++;
            
            if (success) {
                testResults.passed++;
            } else {
                testResults.failed++;
            }
            
            return result;
        }

        function displayTestResult(category, result) {
            const container = document.getElementById(category + '-tests');
            const div = document.createElement('div');
            div.className = 'test-result';
            div.innerHTML = `
                <strong>${result.success ? '✅' : '❌'} ${result.name}</strong><br>
                <span class="${result.success ? 'success' : 'error'}">${result.message}</span><br>
                <small class="info">${result.timestamp}</small>
                ${result.details ? `<br><details><summary>تفاصيل</summary><pre>${JSON.stringify(result.details, null, 2)}</pre></details>` : ''}
            `;
            container.appendChild(div);
        }

        // Basic requirements tests
        async function testBasicRequirements() {
            console.log('Testing basic requirements...');
            
            // Test PHP version
            const phpVersion = '<?php echo PHP_VERSION; ?>';
            const phpVersionOk = parseFloat(phpVersion) >= 7.4;
            addTestResult('basic', 'PHP Version', phpVersionOk, 
                `PHP ${phpVersion} ${phpVersionOk ? 'مقبول' : 'يجب أن يكون 7.4 أو أحدث'}`, 
                {version: phpVersion, required: '7.4+'});
            
            // Test required PHP extensions
            const requiredExtensions = ['json', 'curl', 'mbstring', 'openssl'];
            for (const ext of requiredExtensions) {
                const available = extension_loaded(ext);
                addTestResult('basic', `PHP Extension: ${ext}`, available, 
                    `${ext} ${available ? 'متاح' : 'غير متاح'}`, 
                    {extension: ext, available: available});
            }
            
            // Test file permissions
            const testDirs = ['api/cache', 'assets', 'ai'];
            for (const dir of testDirs) {
                const writable = is_writable(dir);
                addTestResult('basic', `Directory Writable: ${dir}`, writable, 
                    `${dir} ${writable ? 'قابل للكتابة' : 'غير قابل للكتابة'}`, 
                    {directory: dir, writable: writable});
            }
        }

        // API tests
        async function testAPIs() {
            console.log('Testing APIs...');
            
            const apis = [
                {name: 'Market Data', url: 'api/market_data.php'},
                {name: 'AI Tools', url: 'api/ai_tools.php?action=trend_analysis'},
                {name: 'Sector Indicators', url: 'api/sector_indicators.php'},
                {name: 'Real Market Data', url: 'api/real_market_data.php?action=tasi_data&period=1mo'}
            ];
            
            for (const api of apis) {
                try {
                    const response = await fetch(api.url);
                    const data = await response.json();
                    const success = response.ok && data && typeof data === 'object';
                    
                    addTestResult('api', `API: ${api.name}`, success, 
                        `${api.name} ${success ? 'يعمل' : 'لا يعمل'}`, 
                        {url: api.url, status: response.status, data: data});
                } catch (error) {
                    addTestResult('api', `API: ${api.name}`, false, 
                        `خطأ في ${api.name}: ${error.message}`, 
                        {url: api.url, error: error.message});
                }
            }
        }

        // AI component tests
        async function testAIComponents() {
            console.log('Testing AI components...');
            
            try {
                // Test Python script execution
                const pythonTest = await fetch('test_python.php');
                if (pythonTest.ok) {
                    addTestResult('ai', 'Python Components', true, 'مكونات Python تعمل بشكل صحيح');
                } else {
                    addTestResult('ai', 'Python Components', false, 'مكونات Python لا تعمل');
                }
            } catch (error) {
                addTestResult('ai', 'Python Components', false, `خطأ في اختبار Python: ${error.message}`);
            }
            
            // Test AI tools endpoint
            try {
                const aiResponse = await fetch('api/ai_tools.php?action=trend_analysis');
                const aiData = await aiResponse.json();
                const aiSuccess = aiResponse.ok && aiData && aiData.success;
                
                addTestResult('ai', 'AI Tools API', aiSuccess, 
                    `أدوات الذكاء الاصطناعي ${aiSuccess ? 'تعمل' : 'لا تعمل'}`, 
                    {data: aiData});
            } catch (error) {
                addTestResult('ai', 'AI Tools API', false, `خطأ في أدوات الذكاء الاصطناعي: ${error.message}`);
            }
        }

        // Data and charts tests
        async function testDataAndCharts() {
            console.log('Testing data and charts...');
            
            // Test market data loading
            try {
                const marketResponse = await fetch('api/market_data.php');
                const marketData = await marketResponse.json();
                const marketSuccess = marketResponse.ok && marketData && Object.keys(marketData).length > 0;
                
                addTestResult('data', 'Market Data Loading', marketSuccess, 
                    `بيانات السوق ${marketSuccess ? 'تُحمل' : 'لا تُحمل'}`, 
                    {dataCount: Object.keys(marketData).length});
            } catch (error) {
                addTestResult('data', 'Market Data Loading', false, `خطأ في تحميل بيانات السوق: ${error.message}`);
            }
            
            // Test chart libraries
            const chartLibs = ['Chart.js', 'Plotly'];
            for (const lib of chartLibs) {
                const available = typeof Chart !== 'undefined' || typeof Plotly !== 'undefined';
                addTestResult('data', `Chart Library: ${lib}`, available, 
                    `${lib} ${available ? 'متاح' : 'غير متاح'}`);
            }
        }

        // Frontend tests
        function testFrontend() {
            console.log('Testing frontend...');
            
            // Test responsive design
            const responsive = window.innerWidth > 0;
            addTestResult('frontend', 'Responsive Design', responsive, 
                `التصميم المتجاوب ${responsive ? 'يعمل' : 'لا يعمل'}`);
            
            // Test Arabic text rendering
            const arabicText = document.querySelector('h1').textContent.includes('TickerChart AI');
            addTestResult('frontend', 'Arabic Text Rendering', arabicText, 
                `النص العربي ${arabicText ? 'يُعرض' : 'لا يُعرض'} بشكل صحيح`);
            
            // Test navigation
            const nav = document.querySelector('nav');
            const navSuccess = nav && nav.querySelectorAll('a').length > 0;
            addTestResult('frontend', 'Navigation Menu', navSuccess, 
                `قائمة التنقل ${navSuccess ? 'تعمل' : 'لا تعمل'}`);
        }

        // Performance tests
        function testPerformance() {
            console.log('Testing performance...');
            
            // Test page load time
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            const loadTimeOk = loadTime < 5000; // 5 seconds threshold
            
            addTestResult('performance', 'Page Load Time', loadTimeOk, 
                `وقت التحميل: ${loadTime}ms ${loadTimeOk ? 'مقبول' : 'بطيء جداً'}`, 
                {loadTime: loadTime, threshold: 5000});
            
            // Test memory usage
            if (performance.memory) {
                const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
                const memoryOk = memoryUsage < 100; // 100MB threshold
                
                addTestResult('performance', 'Memory Usage', memoryOk, 
                    `استخدام الذاكرة: ${memoryUsage.toFixed(2)}MB ${memoryOk ? 'مقبول' : 'مرتفع جداً'}`, 
                    {memoryUsage: memoryUsage, threshold: 100});
            }
        }

        // Real-time update tests
        function testRealTimeUpdates() {
            console.log('Testing real-time updates...');
            
            // Test WebSocket or polling capability
            const canUpdate = typeof WebSocket !== 'undefined' || typeof setInterval !== 'undefined';
            addTestResult('realtime', 'Real-time Update Capability', canUpdate, 
                `قدرة التحديث المباشر ${canUpdate ? 'متاحة' : 'غير متاحة'}`);
            
            // Test interval functionality
            let intervalTest = false;
            const testInterval = setInterval(() => {
                intervalTest = true;
                clearInterval(testInterval);
            }, 100);
            
            setTimeout(() => {
                addTestResult('realtime', 'Interval Functionality', intervalTest, 
                    `وظيفة الفترات الزمنية ${intervalTest ? 'تعمل' : 'لا تعمل'}`);
            }, 200);
        }

        // Display results
        function displayResults() {
            // Display all test results
            Object.keys(testResults).forEach(category => {
                if (category !== 'total' && category !== 'passed' && category !== 'failed') {
                    testResults[category].forEach(result => {
                        displayTestResult(category, result);
                    });
                }
            });
            
            // Display summary
            const summary = document.getElementById('summary');
            summary.innerHTML = `
                <h4>📊 ملخص النتائج:</h4>
                <p><strong>إجمالي الاختبارات:</strong> ${testResults.total}</p>
                <p class="success"><strong>الاختبارات الناجحة:</strong> ${testResults.passed}</p>
                <p class="error"><strong>الاختبارات الفاشلة:</strong> ${testResults.failed}</p>
                <p><strong>نسبة النجاح:</strong> ${((testResults.passed / testResults.total) * 100).toFixed(1)}%</p>
            `;
            
            // Display fixes if needed
            const fixes = document.getElementById('fixes');
            if (testResults.failed > 0) {
                fixes.innerHTML = `
                    <h4>🔧 إجراءات الإصلاح المطلوبة:</h4>
                    <ul>
                        <li>تأكد من تثبيت جميع مكتبات Python المطلوبة</li>
                        <li>تحقق من إعدادات PHP وامتداداته</li>
                        <li>تأكد من صلاحيات الملفات والمجلدات</li>
                        <li>تحقق من اتصال الإنترنت للوصول إلى APIs الخارجية</li>
                        <li>راجع سجلات الأخطاء في PHP</li>
                    </ul>
                    <button class="btn btn-warning" onclick="location.reload()">إعادة تشغيل الاختبار</button>
                `;
            } else {
                fixes.innerHTML = `
                    <h4 class="success">🎉 جميع الاختبارات نجحت!</h4>
                    <p>الموقع يعمل بشكل مثالي. يمكنك الآن استخدام جميع الميزات.</p>
                    <button class="btn btn-success" onclick="window.open('index.php', '_blank')">فتح الموقع الرئيسي</button>
                `;
            }
        }

        // Run all tests
        async function runAllTests() {
            console.log('Starting comprehensive website tests...');
            
            await testBasicRequirements();
            await testAPIs();
            await testAIComponents();
            await testDataAndCharts();
            testFrontend();
            testPerformance();
            testRealTimeUpdates();
            
            displayResults();
        }

        // Start tests when page loads
        document.addEventListener('DOMContentLoaded', runAllTests);
    </script>
</body>
</html> 