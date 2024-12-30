let display = document.getElementById("display");
let currentInput = "";
let operator = null;

/* Append Number to Input */
function appendNumber(number) {
    if (currentInput === "0" && number !== ".") {
        currentInput = "";
    }
    currentInput += number;
    updateDisplay();
}

/* Append Operator */
function appendOperator(op) {
    if (operator !== null) {
        calculate();
    }
    currentInput += ` ${op} `;
    operator = op;
    updateDisplay();
}

/* Update Display */
function updateDisplay() {
    display.textContent = currentInput || "0";
}

/* Clear Display */
function clearDisplay() {
    currentInput = "";
    operator = null;
    updateDisplay();
}

/* Delete Last Input */
function deleteLast() {
    currentInput = currentInput.slice(0, -1).trim();
    updateDisplay();
}

/* Calculate Result */
function calculate() {
    try {
        currentInput = eval(currentInput.replace("×", "*").replace("÷", "/"));
        operator = null;
        updateDisplay();
    } catch (error) {
        display.textContent = "Error";
        currentInput = "";
    }
}
