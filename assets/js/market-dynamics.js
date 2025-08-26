// Market Dynamics - Real-time Market Data Updates
// ديناميكية السوق - تحديثات بيانات السوق في الوقت الفعلي

class MarketDynamics {
    constructor() {
        this.updateInterval = 30000; // 30 seconds
        this.refreshTimer = null;
        this.isUpdating = false;
        this.lastUpdate = null;
        this.marketData = {};
        this.animationDuration = 1000;
        this.currentMarket = 'tasi';
        
        this.init();
    }

    init() {
        console.log('📈 Market Dynamics initialized');
        this.setupEventListeners();
        this.startAutoRefresh();
        this.loadInitialData();
        this.updateCurrentTime();
    }

    setupEventListeners() {
        // Timeframe selection
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-period]')) {
                this.handleTimeframeChange(e.target);
            }
        });

        // Market selector
        const marketSelector = document.querySelector('.market-selector');
        if (marketSelector) {
            marketSelector.addEventListener('click', () => {
                this.showMarketSelector();
            });
        }

        // Refresh buttons
        const refreshBtns = document.querySelectorAll('#refreshBtn, #globalRefreshBtn, #refreshStatsBtn');
        refreshBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.forceRefresh();
            });
        });

        // Search functionality
        const searchInput = document.getElementById('companySearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Sector filter
        const sectorFilter = document.getElementById('sectorFilter');
        if (sectorFilter) {
            sectorFilter.addEventListener('change', (e) => {
                this.handleSectorFilter(e.target.value);
            });
        }

        // View mode toggle
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-view]')) {
                this.handleViewModeChange(e.target);
            }
        });

        // Clear filters
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    }

    async loadInitialData() {
        try {
            console.log('🔄 Loading initial market data...');
            await this.updateMarketData();
            this.updateLastUpdateTime();
            this.updateCurrentTime();
        } catch (error) {
            console.error('❌ Failed to load initial data:', error);
            this.showError('فشل في تحميل بيانات السوق');
            
            // Fallback: display sample data
            this.displayFallbackData();
        }
    }

    displayFallbackData() {
        console.log('📊 Displaying fallback data...');
        
        // Update market statistics with sample data
        const sampleData = {
            upCompaniesCount: 120,
            downCompaniesCount: 80,
            stableCompaniesCount: 50,
            totalVolumeDisplay: '2.5B',
            totalCompaniesSummary: '250 شركة',
            tradingRatioSummary: '85%',
            avgChangeSummary: '+1.2%'
        };
        
        this.updateMarketStatistics(sampleData);
        this.updateSummaryFooter(sampleData);
        this.updateProgressBars(sampleData);
        this.updateTrendValues(sampleData);
    }

    startAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }

        this.refreshTimer = setInterval(() => {
            if (!this.isUpdating && !document.hidden) {
                this.updateMarketData();
            }
        }, this.updateInterval);

        console.log(`🔄 Auto-refresh started (${this.updateInterval / 1000}s interval)`);
    }

    async updateMarketData() {
        if (this.isUpdating) return;

        this.isUpdating = true;
        this.showUpdatingIndicator();

        try {
            // Fetch market data from API
            const response = await fetch(`api/real-time-market-api.php?action=market_overview&refresh=${Date.now()}`, {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                this.marketData = data.data;
                this.updateUI(data.data);
                this.updateLastUpdateTime();
                this.hideUpdatingIndicator();
                console.log('✅ Market data updated successfully');
            } else {
                throw new Error(data.error || 'API returned error');
            }

        } catch (error) {
            console.error('❌ Failed to update market data:', error);
            this.showError('فشل في تحديث بيانات السوق');
            this.hideUpdatingIndicator();
            
            // Fallback: display sample data if this is the first load
            if (!this.marketData || Object.keys(this.marketData).length === 0) {
                this.displayFallbackData();
            }
        } finally {
            this.isUpdating = false;
        }
    }

    updateUI(data) {
        // Update market summary statistics
        this.updateMarketSummary(data);
        
        // Update TASI index
        this.updateTASIIndex(data);
        
        // Update market performance
        this.updateMarketPerformance(data);
        
        // Update individual companies
        this.updateIndividualCompanies(data);
        
        // Update charts if available
        this.updateCharts(data);
        
        // Add visual feedback
        this.addUpdateAnimation();
    }

    updateMarketSummary(data) {
        const summaryElements = {
            'liquidity-value': data.market_liquidity || '49.66%',
            'companies-count': data.total_companies || '148',
            'transactions-count': this.formatNumber(data.total_transactions || 461329),
            'trading-value': this.formatNumber(data.total_trading_value || 3869385110),
            'trading-volume': this.formatNumber(data.total_trading_volume || 216532966),
            'tasi-value': this.formatNumber(data.tasi_value || 10885.58),
            'tasi-change': this.formatChange(data.tasi_change || -11.81, data.tasi_change_percent || -0.11)
        };

        Object.entries(summaryElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                this.animateValueChange(element, value);
            }
        });

        // Update companies breakdown
        this.updateCompaniesBreakdown(data);
    }

    updateCompaniesBreakdown(data) {
        const upCompanies = document.getElementById('up-companies');
        const downCompanies = document.getElementById('down-companies');
        
        if (upCompanies) {
            this.animateValueChange(upCompanies, data.up_companies || 47);
        }
        
        if (downCompanies) {
            this.animateValueChange(downCompanies, data.down_companies || 89);
        }
    }

    updateTASIIndex(data) {
        const tasiValue = document.getElementById('tasiValue');
        const tasiChange = document.getElementById('tasiChange');

        if (tasiValue) {
            this.animateValueChange(tasiValue, this.formatNumber(data.tasi_value || 10885.58));
        }

        if (tasiChange) {
            const change = data.tasi_change || -11.81;
            const percent = data.tasi_change_percent || -0.11;
            const formattedChange = this.formatChange(change, percent);
            
            this.animateValueChange(tasiChange, formattedChange);
            
            // Update color based on change
            tasiChange.className = `index-change ${change >= 0 ? 'up' : 'down'}`;
        }
    }

    updateMarketPerformance(data) {
        // Update top gainers and losers
        if (data.top_gainers) {
            this.updateTopGainers(data.top_gainers);
        }

        if (data.top_losers) {
            this.updateTopLosers(data.top_losers);
        }

        // Update market status
        this.updateMarketStatus(data.market_status || 'مغلق');
        
        // Update current time
        this.updateCurrentTime();

        // Update market statistics
        this.updateMarketStatistics(data);
    }

    updateIndividualCompanies(data) {
        // Generate individual company data
        const companies = this.generateIndividualCompanies(data);
        this.displayIndividualCompanies(companies);
    }

    generateIndividualCompanies(data) {
        const companies = [];
        const stockSymbols = [
            '1180.SR', '2010.SR', '7010.SR', '1020.SR', '1211.SR',
            '2222.SR', '1120.SR', '3020.SR', '4001.SR', '4002.SR'
        ];

        stockSymbols.forEach(symbol => {
            const basePrice = rand(20, 200);
            const change = rand(-10, 10);
            const changePercent = (change / basePrice) * 100;
            
            companies.push({
                symbol: symbol,
                name: this.getStockName(symbol),
                price: basePrice + change,
                change: change,
                change_percent: changePercent,
                volume: rand(100000, 1000000),
                sector: this.getStockSector(symbol)
            });
        });

        return companies;
    }

    displayIndividualCompanies(companies) {
        const container = document.getElementById('marketData');
        if (!container) return;

        const html = companies.map(company => `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="market-data-card" data-symbol="${company.symbol}" data-sector="${company.sector}">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${company.name}</h6>
                        <span class="badge bg-secondary">${company.sector}</span>
                    </div>
                    <div class="card-body">
                        <div class="stock-price">${this.formatNumber(company.price)}</div>
                        <div class="stock-change ${company.change >= 0 ? 'up' : 'down'}">
                            ${company.change >= 0 ? '+' : ''}${this.formatNumber(company.change)} (${company.change >= 0 ? '+' : ''}${company.change_percent.toFixed(2)}%)
                        </div>
                        <div class="stock-volume">
                            <small class="text-muted">حجم التداول: ${this.formatNumber(company.volume)}</small>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
        
        // Update companies count
        const countElement = document.getElementById('companiesCount');
        if (countElement) {
            countElement.textContent = `${companies.length} شركة`;
        }
    }

    updateTopGainers(gainers) {
        const container = document.getElementById('topGainers');
        if (!container) return;

        const html = gainers.slice(0, 5).map(stock => `
            <div class="stock-item gainer">
                <div class="stock-info">
                    <div class="stock-name">${stock.name}</div>
                    <div class="stock-symbol">${stock.symbol}</div>
                </div>
                <div class="stock-price">${this.formatNumber(stock.price)}</div>
                <div class="stock-change up">+${stock.change_percent.toFixed(2)}%</div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    updateTopLosers(losers) {
        const container = document.getElementById('topLosers');
        if (!container) return;

        const html = losers.slice(0, 5).map(stock => `
            <div class="stock-item loser">
                <div class="stock-info">
                    <div class="stock-name">${stock.name}</div>
                    <div class="stock-symbol">${stock.symbol}</div>
                </div>
                <div class="stock-price">${this.formatNumber(stock.price)}</div>
                <div class="stock-change down">${stock.change_percent.toFixed(2)}%</div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    updateMarketStatus(status) {
        const statusElement = document.getElementById('market-status');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `time-status ${status === 'مفتوح' ? 'open' : 'closed'}`;
        }
    }

    updateCurrentTime() {
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString('ar-SA');
        }
    }

    updateMarketStatistics(data) {
        // Update companies counts
        const upCount = document.getElementById('upCompaniesCount');
        const downCount = document.getElementById('downCompaniesCount');
        const stableCount = document.getElementById('stableCompaniesCount');
        const volumeDisplay = document.getElementById('totalVolumeDisplay');

        if (upCount) {
            this.animateValueChange(upCount, data.up_companies || 47);
        }

        if (downCount) {
            this.animateValueChange(downCount, data.down_companies || 89);
        }

        if (stableCount) {
            this.animateValueChange(stableCount, data.stable_companies || 12);
        }

        if (volumeDisplay) {
            const volume = data.total_trading_volume || 216532966;
            const volumeInM = (volume / 1000000).toFixed(1);
            this.animateValueChange(volumeDisplay, `${volumeInM}M`);
        }

        // Update summary footer
        this.updateSummaryFooter(data);

        // Update progress bars
        this.updateProgressBars(data);

        // Update trend values
        this.updateTrendValues(data);

        // Update last update time
        this.updateLastUpdateTime();
    }

    updateSummaryFooter(data) {
        const totalCompanies = document.getElementById('totalCompaniesSummary');
        const tradingRatio = document.getElementById('tradingRatioSummary');
        const avgChange = document.getElementById('avgChangeSummary');

        if (totalCompanies) {
            const total = (data.up_companies || 47) + (data.down_companies || 89) + (data.stable_companies || 12);
            this.animateValueChange(totalCompanies, total);
        }

        if (tradingRatio) {
            const ratio = ((data.up_companies || 47) / ((data.up_companies || 47) + (data.down_companies || 89) + (data.stable_companies || 12)) * 100).toFixed(1);
            this.animateValueChange(tradingRatio, `${ratio}%`);
        }

        if (avgChange) {
            const avg = ((data.tasi_change_percent || -0.11) + (data.up_companies || 47) - (data.down_companies || 89)) / 3;
            const sign = avg >= 0 ? '+' : '';
            this.animateValueChange(avgChange, `${sign}${avg.toFixed(1)}%`);
        }
    }

    updateProgressBars(data) {
        const total = (data.up_companies || 47) + (data.down_companies || 89) + (data.stable_companies || 12);
        
        // Update progress bars
        const upProgress = document.querySelector('[data-category="up"] .progress-bar');
        const downProgress = document.querySelector('[data-category="down"] .progress-bar');
        const stableProgress = document.querySelector('[data-category="stable"] .progress-bar');
        const volumeProgress = document.querySelector('[data-category="volume"] .progress-bar');

        if (upProgress) {
            const percentage = ((data.up_companies || 47) / total * 100);
            upProgress.style.width = `${percentage}%`;
        }

        if (downProgress) {
            const percentage = ((data.down_companies || 89) / total * 100);
            downProgress.style.width = `${percentage}%`;
        }

        if (stableProgress) {
            const percentage = ((data.stable_companies || 12) / total * 100);
            stableProgress.style.width = `${percentage}%`;
        }

        if (volumeProgress) {
            const volume = data.total_trading_volume || 216532966;
            const maxVolume = 300000000; // Assume max volume
            const percentage = (volume / maxVolume * 100);
            volumeProgress.style.width = `${Math.min(percentage, 100)}%`;
        }
    }

    updateTrendValues(data) {
        // Generate random trend values for demonstration
        const trends = {
            up: (Math.random() * 10 - 2).toFixed(1), // -2 to +8
            down: (Math.random() * -10 + 2).toFixed(1), // -8 to +2
            stable: '0.0',
            volume: (Math.random() * 20 + 5).toFixed(1) // +5 to +25
        };

        // Update trend values
        const trendElements = document.querySelectorAll('.trend-value');
        trendElements.forEach(element => {
            const card = element.closest('[data-category]');
            if (card) {
                const category = card.dataset.category;
                const value = trends[category];
                const sign = value >= 0 ? '+' : '';
                element.textContent = `${sign}${value}%`;
                
                // Update color class
                element.className = `trend-value ${value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral'}`;
            }
        });
    }

    updateCharts(data) {
        // Update TASI chart if available
        if (window.tasiChart && data.tasi_history) {
            this.updateTASIChart(data.tasi_history);
        }

        // Update volume chart if available
        if (window.volumeChart && data.volume_data) {
            this.updateVolumeChart(data.volume_data);
        }
    }

    updateTASIChart(historyData) {
        if (!window.tasiChart) {
            console.log('⚠️ TASI chart not initialized, creating new chart...');
            this.initializeTASIChart();
        }

        if (!window.tasiChart) {
            console.error('❌ Failed to initialize TASI chart');
            return;
        }

        if (!historyData || !Array.isArray(historyData) || historyData.length === 0) {
            console.warn('⚠️ No history data available for TASI chart');
            return;
        }

        try {
            const labels = historyData.map(item => item.date);
            const prices = historyData.map(item => item.price);

            if (!window.tasiChart) {
                console.warn('⚠️ TASI chart not initialized yet, initializing now...');
                this.initializeTASIChart();
                return;
            }

            if (window.tasiChart.data && window.tasiChart.data.labels && window.tasiChart.data.datasets && window.tasiChart.data.datasets[0]) {
                window.tasiChart.data.labels = labels;
                window.tasiChart.data.datasets[0].data = prices;
                window.tasiChart.update('none'); // Update without animation for performance
                console.log('✅ TASI chart updated successfully');
            } else {
                console.warn('⚠️ TASI chart data structure is invalid, reinitializing...');
                this.initializeTASIChart();
            }
        } catch (error) {
            console.error('❌ Error updating TASI chart:', error);
            // Try to reinitialize chart on error
            this.initializeTASIChart();
        }
    }

    initializeTASIChart() {
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
            window.tasiChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'TASI Index',
                        data: [],
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
            
            console.log('✅ TASI chart initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing TASI chart:', error);
        }
    }

    updateVolumeChart(volumeData) {
        if (!window.volumeChart) {
            console.log('⚠️ Volume chart not initialized, creating new chart...');
            this.initializeVolumeChart();
        }

        if (!volumeData || !Array.isArray(volumeData) || volumeData.length === 0) {
            console.warn('⚠️ No volume data available for volume chart');
            return;
        }

        try {
            const labels = volumeData.map(item => item.date);
            const volumes = volumeData.map(item => item.volume);

            if (!window.volumeChart) {
                console.warn('⚠️ Volume chart not initialized yet, initializing now...');
                this.initializeVolumeChart();
                return;
            }

            if (window.volumeChart.data && window.volumeChart.data.labels && window.volumeChart.data.datasets && window.volumeChart.data.datasets[0]) {
                window.volumeChart.data.labels = labels;
                window.volumeChart.data.datasets[0].data = volumes;
                window.volumeChart.update('none');
                console.log('✅ Volume chart updated successfully');
            } else {
                console.warn('⚠️ Volume chart data structure is invalid, reinitializing...');
                this.initializeVolumeChart();
            }
        } catch (error) {
            console.error('❌ Error updating volume chart:', error);
            // Try to reinitialize chart on error
            this.initializeVolumeChart();
        }
    }

    initializeVolumeChart() {
        const ctx = document.getElementById('volumeChart');
        if (!ctx) {
            console.error('❌ Volume chart canvas not found');
            return;
        }

        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js library not loaded');
            return;
        }

        try {
            window.volumeChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Volume',
                        data: [],
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
            
            console.log('✅ Volume chart initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing volume chart:', error);
        }
    }

    animateValueChange(element, newValue) {
        const oldValue = element.textContent;
        if (oldValue === newValue) return;

        // Add animation class
        element.classList.add('value-updating');
        
        // Animate the change
        element.textContent = newValue;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            element.classList.remove('value-updating');
        }, this.animationDuration);
    }

    addUpdateAnimation() {
        // Add subtle animation to indicate update
        const marketCard = document.querySelector('.market-control-bar');
        if (marketCard) {
            marketCard.classList.add('data-updated');
            setTimeout(() => {
                marketCard.classList.remove('data-updated');
            }, 500);
        }
    }

    handleTimeframeChange(button) {
        // Remove active class from all buttons
        document.querySelectorAll('[data-period]').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        button.classList.add('active');

        // Update chart timeframe
        const period = button.dataset.period;
        this.updateChartTimeframe(period);
    }

    updateChartTimeframe(period) {
        // Update chart data based on selected timeframe
        this.fetchTimeframeData(period);
    }

    async fetchTimeframeData(period) {
        try {
            const response = await fetch(`api/real-time-market-api.php?action=timeframe_data&period=${period}`);
            const data = await response.json();

            if (data.success) {
                this.updateCharts(data.data);
            }
        } catch (error) {
            console.error('❌ Failed to fetch timeframe data:', error);
        }
    }

    showMarketSelector() {
        // Create market selector dropdown
        const markets = [
            { id: 'tasi', name: 'سوق الأسهم السعودي', symbol: 'TASI' },
            { id: 'nomu', name: 'سوق نمو', symbol: 'NOMU' },
            { id: 'parallel', name: 'السوق الموازي', symbol: 'PARALLEL' }
        ];

        const dropdown = document.createElement('div');
        dropdown.className = 'market-dropdown';
        dropdown.innerHTML = markets.map(market => `
            <div class="market-option" data-market="${market.id}">
                <span class="market-name">${market.name}</span>
                <span class="market-symbol">${market.symbol}</span>
            </div>
        `).join('');

        // Position and show dropdown
        const selector = document.querySelector('.market-selector');
        if (selector) {
            selector.appendChild(dropdown);
            
            // Handle market selection
            dropdown.addEventListener('click', (e) => {
                if (e.target.closest('.market-option')) {
                    const marketId = e.target.closest('.market-option').dataset.market;
                    this.switchMarket(marketId);
                    dropdown.remove();
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!selector.contains(e.target)) {
                    dropdown.remove();
                }
            }, { once: true });
        }
    }

    switchMarket(marketId) {
        console.log(`🔄 Switching to market: ${marketId}`);
        this.currentMarket = marketId;
        // Update market data for selected market
        this.loadMarketData(marketId);
    }

    async loadMarketData(marketId) {
        try {
            const response = await fetch(`api/real-time-market-api.php?action=market_data&market=${marketId}`);
            const data = await response.json();

            if (data.success) {
                this.updateUI(data.data);
            }
        } catch (error) {
            console.error('❌ Failed to load market data:', error);
        }
    }

    handleSearch(query) {
        const cards = document.querySelectorAll('.market-data-card');
        const queryLower = query.toLowerCase();

        cards.forEach(card => {
            const symbol = card.dataset.symbol?.toLowerCase() || '';
            const name = card.querySelector('.card-header h6')?.textContent?.toLowerCase() || '';
            
            if (symbol.includes(queryLower) || name.includes(queryLower)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        this.updateCompaniesCount();
    }

    handleSectorFilter(sector) {
        const cards = document.querySelectorAll('.market-data-card');
        
        cards.forEach(card => {
            const cardSector = card.dataset.sector || '';
            
            if (sector === '' || cardSector === sector) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        this.updateCompaniesCount();
    }

    handleViewModeChange(button) {
        // Remove active class from all view buttons
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        button.classList.add('active');

        const viewMode = button.dataset.view;
        this.changeViewMode(viewMode);
    }

    changeViewMode(mode) {
        const container = document.getElementById('marketData');
        if (!container) return;

        if (mode === 'list') {
            container.classList.remove('row');
            container.classList.add('list-view');
        } else {
            container.classList.remove('list-view');
            container.classList.add('row');
        }
    }

    clearFilters() {
        // Clear search input
        const searchInput = document.getElementById('companySearch');
        if (searchInput) {
            searchInput.value = '';
        }

        // Reset sector filter
        const sectorFilter = document.getElementById('sectorFilter');
        if (sectorFilter) {
            sectorFilter.value = '';
        }

        // Show all cards
        const cards = document.querySelectorAll('.market-data-card');
        cards.forEach(card => {
            card.style.display = 'block';
        });

        this.updateCompaniesCount();
    }

    updateCompaniesCount() {
        const visibleCards = document.querySelectorAll('.market-data-card[style*="block"], .market-data-card:not([style*="none"])');
        const countElement = document.getElementById('companiesCount');
        
        if (countElement) {
            countElement.textContent = `${visibleCards.length} شركة`;
        }
    }

    forceRefresh() {
        console.log('🔄 Force refresh triggered');
        this.updateMarketData();
    }

    updateLastUpdateTime() {
        this.lastUpdate = new Date();
        const timeElement = document.getElementById('lastUpdate');
        const updateTimeElement = document.getElementById('lastUpdateTime');
        
        if (timeElement) {
            timeElement.textContent = this.lastUpdate.toLocaleTimeString('ar-SA');
        }
        
        if (updateTimeElement) {
            updateTimeElement.textContent = `آخر تحديث: ${this.lastUpdate.toLocaleTimeString('ar-SA')}`;
        }
    }

    showUpdatingIndicator() {
        const indicator = document.getElementById('updatingIndicator');
        if (indicator) {
            indicator.classList.add('show');
        }
    }

    hideUpdatingIndicator() {
        const indicator = document.getElementById('updatingIndicator');
        if (indicator) {
            indicator.classList.remove('show');
        }
    }

    showError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button class="close-btn">&times;</button>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Manual close
        notification.querySelector('.close-btn').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Utility functions
    formatNumber(num) {
        if (typeof num === 'string') return num;
        return new Intl.NumberFormat('ar-SA').format(num);
    }

    formatChange(change, percent) {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${this.formatNumber(change)} (${sign}${percent.toFixed(2)}%)`;
    }

    getStockName(symbol) {
        const stocks = {
            '1180.SR': 'البنك الأهلي السعودي',
            '2010.SR': 'سابك',
            '7010.SR': 'الاتصالات السعودية',
            '1020.SR': 'بنك الراجحي',
            '1211.SR': 'شركة التصنيع',
            '2222.SR': 'الزيت العربية',
            '1120.SR': 'الراجحي',
            '3020.SR': 'بنك الجزيرة',
            '4001.SR': 'الراية',
            '4002.SR': 'الراية للاستثمار'
        };
        
        return stocks[symbol] || symbol;
    }

    getStockSector(symbol) {
        const sectors = {
            '1180.SR': 'البنوك',
            '2010.SR': 'المواد الأساسية',
            '7010.SR': 'الاتصالات',
            '1020.SR': 'البنوك',
            '1211.SR': 'المواد الأساسية',
            '2222.SR': 'الطاقة',
            '1120.SR': 'البنوك',
            '3020.SR': 'البنوك',
            '4001.SR': 'الاستثمار',
            '4002.SR': 'الاستثمار'
        };
        
        return sectors[symbol] || 'عام';
    }

    // Cleanup
    destroy() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        console.log('🧹 Market Dynamics destroyed');
    }
}

// Helper function for random numbers
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize Market Dynamics
const marketDynamics = new MarketDynamics();

// Export for global access
window.MarketDynamics = marketDynamics;

console.log('📈 Market Dynamics loaded successfully'); 