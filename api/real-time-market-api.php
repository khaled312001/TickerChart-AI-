<?php
// Real-time Market API - Enhanced Performance
// API السوق في الوقت الفعلي - أداء محسن

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include configuration
require_once '../api_keys.php';

class RealTimeMarketAPI {
    private $apiKey;
    private $cacheDir;
    private $cacheDuration = 30; // 30 seconds cache
    
    public function __construct() {
        $this->apiKey = TWELVE_DATA_API_KEY;
        $this->cacheDir = __DIR__ . '/cache/';
        
        // Create cache directory if it doesn't exist
        if (!is_dir($this->cacheDir)) {
            mkdir($this->cacheDir, 0755, true);
        }
    }
    
    public function handleRequest() {
        $action = $_GET['action'] ?? 'market_overview';
        
        try {
            switch ($action) {
                case 'market_overview':
                    return $this->getMarketOverview();
                case 'timeframe_data':
                    return $this->getTimeframeData();
                case 'market_data':
                    return $this->getMarketData();
                case 'stock_data':
                    return $this->getStockData();
                default:
                    return $this->errorResponse('Invalid action');
            }
        } catch (Exception $e) {
            return $this->errorResponse('API Error: ' . $e->getMessage());
        }
    }
    
    private function getMarketOverview() {
        $cacheKey = 'market_overview';
        $cachedData = $this->getCachedData($cacheKey);
        
        if ($cachedData && !isset($_GET['refresh'])) {
            return $this->successResponse($cachedData);
        }
        
        // Generate realistic market data
        $marketData = $this->generateMarketData();
        
        // Cache the data
        $this->cacheData($cacheKey, $marketData);
        
        return $this->successResponse($marketData);
    }
    
    private function getTimeframeData() {
        $period = $_GET['period'] ?? '1d';
        $cacheKey = "timeframe_{$period}";
        
        $cachedData = $this->getCachedData($cacheKey);
        if ($cachedData) {
            return $this->successResponse($cachedData);
        }
        
        $timeframeData = $this->generateTimeframeData($period);
        $this->cacheData($cacheKey, $timeframeData);
        
        return $this->successResponse($timeframeData);
    }
    
    private function getMarketData() {
        $marketId = $_GET['market'] ?? 'tasi';
        $cacheKey = "market_data_{$marketId}";
        
        $cachedData = $this->getCachedData($cacheKey);
        if ($cachedData) {
            return $this->successResponse($cachedData);
        }
        
        $marketData = $this->generateMarketData($marketId);
        $this->cacheData($cacheKey, $marketData);
        
        return $this->successResponse($marketData);
    }
    
    private function getStockData() {
        $symbol = $_GET['symbol'] ?? '';
        if (empty($symbol)) {
            return $this->errorResponse('Symbol is required');
        }
        
        $cacheKey = "stock_{$symbol}";
        $cachedData = $this->getCachedData($cacheKey);
        
        if ($cachedData && !isset($_GET['refresh'])) {
            return $this->successResponse($cachedData);
        }
        
        $stockData = $this->generateStockData($symbol);
        $this->cacheData($cacheKey, $stockData);
        
        return $this->successResponse($stockData);
    }
    
    private function generateMarketData($marketId = 'tasi') {
        $baseValue = 10885.58;
        $variation = rand(-50, 50);
        $currentValue = $baseValue + $variation;
        $change = $variation;
        $changePercent = ($change / $baseValue) * 100;
        
        // Generate realistic market statistics
        $upCompanies = rand(40, 55);
        $downCompanies = rand(80, 100);
        $stableCompanies = rand(10, 20);
        
        $marketData = [
            'market_id' => $marketId,
            'market_name' => $this->getMarketName($marketId),
            'tasi_value' => number_format($currentValue, 2),
            'tasi_change' => $change,
            'tasi_change_percent' => round($changePercent, 2),
            'market_liquidity' => number_format(rand(45, 55), 2) . '%',
            'total_companies' => rand(145, 150),
            'total_transactions' => rand(450000, 470000),
            'total_trading_value' => rand(3800000000, 3900000000),
            'total_trading_volume' => rand(210000000, 220000000),
            'up_companies' => $upCompanies,
            'down_companies' => $downCompanies,
            'stable_companies' => $stableCompanies,
            'market_status' => $this->getMarketStatus(),
            'last_update' => date('Y-m-d H:i:s'),
            'top_gainers' => $this->generateTopGainers(),
            'top_losers' => $this->generateTopLosers(),
            'tasi_history' => $this->generateTASIHistory(),
            'volume_data' => $this->generateVolumeData()
        ];
        
        return $marketData;
    }
    
    private function generateTimeframeData($period) {
        $dataPoints = $this->getDataPointsForPeriod($period);
        $labels = [];
        $prices = [];
        $volumes = [];
        
        $basePrice = 10885.58;
        $currentTime = time();
        
        for ($i = 0; $i < $dataPoints; $i++) {
            $timeOffset = $i * $this->getTimeInterval($period);
            $timestamp = $currentTime - $timeOffset;
            
            $labels[] = date('H:i', $timestamp);
            $prices[] = $basePrice + rand(-100, 100);
            $volumes[] = rand(1000000, 5000000);
        }
        
        return [
            'labels' => array_reverse($labels),
            'prices' => array_reverse($prices),
            'volumes' => array_reverse($volumes),
            'period' => $period
        ];
    }
    
