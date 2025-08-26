<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function run_rscript(array $args): array {
    $response = [ 'success' => false, 'error' => 'Unknown error' ];

    // Resolve Rscript path (assumes Rscript in PATH)
    $rscript = 'Rscript';

    // Bridge script path
    $bridgePath = realpath(__DIR__ . '/../r/tasi_bridge.R');
    if ($bridgePath === false) {
        return [ 'success' => false, 'error' => 'R bridge script not found' ];
    }

    // Build command
    $cmd = escapeshellcmd($rscript) . ' ' . escapeshellarg($bridgePath);
    foreach ($args as $arg) {
        $cmd .= ' ' . escapeshellarg($arg);
    }

    // Execute
    $output = @shell_exec($cmd . ' 2>&1');
    if ($output === null) {
        return [ 'success' => false, 'error' => 'Failed to execute Rscript. Ensure R is installed and Rscript is in PATH.' ];
    }

    // Try decode JSON
    $decoded = json_decode($output, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
        return $decoded;
    }

    // If not JSON, return raw output for debugging
    return [
        'success' => false,
        'error' => 'Invalid JSON from Rscript',
        'raw' => substr($output, 0, 2000)
    ];
}

try {
    $action = $_GET['action'] ?? 'tasi_data';

    switch ($action) {
        case 'tasi_data': {
            $period = $_GET['period'] ?? '1mo';
            $res = run_rscript([ 'tasi_data', $period ]);
            echo json_encode($res, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            break;
        }
        case 'company_data': {
            $symbol = $_GET['symbol'] ?? '';
            $start = $_GET['start'] ?? '';
            $end = $_GET['end'] ?? '';
            if ($symbol === '' || $start === '' || $end === '') {
                echo json_encode([ 'success' => false, 'error' => 'symbol, start, end are required' ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
                break;
            }
            $res = run_rscript([ 'company_data', $symbol, $start, $end ]);
            echo json_encode($res, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            break;
        }
        case 'market_data': {
            $res = run_rscript([ 'market_data' ]);
            echo json_encode($res, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            break;
        }
        case 'indicators': {
            $res = run_rscript([ 'indicators' ]);
            echo json_encode($res, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            break;
        }
        case 'income_statement': {
            $company = $_GET['company'] ?? '';
            $periodType = $_GET['period_type'] ?? 'q';
            if ($company === '') {
                echo json_encode([ 'success' => false, 'error' => 'company is required' ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
                break;
            }
            $res = run_rscript([ 'income_statement', $company, $periodType ]);
            echo json_encode($res, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            break;
        }
        default:
            echo json_encode([ 'success' => false, 'error' => 'Invalid action' ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
} catch (Throwable $e) {
    echo json_encode([ 'success' => false, 'error' => $e->getMessage() ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} 