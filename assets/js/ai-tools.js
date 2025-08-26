// AI Tools Handler - Prevents page refresh and provides smooth interactions
// معالج أدوات الذكاء الاصطناعي - يمنع تحديث الصفحة ويوفر تفاعلات سلسة

class AIToolsHandler {
    constructor() {
        this.currentAnalysis = null;
        this.isAnalyzing = false;
        this.modalOpen = false;
        
        this.init();
    }

    init() {
        console.log('🤖 AI Tools Handler initialized');
        this.setupEventListeners();
        this.loadStockOptions();
        this.preventFormSubmissions();
    }

    setupEventListeners() {
        // Remove onclick attributes and add proper event listeners
        this.removeOnclickAttributes();
        this.addEventListeners();
        
        // Prevent default form submissions
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('📝 Form submission prevented');
        });

        // Prevent default button clicks that might cause refresh
        document.addEventListener('click', (e) => {
            if (e.target.matches('button[type="submit"]') || 
                e.target.closest('button[type="submit"]')) {
                e.preventDefault();
                console.log('🔘 Submit button click prevented');
            }
        });
    }

    removeOnclickAttributes() {
        // Remove onclick attributes from AI tool buttons
        const aiButtons = document.querySelectorAll('[onclick]');
        aiButtons.forEach(button => {
            const onclickValue = button.getAttribute('onclick');
            button.removeAttribute('onclick');
            
            // Store the function name for later use
            button.dataset.action = onclickValue.replace(/\(\)/g, '');
        });
    }

    addEventListeners() {
        // Trend Analysis Button
        const trendBtn = document.querySelector('[data-action="openTrendAnalysis"]');
        if (trendBtn) {
            trendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openTrendAnalysis();
            });
        }

        // Price Prediction Button
        const predictionBtn = document.querySelector('[data-action="openPricePrediction"]');
        if (predictionBtn) {
            predictionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openPricePrediction();
            });
        }

        // Risk Management Button
        const riskBtn = document.querySelector('[data-action="openRiskManagement"]');
        if (riskBtn) {
            riskBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openRiskManagement();
            });
        }

        // Portfolio Analysis Button
        const portfolioBtn = document.querySelector('[data-action="openPortfolioAnalysis"]');
        if (portfolioBtn) {
            portfolioBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openPortfolioAnalysis();
            });
        }

        // Stock Analyzer Button
        const stockAnalyzerBtn = document.querySelector('[data-action="analyzeSelectedStock"]');
        if (stockAnalyzerBtn) {
            stockAnalyzerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.analyzeSelectedStock();
            });
        }

        // Close modal buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal-close, .btn-close, [data-dismiss="modal"]')) {
                e.preventDefault();
                this.closeCurrentModal();
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOpen) {
                this.closeCurrentModal();
            }
        });
    }

    preventFormSubmissions() {
        // Prevent all form submissions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('📝 Form submission prevented:', form.id || 'unnamed form');
            });
        });
    }

    openTrendAnalysis() {
        console.log('📈 Opening Trend Analysis...');
        this.showModal('تحليل الاتجاهات', this.getTrendAnalysisContent());
    }

    openPricePrediction() {
        console.log('🔮 Opening Price Prediction...');
        this.showModal('التنبؤ بالأسعار', this.getPricePredictionContent());
    }

    openRiskManagement() {
        console.log('🛡️ Opening Risk Management...');
        this.showModal('إدارة المخاطر', this.getRiskManagementContent());
    }

    openPortfolioAnalysis() {
        console.log('📊 Opening Portfolio Analysis...');
        this.showModal('تحليل المحفظة', this.getPortfolioAnalysisContent());
    }

    analyzeSelectedStock() {
        const select = document.getElementById('stockAnalyzerSelect');
        const selectedStock = select ? select.value : '';
        
        if (!selectedStock) {
            this.showNotification('يرجى اختيار سهم للتحليل', 'warning');
            return;
        }

        console.log('🔍 Analyzing stock:', selectedStock);
        this.showModal('تحليل السهم', this.getStockAnalysisContent(selectedStock));
    }

    showModal(title, content) {
        // Remove existing modal if any
        this.closeCurrentModal();

        // Get AI tools section position for better modal placement
        const aiToolsSection = document.querySelector('#ai-tools, .ai-tools-section, #ai-tools-section');
        let modalPosition = 'center'; // default
        
        if (aiToolsSection) {
            const rect = aiToolsSection.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const aiToolsTop = rect.top + scrollTop;
            const viewportHeight = window.innerHeight;
            
            // If AI tools section is visible or close to visible, position modal near it
            if (rect.top < viewportHeight && rect.bottom > 0) {
                modalPosition = 'near-tools';
            }
        }

        // Create modal HTML with dynamic positioning
        const modalHTML = `
            <div class="ai-modal-overlay ${modalPosition}" id="aiModalOverlay">
                <div class="ai-modal" id="aiModal">
                    <div class="ai-modal-header">
                        <h3 class="ai-modal-title">${title}</h3>
                        <button class="ai-modal-close" onclick="aiToolsHandler.closeCurrentModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="ai-modal-body">
                        ${content}
                    </div>
                    <div class="ai-modal-footer">
                        <button class="btn btn-secondary" onclick="aiToolsHandler.closeCurrentModal()">
                            إغلاق
                        </button>
                        <button class="btn btn-primary" onclick="aiToolsHandler.startAnalysis()">
                            <i class="fas fa-play me-2"></i>
                            بدء التحليل
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Position modal near AI tools if applicable
        if (modalPosition === 'near-tools' && aiToolsSection) {
            this.positionModalNearTools(aiToolsSection);
        }
        
        // Show modal with animation
        setTimeout(() => {
            const modal = document.getElementById('aiModalOverlay');
            if (modal) {
                modal.classList.add('show');
            }
        }, 10);

        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
        this.modalOpen = true;
    }
    
    // New method to position modal near AI tools
    positionModalNearTools(aiToolsSection) {
        const modal = document.getElementById('aiModal');
        const overlay = document.getElementById('aiModalOverlay');
        
        if (!modal || !overlay) return;
        
        // Add positioning class for smooth transitions
        overlay.classList.add('positioning');
        
        const rect = aiToolsSection.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const modalHeight = 600; // Approximate modal height
        
        // Calculate optimal position - try to position above AI tools section
        let topPosition = Math.max(rect.top + scrollTop - 80, scrollTop + 20);
        
        // If positioning above would push modal out of view, position below
        if (topPosition + modalHeight > scrollTop + viewportHeight - 40) {
            // Try positioning below the AI tools section
            const belowPosition = rect.bottom + scrollTop + 20;
            if (belowPosition + modalHeight <= scrollTop + viewportHeight - 20) {
                topPosition = belowPosition;
            } else {
                // If neither above nor below works well, center in visible area
                topPosition = scrollTop + Math.max(20, (viewportHeight - modalHeight) / 2);
            }
        }
        
        // Apply positioning with smooth transition
        const offsetFromTop = Math.max(0, topPosition - scrollTop);
        overlay.style.paddingTop = `${offsetFromTop}px`;
        
        // Ensure modal is visible and doesn't cause horizontal scroll
        setTimeout(() => {
            const modalRect = modal.getBoundingClientRect();
            if (modalRect.top < 0 || modalRect.bottom > viewportHeight) {
                // Adjust if modal is still not optimally positioned
                const adjustment = modalRect.top < 0 ? Math.abs(modalRect.top) + 20 : 0;
                overlay.style.paddingTop = `${offsetFromTop + adjustment}px`;
            }
        }, 100);
        
        console.log(`📍 Modal positioned near AI tools at offset ${offsetFromTop}px from viewport top`);
    }

    closeCurrentModal() {
        const modal = document.getElementById('aiModalOverlay');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
        this.modalOpen = false;
        // Restore background scrolling
        document.body.style.overflow = '';
    }

    getTrendAnalysisContent() {
        return `
            <div class="analysis-content">
                <div class="analysis-description">
                    <p>تحليل ذكي لاتجاهات السوق باستخدام خوارزميات متقدمة</p>
                </div>
                <div class="analysis-options">
                    <div class="form-group">
                        <label>فترة التحليل:</label>
                        <select class="form-select" id="trendPeriod">
                            <option value="1d">يوم واحد</option>
                            <option value="1w">أسبوع</option>
                            <option value="1m">شهر</option>
                            <option value="3m">3 أشهر</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>نوع التحليل:</label>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="technicalAnalysis" checked>
                            <label class="form-check-label" for="technicalAnalysis">
                                التحليل الفني
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="fundamentalAnalysis">
                            <label class="form-check-label" for="fundamentalAnalysis">
                                التحليل الأساسي
                            </label>
                        </div>
                    </div>
                </div>
                <div class="analysis-preview">
                    <div class="preview-chart">
                        <canvas id="trendPreviewChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
        `;
    }

    getPricePredictionContent() {
        return `
            <div class="analysis-content">
                <div class="analysis-description">
                    <p>توقعات دقيقة لحركة الأسعار باستخدام نماذج التعلم الآلي</p>
                </div>
                <div class="analysis-options">
                    <div class="form-group">
                        <label>السهم:</label>
                        <select class="form-select" id="predictionStock">
                            <option value="">اختر السهم...</option>
                            <option value="1180.SR">البنك الأهلي السعودي</option>
                            <option value="2010.SR">سابك</option>
                            <option value="7010.SR">الاتصالات السعودية</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>فترة التوقع:</label>
                        <select class="form-select" id="predictionPeriod">
                            <option value="1d">يوم واحد</option>
                            <option value="1w">أسبوع</option>
                            <option value="1m">شهر</option>
                        </select>
                    </div>
                </div>
                <div class="prediction-preview">
                    <div class="prediction-chart">
                        <canvas id="predictionChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
        `;
    }

    getRiskManagementContent() {
        return `
            <div class="analysis-content">
                <div class="analysis-description">
                    <p>تحليل المخاطر وتوصيات إدارة المحفظة الاستثمارية</p>
                </div>
                <div class="analysis-options">
                    <div class="form-group">
                        <label>نوع المحفظة:</label>
                        <select class="form-select" id="portfolioType">
                            <option value="conservative">محافظة</option>
                            <option value="moderate">متوسطة</option>
                            <option value="aggressive">عدوانية</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>مستوى المخاطرة:</label>
                        <input type="range" class="form-range" id="riskLevel" min="1" max="10" value="5">
                        <div class="risk-labels">
                            <span>منخفض</span>
                            <span>متوسط</span>
                            <span>عالي</span>
                        </div>
                    </div>
                </div>
                <div class="risk-preview">
                    <div class="risk-chart">
                        <canvas id="riskChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
        `;
    }

    getPortfolioAnalysisContent() {
        return `
            <div class="analysis-content">
                <div class="analysis-description">
                    <p>تحليل أداء المحفظة الاستثمارية وتوصيات التحسين</p>
                </div>
                <div class="analysis-options">
                    <div class="form-group">
                        <label>إضافة أسهم للمحفظة:</label>
                        <div class="portfolio-stocks">
                            <div class="stock-input">
                                <input type="text" class="form-control" placeholder="رمز السهم" id="stockSymbol1">
                                <input type="number" class="form-control" placeholder="الكمية" id="stockQuantity1">
                            </div>
                            <div class="stock-input">
                                <input type="text" class="form-control" placeholder="رمز السهم" id="stockSymbol2">
                                <input type="number" class="form-control" placeholder="الكمية" id="stockQuantity2">
                            </div>
                            <button class="btn btn-sm btn-outline-primary" onclick="aiToolsHandler.addStockInput()">
                                <i class="fas fa-plus"></i>
                                إضافة سهم
                            </button>
                        </div>
                    </div>
                </div>
                <div class="portfolio-preview">
                    <div class="portfolio-chart">
                        <canvas id="portfolioChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
        `;
    }

    getStockAnalysisContent(stockSymbol) {
        return `
            <div class="analysis-content">
                <div class="analysis-description">
                    <p>تحليل شامل للسهم: <strong>${stockSymbol}</strong></p>
                </div>
                <div class="stock-info">
                    <div class="info-item">
                        <span class="label">السعر الحالي:</span>
                        <span class="value" id="currentPrice">--</span>
                    </div>
                    <div class="info-item">
                        <span class="label">التغير:</span>
                        <span class="value" id="priceChange">--</span>
                    </div>
                    <div class="info-item">
                        <span class="label">حجم التداول:</span>
                        <span class="value" id="tradingVolume">--</span>
                    </div>
                </div>
                <div class="analysis-options">
                    <div class="form-group">
                        <label>المؤشرات الفنية:</label>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="rsi" checked>
                            <label class="form-check-label" for="rsi">RSI</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="macd" checked>
                            <label class="form-check-label" for="macd">MACD</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="bollinger">
                            <label class="form-check-label" for="bollinger">Bollinger Bands</label>
                        </div>
                    </div>
                </div>
                <div class="stock-preview">
                    <div class="stock-chart">
                        <canvas id="stockAnalysisChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
        `;
    }

    async startAnalysis() {
        if (this.isAnalyzing) {
            this.showNotification('التحليل قيد التشغيل بالفعل', 'info');
            return;
        }

        this.isAnalyzing = true;
        this.showNotification('جاري بدء التحليل الذكي مع البيانات المباشرة...', 'info');

        try {
            // Get current modal type
            const modalTitle = document.querySelector('.ai-modal-title');
            const analysisType = this.getAnalysisTypeFromTitle(modalTitle?.textContent || '');

            // Get form data with real-time market context
            const formData = this.getEnhancedFormData(analysisType);

            // Try Enhanced AI Server first (Python ML backend)
            let response;
            let result;
            
            try {
                response = await fetch(`http://localhost:8001/api/${analysisType}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    result = await response.json();
                    if (!result.error) {
                        this.displayEnhancedAnalysisResults(analysisType, result);
                        this.showNotification('تم إكمال التحليل الذكي بنجاح! 🤖', 'success');
                        return;
                    }
                }
            } catch (pythonError) {
                console.warn('Python AI server unavailable, trying PHP fallback:', pythonError);
            }

            // Fallback to PHP API
            this.showNotification('جاري المحاولة مع الخادم الاحتياطي...', 'info');
            
            response = await fetch(`http://localhost:8000/api/ai_tools.php?action=${analysisType.replace('-', '_')}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }

            // Display results
            this.displayAnalysisResults(analysisType, result);
            this.showNotification('تم إكمال التحليل بنجاح!', 'success');

        } catch (error) {
            console.error('Analysis error:', error);
            this.showNotification(`فشل في التحليل: ${error.message}`, 'error');
        } finally {
            this.isAnalyzing = false;
        }
    }
    
    // Enhanced form data with real-time market context
    getEnhancedFormData(analysisType) {
        const baseData = this.getFormData(analysisType);
        
        // Add real-time market context
        baseData.timestamp = Date.now();
        baseData.market_context = {
            current_time: new Date().toISOString(),
            trading_session: this.getTradingSession()
        };
        
        // Add portfolio data from live market
        if (analysisType.includes('portfolio') || analysisType.includes('risk')) {
            baseData.portfolio = this.getPortfolioSymbols();
        }
        
        // Add selected stock for predictions
        if (analysisType.includes('prediction') || analysisType.includes('stock')) {
            const stockSelect = document.getElementById('stockAnalyzerSelect');
            if (stockSelect && stockSelect.value) {
                baseData.symbol = stockSelect.value;
                baseData.days_ahead = 5;
            }
        }
        
        return baseData;
    }
    
    // Get current trading session
    getTradingSession() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour * 100 + minute;
        
        // Saudi market hours: 10:00 - 15:00
        if (currentTime >= 1000 && currentTime <= 1500) {
            return 'open';
        } else if (currentTime >= 930 && currentTime < 1000) {
            return 'pre_market';
        } else if (currentTime > 1500 && currentTime <= 1530) {
            return 'post_market';
        } else {
            return 'closed';
        }
    }
    
    // Get portfolio symbols from live market data
    getPortfolioSymbols() {
        const defaultPortfolio = ['1120.SR', '1180.SR', '2010.SR', '7010.SR', '2222.SR'];
        
        // Try to get from live market data
        if (window.liveMarketData && window.liveMarketData.cachedData && window.liveMarketData.cachedData.companies) {
            const companies = window.liveMarketData.cachedData.companies;
            return companies.slice(0, 5).map(company => company.symbol);
        }
        
        return defaultPortfolio;
    }

    getAnalysisTypeFromTitle(title) {
        if (title.includes('الاتجاهات')) return 'trend-analysis';
        if (title.includes('التنبؤ')) return 'price-prediction';
        if (title.includes('المخاطر')) return 'risk-analysis';
        if (title.includes('المحفظة')) return 'portfolio-analysis';
        if (title.includes('السهم')) return 'stock-analysis';
        return 'trend-analysis';
    }

    getFormData(analysisType) {
        const data = {};

        switch (analysisType) {
            case 'trend-analysis':
                const trendPeriod = document.getElementById('trendPeriod');
                if (trendPeriod) data.period = trendPeriod.value;
                break;

            case 'price-prediction':
                const predictionStock = document.getElementById('predictionStock');
                const predictionPeriod = document.getElementById('predictionPeriod');
                if (predictionStock) data.stock = predictionStock.value;
                if (predictionPeriod) data.period = predictionPeriod.value;
                break;

            case 'risk-analysis':
                const portfolioType = document.getElementById('portfolioType');
                const riskLevel = document.getElementById('riskLevel');
                if (portfolioType) data.portfolio_type = portfolioType.value;
                if (riskLevel) data.risk_level = parseInt(riskLevel.value);
                break;

            case 'portfolio-analysis':
                const stocks = [];
                const stockInputs = document.querySelectorAll('.stock-input');
                stockInputs.forEach(input => {
                    const symbol = input.querySelector('input[placeholder*="رمز"]')?.value;
                    const quantity = input.querySelector('input[placeholder*="الكمية"]')?.value;
                    if (symbol && quantity) {
                        stocks.push({ symbol, quantity: parseInt(quantity) });
                    }
                });
                data.stocks = stocks;
                break;

            case 'stock-analysis':
                // Get stock symbol from current context
                data.symbol = this.currentStockSymbol || 'TASI';
                break;
        }

        return data;
    }

    displayAnalysisResults(analysisType, result) {
        const modalBody = document.querySelector('.ai-modal-body');
        if (!modalBody) return;

        let resultsHTML = '<div class="analysis-results">';

        switch (analysisType) {
            case 'trend-analysis':
                resultsHTML += `
                    <div class="result-item">
                        <h4>نتيجة التحليل</h4>
                        <p><strong>الاتجاه:</strong> ${result.trend}</p>
                        <p><strong>مستوى الثقة:</strong> ${(result.confidence * 100).toFixed(1)}%</p>
                        <p><strong>التحليل:</strong> ${result.analysis}</p>
                    </div>
                `;
                break;

            case 'price-prediction':
                resultsHTML += `
                    <div class="result-item">
                        <h4>التنبؤ بالسعر</h4>
                        <p><strong>السهم:</strong> ${result.stock}</p>
                        <p><strong>السعر الحالي:</strong> ${result.current_price}</p>
                        <p><strong>السعر المتوقع:</strong> ${result.predicted_price}</p>
                        <p><strong>التغير المتوقع:</strong> ${result.change_percent}%</p>
                        <p><strong>مستوى الثقة:</strong> ${(result.confidence * 100).toFixed(1)}%</p>
                    </div>
                `;
                break;

            case 'risk-analysis':
                resultsHTML += `
                    <div class="result-item">
                        <h4>تحليل المخاطر</h4>
                        <p><strong>نوع المحفظة:</strong> ${result.portfolio_type}</p>
                        <p><strong>مستوى المخاطرة:</strong> ${result.risk_level}/10</p>
                        <p><strong>مقياس المخاطرة:</strong> ${result.risk_score}</p>
                        <p><strong>التقلب:</strong> ${result.volatility}</p>
                        <p><strong>نسبة شارب:</strong> ${result.sharpe_ratio}</p>
                        <p><strong>التوصية:</strong> ${result.recommendation}</p>
                    </div>
                `;
                break;

            case 'portfolio-analysis':
                resultsHTML += `
                    <div class="result-item">
                        <h4>تحليل المحفظة</h4>
                        <p><strong>القيمة الإجمالية:</strong> ${result.total_value}</p>
                        <p><strong>الأداء:</strong> ${result.performance_percent}%</p>
                        <p><strong>مقياس المخاطرة:</strong> ${result.risk_score}</p>
                        <p><strong>مقياس التنويع:</strong> ${result.diversification_score}</p>
                        <h5>التوصيات:</h5>
                        <ul>
                            ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                `;
                break;

            case 'stock-analysis':
                resultsHTML += `
                    <div class="result-item">
                        <h4>تحليل السهم</h4>
                        <p><strong>الرمز:</strong> ${result.symbol}</p>
                        <p><strong>السعر الحالي:</strong> ${result.current_price}</p>
                        <p><strong>التغير:</strong> ${result.change} (${result.change_percent}%)</p>
                        <p><strong>حجم التداول:</strong> ${result.volume}</p>
                        <p><strong>RSI:</strong> ${result.rsi}</p>
                        <p><strong>MACD:</strong> ${result.macd}</p>
                        <p><strong>التوصية:</strong> ${result.recommendation}</p>
                    </div>
                `;
                break;
        }

        resultsHTML += '</div>';

        // Replace modal content with results
        modalBody.innerHTML = resultsHTML;
    }
    
    // Enhanced results display for ML-powered analysis
    displayEnhancedAnalysisResults(analysisType, result) {
        const modalBody = document.querySelector('.ai-modal-body');
        if (!modalBody) return;

        let html = '';
        
        switch (analysisType) {
            case 'trend-analysis':
                html = this.generateTrendAnalysisHTML(result);
                break;
            case 'price-prediction':
                html = this.generatePredictionHTML(result);
                break;
            case 'risk-analysis':
            case 'portfolio-analysis':
                html = this.generateRiskAnalysisHTML(result);
                break;
            default:
                html = this.generateGenericResultsHTML(result);
        }
        
        modalBody.innerHTML = html;
    }
    
    // Generate enhanced HTML for different analysis types
    generateTrendAnalysisHTML(result) {
        const sentiment = result.market_sentiment || 'neutral';
        const sentimentText = sentiment === 'bullish' ? 'صاعد' : sentiment === 'bearish' ? 'هابط' : 'محايد';
        const sentimentClass = sentiment === 'bullish' ? 'text-success' : sentiment === 'bearish' ? 'text-danger' : 'text-warning';
        
        return `
            <div class="enhanced-analysis-results">
                <div class="alert alert-info">
                    <i class="fas fa-robot me-2"></i>
                    <strong>تحليل ذكي بالبيانات المباشرة</strong>
                </div>
                
                <div class="card bg-light mb-4">
                    <div class="card-body text-center">
                        <h4>اتجاه السوق العام</h4>
                        <h3 class="${sentimentClass}">${sentimentText}</h3>
                    </div>
                </div>
                
                <div class="alert alert-success">
                    <h6>الفرص الاستثمارية:</h6>
                    <ul class="mb-0">
                        ${(result.top_opportunities || []).map(opp => `<li>${opp}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="alert alert-warning">
                    <h6>عوامل المخاطر:</h6>
                    <ul class="mb-0">
                        ${(result.risk_factors || []).map(risk => `<li>${risk}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    generatePredictionHTML(result) {
        const predictions = result.predictions || [];
        let predictionsHtml = '';
        
        predictions.forEach(pred => {
            const changeClass = pred.change_percent > 0 ? 'text-success' : 'text-danger';
            predictionsHtml += `
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h6>اليوم ${pred.day}</h6>
                            <div><strong>${pred.predicted_price} ر.س</strong></div>
                            <div class="${changeClass}">${pred.change_percent}%</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        return `
            <div class="enhanced-analysis-results">
                <div class="alert alert-info">
                    <i class="fas fa-brain me-2"></i>
                    <strong>توقعات الأسعار بالذكاء الاصطناعي</strong>
                </div>
                
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="card bg-primary text-white text-center">
                            <div class="card-body">
                                <h5>السعر الحالي</h5>
                                <h3>${result.current_price || 0} ر.س</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card bg-info text-white text-center">
                            <div class="card-body">
                                <h5>دقة النموذج</h5>
                                <h3>${result.confidence || 0}%</h3>
                            </div>
                        </div>
                    </div>
                </div>
                
                <h5>التوقعات القادمة</h5>
                <div class="row">${predictionsHtml}</div>
            </div>
        `;
    }
    
    generateRiskAnalysisHTML(result) {
        const metrics = result.portfolio_metrics || {};
        return `
            <div class="enhanced-analysis-results">
                <div class="alert alert-info">
                    <i class="fas fa-shield-alt me-2"></i>
                    <strong>تحليل المخاطر المتقدم</strong>
                </div>
                
                <div class="row mb-4">
                    <div class="col-md-3 text-center">
                        <div class="card">
                            <div class="card-body">
                                <h6>العائد المتوقع</h6>
                                <h4 class="text-primary">${metrics.expected_return || 0}%</h4>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 text-center">
                        <div class="card">
                            <div class="card-body">
                                <h6>التقلبات</h6>
                                <h4 class="text-info">${metrics.volatility || 0}%</h4>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 text-center">
                        <div class="card">
                            <div class="card-body">
                                <h6>نسبة شارب</h6>
                                <h4 class="text-success">${metrics.sharpe_ratio || 0}</h4>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 text-center">
                        <div class="card">
                            <div class="card-body">
                                <h6>مستوى المخاطر</h6>
                                <h4>${metrics.risk_level || 'متوسط'}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="alert alert-primary">
                    <h6>التوصيات:</h6>
                    <ul class="mb-0">
                        ${(result.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    generateGenericResultsHTML(result) {
        return `
            <div class="enhanced-analysis-results">
                <div class="alert alert-success">
                    <h5>نتائج التحليل</h5>
                    <pre>${JSON.stringify(result, null, 2)}</pre>
                </div>
            </div>
        `;
    }

    addStockInput() {
        const portfolioStocks = document.querySelector('.portfolio-stocks');
        if (portfolioStocks) {
            const stockCount = portfolioStocks.querySelectorAll('.stock-input').length + 1;
            const newStockInput = `
                <div class="stock-input">
                    <input type="text" class="form-control" placeholder="رمز السهم" id="stockSymbol${stockCount}">
                    <input type="number" class="form-control" placeholder="الكمية" id="stockQuantity${stockCount}">
                </div>
            `;
            portfolioStocks.insertAdjacentHTML('beforeend', newStockInput);
        }
    }

    loadStockOptions() {
        const stockSelects = document.querySelectorAll('#stockAnalyzerSelect, #predictionStock');
        const stocks = [
            { symbol: '1180.SR', name: 'البنك الأهلي السعودي' },
            { symbol: '2010.SR', name: 'سابك' },
            { symbol: '7010.SR', name: 'الاتصالات السعودية' },
            { symbol: '1020.SR', name: 'بنك الراجحي' },
            { symbol: '1211.SR', name: 'شركة التصنيع' },
            { symbol: '2222.SR', name: 'الزيت العربية' }
        ];

        stockSelects.forEach(select => {
            if (select) {
                stocks.forEach(stock => {
                    const option = document.createElement('option');
                    option.value = stock.symbol;
                    option.textContent = `${stock.symbol} - ${stock.name}`;
                    select.appendChild(option);
                });
            }
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `ai-notification ai-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize AI Tools Handler
const aiToolsHandler = new AIToolsHandler();

// Global functions for backward compatibility
window.openTrendAnalysis = () => aiToolsHandler.openTrendAnalysis();
window.openPricePrediction = () => aiToolsHandler.openPricePrediction();
window.openRiskManagement = () => aiToolsHandler.openRiskManagement();
window.openPortfolioAnalysis = () => aiToolsHandler.openPortfolioAnalysis();
window.analyzeSelectedStock = () => aiToolsHandler.analyzeSelectedStock();

console.log('🤖 AI Tools Handler loaded successfully'); 