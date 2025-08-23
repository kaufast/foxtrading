/**
 * Main Application Module
 * Initializes and coordinates the i18n system
 */
class FoxTradingApp {
    constructor() {
        this.i18n = null;
        this.detector = null;
        this.lazyLoader = null;
        this.isInitialized = false;
        this.debug = window.location.hostname === 'localhost' || window.location.search.includes('debug=true');
        
        // Configuration
        this.config = {
            supportedLanguages: ['en', 'es-MX'],
            defaultLanguage: 'en',
            fallbackLanguage: 'en',
            basePath: '/locales/',
            autoInit: true,
            enableLazyLoading: true
        };
        
        // Flag emoji mapping
        this.flags = {
            'en': '🇬🇧',
            'es-MX': '🇲🇽'
        };
        
        // Language names
        this.languageNames = {
            'en': 'English (UK)',
            'es-MX': 'Español (México)'
        };
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            if (this.isInitialized) {
                console.warn('FoxTradingApp already initialized');
                return;
            }

            this.log('Initializing FoxTrading App...');

            // Initialize language detector
            this.detector = new LanguageDetector({
                supportedLanguages: this.config.supportedLanguages,
                defaultLanguage: this.config.defaultLanguage,
                fallbackLanguage: this.config.fallbackLanguage
            });

            // Detect initial language
            const detection = this.detector.detectLanguage();
            this.log('Language detection result:', detection);

            // Initialize i18n system
            this.i18n = new I18n({
                supportedLanguages: this.config.supportedLanguages,
                defaultLanguage: detection.language,
                fallbackLanguage: this.config.fallbackLanguage,
                basePath: this.config.basePath
            });

            // Set up event listeners
            this.setupEventListeners();

            // Initialize i18n
            await this.i18n.init();

            // Create and setup language selector
            this.createLanguageSelector();

            // Setup form handlers
            this.setupFormHandlers();

            // Initialize lazy loading for performance
            if (this.config.enableLazyLoading) {
                this.initializeLazyLoading();
            }

            // Preload other language for better UX
            this.preloadLanguages();

            // Mark as initialized
            this.isInitialized = true;

            this.log('FoxTrading App initialized successfully');

            // Analytics/tracking
            this.trackLanguageUsage(detection);

        } catch (error) {
            console.error('Failed to initialize FoxTrading App:', error);
            
            // Fallback initialization
            this.initializeFallback();
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen to i18n events
        this.i18n.on('ready', (data) => {
            this.log('i18n ready:', data);
            this.updateLanguageDisplay();
        });

        this.i18n.on('languageChanged', (data) => {
            this.log('Language changed:', data);
            this.updateLanguageDisplay();
            this.updateURL(data.current);
            this.trackLanguageChange(data);
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleURLChange();
        });

        // Handle page visibility for analytics
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackSessionEnd();
            }
        });
    }

    /**
     * Create language selector UI
     */
    createLanguageSelector() {
        // Remove old language selector if exists
        this.removeOldLanguageSelector();

        // Wait for DOM to be fully ready
        const createSelectors = () => {
            // Find insertion points with multiple fallback options
            const bookCallWrapper = document.querySelector('.book-call-wrapper:not(.is-mobile)') ||
                                   document.querySelector('.nav-menu') ||
                                   document.querySelector('.container-nav');
            
            const mobileBookCall = document.querySelector('.book-call-wrapper.is-mobile') ||
                                  document.querySelector('.nav-menu-phone');

            if (bookCallWrapper) {
                const selector = this.createLanguageSelectorElement('desktop');
                if (bookCallWrapper.classList.contains('nav-menu') || bookCallWrapper.classList.contains('container-nav')) {
                    bookCallWrapper.appendChild(selector);
                } else {
                    bookCallWrapper.parentNode.insertBefore(selector, bookCallWrapper);
                }
                this.log('Desktop language selector created');
            } else {
                this.log('Warning: Could not find desktop insertion point');
            }

            if (mobileBookCall) {
                const selector = this.createLanguageSelectorElement('mobile');
                if (mobileBookCall.classList.contains('nav-menu-phone')) {
                    mobileBookCall.appendChild(selector);
                } else {
                    mobileBookCall.parentNode.insertBefore(selector, mobileBookCall);
                }
                this.log('Mobile language selector created');
            } else {
                this.log('Warning: Could not find mobile insertion point');
            }

            // Update initial display
            this.updateLanguageDisplay();
        };

        // Try immediately, then with delays if needed
        createSelectors();
        
        // Fallback: try again after a short delay if selectors weren't created
        setTimeout(() => {
            if (!document.querySelector('.language-selector')) {
                this.log('Retrying language selector creation...');
                createSelectors();
            }
        }, 100);
    }

    /**
     * Create language selector element
     */
    createLanguageSelectorElement(type) {
        const container = document.createElement('div');
        container.className = `language-selector ${type === 'mobile' ? 'mobile' : 'desktop'}`;
        
        const select = document.createElement('select');
        select.id = type === 'mobile' ? 'language-dropdown-mobile' : 'language-dropdown';
        select.className = 'lang-dropdown';
        select.setAttribute('aria-label', 'Select Language');

        // Add options
        this.config.supportedLanguages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = `${this.flags[lang]} ${this.languageNames[lang]}`;
            select.appendChild(option);
        });

        // Add event listener
        select.addEventListener('change', (e) => {
            this.handleLanguageChange(e.target.value, 'manual');
        });

        container.appendChild(select);
        return container;
    }

    /**
     * Remove old language selector
     */
    removeOldLanguageSelector() {
        const selectors = document.querySelectorAll('.language-selector');
        selectors.forEach(selector => selector.remove());
    }

    /**
     * Handle language change
     */
    async handleLanguageChange(newLanguage, method = 'unknown') {
        try {
            this.log(`Changing language to ${newLanguage} via ${method}`);
            
            // Store user preference
            this.detector.setLanguagePreference(newLanguage);
            
            // Change language in i18n system
            await this.i18n.setLanguage(newLanguage);
            
        } catch (error) {
            console.error('Error changing language:', error);
            this.showLanguageError(error);
        }
    }

    /**
     * Update language display
     */
    updateLanguageDisplay() {
        const currentLang = this.i18n.getCurrentLanguage();
        
        // Update dropdowns
        const selectors = document.querySelectorAll('#language-dropdown, #language-dropdown-mobile');
        selectors.forEach(selector => {
            if (selector) {
                selector.value = currentLang;
            }
        });

        // Add language indicator to body for CSS targeting
        document.body.className = document.body.className.replace(/\blang-\w+/g, '');
        document.body.classList.add(`lang-${currentLang}`);
    }

    /**
     * Update URL with language parameter
     */
    updateURL(language) {
        try {
            const url = new URL(window.location);
            
            if (language !== this.config.defaultLanguage) {
                url.searchParams.set('lang', language);
            } else {
                url.searchParams.delete('lang');
            }
            
            // Update URL without page reload
            window.history.pushState({}, '', url);
            
        } catch (error) {
            console.warn('Error updating URL:', error);
        }
    }

    /**
     * Handle URL changes (back/forward navigation)
     */
    async handleURLChange() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const urlLang = urlParams.get('lang');
            
            if (urlLang && urlLang !== this.i18n.getCurrentLanguage()) {
                await this.handleLanguageChange(urlLang, 'url_navigation');
            }
            
        } catch (error) {
            console.warn('Error handling URL change:', error);
        }
    }

    /**
     * Preload other languages for better UX
     */
    async preloadLanguages() {
        try {
            const currentLang = this.i18n.getCurrentLanguage();
            const otherLangs = this.config.supportedLanguages.filter(lang => lang !== currentLang);
            
            if (otherLangs.length > 0) {
                this.log('Preloading languages:', otherLangs);
                await this.i18n.preloadTranslations(otherLangs);
                this.log('Languages preloaded successfully');
            }
            
        } catch (error) {
            this.log('Error preloading languages:', error);
        }
    }

    /**
     * Setup form handlers with i18n support
     */
    setupFormHandlers() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        });

        // Setup modal form if exists
        const modal = document.getElementById('modal');
        if (modal) {
            this.setupModalForm(modal);
        }
    }

    /**
     * Handle form submission with i18n messages
     */
    async handleFormSubmit(event) {
        try {
            // Add form validation and submission logic here
            // Show success/error messages using i18n
            
            const form = event.target;
            const formData = new FormData(form);
            
            // Example: Show loading message
            this.showMessage(this.i18n.t('form.processing', {}, 'Please wait...'));
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage(this.i18n.t('form.error'), 'error');
        }
    }

    /**
     * Setup modal form
     */
    setupModalForm(modal) {
        const openButtons = document.querySelectorAll('[data-modal="open"]');
        const closeButtons = modal.querySelectorAll('[data-modal="close"], .close-modal');
        
        openButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    /**
     * Open modal
     */
    openModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            const firstInput = modal.querySelector('input, textarea, select');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    /**
     * Show message to user
     */
    showMessage(message, type = 'info') {
        // Create or update notification
        let notification = document.getElementById('foxtrading-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'foxtrading-notification';
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    /**
     * Show language error
     */
    showLanguageError(error) {
        const message = this.i18n.t('errors.languageChange', {}, 'Failed to change language. Please try again.');
        this.showMessage(message, 'error');
    }

    /**
     * Initialize fallback (minimal functionality)
     */
    initializeFallback() {
        console.warn('Initializing fallback mode');
        
        // Set default language
        document.documentElement.lang = this.config.defaultLanguage;
        
        // Create basic language selector
        this.createBasicLanguageSelector();
        
        this.isInitialized = true;
    }

    /**
     * Create basic language selector for fallback
     */
    createBasicLanguageSelector() {
        const bookCall = document.querySelector('.book-call-wrapper:not(.is-mobile)');
        if (!bookCall) return;

        const container = document.createElement('div');
        container.className = 'language-selector basic';
        
        const button = document.createElement('button');
        button.textContent = '🌐 Language';
        button.addEventListener('click', () => {
            alert('Language switching temporarily unavailable');
        });
        
        container.appendChild(button);
        bookCall.parentNode.insertBefore(container, bookCall);
    }

    /**
     * Track language usage for analytics
     */
    trackLanguageUsage(detection) {
        if (!this.debug) return;
        
        try {
            const analytics = {
                language: detection.language,
                method: detection.method,
                confidence: detection.confidence,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
            
            this.log('Language usage:', analytics);
            
            // Here you would send to your analytics service
            // Example: gtag('event', 'language_detected', analytics);
            
        } catch (error) {
            console.warn('Error tracking language usage:', error);
        }
    }

    /**
     * Track language change
     */
    trackLanguageChange(data) {
        if (!this.debug) return;
        
        try {
            const analytics = {
                from: data.previous,
                to: data.current,
                timestamp: new Date().toISOString()
            };
            
            this.log('Language change:', analytics);
            
        } catch (error) {
            console.warn('Error tracking language change:', error);
        }
    }

    /**
     * Track session end
     */
    trackSessionEnd() {
        if (!this.debug) return;
        
        try {
            const analytics = {
                language: this.i18n ? this.i18n.getCurrentLanguage() : 'unknown',
                duration: Date.now() - this.startTime,
                timestamp: new Date().toISOString()
            };
            
            this.log('Session end:', analytics);
            
        } catch (error) {
            console.warn('Error tracking session end:', error);
        }
    }

    /**
     * Initialize lazy loading system
     */
    initializeLazyLoading() {
        try {
            this.log('Initializing lazy loading system...');
            
            this.lazyLoader = new LazyLoader({
                debug: this.debug
            });
            
            this.lazyLoader.init();
            
        } catch (error) {
            console.error('Failed to initialize lazy loading:', error);
            // Continue without lazy loading
        }
    }

    /**
     * Get debug information
     */
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            currentLanguage: this.i18n ? this.i18n.getCurrentLanguage() : null,
            supportedLanguages: this.config.supportedLanguages,
            detectorInfo: this.detector ? this.detector.getDebugInfo() : null,
            i18nStats: this.i18n ? this.i18n.getCacheStats() : null,
            lazyLoaderStats: this.lazyLoader ? this.lazyLoader.getPerformanceStats() : null
        };
    }

    /**
     * Log debug information
     */
    log(...args) {
        if (this.debug) {
            console.log('[FoxTradingApp]', ...args);
        }
    }

    /**
     * Public API for manual language change
     */
    async changeLanguage(language) {
        return this.handleLanguageChange(language, 'api');
    }

    /**
     * Public API to get current language
     */
    getCurrentLanguage() {
        return this.i18n ? this.i18n.getCurrentLanguage() : this.config.defaultLanguage;
    }

    /**
     * Public API to translate text
     */
    translate(key, params) {
        return this.i18n ? this.i18n.translate(key, params) : key;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        window.foxTradingApp = new FoxTradingApp();
        await window.foxTradingApp.init();
    } catch (error) {
        console.error('Failed to initialize FoxTrading App:', error);
    }
});

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FoxTradingApp;
} else if (typeof window !== 'undefined') {
    window.FoxTradingApp = FoxTradingApp;
}