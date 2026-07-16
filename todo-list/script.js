(function initTodoApp() {
  const storageKey = "javascriptFundamentalsTasks";
  const todoElements = {
    form: document.querySelector("#taskForm"),
    input: document.querySelector("#taskInput"),
    feedback: document.querySelector("#formFeedback"),
    list: document.querySelector("#taskList"),
    emptyState: document.querySelector("#emptyState"),
    count: document.querySelector("#taskCount"),
    clearCompletedButton: document.querySelector("#clearCompletedButton"),
    filterButtons: document.querySelectorAll(".filter-button")
  };

  let tasks = loadTasksFromStorage();
  let currentFilter = "all";
  let editingTaskId = null;

  function isStoredTask(task) {
    return task
      && typeof task.id === "string"
      && typeof task.title === "string"
      && typeof task.isComplete === "boolean"
      && typeof task.createdAt === "string";
  }

  function loadTasksFromStorage() {
    try {
      const savedTasks = localStorage.getItem(storageKey);
      if (!savedTasks) {
        return [];
      }

      const parsedTasks = JSON.parse(savedTasks);
      return Array.isArray(parsedTasks) ? parsedTasks.filter(isStoredTask) : [];
    } catch (error) {
      console.error("Could not load saved tasks:", error);
      return [];
    }
  }

  function saveTasksToStorage() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error("Could not save tasks:", error);
      todoElements.feedback.textContent = "Tasks changed, but this browser could not save them.";
      return false;
    }
  }

  function createTask(title) {
    return {
      id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      title,
      isComplete: false,
      createdAt: new Date().toISOString()
    };
  }

  // This named callback helper demonstrates passing behavior into another function.
  function applyToTasks(callback) {
    tasks = tasks.map(callback);
    saveTasksToStorage();
    renderTasks();
  }

  function getVisibleTasks() {
    if (currentFilter === "active") {
      return tasks.filter((task) => !task.isComplete);
    }

    if (currentFilter === "completed") {
      return tasks.filter((task) => task.isComplete);
    }

    return tasks;
  }

  function getTaskCounts() {
    return tasks.reduce((counts, task) => {
      const countName = task.isComplete ? "completed" : "active";
      return { ...counts, [countName]: counts[countName] + 1 };
    }, { active: 0, completed: 0 });
  }

  function createTaskButton(text, accessibleName, className, clickHandler) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = text;
    button.setAttribute("aria-label", accessibleName);
    button.addEventListener("click", clickHandler);
    return button;
  }

  function renderEditableTask(item, task) {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = task.title;
    editInput.maxLength = 80;
    editInput.setAttribute("aria-label", `Edit task: ${task.title}`);

    const saveButton = createTaskButton("Save", `Save changes to ${task.title}`, "", () => {
      saveEditedTask(task.id, editInput.value);
    });
    const cancelButton = createTaskButton("Cancel", `Cancel editing ${task.title}`, "icon-button", cancelEditing);

    editInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveEditedTask(task.id, editInput.value);
      } else if (event.key === "Escape") {
        cancelEditing();
      }
    });

    item.append(editInput, saveButton, cancelButton);
    requestAnimationFrame(() => editInput.focus());
  }

  function renderTasks() {
    const visibleTasks = getVisibleTasks();
    todoElements.list.replaceChildren();

    visibleTasks.forEach((task) => {
      const item = document.createElement("li");
      item.className = `task-item${task.isComplete ? " is-complete" : ""}`;

      if (editingTaskId === task.id) {
        renderEditableTask(item, task);
        todoElements.list.append(item);
        return;
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.isComplete;
      checkbox.setAttribute("aria-label", `Mark ${task.title} as ${task.isComplete ? "active" : "complete"}`);
      checkbox.addEventListener("change", () => toggleTask(task.id));

      const title = document.createElement("span");
      title.textContent = task.title;

      const editButton = createTaskButton("Edit", `Edit ${task.title}`, "icon-button", () => editTask(task.id));
      const deleteButton = createTaskButton("Delete", `Delete ${task.title}`, "icon-button", () => deleteTask(task.id));

      item.append(checkbox, title, editButton, deleteButton);
      todoElements.list.append(item);
    });

    const counts = getTaskCounts();
    todoElements.count.textContent = `${counts.active} active ${counts.active === 1 ? "task" : "tasks"} · ${counts.completed} completed`;
    todoElements.emptyState.hidden = visibleTasks.length > 0;
    todoElements.clearCompletedButton.disabled = counts.completed === 0;
  }

  function addTask(title) {
    tasks = [createTask(title), ...tasks];
    saveTasksToStorage();
    renderTasks();
  }

  function toggleTask(taskId) {
    applyToTasks((task) => task.id === taskId ? { ...task, isComplete: !task.isComplete } : task);
  }

  function editTask(taskId) {
    const task = tasks.find((taskItem) => taskItem.id === taskId);
    if (!task) {
      return;
    }

    editingTaskId = taskId;
    todoElements.feedback.textContent = "";
    renderTasks();
  }

  function saveEditedTask(taskId, updatedTitle) {
    const trimmedTitle = updatedTitle.trim();
    if (!trimmedTitle) {
      todoElements.feedback.textContent = "Task name cannot be empty.";
      return;
    }

    editingTaskId = null;
    applyToTasks((task) => task.id === taskId ? { ...task, title: trimmedTitle } : task);
    todoElements.feedback.textContent = "Task updated.";
  }

  function cancelEditing() {
    editingTaskId = null;
    todoElements.feedback.textContent = "Editing cancelled.";
    renderTasks();
  }

  function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasksToStorage();
    renderTasks();
    todoElements.feedback.textContent = "Task deleted.";
  }

  function clearCompletedTasks() {
    tasks = tasks.filter((task) => !task.isComplete);
    saveTasksToStorage();
    renderTasks();
    todoElements.feedback.textContent = "Completed tasks cleared.";
  }

  function handleTaskSubmit(event) {
    event.preventDefault();
    const title = todoElements.input.value.trim();

    if (!title) {
      todoElements.feedback.textContent = "Enter a task before submitting.";
      todoElements.input.setAttribute("aria-invalid", "true");
      todoElements.input.focus();
      return;
    }

    todoElements.input.removeAttribute("aria-invalid");
    addTask(title);
    todoElements.form.reset();
    todoElements.feedback.textContent = "Task added.";
    todoElements.input.focus();
  }

  function setFilter(nextFilter) {
    currentFilter = nextFilter;
    editingTaskId = null;

    todoElements.filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === nextFilter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    renderTasks();
  }

  todoElements.form.addEventListener("submit", handleTaskSubmit);
  todoElements.clearCompletedButton.addEventListener("click", clearCompletedTasks);
  todoElements.filterButtons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filter));
  });

  renderTasks();
}());
