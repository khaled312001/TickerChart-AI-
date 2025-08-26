<?php
/**
 * PHP Wrapper for Python Component Testing
 * غلاف PHP لاختبار مكونات Python
 */

header('Content-Type: application/json; charset=utf-8');

function testPythonComponents() {
    $results = [];
    
    // Test 1: Check if Python is available
    $pythonCmd = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN' ? 'python' : 'python3';
    $pythonVersion = shell_exec($pythonCmd . ' --version 2>&1');
    
    if ($pythonVersion && strpos($pythonVersion, 'Python') !== false) {
        $results['python_available'] = [
            'success' => true,
            'message' => 'Python متاح',
            'version' => trim($pythonVersion)
        ];
    } else {
        $results['python_available'] = [
            'success' => false,
            'message' => 'Python غير متاح',
            'error' => 'Python command not found'
        ];
        return $results;
    }
    
    // Test 2: Check Python dependencies
    try {
        $pipList = shell_exec($pythonCmd . ' -m pip list 2>&1');
        $requiredPackages = ['numpy', 'pandas', 'scikit-learn', 'yfinance', 'matplotlib', 'seaborn', 'plotly'];
        
        foreach ($requiredPackages as $package) {
            if (strpos($pipList, $package) !== false) {
                $results["package_{$package}"] = [
                    'success' => true,
                    'message' => "مكتبة {$package} مثبتة"
                ];
            } else {
                $results["package_{$package}"] = [
                    'success' => false,
                    'message' => "مكتبة {$package} غير مثبتة"
                ];
            }
        }
    } catch (Exception $e) {
        $results['pip_check'] = [
            'success' => false,
            'message' => 'فشل في فحص المكتبات',
            'error' => $e->getMessage()
        ];
    }
    
    // Test 3: Test Python script execution
    try {
        $scriptPath = __DIR__ . '/ai/api_bridge.py';
        if (file_exists($scriptPath)) {
            $output = shell_exec($pythonCmd . ' ' . escapeshellarg($scriptPath) . ' 2>&1');
            
            if ($output && strpos($output, 'available_actions') !== false) {
                $results['script_execution'] = [
                    'success' => true,
                    'message' => 'سكريبت Python يعمل بشكل صحيح',
                    'output' => substr($output, 0, 200) . '...'
                ];
            } else {
                $results['script_execution'] = [
                    'success' => false,
                    'message' => 'سكريبت Python لا يعمل بشكل صحيح',
                    'output' => $output
                ];
            }
        } else {
            $results['script_execution'] = [
                'success' => false,
                'message' => 'ملف السكريبت غير موجود',
                'path' => $scriptPath
            ];
        }
    } catch (Exception $e) {
        $results['script_execution'] = [
            'success' => false,
            'message' => 'خطأ في تنفيذ السكريبت',
            'error' => $e->getMessage()
        ];
    }
    
    // Test 4: Test AI analyzer import
    try {
        $testScript = "
import sys
import os
sys.path.append('" . __DIR__ . "/ai')

try:
    from stock_analyzer import SaudiStockAnalyzer
    print('SUCCESS: SaudiStockAnalyzer imported successfully')
    
    analyzer = SaudiStockAnalyzer()
    print('SUCCESS: Analyzer instance created')
    
    # Test synthetic data generation
    data = analyzer.generate_synthetic_data('TEST.SR')
    if data is not None and len(data) > 0:
        print(f'SUCCESS: Generated {len(data)} data points')
    else:
        print('ERROR: Failed to generate synthetic data')
        
except Exception as e:
    print(f'ERROR: {str(e)}')
";
        
        $tempFile = tempnam(sys_get_temp_dir(), 'python_test_');
        file_put_contents($tempFile, $testScript);
        
        $output = shell_exec($pythonCmd . ' ' . escapeshellarg($tempFile) . ' 2>&1');
        unlink($tempFile);
        
        if (strpos($output, 'SUCCESS:') !== false) {
            $results['ai_analyzer'] = [
                'success' => true,
                'message' => 'محلل الذكاء الاصطناعي يعمل بشكل صحيح',
                'output' => $output
            ];
        } else {
            $results['ai_analyzer'] = [
                'success' => false,
                'message' => 'محلل الذكاء الاصطناعي لا يعمل',
                'output' => $output
            ];
        }
        
    } catch (Exception $e) {
        $results['ai_analyzer'] = [
            'success' => false,
            'message' => 'خطأ في اختبار محلل الذكاء الاصطناعي',
            'error' => $e->getMessage()
        ];
    }
    
    return $results;
}

// Run tests and return results
$testResults = testPythonComponents();

// Calculate summary
$totalTests = count($testResults);
$passedTests = 0;
$failedTests = 0;

foreach ($testResults as $test) {
    if ($test['success']) {
        $passedTests++;
    } else {
        $failedTests++;
    }
}

$summary = [
    'total_tests' => $totalTests,
    'passed_tests' => $passedTests,
    'failed_tests' => $failedTests,
    'success_rate' => $totalTests > 0 ? round(($passedTests / $totalTests) * 100, 1) : 0,
    'timestamp' => date('Y-m-d H:i:s'),
    'overall_success' => $failedTests === 0
];

$response = [
    'success' => $failedTests === 0,
    'summary' => $summary,
    'tests' => $testResults
];

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?> 