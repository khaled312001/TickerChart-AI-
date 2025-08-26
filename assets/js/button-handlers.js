/**
 * Button Handlers for Saudi Stock Market Interface
 * Handles all interactive buttons and controls
 */

class ButtonHandlers {
    constructor() {
        this.currentView = 'grid';
        this.currentSector = '';
        this.searchQuery = '';
        this.autoRefresh = true;
        this.refreshInterval = null;
        
        this.init();
    }
    
    init() {
        console.log('🔧 Initializing Button Handlers...');
        this.setupEventListeners();
        this.setupAutoRefresh();
        this.setupTooltips();
        console.log('✅ Button handlers initialized');
    }
    
    setupEventListeners() {
        // Chart timeframe buttons
        this.setupChartControls();
        
        // View toggle buttons (grid/list)
        this.setupViewToggle();
        
        // Search functionality
        this.setupSearch();
        
        // Sector filter
        this.setupSectorFilter();
        
        // Refresh buttons
        this.setupRefreshButtons();
        
        // Clear filters button
        this.setupClearFilters();
        
        // Auto refresh toggle
        this.setupAutoRefreshToggle();
        
        // Chart tools (fullscreen, download, refresh)
        this.setupChartTools();
    }
    
    setupChartControls() {
        const timeframeButtons = document.querySelectorAll('[data-period]');
        timeframeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all buttons
                timeframeButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const period = button.getAttribute('data-period');
                this.updateChartPeriod(period);
            });
        });
        
        console.log(`✅ Setup ${timeframeButtons.length} chart timeframe buttons`);
    }
    
    setupViewToggle() {
        const viewButtons = document.querySelectorAll('[data-view]');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all buttons
                viewButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const view = button.getAttribute('data-view');
                this.switchView(view);
            });
        });
        
        console.log(`✅ Setup ${viewButtons.length} view toggle buttons`);
    }
    
    setupSearch() {
        const searchInput = document.getElementById('companySearch');
        if (searchInput) {
            // Debounced search
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchQuery = e.target.value.trim();
                    this.applyFilters();
                }, 300);
            });
            
            // Clear search on Escape
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.target.value = '';
                    this.searchQuery = '';
                    this.applyFilters();
                }
            });
            
            console.log('✅ Setup search functionality');
        }
    }
    
    setupSectorFilter() {
        const sectorFilter = document.getElementById('sectorFilter');
        if (sectorFilter) {
            sectorFilter.addEventListener('change', (e) => {
                this.currentSector = e.target.value;
                this.applyFilters();
            });
            
            console.log('✅ Setup sector filter');
        }
    }
    
    setupRefreshButtons() {
        // Main refresh button
        const refreshBtn = document.getElementById('refresh-market-data');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.refreshMarketData();
            });
        }
        
        // Chart refresh button
        const chartRefreshBtn = document.getElementById('refreshBtn');
        if (chartRefreshBtn) {
            chartRefreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.refreshChart();
            });
        }
        
        // Statistics refresh button
        const statsRefreshBtn = document.getElementById('refreshStatsBtn');
        if (statsRefreshBtn) {
            statsRefreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.refreshStatistics();
            });
        }
        
        console.log('✅ Setup refresh buttons');
    }
    
    setupClearFilters() {
        const clearBtn = document.getElementById('clearFiltersBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearAllFilters();
            });
            
            console.log('✅ Setup clear filters button');
        }
    }
    
    setupAutoRefreshToggle() {
        const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
        if (autoRefreshToggle) {
            autoRefreshToggle.addEventListener('change', (e) => {
                this.autoRefresh = e.target.checked;
                if (this.autoRefresh) {
                    this.startAutoRefresh();
                } else {
                    this.stopAutoRefresh();
                }
            });
            
            console.log('✅ Setup auto refresh toggle');
        }
    }
    
    setupChartTools() {
        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFullscreen();
            });
        }
        
        // Download button
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadChart();
            });
        }
        
        console.log('✅ Setup chart tools');
    }
    
    setupTooltips() {
        // Initialize Bootstrap tooltips
        if (window.bootstrap && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
            
            console.log(`✅ Setup ${tooltipTriggerList.length} tooltips`);
        }
    }
    
    // Chart period update
    updateChartPeriod(period) {
        console.log(`📊 Updating chart period to: ${period}`);
        
        // Show loading state
        this.showButtonLoading(document.querySelector(`[data-period="${period}"]`));
        
        // Update chart data based on period
        if (window.liveMarketData) {
            window.liveMarketData.updateChartPeriod(period);
        }
        
        // Update TASI chart if available
        this.updateTASIChart(period);
        
        // Hide loading state
        setTimeout(() => {
            this.hideButtonLoading(document.querySelector(`[data-period="${period}"]`));
        }, 1000);
    }
    
    // View switching (grid/list)
    switchView(view) {
        console.log(`👁️ Switching view to: ${view}`);
        this.currentView = view;
        
        const companiesTable = document.getElementById('live-companies-table');
        if (companiesTable) {
            companiesTable.className = `companies-${view}`;
            
            // Add visual feedback
            this.showNotification(`تم التبديل إلى العرض ${view === 'grid' ? 'الشبكي' : 'القائمة'}`, 'info');
        }
        
        // Re-render companies with new view
        if (window.liveMarketData) {
            window.liveMarketData.renderCompaniesView(view);
        }
    }
    
    // Apply filters
    applyFilters() {
        console.log(`🔍 Applying filters - Sector: ${this.currentSector}, Search: ${this.searchQuery}`);
        
        const companies = document.querySelectorAll('.company-item, .company-row');
        let visibleCount = 0;
        
        companies.forEach(company => {
            const companyName = company.getAttribute('data-name') || '';
            const companySymbol = company.getAttribute('data-symbol') || '';
            const companySector = company.getAttribute('data-sector') || '';
            
            let visible = true;
            
            // Apply sector filter
            if (this.currentSector && companySector !== this.currentSector) {
                visible = false;
            }
            
            // Apply search filter
            if (this.searchQuery) {
                const searchLower = this.searchQuery.toLowerCase();
                const nameMatch = companyName.toLowerCase().includes(searchLower);
                const symbolMatch = companySymbol.toLowerCase().includes(searchLower);
                
                if (!nameMatch && !symbolMatch) {
                    visible = false;
                }
            }
            
            // Show/hide company
            company.style.display = visible ? 'block' : 'none';
            if (visible) visibleCount++;
        });
        
        // Update counter
        this.updateCompaniesCounter(visibleCount);
    }
    
    // Clear all filters
    clearAllFilters() {
        console.log('🧹 Clearing all filters');
        
        // Reset sector filter
        const sectorFilter = document.getElementById('sectorFilter');
        if (sectorFilter) {
            sectorFilter.value = '';
        }
        
        // Reset search
        const searchInput = document.getElementById('companySearch');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset internal state
        this.currentSector = '';
        this.searchQuery = '';
        
        // Reapply filters (will show all)
        this.applyFilters();
        
        this.showNotification('تم إعادة تعيين جميع المرشحات', 'success');
    }
    
    // Refresh market data
    async refreshMarketData() {
        console.log('🔄 Refreshing market data...');
        
        const refreshBtn = document.getElementById('refresh-market-data');
        this.showButtonLoading(refreshBtn);
        
        try {
            if (window.liveMarketData) {
                await window.liveMarketData.loadLiveData();
                this.showNotification('تم تحديث البيانات بنجاح', 'success');
            } else {
                throw new Error('Live market data handler not available');
            }
        } catch (error) {
            console.error('❌ Error refreshing market data:', error);
            this.showNotification('فشل في تحديث البيانات', 'error');
        } finally {
            this.hideButtonLoading(refreshBtn);
        }
    }
    
    // Refresh chart
    refreshChart() {
        console.log('📊 Refreshing chart...');
        
        const refreshBtn = document.getElementById('refreshBtn');
        this.showButtonLoading(refreshBtn);
        
        // Simulate chart refresh
        setTimeout(() => {
            this.hideButtonLoading(refreshBtn);
            this.showNotification('تم تحديث الرسم البياني', 'success');
        }, 1500);
    }
    
    // Refresh statistics
    refreshStatistics() {
        console.log('📈 Refreshing statistics...');
        
        const refreshBtn = document.getElementById('refreshStatsBtn');
        this.showButtonLoading(refreshBtn);
        
        // Simulate statistics refresh
        setTimeout(() => {
            this.hideButtonLoading(refreshBtn);
            this.showNotification('تم تحديث الإحصائيات', 'success');
        }, 1000);
    }
    
    // Auto refresh functionality
    setupAutoRefresh() {
        if (this.autoRefresh) {
            this.startAutoRefresh();
        }
    }
    
    startAutoRefresh() {
        this.stopAutoRefresh(); // Clear existing interval
        
        this.refreshInterval = setInterval(() => {
            if (this.autoRefresh && window.liveMarketData) {
                console.log('⏰ Auto refreshing market data...');
                window.liveMarketData.loadLiveData();
            }
        }, 60000); // Refresh every minute
        
        console.log('✅ Auto refresh started');
    }
    
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
            console.log('⏹️ Auto refresh stopped');
        }
    }
    
    // Chart tools
    toggleFullscreen() {
        const chartContainer = document.querySelector('.main-chart-container');
        if (!chartContainer) return;
        
        if (!document.fullscreenElement) {
            chartContainer.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
                this.showNotification('فشل في تفعيل وضع ملء الشاشة', 'error');
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    downloadChart() {
        console.log('💾 Downloading chart...');
        
        // Get chart canvas
        const canvas = document.getElementById('tasiChart');
        if (canvas) {
            const link = document.createElement('a');
            link.download = `TASI_Chart_${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL();
            link.click();
            
            this.showNotification('تم تحميل الرسم البياني', 'success');
        } else {
            this.showNotification('فشل في تحميل الرسم البياني', 'error');
        }
    }
    
    // Update TASI chart based on period
    updateTASIChart(period) {
        // This would integrate with your chart library
        console.log(`📊 Updating TASI chart for period: ${period}`);
        
        // Simulate chart update
        const canvas = document.getElementById('tasiChart');
        if (canvas && window.Chart) {
            // Update chart data based on period
            // This would be implemented based on your chart setup
        }
    }
    
    // Update companies counter
    updateCompaniesCounter(count) {
        const counter = document.getElementById('companiesCount');
        if (counter) {
            counter.textContent = `${count} شركة`;
        }
    }
    
    // Button loading states
    showButtonLoading(button) {
        if (!button) return;
        
        const icon = button.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-spinner fa-spin';
        }
        button.disabled = true;
    }
    
    hideButtonLoading(button) {
        if (!button) return;
        
        const icon = button.querySelector('i');
        if (icon) {
            // Restore original icon based on button type
            if (button.id === 'refresh-market-data') {
                icon.className = 'fas fa-sync-alt me-2';
            } else if (button.id === 'refreshBtn' || button.id === 'refreshStatsBtn') {
                icon.className = 'fas fa-sync-alt';
            }
        }
        button.disabled = false;
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize button handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.buttonHandlers = new ButtonHandlers();
});

// Export for use in other scripts
window.ButtonHandlers = ButtonHandlers; 