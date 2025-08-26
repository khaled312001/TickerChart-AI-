<?php
header('Content-Type: application/json; charset=utf-8');
mb_internal_encoding('UTF-8');

// Simple file cache
function cache_get($key, $ttlSeconds = 60) {
	$cacheDir = __DIR__ . '/cache';
	if (!is_dir($cacheDir)) @mkdir($cacheDir, 0777, true);
	$file = $cacheDir . '/' . md5($key) . '.json';
	if (file_exists($file) && (time() - filemtime($file) < $ttlSeconds)) {
		$contents = file_get_contents($file);
		if ($contents !== false) {
			return json_decode($contents, true);
		}
	}
	return null;
}

function cache_set($key, $data) {
	$cacheDir = __DIR__ . '/cache';
	if (!is_dir($cacheDir)) @mkdir($cacheDir, 0777, true);
	$file = $cacheDir . '/' . md5($key) . '.json';
	file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function get_python_cmd() {
	$commands = [];
	if (stripos(PHP_OS_FAMILY, 'Windows') !== false) {
		$commands = ['python', 'py -3', 'py'];
	} else {
		$commands = ['python3', 'python'];
	}
	foreach ($commands as $cmd) {
		$version = @shell_exec($cmd . ' -V');
		if ($version && preg_match('/Python\s+\d+\.\d+\.\d+/', $version)) {
			return $cmd;
		}
	}
	return 'python';
}

function run_ai_tool($action, $arg = null) {
	$python = get_python_cmd();
	$script = escapeshellarg(__DIR__ . '/../ai/api_bridge.py');
	$cmd = $python . ' ' . $script . ' ' . escapeshellarg($action);
	if ($arg !== null) {
		$cmd .= ' ' . escapeshellarg($arg);
	}
	// Increase timeout
	set_time_limit(120);
	// IMPORTANT: don't merge stderr into stdout to keep JSON clean
	$output = shell_exec($cmd);
	if ($output === null || $output === '') {
		return [ 'success' => false, 'error' => 'Failed to execute Python script' ];
	}
	$json = json_decode($output, true);
	if (!$json) {
		return [ 'success' => false, 'error' => 'Invalid JSON from Python', 'raw' => substr($output, 0, 500) ];
	}
	return $json;
}

try {
	$action = $_GET['action'] ?? 'trend_analysis';

	// Use cache per action
	$cacheKey = 'ai_tools_' . $action . '_' . md5(http_build_query($_GET));
	if ($cached = cache_get($cacheKey, 60)) {
		echo json_encode($cached, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
		exit;
	}

	switch ($action) {
		case 'trend_analysis': {
			$py = run_ai_tool('analyze_all');
			if (!($py['success'] ?? false)) { echo json_encode($py, JSON_UNESCAPED_UNICODE); exit; }
			$summary = $py['data']['summary'] ?? [];
			$recs = $py['data']['recommendations'] ?? [];

			// Aggregate support/resistance from available analyses
			$analysis = $py['data']['analysis'] ?? [];
			$supports = [];
			$resistances = [];
			foreach ($analysis as $a) {
				if (isset($a['risk_analysis']['support_level'])) $supports[] = $a['risk_analysis']['support_level'];
				if (isset($a['risk_analysis']['resistance_level'])) $resistances[] = $a['risk_analysis']['resistance_level'];
			}
			$payload = [
				'success' => true,
				'data' => [
					'trend' => (($summary['market_sentiment'] ?? '') === 'إيجابي') ? 'صاعد' : 'هابط',
					'confidence' => $summary['average_confidence'] ?? 70,
					'support' => count($supports) ? round(array_sum($supports) / count($supports), 2) : null,
					'resistance' => count($resistances) ? round(array_sum($resistances) / count($resistances), 2) : null,
					'recommendations' => $recs
				],
				'timestamp' => date('Y-m-d H:i:s')
			];
			cache_set($cacheKey, $payload); echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); exit;
		}
		case 'predictions': {
			$py = run_ai_tool('get_predictions');
			cache_set($cacheKey, $py); echo json_encode($py, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); exit;
		}
		case 'risk_analysis': {
			$py = run_ai_tool('get_risk_analysis');
			cache_set($cacheKey, $py); echo json_encode($py, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); exit;
		}
		case 'analyze_stock': {
			$symbol = $_GET['symbol'] ?? '';
			if (!$symbol) { echo json_encode([ 'success' => false, 'error' => 'symbol required' ], JSON_UNESCAPED_UNICODE); exit; }
			$py = run_ai_tool('analyze_stock', $symbol);
			cache_set($cacheKey, $py); echo json_encode($py, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); exit;
		}
		case 'portfolio_analysis': {
			$portfolio = $_GET['portfolio'] ?? '[]';
			$py = run_ai_tool('analyze_portfolio', $portfolio);
			cache_set($cacheKey, $py); echo json_encode($py, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); exit;
		}
		case 'list_symbols': {
			$py = run_ai_tool('list_symbols');
			cache_set($cacheKey, $py); echo json_encode($py, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); exit;
		}
		default: {
			echo json_encode([ 'success' => false, 'error' => 'Invalid action' ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); exit;
		}
	}
} catch (Throwable $e) {
	echo json_encode([ 'success' => false, 'error' => $e->getMessage() ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} 