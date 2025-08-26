// Live Market Data Handler - Real-time Saudi Stock Market Statistics
// معالج البيانات المباشرة - إحصائيات سوق الأسهم السعودي المباشرة

class LiveMarketData {
    constructor() {
        this.apiEndpoint = 'api/live_market_data.php';
        this.refreshInterval = null;
        this.refreshRate = 60000; // 1 minute
        this.isLoading = false;
        this.lastUpdate = null;
        
        this.init();
    }
    
    init() {
        console.log('🔄 Initializing Live Market Data...');
        this.loadLiveData();
        this.startAutoRefresh();
        this.setupEventListeners();
        this.initializeStockAnalyzer(); // Add this line
    }
    
    // Add this new method
    initializeStockAnalyzer() {
        // Setup analyze button functionality
        const analyzeBtn = document.querySelector('[data-action="analyzeSelectedStock"]');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.analyzeSelectedStock();
            });
        }
        
        // Also handle direct function calls
        window.analyzeSelectedStock = () => {
            this.analyzeSelectedStock();
        };
        
        console.log('✅ Stock analyzer initialized');
    }
    
    // Add this method to handle stock analysis
    analyzeSelectedStock() {
        const selector = document.getElementById('stockAnalyzerSelect');
        if (!selector || !selector.value) {
            this.showError('يرجى اختيار سهم للتحليل');
            return;
        }
        
        const selectedSymbol = selector.value;
        const selectedText = selector.options[selector.selectedIndex].text;
        
        console.log(`🔍 Analyzing stock: ${selectedSymbol} (${selectedText})`);
        this.performStockAnalysis(selectedSymbol, selectedText);
    }
    
    // Add comprehensive stock analysis
    async performStockAnalysis(symbol, stockName) {
        try {
            this.showLoadingIndicator();
            
            // Get real-time company data
            const response = await fetch(`${this.apiEndpoint}?action=company_details&symbol=${symbol}&t=${Date.now()}`);
            const data = await response.json();
            
            if (data.success) {
                this.displayAdvancedStockAnalysis(data, stockName);
            } else {
                throw new Error(data.error || 'فشل في تحليل السهم');
            }
        } catch (error) {
            console.error('❌ Error analyzing stock:', error);
            this.showError('فشل في تحليل السهم: ' + error.message);
        } finally {
            this.hideLoadingIndicator();
        }
    }
    
    // Add advanced stock analysis display
    displayAdvancedStockAnalysis(data, stockName) {
        const company = data.company_details;
        const changeClass = company.change_percent > 0 ? 'text-success' : 
                           company.change_percent < 0 ? 'text-danger' : 'text-muted';
        
        // Generate AI-powered insights
        const insights = this.generateAIInsights(company);
        const recommendations = this.generateRecommendations(company);
        const riskAnalysis = this.analyzeRisk(company);
        
        const modalHtml = `
            <div class="modal fade" id="stockAnalysisModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="fas fa-chart-line me-2"></i>
                                تحليل شامل للسهم: ${stockName}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <!-- Current Price & Performance -->
                                <div class="col-lg-4 mb-4">
                                    <div class="card h-100 border-primary">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0"><i class="fas fa-dollar-sign me-2"></i>الأداء الحالي</h6>
                                        </div>
                                        <div class="card-body text-center">
                                            <div class="display-4 fw-bold ${changeClass} mb-2">
                                                ${company.closing_price.toFixed(2)} <small>ر.س</small>
                                            </div>
                                            <div class="${changeClass} fs-5 mb-3">
                                                ${company.change >= 0 ? '+' : ''}${company.change.toFixed(2)} 
                                                (${company.change_percent >= 0 ? '+' : ''}${company.change_percent.toFixed(2)}%)
                                            </div>
                                            <div class="row text-start">
                                                <div class="col-6">
                                                    <small class="text-muted">أعلى سعر:</small>
                                                    <div class="fw-bold">${company.high.toFixed(2)}</div>
                                                </div>
                                                <div class="col-6">
                                                    <small class="text-muted">أقل سعر:</small>
                                                    <div class="fw-bold">${company.low.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Company Fundamentals -->
                                <div class="col-lg-4 mb-4">
                                    <div class="card h-100 border-info">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0"><i class="fas fa-building me-2"></i>الأساسيات المالية</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <small class="text-muted">القيمة السوقية:</small>
                                                <div class="fw-bold text-primary fs-5">${company.formatted_market_cap}</div>
                                            </div>
                                            <div class="mb-3">
                                                <small class="text-muted">الأسهم المصدرة:</small>
                                                <div class="fw-bold">${this.formatNumber(company.shares_issued)}</div>
                                            </div>
                                            <div class="mb-3">
                                                <small class="text-muted">حجم التداول اليومي:</small>
                                                <div class="fw-bold">${company.formatted_volume}</div>
                                            </div>
                                            <div class="mb-3">
                                                <small class="text-muted">قيمة التداول:</small>
                                                <div class="fw-bold">${company.formatted_value}</div>
                                            </div>
                                            <div class="mb-3">
                                                <small class="text-muted">القطاع:</small>
                                                <div><span class="badge bg-secondary">${company.sector}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- AI Analysis -->
                                <div class="col-lg-4 mb-4">
                                    <div class="card h-100 border-warning">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0"><i class="fas fa-robot me-2"></i>تحليل الذكاء الاصطناعي</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <small class="text-muted">التقييم العام:</small>
                                                <div class="fw-bold ${insights.rating === 'إيجابي' ? 'text-success' : insights.rating === 'سلبي' ? 'text-danger' : 'text-warning'}">
                                                    ${insights.rating}
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <small class="text-muted">مستوى المخاطر:</small>
                                                <div class="fw-bold ${riskAnalysis.level === 'منخفض' ? 'text-success' : riskAnalysis.level === 'عالي' ? 'text-danger' : 'text-warning'}">
                                                    ${riskAnalysis.level}
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <small class="text-muted">التوصية:</small>
                                                <div class="fw-bold ${recommendations.action === 'شراء' ? 'text-success' : recommendations.action === 'بيع' ? 'text-danger' : 'text-info'}">
                                                    ${recommendations.action}
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <small class="text-muted">درجة الثقة:</small>
                                                <div class="fw-bold">${insights.confidence}%</div>
                                                <div class="progress mt-1" style="height: 5px;">
                                                    <div class="progress-bar" style="width: ${insights.confidence}%"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Detailed Analysis -->
                            <div class="row">
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="fas fa-lightbulb me-2"></i>التحليل التفصيلي والتوصيات</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <h6 class="text-primary">نقاط القوة:</h6>
                                                    <ul class="list-unstyled">
                                                        ${insights.strengths.map(strength => `<li><i class="fas fa-check-circle text-success me-2"></i>${strength}</li>`).join('')}
                                                    </ul>
                                                </div>
                                                <div class="col-md-6">
                                                    <h6 class="text-danger">نقاط الضعف:</h6>
                                                    <ul class="list-unstyled">
                                                        ${insights.weaknesses.map(weakness => `<li><i class="fas fa-exclamation-circle text-warning me-2"></i>${weakness}</li>`).join('')}
                                                    </ul>
                                                </div>
                                            </div>
                                            
                                            <div class="mt-4">
                                                <h6 class="text-info">التوصيات الاستثمارية:</h6>
                                                <div class="alert alert-info">
                                                    <ul class="mb-0">
                                                        ${recommendations.details.map(rec => `<li>${rec}</li>`).join('')}
                                                    </ul>
                                                </div>
                                            </div>
                                            
                                            <div class="mt-3">
                                                <h6 class="text-warning">تحليل المخاطر:</h6>
                                                <div class="alert alert-warning">
                                                    <p class="mb-2"><strong>مستوى المخاطر:</strong> ${riskAnalysis.level}</p>
                                                    <p class="mb-0"><strong>التفسير:</strong> ${riskAnalysis.explanation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                            <button type="button" class="btn btn-primary" onclick="liveMarketData.refreshCompanyData('${data.symbol}')">
                                <i class="fas fa-sync-alt me-2"></i>تحديث التحليل
                            </button>
                            <button type="button" class="btn btn-success" onclick="liveMarketData.exportAnalysis('${data.symbol}')">
                                <i class="fas fa-download me-2"></i>تصدير التقرير
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        const existingModal = document.getElementById('stockAnalysisModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('stockAnalysisModal'));
        modal.show();
    }
    
    // Generate AI-powered insights
    generateAIInsights(company) {
        const changePercent = company.change_percent;
        const marketCap = company.market_cap;
        const volume = company.volume;
        
        // AI-based rating logic
        let rating = 'محايد';
        let confidence = 75;
        
        if (changePercent > 2) {
            rating = 'إيجابي';
            confidence = Math.min(85 + changePercent, 95);
        } else if (changePercent < -2) {
            rating = 'سلبي';
            confidence = Math.min(85 + Math.abs(changePercent), 95);
        }
        
        // Generate strengths and weaknesses
        const strengths = [];
        const weaknesses = [];
        
        if (marketCap > 50000000000) {
            strengths.push('شركة كبيرة بقيمة سوقية عالية');
        }
        if (changePercent > 1) {
            strengths.push('أداء إيجابي في الجلسة الحالية');
        }
        if (volume > 5000000) {
            strengths.push('حجم تداول عالي يدل على اهتمام المستثمرين');
        }
        if (company.sector === 'البنوك') {
            strengths.push('ينتمي لقطاع البنوك المستقر');
        }
        
        if (changePercent < -1) {
            weaknesses.push('أداء سلبي في الجلسة الحالية');
        }
        if (volume < 1000000) {
            weaknesses.push('حجم تداول منخفض');
        }
        if (marketCap < 5000000000) {
            weaknesses.push('قيمة سوقية صغيرة نسبياً');
        }
        
        // Add default items if lists are empty
        if (strengths.length === 0) {
            strengths.push('شركة مدرجة في السوق السعودي الرئيسي');
        }
        if (weaknesses.length === 0) {
            weaknesses.push('تحتاج لمتابعة الأداء على المدى الطويل');
        }
        
        return {
            rating,
            confidence,
            strengths,
            weaknesses
        };
    }
    
    // Generate investment recommendations
    generateRecommendations(company) {
        const changePercent = company.change_percent;
        const marketCap = company.market_cap;
        
        let action = 'انتظار';
        const details = [];
        
        if (changePercent > 3 && marketCap > 10000000000) {
            action = 'شراء';
            details.push('الأداء الإيجابي والقيمة السوقية الكبيرة تدعم قرار الشراء');
            details.push('يُنصح بالشراء على دفعات لتقليل المخاطر');
        } else if (changePercent < -3) {
            action = 'بيع جزئي';
            details.push('الأداء السلبي يستدعي إعادة تقييم المركز');
            details.push('يمكن الاحتفاظ بجزء للمدى الطويل');
        } else {
            action = 'انتظار';
            details.push('الأداء الحالي لا يستدعي إجراءات عاجلة');
            details.push('يُنصح بمتابعة الأداء وأخبار الشركة');
        }
        
        details.push('هذه التوصيات للأغراض التعليمية فقط وليست نصائح مالية');
        
        return {
            action,
            details
        };
    }
    
    // Analyze risk level
    analyzeRisk(company) {
        const changePercent = Math.abs(company.change_percent);
        const marketCap = company.market_cap;
        
        let level = 'متوسط';
        let explanation = '';
        
        if (changePercent > 5) {
            level = 'عالي';
            explanation = 'التذبذب العالي في السعر يشير إلى مخاطر عالية';
        } else if (changePercent < 1 && marketCap > 50000000000) {
            level = 'منخفض';
            explanation = 'الاستقرار النسبي والقيمة السوقية الكبيرة تشير إلى مخاطر منخفضة';
        } else {
            level = 'متوسط';
            explanation = 'مستوى المخاطر ضمن المعدل الطبيعي للسوق السعودي';
        }
        
        return {
            level,
            explanation
        };
    }
    
    // Export analysis report
    exportAnalysis(symbol) {
        // This would generate a PDF or Excel report
        this.showError('ميزة تصدير التقرير قيد التطوير');
    }
    
    // Add method for rendering companies in different views
    renderCompaniesView(view) {
        console.log(`🎨 Rendering companies in ${view} view`);
        
        const container = document.getElementById('live-companies-table');
        if (!container || !this.cachedData || !this.cachedData.companies) {
            return;
        }
        
        const companies = this.cachedData.companies;
        
        if (view === 'list') {
            this.renderListView(companies, container);
        } else {
            this.renderGridView(companies, container);
        }
    }
    
    // Render companies in list view
    renderListView(companies, container) {
        const html = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>الشركة</th>
                            <th>الرمز</th>
                            <th>السعر</th>
                            <th>التغير</th>
                            <th>النسبة</th>
                            <th>الحجم</th>
                            <th>القيمة السوقية</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${companies.map(company => `
                            <tr class="company-row" data-name="${company.name}" data-symbol="${company.symbol}" data-sector="${company.sector}">
                                <td>
                                    <div class="company-info">
                                        <strong>${company.name}</strong>
                                        <small class="text-muted d-block">${company.sector}</small>
                                    </div>
                                </td>
                                <td><code>${company.symbol}</code></td>
                                <td><strong>${company.closing_price.toFixed(2)}</strong></td>
                                <td class="${company.change >= 0 ? 'text-success' : 'text-danger'}">
                                    ${company.change >= 0 ? '+' : ''}${company.change.toFixed(2)}
                                </td>
                                <td class="${company.change_percent >= 0 ? 'text-success' : 'text-danger'}">
                                    ${company.change_percent >= 0 ? '+' : ''}${company.change_percent.toFixed(2)}%
                                </td>
                                <td>${company.formatted_volume}</td>
                                <td>${company.formatted_market_cap}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    // Render companies in grid view
    renderGridView(companies, container) {
        const html = `
            <div class="row">
                ${companies.map(company => `
                    <div class="col-lg-4 col-md-6 mb-4 company-item" data-name="${company.name}" data-symbol="${company.symbol}" data-sector="${company.sector}">
                        <div class="card company-card h-100">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h6 class="card-title mb-0">${company.name}</h6>
                                    <span class="badge bg-secondary">${company.symbol}</span>
                                </div>
                                <p class="text-muted small mb-2">${company.sector}</p>
                                <div class="price-info">
                                    <div class="current-price h4 mb-1">${company.closing_price.toFixed(2)} <small>ر.س</small></div>
                                    <div class="price-change ${company.change >= 0 ? 'text-success' : 'text-danger'}">
                                        ${company.change >= 0 ? '+' : ''}${company.change.toFixed(2)} 
                                        (${company.change_percent >= 0 ? '+' : ''}${company.change_percent.toFixed(2)}%)
                                    </div>
                                </div>
                                <div class="company-stats mt-3">
                                    <div class="row text-center">
                                        <div class="col-6">
                                            <small class="text-muted">الحجم</small>
                                            <div class="fw-bold small">${company.formatted_volume}</div>
                                        </div>
                                        <div class="col-6">
                                            <small class="text-muted">القيمة السوقية</small>
                                            <div class="fw-bold small">${company.formatted_market_cap}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    // Add method to update chart period (called by button handlers)
    updateChartPeriod(period) {
        console.log(`📊 Live market data updating chart period: ${period}`);
        // This would integrate with chart updates
        // For now, just show a notification
        if (window.buttonHandlers) {
            window.buttonHandlers.showNotification(`تم تحديث الرسم البياني للفترة: ${period}`, 'info');
        }
    }
    
    async loadLiveData() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingIndicator();
        
        try {
            const response = await fetch(`${this.apiEndpoint}?action=live_market_overview&t=${Date.now()}`);
            const data = await response.json();
            
            if (data.success) {
                this.displayMarketData(data);
                this.lastUpdate = new Date();
                console.log('✅ Live market data loaded successfully');
            } else {
                throw new Error(data.error || 'Failed to load market data');
            }
        } catch (error) {
            console.error('❌ Error loading live market data:', error);
            this.showError('فشل في تحميل البيانات المباشرة');
        } finally {
            this.isLoading = false;
            this.hideLoadingIndicator();
        }
    }
    
    displayMarketData(data) {
        this.updateMarketSummary(data.summary);
        this.displayCompaniesTable(data.companies);
        this.updateTopPerformers(data);
        this.updateMarketStatus(data.market_status);
        this.updateLastUpdateTime(data.timestamp);
        this.updateStockSelector(data.companies); // Add this line to populate dropdown
    }
    
    // Add method to update stock selector
    updateStockSelector(companies) {
        const selector = document.getElementById('stockAnalyzerSelect');
        if (!selector) {
            console.warn('⚠️ Stock analyzer select not found');
            return;
        }
        
        // Clear existing options
        selector.innerHTML = '<option value="">اختر السهم...</option>';
        
        // Add companies to dropdown
        companies.forEach(company => {
            const option = document.createElement('option');
            option.value = company.symbol;
            option.textContent = `${company.name} (${company.symbol})`;
            selector.appendChild(option);
        });
        
        console.log(`✅ Stock selector updated with ${companies.length} companies`);
    }
    
    updateMarketSummary(summary) {
        // Update market summary cards
        const summaryElements = {
            'total-companies': summary.total_companies,
            'companies-up': summary.companies_up,
            'companies-down': summary.companies_down,
            'companies-stable': summary.companies_stable,
            'total-market-cap': summary.formatted_market_cap,
            'total-volume': summary.formatted_volume,
            'total-value': summary.formatted_value
        };
        
        Object.entries(summaryElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                element.classList.add('updated');
                setTimeout(() => element.classList.remove('updated'), 1000);
            }
        });
    }
    
    displayCompaniesTable(companies) {
        const tableContainer = document.getElementById('live-companies-table');
        if (!tableContainer) {
            console.warn('⚠️ Live companies table container not found');
            return;
        }
        
        // Store companies data for view switching
        if (!this.cachedData) {
            this.cachedData = {};
        }
        this.cachedData.companies = companies;
        
        // Check current view from button handlers
        const currentView = window.buttonHandlers ? window.buttonHandlers.currentView : 'grid';
        
        // Render based on current view
        if (currentView === 'list') {
            this.renderListView(companies, tableContainer);
        } else {
            this.renderGridView(companies, tableContainer);
        }
        
        // Add click handlers for company rows
        this.addCompanyRowHandlers();
    }
    
    addCompanyRowHandlers() {
        document.querySelectorAll('.company-row').forEach(row => {
            row.addEventListener('click', (e) => {
                const symbol = row.getAttribute('data-symbol');
                this.showCompanyDetails(symbol);
            });
            
            row.style.cursor = 'pointer';
        });
    }
    
    async showCompanyDetails(symbol) {
        try {
            const response = await fetch(`${this.apiEndpoint}?action=company_details&symbol=${symbol}`);
            const data = await response.json();
            
            if (data.success) {
                this.displayCompanyModal(data);
            } else {
                throw new Error(data.error || 'Failed to load company details');
            }
        } catch (error) {
            console.error('❌ Error loading company details:', error);
            this.showError('فشل في تحميل تفاصيل الشركة');
        }
    }
    
    displayCompanyModal(data) {
        const company = data.company_details;
        const changeClass = company.change_percent > 0 ? 'text-success' : 
                           company.change_percent < 0 ? 'text-danger' : 'text-muted';
        
        const modalHtml = `
            <div class="modal fade" id="companyDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-building me-2"></i>
                                ${company.name}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header">
                                            <h6 class="mb-0">معلومات السهم</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="row mb-3">
                                                <div class="col-6">
                                                    <label class="form-label">الرمز:</label>
                                                    <div class="fw-bold">${data.symbol}</div>
                                                </div>
                                                <div class="col-6">
                                                    <label class="form-label">القطاع:</label>
                                                    <div><span class="badge bg-primary">${company.sector}</span></div>
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-6">
                                                    <label class="form-label">السعر الحالي:</label>
                                                    <div class="fw-bold fs-5">${company.closing_price.toFixed(2)} ر.س</div>
                                                </div>
                                                <div class="col-6">
                                                    <label class="form-label">التغير:</label>
                                                    <div class="${changeClass} fw-bold">
                                                        ${company.change >= 0 ? '+' : ''}${company.change.toFixed(2)} 
                                                        (${company.change_percent >= 0 ? '+' : ''}${company.change_percent.toFixed(2)}%)
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-6">
                                                    <label class="form-label">أعلى سعر:</label>
                                                    <div>${company.high.toFixed(2)} ر.س</div>
                                                </div>
                                                <div class="col-6">
                                                    <label class="form-label">أقل سعر:</label>
                                                    <div>${company.low.toFixed(2)} ر.س</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header">
                                            <h6 class="mb-0">الإحصائيات المالية</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label class="form-label">الأسهم المصدرة:</label>
                                                <div class="fw-bold">${this.formatNumber(company.shares_issued)}</div>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">القيمة السوقية:</label>
                                                <div class="fw-bold text-primary fs-5">${company.formatted_market_cap}</div>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">حجم التداول:</label>
                                                <div class="fw-bold">${company.formatted_volume}</div>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">قيمة التداول:</label>
                                                <div class="fw-bold">${company.formatted_value}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                            <button type="button" class="btn btn-primary" onclick="liveMarketData.refreshCompanyData('${data.symbol}')">
                                <i class="fas fa-sync-alt me-2"></i>تحديث البيانات
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        const existingModal = document.getElementById('companyDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('companyDetailsModal'));
        modal.show();
    }
    
    updateTopPerformers(data) {
        this.updateTopGainers(data.top_gainers);
        this.updateTopLosers(data.top_losers);
        this.updateMostActive(data.most_active);
    }
    
    updateTopGainers(gainers) {
        const container = document.getElementById('top-gainers-list');
        if (!container || !gainers) return;
        
        let html = '';
        gainers.slice(0, 5).forEach(stock => {
            html += `
                <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-start border-success border-3">
                    <div>
                        <div class="fw-bold">${stock.name}</div>
                        <small class="text-muted">${stock.symbol}</small>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold text-success">+${stock.change_percent.toFixed(2)}%</div>
                        <small>${stock.closing_price.toFixed(2)} ر.س</small>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    updateTopLosers(losers) {
        const container = document.getElementById('top-losers-list');
        if (!container || !losers) return;
        
        let html = '';
        losers.slice(0, 5).forEach(stock => {
            html += `
                <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-start border-danger border-3">
                    <div>
                        <div class="fw-bold">${stock.name}</div>
                        <small class="text-muted">${stock.symbol}</small>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold text-danger">${stock.change_percent.toFixed(2)}%</div>
                        <small>${stock.closing_price.toFixed(2)} ر.س</small>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    updateMostActive(active) {
        const container = document.getElementById('most-active-list');
        if (!container || !active) return;
        
        let html = '';
        active.slice(0, 5).forEach(stock => {
            html += `
                <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-start border-info border-3">
                    <div>
                        <div class="fw-bold">${stock.name}</div>
                        <small class="text-muted">${stock.symbol}</small>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold text-info">${this.formatNumber(stock.volume)}</div>
                        <small>${stock.closing_price.toFixed(2)} ر.س</small>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    updateMarketStatus(status) {
        const statusElement = document.getElementById('market-status');
        if (statusElement) {
            statusElement.textContent = status === 'open' ? 'مفتوح' : 'مغلق';
            statusElement.className = `badge ${status === 'open' ? 'bg-success' : 'bg-danger'}`;
        }
    }
    
    updateLastUpdateTime(timestamp) {
        const timeElement = document.getElementById('last-update-time');
        if (timeElement) {
            timeElement.textContent = `آخر تحديث: ${this.formatTime(new Date(timestamp))}`;
        }
    }
    
    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.refreshInterval = setInterval(() => {
            console.log('🔄 Auto-refreshing live market data...');
            this.loadLiveData();
        }, this.refreshRate);
        
        console.log(`⏰ Auto-refresh started (${this.refreshRate / 1000}s interval)`);
    }
    
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
            console.log('⏹️ Auto-refresh stopped');
        }
    }
    
    setupEventListeners() {
        // Manual refresh button
        const refreshBtn = document.getElementById('refresh-market-data');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadLiveData();
            });
        }
        
        // Auto-refresh toggle
        const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
        if (autoRefreshToggle) {
            autoRefreshToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.startAutoRefresh();
                } else {
                    this.stopAutoRefresh();
                }
            });
        }
    }
    
    showLoadingIndicator() {
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.style.display = 'block';
        }
    }
    
    hideLoadingIndicator() {
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
    
    showError(message) {
        // Create error alert
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
        alert.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alert);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }
    
    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(2) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(2) + 'K';
        }
        return num.toLocaleString('ar-SA');
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    refreshCompanyData(symbol) {
        this.showCompanyDetails(symbol);
    }
}

// Initialize when DOM is ready
let liveMarketData;
document.addEventListener('DOMContentLoaded', function() {
    liveMarketData = new LiveMarketData();
});

// Export for global access
window.liveMarketData = liveMarketData; 