// Optimized Charts configuration and utilities for Saudi Stock Market AI Tool

const ChartConfig = {
    // Optimized Hero chart configuration
    hero: {
        type: 'line',
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
            elements: {
                point: { 
                    radius: 0, // No points for better performance
                    hoverRadius: 4, // Reduced hover radius
                    hoverBackgroundColor: '#f59e0b',
                    hoverBorderColor: '#ffffff',
                    hoverBorderWidth: 1 // Reduced border width
                },
                line: {
                    tension: 0.2, // Reduced from 0.4 for better performance
                    borderWidth: 2 // Reduced from 3
                }
            },
            animation: {
                duration: 1000, // Reduced from 3000ms
                easing: 'easeOutQuart', // Simplified easing
                onProgress: null // Removed complex progress animation
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            hover: {
                mode: 'index',
                intersect: false
            }
        }
    },
    
    // Optimized Analysis chart configuration
    analysis: {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { 
                        font: { size: 11 }, // Reduced font size
                        usePointStyle: true,
                        padding: 15 // Reduced padding
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#f59e0b',
                    borderWidth: 1,
                    cornerRadius: 6, // Reduced corner radius
                    displayColors: true
                }
            },
            scales: {
                x: {
                    grid: { 
                        display: false,
                        color: 'rgba(0, 0, 0, 0.05)' // Reduced opacity
                    },
                    ticks: { 
                        maxTicksLimit: 8, // Reduced from 10
                        font: { size: 10 } // Reduced font size
                    }
                },
                y: {
                    grid: { 
                        color: 'rgba(0, 0, 0, 0.05)', // Reduced opacity
                        drawBorder: false
                    },
                    ticks: { 
                        callback: function(value) { 
                            return value.toLocaleString('ar-SA'); 
                        },
                        font: { size: 10 } // Reduced font size
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 1000, // Reduced from 2000ms
                easing: 'easeOutQuart' // Simplified easing
            },
            hover: {
                mode: 'index',
                intersect: false
            }
        }
    },
    
    // Optimized Prediction chart configuration
    prediction: {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 12, // Reduced padding
                        font: { size: 11 } // Reduced font size
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    cornerRadius: 6 // Reduced corner radius
                }
            },
            scales: {
                x: { 
                    grid: { 
                        display: false,
                        color: 'rgba(0, 0, 0, 0.05)' // Reduced opacity
                    },
                    ticks: { font: { size: 10 } } // Reduced font size
                },
                y: { 
                    grid: { 
                        color: 'rgba(0, 0, 0, 0.05)', // Reduced opacity
                        drawBorder: false
                    },
                    ticks: { 
                        callback: function(value) { 
                            return value.toLocaleString('ar-SA'); 
                        },
                        font: { size: 10 } // Reduced font size
                    }
                }
            },
            animation: {
                duration: 1200, // Reduced from 2500ms
                easing: 'easeOutQuart' // Simplified easing
            }
        }
    },
    
    // Optimized Risk chart configuration
    risk: {
        type: 'doughnut',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 12, // Reduced padding
                        font: { size: 11 } // Reduced font size
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#f59e0b',
                    borderWidth: 1,
                    cornerRadius: 6 // Reduced corner radius
                }
            },
            animation: {
                duration: 1000, // Reduced from 2000ms
                easing: 'easeOutQuart', // Simplified easing
                animateRotate: true,
                animateScale: false // Disabled scale animation for performance
            },
            cutout: '60%'
        }
    }
};

// Optimized Chart color schemes
const ChartColors = {
    primary: '#1e3a8a',
    secondary: '#f59e0b',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    light: '#f3f4f6',
    dark: '#1f2937'
};

// Simplified chart creation function with performance optimizations
function createOptimizedChart(canvasId, config, data) {
    try {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        // Optimize canvas for performance
        ctx.style.transition = 'none'; // Remove CSS transitions for better performance
        
        const chart = new Chart(ctx, {
            type: config.type,
            data: data,
            options: {
                ...config.options,
                animation: {
                    ...config.options.animation,
                    // Remove complex onProgress for better performance
                    onProgress: null
                }
            }
        });
        
        // Simplified hover effects
        ctx.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)'; // Reduced scale effect
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'; // Simplified shadow
        });
        
        ctx.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
        return chart;
        
    } catch (error) {
        console.error('Error creating optimized chart:', error);
        return null;
    }
}

// Optimized chart update function
function updateChartDataOptimized(chart, newData, animate = false) {
    try {
        // Add safety check to prevent infinite loops
        if (!chart || typeof chart.update !== 'function') {
            console.warn('Invalid chart object passed to updateChartDataOptimized');
            return;
        }
        
        // Check if chart is already updating to prevent recursive calls
        if (chart._isUpdating) {
            console.warn('Chart is already updating, skipping update');
            return;
        }
        
        chart._isUpdating = true;
        chart.data = newData;
        
        // Use 'none' animation mode for better performance
        chart.update('none');
        
        // Reset flag after a short delay
        setTimeout(() => {
            if (chart && chart._isUpdating) {
                chart._isUpdating = false;
            }
        }, 100);
        
    } catch (error) {
        console.error('Error updating optimized chart:', error);
        if (chart && chart._isUpdating) {
            chart._isUpdating = false;
        }
    }
}

