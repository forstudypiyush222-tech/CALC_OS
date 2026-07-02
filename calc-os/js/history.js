/**
 * history.js - CALC_OS History Bottom Sheet Logic (Phase-1)
 * 
 * Responsibilities:
 * - Opening and closing the history bottom sheet
 * - Handling backdrop clicks to close
 * - Basic swipe-down-to-dismiss gesture on the drag handle
 */

// Shared DOM elements
let historySheet;
let backdrop;
let calculatorContainer;
let closeBtn;
let dragHandleContainer;
let historyToggleBtn;

// State Management
let historyData = [];
const HISTORY_STORAGE_KEY = 'calc_os_history';
const MAX_HISTORY_ITEMS = 100;

// Gesture tracking variables
let startY = 0;
let currentY = 0;
let isDragging = false;
let isAnimating = false; // Prevents overlapping animations
// Height threshold to trigger dismissal (e.g. 150px)
const DISMISS_THRESHOLD = 150;

/**
 * Initialize history elements and event listeners
 */
document.addEventListener('DOMContentLoaded', () => {
    historySheet = document.getElementById('history-sheet');
    backdrop = document.getElementById('backdrop');
    calculatorContainer = document.getElementById('calculator-container');
    closeBtn = document.getElementById('history-close-btn');
    dragHandleContainer = document.getElementById('drag-handle-container');
    historyToggleBtn = document.getElementById('history-toggle');
    
    if (historySheet) {
        historySheet.inert = true;
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeHistory);
    }
    
    if (backdrop) {
        backdrop.addEventListener('click', closeHistory);
    }
    
    if (dragHandleContainer) {
        initDragGestures();
    }
    
    const clearBtn = document.getElementById('history-clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', confirmClearHistory);
    }
    
    const historyList = document.getElementById('history-list');
    if (historyList) {
        historyList.addEventListener('click', handleHistoryListClick);
    }
    
    initHistory();
});

/**
 * Opens the history bottom sheet
 */
function openHistory() {
    if (isAnimating) return;
    if (!historySheet || !backdrop || !calculatorContainer) return;
    if (historySheet.classList.contains('open')) return;
    
    isAnimating = true;
    
    // Make backdrop visible and interactive
    backdrop.classList.add('visible');
    
    // Slide up history sheet
    historySheet.inert = false;
    historySheet.classList.add('open');
    historySheet.setAttribute('aria-hidden', 'false');
    
    // Apply dim/blur effect to calculator in background
    calculatorContainer.classList.add('dim-blur');
    
    if (closeBtn) {
        closeBtn.focus();
    }
    
    setTimeout(() => {
        isAnimating = false;
    }, 400); // 400ms CSS transition
}

/**
 * Closes the history bottom sheet
 */
function closeHistory() {
    if (isAnimating) return;
    if (!historySheet || !backdrop || !calculatorContainer) return;
    if (!historySheet.classList.contains('open')) return;
    
    isAnimating = true;
    
    if (historyToggleBtn) {
        historyToggleBtn.focus();
    }
    
    historySheet.inert = true;
    
    // Hide and disable backdrop
    backdrop.classList.remove('visible');
    
    // Slide down history sheet
    historySheet.classList.remove('open');
    historySheet.setAttribute('aria-hidden', 'true');
    historySheet.style.transform = ''; // reset any inline transform from dragging
    
    // Remove dim/blur effect from calculator
    calculatorContainer.classList.remove('dim-blur');
    
    setTimeout(() => {
        isAnimating = false;
    }, 400);
}

/**
 * Setup basic drag/swipe gesture on the handle
 */
function initDragGestures() {
    // Touch Events
    dragHandleContainer.addEventListener('touchstart', onDragStart, { passive: true });
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
    
    // Mouse Events for desktop testing
    dragHandleContainer.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
}

function onDragStart(e) {
    if (!historySheet.classList.contains('open')) return;
    
    isDragging = true;
    startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    
    // Disable transition during drag for 1:1 movement
    historySheet.style.transition = 'none';
}

function onDragMove(e) {
    if (!isDragging) return;
    
    currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    const deltaY = currentY - startY;
    
    // Only allow dragging downwards (deltaY > 0)
    if (deltaY > 0) {
        // Prevent default scrolling when dragging the sheet down
        if (e.cancelable) e.preventDefault();
        historySheet.style.transform = `translateY(${deltaY}px)`;
    }
}

function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    
    // Re-enable CSS transition
    historySheet.style.transition = 'transform 0.4s cubic-bezier(0.32, 0, 0.67, 0)';
    
    const deltaY = currentY - startY;
    
    // If dragged past threshold, close it
    if (deltaY > DISMISS_THRESHOLD) {
        closeHistory();
    } else {
        // Snap back to open position
        historySheet.style.transform = 'translateY(0)';
        
        // Clean up inline style after transition
        setTimeout(() => {
            if (historySheet.classList.contains('open')) {
                historySheet.style.transform = '';
            }
        }, 400);
    }
    
    // Reset values
    startY = 0;
    currentY = 0;
}

// --------------------------------------------------
// History System (Phase-3)
// --------------------------------------------------

