/**
 * Language Dropdown Functions
 * Handles the language icon dropdown functionality
 */

// Track currently open dropdown
let currentOpenDropdown = null;

/**
 * Toggle language dropdown visibility
 * @param {string} type - Type of dropdown (main, scroll, mobile)
 */
function toggleLanguageDropdown(type = 'navbar') {
    console.log('🎯 Language dropdown clicked!', type);
    const dropdownId = `language-dropdown-${type}`;
    const dropdown = document.getElementById(dropdownId);
    
    if (!dropdown) {
        console.warn(`Dropdown ${dropdownId} not found`);
        return;
    }
    
    console.log('🎯 Found dropdown:', dropdown);
    
    // Close any other open dropdowns
    if (currentOpenDropdown && currentOpenDropdown !== dropdown) {
        currentOpenDropdown.classList.remove('show');
    }
    
    // Toggle current dropdown
    const isShowing = dropdown.classList.contains('show');
    console.log('🎯 Dropdown currently showing:', isShowing);
    
    if (isShowing) {
        dropdown.classList.remove('show');
        currentOpenDropdown = null;
        console.log('🎯 Dropdown closed');
    } else {
        dropdown.classList.add('show');
        currentOpenDropdown = dropdown;
        console.log('🎯 Dropdown opened');
    }
}

/**
 * Change language from dropdown selection
 * @param {string} languageCode - Language code (en-SG, es-MX)
 */
function changeLanguageFromDropdown(languageCode) {
    console.log(`Changing language to: ${languageCode}`);
    
    // Close all dropdowns
    const dropdowns = document.querySelectorAll('.language-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
    currentOpenDropdown = null;
    
    // Change language using the app's language system
    if (window.app && typeof window.app.changeLanguage === 'function') {
        window.app.changeLanguage(languageCode);
    } else {
        console.warn('App language system not available');
        // Fallback: reload page with language parameter
        const url = new URL(window.location);
        url.searchParams.set('lang', languageCode);
        window.location.href = url.toString();
    }
}

/**
 * Close dropdown when clicking outside
 */
function handleClickOutside(event) {
    const languageWrappers = document.querySelectorAll('.language-icon-wrapper');
    let clickedInside = false;
    
    languageWrappers.forEach(wrapper => {
        if (wrapper.contains(event.target)) {
            clickedInside = true;
        }
    });
    
    if (!clickedInside && currentOpenDropdown) {
        currentOpenDropdown.classList.remove('show');
        currentOpenDropdown = null;
    }
}

/**
 * Handle keyboard navigation
 */
function handleKeyDown(event) {
    if (event.key === 'Escape' && currentOpenDropdown) {
        currentOpenDropdown.classList.remove('show');
        currentOpenDropdown = null;
    }
}

/**
 * Initialize dropdown event listeners
 */
function initLanguageDropdown() {
    // Add click outside listener
    document.addEventListener('click', handleClickOutside);
    
    // Add keyboard listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Update current language display when language changes
    if (window.app) {
        window.app.on('languageChanged', () => {
            updateLanguageDisplay();
        });
    }
    
    console.log('Language dropdown initialized');
}

/**
 * Update the current language display in dropdowns
 */
function updateLanguageDisplay() {
    // This will be called when language changes to update any visual indicators
    console.log('Language display updated');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageDropdown);
} else {
    initLanguageDropdown();
}

// Export functions for global access
window.toggleLanguageDropdown = toggleLanguageDropdown;
window.changeLanguageFromDropdown = changeLanguageFromDropdown;