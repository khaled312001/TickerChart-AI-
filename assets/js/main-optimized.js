// Enhanced TickerChart AI - Optimized Main JavaScript
// TickerChart AI المحسن - الجافا سكريبت الرئيسي المحسن

// ===== IMMEDIATE FUNCTION DECLARATIONS FOR GLOBAL ACCESS =====
// Declare essential functions first so they're available immediately

function formatPrice(price) {
    return parseFloat(price).toFixed(2);
}

function formatTimestamp(timestamp) {
    if (!timestamp) return 'غير متوفر';
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA');
}

function formatVolume(volume) {
    if (!volume) return 'غير متوفر';
    if (volume >= 1000000) {
        return (volume / 1000000).toFixed(2) + 'M';
    } else if (volume >= 1000) {
        return (volume / 1000).toFixed(2) + 'K';
    }
    return volume.toString();
}

// Display market overview function
function displayMarketOverview(data) {
    console.log('🎯 Displaying market overview...');
    
    // Try multiple approaches to find and display content
    const marketSection = document.getElementById('marketData') || document.querySelector('.live-market-section, .market-overview');
    if (!marketSection) {
        console.warn('⚠️ marketData element not found, using live market data instead');
        // Fallback to enhanced live market data
        if (window.liveMarketData) {
            window.liveMarketData.loadLiveData();
        }
        return;
    }
    
    console.log('✅ marketData element found, updating content...');
    
    let html = `
        <div class="row">
            <div class="col-12">
                <div class="market-summary-card">
                    <div class="summary-header">
                        <h4><i class="fas fa-chart-line me-2"></i>نظرة عامة على السوق</h4>
                        <span class="data-source">${data.data_source || 'مصدر البيانات'}</span>
                    </div>
                    <div class="summary-stats">
                        <div class="stat-item">
                            <span class="stat-label">إجمالي الأسهم</span>
                            <span class="stat-value">${data.total_stocks || 0}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">آخر تحديث</span>
                            <span class="stat-value">${formatTimestamp(data.timestamp)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Display top gainers and losers in side-by-side layout
    if (data.top_gainers && data.top_gainers.length > 0) {
        html += `
            <div class="row mt-4">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-header compact-gainers-header text-white">
                            <h6 class="mb-0"><i class="fas fa-arrow-up me-2"></i>أعلى الرابحين</h6>
                        </div>
                        <div class="card-body p-2">
                            <div class="d-flex flex-wrap gap-2">
        `;
        
        data.top_gainers.slice(0, 4).forEach(stock => {
            html += `
                <div class="flex-fill" style="min-width: 140px; max-width: 180px;">
                    <div class="compact-stock-card rounded p-2 text-center">
                        <div class="compact-stock-name text-truncate" title="${stock.name}">${stock.name}</div>
                        <div class="compact-stock-change text-success">+${stock.change_percent.toFixed(2)}%</div>
                        <div class="compact-stock-price">${formatPrice(stock.price)}</div>
                    </div>
                </div>
            `;
        });
        
        html += `
                            </div>
                        </div>
                    </div>
                </div>
        `;
        
        // Top losers in compact side layout
        if (data.top_losers && data.top_losers.length > 0) {
            html += `
                <div class="col-lg-4">
                    <div class="card h-100">
                        <div class="card-header compact-losers-header text-white">
                            <h6 class="mb-0"><i class="fas fa-arrow-down me-2"></i>أعلى الخاسرين</h6>
                        </div>
                        <div class="card-body p-2">
                            <div class="d-flex flex-column gap-2">
            `;
            
            data.top_losers.slice(0, 3).forEach(stock => {
                html += `
                    <div class="compact-stock-card rounded p-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="flex-grow-1">
                                <div class="compact-stock-name text-truncate" title="${stock.name}">${stock.name}</div>
                                <div class="compact-stock-price">${formatPrice(stock.price)}</div>
                            </div>
                            <div class="compact-stock-change text-danger fw-bold">${stock.change_percent.toFixed(2)}%</div>
                        </div>
                    </div>
                `;
            });
            
            html += `
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
    }
    
    // Display market data table
    if (data.market_data && data.market_data.length > 0) {
        html += `
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0"><i class="fas fa-table me-2"></i>بيانات السوق</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>الرمز</th>
                                            <th>اسم الشركة</th>
                                            <th>السعر</th>
                                            <th>التغير</th>
                                            <th>التغير %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
        `;
        
        data.market_data.slice(0, 20).forEach(stock => {
            const changeClass = stock.change_percent >= 0 ? 'text-success' : 'text-danger';
            const changeSign = stock.change_percent >= 0 ? '+' : '';
            
            html += `
                <tr>
                    <td><strong>${stock.symbol}</strong></td>
                    <td>${stock.name}</td>
                    <td>${formatPrice(stock.price)}</td>
                    <td class="${changeClass}">${changeSign}${formatPrice(stock.change)}</td>
                    <td class="${changeClass}">${changeSign}${stock.change_percent.toFixed(2)}%</td>
                </tr>
            `;
        });
        
        html += `
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    marketSection.innerHTML = html;
    console.log('✅ Market overview displayed successfully');
}

// Sample data function
function displaySampleData() {
    const sampleData = {
        success: true,
        timestamp: new Date().toISOString(),
        data_source: 'sample_data',
        market_data: [
            { symbol: '1180.SR', name: 'البنك الأهلي السعودي', price: 45.20, change: 0.85, change_percent: 1.92 },
            { symbol: '1120.SR', name: 'الراجحي', price: 32.15, change: -0.45, change_percent: -1.38 },
            { symbol: '2010.SR', name: 'سابك', price: 78.90, change: 1.20, change_percent: 1.54 },
            { symbol: '7010.SR', name: 'الاتصالات السعودية', price: 28.75, change: 0.30, change_percent: 1.05 },
            { symbol: '2222.SR', name: 'الزيت العربية', price: 35.60, change: -0.80, change_percent: -2.20 }
        ],
        top_gainers: [
            { symbol: '1180.SR', name: 'البنك الأهلي السعودي', price: 45.20, change_percent: 1.92 },
            { symbol: '2010.SR', name: 'سابك', price: 78.90, change_percent: 1.54 },
            { symbol: '7010.SR', name: 'الاتصالات السعودية', price: 28.75, change_percent: 1.05 }
        ],
        top_losers: [
            { symbol: '2222.SR', name: 'الزيت العربية', price: 35.60, change_percent: -2.20 },
            { symbol: '1120.SR', name: 'الراجحي', price: 32.15, change_percent: -1.38 }
        ],
        total_stocks: 5
    };
    
    displayMarketOverview(sampleData);
}

// Export to global scope immediately
window.formatPrice = formatPrice;
window.formatTimestamp = formatTimestamp;
window.formatVolume = formatVolume;
window.displayMarketOverview = displayMarketOverview;
window.displaySampleData = displaySampleData;
window.initializeTASIChart = initializeTASIChart;
window.initializeAnalysisChart = initializeAnalysisChart;
window.initializeHeroChartOptimized = initializeHeroChartOptimized;

// Force initialize all charts function
function forceInitializeAllCharts() {
    console.log('🔄 Force initializing all charts...');
    
    // Initialize hero chart
    if (document.getElementById('heroChart')) {
        initializeHeroChartOptimized();
        console.log('✅ Hero chart initialized');
    }
    
    // Initialize TASI chart
    if (document.getElementById('tasiChart')) {
        initializeTASIChart();
        console.log('✅ TASI chart initialized');
    }
    
    // Initialize analysis chart
    if (document.getElementById('analysisChart')) {
        initializeAnalysisChart();
        console.log('✅ Analysis chart initialized');
    }
    
    console.log('✅ All charts initialization completed');
}

// Export chart initialization function
window.forceInitializeAllCharts = forceInitializeAllCharts;

console.log('✅ Essential functions exported to global scope immediately');

// Performance optimization variables
let isInitialized = false;
let isDataLoaded = false;
let currentChart = null;
let marketData = {};
let analysisResults = {};
let currentSymbol = '';
let refreshInterval = null;
let animationObserver = null;
let scrollTimeout = null;
let resizeTimeout = null;

// Cache for DOM elements
const DOMCache = {
    marketData: null,
    tasiChart: null,
    analysisChart: null,
    stockAnalyzerSelect: null,
    heroSection: null,
    loadingScreen: null
};

// API endpoints with caching
const API_ENDPOINTS = {
    enhanced_market: 'api/enhanced_market_api.php',
    ai_tools: 'api/ai_tools.php',
    working_market: 'api/working_market_api.php',
    ai_analyzer: 'ai/enhanced_stock_analyzer.py'
};

// Performance monitoring
const PerformanceMonitor = {
    startTime: performance.now(),
    metrics: {},
    
    start(label) {
        this.metrics[label] = performance.now();
    },
    
    end(label) {
        if (this.metrics[label]) {
            const duration = performance.now() - this.metrics[label];
            console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
            delete this.metrics[label];
        }
    }
};

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize the application with performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    PerformanceMonitor.start('totalInitialization');
    console.log('🚀 TickerChart AI Enhanced v4.0 - Initializing with optimizations...');
    
    // Prevent multiple initializations
    if (isInitialized) {
        console.log('⚠️ Already initialized, skipping...');
        return;
    }
    
    // Cache DOM elements for better performance
    cacheDOMElements();
    
    // Initialize components with performance monitoring
    initializeCoreComponents();
    
    // Force hide loading screen after timeout
    forceHideLoadingScreen();
    
    // Mark as initialized
    isInitialized = true;
    
    PerformanceMonitor.end('totalInitialization');
    console.log('✅ TickerChart AI Enhanced v4.0 - Initialized successfully');
});

// Cache DOM elements for better performance
function cacheDOMElements() {
    PerformanceMonitor.start('domCaching');
    
    DOMCache.marketData = document.getElementById('marketData');
    DOMCache.tasiChart = document.getElementById('tasiChart');
    DOMCache.analysisChart = document.getElementById('analysisChart');
    DOMCache.stockAnalyzerSelect = document.getElementById('stockAnalyzerSelect');
    DOMCache.heroSection = document.getElementById('home');
    DOMCache.loadingScreen = document.getElementById('loadingScreen');
    
    console.log('🔍 DOM elements cached:', {
        marketData: !!DOMCache.marketData,
        tasiChart: !!DOMCache.tasiChart,
        analysisChart: !!DOMCache.analysisChart,
        stockAnalyzerSelect: !!DOMCache.stockAnalyzerSelect,
        heroSection: !!DOMCache.heroSection,
        loadingScreen: !!DOMCache.loadingScreen
    });
    
    PerformanceMonitor.end('domCaching');
}

// Initialize core components with performance optimizations
async function initializeCoreComponents() {
    try {
        // Initialize animations with throttling
        initializeAnimationsOptimized();
        
        // Initialize market data with caching
        await initializeMarketDataOptimized();
        
        // Initialize other components
        initializeStockSelector();
        initializeEventListenersOptimized();
        
        // Lazy load charts
        requestIdleCallback(() => {
            initializeChartsOptimized();
        });
        
        // Lazy load hero section
        requestIdleCallback(() => {
            initializeHeroSectionOptimized();
        });
        
        // Start real-time updates with throttling
        startRealTimeUpdatesOptimized();
        
        // Ensure content visibility
        setTimeout(() => {
            ensureContentVisibilityOptimized();
        }, 1000); // Reduced from 2000ms
        
    } catch (error) {
        console.error('❌ Error in core initialization:', error);
        // Fallback to basic initialization
        initializeFallback();
    }
}

// Optimized animations initialization
function initializeAnimationsOptimized() {
    PerformanceMonitor.start('animationsInit');
    
    // Use Intersection Observer with better performance
    animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Use requestAnimationFrame for better performance
                const children = entry.target.querySelectorAll('.animate-on-scroll');
                children.forEach((child, index) => {
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 50); // Reduced from 100ms
                    });
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe sections with better performance
    const sections = document.querySelectorAll('section, .animate-on-scroll');
    sections.forEach(el => {
        animationObserver.observe(el);
    });
    
    // Optimized scroll handler with throttling
    const throttledScrollHandler = throttle(() => {
        const scrolled = window.pageYOffset;
        if (DOMCache.heroSection) {
            const rate = scrolled * -0.3; // Reduced from -0.5
            DOMCache.heroSection.style.transform = `translateY(${rate}px)`;
        }
    }, 16); // ~60fps
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    PerformanceMonitor.end('animationsInit');
}

// Optimized market data initialization with caching
async function initializeMarketDataOptimized() {
    PerformanceMonitor.start('marketDataInit');
    
    try {
        showLoadingScreen();
        
        // Check cache first
        const cachedData = getCachedMarketData();
        if (cachedData && !isDataExpired(cachedData.timestamp)) {
            console.log('📊 Using cached market data');
            displayMarketOverview(cachedData.data);
            updateStockSelector(cachedData.data.market_data);
            hideLoadingScreen();
            PerformanceMonitor.end('marketDataInit');
            return;
        }
        
        // Load fresh data
        const marketResponse = await fetch(`${API_ENDPOINTS.enhanced_market}?action=market_overview`, {
            headers: {
                'Cache-Control': 'max-age=60' // 1 minute cache
            }
        });
        
        const marketData = await marketResponse.json();
        
        if (marketData.success && marketData.market_data && marketData.market_data.length > 0) {
            // Cache the data
            cacheMarketData(marketData);
            displayMarketOverview(marketData);
            updateStockSelector(marketData.market_data);
        } else {
            await loadWorkingMarketDataOptimized();
        }
        
        hideLoadingScreen();
        isDataLoaded = true;
        
    } catch (error) {
        console.error('❌ Error loading market data:', error);
        await loadWorkingMarketDataOptimized();
        hideLoadingScreen();
    }
    
    PerformanceMonitor.end('marketDataInit');
}

// Cache management functions
function cacheMarketData(data) {
    try {
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem('tickerchart_market_data', JSON.stringify(cacheData));
    } catch (error) {
        console.warn('⚠️ Failed to cache market data:', error);
    }
}

function getCachedMarketData() {
    try {
        const cached = localStorage.getItem('tickerchart_market_data');
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.warn('⚠️ Failed to get cached market data:', error);
        return null;
    }
}

function isDataExpired(timestamp) {
    const now = Date.now();
    const cacheAge = now - timestamp;
    const maxAge = 5 * 60 * 1000; // 5 minutes
    return cacheAge > maxAge;
}

// Optimized working market data loader
async function loadWorkingMarketDataOptimized() {
    try {
        const response = await fetch(`${API_ENDPOINTS.working_market}?action=market_overview`, {
            headers: {
                'Cache-Control': 'max-age=60'
            }
        });
        const data = await response.json();
        
        if (data.success) {
            cacheMarketData(data);
            displayMarketOverview(data);
            updateStockSelector(data.market_data);
        } else {
            throw new Error('Working API failed');
        }
    } catch (error) {
        console.error('❌ Working market data failed:', error);
        // Display sample data as final fallback
        displaySampleData();
    }
}



// displaySampleData function already defined at the top of the file

// Optimized event listeners
function initializeEventListenersOptimized() {
    // Use event delegation for better performance
    document.addEventListener('click', handleGlobalClick, { passive: true });
    
    // Optimized resize handler
    const debouncedResizeHandler = debounce(() => {
        if (currentChart) {
            currentChart.resize();
        }
    }, 250);
    
    window.addEventListener('resize', debouncedResizeHandler, { passive: true });
    
    // Optimized visibility change handler
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseRealTimeUpdates();
        } else {
            resumeRealTimeUpdates();
        }
    });
}

// Global click handler with event delegation
function handleGlobalClick(event) {
    const target = event.target;
    
    // Handle navigation links
    if (target.matches('a[href^="#"]')) {
        event.preventDefault();
        const targetId = target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Handle AI tool buttons
    if (target.matches('[onclick*="openTrendAnalysis"]')) {
        event.preventDefault();
        openTrendAnalysis();
    }
    
    if (target.matches('[onclick*="openPricePrediction"]')) {
        event.preventDefault();
        openPricePrediction();
    }
    
    if (target.matches('[onclick*="openRiskManagement"]')) {
        event.preventDefault();
        openRiskManagement();
    }
}

// Optimized charts initialization
function initializeChartsOptimized() {
    PerformanceMonitor.start('chartsInit');
    
    // Lazy load Chart.js if not already loaded
    if (typeof Chart === 'undefined') {
        console.warn('⚠️ Chart.js not loaded, skipping charts initialization');
        PerformanceMonitor.end('chartsInit');
        return;
    }
    
    // Initialize charts only if elements exist
    if (DOMCache.tasiChart) {
        initializeTASIChart();
    }
    
    if (DOMCache.analysisChart) {
        initializeAnalysisChart();
    }
    
    PerformanceMonitor.end('chartsInit');
}

// Optimized hero section initialization
function initializeHeroSectionOptimized() {
    PerformanceMonitor.start('heroSectionInit');
    
    if (!DOMCache.heroSection) {
        console.error('❌ Hero section not found!');
        PerformanceMonitor.end('heroSectionInit');
        return;
    }
    
    // Initialize hero chart with lazy loading
    requestIdleCallback(() => {
        initializeHeroChartOptimized();
    });
    
    // Add dynamic text effects
    addDynamicTextEffectsOptimized();
    
    // Add floating elements with better performance
    addFloatingElementsOptimized();
    
    PerformanceMonitor.end('heroSectionInit');
}

// Optimized hero chart
function initializeHeroChartOptimized() {
    const heroChartCanvas = document.getElementById('heroChart');
    if (!heroChartCanvas || typeof Chart === 'undefined') {
        return;
    }
    
    const ctx = heroChartCanvas.getContext('2d');
    
    // Simplified data for better performance
    const labels = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
    const data = [65, 72, 68, 75, 82, 78];
    
    const heroChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'مؤشر السوق السعودي',
                data: data,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.2,
                pointRadius: 0,
                pointHoverRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

// Optimized text effects
function addDynamicTextEffectsOptimized() {
    const heroTitle = document.querySelector('.hero-section h1');
    if (!heroTitle) return;
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                heroTitle.textContent += text[index];
                index++;
            } else {
                clearInterval(typeInterval);
                heroTitle.innerHTML += '<span class="cursor">|</span>';
            }
        }, 80); // Reduced from 100ms
    });
}

// Optimized floating elements
function addFloatingElementsOptimized() {
    if (!DOMCache.heroSection) return;
    
    // Create fewer floating elements for better performance
    const icons = ['📈', '💹', '📊', '🎯'];
    icons.forEach((icon, index) => {
        const floatingIcon = document.createElement('div');
        floatingIcon.className = 'floating-icon';
        floatingIcon.textContent = icon;
        floatingIcon.style.cssText = `
            position: absolute;
            font-size: 1.5rem;
            opacity: 0.2;
            animation: float ${2 + index * 0.3}s ease-in-out infinite;
            animation-delay: ${index * 0.3}s;
            left: ${15 + index * 20}%;
            top: ${25 + index * 15}%;
            z-index: 1;
        `;
        DOMCache.heroSection.appendChild(floatingIcon);
    });
}

// Optimized real-time updates
function startRealTimeUpdatesOptimized() {
    // Clear existing interval
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    
    // Start new interval with longer duration for better performance
    refreshInterval = setInterval(() => {
        if (!document.hidden && isDataLoaded) {
            updateMarketDataOptimized();
        }
    }, 30000); // 30 seconds instead of more frequent updates
}

// Pause real-time updates when tab is not visible
function pauseRealTimeUpdates() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

// Resume real-time updates when tab becomes visible
function resumeRealTimeUpdates() {
    if (!refreshInterval) {
        startRealTimeUpdatesOptimized();
    }
}

// Optimized market data update
async function updateMarketDataOptimized() {
    try {
        const response = await fetch(`${API_ENDPOINTS.enhanced_market}?action=market_overview&cache=${Date.now()}`, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        const data = await response.json();
        
        if (data.success) {
            cacheMarketData(data);
            updateMarketDisplay(data);
        }
    } catch (error) {
        console.warn('⚠️ Failed to update market data:', error);
    }
}

// Optimized market display update
function updateMarketDisplay(data) {
    // Update only changed elements for better performance
    if (data.market_data && data.market_data.length > 0) {
        updateStockPrices(data.market_data);
    }
    
    // Update summary statistics
    updateSummaryStats(data);
}

// Update stock prices efficiently
function updateStockPrices(marketData) {
    marketData.forEach(stock => {
        const priceElement = document.querySelector(`[data-symbol="${stock.symbol}"] .stock-price`);
        if (priceElement) {
            priceElement.textContent = formatPrice(stock.price);
        }
    });
}

// Update summary statistics
function updateSummaryStats(data) {
    const totalStocksElement = document.getElementById('totalStocks');
    if (totalStocksElement && data.total_stocks) {
        totalStocksElement.textContent = data.total_stocks;
    }
}

// Fallback initialization
function initializeFallback() {
    console.log('🔄 Initializing fallback mode...');
    
    // Display sample data
    displaySampleData();
    
    // Basic event listeners
    document.addEventListener('click', handleGlobalClick, { passive: true });
    
    // Hide loading screen
    hideLoadingScreen();
}



// Update market overview function
function updateMarketOverview(data) {
    console.log('📊 Updating market overview...', data);
    
    // Update TASI index
    const tasiValue = document.getElementById('tasi-value');
    const tasiChange = document.getElementById('tasi-change');
    
    if (tasiValue && data.tasi_value) {
        tasiValue.textContent = data.tasi_value;
    }
    
    if (tasiChange && data.tasi_change) {
        tasiChange.textContent = data.tasi_change;
        tasiChange.className = data.tasi_change.startsWith('+') ? 'text-success' : 'text-danger';
    }
    
    // Update market statistics
    const upCompanies = document.getElementById('up-companies');
    const downCompanies = document.getElementById('down-companies');
    const companiesCount = document.getElementById('companies-count');
    
    if (upCompanies && data.up_stocks) {
        upCompanies.textContent = data.up_stocks;
    }
    
    if (downCompanies && data.down_stocks) {
        downCompanies.textContent = data.down_stocks;
    }
    
    if (companiesCount && data.total_stocks) {
        companiesCount.textContent = data.total_stocks;
    }
    
    console.log('✅ Market overview updated');
}

// Utility functions
function showLoadingScreen() {
    if (DOMCache.loadingScreen) {
        DOMCache.loadingScreen.style.display = 'flex';
    }
}

function hideLoadingScreen() {
    if (DOMCache.loadingScreen) {
        DOMCache.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            DOMCache.loadingScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Ensure content is visible
            document.body.style.visibility = 'visible';
            // Scroll to top
            window.scrollTo(0, 0);
        }, 300);
    }
}

// Force hide loading screen after timeout
function forceHideLoadingScreen() {
    setTimeout(() => {
        hideLoadingScreen();
        console.log('⚠️ Loading screen force hidden after timeout');
    }, 8000); // 8 seconds timeout
}

// Functions already defined at the top of the file

// displayMarketOverview function already defined at the top of the file

// Initialize stock selector
function initializeStockSelector() {
    const selector = document.getElementById('stockAnalyzerSelect');
    if (!selector) return;
    
    // Add event listener for stock selection
    selector.addEventListener('change', function() {
        const selectedSymbol = this.value;
        if (selectedSymbol) {
            analyzeStock(selectedSymbol);
        }
    });
}

// Update stock selector with market data
function updateStockSelector(marketData) {
    const selector = document.getElementById('stockAnalyzerSelect');
    if (!selector) return;
    
    // Clear existing options
    selector.innerHTML = '<option value="">اختر السهم...</option>';
    
    // Add stock options
    marketData.forEach(stock => {
        const option = document.createElement('option');
        option.value = stock.symbol;
        option.textContent = `${stock.name} (${stock.symbol})`;
        selector.appendChild(option);
    });
}

// Analyze stock with enhanced API
async function analyzeStock(symbol) {
    try {
        showLoadingScreen();
        
        // Get comprehensive stock analysis
        const response = await fetch(`${API_ENDPOINTS.enhanced_market}?action=company_insights&symbol=${symbol}`);
        const data = await response.json();
        
        if (data.success) {
            displayStockAnalysis(data);
            currentSymbol = symbol;
        } else {
            throw new Error(data.error || 'فشل في تحليل السهم');
        }
        
        hideLoadingScreen();
    } catch (error) {
        console.error('❌ Error analyzing stock:', error);
        displayErrorMessage('فشل في تحليل السهم: ' + error.message);
        hideLoadingScreen();
    }
}

// Display comprehensive stock analysis
function displayStockAnalysis(data) {
    const modalBody = document.getElementById('stockAnalysisModalBody');
    if (!modalBody) return;
    
    let html = `
        <div class="stock-analysis-container">
            <div class="row">
                <div class="col-lg-8">
                    <div class="stock-header">
                        <h3>${data.symbol}</h3>
                        <span class="data-source">${data.data_source}</span>
                    </div>
                    
                    <!-- Quote Information -->
                    ${data.quote ? `
                        <div class="quote-card">
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="quote-item">
                                        <span class="quote-label">السعر الحالي</span>
                                        <span class="quote-value">${formatPrice(data.quote.close)}</span>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="quote-item">
                                        <span class="quote-label">التغير</span>
                                        <span class="quote-value ${data.quote.change >= 0 ? 'text-success' : 'text-danger'}">
                                            ${data.quote.change >= 0 ? '+' : ''}${formatPrice(data.quote.change)}
                                        </span>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="quote-item">
                                        <span class="quote-label">التغير %</span>
                                        <span class="quote-value ${data.quote.percent_change >= 0 ? 'text-success' : 'text-danger'}">
                                            ${data.quote.percent_change >= 0 ? '+' : ''}${data.quote.percent_change.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="quote-item">
                                        <span class="quote-label">الحجم</span>
                                        <span class="quote-value">${formatVolume(data.quote.volume)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = html;
    
    // Show modal with proper accessibility handling
    const modalElement = document.getElementById('stockAnalysisModal');
    if (modalElement) {
        // Remove aria-hidden before showing modal
        modalElement.removeAttribute('aria-hidden');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Add event listener to handle modal close properly
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.setAttribute('aria-hidden', 'true');
        });
    }
}

// Display error message
function displayErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(errorDiv, container.firstChild);
    }
}

// Format volume
function formatVolume(volume) {
    if (!volume) return 'غير متوفر';
    if (volume >= 1000000) {
        return (volume / 1000000).toFixed(2) + 'M';
    } else if (volume >= 1000) {
        return (volume / 1000).toFixed(2) + 'K';
    }
    return volume.toString();
}

// Initialize TASI chart
function initializeTASIChart() {
    const ctx = document.getElementById('tasiChart');
    if (!ctx) {
        console.error('❌ TASI chart canvas not found');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js library not loaded');
        return;
    }

    try {
        // Sample data for TASI chart
        const sampleLabels = ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00'];
        const sampleData = [10850, 10865, 10872, 10845, 10838, 10855, 10870, 10878, 10865, 10872, 10880, 10875];
        
        window.tasiChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sampleLabels,
                datasets: [{
                    label: 'مؤشر السوق السعودي (TASI)',
                    data: sampleData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
        
        console.log('✅ TASI chart initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing TASI chart:', error);
    }
}

// Initialize analysis chart
function initializeAnalysisChart() {
    const ctx = document.getElementById('analysisChart');
    if (!ctx) {
        console.error('❌ Analysis chart canvas not found');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js library not loaded');
        return;
    }

    try {
        // Sample data for analysis chart
        const analysisLabels = ['البنوك', 'البتروكيماويات', 'الاتصالات', 'التأمين', 'الطاقة', 'العقار'];
        const analysisData = [15.2, 12.8, 8.5, 6.3, 18.7, 9.4];
        
        window.analysisChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: analysisLabels,
                datasets: [{
                    label: 'أداء القطاعات (%)',
                    data: analysisData,
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)', 
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)'
                    ],
                    borderColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b', 
                        '#ef4444',
                        '#8b5cf6',
                        '#ec4899'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
        
        console.log('✅ Analysis chart initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing analysis chart:', error);
    }
}

// Ensure content visibility with optimized version
function ensureContentVisibilityOptimized() {
    console.log('🔍 Ensuring content visibility...');
    
    // Check if market data section has content
    const marketSection = document.getElementById('marketData');
    if (marketSection && (!marketSection.innerHTML || marketSection.innerHTML.trim() === '')) {
        console.log('⚠️ Market section is empty, displaying fallback content...');
        
        // Display fallback content
        const fallbackData = {
            success: true,
            timestamp: new Date().toISOString(),
            data_source: 'fallback_data',
            market_data: [
                { symbol: '1180.SR', name: 'البنك الأهلي السعودي', price: 45.20, change: 0.85, change_percent: 1.92 },
                { symbol: '1120.SR', name: 'الراجحي', price: 32.15, change: -0.45, change_percent: -1.38 },
                { symbol: '2010.SR', name: 'سابك', price: 78.90, change: 1.20, change_percent: 1.54 },
                { symbol: '7010.SR', name: 'الاتصالات السعودية', price: 28.75, change: 0.30, change_percent: 1.05 },
                { symbol: '2222.SR', name: 'الزيت العربية', price: 35.60, change: -0.80, change_percent: -2.20 }
            ],
            top_gainers: [
                { symbol: '1180.SR', name: 'البنك الأهلي السعودي', price: 45.20, change_percent: 1.92 },
                { symbol: '2010.SR', name: 'سابك', price: 78.90, change_percent: 1.54 },
                { symbol: '7010.SR', name: 'الاتصالات السعودية', price: 28.75, change_percent: 1.05 }
            ],
            top_losers: [
                { symbol: '2222.SR', name: 'الزيت العربية', price: 35.60, change_percent: -2.20 },
                { symbol: '1120.SR', name: 'الراجحي', price: 32.15, change_percent: -1.38 }
            ],
            total_stocks: 5
        };
        
        displayMarketOverview(fallbackData);
        updateStockSelector(fallbackData.market_data);
    }
    
    // Ensure all sections are visible with better performance
    const sections = ['home', 'market', 'ai-tools', 'analysis', 'about'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
            section.style.visibility = 'visible';
            section.style.opacity = '1';
        }
    });
    
    // Ensure loading screen is hidden
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        loadingScreen.style.opacity = '0';
    }
    
    console.log('✅ Content visibility check completed');
}

// Cleanup function for better memory management
function cleanup() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
    
    if (animationObserver) {
        animationObserver.disconnect();
        animationObserver = null;
    }
    
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
    
    // Clear cache
    marketData = {};
    analysisResults = {};
    
    console.log('🧹 Cleanup completed');
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Export for debugging
window.TickerChartAI = {
    version: '4.0',
    performance: PerformanceMonitor,
    cleanup: cleanup,
    cache: DOMCache
};

// ===== GLOBAL FUNCTION EXPORTS =====
// Ensure all critical functions are globally accessible for testing and external use
window.displayMarketOverview = displayMarketOverview;
window.displaySampleData = displaySampleData;
window.formatPrice = formatPrice;
window.formatTimestamp = formatTimestamp;
window.formatVolume = formatVolume;
window.updateStockSelector = updateStockSelector;
window.analyzeStock = analyzeStock;
window.showLoadingScreen = showLoadingScreen;
window.hideLoadingScreen = hideLoadingScreen;
window.cacheMarketData = cacheMarketData;
window.getCachedMarketData = getCachedMarketData;
window.updateMarketOverview = updateMarketOverview;

console.log('✅ All functions exported to global scope'); 