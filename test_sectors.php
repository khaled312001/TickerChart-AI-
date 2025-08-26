<?php
/**
 * Test script for Sector Indicators API
 * اختبار API مؤشرات القطاعات
 */

echo "=== اختبار API مؤشرات القطاعات ===\n";
echo "=== Sector Indicators API Test ===\n\n";

// Test the sectors list endpoint
echo "1. اختبار قائمة القطاعات المتاحة:\n";
echo "Testing available sectors list:\n";

$sectorsUrl = 'http://localhost:8000/api/sector_indicators.php?action=sectors';
echo "Requesting: $sectorsUrl\n";

$context = stream_context_create([
    'http' => [
        'timeout' => 30,
        'user_agent' => 'TestScript/1.0'
    ]
]);

$response = file_get_contents($sectorsUrl, false, $context);

if ($response === false) {
    echo "❌ Failed to connect to API\n";
    echo "Make sure the server is running on localhost:8000\n";
    exit(1);
}

$data = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo "❌ Invalid JSON response\n";
    echo "Response: " . substr($response, 0, 200) . "...\n";
    exit(1);
}

echo "✅ API Response:\n";
echo "Success: " . ($data['success'] ? 'Yes' : 'No') . "\n";

if (isset($data['error'])) {
    echo "Error: " . $data['error'] . "\n";
}

if (isset($data['data']) && is_array($data['data'])) {
    echo "Available sectors: " . count($data['data']) . "\n";
    foreach ($data['data'] as $key => $name) {
        echo "  - $key: $name\n";
    }
}

echo "\n" . str_repeat("=", 50) . "\n\n";

// Test sector data endpoint
echo "2. اختبار بيانات قطاع البنوك:\n";
echo "Testing banks sector data:\n";

$sectorDataUrl = 'http://localhost:8000/api/sector_indicators.php?action=sector_data&sector=banks';
echo "Requesting: $sectorDataUrl\n";

$response = file_get_contents($sectorDataUrl, false, $context);

if ($response === false) {
    echo "❌ Failed to connect to API\n";
    exit(1);
}

$data = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo "❌ Invalid JSON response\n";
    echo "Response: " . substr($response, 0, 200) . "...\n";
    exit(1);
}

echo "✅ API Response:\n";
echo "Success: " . ($data['success'] ? 'Yes' : 'No') . "\n";

if (isset($data['error'])) {
    echo "Error: " . $data['error'] . "\n";
}

if (isset($data['data']) && is_array($data['data'])) {
    echo "Data points: " . count($data['data']) . "\n";
    
    if (count($data['data']) > 0) {
        echo "First data point:\n";
        print_r($data['data'][0]);
        
        echo "\nLast data point:\n";
        print_r($data['data'][count($data['data']) - 1]);
    }
}

echo "\n" . str_repeat("=", 50) . "\n\n";

// Test sector summary endpoint
echo "3. اختبار ملخص قطاع البنوك:\n";
echo "Testing banks sector summary:\n";

$sectorSummaryUrl = 'http://localhost:8000/api/sector_indicators.php?action=sector_summary&sector=banks';
echo "Requesting: $sectorSummaryUrl\n";

$response = file_get_contents($sectorSummaryUrl, false, $context);

if ($response === false) {
    echo "❌ Failed to connect to API\n";
    exit(1);
}

$data = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo "❌ Invalid JSON response\n";
    echo "Response: " . substr($response, 0, 200) . "...\n";
    exit(1);
}

echo "✅ API Response:\n";
echo "Success: " . ($data['success'] ? 'Yes' : 'No') . "\n";

if (isset($data['error'])) {
    echo "Error: " . $data['error'] . "\n";
}

if (isset($data['data'])) {
    echo "Sector Summary:\n";
    print_r($data['data']);
}

echo "\n=== اختبار مكتمل ===\n";
echo "=== Test Complete ===\n";
?> 