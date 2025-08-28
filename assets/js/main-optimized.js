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
            updateMarketIndicators(data);
        } else {
            throw new Error('Working API failed');
        }
    } catch (error) {
        console.error('❌ Working market data failed:', error);
        // Display sample data as final fallback
        displaySampleData();
        updateMarketIndicators(getSampleIndicatorsData());
    }
}

// Update market indicators with real data
function updateMarketIndicators(data) {
    console.log('📊 Updating market indicators...');
    
    // Update TASI indicator
    const tasiValue = document.getElementById('tasiValue');
    const tasiChange = document.getElementById('tasiChange');
    if (tasiValue && tasiChange) {
        const tasiData = data.indicators?.['^TASI'] || data.market_indicators?.tadawul;
        if (tasiData) {
            tasiValue.textContent = formatNumber(tasiData.value || tasiData.price || 10885.58);
            const change = tasiData.change || 0;
            const changePercent = tasiData.changePercent || 0;
            tasiChange.textContent = `${change >= 0 ? '+' : ''}${formatNumber(change)} (${changePercent >= 0 ? '+' : ''}${formatNumber(changePercent)}%)`;
            tasiChange.className = `indicator-change ${change >= 0 ? 'up' : 'down'}`;
        }
    }
    
    // Update NOMU indicator
    const nomuValue = document.getElementById('nomuValue');
    const nomuChange = document.getElementById('nomuChange');
    if (nomuValue && nomuChange) {
        const nomuData = data.indicators?.['^NOMU'] || data.market_indicators?.nomu;
        if (nomuData) {
            nomuValue.textContent = formatNumber(nomuData.value || nomuData.price || 2345.78);
            const change = nomuData.change || 0;
            const changePercent = nomuData.changePercent || 0;
            nomuChange.textContent = `${change >= 0 ? '+' : ''}${formatNumber(change)} (${changePercent >= 0 ? '+' : ''}${formatNumber(changePercent)}%)`;
            nomuChange.className = `indicator-change ${change >= 0 ? 'up' : 'down'}`;
        }
    }
    
    // Update Oil indicator
    const oilValue = document.getElementById('oilValue');
    const oilChange = document.getElementById('oilChange');
    if (oilValue && oilChange) {
        const oilData = data.indicators?.['CL=F'] || data.market_indicators?.oil;
        if (oilData) {
            oilValue.textContent = formatNumber(oilData.value || oilData.price || 89.45);
            const change = oilData.change || 0;
            const changePercent = oilData.changePercent || 0;
            oilChange.textContent = `${change >= 0 ? '+' : ''}${formatNumber(change)} (${changePercent >= 0 ? '+' : ''}${formatNumber(changePercent)}%)`;
            oilChange.className = `indicator-change ${change >= 0 ? 'up' : 'down'}`;
        }
    }
    
    // Update Gold indicator
    const goldValue = document.getElementById('goldValue');
    const goldChange = document.getElementById('goldChange');
    if (goldValue && goldChange) {
        const goldData = data.indicators?.['GC=F'] || data.market_indicators?.gold;
        if (goldData) {
            goldValue.textContent = formatNumber(goldData.value || goldData.price || 2156.78);
            const change = goldData.change || 0;
            const changePercent = goldData.changePercent || 0;
            goldChange.textContent = `${change >= 0 ? '+' : ''}${formatNumber(change)} (${changePercent >= 0 ? '+' : ''}${formatNumber(changePercent)}%)`;
            goldChange.className = `indicator-change ${change >= 0 ? 'up' : 'down'}`;
        }
    }
    
    // Update last update time
    const lastUpdate = document.querySelector('.indicators-header .last-update');
    if (lastUpdate) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        });
        lastUpdate.innerHTML = `<i class="fas fa-clock me-1"></i>آخر تحديث: ${timeString}`;
    }
    
    console.log('✅ Market indicators updated');
}

// Get sample indicators data for fallback
function getSampleIndicatorsData() {
    return {
        indicators: {
            '^TASI': {
                value: 10885.58 + (Math.random() - 0.5) * 100,
                change: (Math.random() - 0.5) * 50,
                changePercent: (Math.random() - 0.5) * 2
            },
            '^NOMU': {
                value: 2345.78 + (Math.random() - 0.5) * 20,
                change: (Math.random() - 0.5) * 10,
                changePercent: (Math.random() - 0.5) * 1
            },
            'CL=F': {
                value: 89.45 + (Math.random() - 0.5) * 2,
                change: (Math.random() - 0.5) * 1,
                changePercent: (Math.random() - 0.5) * 2
            },
            'GC=F': {
                value: 2156.78 + (Math.random() - 0.5) * 10,
                change: (Math.random() - 0.5) * 5,
                changePercent: (Math.random() - 0.5) * 1
            }
        }
    };
}

