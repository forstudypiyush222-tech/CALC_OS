/**
 * app.js - CALC_OS Phase-1 Application Initialization and Theme Management
 * 
 * Responsibilities:
 * - App initialization on DOMContentLoaded
 * - Theme toggle (dark/light mode)
 * - Basic UI wiring (history button, ESC key)
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initGlobalEvents();
    
    // Initialize calculator engine
    if (typeof initCalculator === 'function') {
        initCalculator();
    }
});

function toggleTheme() {
    const themeIcon = document.getElementById('theme-icon');
    if (!themeIcon) return;
    
    // Toggle the .light class on body
    const isLightMode = document.body.classList.toggle('light');
    
    // Update the material symbol icon text
    if (isLightMode) {
        themeIcon.textContent = 'light_mode';
    } else {
        themeIcon.textContent = 'dark_mode';
    }
}

/**
 * Initialize theme toggle functionality
 */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    
    themeToggleBtn.addEventListener('click', toggleTheme);
}

/**
 * Initialize global application events
 */
function initGlobalEvents() {
    // Wire main history toggle button
    const historyToggleBtn = document.getElementById('history-toggle');
    if (historyToggleBtn && typeof openHistory === 'function') {
        historyToggleBtn.addEventListener('click', openHistory);
    }
    
    // Single Global Keyboard Router
    document.addEventListener('keydown', (e) => {
        // 1. Input Safety Guard
        const activeEl = document.activeElement;
        if (activeEl) {
            const tag = activeEl.tagName.toLowerCase();
            const isInput = tag === 'input' || tag === 'textarea' || tag === 'select' || activeEl.isContentEditable;
            if (isInput) return; // Ignore calculator shortcuts completely
            
            // 2. Prevent Duplicate Enter / Space Activation on buttons
            if (tag === 'button' && (e.key === 'Enter' || e.key === ' ')) {
                if (e.key === ' ') {
                    e.preventDefault(); // Prevent page scrolling
                    activeEl.click();   // Explicitly fire click if prevented
                }
                // Do NOT dispatch to the calculator engine
                return;
            }
        }

        // 3. Application-Level Shortcuts
        if (e.key === 'F6') {
            e.preventDefault();
            if (typeof isHistoryOpen === 'function' && isHistoryOpen()) {
                if (typeof closeHistory === 'function') closeHistory();
            } else {
                if (typeof openHistory === 'function') openHistory();
            }
            return;
        }
        
        if (e.key === 'F7') {
            e.preventDefault();
            toggleTheme();
            return;
        }

        // Prevent browser 'Backspace' navigation
        if (e.key === 'Backspace' && e.target === document.body) {
            e.preventDefault();
        }

        // 4. Delegate Based on Application State
        if (typeof isHistoryOpen === 'function' && isHistoryOpen()) {
            if (typeof processHistoryKey === 'function') {
                processHistoryKey(e);
            }
        } else {
            if (typeof processCalculatorKey === 'function') {
                if (e.key === '/') e.preventDefault(); // Prevent quick find feature in some browsers
                processCalculatorKey(e.key);
            }
        }
    });
}
