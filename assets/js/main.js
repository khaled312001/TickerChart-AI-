// Enhanced TickerChart AI - Main JavaScript
// TickerChart AI المحسن - الجافا سكريبت الرئيسي

// Global variables
let currentChart = null;
let marketData = {};
let analysisResults = {};
let currentSymbol = '';
let refreshInterval = null;
let animationObserver = null;

// API endpoints
const API_ENDPOINTS = {
    enhanced_market: 'api/enhanced_market_api.php',
    ai_tools: 'api/ai_tools.php',
    working_market: 'api/working_market_api.php',
    ai_analyzer: 'ai/enhanced_stock_analyzer.py'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 TickerChart AI Enhanced v3.0 - Initializing...');
    
    // Debug: Check if key elements exist
    console.log('🔍 Checking DOM elements...');
    console.log('marketData element:', document.getElementById('marketData'));
    console.log('tasiChart element:', document.getElementById('tasiChart'));
    console.log('analysisChart element:', document.getElementById('analysisChart'));
    console.log('stockAnalyzerSelect element:', document.getElementById('stockAnalyzerSelect'));
    
    // Initialize components
    initializeAnimations();
    initializeMarketData();
    initializeStockSelector();
    initializeEventListeners();
    initializeCharts();
    initializeHeroSection();
    
    // Start real-time updates
    startRealTimeUpdates();
    
    // Ensure content is visible after a short delay
    setTimeout(() => {
        ensureContentVisibility();
    }, 2000);
    
    console.log('✅ TickerChart AI Enhanced v3.0 - Initialized successfully');
});

// Initialize animations and scroll effects
function initializeAnimations() {
    console.log('🎬 Initializing animations...');
    
    // Create intersection observer for scroll animations
    animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.animate-on-scroll');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all sections with animations
    document.querySelectorAll('section, .animate-on-scroll').forEach(el => {
        animationObserver.observe(el);
    });
    
    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Initialize hero section with dynamic content
function initializeHeroSection() {
    console.log('🏠 Initializing hero section...');
    
    const heroSection = document.getElementById('home');
    if (!heroSection) {
        console.error('❌ Hero section not found!');
        return;
    }
    
    // Add dynamic hero chart
    initializeHeroChart();
    
    // Add dynamic text effects
    addDynamicTextEffects();
    
    // Add floating elements
    addFloatingElements();
    
    console.log('✅ Hero section initialized');
}

// Initialize hero chart
function initializeHeroChart() {
    const heroChartCanvas = document.getElementById('heroChart');
    if (!heroChartCanvas) {
        console.warn('⚠️ Hero chart canvas not found');
        return;
    }
    
    const ctx = heroChartCanvas.getContext('2d');
    
    // Create sample data for hero chart
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
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
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
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            elements: {
                point: {
                    hoverRadius: 8
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
    
    // Animate chart data
    animateChartData(heroChart, data);
}

// Animate chart data
function animateChartData(chart, targetData) {
    const originalData = targetData.map(() => 0);
    chart.data.datasets[0].data = originalData;
    
    let currentIndex = 0;
    const animationInterval = setInterval(() => {
        if (currentIndex < targetData.length) {
            originalData[currentIndex] = targetData[currentIndex];
            chart.update('none');
            currentIndex++;
        } else {
            clearInterval(animationInterval);
        }
    }, 200);
}

// Add dynamic text effects
function addDynamicTextEffects() {
    const heroTitle = document.querySelector('.hero-section h1');
    if (heroTitle) {
        // Add typing effect
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                heroTitle.textContent += text[index];
                index++;
            } else {
                clearInterval(typeInterval);
                // Add cursor blink effect
                heroTitle.innerHTML += '<span class="cursor">|</span>';
            }
        }, 100);
    }
}

