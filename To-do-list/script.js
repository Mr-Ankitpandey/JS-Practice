const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterBtns = document.querySelectorAll(".filter");
const sortSelect = document.getElementById("sort-select");
const themeToggle = document.getElementById("theme-toggle");
const app = document.querySelector(".app");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

// Restore theme preference
if (localStorage.getItem("theme") === "dark") {
  app.classList.add("dark");
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateCount() {
  const itemsLeft = todos.filter((t) => !t.completed).length;
  document.getElementById("items-left").textContent = itemsLeft;
}

function renderTodos() {
  todoList.innerHTML = "";

  let filtered = todos.filter((todo) => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  if (sortSelect.value === "alpha") {
    filtered.sort((a, b) => a.text.localeCompare(b.text));
  } else if (sortSelect.value === "added") {
    filtered.sort((a, b) => b.id - a.id);
  }

  filtered.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = todo.id;
    li.dataset.completed = todo.completed;

    const label = document.createElement("label");
    label.className = "todo-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    const editBtn = document.createElement("button");
    editBtn.className = "btn icon btn-edit";
    editBtn.title = "Edit";
    editBtn.textContent = "✎";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn icon btn-delete";
    deleteBtn.title = "Delete";
    deleteBtn.textContent = "🗑";

    label.append(checkbox, span, editBtn, deleteBtn);
    li.appendChild(label);
    todoList.appendChild(li);
  });

  updateCount();
}

function addTodo(text) {
  const newTodo = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
  };
  todos.push(newTodo);
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderTodos();
}

function toggleComplete(id) {
  todos = todos.map((t) => {
    if (t.id === id) t.completed = !t.completed;
    return t;
  });
  saveTodos();
  renderTodos();
}

function editTodoInline(id, spanElement) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  // Create input field
  const input = document.createElement("input");
  input.type = "text";
  input.value = todo.text;
  input.className = "todo-edit-input";
  input.style.flex = "1";
  input.style.fontSize = "15px";
  input.style.border = "1px solid rgba(15,23,42,0.1)";
  input.style.borderRadius = "8px";
  input.style.padding = "6px 10px";

  // Replace span with input
  spanElement.replaceWith(input);
  input.focus();

  // Save when pressing Enter or leaving focus
  input.addEventListener("blur", () => finishEdit(input, id));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finishEdit(input, id);
    if (e.key === "Escape") renderTodos(); // cancel edit
  });
}

function finishEdit(input, id) {
  const newText = input.value.trim();
  if (newText !== "") {
    todos = todos.map((t) => {
      if (t.id === id) t.text = newText;
      return t;
    });
    saveTodos();
  }
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  addTodo(text);
  todoInput.value = "";
});

todoList.addEventListener("click", (e) => {
  const li = e.target.closest(".todo-item");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.classList.contains("btn-delete")) {
    deleteTodo(id);
  }

  if (e.target.classList.contains("btn-edit")) {
    const span = li.querySelector(".todo-text");
    editTodoInline(id, span);
  }

  if (e.target.classList.contains("todo-checkbox")) {
    toggleComplete(id);
  }
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

sortSelect.addEventListener("change", renderTodos);

themeToggle.addEventListener("click", () => {
  app.classList.toggle("dark");
  const mode = app.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", mode);
});

renderTodos();
