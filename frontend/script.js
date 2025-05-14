const API_URL = '/todos';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const toggleButton = document.getElementById('toggle-mode');

// گرفتن لیست تسک‌ها از سرور
async function fetchTodos() {
  const res = await fetch(API_URL);
  const todos = await res.json();
  list.innerHTML = '';
  todos.forEach(renderTodo);
}

// نمایش یک تسک در UI
function renderTodo(todo) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span style="text-decoration:${todo.done ? 'line-through' : 'none'}">
      ${todo.text}
    </span>
    <div>
      <button onclick="toggleDone('${todo._id}', ${!todo.done})">✓</button>
      <button onclick="deleteTodo('${todo._id}')">✕</button>
    </div>
  `;
  list.appendChild(li);
}

// اضافه کردن تسک جدید
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, done: false })
  });

  const newTodo = await res.json();
  renderTodo(newTodo);
  input.value = '';
});

// حذف تسک
async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchTodos();
}

// تغییر وضعیت انجام‌شدن تسک
async function toggleDone(id, done) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done })
  });
  fetchTodos();
}

// نایت مود
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('night');
});

// بارگذاری اولیه
fetchTodos();