function initHistory() {
    try {
        const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (stored) {
            historyData = JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to load history from LocalStorage", e);
        historyData = [];
    }
    
    renderHistoryList();
}

function saveToLocalStorage() {
    try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyData));
    } catch (e) {
        console.error("Failed to save history to LocalStorage", e);
    }
}

/**
 * Called by calculator.js upon '=' completion.
 */
function saveHistoryEntry(expression, result) {
    if (!expression || !result) return;
    
    // Prevent consecutive duplicate expressions
    if (historyData.length > 0 && historyData[0].expression === expression) {
        return;
    }
    
    const entry = {
        id: crypto.randomUUID ? crypto.randomUUID() : (Date.now() + Math.random().toString(36).slice(2)),
        expression: expression,
        result: result,
        timestamp: Date.now()
    };
    
    historyData.unshift(entry);
    
    if (historyData.length > MAX_HISTORY_ITEMS) {
        historyData.pop();
    }
    
    saveToLocalStorage();
    addHistoryCardToDOM(entry);
}

function renderHistoryList() {
    const list = document.getElementById('history-list');
    if (!list) return;
    
    if (historyData.length === 0) {
        list.innerHTML = `
            <div class="empty-history">
                <h3 class="font-headline-sm">No History Yet</h3>
                <p class="font-label-md">Your completed calculations will appear here.</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    historyData.forEach(entry => {
        fragment.appendChild(createHistoryCardElement(entry));
    });
    
    list.appendChild(fragment);
}

function createHistoryCardElement(entry, animateEnter = false) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'history-card' + (animateEnter ? ' history-card-enter' : '');
    btn.setAttribute('data-id', entry.id);
    btn.setAttribute('data-expr', entry.expression);
    btn.setAttribute('data-res', entry.result);
    btn.setAttribute('aria-label', `Restore calculation: ${entry.expression} equals ${entry.result}`);
    
    const timeStr = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const header = document.createElement('div');
    header.className = 'history-card-header';
    
    const exprSpan = document.createElement('span');
    exprSpan.className = 'history-card-expression font-label-md';
    exprSpan.textContent = entry.expression;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'history-card-time font-label-md';
    timeSpan.textContent = timeStr;
    
    header.appendChild(exprSpan);
    header.appendChild(timeSpan);
    
    const resultDiv = document.createElement('div');
    resultDiv.className = 'history-card-result';
    resultDiv.textContent = addCommasForHistory(entry.result);
    
    btn.appendChild(header);
    btn.appendChild(resultDiv);
    
    if (animateEnter) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                btn.classList.add('history-card-enter-active');
                setTimeout(() => {
                    btn.classList.remove('history-card-enter', 'history-card-enter-active');
                }, 250);
            });
        });
    }
    
    return btn;
}

function addCommasForHistory(str) {
    if (str === "Error" || str === "-") return str;
    let parts = str.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
}

function addHistoryCardToDOM(entry) {
    const list = document.getElementById('history-list');
    if (!list) return;
    
    const emptyState = list.querySelector('.empty-history');
    if (emptyState) {
        list.removeChild(emptyState);
    }
    
    const card = createHistoryCardElement(entry, true);
    list.insertBefore(card, list.firstChild);
    
    const cards = list.querySelectorAll('.history-card');
    if (cards.length > MAX_HISTORY_ITEMS) {
        list.removeChild(cards[cards.length - 1]);
    }
}

function handleHistoryListClick(e) {
    const card = e.target.closest('.history-card');
    if (!card) return;
    
    const expr = card.getAttribute('data-expr');
    const res = card.getAttribute('data-res');
    
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
        card.style.transform = '';
        
        if (typeof restoreCalculation === 'function') {
            restoreCalculation(expr, res);
            closeHistory();
        }
    }, 100);
}

function confirmClearHistory() {
    if (isAnimating) return;
    if (historyData.length === 0) return;
    
    const isConfirmed = window.confirm("Are you sure you want to clear all history?");
    if (isConfirmed) {
        historyData = [];
        saveToLocalStorage();
        
        const list = document.getElementById('history-list');
        if (list) {
            isAnimating = true;
            const cards = list.querySelectorAll('.history-card');
            cards.forEach(card => card.classList.add('history-card-exit'));
            
            setTimeout(() => {
                renderHistoryList();
                isAnimating = false;
            }, 250);
        }
    }
}

function isHistoryOpen() {
    return historySheet && historySheet.classList.contains('open');
}

function processHistoryKey(e) {
    if (e.key === 'Escape') {
        closeHistory();
        e.preventDefault();
        return;
    }
    
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const cards = Array.from(document.querySelectorAll('.history-card'));
        if (cards.length === 0) return;
        
        const active = document.activeElement;
        const currentIndex = cards.indexOf(active);
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentIndex < cards.length - 1) {
                cards[currentIndex + 1].focus();
            } else if (currentIndex === -1) {
                cards[0].focus();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                cards[currentIndex - 1].focus();
            } else if (currentIndex === 0) {
                if (closeBtn) closeBtn.focus();
            } else if (currentIndex === -1) {
                cards[cards.length - 1].focus();
            }
        }
    }
}
