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

/**
 * Initialize theme toggle functionality
 */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    if (!themeToggleBtn || !themeIcon) return;
    
    themeToggleBtn.addEventListener('click', () => {
        // Toggle the .light class on body
        const isLightMode = document.body.classList.toggle('light');
        
        // Update the material symbol icon text
        if (isLightMode) {
            themeIcon.textContent = 'light_mode';
        } else {
            themeIcon.textContent = 'dark_mode';
        }
    });
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
    
    // Wire global ESC key to close history panel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const historySheet = document.getElementById('history-sheet');
            // If history is currently open, close it
            if (historySheet && historySheet.classList.contains('open') && typeof closeHistory === 'function') {
                closeHistory();
            }
        }
    });
}
