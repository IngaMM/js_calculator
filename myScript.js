let numberArray = [];
let nextOperand = 0;
let result = 0;
let operation = "";
let previousOperation = "";
let adder = 0;
let previousKeyWasEqual = false;
let previousKeyWasOperation = false;

const numberKeys = Array.from(document.querySelectorAll(".numberKey"));
const operationKeys = Array.from(document.querySelectorAll(".operationKey"));
const equalKey = document.querySelector("#equal");
const clearKey = document.querySelector("#clear");
const backspaceKey = document.querySelector("#backspace");

numberKeys.forEach(numberKey =>
  numberKey.addEventListener("click", function() {
    numberKeyFunction(this.value);
  })
);

operationKeys.forEach(operationKey =>
  operationKey.addEventListener("click", function() {
    operationKeyFunction(this.id);
  })
);

equalKey.addEventListener("click", function() {
  equalKeyFunction();
});

backspaceKey.addEventListener("click", function() {
  backspace();
});

clearKey.addEventListener("click", function() {
  clear();
});

function numberKeyFunction(num) {
  let indexOfDecimalPoint = numberArray.indexOf(".");
  if (!(num === "." && indexOfDecimalPoint !== -1) && numberArray.length < 11) {
    // Disable pressing dot for a second time & disable entering more than 6
    // decimals & disable entering more than 11 characters (incl. .)
    numberToDisplay(num);
    buildUpNextOperand(num);
    previousKeyWasEqual = false;
    previousKeyWasOperation = false;
  }
}

function operationKeyFunction(nextOperation) {
  numberArray = [];
  previousOperation = operation;
  operation = nextOperation;
  if (previousOperation === "" && previousKeyWasEqual === false) {
    // Special treatment for first operation
    result = nextOperand;
    numberToDisplay(result);
  } else if (previousOperation === "" && previousKeyWasEqual === true) {
    // Special treatment if operation is called immediately after pressing
    // equal key. Result on the display remains unchanged.
    numberToDisplay(result);
  } else {
    if (
      (previousOperation === "add" || previousOperation === "subtract") &&
      (operation === "multiply" || operation === "divide") &&
      previousKeyWasOperation === false
    ) {
      // Multiplication and division before adding and subtracting:
      // Store values that need to be added later.
      adder = result;
      result = previousOperation === "add" ? nextOperand : -nextOperand;
      numberToDisplay(Math.abs(result));
    } else {
      if (previousKeyWasOperation === false) {
        result = operate(result, nextOperand, previousOperation);
        if (
          (operation === "add" ||
            operation === "subtract" ||
            operation === "") &&
          adder !== 0
        ) {
          // Multiplication or division before adding and subtracting:
          // Add stored values.
          result = result + adder;
          adder = 0;
        }
      } else {
        // if an operation key is pressed after another operation key was pressed
        // take only into account the last operation
        result = nextOperand;
      }
      numberToDisplay(result);
    }
  }
  previousKeyWasEqual = false;
  previousKeyWasOperation = true;
}

function equalKeyFunction() {
  numberArray = [];
  previousOperation = operation;
  operation = "";
  if (previousOperation === "" && previousKeyWasEqual === false) {
    // Special treatment if equal key is pressed directly after entering
    // a number or directly after pressing an operator
    result = nextOperand;
  } else if (previousOperation === "" && previousKeyWasEqual === true) {
    // Special treatment if equal is pressed repeatedly after pressing equal
  } else {
    result = operate(result, nextOperand, previousOperation) + adder;
    adder = 0;
  }
  numberToDisplay(result);
  previousKeyWasEqual = true;
  previousKeyWasOperation = false;
}

const calculator = {
  add(a, b) {
    return a + b;
  },
  subtr(a, b) {
    return a - b;
  },
  mult(a, b) {
    return a * b;
  },
  div(a, b) {
    return a / b;
  }
};

function operate(a, b, str) {
  switch (str) {
    case "add":
      return calculator.add(a, b);
    case "subtract":
      return calculator.subtr(a, b);
    case "multiply":
      return calculator.mult(a, b);
    case "divide":
      return calculator.div(a, b);
    default:
      return "This operation is not defined!";
  }
}

function numberToDisplay(num) {
  if (
    numberArray.length === 0 ||
    (numberArray.length === 1 && numberArray[0] === "0")
  ) {
    // This removes the 0 when starting the calculation, a 0 pressed before any
    // other number and any number after pressing = or an operator so that the
    // (intermediate) result can be shown in the display
    removeElementsByClass("numberOnDisplay");
  }
  const display = document.querySelector("#display");
  const numberOnDisplay = document.createElement("span");
  if (num === ".") {
    if (numberArray.length === 0) {
      num = "0."; //Keep the leading 0
    }
    numberOnDisplay.textContent = num;
  } else {
    // Use max. 11 characters (incl. .)
    let slicedNumber = num.toString().slice(0, 11);
    // remove trailing 0 by .toString()
    numberOnDisplay.textContent = Number(slicedNumber).toString();
  }
  numberOnDisplay.classList.add("numberOnDisplay");
  display.appendChild(numberOnDisplay);
}

function buildUpNextOperand(singleNumber) {
  numberArray.push(singleNumber);
  nextOperand = Number(numberArray.join(""));
}

function removeElementsByClass(className) {
  var elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

function backspace() {
  if (
    numberArray.length !== 0 &&
    !(numberArray.length === 1 && numberArray[0] === "0")
  ) {
    numberArray.pop();
    nextOperand = Number(numberArray.join(""));
    removeElementsByClass("numberOnDisplay");
    numberToDisplay(nextOperand);
  }
}

function clear() {
  numberArray = [];
  nextOperand = 0;
  result = 0;
  operation = "";
  previousOperation = "";
  adder = 0;
  previousKeyWasEqual = false;
  previousKeyWasOperation = false;
  numberToDisplay(0);
}

// keyboard support
document.onkeydown = function(e) {
  let keyC = e.keyCode;
  let isShift = e.shiftKey;

  //numbers
  if (isShift === false && keyC >= 48 && keyC <= 57) {
    let num = (keyC - 48).toString();
    numberKeyFunction(num);
  }

  //dot
  if (isShift === false && keyC === 190) {
    numberKeyFunction(".");
  }

  //operations
  if (isShift === true) {
    if (keyC === 221) {
      operationKeyFunction("multiply");
    }
    if (keyC === 55) {
      operationKeyFunction("divide");
    }
  }

  if (isShift === false) {
    if (keyC === 187) {
      operationKeyFunction("add");
    }
    if (keyC === 189) {
      operationKeyFunction("subtract");
    }
  }

  //equal
  if ((isShift === true && keyC === 48) || keyC === 13) {
    equalKeyFunction();
  }

  //clear
  if (keyC === 67) {
    clear();
  }

  if (keyC === 8) {
    backspace();
  }
};