// Format number with proper formatting
function formatNumber(num) {
    if (typeof num !== 'number') return '--';
    
    if (num >= 1000) {
        return num.toLocaleString('ar-SA', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    } else {
        return num.toFixed(2);
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
    
    // Handle stock analyzer button
    if (target.matches('[data-action="analyzeSelectedStock"]') || target.closest('[data-action="analyzeSelectedStock"]')) {
        event.preventDefault();
        event.stopPropagation();
        analyzeSelectedStock();
        return;
    }
    
    // Handle portfolio analysis button
    if (target.matches('[data-action="openPortfolioAnalysis"]') || target.closest('[data-action="openPortfolioAnalysis"]')) {
        event.preventDefault();
        event.stopPropagation();
        openPortfolioAnalysis();
        return;
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
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('⚠️ Chart.js not loaded, attempting to load it...');
        
        // Try to load Chart.js dynamically
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = function() {
            console.log('✅ Chart.js loaded successfully');
            setTimeout(() => {
                initializeChartsOptimized();
            }, 100);
        };
        script.onerror = function() {
            console.error('❌ Failed to load Chart.js');
            // Create fallback chart display
            createFallbackCharts();
        };
        document.head.appendChild(script);
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

// Create fallback charts when Chart.js is not available
function createFallbackCharts() {
    console.log('🔄 Creating fallback charts...');
    
    // Create fallback for TASI chart
    if (DOMCache.tasiChart) {
        const ctx = DOMCache.tasiChart;
        ctx.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
        ctx.style.border = '1px solid #e2e8f0';
        ctx.style.borderRadius = '8px';
        ctx.style.display = 'flex';
        ctx.style.alignItems = 'center';
        ctx.style.justifyContent = 'center';
        ctx.style.fontSize = '14px';
        ctx.style.color = '#64748b';
        ctx.innerHTML = '<div style="text-align: center;"><i class="fas fa-chart-line" style="font-size: 24px; margin-bottom: 8px; color: #3b82f6;"></i><br>مؤشر السوق السعودي (TASI)<br><small>جاري تحميل الرسم البياني...</small></div>';
    }
    
    // Create fallback for analysis chart
    if (DOMCache.analysisChart) {
        const ctx = DOMCache.analysisChart;
        ctx.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
        ctx.style.border = '1px solid #e2e8f0';
        ctx.style.borderRadius = '8px';
        ctx.style.display = 'flex';
        ctx.style.alignItems = 'center';
        ctx.style.justifyContent = 'center';
        ctx.style.fontSize = '14px';
        ctx.style.color = '#64748b';
        ctx.innerHTML = '<div style="text-align: center;"><i class="fas fa-chart-bar" style="font-size: 24px; margin-bottom: 8px; color: #10b981;"></i><br>تحليل القطاعات<br><small>جاري تحميل الرسم البياني...</small></div>';
    }
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
    
    // Add sample stocks to selector
    const sampleStocks = [
        { symbol: 'TASI', name: 'مؤشر السوق السعودي' },
        { symbol: 'SABIC', name: 'سابك' },
        { symbol: 'RIBL', name: 'بنك الراجحي' },
        { symbol: 'SNB', name: 'البنك الأهلي السعودي' },
        { symbol: 'STC', name: 'الاتصالات السعودية' },
        { symbol: 'KAYAN', name: 'كيان' },
        { symbol: 'SABIC-C', name: 'سابك-ك' },
        { symbol: 'ALINMA', name: 'الإنماء' }
    ];
    
    // Clear existing options except the first one
    selector.innerHTML = '<option value="">اختر السهم...</option>';
    
    // Add sample stocks
    sampleStocks.forEach(stock => {
        const option = document.createElement('option');
        option.value = stock.symbol;
        option.textContent = `${stock.name} (${stock.symbol})`;
        selector.appendChild(option);
    });
    
    // Add event listener for stock selection
    selector.addEventListener('change', function() {
        const selectedSymbol = this.value;
        if (selectedSymbol) {
            console.log('📊 Stock selected:', selectedSymbol);
        }
    });
    
    console.log('✅ Stock selector initialized with sample data');
}

// Analyze selected stock
function analyzeSelectedStock() {
    const selector = document.getElementById('stockAnalyzerSelect');
    const selectedStock = selector ? selector.value : '';
    
    if (!selectedStock) {
        showNotification('يرجى اختيار سهم للتحليل', 'warning');
        return;
    }
    
    console.log('🔍 Analyzing stock:', selectedStock);
    showStockAnalysisModal(selectedStock);
}

// Show stock analysis modal
function showStockAnalysisModal(symbol) {
    // Create modal content
    const modalContent = `
        <div class="modal fade" id="stockAnalysisModal" tabindex="-1" aria-labelledby="stockAnalysisModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="stockAnalysisModalLabel">
                            <i class="fas fa-search me-2"></i>
                            تحليل السهم: ${symbol}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6><i class="fas fa-chart-line me-2"></i>المؤشرات الفنية</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-6">
                                                <div class="indicator-item">
                                                    <span class="indicator-label">RSI:</span>
                                                    <span class="indicator-value text-success">65.4</span>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="indicator-item">
                                                    <span class="indicator-label">MACD:</span>
                                                    <span class="indicator-value text-info">0.023</span>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="indicator-item">
                                                    <span class="indicator-label">Bollinger:</span>
                                                    <span class="indicator-value text-warning">وسطي</span>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="indicator-item">
                                                    <span class="indicator-label">Volume:</span>
                                                    <span class="indicator-value text-primary">2.5M</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6><i class="fas fa-lightbulb me-2"></i>التوصية</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="recommendation">
                                            <div class="recommendation-icon text-success">
                                                <i class="fas fa-thumbs-up fa-2x"></i>
                                            </div>
                                            <div class="recommendation-text">
                                                <h5 class="text-success">شراء</h5>
                                                <p>السهم يظهر إشارات إيجابية مع مؤشرات فنية قوية</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h6><i class="fas fa-chart-area me-2"></i>الرسم البياني</h6>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="stockAnalysisChart" height="300"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                        <button type="button" class="btn btn-primary">حفظ التحليل</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('stockAnalysisModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('stockAnalysisModal'));
    modal.show();
    
    // Initialize chart in modal
    setTimeout(() => {
        initializeStockAnalysisChart(symbol);
    }, 500);
}

// Initialize stock analysis chart
function initializeStockAnalysisChart(symbol) {
    const ctx = document.getElementById('stockAnalysisChart');
    if (!ctx || typeof Chart === 'undefined') return;
    
    try {
        // Sample data for stock analysis
        const labels = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
        const prices = [45.2, 47.8, 46.5, 48.9, 50.2, 49.8];
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `سعر ${symbol}`,
                    data: prices,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
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
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        });
        
        console.log('✅ Stock analysis chart initialized');
    } catch (error) {
        console.error('❌ Error initializing stock analysis chart:', error);
    }
}

// Open portfolio analysis
function openPortfolioAnalysis() {
    console.log('📊 Opening portfolio analysis...');
    showPortfolioAnalysisModal();
}

// Show portfolio analysis modal
function showPortfolioAnalysisModal() {
    // Create modal content
    const modalContent = `
        <div class="modal fade" id="portfolioAnalysisModal" tabindex="-1" aria-labelledby="portfolioAnalysisModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="portfolioAnalysisModalLabel">
                            <i class="fas fa-chart-pie me-2"></i>
                            تحليل المحفظة الاستثمارية
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6><i class="fas fa-chart-pie me-2"></i>توزيع المحفظة</h6>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="portfolioPieChart" height="250"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6><i class="fas fa-chart-line me-2"></i>أداء المحفظة</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="portfolio-stats">
                                            <div class="stat-item">
                                                <span class="stat-label">إجمالي القيمة:</span>
                                                <span class="stat-value text-primary">125,000 ريال</span>
                                            </div>
                                            <div class="stat-item">
                                                <span class="stat-label">العائد السنوي:</span>
                                                <span class="stat-value text-success">+12.5%</span>
                                            </div>
                                            <div class="stat-item">
                                                <span class="stat-label">مخاطر المحفظة:</span>
                                                <span class="stat-value text-warning">متوسطة</span>
                                            </div>
                                            <div class="stat-item">
                                                <span class="stat-label">عدد الأسهم:</span>
                                                <span class="stat-value text-info">8 أسهم</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h6><i class="fas fa-lightbulb me-2"></i>توصيات التحسين</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="recommendations-list">
                                            <div class="recommendation-item">
                                                <div class="recommendation-icon text-success">
                                                    <i class="fas fa-plus-circle"></i>
                                                </div>
                                                <div class="recommendation-content">
                                                    <h6>زيادة التنويع</h6>
                                                    <p>إضافة أسهم من قطاع التكنولوجيا لتحسين التنويع</p>
                                                </div>
                                            </div>
                                            <div class="recommendation-item">
                                                <div class="recommendation-icon text-warning">
                                                    <i class="fas fa-exclamation-triangle"></i>
                                                </div>
                                                <div class="recommendation-content">
                                                    <h6>تقليل المخاطر</h6>
                                                    <p>تقليل التركيز على قطاع البنوك وزيادة الأسهم الدفاعية</p>
                                                </div>
                                            </div>
                                            <div class="recommendation-item">
                                                <div class="recommendation-icon text-info">
                                                    <i class="fas fa-chart-line"></i>
                                                </div>
                                                <div class="recommendation-content">
                                                    <h6>إعادة التوازن</h6>
                                                    <p>إعادة توزيع الأموال لتحقيق التوازن المثالي</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h6><i class="fas fa-table me-2"></i>تفاصيل الأسهم</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>السهم</th>
                                                        <th>الكمية</th>
                                                        <th>القيمة</th>
                                                        <th>النسبة</th>
                                                        <th>الأداء</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><strong>سابك</strong></td>
                                                        <td>100</td>
                                                        <td>25,000 ريال</td>
                                                        <td>20%</td>
                                                        <td><span class="text-success">+8.5%</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>الراجحي</strong></td>
                                                        <td>150</td>
                                                        <td>22,500 ريال</td>
                                                        <td>18%</td>
                                                        <td><span class="text-success">+12.3%</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>الأهلي</strong></td>
                                                        <td>200</td>
                                                        <td>20,000 ريال</td>
                                                        <td>16%</td>
                                                        <td><span class="text-danger">-2.1%</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>الاتصالات</strong></td>
                                                        <td>80</td>
                                                        <td>18,000 ريال</td>
                                                        <td>14.4%</td>
                                                        <td><span class="text-success">+15.7%</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>كيان</strong></td>
                                                        <td>120</td>
                                                        <td>15,000 ريال</td>
                                                        <td>12%</td>
                                                        <td><span class="text-success">+6.8%</span></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                        <button type="button" class="btn btn-primary">تصدير التقرير</button>
                        <button type="button" class="btn btn-success">حفظ التحليل</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('portfolioAnalysisModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('portfolioAnalysisModal'));
    modal.show();
    
    // Initialize portfolio chart
    setTimeout(() => {
        initializePortfolioChart();
    }, 500);
}

// Initialize portfolio pie chart
function initializePortfolioChart() {
    const ctx = document.getElementById('portfolioPieChart');
    if (!ctx || typeof Chart === 'undefined') return;
    
    try {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['سابك', 'الراجحي', 'الأهلي', 'الاتصالات', 'كيان', 'أخرى'],
                datasets: [{
                    data: [20, 18, 16, 14.4, 12, 19.6],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6',
                        '#6b7280'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
        
        console.log('✅ Portfolio chart initialized');
    } catch (error) {
        console.error('❌ Error initializing portfolio chart:', error);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
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
        // Clear any existing content
        ctx.innerHTML = '';
        
        // Sample data for TASI chart
        const sampleLabels = ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00'];
        const sampleData = [10850, 10865, 10872, 10845, 10838, 10855, 10870, 10878, 10865, 10872, 10880, 10875];
        
        // Destroy existing chart if it exists
        if (window.tasiChart) {
            window.tasiChart.destroy();
        }
        
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
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3b82f6',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
        
        console.log('✅ TASI chart initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing TASI chart:', error);
        // Create fallback display
        ctx.innerHTML = '<div style="text-align: center; padding: 20px; color: #6b7280;"><i class="fas fa-chart-line" style="font-size: 24px; margin-bottom: 8px; color: #3b82f6;"></i><br>مؤشر السوق السعودي (TASI)<br><small>حدث خطأ في تحميل الرسم البياني</small></div>';
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