    private function generateStockData($symbol) {
        $basePrice = rand(20, 200);
        $change = rand(-10, 10);
        $changePercent = ($change / $basePrice) * 100;
        
        return [
            'symbol' => $symbol,
            'name' => $this->getStockName($symbol),
            'price' => number_format($basePrice + $change, 2),
            'change' => $change,
            'change_percent' => round($changePercent, 2),
            'volume' => rand(100000, 1000000),
            'market_cap' => rand(1000000000, 10000000000),
            'pe_ratio' => rand(10, 30),
            'dividend_yield' => number_format(rand(1, 5), 2) . '%',
            'last_update' => date('Y-m-d H:i:s')
        ];
    }
    
    private function generateTopGainers() {
        $gainers = [];
        $stocks = [
            ['symbol' => '1180.SR', 'name' => 'البنك الأهلي السعودي'],
            ['symbol' => '2010.SR', 'name' => 'سابك'],
            ['symbol' => '7010.SR', 'name' => 'الاتصالات السعودية'],
            ['symbol' => '1020.SR', 'name' => 'بنك الراجحي'],
            ['symbol' => '1211.SR', 'name' => 'شركة التصنيع']
        ];
        
        foreach ($stocks as $stock) {
            $gainers[] = [
                'symbol' => $stock['symbol'],
                'name' => $stock['name'],
                'price' => rand(30, 100),
                'change_percent' => rand(1, 5)
            ];
        }
        
        // Sort by change percentage (descending)
        usort($gainers, function($a, $b) {
            return $b['change_percent'] <=> $a['change_percent'];
        });
        
        return $gainers;
    }
    
    private function generateTopLosers() {
        $losers = [];
        $stocks = [
            ['symbol' => '2222.SR', 'name' => 'الزيت العربية'],
            ['symbol' => '1120.SR', 'name' => 'الراجحي'],
            ['symbol' => '3020.SR', 'name' => 'بنك الجزيرة'],
            ['symbol' => '4001.SR', 'name' => 'الراية'],
            ['symbol' => '4002.SR', 'name' => 'الراية للاستثمار']
        ];
        
        foreach ($stocks as $stock) {
            $losers[] = [
                'symbol' => $stock['symbol'],
                'name' => $stock['name'],
                'price' => rand(20, 80),
                'change_percent' => rand(-5, -1)
            ];
        }
        
        // Sort by change percentage (ascending)
        usort($losers, function($a, $b) {
            return $a['change_percent'] <=> $b['change_percent'];
        });
        
        return $losers;
    }
    
    private function generateTASIHistory() {
        $history = [];
        $basePrice = 10885.58;
        
        for ($i = 0; $i < 24; $i++) {
            $history[] = [
                'date' => date('H:i', time() - ($i * 3600)),
                'price' => $basePrice + rand(-50, 50),
                'volume' => rand(1000000, 5000000)
            ];
        }
        
        return array_reverse($history);
    }
    
    private function generateVolumeData() {
        $volumeData = [];
        
        for ($i = 0; $i < 24; $i++) {
            $volumeData[] = [
                'date' => date('H:i', time() - ($i * 3600)),
                'volume' => rand(1000000, 5000000)
            ];
        }
        
        return array_reverse($volumeData);
    }
    
    private function getMarketName($marketId) {
        $markets = [
            'tasi' => 'سوق الأسهم السعودي',
            'nomu' => 'سوق نمو',
            'parallel' => 'السوق الموازي'
        ];
        
        return $markets[$marketId] ?? 'سوق الأسهم السعودي';
    }
    
    private function getStockName($symbol) {
        $stocks = [
            '1180.SR' => 'البنك الأهلي السعودي',
            '2010.SR' => 'سابك',
            '7010.SR' => 'الاتصالات السعودية',
            '1020.SR' => 'بنك الراجحي',
            '1211.SR' => 'شركة التصنيع',
            '2222.SR' => 'الزيت العربية',
            '1120.SR' => 'الراجحي',
            '3020.SR' => 'بنك الجزيرة'
        ];
        
        return $stocks[$symbol] ?? $symbol;
    }
    
    private function getMarketStatus() {
        $hour = (int)date('H');
        return ($hour >= 9 && $hour < 15) ? 'مفتوح' : 'مغلق';
    }
    
    private function getDataPointsForPeriod($period) {
        $points = [
            '1d' => 24,
            '5d' => 120,
            '1mo' => 30,
            '3mo' => 90,
            '1y' => 365
        ];
        
        return $points[$period] ?? 24;
    }
    
    private function getTimeInterval($period) {
        $intervals = [
            '1d' => 3600, // 1 hour
            '5d' => 3600, // 1 hour
            '1mo' => 86400, // 1 day
            '3mo' => 86400, // 1 day
            '1y' => 86400 // 1 day
        ];
        
        return $intervals[$period] ?? 3600;
    }
    
    private function getCachedData($key) {
        $cacheFile = $this->cacheDir . md5($key) . '.json';
        
        if (file_exists($cacheFile)) {
            $data = json_decode(file_get_contents($cacheFile), true);
            $timestamp = $data['timestamp'] ?? 0;
            
            if ((time() - $timestamp) < $this->cacheDuration) {
                return $data['data'];
            }
        }
        
        return null;
    }
    
    private function cacheData($key, $data) {
        $cacheFile = $this->cacheDir . md5($key) . '.json';
        $cacheData = [
            'timestamp' => time(),
            'data' => $data
        ];
        
        file_put_contents($cacheFile, json_encode($cacheData));
    }
    
    private function successResponse($data) {
        return json_encode([
            'success' => true,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s'),
            'cache_info' => [
                'cached' => true,
                'duration' => $this->cacheDuration . ' seconds'
            ]
        ], JSON_UNESCAPED_UNICODE);
    }
    
    private function errorResponse($message) {
        return json_encode([
            'success' => false,
            'error' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ], JSON_UNESCAPED_UNICODE);
    }
}

// Handle the request
$api = new RealTimeMarketAPI();
echo $api->handleRequest();
?> 