// Create optimized market overview chart
function createOptimizedMarketOverviewChart() {
    try {
        const ctx = document.getElementById('marketOverviewChart');
        if (!ctx) return null;
        
        const data = {
            labels: ['صاعد', 'هابط', 'مستقر'],
            datasets: [{
                data: [65, 20, 15],
                backgroundColor: [
                    ChartColors.success,
                    ChartColors.danger,
                    ChartColors.warning
                ],
                borderWidth: 0
            }]
        };
        
        return new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 11 }, // Reduced font size
                            usePointStyle: true
                        }
                    }
                },
                animation: {
                    duration: 800, // Reduced duration
                    easing: 'easeOutQuart' // Simplified easing
                }
            }
        });
        
    } catch (error) {
        console.error('Error creating optimized market overview chart:', error);
        return null;
    }
}

// Create optimized volume chart
function createOptimizedVolumeChart() {
    try {
        const ctx = document.getElementById('volumeChart');
        if (!ctx) return null;
        
        const labels = generateOptimizedTimeLabels(15); // Reduced from 20
        const data = {
            labels: labels,
            datasets: [{
                label: 'حجم التداول',
                data: generateOptimizedSampleData(15, 100000, 2000000), // Reduced from 20
                backgroundColor: ChartColors.info + '30', // Reduced opacity
                borderColor: ChartColors.info,
                borderWidth: 1, // Reduced from 2
                fill: true
            }]
        };
        
        return new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                animation: {
                    duration: 800, // Reduced duration
                    easing: 'easeOutQuart' // Simplified easing
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { 
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }, // Reduced opacity
                        ticks: { 
                            callback: function(value) { 
                                return (value / 1000).toFixed(0) + 'K'; 
                            },
                            font: { size: 10 } // Reduced font size
                        } 
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('Error creating optimized volume chart:', error);
        return null;
    }
}

// Create optimized technical indicators chart
function createOptimizedTechnicalIndicatorsChart() {
    try {
        const ctx = document.getElementById('technicalChart');
        if (!ctx) return null;
        
        const labels = generateOptimizedTimeLabels(20); // Reduced from 30
        const prices = generateOptimizedSampleData(20); // Reduced from 30
        const sma20 = calculateOptimizedSMA(prices, 20);
        const sma50 = calculateOptimizedSMA(prices, 50);
        
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'السعر',
                    data: prices,
                    borderColor: ChartColors.primary,
                    backgroundColor: 'transparent',
                    borderWidth: 1, // Reduced from 2
                    fill: false,
                    tension: 0.1 // Reduced tension
                },
                {
                    label: 'المتوسط المتحرك 20',
                    data: sma20,
                    borderColor: ChartColors.success,
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    fill: false,
                    tension: 0.1 // Reduced tension
                },
                {
                    label: 'المتوسط المتحرك 50',
                    data: sma50,
                    borderColor: ChartColors.warning,
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    fill: false,
                    tension: 0.1 // Reduced tension
                }
            ]
        };
        
        return new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: 'top',
                        labels: { font: { size: 11 } } // Reduced font size
                    }
                },
                animation: {
                    duration: 800, // Reduced duration
                    easing: 'easeOutQuart' // Simplified easing
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { 
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }, // Reduced opacity
                        ticks: { 
                            callback: function(value) { 
                                return value.toLocaleString('ar-SA'); 
                            },
                            font: { size: 10 } // Reduced font size
                        } 
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('Error creating optimized technical indicators chart:', error);
        return null;
    }
}

// Optimized utility functions
function calculateOptimizedSMA(data, period) {
    try {
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
    } catch (error) {
        console.error('Error calculating optimized SMA:', error);
        return [];
    }
}

function generateOptimizedSampleData(points, min = 10000, max = 12000) {
    try {
        const data = [];
        let value = min + Math.random() * (max - min);
        
        for (let i = 0; i < points; i++) {
            value += (Math.random() - 0.5) * 200;
            data.push(Math.round(value));
        }
        
        return data;
    } catch (error) {
        console.error('Error generating optimized sample data:', error);
        return [];
    }
}

function generateOptimizedTimeLabels(points) {
    try {
        const labels = [];
        const now = new Date();
        
        for (let i = points - 1; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            labels.push(time.toLocaleTimeString('ar-SA', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }));
        }
        
        return labels;
    } catch (error) {
        console.error('Error generating optimized time labels:', error);
        return [];
    }
}

// Performance monitoring
function monitorChartPerformance(chart, chartName) {
    try {
        if (chart && typeof chart.update === 'function') {
            const startTime = performance.now();
            
            // Monitor update performance
            const originalUpdate = chart.update;
            chart.update = function(mode) {
                const updateStart = performance.now();
                const result = originalUpdate.call(this, mode);
                const updateEnd = performance.now();
                
                if (updateEnd - updateStart > 100) { // Log slow updates
                    console.warn(`Slow chart update for ${chartName}: ${(updateEnd - updateStart).toFixed(2)}ms`);
                }
                
                return result;
            };
            
            console.log(`Performance monitoring enabled for ${chartName}`);
        }
    } catch (error) {
        console.error('Error setting up performance monitoring:', error);
    }
}

// Export optimized functions
window.ChartConfig = ChartConfig;
window.ChartColors = ChartColors;
window.createOptimizedChart = createOptimizedChart;
window.updateChartDataOptimized = updateChartDataOptimized;
window.createOptimizedMarketOverviewChart = createOptimizedMarketOverviewChart;
window.createOptimizedVolumeChart = createOptimizedVolumeChart;
window.createOptimizedTechnicalIndicatorsChart = createOptimizedTechnicalIndicatorsChart;
window.monitorChartPerformance = monitorChartPerformance; 