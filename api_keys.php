<?php
/**
 * API Keys Configuration
 * قم بتعديل هذه القيم للحصول على بيانات أكثر دقة
 * Modify these values to get more accurate data
 */

// Twelve Data API Key - Real-time market data
// Get your key from: https://twelvedata.com/account/api-keys
// احصل على مفتاحك من: https://twelvedata.com/account/api-keys
define('TWELVE_DATA_API_KEY', '753dc5d5ce0144da957847b8a029b43a');

// Alpha Vantage API Key
// Get a free key from: https://www.alphavantage.co/support/#api-key
// احصل على مفتاح مجاني من: https://www.alphavantage.co/support/#api-key
define('ALPHA_VANTAGE_API_KEY', 'demo'); // Replace 'demo' with your actual API key

// Yahoo Finance API (No key required)
define('YAHOO_FINANCE_ENABLED', true);

// Tadawul API (No key required)
define('TADAWUL_API_ENABLED', true);

// Argaam API (No key required)
define('ARGAAM_API_ENABLED', true);

// Cache settings
define('CACHE_TIMEOUT', 30); // seconds
define('CACHE_ENABLED', true);

// Connection settings
define('REQUEST_TIMEOUT', 15); // seconds
define('MAX_RETRIES', 3);

// Data sources priority (order matters) - Updated with Twelve Data
define('DATA_SOURCES', [
    'twelve_data',      // Primary real-time data source
    'yahoo_finance',    // Secondary data source
    'alpha_vantage',    // Backup data source
    'tadawul',          // Saudi market specific
    'argaam'            // Saudi market specific
]);

// Saudi market symbols - Enhanced list
define('SAUDI_STOCKS', [
    // Banks
    '1180.SR' => 'البنك الأهلي السعودي',
    '1120.SR' => 'الراجحي',
    '1010.SR' => 'الرياض',
    '1020.SR' => 'البلاد',
    '1030.SR' => 'ساب',
    '1040.SR' => 'الجزيرة',
    '1050.SR' => 'سامبا',
    '1060.SR' => 'الإنماء',
    '1080.SR' => 'العربي الوطني',
    '1090.SR' => 'الخليج',
    '1100.SR' => 'الاستثمار',
    '1110.SR' => 'الفرنسي السعودي',
    '1130.SR' => 'الدمام',
    '1140.SR' => 'البلاد',
    '1150.SR' => 'الإنماء',
    '1160.SR' => 'الاستثمار',
    '1170.SR' => 'الخليج',
    '1190.SR' => 'الفرنسي السعودي',
    
    // Telecom
    '7010.SR' => 'الاتصالات السعودية',
    '7020.SR' => 'الاتصالات السعودية',
    
    // Materials
    '2010.SR' => 'سابك',
    '2001.SR' => 'كيمانول',
    '2002.SR' => 'سابك',
    '2040.SR' => 'الخزف السعودي',
    '2170.SR' => 'اللجين',
    '1320.SR' => 'الأنابيب',
    '1201.SR' => 'تكوين',
    '1202.SR' => 'مبكو',
    '1210.SR' => 'بي سي آي',
    '1211.SR' => 'معادن',
    '1301.SR' => 'أسلاك',
    '1302.SR' => 'اليمامة',
    '1303.SR' => 'الشرقية',
    '1304.SR' => 'الحديد',
    '1321.SR' => 'الشرقية',
    '1322.SR' => 'الأنابيب',
    
    // Energy
    '2222.SR' => 'الزيت العربية',
    '2380.SR' => 'بترو رابغ',
    '2381.SR' => 'الحفر العربية',
    '2382.SR' => 'أديس',
    
    // Transportation
    '4030.SR' => 'البحري',
    '4200.SR' => 'الدريس',
    '4201.SR' => 'الدريس',
    '4202.SR' => 'الدريس',
    
    // Real Estate
    '4140.SR' => 'الراجحي',
    '4150.SR' => 'الراجحي',
    '4160.SR' => 'الراجحي',
    '4170.SR' => 'الراجحي'
]);

// Market indicators - Enhanced with more symbols
define('MARKET_INDICATORS', [
    '^TASI' => 'تداول',
    '^NOMU' => 'نمو',
    'CL=F' => 'النفط',
    'GC=F' => 'الذهب',
    'SAR=X' => 'الدولار',
    'EUR=X' => 'اليورو',
    'GBP=X' => 'الجنيه الإسترليني',
    'JPY=X' => 'الين الياباني',
    'BTC-USD' => 'البيتكوين',
    'ETH-USD' => 'الإيثيريوم'
]);

// Application settings
define('APP_NAME', 'TickerChart AI');
define('APP_VERSION', '3.0');
define('APP_DEVELOPER', 'المهندس خالد أحمد حجاج');

// Error messages
define('ERROR_MESSAGES', [
    'no_data' => 'لا توجد بيانات حقيقية متاحة حالياً',
    'api_failed' => 'فشل في الاتصال بمصدر البيانات',
    'invalid_symbol' => 'رمز السهم غير صحيح',
    'timeout' => 'انتهت مهلة الاتصال',
    'rate_limit' => 'تم تجاوز حد الطلبات المسموح',
    'network_error' => 'خطأ في الاتصال بالشبكة',
    'server_error' => 'خطأ في الخادم',
    'api_key_invalid' => 'مفتاح API غير صحيح',
    'quota_exceeded' => 'تم استنفاذ الحصة المخصصة'
]);

// Security settings
define('SECURITY', [
    'enable_cors' => true,
    'allowed_origins' => ['*'],
    'rate_limiting' => true,
    'max_requests_per_minute' => 60
]);

// Debug settings
define('DEBUG_MODE', false);
define('LOG_LEVEL', 'error'); // error, warning, info, debug

// Twelve Data API settings
define('TWELVE_DATA_SETTINGS', [
    'base_url' => 'https://api.twelvedata.com',
    'timeout' => 10,
    'max_requests_per_minute' => 800, // Free tier limit
    'endpoints' => [
        'quote' => '/quote',
        'time_series' => '/time_series',
        'price' => '/price',
        'earnings' => '/earnings',
        'income_statement' => '/income_statement',
        'balance_sheet' => '/balance_sheet',
        'cash_flow' => '/cash_flow',
        'company_profile' => '/company_profile'
    ]
]);
?> 