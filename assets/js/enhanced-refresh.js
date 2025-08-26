/**
 * Enhanced Auto-Refresh System with Timer and Animations
 * Provides smooth updates with visual feedback
 */

class EnhancedRefreshSystem {
    constructor() {
        this.refreshInterval = 30; // 30 seconds
        this.currentCountdown = this.refreshInterval;
        this.timerInterval = null;
        this.refreshTimeout = null;
        this.isActive = true;
        this.lastData = {};
        
        this.init();
    }
    
    init() {
        console.log('🔄 Initializing Enhanced Refresh System...');
        this.createTimerDisplay();
        this.setupEventListeners();
        this.startTimer();
        console.log('✅ Enhanced refresh system initialized');
    }
    
    createTimerDisplay() {
        // Find or create timer container
        let timerContainer = document.getElementById('refresh-timer-container');
        if (!timerContainer) {
            timerContainer = document.createElement('div');
            timerContainer.id = 'refresh-timer-container';
            timerContainer.className = 'text-center mb-3';
            
            // Insert after market overview
            const marketOverview = document.querySelector('.live-market-section');
            if (marketOverview) {
                marketOverview.insertBefore(timerContainer, marketOverview.firstChild);
            }
        }
        
        timerContainer.innerHTML = `
            <div class="refresh-timer">
                <div class="timer-icon"></div>
                <span class="timer-text">التحديث التالي خلال: <span id="countdown">${this.refreshInterval}</span> ثانية</span>
                <button class="btn btn-sm btn-outline-primary ms-2" id="manual-refresh-btn">
                    <i class="fas fa-sync-alt me-1"></i>تحديث الآن
                </button>
            </div>
        `;
        
        // Setup manual refresh button
        document.getElementById('manual-refresh-btn').addEventListener('click', () => {
            this.manualRefresh();
        });
    }
    
    setupEventListeners() {
        // Listen for auto-refresh toggle
        const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
        if (autoRefreshToggle) {
            autoRefreshToggle.addEventListener('change', (e) => {
                this.isActive = e.target.checked;
                if (this.isActive) {
                    this.startTimer();
                } else {
                    this.stopTimer();
                }
            });
        }
        
        // Listen for visibility changes (pause when tab is not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseTimer();
            } else {
                this.resumeTimer();
            }
        });
    }
    
    startTimer() {
        if (!this.isActive) return;
        
        this.stopTimer(); // Clear existing timer
        this.currentCountdown = this.refreshInterval;
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.currentCountdown--;
            this.updateTimerDisplay();
            
            if (this.currentCountdown <= 0) {
                this.performRefresh();
                this.currentCountdown = this.refreshInterval;
            }
        }, 1000);
        
        console.log('⏰ Auto-refresh timer started');
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
            this.refreshTimeout = null;
        }
        
        console.log('⏹️ Auto-refresh timer stopped');
    }
    
    pauseTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        console.log('⏸️ Timer paused (tab hidden)');
    }
    
    resumeTimer() {
        if (this.isActive && !this.timerInterval) {
            this.startTimer();
            console.log('▶️ Timer resumed (tab visible)');
        }
    }
    
    updateTimerDisplay() {
        const countdownEl = document.getElementById('countdown');
        if (countdownEl) {
            countdownEl.textContent = this.currentCountdown;
            
            // Add urgency styling for last 5 seconds
            const timerEl = document.querySelector('.refresh-timer');
            if (this.currentCountdown <= 5) {
                timerEl.classList.add('urgent');
            } else {
                timerEl.classList.remove('urgent');
            }
        }
    }
    
    async manualRefresh() {
        console.log('🔄 Manual refresh triggered');
        this.stopTimer();
        await this.performRefresh();
        this.startTimer();
    }
    
    async performRefresh() {
        try {
            console.log('🔄 Performing automatic refresh...');
            
            // Show loading state
            this.showLoadingState();
            
            // Refresh market data
            if (window.liveMarketData) {
                const newData = await window.liveMarketData.loadLiveData();
                this.animateDataChanges(newData);
            }
            
            // Update last refresh time
            this.updateLastRefreshTime();
            
        } catch (error) {
            console.error('❌ Error during auto-refresh:', error);
        } finally {
            this.hideLoadingState();
        }
    }
    
    showLoadingState() {
        // Add loading class to all stat cards
        document.querySelectorAll('.stat-card-enhanced').forEach(card => {
            card.classList.add('loading');
        });
        
        // Show loading in timer
        const timerIcon = document.querySelector('.timer-icon');
        if (timerIcon) {
            timerIcon.style.animation = 'spin 1s linear infinite';
        }
    }
    
    hideLoadingState() {
        // Remove loading class from stat cards
        document.querySelectorAll('.stat-card-enhanced').forEach(card => {
            card.classList.remove('loading');
        });
        
        // Reset timer icon
        const timerIcon = document.querySelector('.timer-icon');
        if (timerIcon) {
            timerIcon.style.animation = '';
        }
    }
    
    animateDataChanges(newData) {
        if (!newData || !newData.summary) return;
        
        // Animate number changes
        this.animateNumberChange('total-companies', newData.summary.total_companies);
        this.animateNumberChange('companies-up', newData.summary.companies_up);
        this.animateNumberChange('companies-down', newData.summary.companies_down);
        this.animateNumberChange('total-market-cap', newData.summary.total_market_cap);
        this.animateNumberChange('total-volume', newData.summary.total_volume);
        
        // Add update animation to cards
        document.querySelectorAll('.stat-card-enhanced').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('updating');
                setTimeout(() => {
                    card.classList.remove('updating');
                }, 1500);
            }, index * 100);
        });
    }
    
    animateNumberChange(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const oldValue = element.textContent;
        if (oldValue === newValue) return;
        
        // Add animation class
        element.classList.add('animating');
        
        // Update value
        element.textContent = newValue;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            element.classList.remove('animating');
        }, 800);
    }
    
    updateLastRefreshTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Update all last update time elements
        document.querySelectorAll('#last-update-time, .last-update').forEach(el => {
            el.textContent = `آخر تحديث: ${timeString}`;
        });
        
        // Update live status
        const liveStatus = document.querySelector('.live-status');
        if (liveStatus) {
            liveStatus.innerHTML = `
                <div class="live-dot"></div>
                مباشر - ${timeString}
            `;
        }
    }
    
    // Method to change refresh interval
    setRefreshInterval(seconds) {
        this.refreshInterval = seconds;
        this.currentCountdown = seconds;
        
        if (this.isActive) {
            this.startTimer();
        }
        
        console.log(`⏰ Refresh interval changed to ${seconds} seconds`);
    }
    
    // Get current status
    getStatus() {
        return {
            isActive: this.isActive,
            refreshInterval: this.refreshInterval,
            currentCountdown: this.currentCountdown,
            nextRefresh: new Date(Date.now() + (this.currentCountdown * 1000))
        };
    }
}

