// Enhanced TickerChart AI - Charts Module
// TickerChart AI المحسن - وحدة الرسوم البيانية

// Chart configuration
const ChartConfig = {
    colors: {
        primary: '#1e3a8a',
        secondary: '#f59e0b',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        light: '#f8fafc',
        dark: '#1f2937'
    },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#f59e0b',
                    borderWidth: 1,
                    cornerRadius: 8,
                displayColors: false
                }
            },
            scales: {
                x: {
                    grid: { 
                    display: false
                    },
                    ticks: { 
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                    grid: { 
                    color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: { 
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            }
        },
        elements: {
            point: {
                radius: 0,
                hoverRadius: 6
            },
            line: {
                tension: 0.2
                }
            },
            animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        }
    }
};

// Create market chart
function createMarketChart(ctx) {
    if (!ctx) return null;
    
    // Generate sample data for demonstration
    const labels = generateTimeLabels(24);
    const data = generateSampleData(24);
    
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'مؤشر السوق السعودي',
            data: data,
            borderColor: ChartConfig.colors.secondary,
            backgroundColor: ChartConfig.colors.secondary + '20',
            borderWidth: 2,
            fill: true,
            tension: 0.2
        }]
    };
    
    const chartOptions = {
        ...ChartConfig.options,
            plugins: {
            ...ChartConfig.options.plugins,
                legend: {
                display: true,
                position: 'top',
                    labels: {
                    color: '#374151',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            }
        }
    };
    
    return new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}

// Create analysis chart
function createAnalysisChart(ctx) {
    if (!ctx) return null;
    
    // Generate sample data for demonstration
    const labels = generateTimeLabels(30);
    const priceData = generateSampleData(30);
    const volumeData = generateVolumeData(30);
    
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'السعر',
                data: priceData,
                borderColor: ChartConfig.colors.primary,
                backgroundColor: ChartConfig.colors.primary + '10',
            borderWidth: 2,
                fill: false,
                tension: 0.2,
                yAxisID: 'y'
            },
            {
                label: 'الحجم',
                data: volumeData,
                borderColor: ChartConfig.colors.info,
                backgroundColor: ChartConfig.colors.info + '20',
                borderWidth: 1,
                fill: true,
                tension: 0.2,
                yAxisID: 'y1'
            }
        ]
    };
    
    const chartOptions = {
        ...ChartConfig.options,
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false
                },
                    ticks: { 
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            }
        },
        plugins: {
            ...ChartConfig.options.plugins,
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#374151',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            }
        }
    };
    
    return new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}

// Create technical indicators chart
function createTechnicalChart(ctx, data) {
    if (!ctx || !data) return null;
    
    const labels = data.labels || generateTimeLabels(50);
    const priceData = data.prices || generateSampleData(50);
    const sma20Data = calculateSMA(priceData, 20);
    const sma50Data = calculateSMA(priceData, 50);
    const rsiData = calculateRSI(priceData, 14);
    
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'السعر',
                data: priceData,
                borderColor: ChartConfig.colors.primary,
                backgroundColor: ChartConfig.colors.primary + '10',
                borderWidth: 2,
                fill: false,
                tension: 0.2,
                yAxisID: 'y'
            },
            {
                label: 'SMA 20',
                data: sma20Data,
                borderColor: ChartConfig.colors.success,
                backgroundColor: 'transparent',
                borderWidth: 1,
                fill: false,
                tension: 0.2,
                yAxisID: 'y'
            },
            {
                label: 'SMA 50',
                data: sma50Data,
                borderColor: ChartConfig.colors.warning,
                backgroundColor: 'transparent',
                borderWidth: 1,
                fill: false,
                tension: 0.2,
                yAxisID: 'y'
            },
            {
                label: 'RSI',
                data: rsiData,
                borderColor: ChartConfig.colors.info,
                backgroundColor: ChartConfig.colors.info + '20',
                borderWidth: 1,
                fill: true,
                tension: 0.2,
                yAxisID: 'y1'
            }
        ]
    };
    
    const chartOptions = {
        ...ChartConfig.options,
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0,
                max: 100,
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            }
        }
    };
    
    return new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}

// Create volume chart
function createVolumeChart(ctx, data) {
    if (!ctx || !data) return null;
    
    const labels = data.labels || generateTimeLabels(30);
    const volumeData = data.volumes || generateVolumeData(30);
    
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'حجم التداول',
            data: volumeData,
            backgroundColor: ChartConfig.colors.info + '40',
            borderColor: ChartConfig.colors.info,
            borderWidth: 1,
            borderRadius: 4
        }]
    };
    
    const chartOptions = {
        ...ChartConfig.options,
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            }
        }
    };
    
    return new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
}

