(function initCounterApp() {
  const counterElements = {
    value: document.querySelector("#counterValue"),
    status: document.querySelector("#counterStatus"),
    stepForm: document.querySelector("#stepForm"),
    stepInput: document.querySelector("#stepInput"),
    stepFeedback: document.querySelector("#stepFeedback"),
    incrementButton: document.querySelector("#incrementButton"),
    decrementButton: document.querySelector("#decrementButton"),
    resetButton: document.querySelector("#resetButton"),
    historyList: document.querySelector("#historyList"),
    emptyHistory: document.querySelector("#emptyHistory")
  };

  const counter = createCounter(0);
  const actionHistory = [];
  let stepSize = 1;

  // The returned methods close over count, so it cannot be changed directly.
  function createCounter(initialValue) {
    let count = initialValue;

    return {
      increment(step) {
        count += step;
        return count;
      },
      decrement(step) {
        count -= step;
        return count;
      },
      reset() {
        count = initialValue;
        return count;
      },
      getValue() {
        return count;
      }
    };
  }

  function demonstrateScope() {
    const globalScopeValue = window.document.title;

    function readFunctionScope() {
      const functionScopeValue = "available inside readFunctionScope";

      if (globalScopeValue) {
        const blockScopeValue = "available only inside this block";
        console.info("Scope demo:", globalScopeValue, functionScopeValue, blockScopeValue);
      }
    }

    readFunctionScope();
  }

  function demonstrateHoisting() {
    console.info("Hoisting demo:", declaredBeforeDefinition());

    function declaredBeforeDefinition() {
      return "A function declaration works before its definition.";
    }

    // Reading this const before this line would cause a temporal dead zone error.
    const temporalDeadZoneNote = "let and const remain unavailable until initialization.";
    console.info("Temporal dead zone note:", temporalDeadZoneNote);
  }

  function validateStepValue(rawValue) {
    const parsedValue = Number(rawValue);

    if (!Number.isInteger(parsedValue) || parsedValue < 1 || parsedValue > 100) {
      return { isValid: false, message: "Enter a whole number from 1 to 100." };
    }

    return {
      isValid: true,
      value: parsedValue,
      message: `Step size is ${parsedValue}.`
    };
  }

  function updateCounterDisplay() {
    const currentValue = counter.getValue();
    counterElements.value.textContent = currentValue;

    if (currentValue > 0) {
      counterElements.status.textContent = "The counter is positive.";
    } else if (currentValue < 0) {
      counterElements.status.textContent = "The counter is negative.";
    } else {
      counterElements.status.textContent = "The counter is zero.";
    }
  }

  function addHistoryEntry(actionName, newValue) {
    actionHistory.unshift({
      actionName,
      step: actionName === "Reset" ? null : stepSize,
      value: newValue,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });

    if (actionHistory.length > 6) {
      actionHistory.pop();
    }

    renderHistory();
  }

  function renderHistory() {
    counterElements.historyList.replaceChildren();

    actionHistory.forEach((entry) => {
      const item = document.createElement("li");
      const actionDescription = entry.step === null ? entry.actionName : `${entry.actionName} by ${entry.step}`;
      item.textContent = `${entry.time}: ${actionDescription}. New value: ${entry.value}.`;
      counterElements.historyList.append(item);
    });

    counterElements.emptyHistory.hidden = actionHistory.length > 0;
  }

  function handleCounterAction(actionName, actionCallback) {
    const newValue = actionCallback(stepSize);
    updateCounterDisplay();
    addHistoryEntry(actionName, newValue);
  }

  function handleStepSubmit(event) {
    event.preventDefault();
    const result = validateStepValue(counterElements.stepInput.value);
    counterElements.stepFeedback.textContent = result.message;

    if (!result.isValid) {
      counterElements.stepInput.setAttribute("aria-invalid", "true");
      counterElements.stepInput.focus();
      return;
    }

    counterElements.stepInput.removeAttribute("aria-invalid");
    stepSize = result.value;
  }

  function handleKeyboardShortcuts(event) {
    if (event.target === counterElements.stepInput) {
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      handleCounterAction("Incremented", counter.increment);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      handleCounterAction("Decremented", counter.decrement);
    } else if (event.key.toLowerCase() === "r") {
      handleCounterAction("Reset", counter.reset);
    }
  }

  counterElements.incrementButton.addEventListener("click", () => {
    handleCounterAction("Incremented", counter.increment);
  });
  counterElements.decrementButton.addEventListener("click", () => {
    handleCounterAction("Decremented", counter.decrement);
  });
  counterElements.resetButton.addEventListener("click", () => {
    handleCounterAction("Reset", counter.reset);
  });
  counterElements.stepForm.addEventListener("submit", handleStepSubmit);
  document.addEventListener("keydown", handleKeyboardShortcuts);

  demonstrateScope();
  demonstrateHoisting();
  updateCounterDisplay();
  renderHistory();
}());
