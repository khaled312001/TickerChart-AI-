<?php
// تضمين ملف التكوين
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class SaudiMarketAPI {
    private $cacheFile = 'saudi_market_cache.json';
    private $cacheTimeout = CACHE_TIMEOUT;
    
    // Real Saudi market data sources
    private $dataSources = [
        'tadawul' => 'https://www.tadawul.com.sa',
        'argaam' => 'https://www.argaam.com',
        'mubasher' => 'https://www.mubasher.info',
        'saudi_exchange' => 'https://www.saudiexchange.sa'
    ];
    
    public function getMarketData() {
        // Check cache first
        $cachedData = $this->getCachedData();
        if ($cachedData) {
            return $cachedData;
        }
        
        $marketData = [];
        
        // Get TASI index data
        $tasiData = $this->getTASIData();
        if ($tasiData) {
            $marketData['^TASI'] = $tasiData;
        }
        
        // Get NOMU index data
        $nomuData = $this->getNOMUData();
        if ($nomuData) {
            $marketData['^NOMU'] = $nomuData;
        }
        
        // Get oil data
        $oilData = $this->getOilData();
        if ($oilData) {
            $marketData['CL=F'] = $oilData;
        }
        
        // Get gold data
        $goldData = $this->getGoldData();
        if ($goldData) {
            $marketData['GC=F'] = $goldData;
        }
        
        // Get USD/SAR data
        $usdData = $this->getUSDData();
        if ($usdData) {
            $marketData['SAR=X'] = $usdData;
        }
        
        // Cache the data if we have any
        if (!empty($marketData)) {
            $this->cacheData($marketData);
        }
        
        return $marketData;
    }
    
    private function getTASIData() {
        try {
            // Try multiple sources for TASI data
            $sources = [
                'https://query1.finance.yahoo.com/v8/finance/chart/%5ETASI?interval=1d&range=1d',
                'https://www.tadawul.com.sa/api/v1/market-data/TASI',
                'https://www.argaam.com/api/v1/market-data/TASI'
            ];
            
            foreach ($sources as $url) {
                $data = $this->fetchFromURL($url);
                if ($data) {
                    $parsedData = $this->parseTASIData($data, $url);
                    if ($parsedData) {
                        return $parsedData;
                    }
                }
            }
        } catch (Exception $e) {
            error_log("TASI Data Error: " . $e->getMessage());
        }
        
        return null;
    }
    
    private function getNOMUData() {
        try {
            $sources = [
                'https://query1.finance.yahoo.com/v8/finance/chart/%5ENOMU?interval=1d&range=1d',
                'https://www.tadawul.com.sa/api/v1/market-data/NOMU'
            ];
            
            foreach ($sources as $url) {
                $data = $this->fetchFromURL($url);
                if ($data) {
                    $parsedData = $this->parseIndexData($data, 'نمو', '^NOMU');
                    if ($parsedData) {
                        return $parsedData;
                    }
                }
            }
        } catch (Exception $e) {
            error_log("NOMU Data Error: " . $e->getMessage());
        }
        
        return null;
    }
    
    private function getOilData() {
        try {
            $sources = [
                'https://query1.finance.yahoo.com/v8/finance/chart/CL%3DF?interval=1d&range=1d',
                'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=CL=F&apikey=demo'
            ];
            
            foreach ($sources as $url) {
                $data = $this->fetchFromURL($url);
                if ($data) {
                    $parsedData = $this->parseCommodityData($data, 'النفط', 'CL=F');
                    if ($parsedData) {
                        return $parsedData;
                    }
                }
            }
        } catch (Exception $e) {
            error_log("Oil Data Error: " . $e->getMessage());
        }
        
        return null;
    }
    
    private function getGoldData() {
        try {
            $sources = [
                'https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1d&range=1d',
                'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GC=F&apikey=demo'
            ];
            
            foreach ($sources as $url) {
                $data = $this->fetchFromURL($url);
                if ($data) {
                    $parsedData = $this->parseCommodityData($data, 'الذهب', 'GC=F');
                    if ($parsedData) {
                        return $parsedData;
                    }
                }
            }
        } catch (Exception $e) {
            error_log("Gold Data Error: " . $e->getMessage());
        }
        
        return null;
    }
    
    private function getUSDData() {
        try {
            $sources = [
                'https://query1.finance.yahoo.com/v8/finance/chart/SAR%3DX?interval=1d&range=1d',
                'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=SAR&apikey=demo'
            ];
            
            foreach ($sources as $url) {
                $data = $this->fetchFromURL($url);
                if ($data) {
                    $parsedData = $this->parseCurrencyData($data, 'الدولار', 'SAR=X');
                    if ($parsedData) {
                        return $parsedData;
                    }
                }
            }
        } catch (Exception $e) {
            error_log("USD Data Error: " . $e->getMessage());
        }
        
        return null;
    }
    
    private function fetchFromURL($url) {
        $context = stream_context_create([
            'http' => [
                'timeout' => REQUEST_TIMEOUT,
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'header' => [
                    'Accept: application/json',
                    'Accept-Language: ar-SA,ar;q=0.9,en;q=0.8',
                    'Cache-Control: no-cache'
                ]
            ]
        ]);
        
        $response = file_get_contents($url, false, $context);
        if ($response === false) {
            error_log("Failed to fetch data from: {$url}");
            return null;
        }
        
        $data = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log("JSON decode error for URL: {$url}");
            return null;
        }
        
        return $data;
    }
    
    private function parseTASIData($data, $source) {
        // Parse Yahoo Finance data
        if (isset($data['chart']['result'][0]['meta'])) {
            $meta = $data['chart']['result'][0]['meta'];
            $currentPrice = $meta['regularMarketPrice'] ?? 0;
            $previousClose = $meta['previousClose'] ?? $currentPrice;
            $change = $currentPrice - $previousClose;
            $changePercent = $previousClose > 0 ? ($change / $previousClose) * 100 : 0;
            
            return [
                'name' => 'تداول',
                'symbol' => '^TASI',
                'value' => round($currentPrice, 2),
                'change' => round($change, 2),
                'changePercent' => round($changePercent, 2),
                'timestamp' => date('Y-m-d H:i:s')
            ];
        }
        
        // Parse Tadawul/Argaam data
        if (isset($data['data'])) {
            $stockData = $data['data'];
            $price = $stockData['last_price'] ?? $stockData['price'] ?? 0;
            $change = $stockData['change'] ?? $stockData['price_change'] ?? 0;
            $changePercent = $stockData['change_percent'] ?? $stockData['percentage_change'] ?? 0;
            
            if ($price > 0) {
                return [
                    'name' => 'تداول',
                    'symbol' => '^TASI',
                    'value' => round($price, 2),
                    'change' => round($change, 2),
                    'changePercent' => round($changePercent, 2),
                    'timestamp' => date('Y-m-d H:i:s')
                ];
            }
        }
        
        return null;
    }
    
    private function parseIndexData($data, $name, $symbol) {
        if (isset($data['chart']['result'][0]['meta'])) {
            $meta = $data['chart']['result'][0]['meta'];
            $currentPrice = $meta['regularMarketPrice'] ?? 0;
            $previousClose = $meta['previousClose'] ?? $currentPrice;
            $change = $currentPrice - $previousClose;
            $changePercent = $previousClose > 0 ? ($change / $previousClose) * 100 : 0;
            
            return [
                'name' => $name,
                'symbol' => $symbol,
                'value' => round($currentPrice, 2),
                'change' => round($change, 2),
                'changePercent' => round($changePercent, 2),
                'timestamp' => date('Y-m-d H:i:s')
            ];
        }
        
        return null;
    }
    
    private function parseCommodityData($data, $name, $symbol) {
        // Parse Yahoo Finance data
        if (isset($data['chart']['result'][0]['meta'])) {
            $meta = $data['chart']['result'][0]['meta'];
            $currentPrice = $meta['regularMarketPrice'] ?? 0;
            $previousClose = $meta['previousClose'] ?? $currentPrice;
            $change = $currentPrice - $previousClose;
            $changePercent = $previousClose > 0 ? ($change / $previousClose) * 100 : 0;
            
            return [
                'name' => $name,
                'symbol' => $symbol,
                'value' => round($currentPrice, 2),
                'change' => round($change, 2),
                'changePercent' => round($changePercent, 2),
                'timestamp' => date('Y-m-d H:i:s')
            ];
        }
        
        // Parse Alpha Vantage data
        if (isset($data['Global Quote'])) {
            $quote = $data['Global Quote'];
            $price = floatval($quote['05. price'] ?? 0);
            $change = floatval($quote['09. change'] ?? 0);
            $changePercent = floatval(str_replace('%', '', $quote['10. change percent'] ?? '0'));
            
            if ($price > 0) {
                return [
                    'name' => $name,
                    'symbol' => $symbol,
                    'value' => round($price, 2),
                    'change' => round($change, 2),
                    'changePercent' => round($changePercent, 2),
                    'timestamp' => date('Y-m-d H:i:s')
                ];
            }
        }
        
        return null;
    }
    
    private function parseCurrencyData($data, $name, $symbol) {
        // Parse Yahoo Finance data
        if (isset($data['chart']['result'][0]['meta'])) {
            $meta = $data['chart']['result'][0]['meta'];
            $currentPrice = $meta['regularMarketPrice'] ?? 0;
            $previousClose = $meta['previousClose'] ?? $currentPrice;
            $change = $currentPrice - $previousClose;
            $changePercent = $previousClose > 0 ? ($change / $previousClose) * 100 : 0;
            
            return [
                'name' => $name,
                'symbol' => $symbol,
                'value' => round($currentPrice, 2),
                'change' => round($change, 2),
                'changePercent' => round($changePercent, 2),
                'timestamp' => date('Y-m-d H:i:s')
            ];
        }
        
        // Parse Alpha Vantage currency data
        if (isset($data['Realtime Currency Exchange Rate'])) {
            $rate = $data['Realtime Currency Exchange Rate'];
            $price = floatval($rate['5. Exchange Rate'] ?? 0);
            $change = 0; // Alpha Vantage doesn't provide change for currency
            $changePercent = 0;
            
            if ($price > 0) {
                return [
                    'name' => $name,
                    'symbol' => $symbol,
                    'value' => round($price, 2),
                    'change' => round($change, 2),
                    'changePercent' => round($changePercent, 2),
                    'timestamp' => date('Y-m-d H:i:s')
                ];
            }
        }
        
        return null;
    }
    
    private function getCachedData() {
        if (!file_exists($this->cacheFile)) return null;
        
        $cacheData = json_decode(file_get_contents($this->cacheFile), true);
        if (!$cacheData) return null;
        
        $cacheTime = strtotime($cacheData['timestamp']);
        if (time() - $cacheTime > $this->cacheTimeout) return null;
        
        return $cacheData['data'];
    }
    
    private function cacheData($data) {
        $cacheData = [
            'timestamp' => date('Y-m-d H:i:s'),
            'data' => $data
        ];
        
        file_put_contents($this->cacheFile, json_encode($cacheData));
    }
}

// API endpoint
try {
    $api = new SaudiMarketAPI();
    $action = $_GET['action'] ?? 'indicators';
    
    switch ($action) {
        case 'indicators':
            $marketData = $api->getMarketData();
            if (!empty($marketData)) {
                $response = [
                    'success' => true,
                    'data' => $marketData,
                    'timestamp' => date('Y-m-d H:i:s')
                ];
            } else {
                $response = [
                    'success' => false,
                    'error' => ERROR_MESSAGES['no_data'],
                    'timestamp' => date('Y-m-d H:i:s')
                ];
            }
            break;
            
        default:
            $response = [
                'success' => false,
                'error' => 'Invalid action parameter',
                'available_actions' => ['indicators']
            ];
    }
    
} catch (Exception $e) {
    $response = [
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ];
}

// Return JSON response
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?> 