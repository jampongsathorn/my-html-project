const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  // Limit display length to prevent overflow
  if (currentInput.length > 12) {
    display.textContent = currentInput.slice(0, 12);
  } else {
    display.textContent = currentInput;
  }
}

function inputNumber(num) {
  if (shouldResetDisplay) {
    currentInput = num;
    shouldResetDisplay = false;
  } else {
    currentInput = currentInput === '0' ? num : currentInput + num;
  }
  updateDisplay();
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentInput = '0.';
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
  }
  updateDisplay();
}

function inputOperator(op) {
  if (operator && !shouldResetDisplay) {
    calculate();
  }
  previousInput = currentInput;
  operator = op;
  shouldResetDisplay = true;
}

function calculate() {
  if (!operator || shouldResetDisplay) return;

  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  let result;

  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) {
        currentInput = 'Error';
        updateDisplay();
        operator = null;
        previousInput = '';
        shouldResetDisplay = true;
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }

  // Round to avoid floating point issues
  currentInput = String(parseFloat(result.toFixed(10)));
  operator = null;
  previousInput = '';
  shouldResetDisplay = true;
  updateDisplay();
}

function clearAll() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLast() {
  if (shouldResetDisplay) return;
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
  updateDisplay();
}

// Button click handler
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (currentInput === 'Error' && action !== 'clear') {
      clearAll();
    }

    switch (action) {
      case 'number':
        inputNumber(value);
        break;
      case 'decimal':
        inputDecimal();
        break;
      case 'operator':
        inputOperator(value);
        break;
      case 'equals':
        calculate();
        break;
      case 'clear':
        clearAll();
        break;
      case 'delete':
        deleteLast();
        break;
    }
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (currentInput === 'Error' && e.key !== 'Escape' && e.key !== 'c') {
    clearAll();
  }

  if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
  if (e.key === '.') inputDecimal();
  if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') inputOperator(e.key);
  if (e.key === 'Enter' || e.key === '=') calculate();
  if (e.key === 'Escape' || e.key === 'c') clearAll();
  if (e.key === 'Backspace') deleteLast();
});
