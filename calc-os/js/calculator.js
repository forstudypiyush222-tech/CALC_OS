/**
 * calculator.js - CALC_OS Calculator Engine (Phase-2)
 * 
 * Responsibilities:
 * - State management (tokens, current input, calculation state)
 * - Safe expression parsing and mathematical evaluation
 * - UI updates for the calculator display
 */

// Internal State
let tokens = [];
let currentInput = "";
let lastResult = null;
let isCalculated = false;
let isError = false;

// DOM Elements
let displayExpression;
let displayResult;

/**
 * Initialize calculator logic
 * (Called from app.js on DOMContentLoaded)
 */
function initCalculator() {
    displayExpression = document.getElementById('display-expression');
    displayResult = document.getElementById('display-result');
    
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.addEventListener('click', () => handleKey(key.getAttribute('data-key')));
    });
    
    // Initial display update
    updateDisplay();
}

/**
 * Main key event router
 */
function handleKey(key) {
    if (isError) {
        if (key === 'AC') {
            resetCalculator();
            return;
        }
        // If typing a new digit or decimal after error, reset and start new
        if (/[0-9.]/.test(key)) {
            resetCalculator();
        } else {
            // Ignore additional operators while in error state
            return;
        }
    }

    if (/[0-9]/.test(key)) {
        handleDigit(key);
    } else if (key === '.') {
        handleDecimal();
    } else if (key === 'AC') {
        resetCalculator();
    } else if (key === 'backspace') {
        handleBackspace();
    } else if (key === '%') {
        handlePercentage();
    } else if (key === '=') {
        calculateResult();
    } else {
        // Operators: +, −, ×, ÷
        handleOperator(key);
    }
}

function handleDigit(digit) {
    if (isCalculated) {
        resetCalculator();
    }
    
    if (currentInput.endsWith('%')) {
        currentInput = digit;
    } else if (currentInput === "0") {
        currentInput = digit;
    } else if (currentInput === "-0") {
        currentInput = "-" + digit;
    } else {
        currentInput += digit;
    }
    
    updateDisplay();
}

function handleDecimal() {
    if (isCalculated) {
        resetCalculator();
        currentInput = "0.";
    } else {
        if (currentInput.endsWith('%')) {
            currentInput = "0.";
        } else if (currentInput === "" || currentInput === "-") {
            currentInput += "0.";
        } else if (!currentInput.includes('.')) {
            currentInput += ".";
        }
    }
    updateDisplay();
}

function handleOperator(op) {
    if (isCalculated && !isError) {
        tokens = [lastResult.toString()];
        currentInput = "";
        isCalculated = false;
    }
    
    // Unary minus handling
    if (op === '−' && currentInput === "") {
        if (tokens.length === 0 || isOperator(tokens[tokens.length - 1])) {
            currentInput = "-";
            updateDisplay();
            return;
        }
    }
    
    if (currentInput === "" || currentInput === "-") {
        if (tokens.length > 0 && isOperator(tokens[tokens.length - 1])) {
            if (currentInput === "-") {
                currentInput = "";
            }
            tokens[tokens.length - 1] = op;
        } else if (tokens.length === 0) {
            // Initial Operator Bug Fix: Treat starting value as 0
            tokens.push("0");
            tokens.push(op);
            currentInput = "";
        } else if (tokens.length > 0 && !isOperator(tokens[tokens.length - 1])) {
            // Chaining after calculation / restoration
            tokens.push(op);
        }
    } else {
        tokens.push(currentInput);
        tokens.push(op);
        currentInput = "";
    }
    
    updateDisplay();
}

function handlePercentage() {
    if (currentInput !== "" && currentInput !== "-") {
        if (!currentInput.endsWith('%')) {
            currentInput += "%";
            updateDisplay();
        }
    } else if (isCalculated && lastResult !== null) {
        currentInput = formatNumber(parseFloat(lastResult) / 100);
        tokens = [];
        isCalculated = false;
        updateDisplay();
    }
}