// Add floating elements to hero section
function addFloatingElements() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    // Create floating icons
    const icons = ['📈', '💹', '📊', '🎯', '🚀', '💎'];
    icons.forEach((icon, index) => {
        const floatingIcon = document.createElement('div');
        floatingIcon.className = 'floating-icon';
        floatingIcon.textContent = icon;
        floatingIcon.style.cssText = `
            position: absolute;
            font-size: 2rem;
            opacity: 0.3;
            animation: float ${3 + index * 0.5}s ease-in-out infinite;
            animation-delay: ${index * 0.5}s;
            left: ${10 + index * 15}%;
            top: ${20 + index * 10}%;
            z-index: 1;
        `;
        heroSection.appendChild(floatingIcon);
    });
}

// Enhanced market data initialization
async function initializeMarketData() {
    try {
        showLoadingScreen();
        console.log('🔄 Loading enhanced market data...');
        
        // Add debugging information
        console.log('🔍 Current page URL:', window.location.href);
        console.log('🔍 Document ready state:', document.readyState);
        console.log('🔍 Market data container exists:', !!document.getElementById('marketData'));
        
        // Load enhanced market data
        const marketResponse = await fetch(`${API_ENDPOINTS.enhanced_market}?action=market_overview`);
        const marketData = await marketResponse.json();
        
        console.log('📊 Enhanced market data received:', marketData);
        
        if (marketData.success && marketData.market_data && marketData.market_data.length > 0) {
            console.log('📊 Market data is valid, displaying overview...');
            displayMarketOverview(marketData);
            updateStockSelector(marketData.market_data);
        } else {
            console.warn('⚠️ Enhanced market data not available, falling back to working API');
            console.log('📊 Market data details:', {
                success: marketData.success,
                hasMarketData: !!marketData.market_data,
                marketDataLength: marketData.market_data ? marketData.market_data.length : 0
            });
            await loadWorkingMarketData();
        }
        
        hideLoadingScreen();
    } catch (error) {
        console.error('❌ Error initializing market data:', error);
        console.log('🔄 Attempting to load working market data as fallback...');
        await loadWorkingMarketData();
        
        // If both APIs fail, show error message instead of static data
        console.log('❌ Both APIs failed, showing error message');
        displayErrorMessage('فشل في تحميل البيانات المباشرة. يرجى المحاولة لاحقاً أو التحقق من الاتصال بالإنترنت.');
        
        hideLoadingScreen();
    }
}

// Load working market data as fallback
async function loadWorkingMarketData() {
    try {
        const response = await fetch(API_ENDPOINTS.working_market);
        const data = await response.json();
        
        if (data.success) {
            displayMarketOverview(data);
            updateStockSelector(data.market_data || []);
        }
    } catch (error) {
        console.error('❌ Error loading working market data:', error);
        displayErrorMessage('فشل في تحميل بيانات السوق');
    }
}

