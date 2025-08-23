/**
 * Language Detection Module
 * Handles automatic language detection based on various signals
 */
class LanguageDetector {
    constructor(options = {}) {
        this.supportedLanguages = options.supportedLanguages || ['en', 'es-MX'];
        this.defaultLanguage = options.defaultLanguage || 'en';
        this.fallbackLanguage = options.fallbackLanguage || 'en';
        
        // Mexican timezone identifiers
        this.mexicanTimezones = [
            'America/Mexico_City',
            'America/Cancun',
            'America/Merida',
            'America/Monterrey',
            'America/Mazatlan',
            'America/Chihuahua',
            'America/Hermosillo',
            'America/Tijuana',
            'America/Bahia_Banderas'
        ];
        
        // Storage keys
        this.storageKeys = {
            language: 'foxtrading_language',
            detectionMethod: 'foxtrading_detection_method',
            lastDetection: 'foxtrading_last_detection'
        };
    }

    /**
     * Detect the most appropriate language for the user
     * @param {Object} options - Detection options
     * @returns {Object} Detection result with language and method
     */
    detectLanguage(options = {}) {
        const {
            checkURL = true,
            checkStorage = true,
            checkBrowser = true,
            checkTimezone = true,
            respectUserChoice = true
        } = options;

        const detectionResult = {
            language: this.defaultLanguage,
            method: 'default',
            confidence: 0,
            signals: []
        };

        try {
            // 1. Check URL parameter first (highest priority)
            if (checkURL) {
                const urlLang = this._detectFromURL();
                if (urlLang.detected) {
                    detectionResult.language = urlLang.language;
                    detectionResult.method = 'url';
                    detectionResult.confidence = 1.0;
                    detectionResult.signals.push(urlLang);
                    
                    // Store the URL-based selection
                    this._storeDetection(detectionResult);
                    return detectionResult;
                }
            }

            // 2. Check stored user preference (high priority)
            if (checkStorage && respectUserChoice) {
                const storedLang = this._detectFromStorage();
                if (storedLang.detected && this._isRecentDetection()) {
                    detectionResult.language = storedLang.language;
                    detectionResult.method = 'stored';
                    detectionResult.confidence = 0.9;
                    detectionResult.signals.push(storedLang);
                    return detectionResult;
                }
            }

            // 3. Check browser language preferences
            if (checkBrowser) {
                const browserLang = this._detectFromBrowser();
                detectionResult.signals.push(browserLang);
                
                if (browserLang.detected) {
                    detectionResult.language = browserLang.language;
                    detectionResult.method = 'browser';
                    detectionResult.confidence = browserLang.confidence;
                }
            }

            // 4. Check timezone (can override browser detection for Mexico)
            if (checkTimezone) {
                const timezoneLang = this._detectFromTimezone();
                detectionResult.signals.push(timezoneLang);
                
                if (timezoneLang.detected) {
                    // Mexican timezone detection overrides non-Mexican browser settings
                    if (timezoneLang.language === 'es-MX') {
                        detectionResult.language = timezoneLang.language;
                        detectionResult.method = 'timezone';
                        detectionResult.confidence = Math.max(detectionResult.confidence, 0.7);
                    }
                }
            }

            // 5. Final validation
            if (!this.supportedLanguages.includes(detectionResult.language)) {
                detectionResult.language = this.fallbackLanguage;
                detectionResult.method = 'fallback';
                detectionResult.confidence = 0.1;
            }

            // Store the detection result
            this._storeDetection(detectionResult);
            
            return detectionResult;
            
        } catch (error) {
            console.error('Error in language detection:', error);
            return {
                language: this.fallbackLanguage,
                method: 'error_fallback',
                confidence: 0,
                signals: [],
                error: error.message
            };
        }
    }

    /**
     * Detect language from URL parameters
     * @private
     */
    _detectFromURL() {
        const result = { detected: false, language: null, source: 'url' };
        
        try {
            // First check for path-based routing (e.g., /es-MX)
            const pathname = window.location.pathname;
            const pathSegments = pathname.split('/').filter(segment => segment.length > 0);
            
            // Check if first path segment is a supported language
            if (pathSegments.length > 0) {
                const potentialLang = pathSegments[0];
                if (this.supportedLanguages.includes(potentialLang)) {
                    result.detected = true;
                    result.language = potentialLang;
                    result.confidence = 1.0;
                    result.method = 'path';
                    return result;
                }
            }
            
            // Fallback to query parameter detection (?lang=es-MX)
            const urlParams = new URLSearchParams(window.location.search);
            const langParam = urlParams.get('lang') || urlParams.get('language');
            
            if (langParam && this.supportedLanguages.includes(langParam)) {
                result.detected = true;
                result.language = langParam;
                result.confidence = 1.0;
                result.method = 'query';
            }
            
        } catch (error) {
            console.warn('Error detecting language from URL:', error);
        }
        
        return result;
    }

    /**
     * Detect language from localStorage
     * @private
     */
    _detectFromStorage() {
        const result = { detected: false, language: null, source: 'storage' };
        
        try {
            const storedLang = localStorage.getItem(this.storageKeys.language);
            
            if (storedLang && this.supportedLanguages.includes(storedLang)) {
                result.detected = true;
                result.language = storedLang;
                result.confidence = 0.9;
                result.timestamp = localStorage.getItem(this.storageKeys.lastDetection);
            }
            
        } catch (error) {
            console.warn('Error reading from localStorage:', error);
        }
        
        return result;
    }

