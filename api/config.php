<?php
/**
 * ملف تكوين API Keys
 * قم بتعديل هذه القيم للحصول على بيانات أكثر دقة
 */

// Alpha Vantage API Key
// احصل على مفتاح مجاني من: https://www.alphavantage.co/support/#api-key
define('ALPHA_VANTAGE_API_KEY', 'demo');

// Yahoo Finance API (لا يحتاج مفتاح)
define('YAHOO_FINANCE_ENABLED', true);

// Tadawul API (لا يحتاج مفتاح)
define('TADAWUL_API_ENABLED', true);

// Argaam API (لا يحتاج مفتاح)
define('ARGAAM_API_ENABLED', true);

// إعدادات التخزين المؤقت
define('CACHE_TIMEOUT', 30); // ثواني
define('CACHE_ENABLED', true);

// إعدادات الاتصال
define('REQUEST_TIMEOUT', 10); // ثواني
define('MAX_RETRIES', 3);

// مصادر البيانات المفضلة (ترتيب الأولوية)
define('DATA_SOURCES', [
    'yahoo_finance',
    'alpha_vantage',
    'tadawul',
    'argaam'
]);

// رموز الأسهم السعودية المدعومة
define('SAUDI_STOCKS', [
    '1180.SR' => 'البنك الأهلي',
    '1120.SR' => 'الراجحي',
    '7010.SR' => 'الاتصالات السعودية',
    '2010.SR' => 'سابك',
    '2222.SR' => 'الزيت العربية',
    '1010.SR' => 'الرياض',
    '2001.SR' => 'كيمانول',
    '2040.SR' => 'الخزف السعودي',
    '2170.SR' => 'اللجين',
    '1320.SR' => 'الأنابيب'
]);

// المؤشرات المدعومة
define('MARKET_INDICATORS', [
    '^TASI' => 'تداول',
    '^NOMU' => 'نمو',
    'CL=F' => 'النفط',
    'GC=F' => 'الذهب',
    'SAR=X' => 'الدولار'
]);

// إعدادات التطبيق
define('APP_NAME', 'TickerChart AI');
define('APP_VERSION', '2.0');
define('APP_DEVELOPER', 'المهندس خالد أحمد حجاج');

// رسائل الخطأ
define('ERROR_MESSAGES', [
    'no_data' => 'لا توجد بيانات حقيقية متاحة حالياً',
    'api_failed' => 'فشل في الاتصال بمصدر البيانات',
    'invalid_symbol' => 'رمز السهم غير صحيح',
    'timeout' => 'انتهت مهلة الاتصال',
    'rate_limit' => 'تم تجاوز حد الطلبات المسموح'
]);

// إعدادات الأمان
define('SECURITY', [
    'enable_cors' => true,
    'allowed_origins' => ['*'],
    'rate_limiting' => true,
    'max_requests_per_minute' => 60
]);
?> 