function handleBackspace() {
    if (isCalculated) {
        resetCalculator();
        return;
    }
    
    if (currentInput !== "") {
        currentInput = currentInput.slice(0, -1);
    } else if (tokens.length > 0) {
        // Pop operator
        tokens.pop();
        // Bring the previous number back to currentInput
        if (tokens.length > 0) {
            currentInput = tokens.pop();
        }
    }
    
    updateDisplay();
}

function resetCalculator() {
    tokens = [];
    currentInput = "";
    lastResult = null;
    isCalculated = false;
    isError = false;
    if (displayResult) {
        displayResult.style.fontSize = ''; // Reset inline font sizes
    }
    updateDisplay();
}

function isOperator(token) {
    return ['+', '−', '×', '÷'].includes(token);
}

function calculateResult() {
    if (isCalculated || isError) return;
    
    let evalTokens = [...tokens];
    
    if (currentInput !== "" && currentInput !== "-") {
        evalTokens.push(currentInput);
    } else if (evalTokens.length > 0 && isOperator(evalTokens[evalTokens.length - 1])) {
        // Drop trailing operator for evaluation
        evalTokens.pop();
    }
    
    if (evalTokens.length === 0) return;
    
    // Safely evaluate the tokens
    let res = evaluate(evalTokens);
    
    if (res === "Error") {
        isError = true;
        lastResult = "Error";
    } else {
        lastResult = res;
        isCalculated = true;
        
        if (typeof saveHistoryEntry === 'function') {
            saveHistoryEntry(evalTokens.join(' '), res);
        }
    }
    
    updateDisplay(true);
}

/**
 * Safely evaluates an array of tokens enforcing mathematical precedence
 * (multiplication/division first, then addition/subtraction).
 */
function evaluate(exprTokens) {
    if (exprTokens.length === 0) return 0;
    
    let temp = [];
    
    // Pass 1: Multiplication and Division
    for (let i = 0; i < exprTokens.length; i++) {
        let token = exprTokens[i];
        if (token === '×' || token === '÷') {
            let left = parseFloat(temp.pop());
            let rightToken = exprTokens[++i];
            let isPct = typeof rightToken === 'string' && rightToken.endsWith('%');
            let rightVal = parseFloat(rightToken);
            
            if (isPct) {
                rightVal = rightVal / 100;
            }
            
            if (token === '÷' && rightVal === 0) {
                return "Error"; 
            }
            
            let val = token === '×' ? left * rightVal : left / rightVal;
            temp.push(val);
        } else {
            temp.push(token);
        }
    }
    
    // Pass 2: Addition and Subtraction
    let result = parseFloat(temp[0]);
    if (typeof temp[0] === 'string' && temp[0].endsWith('%')) {
        result = parseFloat(temp[0]) / 100;
    }
    
    for (let i = 1; i < temp.length; i += 2) {
        let op = temp[i];
        let nextToken = temp[i+1];
        let isPct = typeof nextToken === 'string' && nextToken.endsWith('%');
        let nextVal = parseFloat(nextToken);
        
        if (isPct) {
            nextVal = (result * nextVal) / 100;
        }
        
        if (op === '+') {
            result += nextVal;
        } else if (op === '−') {
            result -= nextVal;
        }
    }
    
    if (isNaN(result) || !isFinite(result)) {
        return "Error"; 
    }
    
    return formatNumber(result);
}

/**
 * Formats numbers by removing floating point precision errors
 * while adhering to the Phase-2 "plain numeric string" rules.
 */
function formatNumber(num) {
    let str = num.toFixed(10);
    if (str.includes('.')) {
        str = str.replace(/0+$/, ''); // Strip trailing zeros
        str = str.replace(/\.$/, ''); // Strip trailing dot if present
    }
    if (str === "-0") return "0"; // Normalize negative zero
    return str;
}