    /**
     * Detect language from browser settings
     * @private
     */
    _detectFromBrowser() {
        const result = { detected: false, language: null, source: 'browser', confidence: 0 };
        
        try {
            // Get browser languages in order of preference
            const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage];
            
            for (const browserLang of browserLanguages) {
                const normalized = this._normalizeBrowserLanguage(browserLang);
                
                if (this.supportedLanguages.includes(normalized.full)) {
                    result.detected = true;
                    result.language = normalized.full;
                    result.confidence = 0.8;
                    result.browserLanguage = browserLang;
                    result.normalized = normalized;
                    break;
                }
                
                // Check base language (e.g., 'es' for 'es-MX')
                if (this.supportedLanguages.includes(normalized.base)) {
                    result.detected = true;
                    result.language = normalized.base;
                    result.confidence = 0.6;
                    result.browserLanguage = browserLang;
                    result.normalized = normalized;
                    break;
                }
            }
            
            result.allBrowserLanguages = browserLanguages;
            
        } catch (error) {
            console.warn('Error detecting browser language:', error);
        }
        
        return result;
    }

    /**
     * Detect language from timezone
     * @private
     */
    _detectFromTimezone() {
        const result = { detected: false, language: null, source: 'timezone', confidence: 0 };
        
        try {
            // Get user timezone
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            result.detectedTimezone = timezone;
            
            // Check if timezone indicates Mexico
            if (this.mexicanTimezones.includes(timezone)) {
                result.detected = true;
                result.language = 'es-MX';
                result.confidence = 0.7;
                result.reason = 'mexican_timezone';
            }
            
            // Additional timezone-based detection logic can be added here
            // For example, checking for other Spanish-speaking countries
            
        } catch (error) {
            console.warn('Error detecting timezone:', error);
        }
        
        return result;
    }

    /**
     * Normalize browser language code
     * @private
     */
    _normalizeBrowserLanguage(browserLang) {
        const normalized = {
            original: browserLang,
            full: null,
            base: null,
            region: null
        };
        
        try {
            // Convert to lowercase and handle different formats
            const clean = browserLang.toLowerCase().replace('_', '-');
            const parts = clean.split('-');
            
            normalized.base = parts[0];
            normalized.region = parts[1];
            
            // Handle specific cases
            if (normalized.base === 'es') {
                if (normalized.region === 'mx') {
                    normalized.full = 'es-MX';
                } else {
                    // Default Spanish to Mexican Spanish for this project
                    normalized.full = 'es-MX';
                }
            } else if (normalized.base === 'en') {
                // Default English to British English
                normalized.full = 'en';
            } else {
                normalized.full = normalized.base;
            }
            
        } catch (error) {
            console.warn('Error normalizing browser language:', browserLang, error);
        }
        
        return normalized;
    }

    /**
     * Check if stored detection is recent
     * @private
     */
    _isRecentDetection() {
        try {
            const lastDetection = localStorage.getItem(this.storageKeys.lastDetection);
            if (!lastDetection) return false;
            
            const detectionTime = new Date(lastDetection);
            const now = new Date();
            const daysDiff = (now - detectionTime) / (1000 * 60 * 60 * 24);
            
            // Consider detection recent if less than 30 days old
            return daysDiff < 30;
            
        } catch (error) {
            return false;
        }
    }

    /**
     * Store detection result
     * @private
     */
    _storeDetection(detectionResult) {
        try {
            localStorage.setItem(this.storageKeys.language, detectionResult.language);
            localStorage.setItem(this.storageKeys.detectionMethod, detectionResult.method);
            localStorage.setItem(this.storageKeys.lastDetection, new Date().toISOString());
        } catch (error) {
            console.warn('Error storing detection result:', error);
        }
    }

    /**
     * Force refresh detection (ignores stored preferences)
     */
    refreshDetection() {
        try {
            // Clear stored preferences
            localStorage.removeItem(this.storageKeys.language);
            localStorage.removeItem(this.storageKeys.detectionMethod);
            localStorage.removeItem(this.storageKeys.lastDetection);
            
            // Run fresh detection
            return this.detectLanguage({ checkStorage: false });
            
        } catch (error) {
            console.error('Error refreshing detection:', error);
            return this.detectLanguage();
        }
    }

    /**
     * Get detection debug information
     */
    getDebugInfo() {
        const debug = {
            supportedLanguages: this.supportedLanguages,
            defaultLanguage: this.defaultLanguage,
            mexicanTimezones: this.mexicanTimezones,
            browser: {
                languages: navigator.languages || [navigator.language],
                timezone: null,
                userAgent: navigator.userAgent
            },
            storage: {}
        };
        
        try {
            debug.browser.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (e) {
            debug.browser.timezone = 'unknown';
        }
        
        try {
            debug.storage.language = localStorage.getItem(this.storageKeys.language);
            debug.storage.method = localStorage.getItem(this.storageKeys.detectionMethod);
            debug.storage.lastDetection = localStorage.getItem(this.storageKeys.lastDetection);
        } catch (e) {
            debug.storage.error = 'localStorage not available';
        }
        
        return debug;
    }

    /**
     * Manually set language preference
     */
    setLanguagePreference(language) {
        if (!this.supportedLanguages.includes(language)) {
            throw new Error(`Unsupported language: ${language}`);
        }
        
        const result = {
            language: language,
            method: 'manual',
            confidence: 1.0,
            timestamp: new Date().toISOString()
        };
        
        this._storeDetection(result);
        return result;
    }

    /**
     * Clear all stored preferences
     */
    clearPreferences() {
        try {
            Object.values(this.storageKeys).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing preferences:', error);
            return false;
        }
    }
}

// Export for both ES6 modules and global usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageDetector;
} else if (typeof window !== 'undefined') {
    window.LanguageDetector = LanguageDetector;
}