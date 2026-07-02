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

// Gesture tracking variables
let startY = 0;
let currentY = 0;
let isDragging = false;
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
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeHistory);
    }
    
    if (backdrop) {
        backdrop.addEventListener('click', closeHistory);
    }
    
    // Wire optional swipe-down dismiss
    if (dragHandleContainer) {
        initDragGestures();
    }
});

/**
 * Opens the history bottom sheet
 */
function openHistory() {
    if (!historySheet || !backdrop || !calculatorContainer) return;
    
    // Make backdrop visible and interactive
    backdrop.classList.add('visible');
    
    // Slide up history sheet
    historySheet.classList.add('open');
    historySheet.setAttribute('aria-hidden', 'false');
    
    // Apply dim/blur effect to calculator in background
    calculatorContainer.classList.add('dim-blur');
}

/**
 * Closes the history bottom sheet
 */
function closeHistory() {
    if (!historySheet || !backdrop || !calculatorContainer) return;
    
    // Hide and disable backdrop
    backdrop.classList.remove('visible');
    
    // Slide down history sheet
    historySheet.classList.remove('open');
    historySheet.setAttribute('aria-hidden', 'true');
    historySheet.style.transform = ''; // reset any inline transform from dragging
    
    // Remove dim/blur effect from calculator
    calculatorContainer.classList.remove('dim-blur');
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
