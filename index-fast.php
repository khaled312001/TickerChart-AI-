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
    
    <!-- Load CSS with high priority -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="assets/css/style-optimized.css" rel="stylesheet">
    
    <!-- Favicon -->
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%231e3a8a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='42' fill='%23f59e0b'%3ET%3C/text%3E%3C/svg%3E">
    
    <!-- Performance meta tags -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="أداة الذكاء الاصطناعي المتقدمة لتحليل سوق الأسهم السعودي - تم التطوير بواسطة المهندس خالد أحمد حجاج">
    <meta name="keywords" content="سوق الأسهم السعودي, الذكاء الاصطناعي, تحليل الأسهم, TASI, السعودية">
    <meta name="author" content="المهندس خالد أحمد حجاج">
    
    <!-- Critical CSS inline for immediate rendering -->
    <style>
        /* Critical CSS for immediate rendering */
        body { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; }
        .loading-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); display: flex; justify-content: center; align-items: center; z-index: 9999; }
        .hero-section { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%); min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; }
        .navbar { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%) !important; }
        .main-content { display: none; }
        .stat-card { background: rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 20px; margin-bottom: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }
        .stat-icon { font-size: 2rem; margin-bottom: 10px; }
        .stat-value { font-size: 1.5rem; font-weight: bold; color: #fff; }
        .stat-label { color: rgba(255, 255, 255, 0.8); font-size: 0.9rem; }
        .stock-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .stock-name { font-weight: bold; color: #fff; }
        .stock-symbol { color: rgba(255, 255, 255, 0.7); font-size: 0.8rem; }
        .stock-price { font-weight: bold; color: #fff; }
        .chart-container { height: 300px; margin: 20px 0; }
    </style>
</head>
<body>
    <!-- Simplified Loading Screen -->
    <div id="loadingScreen" class="loading-screen">
        <div class="loading-content text-center text-white">
            <div class="gears-container mb-4">
                <div class="gear gear-1 d-inline-block mx-2">
                    <i class="fas fa-cog fa-2x fa-spin"></i>
                </div>
                <div class="gear gear-2 d-inline-block mx-2">
                    <i class="fas fa-cog fa-2x fa-spin" style="animation-direction: reverse;"></i>
                </div>
                <div class="gear gear-3 d-inline-block mx-2">
                    <i class="fas fa-cog fa-2x fa-spin"></i>
                </div>
            </div>
            <h2 class="brand-title mb-3">TickerChart AI</h2>
            <p class="brand-subtitle mb-4">سوق الأسهم السعودي - الذكاء الاصطناعي المتقدم</p>
            <div class="loading-bar bg-white bg-opacity-25 rounded-pill" style="height: 4px; width: 200px; margin: 0 auto;">
                <div class="loading-progress bg-white rounded-pill" style="height: 100%; width: 0%; transition: width 0.3s ease;"></div>
            </div>
            <p class="loading-status mt-3">جاري تحميل البيانات...</p>
        </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
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
                            <a class="nav-link" href="#analysis">التحليل</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#ai">الذكاء الاصطناعي</a>
                        </li>
                    </ul>
                    <div class="navbar-nav">
                        <button id="refreshBtn" class="btn btn-outline-light btn-sm">
                            <i class="fas fa-sync-alt me-1"></i>
                            تحديث
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="hero-section">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6">
                        <h1 class="display-4 text-white fw-bold mb-4">
                            سوق الأسهم السعودي
                            <span class="text-warning">الذكاء الاصطناعي المتقدم</span>
                        </h1>
                        <p class="lead text-white-50 mb-4">
                            تحليل متقدم لسوق الأسهم السعودي باستخدام أحدث تقنيات الذكاء الاصطناعي
                        </p>
                        <div class="d-flex gap-3">
                            <button class="btn btn-warning btn-lg">
                                <i class="fas fa-chart-line me-2"></i>
                                ابدأ التحليل
                            </button>
                            <button class="btn btn-outline-light btn-lg">
                                <i class="fas fa-info-circle me-2"></i>
                                تعرف أكثر
                            </button>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="text-center">
                            <div class="market-summary-card bg-white bg-opacity-10 rounded-3 p-4 backdrop-blur">
                                <h3 class="text-white mb-3">مؤشر TASI</h3>
                                <div class="tasi-value mb-2">
                                    <span id="tasiValue" class="display-6 text-white fw-bold">--</span>
                                </div>
                                <div class="tasi-change">
                                    <span id="tasiChange" class="h5">--</span>
                                </div>
                                <div class="market-status mt-3">
                                    <span class="badge bg-success">مفتوح</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Market Statistics -->
        <section class="py-5 bg-dark">
            <div class="container">
                <h2 class="text-white text-center mb-5">إحصائيات السوق</h2>
                <div id="marketStats">
                    <!-- Market statistics will be loaded here -->
                </div>
            </div>
        </section>

        <!-- Charts Section -->
        <section class="py-5 bg-light">
            <div class="container">
                <h2 class="text-center mb-5">الرسوم البيانية</h2>
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">مؤشر TASI</h5>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="tasiChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">حجم التداول</h5>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="volumeChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Top Stocks Section -->
        <section class="py-5 bg-dark">
            <div class="container">
                <h2 class="text-white text-center mb-5">أفضل الأسهم</h2>
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card bg-success bg-opacity-10 text-white">
                            <div class="card-header bg-success">
                                <h5 class="mb-0"><i class="fas fa-arrow-up me-2"></i>أعلى الرابحين</h5>
                            </div>
                            <div class="card-body">
                                <div id="topGainers">
                                    <!-- Top gainers will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="card bg-danger bg-opacity-10 text-white">
                            <div class="card-header bg-danger">
                                <h5 class="mb-0"><i class="fas fa-arrow-down me-2"></i>أعلى الخاسرين</h5>
                            </div>
                            <div class="card-body">
                                <div id="topLosers">
                                    <!-- Top losers will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-primary text-white py-4">
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <h5>TickerChart AI</h5>
                        <p>أداة الذكاء الاصطناعي المتقدمة لتحليل سوق الأسهم السعودي</p>
                    </div>
                    <div class="col-md-6 text-md-end">
                        <p>تم التطوير بواسطة المهندس خالد أحمد حجاج</p>
                        <p>&copy; 2025 جميع الحقوق محفوظة</p>
                    </div>
                </div>
            </div>
        </footer>
    </div>

    <!-- Load JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="assets/js/fast-market.js"></script>

    <script>
        // Animate loading progress
        document.addEventListener('DOMContentLoaded', function() {
            const progressBar = document.querySelector('.loading-progress');
            if (progressBar) {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    progressBar.style.width = progress + '%';
                    if (progress >= 100) {
                        clearInterval(interval);
                    }
                }, 100);
            }
        });
    </script>
</body>
</html> 