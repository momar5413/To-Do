const CIRC = 2 * Math.PI * 30;
const $ = id => document.getElementById(id);
const taskInput = $('taskInput'), addBtn = $('addBtn'), taskList = $('taskList'), filtersEl = $('filters');
const footer = $('footer'), footerCount = $('footerCount'), clearBtn = $('clearBtn'), themeBtn = $('themeBtn');
const ringFill = $('ringFill'), ringPct = $('ringPct'), progressStats = $('progressStats'), progressBar = $('progressBar');

let tasks = [], filter = 'all', dark = false, editingId = null;

function load() {
  try { 
    const s = localStorage.getItem('tasks_v3'); if (s) tasks = JSON.parse(s);
    dark = localStorage.getItem('dark') === '1'; applyTheme();
  } catch(e){}
}
function save() { try { localStorage.setItem('tasks_v3', JSON.stringify(tasks)); } catch(e){} }

function applyTheme() {
  document.body.className = dark ? 'dark' : 'light';
  themeBtn.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('dark', dark ? '1' : '0');
}
themeBtn.addEventListener('click', () => { dark = !dark; applyTheme(); });

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

function addTask() {
  const txt = taskInput.value.trim();
  if (!txt) return;
  tasks.unshift({ id: uid(), text: txt, done: false, priority: 'low' });
  taskInput.value = ''; save(); render();
}
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => e.key === 'Enter' && addTask());

window.toggleDone = id => { const t = tasks.find(x => x.id === id); if (t) { t.done = !t.done; save(); render(); } };
window.deleteTask = id => {
  const el = document.querySelector(`[data-id="${id}"]`);
  if (el) { el.classList.add('removing'); setTimeout(() => { tasks = tasks.filter(x => x.id !== id); save(); render(); }, 200); }
  else { tasks = tasks.filter(x => x.id !== id); save(); render(); }
};
window.setPriority = (id, p) => { const t = tasks.find(x => x.id === id); if (t) { t.priority = p; save(); render(); } };
window.startEdit = id => { editingId = id; render(); const i = $('edit-'+id); if(i){ i.focus(); i.select(); } };
window.finishEdit = id => {
  const i = $('edit-'+id); if (i) { const v = i.value.trim(); const t = tasks.find(x => x.id === id); if (t && v) t.text = v; editingId = null; save(); render(); }
};

function updateProgress() {
  const total = tasks.length, done = tasks.filter(x => x.done).length, pct = total ? Math.round(done/total*100) : 0;
  ringFill.style.strokeDashoffset = CIRC - (CIRC * pct / 100);
  ringPct.textContent = pct + '%';
  progressStats.textContent = `${done} of ${total} tasks completed`;
  progressBar.style.width = pct + '%';
}

filtersEl.addEventListener('click', e => {
  const b = e.target.closest('.filter-btn'); if (!b) return;
  filter = b.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.toggle('active', btn === b));
  render();
});

clearBtn.addEventListener('click', () => { tasks = tasks.filter(x => !x.done); save(); render(); });

function render() {
  updateProgress();
  const visible = tasks.filter(t => filter==='all' || (filter==='active' ? !t.done : t.done));
  footer.style.display = tasks.length ? 'flex' : 'none';
  footerCount.textContent = `${tasks.filter(x=>!x.done).length} items left`;

  if (!visible.length) {
    taskList.innerHTML = `<div class="empty">No tasks found</div>`;
    return;
  }

  taskList.innerHTML = visible.map(t => `
    <div class="task-item" data-id="${t.id}">
      <button class="check-btn ${t.done?'done':''}" onclick="toggleDone('${t.id}')">
        <svg class="check-icon" viewBox="0 0 10 8"><path d="M1 4l2.5 2.5L9 1" stroke="#fff" stroke-width="2" fill="none"/></svg>
      </button>
      ${editingId === t.id 
        ? `<input class="task-edit" id="edit-${t.id}" value="${t.text}" onblur="finishEdit('${t.id}')" onkeydown="event.key==='Enter'&&finishEdit('${t.id}')">`
        : `<span class="task-text ${t.done?'done':''}">${t.text}</span>`
      }
      <span class="priority-badge pb-${t.priority}">${t.priority}</span>
      <div class="task-actions">
        <div class="priority-dots">
          ${['low','med','high'].map(p => `<div class="dot p-${p} ${t.priority===p?'selected':''}" onclick="setPriority('${t.id}','${p}')"></div>`).join('')}
        </div>
        <button class="act-btn" onclick="startEdit('${t.id}')">✏</button>
        <button class="act-btn del" onclick="deleteTask('${t.id}')">✕</button>
      </div>
    </div>`).join('');
}

load(); render();