// Create performance comparison chart
function createPerformanceChart(ctx, data) {
    if (!ctx || !data) return null;
    
    const labels = data.labels || ['الراجحي', 'سابك', 'الاتصالات', 'البنك الأهلي', 'الرياض'];
    const performanceData = data.performance || [12.5, 8.3, -2.1, 15.7, 6.2];
    
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'الأداء (%)',
            data: performanceData,
            backgroundColor: performanceData.map(value => 
                value >= 0 ? ChartConfig.colors.success + '80' : ChartConfig.colors.danger + '80'
            ),
            borderColor: performanceData.map(value => 
                value >= 0 ? ChartConfig.colors.success : ChartConfig.colors.danger
            ),
            borderWidth: 2,
            borderRadius: 8
        }]
    };
    
    const chartOptions = {
        ...ChartConfig.options,
            scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            }
        }
    };
    
    return new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
}

// Update chart data
function updateChartData(chart, newData) {
    if (!chart || !newData) return;
    
    // Update chart data based on the type of data received
    if (newData.prices) {
        chart.data.datasets[0].data = newData.prices;
        chart.data.labels = newData.labels || chart.data.labels;
    }
    
    if (newData.volumes) {
        chart.data.datasets[1].data = newData.volumes;
    }
    
    chart.update('active');
}

// Update chart period
function updateChartPeriod(period) {
    // This function will be called when timeframe buttons are clicked
    console.log('Updating chart period to:', period);
    
    // Remove active class from all buttons
    document.querySelectorAll('[data-period]').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Here you would typically fetch new data based on the period
    // and update the chart accordingly
    loadChartDataForPeriod(period);
}

// Load chart data for specific period
async function loadChartDataForPeriod(period) {
    try {
        // This would be implemented to fetch data from your API
        // based on the selected period
        console.log('Loading data for period:', period);
        
        // Example implementation:
        // const response = await fetch(`api/enhanced_market_api.php?action=chart_data&period=${period}`);
        // const data = await response.json();
        // updateChartData(currentChart, data);
        
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

// Utility functions for generating sample data
function generateTimeLabels(count) {
    const labels = [];
    const now = new Date();
    
    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('ar-SA', { 
            month: 'short', 
            day: 'numeric' 
        }));
    }
    
    return labels;
}

function generateSampleData(count) {
    const data = [];
    let baseValue = 10000 + Math.random() * 2000;
    
    for (let i = 0; i < count; i++) {
        const change = (Math.random() - 0.5) * 200;
        baseValue += change;
        data.push(Math.max(8000, Math.min(12000, baseValue)));
    }
    
    return data;
}

function generateVolumeData(count) {
    const data = [];
    
    for (let i = 0; i < count; i++) {
        data.push(Math.floor(Math.random() * 1000000) + 500000);
    }
    
    return data;
}

// Technical analysis functions
function calculateSMA(data, period) {
    const sma = [];
    
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            sma.push(null);
        } else {
            const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            sma.push(sum / period);
        }
    }
    
    return sma;
}

function calculateRSI(data, period) {
    const rsi = [];
    
    for (let i = 0; i < data.length; i++) {
        if (i < period) {
            rsi.push(50); // Neutral RSI
        } else {
            const gains = [];
            const losses = [];
            
            for (let j = i - period + 1; j <= i; j++) {
                const change = data[j] - data[j - 1];
                if (change > 0) {
                    gains.push(change);
                    losses.push(0);
                } else {
                    gains.push(0);
                    losses.push(Math.abs(change));
                }
            }
            
            const avgGain = gains.reduce((a, b) => a + b, 0) / period;
            const avgLoss = losses.reduce((a, b) => a + b, 0) / period;
            
            if (avgLoss === 0) {
                rsi.push(100);
            } else {
                const rs = avgGain / avgLoss;
                rsi.push(100 - (100 / (1 + rs)));
            }
        }
    }
    
    return rsi;
}

// Export functions for use in main.js
window.createMarketChart = createMarketChart;
window.createAnalysisChart = createAnalysisChart;
window.createTechnicalChart = createTechnicalChart;
window.createVolumeChart = createVolumeChart;
window.createPerformanceChart = createPerformanceChart;
window.updateChartData = updateChartData;
window.updateChartPeriod = updateChartPeriod;

console.log('📊 TickerChart AI Enhanced v3.0 - Charts Module loaded'); 