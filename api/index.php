<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get the request path
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path_parts = explode('/', trim($path, '/'));

// Remove 'api' from the path
if ($path_parts[0] === 'api') {
    array_shift($path_parts);
}

$endpoint = implode('/', $path_parts);

// Route the request to the appropriate handler
switch ($endpoint) {
    case 'market-data':
        include_once 'market_data.php';
        break;
    case 'saudi-market':
        include_once 'saudi_market_api.php';
        break;
    case 'real-market':
        include_once 'real_market_data.php';
        break;
    case 'sector-indicators':
        include_once 'sector_indicators.php';
        break;
    case 'ai-tools':
        include_once 'ai_tools.php';
        break;
    case 'live-market':
        include_once 'live_market_data.php';
        break;
    default:
        http_response_code(404);
        echo json_encode([
            'error' => 'Endpoint not found',
            'available_endpoints' => [
                'market-data',
                'saudi-market',
                'real-market',
                'sector-indicators',
                'ai-tools',
                'live-market'
            ]
        ]);
        break;
}
?> 