// Display market overview
function displayMarketOverview(data) {
    console.log('🎯 Displaying market overview...');
    
    // Try multiple approaches to find and display content
    const marketSection = document.getElementById('marketData');
    if (!marketSection) {
        console.error('❌ marketData element not found!');
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
    
    // Display top gainers and losers
    if (data.top_gainers && data.top_gainers.length > 0) {
        html += `
            <div class="row mt-4">
                <div class="col-lg-6">
                    <div class="card h-100">
                        <div class="card-header bg-success text-white">
                            <h5 class="mb-0"><i class="fas fa-arrow-up me-2"></i>أعلى الرابحين</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>السهم</th>
                                            <th>السعر</th>
                                            <th>التغير %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
        `;
        
        data.top_gainers.slice(0, 5).forEach(stock => {
            html += `
                <tr>
                    <td><strong>${stock.name}</strong></td>
                    <td>${formatPrice(stock.price)}</td>
                    <td class="text-success">+${stock.change_percent.toFixed(2)}%</td>
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
                <div class="col-lg-6">
                    <div class="card h-100">
                        <div class="card-header bg-danger text-white">
                            <h5 class="mb-0"><i class="fas fa-arrow-down me-2"></i>أعلى الخاسرين</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>السهم</th>
                                            <th>السعر</th>
                                            <th>التغير %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
        `;
        
        data.top_losers.slice(0, 5).forEach(stock => {
            html += `
                <tr>
                    <td><strong>${stock.name}</strong></td>
                    <td>${formatPrice(stock.price)}</td>
                    <td class="text-danger">${stock.change_percent.toFixed(2)}%</td>
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
    console.log('✅ Market overview HTML updated');
    
    // Ensure the section is visible
    marketSection.style.display = 'block';
    marketSection.style.visibility = 'visible';
    marketSection.style.opacity = '1';
    
    // Test div removed - JavaScript is working correctly
    
    // Test content removed - site is working correctly
    
    // Scroll to the market data section
    marketSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    console.log('📜 Scrolled to market data section');
    console.log('🔍 Market section HTML after update:', marketSection.innerHTML.length, 'characters');
}

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
                    
                    <!-- Technical Indicators -->
                    ${data.technical_indicators ? `
                        <div class="technical-indicators">
                            <h5><i class="fas fa-chart-line me-2"></i>المؤشرات الفنية</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="indicator-item">
                                        <span class="indicator-label">RSI</span>
                                        <span class="indicator-value">${data.technical_indicators.rsi ? data.technical_indicators.rsi.toFixed(2) : 'N/A'}</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="indicator-item">
                                        <span class="indicator-label">SMA 20</span>
                                        <span class="indicator-value">${data.technical_indicators.sma_20 ? formatPrice(data.technical_indicators.sma_20) : 'N/A'}</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="indicator-item">
                                        <span class="indicator-label">SMA 50</span>
                                        <span class="indicator-value">${data.technical_indicators.sma_50 ? formatPrice(data.technical_indicators.sma_50) : 'N/A'}</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="indicator-item">
                                        <span class="indicator-label">الحجم المتوسط</span>
                                        <span class="indicator-value">${data.technical_indicators.volume_sma ? formatVolume(data.technical_indicators.volume_sma) : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="col-lg-4">
                    <!-- AI Insights -->
                    ${data.ai_insights ? `
                        <div class="ai-insights">
                            <h5><i class="fas fa-brain me-2"></i>رؤى الذكاء الاصطناعي</h5>
                            <div class="insights-list">
                                ${Object.entries(data.ai_insights).map(([key, value]) => `
                                    <div class="insight-item">
                                        <span class="insight-label">${getInsightLabel(key)}</span>
                                        <span class="insight-value">${value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- Risk Analysis -->
                    ${data.risk_analysis ? `
                        <div class="risk-analysis">
                            <h5><i class="fas fa-shield-alt me-2"></i>تحليل المخاطر</h5>
                            <div class="risk-level ${data.risk_analysis.risk_level === 'عالي' ? 'high-risk' : data.risk_analysis.risk_level === 'منخفض' ? 'low-risk' : 'medium-risk'}">
                                <span class="risk-label">مستوى المخاطر:</span>
                                <span class="risk-value">${data.risk_analysis.risk_level}</span>
                            </div>
                            <div class="risk-factors">
                                ${data.risk_analysis.factors.map(factor => `
                                    <div class="risk-factor">• ${factor}</div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Recommendations -->
            ${data.recommendations && data.recommendations.length > 0 ? `
                <div class="recommendations-section">
                    <h5><i class="fas fa-lightbulb me-2"></i>التوصيات</h5>
                    <div class="recommendations-list">
                        ${data.recommendations.map(rec => `
                            <div class="recommendation-item">
                                <i class="fas fa-check-circle me-2"></i>
                                ${rec}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Company Profile -->
            ${data.company_profile ? `
                <div class="company-profile">
                    <h5><i class="fas fa-building me-2"></i>معلومات الشركة</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="profile-item">
                                <span class="profile-label">اسم الشركة</span>
                                <span class="profile-value">${data.company_profile.name || 'غير متوفر'}</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="profile-item">
                                <span class="profile-label">القطاع</span>
                                <span class="profile-value">${data.company_profile.sector || 'غير متوفر'}</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="profile-item">
                                <span class="profile-label">الصناعة</span>
                                <span class="profile-value">${data.company_profile.industry || 'غير متوفر'}</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="profile-item">
                                <span class="profile-label">الموقع</span>
                                <span class="profile-value">${data.company_profile.country || 'غير متوفر'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    modalBody.innerHTML = html;
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('stockAnalysisModal'));
    modal.show();
}

// Get insight label in Arabic
function getInsightLabel(key) {
    const labels = {
        'price_movement': 'حركة السعر',
        'rsi': 'مؤشر القوة النسبية',
        'volume': 'حجم التداول',
        'trend': 'الاتجاه'
    };
    return labels[key] || key;
}

// Initialize event listeners
function initializeEventListeners() {
    // Navigation smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // AI Tools buttons
    document.querySelectorAll('[onclick*="openTrendAnalysis"]').forEach(btn => {
        btn.addEventListener('click', openTrendAnalysis);
    });
    
    document.querySelectorAll('[onclick*="openPricePrediction"]').forEach(btn => {
        btn.addEventListener('click', openPricePrediction);
    });
    
    document.querySelectorAll('[onclick*="openRiskManagement"]').forEach(btn => {
        btn.addEventListener('click', openRiskManagement);
    });
    
    document.querySelectorAll('[onclick*="openPortfolioAnalysis"]').forEach(btn => {
        btn.addEventListener('click', openPortfolioAnalysis);
    });
    
    // Chart controls
    document.querySelectorAll('[data-period]').forEach(btn => {
        btn.addEventListener('click', function() {
            const period = this.getAttribute('data-period');
            updateChartPeriod(period);
        });
    });
}

// Initialize charts
function initializeCharts() {
    // Initialize main market chart
    const ctx = document.getElementById('tasiChart');
    if (ctx) {
        currentChart = createMarketChart(ctx);
    }
    
    // Initialize analysis chart
    const analysisCtx = document.getElementById('analysisChart');
    if (analysisCtx) {
        createAnalysisChart(analysisCtx);
    }
}

// Start real-time updates
function startRealTimeUpdates() {
    // Update market data every 30 seconds
    refreshInterval = setInterval(async () => {
        try {
            const response = await fetch(`${API_ENDPOINTS.enhanced_market}?action=market_overview`);
            const data = await response.json();
            
            if (data.success) {
                updateMarketData(data);
            }
        } catch (error) {
            console.warn('⚠️ Real-time update failed:', error);
        }
    }, 30000);
}

// Update market data without full reload
function updateMarketData(data) {
    // Update market overview
    if (data.market_data) {
        updateMarketOverview(data);
    }
    
    // Update current chart if available
    if (currentChart && data.market_data) {
        updateChartData(currentChart, data.market_data);
    }
}

// Update market overview without full reload
function updateMarketOverview(data) {
    const marketSection = document.getElementById('marketData');
    if (!marketSection) return;
    
    // Update summary stats
    const statItems = marketSection.querySelectorAll('.stat-value');
    if (statItems.length >= 2) {
        statItems[0].textContent = data.total_stocks || 0;
        statItems[1].textContent = formatTimestamp(data.timestamp);
    }
    
    // Update top gainers and losers if they exist
    if (data.top_gainers && data.top_gainers.length > 0) {
        updateTopGainers(data.top_gainers);
    }
    
    if (data.top_losers && data.top_losers.length > 0) {
        updateTopLosers(data.top_losers);
    }
}

// Update top gainers table
function updateTopGainers(gainers) {
    const gainersTable = document.querySelector('.card-header.bg-success');
    if (!gainersTable) {
        console.warn('⚠️ Gainers table not found');
        return;
    }
    const tbody = gainersTable.closest('.card').querySelector('tbody');
    if (!tbody) {
        console.warn('⚠️ Gainers tbody not found');
        return;
    }
    
    tbody.innerHTML = '';
    gainers.slice(0, 5).forEach(stock => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${stock.name}</strong></td>
            <td>${formatPrice(stock.price)}</td>
            <td class="text-success">+${stock.change_percent.toFixed(2)}%</td>
        `;
        tbody.appendChild(row);
    });
}

// Update top losers table
function updateTopLosers(losers) {
    const losersTable = document.querySelector('.card-header.bg-danger');
    if (!losersTable) {
        console.warn('⚠️ Losers table not found');
        return;
    }
    const tbody = losersTable.closest('.card').querySelector('tbody');
    if (!tbody) {
        console.warn('⚠️ Losers tbody not found');
        return;
    }
    
    tbody.innerHTML = '';
    losers.slice(0, 5).forEach(stock => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${stock.name}</strong></td>
            <td>${formatPrice(stock.price)}</td>
            <td class="text-danger">${stock.change_percent.toFixed(2)}%</td>
        `;
        tbody.appendChild(row);
    });
}

// Utility functions
function formatPrice(price) {
    if (price === null || price === undefined) return 'N/A';
    return parseFloat(price).toFixed(2);
}

function formatVolume(volume) {
    if (volume === null || volume === undefined) return 'N/A';
    if (volume >= 1000000) {
        return (volume / 1000000).toFixed(1) + 'M';
    } else if (volume >= 1000) {
        return (volume / 1000).toFixed(1) + 'K';
    }
    return volume.toString();
}

function formatTimestamp(timestamp) {
    if (!timestamp) return 'غير متوفر';
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA');
}

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

function displayErrorMessage(message) {
    // Create and show error toast
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-danger border-0';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.appendChild(toast);
    document.body.appendChild(container);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        document.body.removeChild(container);
    });
}

// AI Tools Functions
async function openTrendAnalysis() {
    try {
        showLoadingScreen();
        
        const response = await fetch(`${API_ENDPOINTS.ai_tools}?action=trend_analysis`);
        const data = await response.json();
        
        if (data.success) {
            displayTrendAnalysis(data);
        } else {
            throw new Error(data.error || 'فشل في تحليل الاتجاهات');
        }
        
        hideLoadingScreen();
    } catch (error) {
        console.error('❌ Error in trend analysis:', error);
        displayErrorMessage('فشل في تحليل الاتجاهات: ' + error.message);
        hideLoadingScreen();
    }
}

async function openPricePrediction() {
    try {
        showLoadingScreen();
        
        const response = await fetch(`${API_ENDPOINTS.ai_tools}?action=price_prediction`);
        const data = await response.json();
        
        if (data.success) {
            displayPricePrediction(data);
        } else {
            throw new Error(data.error || 'فشل في التنبؤ بالأسعار');
        }
        
        hideLoadingScreen();
    } catch (error) {
        console.error('❌ Error in price prediction:', error);
        displayErrorMessage('فشل في التنبؤ بالأسعار: ' + error.message);
        hideLoadingScreen();
    }
}

async function openRiskManagement() {
    try {
        showLoadingScreen();
        
        const response = await fetch(`${API_ENDPOINTS.ai_tools}?action=risk_analysis`);
        const data = await response.json();
        
        if (data.success) {
            displayRiskManagement(data);
        } else {
            throw new Error(data.error || 'فشل في تحليل المخاطر');
        }
        
        hideLoadingScreen();
    } catch (error) {
        console.error('❌ Error in risk management:', error);
        displayErrorMessage('فشل في تحليل المخاطر: ' + error.message);
        hideLoadingScreen();
    }
}

async function openPortfolioAnalysis() {
    try {
        showLoadingScreen();
        
        const response = await fetch(`${API_ENDPOINTS.ai_tools}?action=portfolio_analysis`);
        const data = await response.json();
        
        if (data.success) {
            displayPortfolioAnalysis(data);
        } else {
            throw new Error(data.error || 'فشل في تحليل المحفظة');
        }
        
        hideLoadingScreen();
    } catch (error) {
        console.error('❌ Error in portfolio analysis:', error);
        displayErrorMessage('فشل في تحليل المحفظة: ' + error.message);
        hideLoadingScreen();
    }
}

// Display functions for AI tools
function displayTrendAnalysis(data) {
    const modalBody = document.getElementById('trendModalBody');
    if (!modalBody) return;
    
    let html = `
        <div class="trend-analysis">
            <div class="row">
                    <div class="col-md-6">
                    <div class="trend-card">
                        <h6>اتجاه السوق</h6>
                        <div class="trend-value ${data.data.trend === 'صاعد' ? 'text-success' : 'text-danger'}">
                            ${data.data.trend}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                    <div class="confidence-card">
                        <h6>مستوى الثقة</h6>
                        <div class="confidence-value">${data.data.confidence}%</div>
                                </div>
                            </div>
                        </div>
            
            ${data.data.recommendations && data.data.recommendations.length > 0 ? `
                <div class="recommendations-section mt-4">
                    <h6>التوصيات</h6>
                    <ul class="recommendations-list">
                        ${data.data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                                </ul>
                            </div>
            ` : ''}
                        </div>
    `;
    
    modalBody.innerHTML = html;
    
    const modal = new bootstrap.Modal(document.getElementById('trendModal'));
    modal.show();
}

function displayPricePrediction(data) {
    const modalBody = document.getElementById('predictionModalBody');
    if (!modalBody) return;
    
    let html = `
        <div class="price-prediction">
            <div class="prediction-summary">
                <h6>التنبؤ بالأسعار</h6>
                <div class="prediction-value">${data.data.prediction || 'غير متوفر'}</div>
                    </div>
            
            ${data.data.factors && data.data.factors.length > 0 ? `
                <div class="factors-section mt-4">
                    <h6>العوامل المؤثرة</h6>
                    <ul class="factors-list">
                        ${data.data.factors.map(factor => `<li>${factor}</li>`).join('')}
                    </ul>
                    </div>
            ` : ''}
                    </div>
    `;
    
    modalBody.innerHTML = html;
    
    const modal = new bootstrap.Modal(document.getElementById('predictionModal'));
    modal.show();
}

function displayRiskManagement(data) {
    const modalBody = document.getElementById('riskModalBody');
    if (!modalBody) return;
    
    let html = `
        <div class="risk-management">
            <div class="risk-summary">
                <h6>تحليل المخاطر</h6>
                <div class="risk-level ${data.data.risk_level === 'عالي' ? 'high-risk' : 'low-risk'}">
                    ${data.data.risk_level}
                    </div>
                        </div>
            
            ${data.data.recommendations && data.data.recommendations.length > 0 ? `
                <div class="risk-recommendations mt-4">
                    <h6>توصيات إدارة المخاطر</h6>
                    <ul class="recommendations-list">
                        ${data.data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                    </div>
            ` : ''}
                    </div>
    `;
    
    modalBody.innerHTML = html;
    
    const modal = new bootstrap.Modal(document.getElementById('riskModal'));
    modal.show();
}

function displayPortfolioAnalysis(data) {
    const modalBody = document.getElementById('portfolioModalBody');
    if (!modalBody) return;
    
    let html = `
        <div class="portfolio-analysis">
            <div class="portfolio-summary">
                <h6>تحليل المحفظة</h6>
                <div class="portfolio-performance">${data.data.performance || 'غير متوفر'}</div>
            </div>
            
            ${data.data.recommendations && data.data.recommendations.length > 0 ? `
                <div class="portfolio-recommendations mt-4">
                    <h6>توصيات المحفظة</h6>
                    <ul class="recommendations-list">
                        ${data.data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
            </div>
            ` : ''}
            </div>
        `;
    
    modalBody.innerHTML = html;
    
    const modal = new bootstrap.Modal(document.getElementById('portfolioModal'));
    modal.show();
}

// Add this new function to ensure content visibility
function ensureContentVisibility() {
    console.log('🔍 Ensuring content visibility...');
    
    // Check if market data section has content
    const marketSection = document.getElementById('marketData');
    if (marketSection && (!marketSection.innerHTML || marketSection.innerHTML.trim() === '')) {
        console.log('⚠️ Market section is empty, displaying fallback content...');
        
        // Try to reload live data instead of showing static fallback
        console.log('🔄 Attempting to reload live market data...');
        if (window.liveMarketData) {
            window.liveMarketData.loadLiveData();
        } else {
            console.warn('⚠️ Live market data handler not available');
        }
    }
    
    // Ensure all sections are visible
    const sections = ['home', 'market', 'ai-tools', 'analysis', 'about'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
            section.style.visibility = 'visible';
            section.style.opacity = '1';
        }
    });
    
    console.log('✅ Content visibility check completed');
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
});

console.log('📦 TickerChart AI Enhanced v3.0 - Main JavaScript loaded');
 