// Enhanced Market Data Renderer
class EnhancedMarketRenderer {
    constructor() {
        this.animationQueue = [];
        this.isAnimating = false;
    }
    
    renderEnhancedMarketOverview(data) {
        if (!data || !data.summary) return;
        
        const container = this.createOrUpdateContainer();
        const summary = data.summary;
        
        container.innerHTML = `
            <div class="market-overview-enhanced">
                <div class="market-status-badge ${data.market_status === 'مفتوح' ? 'open' : 'closed'}">
                    ${data.market_status}
                </div>
                
                <div class="live-status">
                    <div class="live-dot"></div>
                    مباشر - ${new Date().toLocaleTimeString('ar-SA')}
                </div>
                
                <h2 class="market-title-enhanced">السوق السعودي للأسهم</h2>
                <p class="market-subtitle-enhanced">بيانات مباشرة ومحدثة لحظياً</p>
                
                <div class="market-stats-grid">
                    ${this.createStatCard('إجمالي الشركات', summary.total_companies, 'fas fa-building', 'companies', 'total-companies')}
                    ${this.createStatCard('مرتفعة', summary.companies_up, 'fas fa-arrow-up', 'up', 'companies-up', this.getTrend(summary.companies_up, 'up'))}
                    ${this.createStatCard('منخفضة', summary.companies_down, 'fas fa-arrow-down', 'down', 'companies-down', this.getTrend(summary.companies_down, 'down'))}
                    ${this.createStatCard('حجم التداول', summary.total_volume, 'fas fa-chart-bar', 'volume', 'total-volume')}
                    ${this.createStatCard('القيمة السوقية', summary.total_market_cap, 'fas fa-coins', 'market-cap', 'total-market-cap')}
                </div>
            </div>
        `;
        
        // Add fade-in animation to cards
        setTimeout(() => {
            container.querySelectorAll('.stat-card-enhanced').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 100);
            });
        }, 100);
    }
    
    createOrUpdateContainer() {
        let container = document.getElementById('enhanced-market-overview');
        if (!container) {
            container = document.createElement('div');
            container.id = 'enhanced-market-overview';
            
            // Insert at the beginning of live market section
            const liveSection = document.querySelector('.live-market-section');
            if (liveSection) {
                liveSection.insertBefore(container, liveSection.firstChild);
            }
        }
        return container;
    }
    
    createStatCard(label, value, icon, type, id, trend = null) {
        return `
            <div class="stat-card-enhanced fade-in" data-type="${type}">
                <div class="stat-icon-enhanced ${type}">
                    <i class="${icon}"></i>
                </div>
                <div class="stat-number-enhanced" id="${id}">${value}</div>
                <div class="stat-label-enhanced">${label}</div>
                ${trend ? `<div class="stat-trend">${trend}</div>` : ''}
            </div>
        `;
    }
    
    getTrend(value, type) {
        // Generate trend indicators (this would be based on historical data)
        const trends = {
            'up': { class: 'positive', icon: 'fas fa-trending-up', text: '+2.3%' },
            'down': { class: 'negative', icon: 'fas fa-trending-down', text: '-1.8%' }
        };
        
        const trend = trends[type];
        if (!trend) return '';
        
        return `
            <div class="trend-indicator ${trend.class}">
                <i class="${trend.icon}"></i>
                <span>${trend.text}</span>
            </div>
        `;
    }
}

// Initialize enhanced systems when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize enhanced refresh system
    window.enhancedRefresh = new EnhancedRefreshSystem();
    window.enhancedRenderer = new EnhancedMarketRenderer();
    
    // Integrate with existing live market data
    if (window.liveMarketData) {
        const originalDisplayMarketData = window.liveMarketData.displayMarketData;
        window.liveMarketData.displayMarketData = function(data) {
            // Call original method
            originalDisplayMarketData.call(this, data);
            
            // Also render enhanced overview
            window.enhancedRenderer.renderEnhancedMarketOverview(data);
        };
    }
    
    console.log('✅ Enhanced refresh and rendering systems initialized');
});

// Export for global access
window.EnhancedRefreshSystem = EnhancedRefreshSystem;
window.EnhancedMarketRenderer = EnhancedMarketRenderer; 