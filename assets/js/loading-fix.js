// Loading Fix Script - Handle Missing Dependencies
// إصلاح التحميل - التعامل مع التبعيات المفقودة

console.log('🔧 Loading Fix Script - Initializing dependency checks...');

// Check for essential dependencies
function checkDependencies() {
    const dependencies = {
        bootstrap: typeof bootstrap !== 'undefined',
        Chart: typeof Chart !== 'undefined',
        jQuery: typeof $ !== 'undefined' || typeof jQuery !== 'undefined'
    };
    
    console.log('📋 Dependency Status:', dependencies);
    
    // Handle missing Chart.js
    if (!dependencies.Chart) {
        console.warn('⚠️ Chart.js not loaded, creating fallback...');
        window.Chart = {
            register: () => {},
            defaults: {
                font: {},
                color: '#666'
            }
        };
        
        // Create a basic chart constructor
        window.Chart.Chart = function(ctx, config) {
            console.warn('⚠️ Chart.js fallback used - charts may not display correctly');
            return {
                data: config.data || {},
                options: config.options || {},
                update: () => {},
                destroy: () => {},
                resize: () => {},
                render: () => {}
            };
        };
        
        // Add common chart types
        ['Line', 'Bar', 'Pie', 'Doughnut', 'Radar'].forEach(type => {
            window.Chart[type] = window.Chart.Chart;
        });
    }
    
    // Handle missing Bootstrap
    if (!dependencies.bootstrap) {
        console.warn('⚠️ Bootstrap not loaded, creating fallbacks...');
        
        // Create basic Bootstrap fallbacks
        window.bootstrap = {
            Modal: function(element) {
                return {
                    show: () => {
                        if (element) {
                            element.style.display = 'block';
                            element.classList.add('show');
                        }
                    },
                    hide: () => {
                        if (element) {
                            element.style.display = 'none';
                            element.classList.remove('show');
                        }
                    }
                };
            },
            Toast: function(element) {
                return {
                    show: () => {
                        if (element) {
                            element.style.display = 'block';
                            element.classList.add('show');
                            setTimeout(() => {
                                element.style.display = 'none';
                                element.classList.remove('show');
                            }, 5000);
                        }
                    },
                    hide: () => {
                        if (element) {
                            element.style.display = 'none';
                            element.classList.remove('show');
                        }
                    }
                };
            },
            Tooltip: function() {
                return { show: () => {}, hide: () => {} };
            },
            Popover: function() {
                return { show: () => {}, hide: () => {} };
            }
        };
    }
    
    return dependencies;
}

// Initialize fallbacks
function initializeFallbacks() {
    // Ensure requestIdleCallback exists
    if (!window.requestIdleCallback) {
        window.requestIdleCallback = function(callback) {
            return setTimeout(callback, 1);
        };
    }
    
    // Ensure cancelIdleCallback exists
    if (!window.cancelIdleCallback) {
        window.cancelIdleCallback = function(id) {
            clearTimeout(id);
        };
    }
    
    // Ensure IntersectionObserver exists
    if (!window.IntersectionObserver) {
        window.IntersectionObserver = function(callback, options) {
            return {
                observe: () => {},
                unobserve: () => {},
                disconnect: () => {}
            };
        };
    }
    
    console.log('✅ Fallbacks initialized');
}

// Force show content if loading screen is stuck
function forceShowContent() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            console.log('🔧 Force hiding stuck loading screen...');
            loadingScreen.style.display = 'none';
        }
        
        // Ensure main content is visible
        const sections = ['home', 'market', 'ai-tools', 'analysis', 'about'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'block';
                section.style.visibility = 'visible';
                section.style.opacity = '1';
            }
        });
        
        console.log('✅ Content visibility forced');
    }, 5000); // Force after 5 seconds
}

// Handle errors gracefully
function setupErrorHandling() {
    window.addEventListener('error', function(event) {
        console.error('🚨 JavaScript Error:', event.error);
        
        // Don't let errors break the entire application
        event.preventDefault();
        
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-warning position-fixed';
        errorDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            حدث خطأ طفيف في التطبيق، لكن الموقع يعمل بشكل طبيعي
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 10000);
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        console.error('🚨 Unhandled Promise Rejection:', event.reason);
        event.preventDefault();
    });
    
    console.log('✅ Error handling setup complete');
}

// Main initialization
function initializeLoadingFixes() {
    console.log('🚀 Initializing loading fixes...');
    
    // Initialize fallbacks immediately
    initializeFallbacks();
    
    // Setup error handling
    setupErrorHandling();
    
    // Check dependencies when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            checkDependencies();
            forceShowContent();
        });
    } else {
        checkDependencies();
        forceShowContent();
    }
    
    console.log('✅ Loading fixes initialized');
}

// Initialize immediately
initializeLoadingFixes();

// Export for global access
window.loadingFixes = {
    checkDependencies,
    initializeFallbacks,
    forceShowContent,
    setupErrorHandling
};

console.log('✅ Loading Fix Script - Ready'); 