<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TickerChart AI - سوق الأسهم السعودي | الذكاء الاصطناعي المتقدم |</title>
    
    <!-- Preload critical resources -->
    <link rel="preload" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" as="style">
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" as="style">
    <link rel="preload" href="assets/css/style-optimized.css" as="style">
    
    <!-- Load CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="assets/css/style-optimized.css" rel="stylesheet">
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%231e3a8a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='42' fill='%23f59e0b'%3ET%3C/text%3E%3C/svg%3E">
    
    <!-- Preload Chart.js -->
    <link rel="preload" href="https://cdn.jsdelivr.net/npm/chart.js" as="script">
</head>
<body>
    <!-- Simplified Loading Screen -->
    <div id="loadingScreen" class="loading-screen" style="display: none;">
        <div class="loading-content">
            <div class="gears-container">
                <div class="gear gear-1">
                    <i class="fas fa-cog"></i>
                </div>
                <div class="gear gear-2">
                    <i class="fas fa-cog"></i>
                </div>
                <div class="gear gear-3">
                    <i class="fas fa-cog"></i>
                </div>
            </div>
            <div class="loading-text">
                <h2 class="brand-title">TickerChart AI</h2>
                <p class="brand-subtitle">سوق الأسهم السعودي - الذكاء الاصطناعي المتقدم</p>
                <div class="loading-bar">
                    <div class="loading-progress"></div>
                </div>
                <p class="loading-status">جاري تحميل البيانات...</p>
            </div>
        </div>
    </div>

    <!-- Header -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="#">
                <i class="fas fa-chart-line me-2"></i>
                <span class="brand-text">TickerChart AI</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="#home">الرئيسية</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#market">السوق</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#ai-tools">أدوات الذكاء الاصطناعي</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#analysis">التحليل</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#about">عن المطور</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero-section">
        <div class="container">
            <div class="row align-items-center min-vh-100">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold text-white mb-4 animate-on-scroll">
                        <span class="text-warning">TickerChart AI</span>
                        <br>
                        أداة الذكاء الاصطناعي المتقدمة
                        <span class="text-warning">لسوق الأسهم السعودي</span>
                    </h1>
                    <p class="lead text-white mb-4 animate-on-scroll">
                        احصل على تحليلات ذكية وتوقعات دقيقة لسوق الأسهم السعودي باستخدام أحدث تقنيات الذكاء الاصطناعي
                    </p>
                    <p class="text-white-50 mb-4 animate-on-scroll">
                        <i class="fas fa-code me-2"></i>
                        تم التطوير بواسطة <span class="text-warning fw-bold">المهندس خالد أحمد حجاج</span>
                    </p>
                    <div class="d-flex gap-3 animate-on-scroll">
                        <a href="#market" class="btn btn-warning btn-lg">
                            <i class="fas fa-chart-bar me-2"></i>
                            استكشف السوق
                        </a>
                        <a href="#ai-tools" class="btn btn-outline-light btn-lg">
                            <i class="fas fa-robot me-2"></i>
                            أدوات الذكاء الاصطناعي
                        </a>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="hero-chart animate-on-scroll">
                        <canvas id="heroChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Market Overview -->
    <section id="market" class="py-5 animate-on-scroll">
        <div class="container-fluid">
            <!-- Market Control Bar -->
            <div class="market-control-bar">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <div class="market-status">
                            <i class="fas fa-user me-2"></i>
                            <span class="status-text">زائر</span>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="market-summary">
                            <div class="summary-item">
                                <span class="label">سيولة السوق</span>
                                <span class="value liquidity-value">49.66%</span>
                            </div>
                            <div class="summary-item">
                                <span class="label">الشركات</span>
                                <span class="value">148 <span class="up">7</span> <span class="down">104</span></span>
                            </div>
                            <div class="summary-item">
                                <span class="label">الصفقات</span>
                                <span class="value">461,329</span>
                            </div>
                            <div class="summary-item">
                                <span class="label">قيمة التداول</span>
                                <span class="value">3,869,385,110</span>
                            </div>
                            <div class="summary-item">
                                <span class="label">حجم التداول</span>
                                <span class="value">216,532,966</span>
                            </div>
                            <div class="summary-item">
                                <span class="label">المؤشر العام للسوق</span>
                                <span class="value">10,885.58 <span class="change down">-11.81 (-0.11%)</span></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="market-time">
                            <span class="time-status">مغلق</span>
                            <span class="current-time">15:19:59</span>
                            <div class="market-selector">
                                <span>سوق الأسهم السعودي</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Market Overview Chart -->
            <div class="market-overview-section">
                <div class="row">
                    <div class="col-12">
                        <div class="market-chart-header">
                            <div class="chart-title">
                                <h2 class="market-title">
                                    <i class="fas fa-chart-line text-primary me-2"></i>
                                    مؤشر السوق السعودي (TASI)
                                </h2>
                                <div class="market-index-info">
                                    <span class="index-value" id="tasiValue">10,885.58</span>
                                    <span class="index-change down" id="tasiChange">-11.81 (-0.11%)</span>
                                </div>
                            </div>
                            <div class="chart-controls">
                                <div class="timeframe-controls">
                                    <button class="btn btn-sm btn-outline-primary active" data-period="1d">يوم</button>
                                    <button class="btn btn-sm btn-outline-primary" data-period="5d">أسبوع</button>
                                    <button class="btn btn-sm btn-outline-primary" data-period="1mo">شهر</button>
                                    <button class="btn btn-sm btn-outline-primary" data-period="3mo">3 أشهر</button>
                                    <button class="btn btn-sm btn-outline-primary" data-period="1y">سنة</button>
                                </div>
                                <div class="chart-tools">
                                    <button class="btn btn-sm btn-outline-secondary" id="fullscreenBtn">
                                        <i class="fas fa-expand"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary" id="downloadBtn">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-8">
                        <div class="main-chart-container">
                            <div class="chart-wrapper">
                                <canvas id="tasiChart" height="400"></canvas>
                            </div>
                            <div class="volume-chart-container">
                                <canvas id="volumeChart" height="150"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="market-sidebar">
                            <div class="market-summary-card">
                                <h5 class="card-title">
                                    <i class="fas fa-info-circle me-2"></i>
                                    ملخص السوق
                                </h5>
                                <div class="summary-items">
                                    <div class="summary-item">
                                        <span class="label">حجم التداول:</span>
                                        <span class="value" id="totalVolume">216,532,966</span>
                                    </div>
                                    <div class="summary-item">
                                        <span class="label">قيمة التداول:</span>
                                        <span class="value" id="totalValue">3,869,385,110</span>
                                    </div>
                                    <div class="summary-item">
                                        <span class="label">عدد الصفقات:</span>
                                        <span class="value" id="totalDeals">461,329</span>
                                    </div>
                                    <div class="summary-item">
                                        <span class="label">الشركات النشطة:</span>
                                        <span class="value" id="activeCompanies">148</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="market-performance-card">
                                <h5 class="card-title">
                                    <i class="fas fa-chart-bar me-2"></i>
                                    أداء السوق
                                </h5>
                                <div class="performance-items">
                                    <div class="performance-item positive">
                                        <i class="fas fa-arrow-up"></i>
                                        <span class="label">شركات مرتفعة</span>
                                        <span class="value" id="upCompanies">47</span>
                                    </div>
                                    <div class="performance-item negative">
                                        <i class="fas fa-arrow-down"></i>
                                        <span class="label">شركات منخفضة</span>
                                        <span class="value" id="downCompanies">89</span>
                                    </div>
                                    <div class="performance-item neutral">
                                        <i class="fas fa-minus"></i>
                                        <span class="label">شركات ثابتة</span>
                                        <span class="value" id="stableCompanies">12</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Individual Companies Section -->
            <div class="market-data-container">
                <div class="row">
                    <div class="col-12">
                        <div class="market-header">
                            <h3 class="market-title">
                                <i class="fas fa-building text-primary me-2"></i>
                                الشركات الفردية
                            </h3>
                            <div class="market-toolbar" id="companiesToolbar">
                                <div class="toolbar-group">
                                    <label for="sectorFilter" class="toolbar-label"><i class="fas fa-filter me-1"></i>القطاع</label>
                                    <select class="form-select form-select-sm" id="sectorFilter">
                                        <option value="">جميع القطاعات</option>
                                        <option value="banking">البنوك</option>
                                        <option value="telecom">الاتصالات</option>
                                        <option value="energy">الطاقة</option>
                                        <option value="materials">المواد الأساسية</option>
                                    </select>
                                </div>
                                <div class="toolbar-group segmented-control" role="group" aria-label="تبديل العرض">
                                    <button class="btn btn-sm btn-outline-primary active" data-view="grid" data-bs-toggle="tooltip" title="عرض شبكي">
                                        <i class="fas fa-th"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-primary" data-view="list" data-bs-toggle="tooltip" title="عرض قائمة">
                                        <i class="fas fa-list"></i>
                                    </button>
                                </div>
                                <div class="toolbar-group flex-grow-1">
                                    <div class="search-box w-100">
                                        <i class="fas fa-search"></i>
                                        <input type="text" class="w-100" placeholder="...البحث عن شركة" id="companySearch">
                                    </div>
                                </div>
                                <div class="toolbar-group">
                                    <button class="btn btn-light btn-sm" id="clearFiltersBtn">
                                        <i class="fas fa-undo me-1"></i>
                                        إعادة التعيين
                                    </button>
                                </div>
                                <div class="toolbar-group">
                                    <span class="counter-badge" id="companiesCount">0 شركة</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row" id="marketData">
                    <!-- Market data will be loaded here -->
                </div>
                
                <!-- Market Statistics -->
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="market-statistics">
                            <div class="stat-card">
                                <div class="stat-icon positive">
                                    <i class="fas fa-arrow-up"></i>
                                </div>
                                <div class="stat-content">
                                    <h4 class="stat-number">47</h4>
                                    <p class="stat-label">شركات مرتفعة</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon negative">
                                    <i class="fas fa-arrow-down"></i>
                                </div>
                                <div class="stat-content">
                                    <h4 class="stat-number">89</h4>
                                    <p class="stat-label">شركات منخفضة</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon neutral">
                                    <i class="fas fa-minus"></i>
                                </div>
                                <div class="stat-content">
                                    <h4 class="stat-number">12</h4>
                                    <p class="stat-label">شركات ثابتة</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon volume">
                                    <i class="fas fa-chart-bar"></i>
                                </div>
                                <div class="stat-content">
                                    <h4 class="stat-number">216.5M</h4>
                                    <p class="stat-label">حجم التداول</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- AI Tools Section -->
    <section id="ai-tools" class="py-5 bg-light animate-on-scroll">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h2 class="text-center mb-5">
                        <i class="fas fa-robot text-primary me-2"></i>
                        أدوات الذكاء الاصطناعي
                    </h2>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm animate-on-scroll">
                        <div class="card-body text-center">
                            <i class="fas fa-brain text-primary fa-3x mb-3"></i>
                            <h5 class="card-title">تحليل الاتجاهات</h5>
                            <p class="card-text">تحليل ذكي لاتجاهات السوق باستخدام خوارزميات متقدمة</p>
                            <button class="btn btn-primary" onclick="openTrendAnalysis()">
                                <i class="fas fa-chart-line me-2"></i>
                                ابدأ التحليل
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm animate-on-scroll">
                        <div class="card-body text-center">
                            <i class="fas fa-crystal-ball text-success fa-3x mb-3"></i>
                            <h5 class="card-title">التنبؤ بالأسعار</h5>
                            <p class="card-text">توقعات دقيقة لحركة الأسعار باستخدام نماذج التعلم الآلي</p>
                            <button class="btn btn-success" onclick="openPricePrediction()">
                                <i class="fas fa-magic me-2"></i>
                                احصل على التوقعات
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm animate-on-scroll">
                        <div class="card-body text-center">
                            <i class="fas fa-shield-alt text-warning fa-3x mb-3"></i>
                            <h5 class="card-title">إدارة المخاطر</h5>
                            <p class="card-text">تحليل المخاطر وتوصيات إدارة المحفظة الاستثمارية</p>
                            <button class="btn btn-warning" onclick="openRiskManagement()">
                                <i class="fas fa-shield-alt me-2"></i>
                                تحليل المخاطر
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-lg-6 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body text-center">
                            <i class="fas fa-search text-info fa-3x mb-3"></i>
                            <h5 class="card-title">محلل الأسهم المتقدم</h5>
                            <p class="card-text">تحليل شامل لأي سهم مع المؤشرات الفنية والتوقعات</p>
                            <div class="input-group mb-3">
                                <select class="form-select" id="stockAnalyzerSelect">
                                    <option value="">اختر السهم...</option>
                                </select>
                                <button class="btn btn-info" onclick="analyzeSelectedStock()">
                                    <i class="fas fa-search me-2"></i>
                                    تحليل
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body text-center">
                            <i class="fas fa-chart-pie text-success fa-3x mb-3"></i>
                            <h5 class="card-title">تحليل المحفظة</h5>
                            <p class="card-text">تحليل أداء المحفظة الاستثمارية وتوصيات التحسين</p>
                            <button class="btn btn-success" onclick="openPortfolioAnalysis()">
                                <i class="fas fa-chart-pie me-2"></i>
                                تحليل المحفظة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Analysis Section -->
    <section id="analysis" class="py-5 animate-on-scroll">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h2 class="text-center mb-5">
                        <i class="fas fa-analytics text-primary me-2"></i>
                        التحليل المتقدم
                    </h2>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-8">
                    <div class="analysis-chart-card">
                        <div class="chart-header">
                            <div class="chart-title">
                                <h5 class="mb-0">
                                    <i class="fas fa-chart-area me-2"></i>
                                    الرسم البياني التفاعلي
                                </h5>
                                <div class="chart-controls">
                                    <div class="timeframe-controls">
                                        <button class="btn btn-sm btn-outline-primary active" data-period="1d">يوم</button>
                                        <button class="btn btn-sm btn-outline-primary" data-period="5d">أسبوع</button>
                                        <button class="btn btn-sm btn-outline-primary" data-period="1mo">شهر</button>
                                        <button class="btn btn-sm btn-outline-primary" data-period="3mo">3 أشهر</button>
                                    </div>
                                    <div class="chart-tools">
                                        <button class="btn btn-sm btn-outline-secondary" id="analysisFullscreenBtn">
                                            <i class="fas fa-expand"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-secondary" id="analysisDownloadBtn">
                                            <i class="fas fa-download"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="analysisChart" height="400"></canvas>
                        </div>
                        <div class="chart-legend">
                            <div class="legend-item">
                                <span class="legend-color" style="background: #3b82f6;"></span>
                                <span class="legend-label">السعر</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color" style="background: #10b981;"></span>
                                <span class="legend-label">المتوسط المتحرك</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="indicators-card">
                        <div class="indicators-header">
                            <h5 class="mb-0">
                                <i class="fas fa-chart-line me-2"></i>
                                مؤشرات السوق
                            </h5>
                            <div class="last-update">
                                <i class="fas fa-clock me-1"></i>
                                <span id="indicatorsLastUpdate">آخر تحديث: --:--</span>
                            </div>
                        </div>
                        <div class="indicators-body" id="marketIndicators">
                            <div class="indicator-item" data-symbol="^TASI">
                                <div class="indicator-icon">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                                <div class="indicator-info">
                                    <div class="indicator-name">تداول</div>
                                    <div class="indicator-value" id="tasiValue">--</div>
                                    <div class="indicator-change" id="tasiChange">--</div>
                                </div>
                            </div>
                            <div class="indicator-item" data-symbol="^NOMU">
                                <div class="indicator-icon">
                                    <i class="fas fa-chart-bar"></i>
                                </div>
                                <div class="indicator-info">
                                    <div class="indicator-name">نمو</div>
                                    <div class="indicator-value" id="nomuValue">--</div>
                                    <div class="indicator-change" id="nomuChange">--</div>
                                </div>
                            </div>
                            <div class="indicator-item" data-symbol="CL=F">
                                <div class="indicator-icon">
                                    <i class="fas fa-oil-can"></i>
                                </div>
                                <div class="indicator-info">
                                    <div class="indicator-name">النفط</div>
                                    <div class="indicator-value" id="oilValue">--</div>
                                    <div class="indicator-change" id="oilChange">--</div>
                                </div>
                            </div>
                            <div class="indicator-item" data-symbol="GC=F">
                                <div class="indicator-icon">
                                    <i class="fas fa-coins"></i>
                                </div>
                                <div class="indicator-info">
                                    <div class="indicator-name">الذهب</div>
                                    <div class="indicator-value" id="goldValue">--</div>
                                    <div class="indicator-change" id="goldChange">--</div>
                                </div>
                            </div>
                            <div class="indicator-item" data-symbol="SAR=X">
                                <div class="indicator-icon">
                                    <i class="fas fa-dollar-sign"></i>
                                </div>
                                <div class="indicator-info">
                                    <div class="indicator-name">الدولار</div>
                                    <div class="indicator-value" id="usdValue">--</div>
                                    <div class="indicator-change" id="usdChange">--</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About Developer Section -->
    <section id="about" class="py-5 bg-light animate-on-scroll">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h2 class="text-center mb-5">
                        <i class="fas fa-user-tie text-primary me-2"></i>
                        عن المطور
                    </h2>
                </div>
            </div>
            <div class="row align-items-center">
                <div class="col-lg-4 text-center mb-4">
                    <div class="developer-avatar">
                        <i class="fas fa-user-circle fa-8x text-primary mb-3"></i>
                        <h4 class="text-primary">المهندس خالد أحمد حجاج</h4>
                        <p class="text-muted">مطور ومصمم مواقع الويب</p>
                    </div>
                </div>
                <div class="col-lg-8">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title text-primary mb-3">
                                <i class="fas fa-code me-2"></i>
                                نبذة عن <span class="brand-text">TickerChart AI</span>
                            </h5>
                            <p class="card-text">
                                تم تطوير <strong>TickerChart AI</strong> كمنصة متخصصة في تحليل سوق الأسهم السعودي باستخدام أحدث تقنيات الذكاء الاصطناعي والتعلم الآلي. 
                                يهدف المشروع إلى توفير أداة شاملة ومتقدمة للمستثمرين في السوق السعودي، مع التركيز على:
                            </p>
                            <ul class="list-unstyled">
                                <li><i class="fas fa-check text-success me-2"></i>تحليل ذكي للاتجاهات باستخدام خوارزميات متقدمة</li>
                                <li><i class="fas fa-check text-success me-2"></i>توقعات دقيقة للأسعار باستخدام نماذج التعلم الآلي</li>
                                <li><i class="fas fa-check text-success me-2"></i>إدارة المخاطر وتوصيات استثمارية ذكية</li>
                                <li><i class="fas fa-check text-success me-2"></i>واجهة عربية سهلة الاستخدام ومتجاوبة</li>
                                <li><i class="fas fa-check text-success me-2"></i>تحديثات حية لبيانات السوق</li>
                            </ul>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="text-primary">التقنيات المستخدمة:</h6>
                                    <div class="tech-stack">
                                        <span class="badge bg-primary me-2 mb-2">PHP</span>
                                        <span class="badge bg-success me-2 mb-2">Python</span>
                                        <span class="badge bg-info me-2 mb-2">JavaScript</span>
                                        <span class="badge bg-warning me-2 mb-2">Bootstrap</span>
                                        <span class="badge bg-danger me-2 mb-2">Machine Learning</span>
                                        <span class="badge bg-secondary me-2 mb-2">Chart.js</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="text-primary">المميزات:</h6>
                                    <div class="features">
                                        <span class="badge bg-success me-2 mb-2">ذكاء اصطناعي</span>
                                        <span class="badge bg-info me-2 mb-2">تحليل فني</span>
                                        <span class="badge bg-warning me-2 mb-2">توقعات الأسعار</span>
                                        <span class="badge bg-danger me-2 mb-2">إدارة المخاطر</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5>
                        <i class="fas fa-chart-line me-2"></i>
                        <span class="brand-text">TickerChart AI</span>
                    </h5>
                    <p>أداة الذكاء الاصطناعي المتقدمة لتحليل سوق الأسهم السعودي</p>
                    <div class="mt-3">
                        <h6 class="text-warning">المطور:</h6>
                        <p class="mb-1">
                            <i class="fas fa-user-tie me-2"></i>
                            المهندس خالد أحمد حجاج
                        </p>
                        <p class="mb-1">
                            <i class="fas fa-code me-2"></i>
                            مطور ومصمم مواقع الويب
                        </p>
                    </div>
                </div>
                <div class="col-md-4">
                    <h6 class="text-warning mb-3">روابط سريعة</h6>
                    <ul class="list-unstyled">
                        <li><a href="#market" class="text-light text-decoration-none"><i class="fas fa-chart-bar me-2"></i>السوق</a></li>
                        <li><a href="#ai-tools" class="text-light text-decoration-none"><i class="fas fa-robot me-2"></i>أدوات الذكاء الاصطناعي</a></li>
                        <li><a href="#analysis" class="text-light text-decoration-none"><i class="fas fa-analytics me-2"></i>التحليل</a></li>
                        <li><a href="#about" class="text-light text-decoration-none"><i class="fas fa-user-tie me-2"></i>عن المطور</a></li>
                    </ul>
                </div>
                <div class="col-md-4 text-md-end">
                    <h6 class="text-warning mb-3">معلومات الاتصال</h6>
                    <p class="mb-1">
                        <i class="fas fa-clock me-2"></i>
                        آخر تحديث: <span id="lastUpdate"></span>
                    </p>
                    <p class="mb-1">
                        <i class="fas fa-calendar me-2"></i>
                        تاريخ التطوير: 2025
                    </p>
                    <p class="mb-1">
                        <i class="fas fa-map-marker-alt me-2"></i>
                        المملكة العربية السعودية
                    </p>
                    <div class="mt-3">
                        <h6 class="text-warning">التقنيات المستخدمة</h6>
                        <div class="tech-badges">
                            <span class="badge bg-primary me-1 mb-1">PHP</span>
                            <span class="badge bg-success me-1 mb-1">Python</span>
                            <span class="badge bg-info me-1 mb-1">AI/ML</span>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="my-3">
            <div class="row">
                <div class="col-12 text-center">
                    <p class="mb-0">
                        <i class="fas fa-copyright me-2"></i>
                        2025 جميع الحقوق محفوظة - تم التطوير بواسطة 
                        <span class="text-warning fw-bold">المهندس خالد أحمد حجاج</span>
                    </p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Modals -->
    <div class="modal fade" id="trendModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-brain me-2"></i>
                        تحليل الاتجاهات
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="trendModalBody">
                    <!-- Trend analysis content -->
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="predictionModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-crystal-ball me-2"></i>
                        التنبؤ بالأسعار
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="predictionModalBody">
                    <!-- Price prediction content -->
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="riskModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-shield-alt me-2"></i>
                        إدارة المخاطر
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="riskModalBody">
                    <!-- Risk management content -->
                </div>
            </div>
        </div>
    </div>

    <!-- Chart Modal -->
    <div class="modal fade" id="chartModal" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-chart-line me-2"></i>
                        معاينة الرسم البياني
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="chartModalBody">
                    <!-- Chart content will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Stock Analysis Modal -->
    <div class="modal fade" id="stockAnalysisModal" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-search me-2"></i>
                        تحليل شامل للسهم
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="stockAnalysisModalBody">
                    <!-- Stock analysis content will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Portfolio Analysis Modal -->
    <div class="modal fade" id="portfolioModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-chart-pie me-2"></i>
                        تحليل المحفظة الاستثمارية
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="portfolioModalBody">
                    <!-- Portfolio analysis content will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Load JavaScript with performance optimizations -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="assets/js/utils.js"></script>
    <script src="assets/js/charts-optimized.js"></script>
    <script src="assets/js/main-optimized.js"></script>
</body>
</html> 