// Standalone functions for testing
console.log('🔧 Loading test functions...');

// Essential utility functions
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

// IMMEDIATELY export to global scope - no waiting for events
window.formatPrice = formatPrice;
window.formatTimestamp = formatTimestamp;
window.formatVolume = formatVolume;
window.displayMarketOverview = displayMarketOverview;
window.displaySampleData = displaySampleData;

console.log('✅ Test functions loaded and exported to global scope');

// Test the functions immediately
console.log('🧪 Testing functions:');
console.log('formatPrice(123.456):', formatPrice(123.456));
console.log('formatTimestamp(new Date().toISOString()):', formatTimestamp(new Date().toISOString()));
console.log('Functions available on window:', {
    formatPrice: typeof window.formatPrice,
    formatTimestamp: typeof window.formatTimestamp,
    displayMarketOverview: typeof window.displayMarketOverview,
    displaySampleData: typeof window.displaySampleData
}); 