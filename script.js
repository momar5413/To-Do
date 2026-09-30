(() => {
  'use strict';

  const STORAGE_KEY = 'tasks_v3';
  const PREFS_KEY = 'todo_prefs';
  const CIRC = 2 * Math.PI * 30;
  const PRIORITIES = ['low', 'med', 'high'];
  const PRIORITY_RANK = { high: 0, med: 1, low: 2 };

  const I18N = {
    ar: {
      title: 'مهامي <span>اليومية</span>',
      progress: 'التقدم العام',
      stats: (d, t) => `أنجزت ${d} من ${t} مهام`,
      addPlaceholder: 'أضف مهمة جديدة...',
      add: '+ إضافة',
      priority: 'الأولوية',
      dueDate: 'تاريخ الاستحقاق',
      low: 'منخفضة', med: 'متوسطة', high: 'عالية',
      all: 'الكل', active: 'النشطة', completed: 'المكتملة',
      search: 'ابحث في المهام...',
      sort: 'الترتيب',
      sortNewest: 'الأحدث', sortOldest: 'الأقدم', sortPriority: 'الأولوية', sortDue: 'تاريخ الاستحقاق',
      left: n => n === 1 ? 'مهمة واحدة متبقية' : `${n} مهام متبقية`,
      toggleAll: 'تحديد الكل',
      clearCompleted: 'حذف المكتملة',
      emptyAll: 'لا توجد مهام بعد — ابدأ بإضافة أول مهمة ✨',
      emptyFilter: 'لا توجد مهام مطابقة',
      undo: 'تراجع',
      deleted: 'تم حذف المهمة',
      cleared: n => `تم حذف ${n} مهام مكتملة`,
      markDone: 'تحديد كمكتملة', markUndone: 'إلغاء الإكمال',
      edit: 'تعديل', delete: 'حذف',
      setPriority: p => `الأولوية: ${p}`,
      today: 'اليوم', tomorrow: 'غداً', overdue: 'متأخرة',
      theme: 'تبديل المظهر', lang: 'Switch to English',
      hint: 'نقر مزدوج على المهمة لتعديلها · Enter للحفظ · Esc للإلغاء · / للبحث',
    },
    en: {
      title: 'My <span>Tasks</span>',
      progress: 'Overall progress',
      stats: (d, t) => `${d} of ${t} tasks completed`,
      addPlaceholder: 'Add a new task...',
      add: '+ Add task',
      priority: 'Priority',
      dueDate: 'Due date',
      low: 'Low', med: 'Medium', high: 'High',
      all: 'All', active: 'Active', completed: 'Completed',
      search: 'Search tasks...',
      sort: 'Sort',
      sortNewest: 'Newest', sortOldest: 'Oldest', sortPriority: 'Priority', sortDue: 'Due date',
      left: n => `${n} item${n === 1 ? '' : 's'} left`,
      toggleAll: 'Toggle all',
      clearCompleted: 'Clear completed',
      emptyAll: 'No tasks yet — add your first one ✨',
      emptyFilter: 'No matching tasks',
      undo: 'Undo',
      deleted: 'Task deleted',
      cleared: n => `${n} completed task${n === 1 ? '' : 's'} cleared`,
      markDone: 'Mark as done', markUndone: 'Mark as not done',
      edit: 'Edit', delete: 'Delete',
      setPriority: p => `Priority: ${p}`,
      today: 'Today', tomorrow: 'Tomorrow', overdue: 'Overdue',
      theme: 'Toggle theme', lang: 'التبديل إلى العربية',
      hint: 'Double-click a task to edit · Enter to save · Esc to cancel · / to search',
    },
  };

  const $ = id => document.getElementById(id);
  const els = {
    addForm: $('addForm'), taskInput: $('taskInput'), prioritySelect: $('prioritySelect'), dueInput: $('dueInput'),
    taskList: $('taskList'), filters: $('filters'), searchInput: $('searchInput'), sortSelect: $('sortSelect'),
    footer: $('footer'), footerCount: $('footerCount'), clearBtn: $('clearBtn'), toggleAllBtn: $('toggleAllBtn'),
    themeBtn: $('themeBtn'), langBtn: $('langBtn'),
    ringFill: $('ringFill'), ringPct: $('ringPct'), progressStats: $('progressStats'), progressBar: $('progressBar'),
    countAll: $('countAll'), countActive: $('countActive'), countDone: $('countDone'),
    toast: $('toast'), toastMsg: $('toastMsg'), undoBtn: $('undoBtn'), template: $('taskTemplate'),
  };

  const state = {
    tasks: [],
    filter: 'all',
    query: '',
    editingId: null,
    prefs: { theme: null, lang: null, sort: 'newest' },
    undo: null,
  };

  // ---------- storage ----------
  const storage = {
    get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ } },
  };

  function normalizeTask(t) {
    if (!t || typeof t.text !== 'string') return null;
    return {
      id: String(t.id || uid()),
      text: t.text.slice(0, 120),
      done: Boolean(t.done),
      priority: PRIORITIES.includes(t.priority) ? t.priority : 'low',
      due: typeof t.due === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.due) ? t.due : null,
      createdAt: Number(t.createdAt) || Date.now(),
    };
  }

  function loadTasks() {
    const saved = storage.get(STORAGE_KEY);
    state.tasks = Array.isArray(saved) ? saved.map(normalizeTask).filter(Boolean) : [];
  }

  function load() {
    loadTasks();

    const prefs = storage.get(PREFS_KEY) || {};
    // Migrate the old boolean theme flag.
    const legacyDark = (() => { try { return localStorage.getItem('dark'); } catch { return null; } })();
    state.prefs.theme = prefs.theme || (legacyDark === '1' ? 'dark' : legacyDark === '0' ? 'light' : null);
    state.prefs.lang = I18N[prefs.lang] ? prefs.lang : (navigator.language || '').startsWith('en') ? 'en' : 'ar';
    state.prefs.sort = prefs.sort || 'newest';
  }

  const saveTasks = () => storage.set(STORAGE_KEY, state.tasks);
  const savePrefs = () => storage.set(PREFS_KEY, state.prefs);

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const t = key => I18N[state.prefs.lang][key];
  const findTask = id => state.tasks.find(x => x.id === id);

  // ---------- theme & language ----------
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => state.prefs.theme ? state.prefs.theme === 'dark' : systemDark.matches;

  function applyTheme() {
    const dark = isDark();
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    els.themeBtn.textContent = dark ? '☀️' : '🌙';
  }

  function applyLanguage() {
    const lang = state.prefs.lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(',').forEach(pair => {
        const [attr, key] = pair.split(':');
        el.setAttribute(attr, t(key));
      });
    });
    els.langBtn.textContent = lang === 'ar' ? 'EN' : 'ع';
    els.langBtn.setAttribute('aria-label', t('lang'));
    els.langBtn.title = t('lang');
    els.themeBtn.setAttribute('aria-label', t('theme'));
    els.themeBtn.title = t('theme');
    els.sortSelect.value = state.prefs.sort;
    document.title = lang === 'ar' ? 'قائمة المهام' : 'To Do App';
  }

  // ---------- dates ----------
  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  function dueInfo(due) {
    if (!due) return null;
    const today = new Date(todayStr() + 'T00:00:00');
    const date = new Date(due + 'T00:00:00');
    const diff = Math.round((date - today) / 86400000);
    let label;
    if (diff === 0) label = t('today');
    else if (diff === 1) label = t('tomorrow');
    else label = date.toLocaleDateString(state.prefs.lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' });
    return { label, overdue: diff < 0, soon: diff >= 0 && diff <= 1 };
  }

  // ---------- actions ----------
  function addTask(text, priority, due) {
    state.tasks.unshift({ id: uid(), text, done: false, priority, due: due || null, createdAt: Date.now() });
    saveTasks(); render();
  }

  function updateTask(id, patch) {
    const task = findTask(id);
    if (!task) return;
    Object.assign(task, patch);
    saveTasks(); render();
  }

  function removeTasks(predicate, message) {
    const snapshot = state.tasks.slice();
    const removed = state.tasks.filter(predicate);
    if (!removed.length) return;
    state.tasks = state.tasks.filter(x => !predicate(x));
    saveTasks(); render();
    showToast(message(removed.length), () => { state.tasks = snapshot; saveTasks(); render(); });
  }

  function deleteTask(id) {
    const li = els.taskList.querySelector(`[data-id="${CSS.escape(id)}"]`);
    const run = () => removeTasks(x => x.id === id, () => t('deleted'));
    if (li && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      li.classList.add('removing');
      li.addEventListener('animationend', run, { once: true });
    } else run();
  }

  function startEdit(id) {
    state.editingId = id;
    render();
    const input = els.taskList.querySelector('.task-edit');
    if (input) { input.focus(); input.select(); }
  }

  function finishEdit(id, commit) {
    if (state.editingId !== id) return;
    const input = els.taskList.querySelector('.task-edit');
    state.editingId = null;
    const value = input ? input.value.trim() : '';
    if (commit && value) updateTask(id, { text: value });
    else render();
  }

  // ---------- toast ----------
  let toastTimer;
  function showToast(message, undoFn) {
    clearTimeout(toastTimer);
    state.undo = undoFn;
    els.toastMsg.textContent = message;
    els.undoBtn.hidden = !undoFn;
    els.toast.hidden = false;
    requestAnimationFrame(() => els.toast.classList.add('show'));
    toastTimer = setTimeout(hideToast, 5000);
  }

  function hideToast() {
    els.toast.classList.remove('show');
    state.undo = null;
    setTimeout(() => { if (!els.toast.classList.contains('show')) els.toast.hidden = true; }, 250);
  }

  // ---------- rendering ----------
  function visibleTasks() {
    const q = state.query.toLowerCase();
    const list = state.tasks.filter(x =>
      (state.filter === 'all' || (state.filter === 'active' ? !x.done : x.done)) &&
      (!q || x.text.toLowerCase().includes(q))
    );
    const sorters = {
      newest: (a, b) => b.createdAt - a.createdAt,
      oldest: (a, b) => a.createdAt - b.createdAt,
      priority: (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || b.createdAt - a.createdAt,
      due: (a, b) => (a.due || '9999').localeCompare(b.due || '9999') || PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
    };
    return list.sort(sorters[state.prefs.sort] || sorters.newest);
  }

  function updateProgress() {
    const total = state.tasks.length;
    const done = state.tasks.filter(x => x.done).length;
    const pct = total ? Math.round(done / total * 100) : 0;
    els.ringFill.style.strokeDashoffset = CIRC - (CIRC * pct / 100);
    els.ringPct.textContent = pct + '%';
    els.progressStats.textContent = t('stats')(done, total);
    els.progressBar.style.width = pct + '%';
    els.countAll.textContent = total;
    els.countActive.textContent = total - done;
    els.countDone.textContent = done;
    els.footer.hidden = !total;
    els.footerCount.textContent = t('left')(total - done);
    els.clearBtn.disabled = !done;
  }

  function buildTask(task) {
    const li = els.template.content.firstElementChild.cloneNode(true);
    li.dataset.id = task.id;
    li.classList.toggle('done', task.done);
    li.classList.add('pr-' + task.priority);

    const check = li.querySelector('.check-btn');
    check.classList.toggle('done', task.done);
    check.dataset.action = 'toggle';
    check.setAttribute('aria-pressed', String(task.done));
    check.setAttribute('aria-label', t(task.done ? 'markUndone' : 'markDone'));

    const textEl = li.querySelector('.task-text');
    if (state.editingId === task.id) {
      const input = document.createElement('input');
      input.className = 'task-edit';
      input.value = task.text;
      input.maxLength = 120;
      input.setAttribute('aria-label', t('edit'));
      textEl.replaceWith(input);
    } else {
      textEl.textContent = task.text;
      textEl.classList.toggle('done', task.done);
    }

    const badge = li.querySelector('.priority-badge');
    badge.textContent = t(task.priority);
    badge.classList.add('pb-' + task.priority);

    const dueEl = li.querySelector('.due-badge');
    const info = dueInfo(task.due);
    if (info) {
      dueEl.textContent = '📅 ' + (info.overdue && !task.done ? `${t('overdue')} · ${info.label}` : info.label);
      dueEl.classList.toggle('overdue', info.overdue && !task.done);
      dueEl.classList.toggle('soon', info.soon && !task.done);
    } else dueEl.remove();

    const dots = li.querySelector('.priority-dots');
    PRIORITIES.forEach(p => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `dot p-${p}` + (task.priority === p ? ' selected' : '');
      dot.dataset.action = 'priority';
      dot.dataset.priority = p;
      dot.setAttribute('aria-label', t('setPriority')(t(p)));
      dot.setAttribute('aria-pressed', String(task.priority === p));
      dots.appendChild(dot);
    });

    const editBtn = li.querySelector('[data-action="edit"]');
    editBtn.setAttribute('aria-label', t('edit'));
    editBtn.title = t('edit');
    const delBtn = li.querySelector('[data-action="delete"]');
    delBtn.setAttribute('aria-label', t('delete'));
    delBtn.title = t('delete');
    return li;
  }

  function render() {
    updateProgress();
    const list = visibleTasks();
    if (!list.length) {
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = state.tasks.length ? t('emptyFilter') : t('emptyAll');
      els.taskList.replaceChildren(li);
      return;
    }
    els.taskList.replaceChildren(...list.map(buildTask));
  }

  // ---------- events ----------
  els.addForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = els.taskInput.value.trim();
    if (!text) return;
    addTask(text, els.prioritySelect.value, els.dueInput.value);
    els.taskInput.value = '';
    els.dueInput.value = '';
    els.taskInput.focus();
  });

  els.taskList.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    const li = e.target.closest('.task-item');
    if (!btn || !li) return;
    const id = li.dataset.id;
    const task = findTask(id);
    if (!task) return;
    switch (btn.dataset.action) {
      case 'toggle': updateTask(id, { done: !task.done }); break;
      case 'priority': updateTask(id, { priority: btn.dataset.priority }); break;
      case 'edit': startEdit(id); break;
      case 'delete': deleteTask(id); break;
    }
  });

  els.taskList.addEventListener('dblclick', e => {
    const li = e.target.closest('.task-item');
    if (li && e.target.closest('.task-text')) startEdit(li.dataset.id);
  });

  els.taskList.addEventListener('keydown', e => {
    if (!e.target.classList.contains('task-edit')) return;
    const id = e.target.closest('.task-item').dataset.id;
    if (e.key === 'Enter') { e.preventDefault(); finishEdit(id, true); }
    else if (e.key === 'Escape') { e.preventDefault(); finishEdit(id, false); }
  });

  els.taskList.addEventListener('focusout', e => {
    if (e.target.classList.contains('task-edit')) {
      finishEdit(e.target.closest('.task-item').dataset.id, true);
    }
  });

  els.filters.addEventListener('click', e => {
    const b = e.target.closest('.filter-btn');
    if (!b) return;
    state.filter = b.dataset.filter;
    els.filters.querySelectorAll('.filter-btn').forEach(btn => {
      const active = btn === b;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    render();
  });

  els.searchInput.addEventListener('input', () => { state.query = els.searchInput.value.trim(); render(); });
  els.sortSelect.addEventListener('change', () => { state.prefs.sort = els.sortSelect.value; savePrefs(); render(); });

  els.clearBtn.addEventListener('click', () => removeTasks(x => x.done, t('cleared')));

  els.toggleAllBtn.addEventListener('click', () => {
    const allDone = state.tasks.every(x => x.done);
    state.tasks.forEach(x => { x.done = !allDone; });
    saveTasks(); render();
  });

  els.undoBtn.addEventListener('click', () => { const fn = state.undo; hideToast(); if (fn) fn(); });

  els.themeBtn.addEventListener('click', () => {
    state.prefs.theme = isDark() ? 'light' : 'dark';
    savePrefs(); applyTheme();
  });
  systemDark.addEventListener('change', () => { if (!state.prefs.theme) applyTheme(); });

  els.langBtn.addEventListener('click', () => {
    state.prefs.lang = state.prefs.lang === 'ar' ? 'en' : 'ar';
    savePrefs(); applyLanguage(); render();
  });

  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); els.searchInput.focus(); }
    else if (e.key === 'Escape' && document.activeElement === els.searchInput) {
      els.searchInput.value = ''; state.query = ''; els.searchInput.blur(); render();
    }
  });

  // Keep "today"/"overdue" labels accurate if the page stays open past midnight.
  let lastDay = todayStr();
  setInterval(() => { if (todayStr() !== lastDay) { lastDay = todayStr(); render(); } }, 60000);

  // Sync across tabs.
  window.addEventListener('storage', e => { if (e.key === STORAGE_KEY) { loadTasks(); render(); } });

  load();
  applyTheme();
  applyLanguage();
  render();
})();
