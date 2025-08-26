// Performance Monitor for TickerChart AI
// مراقب الأداء لـ TickerChart AI

// Prevent duplicate loading with a unique flag
if (typeof window.__PERFORMANCE_MONITOR_LOADED__ === 'undefined') {
    window.__PERFORMANCE_MONITOR_LOADED__ = true;
    
    // Check if PerformanceMonitor already exists to prevent duplicate declaration
    if (typeof window.PerformanceMonitor === 'undefined') {
        // Define PerformanceMonitor class
        window.PerformanceMonitor = class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.startTime = performance.now();
        this.init();
    }

    init() {
        console.log('📊 Performance Monitor initialized');
        this.setupEventListeners();
        this.startMonitoring();
    }

    setupEventListeners() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.recordMetric('pageLoad', performance.now() - this.startTime);
            this.analyzePerformance();
        });

        // Monitor DOM content loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.recordMetric('domContentLoaded', performance.now() - this.startTime);
        });

        // Monitor first contentful paint
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.recordMetric('firstContentfulPaint', entry.startTime);
                    }
                    if (entry.name === 'largest-contentful-paint') {
                        this.recordMetric('largestContentfulPaint', entry.startTime);
                    }
                }
            });
            observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        }

        // Monitor resource loading
        this.monitorResourceLoading();

        // Monitor memory usage
        this.monitorMemoryUsage();

        // Monitor network performance
        this.monitorNetworkPerformance();
    }

    startMonitoring() {
        // Record initial metrics
        if (performance.timing) {
            this.recordMetric('navigationStart', performance.timing.navigationStart);
            this.recordMetric('domLoading', performance.timing.domLoading - performance.timing.navigationStart);
            this.recordMetric('domInteractive', performance.timing.domInteractive - performance.timing.navigationStart);
            this.recordMetric('domComplete', performance.timing.domComplete - performance.timing.navigationStart);
            this.recordMetric('loadEventEnd', performance.timing.loadEventEnd - performance.timing.navigationStart);
        }
    }

    monitorResourceLoading() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'resource') {
                        this.recordResourceMetric(entry);
                    }
                }
            });
            observer.observe({ entryTypes: ['resource'] });
        }
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                this.recordMetric('memoryUsed', performance.memory.usedJSHeapSize);
                this.recordMetric('memoryTotal', performance.memory.totalJSHeapSize);
                this.recordMetric('memoryLimit', performance.memory.jsHeapSizeLimit);
            }, 5000);
        }
    }

    monitorNetworkPerformance() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.recordMetric('connectionType', connection.effectiveType);
            this.recordMetric('connectionSpeed', connection.downlink);
            this.recordMetric('connectionRTT', connection.rtt);
        }
    }

    recordMetric(name, value) {
        this.metrics[name] = {
            value: value,
            timestamp: Date.now()
        };
    }

    recordResourceMetric(entry) {
        const resourceName = entry.name.split('/').pop();
        this.recordMetric(`resource_${resourceName}`, entry.duration);
    }

    analyzePerformance() {
        const analysis = {
            pageLoadTime: this.metrics.pageLoad?.value || 0,
            domContentLoaded: this.metrics.domContentLoaded?.value || 0,
            firstContentfulPaint: this.metrics.firstContentfulPaint?.value || 0,
            memoryUsage: this.metrics.memoryUsed?.value || 0,
            connectionType: this.metrics.connectionType?.value || 'unknown'
        };

        // Grade performance
        const grades = {
            pageLoad: this.gradePageLoad(analysis.pageLoadTime),
            memory: this.gradeMemoryUsage(analysis.memoryUsage),
            connection: this.gradeConnection(analysis.connectionType)
        };

        console.log('📊 Performance Analysis:', analysis);
        console.log('📊 Performance Grades:', grades);

        // Store for comparison
        this.storePerformanceData(analysis, grades);

        return { analysis, grades };
    }

    gradePageLoad(time) {
        if (time < 1000) return 'A+';
        if (time < 2000) return 'A';
        if (time < 3000) return 'B';
        if (time < 5000) return 'C';
        return 'D';
    }

    gradeMemoryUsage(bytes) {
        const mb = bytes / (1024 * 1024);
        if (mb < 50) return 'A+';
        if (mb < 100) return 'A';
        if (mb < 200) return 'B';
        if (mb < 500) return 'C';
        return 'D';
    }

    gradeConnection(type) {
        const grades = {
            '4g': 'A+',
            '3g': 'B',
            '2g': 'C',
            'slow-2g': 'D'
        };
        return grades[type] || 'B';
    }

    storePerformanceData(analysis, grades) {
        try {
            const storedData = JSON.parse(localStorage.getItem('tickerchart_performance') || '[]');
            storedData.push({
                timestamp: Date.now(),
                analysis: analysis,
                grades: grades
            });

            // Keep only last 10 entries
            if (storedData.length > 10) {
                storedData.splice(0, storedData.length - 10);
            }

            localStorage.setItem('tickerchart_performance', JSON.stringify(storedData));
        } catch (error) {
            console.warn('⚠️ Failed to store performance data:', error);
        }
    }

    // Performance timing methods
    start(label) {
        this.metrics[`start_${label}`] = performance.now();
    }

    end(label) {
        const startTime = this.metrics[`start_${label}`];
        if (startTime) {
            const duration = performance.now() - startTime;
            this.recordMetric(label, duration);
            console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
            delete this.metrics[`start_${label}`];
        }
    }

    // Send to custom analytics endpoint
    async sendToCustomAnalytics(analysis, grades) {
        try {
            const data = {
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                metrics: analysis,
                grades: grades,
                overallGrade: this.calculateOverallGrade(grades)
            };

            // Send to your analytics endpoint
            await fetch('/api/analytics/performance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.warn('⚠️ Failed to send analytics data:', error);
        }
    }

    getPerformanceReport() {
        return {
            metrics: this.metrics,
            analysis: this.analyzePerformance(),
            recommendations: this.getRecommendations()
        };
    }

    getRecommendations() {
        const recommendations = [];

        if (this.metrics.pageLoad?.value > 3000) {
            recommendations.push('Consider optimizing image sizes and using WebP format');
        }

        if (this.metrics.memoryUsed?.value > 100 * 1024 * 1024) { // 100MB
            recommendations.push('Memory usage is high, consider optimizing JavaScript');
        }

        if (this.metrics.connectionType?.value === 'slow-2g' || this.metrics.connectionType?.value === '2g') {
            recommendations.push('Connection is slow, consider reducing resource sizes');
        }

        return recommendations;
    }

    calculateOverallGrade(grades) {
        const gradeValues = {
            'A+': 95, 'A': 90, 'B': 80, 'C': 70, 'D': 60
        };
        
        const values = Object.values(grades).map(grade => gradeValues[grade] || 70);
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        if (average >= 90) return 'A+';
        if (average >= 80) return 'A';
        if (average >= 70) return 'B';
        if (average >= 60) return 'C';
        return 'D';
    }

    // Performance comparison with previous loads
    compareWithPrevious() {
        try {
            const storedData = JSON.parse(localStorage.getItem('tickerchart_performance') || '[]');
            if (storedData.length < 2) return null;

            const current = storedData[storedData.length - 1];
            const previous = storedData[storedData.length - 2];

            const comparison = {
                pageLoadTime: {
                    current: current.analysis.pageLoadTime,
                    previous: previous.analysis.pageLoadTime,
                    change: ((current.analysis.pageLoadTime - previous.analysis.pageLoadTime) / previous.analysis.pageLoadTime * 100).toFixed(2)
                },
                memoryUsage: {
                    current: current.analysis.memoryUsage,
                    previous: previous.analysis.memoryUsage,
                    change: ((current.analysis.memoryUsage - previous.analysis.memoryUsage) / previous.analysis.memoryUsage * 100).toFixed(2)
                }
            };

            console.log('📊 Performance Comparison:', comparison);
            return comparison;
        } catch (error) {
            console.error('❌ Failed to compare performance:', error);
            return null;
        }
    }
}

    // Initialize performance monitor instance immediately
    try {
        if (typeof window.performanceMonitor === 'undefined') {
            const performanceMonitor = new window.PerformanceMonitor();
            window.performanceMonitor = performanceMonitor;

            // Auto-comparison on page load
            window.addEventListener('load', () => {
                setTimeout(() => {
                    performanceMonitor.compareWithPrevious();
                }, 1000);
            });

            console.log('📊 Performance Monitor instance created and loaded successfully');
        }
    } catch (error) {
        console.warn('⚠️ Performance Monitor instance creation failed:', error);
    }
}

} // End of duplicate loading prevention 