<?php
// Only send headers if this is a direct HTTP request
if (isset($_SERVER['REQUEST_METHOD'])) {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');

    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

require_once dirname(__DIR__) . '/api_keys.php';

class EnhancedMarketAPI {
    private $cacheFile = 'enhanced_market_cache.json';
    private $cacheTimeout = 60; // 1 minute cache for real-time data
    private $twelveDataApiKey;
    private $twelveDataBaseUrl;
    
    public function __construct() {
        $this->twelveDataApiKey = TWELVE_DATA_API_KEY;
        $this->twelveDataBaseUrl = TWELVE_DATA_SETTINGS['base_url'];
        
        // Create cache directory if it doesn't exist
        $cacheDir = dirname($this->cacheFile);
        if (!is_dir($cacheDir)) {
            mkdir($cacheDir, 0755, true);
        }
    }
    
    /**
     * Get real-time quote data from Twelve Data API
     */
    private function getTwelveDataQuote($symbol) {
        if (!$this->twelveDataApiKey) {
            return null;
        }
        
        $url = $this->twelveDataBaseUrl . '/quote';
        $params = [
            'symbol' => $symbol,
            'apikey' => $this->twelveDataApiKey
        ];
        
        $fullUrl = $url . '?' . http_build_query($params);
        
        $context = stream_context_create([
            'http' => [
                'timeout' => TWELVE_DATA_SETTINGS['timeout'],
                'method' => 'GET',
                'header' => 'User-Agent: TickerChart-AI/3.0'
            ]
        ]);
        
        $response = @file_get_contents($fullUrl, false, $context);
        
        if ($response === false) {
            return null;
        }
        
        $data = json_decode($response, true);
        
        if (!$data || isset($data['status']) && $data['status'] === 'error') {
            return null;
        }
        
        return $data;
    }
    
    /**
     * Get time series data from Twelve Data API
     */
    private function getTwelveDataTimeSeries($symbol, $interval = '1day', $outputsize = 100) {
        if (!$this->twelveDataApiKey) {
            return null;
        }
        
        $url = $this->twelveDataBaseUrl . '/time_series';
        $params = [
            'symbol' => $symbol,
            'interval' => $interval,
            'outputsize' => $outputsize,
            'apikey' => $this->twelveDataApiKey
        ];
        
        $fullUrl = $url . '?' . http_build_query($params);
        
        $context = stream_context_create([
            'http' => [
                'timeout' => TWELVE_DATA_SETTINGS['timeout'],
                'method' => 'GET',
                'header' => 'User-Agent: TickerChart-AI/3.0'
            ]
        ]);
        
        $response = @file_get_contents($fullUrl, false, $context);
        
        if ($response === false) {
            return null;
        }
        
        $data = json_decode($response, true);
        
        if (!$data || isset($data['status']) && $data['status'] === 'error') {
            return null;
        }
        
        return $data;
    }
    
    /**
     * Get company profile from Twelve Data API
     */
    private function getTwelveDataCompanyProfile($symbol) {
        if (!$this->twelveDataApiKey) {
            return null;
        }
        
        $url = $this->twelveDataBaseUrl . '/company_profile';
        $params = [
            'symbol' => $symbol,
            'apikey' => $this->twelveDataApiKey
        ];
        
        $fullUrl = $url . '?' . http_build_query($params);
        
        $context = stream_context_create([
            'http' => [
                'timeout' => TWELVE_DATA_SETTINGS['timeout'],
                'method' => 'GET',
                'header' => 'User-Agent: TickerChart-AI/3.0'
            ]
        ]);
        
        $response = @file_get_contents($fullUrl, false, $context);
        
        if ($response === false) {
            return null;
        }
        
        $data = json_decode($response, true);
        
        if (!$data || isset($data['status']) && $data['status'] === 'error') {
            return null;
        }
        
        return $data;
    }
    
    /**
     * Get earnings data from Twelve Data API
     */
    private function getTwelveDataEarnings($symbol) {
        if (!$this->twelveDataApiKey) {
            return null;
        }
        
        $url = $this->twelveDataBaseUrl . '/earnings';
        $params = [
            'symbol' => $symbol,
            'apikey' => $this->twelveDataApiKey
        ];
        
        $fullUrl = $url . '?' . http_build_query($params);
        
        $context = stream_context_create([
            'http' => [
                'timeout' => TWELVE_DATA_SETTINGS['timeout'],
                'method' => 'GET',
                'header' => 'User-Agent: TickerChart-AI/3.0'
            ]
        ]);
        
        $response = @file_get_contents($fullUrl, false, $context);
        
        if ($response === false) {
            return null;
        }
        
        $data = json_decode($response, true);
        
        if (!$data || isset($data['status']) && $data['status'] === 'error') {
            return null;
        }
        
        return $data;
    }
    
    /**
     * Calculate technical indicators
     */
    private function calculateTechnicalIndicators($timeSeriesData) {
        if (!$timeSeriesData || !isset($timeSeriesData['values'])) {
            return [];
        }
        
        $values = array_reverse($timeSeriesData['values']); // Reverse to get chronological order
        $prices = array_map(function($item) {
            return floatval($item['close']);
        }, $values);
        
        $volumes = array_map(function($item) {
            return intval($item['volume']);
        }, $values);
        
        $indicators = [];
        
        // Simple Moving Averages
        if (count($prices) >= 20) {
            $indicators['sma_20'] = array_sum(array_slice($prices, -20)) / 20;
        }
        if (count($prices) >= 50) {
            $indicators['sma_50'] = array_sum(array_slice($prices, -50)) / 50;
        }
        
        // RSI (Relative Strength Index)
        if (count($prices) >= 14) {
            $gains = [];
            $losses = [];
            
            for ($i = 1; $i < count($prices); $i++) {
                $change = $prices[$i] - $prices[$i-1];
                if ($change > 0) {
                    $gains[] = $change;
                    $losses[] = 0;
                } else {
                    $gains[] = 0;
                    $losses[] = abs($change);
                }
            }
            
            $avgGain = array_sum(array_slice($gains, -14)) / 14;
            $avgLoss = array_sum(array_slice($losses, -14)) / 14;
            
            if ($avgLoss > 0) {
                $rs = $avgGain / $avgLoss;
                $indicators['rsi'] = 100 - (100 / (1 + $rs));
            } else {
                $indicators['rsi'] = 100;
            }
        }
        
        // Volume analysis
        if (count($volumes) >= 20) {
            $indicators['avg_volume'] = array_sum(array_slice($volumes, -20)) / 20;
            $indicators['current_volume'] = end($volumes);
        }
        
        // Price change
        if (count($prices) >= 2) {
            $currentPrice = end($prices);
            $previousPrice = $prices[count($prices) - 2];
            $indicators['price_change'] = $currentPrice - $previousPrice;
            $indicators['price_change_percent'] = (($currentPrice - $previousPrice) / $previousPrice) * 100;
        }
        
        return $indicators;
    }
    
    /**
     * Get comprehensive stock data
     */
    public function getStockData($symbol) {
        $cacheKey = "stock_data_{$symbol}";
        $cachedData = $this->getCachedData($cacheKey);
        
        if ($cachedData !== null) {
            return $cachedData;
        }
        
        // Get real-time quote
        $quoteData = $this->getTwelveDataQuote($symbol);
        
        // Get time series data
        $timeSeriesData = $this->getTwelveDataTimeSeries($symbol);
        
        // Get company profile
        $companyProfile = $this->getTwelveDataCompanyProfile($symbol);
        
        // Get earnings data
        $earningsData = $this->getTwelveDataEarnings($symbol);
        
        // Calculate technical indicators
        $technicalIndicators = $this->calculateTechnicalIndicators($timeSeriesData);
        
        // Prepare response
        $response = [
            'success' => true,
            'symbol' => $symbol,
            'timestamp' => date('Y-m-d H:i:s'),
            'data_source' => 'twelve_data',
            'quote' => $quoteData,
            'technical_indicators' => $technicalIndicators,
            'company_profile' => $companyProfile,
            'earnings' => $earningsData,
            'time_series' => $timeSeriesData
        ];
        
        // Cache the data
        $this->setCachedData($cacheKey, $response);
        
        return $response;
    }
    
    /**
     * Get market overview for Saudi stocks
     */
    public function getMarketOverview() {
        $cacheKey = "market_overview";
        $cachedData = $this->getCachedData($cacheKey);
        
        if ($cachedData !== null) {
            return $cachedData;
        }
        
        $marketData = [];
        $topGainers = [];
        $topLosers = [];
        
        // Get data for major Saudi stocks
        $majorStocks = array_slice(SAUDI_STOCKS, 0, 20); // Limit to top 20 stocks
        
        foreach ($majorStocks as $symbol => $name) {
            $stockData = $this->getStockData($symbol);
            
            if ($stockData['success'] && isset($stockData['quote'])) {
                $quote = $stockData['quote'];
                $changePercent = floatval($quote['percent_change'] ?? 0);
                
                $marketData[] = [
                    'symbol' => $symbol,
                    'name' => $name,
                    'price' => floatval($quote['close'] ?? 0),
                    'change' => floatval($quote['change'] ?? 0),
                    'change_percent' => $changePercent,
                    'volume' => intval($quote['volume'] ?? 0),
                    'high' => floatval($quote['high'] ?? 0),
                    'low' => floatval($quote['low'] ?? 0),
                    'open' => floatval($quote['open'] ?? 0)
                ];
                
                // Categorize as gainer or loser
                if ($changePercent > 0) {
                    $topGainers[] = [
                        'symbol' => $symbol,
                        'name' => $name,
                        'change_percent' => $changePercent,
                        'price' => floatval($quote['close'] ?? 0)
                    ];
                } elseif ($changePercent < 0) {
                    $topLosers[] = [
                        'symbol' => $symbol,
                        'name' => $name,
                        'change_percent' => $changePercent,
                        'price' => floatval($quote['close'] ?? 0)
                    ];
                }
            }
        }
        
        // Sort gainers and losers
        usort($topGainers, function($a, $b) {
            return $b['change_percent'] <=> $a['change_percent'];
        });
        
        usort($topLosers, function($a, $b) {
            return $a['change_percent'] <=> $b['change_percent'];
        });
        
        // If no real data available, use sample data
        if (count($marketData) === 0) {
            error_log("No real data available, using sample data");
            $marketData = [
                [
                    'symbol' => '1180.SR',
                    'name' => 'البنك الأهلي السعودي',
                    'price' => 45.20,
                    'change' => 0.85,
                    'change_percent' => 1.92,
                    'volume' => 12500000,
                    'high' => 45.50,
                    'low' => 44.80,
                    'open' => 44.35
                ],
                [
                    'symbol' => '1120.SR',
                    'name' => 'الراجحي',
                    'price' => 32.15,
                    'change' => -0.45,
                    'change_percent' => -1.38,
                    'volume' => 8900000,
                    'high' => 32.80,
                    'low' => 32.10,
                    'open' => 32.60
                ],
                [
                    'symbol' => '2010.SR',
                    'name' => 'سابك',
                    'price' => 78.90,
                    'change' => 1.20,
                    'change_percent' => 1.54,
                    'volume' => 15600000,
                    'high' => 79.20,
                    'low' => 78.50,
                    'open' => 77.70
                ],
                [
                    'symbol' => '7010.SR',
                    'name' => 'الاتصالات السعودية',
                    'price' => 28.75,
                    'change' => 0.30,
                    'change_percent' => 1.05,
                    'volume' => 11200000,
                    'high' => 28.90,
                    'low' => 28.60,
                    'open' => 28.45
                ],
                [
                    'symbol' => '2222.SR',
                    'name' => 'الزيت العربية',
                    'price' => 35.60,
                    'change' => -0.80,
                    'change_percent' => -2.20,
                    'volume' => 7800000,
                    'high' => 36.20,
                    'low' => 35.50,
                    'open' => 36.40
                ],
                [
                    'symbol' => '1010.SR',
                    'name' => 'الرياض',
                    'price' => 22.40,
                    'change' => 0.15,
                    'change_percent' => 0.67,
                    'volume' => 4500000,
                    'high' => 22.60,
                    'low' => 22.30,
                    'open' => 22.25
                ],
                [
                    'symbol' => '1020.SR',
                    'name' => 'البلاد',
                    'price' => 18.90,
                    'change' => -0.25,
                    'change_percent' => -1.31,
                    'volume' => 3200000,
                    'high' => 19.20,
                    'low' => 18.85,
                    'open' => 19.15
                ],
                [
                    'symbol' => '1030.SR',
                    'name' => 'ساب',
                    'price' => 29.80,
                    'change' => 0.40,
                    'change_percent' => 1.36,
                    'volume' => 6800000,
                    'high' => 30.00,
                    'low' => 29.70,
                    'open' => 29.40
                ]
            ];
            
            $topGainers = [
                [
                    'symbol' => '1180.SR',
                    'name' => 'البنك الأهلي السعودي',
                    'change_percent' => 1.92,
                    'price' => 45.20
                ],
                [
                    'symbol' => '2010.SR',
                    'name' => 'سابك',
                    'change_percent' => 1.54,
                    'price' => 78.90
                ],
                [
                    'symbol' => '1030.SR',
                    'name' => 'ساب',
                    'change_percent' => 1.36,
                    'price' => 29.80
                ],
                [
                    'symbol' => '7010.SR',
                    'name' => 'الاتصالات السعودية',
                    'change_percent' => 1.05,
                    'price' => 28.75
                ],
                [
                    'symbol' => '1010.SR',
                    'name' => 'الرياض',
                    'change_percent' => 0.67,
                    'price' => 22.40
                ]
            ];
            
            $topLosers = [
                [
                    'symbol' => '2222.SR',
                    'name' => 'الزيت العربية',
                    'change_percent' => -2.20,
                    'price' => 35.60
                ],
                [
                    'symbol' => '1020.SR',
                    'name' => 'البلاد',
                    'change_percent' => -1.31,
                    'price' => 18.90
                ],
                [
                    'symbol' => '1120.SR',
                    'name' => 'الراجحي',
                    'change_percent' => -1.38,
                    'price' => 32.15
                ]
            ];
        }
        
        $response = [
            'success' => true,
            'timestamp' => date('Y-m-d H:i:s'),
            'data_source' => 'sample_data',
            'market_data' => $marketData,
            'top_gainers' => array_slice($topGainers, 0, 10),
            'top_losers' => array_slice($topLosers, 0, 10),
            'total_stocks' => count($marketData)
        ];
        
        error_log("Market data count: " . count($marketData));
        error_log("Data source: " . $response['data_source']);
        
        // Cache the data
        $this->setCachedData($cacheKey, $response);
        
        return $response;
    }
    
    /**
     * Get detailed company insights
     */
    public function getCompanyInsights($symbol) {
        $cacheKey = "company_insights_{$symbol}";
        $cachedData = $this->getCachedData($cacheKey);
        
        if ($cachedData !== null) {
            return $cachedData;
        }
        
        // Get all available data
        $quoteData = $this->getTwelveDataQuote($symbol);
        $timeSeriesData = $this->getTwelveDataTimeSeries($symbol);
        $companyProfile = $this->getTwelveDataCompanyProfile($symbol);
        $earningsData = $this->getTwelveDataEarnings($symbol);
        $technicalIndicators = $this->calculateTechnicalIndicators($timeSeriesData);
        
        // Generate AI insights
        $aiInsights = $this->generateAIInsights($quoteData, $technicalIndicators, $earningsData);
        
        $response = [
            'success' => true,
            'symbol' => $symbol,
            'timestamp' => date('Y-m-d H:i:s'),
            'data_source' => 'twelve_data',
            'quote' => $quoteData,
            'company_profile' => $companyProfile,
            'earnings' => $earningsData,
            'technical_indicators' => $technicalIndicators,
            'ai_insights' => $aiInsights,
            'risk_analysis' => $this->analyzeRisk($quoteData, $technicalIndicators),
            'recommendations' => $this->generateRecommendations($aiInsights, $technicalIndicators)
        ];
        
        // Cache the data
        $this->setCachedData($cacheKey, $response);
        
        return $response;
    }
    
    /**
     * Generate AI insights based on data
     */
    private function generateAIInsights($quoteData, $technicalIndicators, $earningsData) {
        $insights = [];
        
        if (!$quoteData) {
            return $insights;
        }
        
        $currentPrice = floatval($quoteData['close'] ?? 0);
        $changePercent = floatval($quoteData['percent_change'] ?? 0);
        $volume = intval($quoteData['volume'] ?? 0);
        
        // Price movement analysis
        if ($changePercent > 2) {
            $insights['price_movement'] = 'قوي صاعد - السهم يظهر قوة شرائية واضحة';
        } elseif ($changePercent > 0) {
            $insights['price_movement'] = 'صاعد معتدل - اتجاه إيجابي';
        } elseif ($changePercent > -2) {
            $insights['price_movement'] = 'هابط معتدل - انخفاض محدود';
        } else {
            $insights['price_movement'] = 'قوي هابط - ضغط بيعي واضح';
        }
        
        // RSI analysis
        if (isset($technicalIndicators['rsi'])) {
            $rsi = $technicalIndicators['rsi'];
            if ($rsi > 70) {
                $insights['rsi'] = 'مشبع شراء - احتمال انعكاس للهبوط';
            } elseif ($rsi < 30) {
                $insights['rsi'] = 'مشبع بيع - احتمال انعكاس للصعود';
            } else {
                $insights['rsi'] = 'في النطاق الطبيعي';
            }
        }
        
        // Volume analysis
        if (isset($technicalIndicators['avg_volume']) && isset($technicalIndicators['current_volume'])) {
            $avgVolume = $technicalIndicators['avg_volume'];
            $currentVolume = $technicalIndicators['current_volume'];
            
            if ($currentVolume > $avgVolume * 1.5) {
                $insights['volume'] = 'حجم تداول مرتفع - اهتمام قوي بالسهم';
            } elseif ($currentVolume < $avgVolume * 0.5) {
                $insights['volume'] = 'حجم تداول منخفض - اهتمام محدود';
            } else {
                $insights['volume'] = 'حجم تداول طبيعي';
            }
        }
        
        // Moving averages analysis
        if (isset($technicalIndicators['sma_20']) && isset($technicalIndicators['sma_50'])) {
            $sma20 = $technicalIndicators['sma_20'];
            $sma50 = $technicalIndicators['sma_50'];
            
            if ($currentPrice > $sma20 && $sma20 > $sma50) {
                $insights['trend'] = 'اتجاه صاعد قوي - السهم فوق المتوسطات المتحركة';
            } elseif ($currentPrice < $sma20 && $sma20 < $sma50) {
                $insights['trend'] = 'اتجاه هابط - السهم تحت المتوسطات المتحركة';
            } else {
                $insights['trend'] = 'اتجاه متذبذب - انتظار تأكيد الاتجاه';
            }
        }
        
        return $insights;
    }
    
    /**
     * Analyze risk factors
     */
    private function analyzeRisk($quoteData, $technicalIndicators) {
        $risk = [
            'level' => 'متوسط',
            'factors' => [],
            'support_level' => null,
            'resistance_level' => null
        ];
        
        if (!$quoteData) {
            return $risk;
        }
        
        $currentPrice = floatval($quoteData['close'] ?? 0);
        $changePercent = abs(floatval($quoteData['percent_change'] ?? 0));
        
        // Volatility risk
        if ($changePercent > 5) {
            $risk['factors'][] = 'تقلب عالي في السعر';
            $risk['level'] = 'عالي';
        } elseif ($changePercent > 2) {
            $risk['factors'][] = 'تقلب معتدل';
        } else {
            $risk['factors'][] = 'استقرار نسبي';
            $risk['level'] = 'منخفض';
        }
        
        // RSI risk
        if (isset($technicalIndicators['rsi'])) {
            $rsi = $technicalIndicators['rsi'];
            if ($rsi > 80 || $rsi < 20) {
                $risk['factors'][] = 'مؤشر RSI في مناطق متطرفة';
                $risk['level'] = 'عالي';
            }
        }
        
        // Support and resistance levels (simplified)
        if (isset($technicalIndicators['sma_20'])) {
            $risk['support_level'] = $technicalIndicators['sma_20'] * 0.95;
            $risk['resistance_level'] = $technicalIndicators['sma_20'] * 1.05;
        }
        
        return $risk;
    }
    
    /**
     * Generate trading recommendations
     */
    private function generateRecommendations($aiInsights, $technicalIndicators) {
        $recommendations = [];
        
        if (isset($aiInsights['trend'])) {
            if (strpos($aiInsights['trend'], 'صاعد قوي') !== false) {
                $recommendations[] = 'شراء - الاتجاه صاعد قوي';
            } elseif (strpos($aiInsights['trend'], 'هابط') !== false) {
                $recommendations[] = 'بيع - الاتجاه هابط';
            } else {
                $recommendations[] = 'انتظار - انتظار تأكيد الاتجاه';
            }
        }
        
        if (isset($aiInsights['rsi'])) {
            if (strpos($aiInsights['rsi'], 'مشبع بيع') !== false) {
                $recommendations[] = 'شراء - فرصة انعكاس صاعد';
            } elseif (strpos($aiInsights['rsi'], 'مشبع شراء') !== false) {
                $recommendations[] = 'حذر - احتمال انعكاس هابط';
            }
        }
        
        if (isset($aiInsights['volume'])) {
            if (strpos($aiInsights['volume'], 'مرتفع') !== false) {
                $recommendations[] = 'اهتمام قوي - حجم تداول مرتفع';
            }
        }
        
        return array_unique($recommendations);
    }
    
    /**
     * Cache management
     */
    private function getCachedData($key) {
        if (!CACHE_ENABLED) {
            return null;
        }
        
        $cacheFile = dirname($this->cacheFile) . '/' . md5($key) . '.json';
        
        if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $this->cacheTimeout)) {
            $data = file_get_contents($cacheFile);
            if ($data !== false) {
                return json_decode($data, true);
            }
        }
        
        return null;
    }
    
    private function setCachedData($key, $data) {
        if (!CACHE_ENABLED) {
            return;
        }
        
        $cacheFile = dirname($this->cacheFile) . '/' . md5($key) . '.json';
        file_put_contents($cacheFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
}

// Handle API requests
try {
    $api = new EnhancedMarketAPI();
    
    $action = $_GET['action'] ?? 'market_overview';
    $symbol = $_GET['symbol'] ?? '';
    
    switch ($action) {
        case 'stock_data':
            if (empty($symbol)) {
                throw new Exception('Symbol parameter is required');
            }
            $result = $api->getStockData($symbol);
            break;
            
        case 'company_insights':
            if (empty($symbol)) {
                throw new Exception('Symbol parameter is required');
            }
            $result = $api->getCompanyInsights($symbol);
            break;
            
        case 'market_overview':
        default:
            $result = $api->getMarketOverview();
            break;
    }
    
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
?> 