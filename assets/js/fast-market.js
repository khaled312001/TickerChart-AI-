// Fast Market Data Loader - Ultra Optimized
// محمل بيانات السوق السريع - محسن للغاية

console.log('🚀 Fast Market Loader - Initializing...');

// Global variables
let marketData = null;
let charts = {};
let isLoading = false;

// Utility functions
function formatPrice(price) {
    return parseFloat(price).toFixed(2);
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

function formatTimestamp(timestamp) {
    if (!timestamp) return 'غير متوفر';
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA');
}

// Fast API call function
async function fetchMarketData(refresh = false) {
    if (isLoading) return;
    
    isLoading = true;
    const url = `/api/real-time-market-api.php?action=market_overview${refresh ? '&refresh=1' : ''}`;
    
    try {
        console.log('📡 Fetching market data...');
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            marketData = result.data;
            console.log('✅ Market data received:', marketData);
            displayMarketData();
            initializeCharts();
        } else {
            console.error('❌ API Error:', result.error);
            showError('خطأ في تحميل البيانات');
        }
    } catch (error) {
        console.error('❌ Network Error:', error);
        showError('خطأ في الاتصال');
    } finally {
        isLoading = false;
    }
}

// Display market data
function displayMarketData() {
    if (!marketData) return;
    
    console.log('🎯 Displaying market data...');
    
    // Update TASI value
    const tasiElement = document.getElementById('tasiValue');
    if (tasiElement) {
        tasiElement.textContent = marketData.tasi_value;
    }
    
    // Update TASI change
    const tasiChangeElement = document.getElementById('tasiChange');
    if (tasiChangeElement) {
        const changeText = marketData.tasi_change >= 0 ? 
            `+${marketData.tasi_change} (+${marketData.tasi_change_percent}%)` :
            `${marketData.tasi_change} (${marketData.tasi_change_percent}%)`;
        
        tasiChangeElement.textContent = changeText;
        tasiChangeElement.className = marketData.tasi_change >= 0 ? 'text-success' : 'text-danger';
    }
    
    // Update market statistics
    updateMarketStats();
    
    // Update top gainers and losers
    updateTopStocks();
    
    // Hide loading screen
    hideLoadingScreen();
}

// Update market statistics
function updateMarketStats() {
    const statsContainer = document.getElementById('marketStats');
    if (!statsContainer || !marketData) return;
    
    const html = `
        <div class="row g-3">
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon text-success">
                        <i class="fas fa-arrow-up"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${marketData.up_companies}</div>
                        <div class="stat-label">الأسهم الصاعدة</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon text-danger">
                        <i class="fas fa-arrow-down"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${marketData.down_companies}</div>
                        <div class="stat-label">الأسهم الهابطة</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon text-warning">
                        <i class="fas fa-minus"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${marketData.stable_companies}</div>
                        <div class="stat-label">الأسهم المستقرة</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-icon text-info">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${marketData.total_companies}</div>
                        <div class="stat-label">إجمالي الشركات</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    statsContainer.innerHTML = html;
}

// Update top stocks
function updateTopStocks() {
    if (!marketData) return;
    
    // Update top gainers
    const gainersContainer = document.getElementById('topGainers');
    if (gainersContainer && marketData.top_gainers) {
        let gainersHtml = '';
        marketData.top_gainers.slice(0, 5).forEach(stock => {
            gainersHtml += `
                <div class="stock-item">
                    <div class="stock-info">
                        <div class="stock-name">${stock.name}</div>
                        <div class="stock-symbol">${stock.symbol}</div>
                    </div>
                    <div class="stock-price">${formatPrice(stock.price)}</div>
                    <div class="stock-change text-success">+${stock.change_percent.toFixed(2)}%</div>
                </div>
            `;
        });
        gainersContainer.innerHTML = gainersHtml;
    }
    
    // Update top losers
    const losersContainer = document.getElementById('topLosers');
    if (losersContainer && marketData.top_losers) {
        let losersHtml = '';
        marketData.top_losers.slice(0, 5).forEach(stock => {
            losersHtml += `
                <div class="stock-item">
                    <div class="stock-info">
                        <div class="stock-name">${stock.name}</div>
                        <div class="stock-symbol">${stock.symbol}</div>
                    </div>
                    <div class="stock-price">${formatPrice(stock.price)}</div>
                    <div class="stock-change text-danger">${stock.change_percent.toFixed(2)}%</div>
                </div>
            `;
        });
        losersContainer.innerHTML = losersHtml;
    }
}

// Initialize charts
function initializeCharts() {
    if (!marketData || typeof Chart === 'undefined') return;
    
    console.log('📊 Initializing charts...');
    
    // Initialize TASI chart
    initializeTASIChart();
    
    // Initialize volume chart
    initializeVolumeChart();
}

// Initialize TASI chart
function initializeTASIChart() {
    const ctx = document.getElementById('tasiChart');
    if (!ctx || !marketData.tasi_history) return;
    
    try {
        const labels = marketData.tasi_history.map(item => item.date);
        const prices = marketData.tasi_history.map(item => item.price);
        
        if (charts.tasi) {
            charts.tasi.destroy();
        }
        
        charts.tasi = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'TASI Index',
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
        
        console.log('✅ TASI chart initialized');
    } catch (error) {
        console.error('❌ Error initializing TASI chart:', error);
    }
}

// Initialize volume chart
function initializeVolumeChart() {
    const ctx = document.getElementById('volumeChart');
    if (!ctx || !marketData.volume_data) return;
    
    try {
        const labels = marketData.volume_data.map(item => item.date);
        const volumes = marketData.volume_data.map(item => item.volume);
        
        if (charts.volume) {
            charts.volume.destroy();
        }
        
        charts.volume = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Volume',
                    data: volumes,
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: '#22c55e',
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
        
        console.log('✅ Volume chart initialized');
    } catch (error) {
        console.error('❌ Error initializing volume chart:', error);
    }
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
    
    // Show main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.display = 'block';
    }
}

// Show error message
function showError(message) {
    console.error('❌ Error:', message);
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        <strong>خطأ!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at top of page
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(errorDiv, container.firstChild);
    }
    
    // Hide loading screen
    hideLoadingScreen();
}

// Auto refresh function
function startAutoRefresh() {
    setInterval(() => {
        if (!isLoading) {
            fetchMarketData(true);
        }
    }, 30000); // Refresh every 30 seconds
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOM ready, starting fast market loader...');
    
    // Start loading data immediately
    fetchMarketData();
    
    // Start auto refresh
    startAutoRefresh();
    
    // Setup refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            fetchMarketData(true);
        });
    }
});

// Export functions for global access
window.FastMarket = {
    fetchMarketData,
    displayMarketData,
    initializeCharts,
    hideLoadingScreen,
    showError
};

console.log('✅ Fast Market Loader - Ready'); 