/**
 * Adds thousands separators for the large display only.
 * Preserves decimal values identically.
 */
function addCommas(str) {
    if (str === "Error" || str === "-") return str;
    let parts = str.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
}

/**
 * Updates the expression and result DOM elements
 */
function updateDisplay(showingResult = false) {
    if (!displayExpression || !displayResult) return;
    
    // Prevent wrapping to maintain single line scaling
    displayExpression.style.whiteSpace = 'nowrap';
    displayResult.style.whiteSpace = 'nowrap';
    
    let evalTokens = [...tokens];
    if (currentInput !== "" && currentInput !== "-") {
        evalTokens.push(currentInput);
    }
    
    let exprStr = evalTokens.join(' ');
    
    if (isError) {
        displayExpression.textContent = exprStr.trim();
        displayResult.textContent = "Error";
        adjustFontSize();
        return;
    }
    
    if (showingResult) {
        // Strip trailing operators for clean display
        let finalTokens = [...evalTokens];
        if (finalTokens.length > 0 && isOperator(finalTokens[finalTokens.length - 1])) {
            finalTokens.pop();
        }
        displayExpression.textContent = finalTokens.join(' ').trim();
        displayResult.textContent = addCommas(formatNumber(parseFloat(lastResult))); 
    } else {
        displayExpression.textContent = exprStr.trim();
        
        // Live evaluation for the large display
        let liveResult = "0";
        if (evalTokens.length > 0) {
            let temp = [...evalTokens];
            if (isOperator(temp[temp.length - 1])) {
                temp.pop();
            }
            if (temp.length === 1 && temp[0] === "-") {
                liveResult = "-";
            } else if (temp.length > 0) {
                let res = evaluate(temp);
                liveResult = res === "Error" ? "Error" : res;
            }
        }
        
        if (liveResult === "-0") liveResult = "0";
        
        // Ensure unary minus is displayed cleanly when typing
        if (currentInput === "-" && evalTokens.length === 0) {
            displayResult.textContent = "-";
        } else {
            displayResult.textContent = addCommas(liveResult.toString());
        }
    }
    
    adjustFontSize();
}

/**
 * Dynamically scales down font size to prevent overflow clipping.
 */
function adjustFontSize() {
    if (!displayResult || !displayExpression) return;
    
    // Reset to default sizing
    displayResult.style.fontSize = '';
    
    let fontSize = 80; // Baseline from CSS
    const minFontSize = 35;
    
    const container = displayResult.parentElement;
    
    // Safely reduce font size until text fits or min size is reached
    while (displayResult.scrollWidth > container.clientWidth && fontSize > minFontSize) {
        fontSize -= 2;
        displayResult.style.fontSize = fontSize + 'px';
    }
    
    // Auto-scroll to keep newest digits visible
    if (displayResult.scrollWidth > container.clientWidth) {
        container.scrollLeft = displayResult.scrollWidth;
    } else {
        container.scrollLeft = 0;
    }
    
    const exprContainer = displayExpression.parentElement;
    if (displayExpression.scrollWidth > exprContainer.clientWidth) {
        exprContainer.scrollLeft = displayExpression.scrollWidth;
    } else {
        exprContainer.scrollLeft = 0;
    }
}

/**
 * Restores the calculator state from a history card.
 * Acts as if the user JUST hit '=' on that expression.
 */
function restoreCalculation(exprStr, resStr) {
    if (!displayExpression || !displayResult) return;
    
    // Reset internal state completely
    tokens = [];
    currentInput = "";
    isError = false;
    
    // Set exactly to the saved result
    lastResult = resStr;
    isCalculated = true;
    
    // Forcibly update DOM to match the exact saved state
    displayExpression.textContent = exprStr;
    displayResult.textContent = addCommas(formatNumber(parseFloat(resStr)));
    
    adjustFontSize();
}
