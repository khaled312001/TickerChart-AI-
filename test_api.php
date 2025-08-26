<?php
/**
 * Test script for API endpoints
 * Run this to verify the API is working correctly
 */

echo "=== API Test Script ===\n";
echo "Testing TASI data endpoint...\n\n";

// Test the TASI data endpoint
$url = 'http://localhost:8000/api/real_market_data.php?action=tasi_data&period=1mo';

echo "Requesting: $url\n";

$context = stream_context_create([
    'http' => [
        'timeout' => 30,
        'user_agent' => 'TestScript/1.0'
    ]
]);

$response = file_get_contents($url, false, $context);

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
    echo "Data points: " . count($data['data']) . "\n";
    
    if (count($data['data']) > 0) {
        echo "First data point:\n";
        print_r($data['data'][0]);
        
        echo "\nLast data point:\n";
        print_r($data['data'][count($data['data']) - 1]);
    }
}

if (isset($data['timestamp'])) {
    echo "Timestamp: " . $data['timestamp'] . "\n";
}

echo "\n=== Test Complete ===\n";
?> 