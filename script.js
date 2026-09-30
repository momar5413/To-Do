(() => {
  'use strict';

  // =====================================================================
  //  Constants & translations
  // =====================================================================
  const DATA_KEY = 'todo_v4';
  const SETTINGS_KEY = 'todo_v4_settings';
  const PRIORITIES = ['none', 'low', 'med', 'high'];
  const PRIORITY_RANK = { high: 0, med: 1, low: 2, none: 3 };
  const LIST_COLORS = ['#6c5ce7', '#0984e3', '#00b894', '#fdcb6e', '#e17055', '#e84393', '#00cec9', '#636e72'];
  const ACCENTS = { gold: '#d8b878', rosegold: '#e3a792', platinum: '#c9d0da', emerald: '#5fcf9c', sapphire: '#7ea6e8', ruby: '#e0707e' };
  const SMART_VIEWS = ['today', 'upcoming', 'important', 'all', 'completed'];
  const VIEW_ICONS = { today: '☀️', upcoming: '📅', important: '⭐', all: '📋', completed: '✅' };
  const APP_VERSION = '2.1.1';
  // Reminder choices: minutes before the task's date/time.
  const REMINDERS = { none: null, at: 0, '5': 5, '15': 15, '30': 30, '60': 60, '1440': 1440 };
  const SNOOZE_MINUTES = 10;

  const I18N = {
    ar: {
      appName: 'مهامي', menu: 'القائمة', close: 'إغلاق',
      today: 'اليوم', tomorrow: 'غداً', yesterday: 'أمس', upcoming: 'القادمة', important: 'المهمة',
      allTasks: 'كل المهام', completed: 'المكتملة', myLists: 'قوائمي', newList: 'قائمة جديدة',
      listName: 'اسم القائمة', emoji: 'رمز', create: 'إنشاء', cancel: 'إلغاء', done: 'تم',
      personal: 'شخصي', work: 'العمل', shopping: 'التسوق',
      streak: 'أيام متتالية', doneToday: 'أنجزت اليوم', settings: 'الإعدادات',
      morning: 'صباح الخير ☀️', afternoon: 'مساء الخير 🌤️', evening: 'مساء الخير 🌙',
      addPlaceholder: 'أضف مهمة… مثال: اجتماع غداً الساعة 5م !!! #العمل',
      smartTip: 'تلميح: !/!!/!!! للأولوية، #القائمة، اليوم/غداً/بعد غد/يوم الجمعة، والوقت مثل 5:30م أو الساعة 9',
      add: 'إضافة', priority: 'الأولوية', dueDate: 'تاريخ الاستحقاق', list: 'القائمة',
      pNone: 'بدون', pLow: 'منخفضة', pMed: 'متوسطة', pHigh: 'عالية',
      search: 'ابحث…', sort: 'الترتيب',
      sortManual: 'ترتيب يدوي', sortDue: 'التاريخ', sortPriority: 'الأولوية', sortNewest: 'الأحدث', sortAlpha: 'أبجدي',
      deleteList: 'حذف القائمة', clearCompleted: 'حذف المكتملة',
      completedCount: n => `المكتملة (${n})`,
      taskTitle: 'عنوان المهمة', subtasks: 'المهام الفرعية', addSubtask: 'أضف خطوة…',
      notes: 'ملاحظات', notesPlaceholder: 'أضف ملاحظة…', delete: 'حذف',
      created: d => `أُنشئت ${d}`,
      markDone: 'تحديد كمكتملة', markUndone: 'إلغاء الإكمال', star: 'تمييز كمهمة', unstar: 'إلغاء التمييز',
      overdue: 'متأخرة', undo: 'تراجع',
      deleted: 'تم حذف المهمة', cleared: n => `تم حذف ${n} من المهام المكتملة`, listDeleted: 'تم حذف القائمة',
      confirmDeleteList: (name, n) => `حذف قائمة "${name}"${n ? ` و ${n} من مهامها` : ''}؟`,
      lastList: 'لا يمكن حذف آخر قائمة', imported: 'تم استيراد البيانات', importFailed: 'ملف غير صالح',
      confirmImport: 'سيتم استبدال كل بياناتك الحالية. متابعة؟', confirmReset: 'حذف كل المهام والقوائم نهائياً؟',
      resetDone: 'تمت إعادة الضبط',
      language: 'اللغة', theme: 'المظهر', light: 'فاتح', dark: 'داكن', system: 'تلقائي',
      accent: 'لون الزينة',
      gems: { gold: 'ذهبي', rosegold: 'ذهب وردي', platinum: 'بلاتيني', emerald: 'زمرد', sapphire: 'ياقوت أزرق', ruby: 'ياقوت أحمر' }, celebrate: 'احتفال عند إنهاء كل المهام 🎉', data: 'البيانات',
      export: 'تصدير', import: 'استيراد', resetAll: 'حذف الكل',
      shortcuts: 'اختصارات لوحة المفاتيح', scNew: 'مهمة جديدة', scSearch: 'بحث', scClose: 'إغلاق / إلغاء', scViews: 'التنقل بين العروض',
      emptyToday: ['يومك فارغ', 'استمتع بوقتك أو أضف مهمة جديدة'],
      emptyUpcoming: ['لا شيء قادم', 'المهام ذات التواريخ المستقبلية تظهر هنا'],
      emptyImportant: ['لا توجد مهام مميزة', 'اضغط على النجمة ⭐ لتمييز أي مهمة'],
      emptyAll: ['لا توجد مهام بعد', 'ابدأ بإضافة أول مهمة من الأعلى'],
      emptyCompleted: ['لم تُكمل أي مهمة بعد', 'المهام المنجزة تظهر هنا'],
      emptyList: ['القائمة فارغة', 'أضف مهمة لهذه القائمة'],
      emptySearch: ['لا توجد نتائج', 'جرّب كلمة بحث أخرى'],
      allDone: ['أنجزت كل شيء! 🎉', 'عمل رائع، خذ استراحة'],
      tasksLeft: n => n === 0 ? 'لا مهام متبقية' : n === 1 ? 'مهمة واحدة متبقية' : n === 2 ? 'مهمتان متبقيتان' : `${n} مهام متبقية`,
      time: 'الوقت', reminder: 'التذكير',
      remind: { none: 'بدون تذكير', at: 'في الموعد', '5': 'قبل 5 دقائق', '15': 'قبل 15 دقيقة', '30': 'قبل 30 دقيقة', '60': 'قبل ساعة', '1440': 'قبل يوم' },
      notifications: 'إشعارات التذكير',
      notifyOnNative: 'تعمل في الخلفية حتى لو كان التطبيق مغلقاً ✓',
      notifyOnWeb: 'تصلك أثناء فتح الموقع. للتذكير الدائم حمّل تطبيق أندرويد',
      notifyOff: 'متوقفة — فعّلها ليصلك تنبيه في موعد كل مهمة',
      notifyBlocked: 'الإذن مرفوض — اسمح بالإشعارات من إعدادات الجهاز',
      notifyUnsupported: 'هذا المتصفح لا يدعم الإشعارات',
      allDayTime: 'وقت تذكير المهام بلا ساعة', allDayTimeHint: 'للمهام التي لها تاريخ فقط',
      dailySummary: 'ملخص الصباح', dailySummaryHint: 'إشعار يومي بمهام اليوم',
      testNotify: 'إرسال تجربة', testNotifyHint: 'تأكد أن الإشعارات تصلك',
      testTitle: 'مهامي 🔔', testBody: 'الإشعارات تعمل بشكل ممتاز ✨',
      androidApp: 'تطبيق أندرويد', androidAppHint: 'تذكيرات تعمل في الخلفية وتصميم كامل الشاشة', download: 'تحميل APK',
      getAndroid: 'حمّل تطبيق أندرويد',
      notifDone: 'تم ✓', notifSnooze: `بعد ${SNOOZE_MINUTES} دقائق`,
      channelName: 'تذكير المهام', channelDesc: 'تنبيه في موعد كل مهمة', dailyChannel: 'ملخص الصباح',
      summaryTitle: n => n === 1 ? 'لديك مهمة واحدة اليوم' : n === 2 ? 'لديك مهمتان اليوم' : `لديك ${n} مهام اليوم`,
      summaryMore: n => `و${n} غيرها`,
      overdueSuffix: n => ` · ${n} متأخرة`,
      enableNotify: 'تفعيل', notifyPrompt: 'فعّل الإشعارات ليصلك تذكير بهذه المهمة',
      notifyDenied: 'لم يُسمح بالإشعارات. يمكنك السماح بها من إعدادات الجهاز',
      notifyEnabled: 'تم تفعيل التذكيرات 🔔', snoozed: `سنذكّرك بعد ${SNOOZE_MINUTES} دقائق`,
      markedDone: 'أُنجزت المهمة ✓',
      bellOn: 'التذكيرات مفعّلة', bellOff: 'التذكيرات متوقفة — اضغط للتفعيل',
      detailsHintOff: 'فعّل الإشعارات ليصلك هذا التذكير', detailsHintNoDate: 'حدّد تاريخاً ليعمل التذكير',
      reminderAt: when => `🔔 ${when}`,
      version: v => `مهامي — الإصدار ${v}`,
    },
    en: {
      appName: 'My Tasks', menu: 'Menu', close: 'Close',
      today: 'Today', tomorrow: 'Tomorrow', yesterday: 'Yesterday', upcoming: 'Upcoming', important: 'Important',
      allTasks: 'All tasks', completed: 'Completed', myLists: 'My lists', newList: 'New list',
      listName: 'List name', emoji: 'Emoji', create: 'Create', cancel: 'Cancel', done: 'Done',
      personal: 'Personal', work: 'Work', shopping: 'Shopping',
      streak: 'day streak', doneToday: 'done today', settings: 'Settings',
      morning: 'Good morning ☀️', afternoon: 'Good afternoon 🌤️', evening: 'Good evening 🌙',
      addPlaceholder: 'Add a task… e.g. Meeting tomorrow at 5pm !!! #Work',
      smartTip: 'Tip: !/!!/!!! for priority, #list, today/tomorrow/on friday, and times like 5:30pm or at 9',
      add: 'Add', priority: 'Priority', dueDate: 'Due date', list: 'List',
      pNone: 'None', pLow: 'Low', pMed: 'Medium', pHigh: 'High',
      search: 'Search…', sort: 'Sort',
      sortManual: 'Manual order', sortDue: 'Due date', sortPriority: 'Priority', sortNewest: 'Newest', sortAlpha: 'A–Z',
      deleteList: 'Delete list', clearCompleted: 'Clear completed',
      completedCount: n => `Completed (${n})`,
      taskTitle: 'Task title', subtasks: 'Subtasks', addSubtask: 'Add a step…',
      notes: 'Notes', notesPlaceholder: 'Add a note…', delete: 'Delete',
      created: d => `Created ${d}`,
      markDone: 'Mark as done', markUndone: 'Mark as not done', star: 'Mark important', unstar: 'Remove importance',
      overdue: 'Overdue', undo: 'Undo',
      deleted: 'Task deleted', cleared: n => `${n} completed task${n === 1 ? '' : 's'} cleared`, listDeleted: 'List deleted',
      confirmDeleteList: (name, n) => `Delete list "${name}"${n ? ` and its ${n} task${n === 1 ? '' : 's'}` : ''}?`,
      lastList: "You can't delete the last list", imported: 'Data imported', importFailed: 'Invalid file',
      confirmImport: 'This will replace all your current data. Continue?', confirmReset: 'Permanently delete all tasks and lists?',
      resetDone: 'Everything was reset',
      language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark', system: 'Auto',
      accent: 'Accent',
      gems: { gold: 'Gold', rosegold: 'Rose gold', platinum: 'Platinum', emerald: 'Emerald', sapphire: 'Sapphire', ruby: 'Ruby' }, celebrate: 'Celebrate when everything is done 🎉', data: 'Data',
      export: 'Export', import: 'Import', resetAll: 'Delete all',
      shortcuts: 'Keyboard shortcuts', scNew: 'New task', scSearch: 'Search', scClose: 'Close / cancel', scViews: 'Switch views',
      emptyToday: ['Your day is clear', 'Enjoy it, or add something new'],
      emptyUpcoming: ['Nothing coming up', 'Tasks with future dates show here'],
      emptyImportant: ['No important tasks', 'Tap the ⭐ on any task to mark it'],
      emptyAll: ['No tasks yet', 'Add your first task above'],
      emptyCompleted: ['Nothing completed yet', 'Finished tasks show up here'],
      emptyList: ['This list is empty', 'Add a task to this list'],
      emptySearch: ['No results', 'Try a different search'],
      allDone: ['All done! 🎉', 'Great work — take a break'],
      tasksLeft: n => n === 0 ? 'Nothing left' : `${n} task${n === 1 ? '' : 's'} left`,
      time: 'Time', reminder: 'Reminder',
      remind: { none: 'No reminder', at: 'At due time', '5': '5 minutes before', '15': '15 minutes before', '30': '30 minutes before', '60': '1 hour before', '1440': '1 day before' },
      notifications: 'Reminder notifications',
      notifyOnNative: 'Works in the background, even when the app is closed ✓',
      notifyOnWeb: 'Delivered while the site is open. Get the Android app for background reminders',
      notifyOff: 'Off — turn on to get an alert when each task is due',
      notifyBlocked: 'Permission denied — allow notifications in your device settings',
      notifyUnsupported: "This browser doesn't support notifications",
      allDayTime: 'Reminder time for tasks without a time', allDayTimeHint: 'For tasks that only have a date',
      dailySummary: 'Morning summary', dailySummaryHint: "A daily notification with today's tasks",
      testNotify: 'Send test', testNotifyHint: 'Check that notifications reach you',
      testTitle: 'My Tasks 🔔', testBody: 'Notifications are working ✨',
      androidApp: 'Android app', androidAppHint: 'Background reminders and a full-screen app', download: 'Download APK',
      getAndroid: 'Get the Android app',
      notifDone: 'Done ✓', notifSnooze: `In ${SNOOZE_MINUTES} min`,
      channelName: 'Task reminders', channelDesc: 'An alert when each task is due', dailyChannel: 'Morning summary',
      summaryTitle: n => `You have ${n} task${n === 1 ? '' : 's'} today`,
      summaryMore: n => `and ${n} more`,
      overdueSuffix: n => ` · ${n} overdue`,
      enableNotify: 'Turn on', notifyPrompt: 'Turn on notifications to be reminded about this task',
      notifyDenied: "Notifications weren't allowed. You can allow them in your device settings",
      notifyEnabled: 'Reminders are on 🔔', snoozed: `We'll remind you in ${SNOOZE_MINUTES} minutes`,
      markedDone: 'Task completed ✓',
      bellOn: 'Reminders are on', bellOff: 'Reminders are off — tap to turn on',
      detailsHintOff: 'Turn on notifications to get this reminder', detailsHintNoDate: 'Set a date for this reminder to work',
      reminderAt: when => `🔔 ${when}`,
      version: v => `My Tasks — version ${v}`,
    },
  };

  // =====================================================================
  //  Helpers
  // =====================================================================
  const $ = id => document.getElementById(id);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const clone = obj => JSON.parse(JSON.stringify(obj));
  const pad = n => String(n).padStart(2, '0');
  const dateKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayKey = () => dateKey(new Date());
  const addDays = (key, n) => { const d = parseKey(key); d.setDate(d.getDate() + n); return dateKey(d); };
  const parseKey = key => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d); };
  const dayDiff = key => Math.round((parseKey(key) - parseKey(todayKey())) / 86400000);
  const isDateKey = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
  const isTime = v => typeof v === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
  const nowTime = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const storage = {
    get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* unavailable */ } },
  };

  // =====================================================================
  //  State
  // =====================================================================
  let data = { tasks: [], lists: [], history: {} };
  const settings = {
    lang: 'ar', theme: 'dark', accent: 'gold', confetti: true, sort: 'manual', view: 'today', showDone: true,
    notify: false, allDayTime: '09:00', daily: true, dailyTime: '08:00', askedNotify: false,
  };
  const ui = { query: '', openId: null, composerPriority: 'none', undo: null };

  const t = key => I18N[settings.lang][key];
  const locale = () => settings.lang === 'ar' ? 'ar-EG' : 'en-US';

  // =====================================================================
  //  Persistence & migration
  // =====================================================================
  function defaultLists() {
    return [
      { id: 'personal', key: 'personal', name: '', emoji: '🏠', color: LIST_COLORS[0] },
      { id: 'work', key: 'work', name: '', emoji: '💼', color: LIST_COLORS[1] },
      { id: 'shopping', key: 'shopping', name: '', emoji: '🛒', color: LIST_COLORS[2] },
    ];
  }

  function normalizeTask(x, i, listIds) {
    if (!x || typeof x.text !== 'string' || !x.text.trim()) return null;
    return {
      id: String(x.id || uid()),
      text: x.text.slice(0, 200),
      done: Boolean(x.done),
      doneAt: Number(x.doneAt) || (x.done ? Number(x.createdAt) || Date.now() : null),
      priority: PRIORITIES.includes(x.priority) ? x.priority : 'none',
      due: isDateKey(x.due) ? x.due : null,
      time: isDateKey(x.due) && isTime(x.time) ? x.time : null,
      remind: x.remind in REMINDERS ? x.remind : 'at',
      snoozeUntil: Number(x.snoozeUntil) > Date.now() ? Number(x.snoozeUntil) : null,
      listId: listIds.includes(x.listId) ? x.listId : listIds[0],
      starred: Boolean(x.starred),
      notes: typeof x.notes === 'string' ? x.notes.slice(0, 2000) : '',
      subtasks: Array.isArray(x.subtasks)
        ? x.subtasks.filter(s => s && typeof s.text === 'string').map(s => ({ id: String(s.id || uid()), text: s.text.slice(0, 150), done: Boolean(s.done) }))
        : [],
      order: Number.isFinite(x.order) ? x.order : i,
      createdAt: Number(x.createdAt) || Date.now(),
    };
  }

  function normalizeData(raw) {
    const lists = Array.isArray(raw && raw.lists)
      ? raw.lists.filter(l => l && l.id).map(l => ({
          id: String(l.id), key: typeof l.key === 'string' ? l.key : '', name: String(l.name || '').slice(0, 30),
          emoji: String(l.emoji || '📁').slice(0, 2), color: /^#[0-9a-f]{6}$/i.test(l.color) ? l.color : LIST_COLORS[0],
        }))
      : [];
    if (!lists.length) lists.push(...defaultLists());
    const ids = lists.map(l => l.id);
    const tasks = (Array.isArray(raw && raw.tasks) ? raw.tasks : []).map((x, i) => normalizeTask(x, i, ids)).filter(Boolean);
    const history = {};
    if (raw && raw.history && typeof raw.history === 'object') {
      Object.entries(raw.history).forEach(([k, v]) => { if (isDateKey(k) && Number(v) > 0) history[k] = Math.floor(Number(v)); });
    }
    return { tasks, lists, history };
  }

  function load() {
    const saved = storage.get(DATA_KEY);
    if (saved) {
      data = normalizeData(saved);
    } else {
      // Migrate tasks from the previous version of the app.
      const legacy = storage.get('tasks_v3');
      data = normalizeData({ tasks: Array.isArray(legacy) ? legacy : [] });
      data.tasks.forEach(x => {
        if (x.done && x.doneAt) { const k = dateKey(new Date(x.doneAt)); data.history[k] = (data.history[k] || 0) + 1; }
      });
      saveData();
    }

    const s = storage.get(SETTINGS_KEY);
    if (s) Object.assign(settings, s);
    else {
      const old = storage.get('todo_prefs') || {};
      if (old.theme === 'dark' || old.theme === 'light') settings.theme = old.theme;
      settings.lang = old.lang === 'en' ? 'en' : 'ar';
    }
    if (!I18N[settings.lang]) settings.lang = 'ar';
    if (!ACCENTS[settings.accent]) settings.accent = 'gold';
    if (!isValidView(settings.view)) settings.view = 'today';
    if (!isTime(settings.allDayTime)) settings.allDayTime = '09:00';
    if (!isTime(settings.dailyTime)) settings.dailyTime = '08:00';
  }

  let saveTimer;
  function saveData(debounced) {
    clearTimeout(saveTimer);
    if (debounced) saveTimer = setTimeout(() => storage.set(DATA_KEY, data), 300);
    else storage.set(DATA_KEY, data);
  }
  const saveSettings = () => storage.set(SETTINGS_KEY, settings);

  // =====================================================================
  //  Selectors
  // =====================================================================
  const findTask = id => data.tasks.find(x => x.id === id);
  const findList = id => data.lists.find(l => l.id === id);
  const listName = l => l ? (l.name || (l.key && t(l.key)) || '—') : '—';
  const isValidView = v => SMART_VIEWS.includes(v) || (typeof v === 'string' && v.startsWith('list:') && findList(v.slice(5)));
  const currentList = () => settings.view.startsWith('list:') ? findList(settings.view.slice(5)) : null;

  function matchesView(x, view) {
    const today = todayKey();
    switch (view) {
      case 'today': return x.done ? (x.due && x.due <= today) || (x.doneAt && dateKey(new Date(x.doneAt)) === today) : Boolean(x.due && x.due <= today);
      case 'upcoming': return Boolean(x.due && x.due > today);
      case 'important': return x.starred;
      case 'all': return true;
      case 'completed': return x.done;
      default: return view.startsWith('list:') && x.listId === view.slice(5);
    }
  }

  function matchesQuery(x) {
    if (!ui.query) return true;
    const q = ui.query.toLowerCase();
    return x.text.toLowerCase().includes(q) || x.notes.toLowerCase().includes(q) || x.subtasks.some(s => s.text.toLowerCase().includes(q));
  }

  const dueSortKey = x => (x.due || '9999') + 'T' + (x.time || '99:99');

  // A task is overdue once its day has passed, or once its time has passed today.
  function isOverdue(x) {
    if (x.done || !x.due) return false;
    const today = todayKey();
    return x.due < today || (x.due === today && Boolean(x.time) && x.time < nowTime());
  }

  const SORTERS = {
    manual: (a, b) => a.order - b.order,
    due: (a, b) => dueSortKey(a).localeCompare(dueSortKey(b)) || PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.order - b.order,
    priority: (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || (a.due || '9999').localeCompare(b.due || '9999') || a.order - b.order,
    newest: (a, b) => b.createdAt - a.createdAt,
    alpha: (a, b) => a.text.localeCompare(b.text, locale()),
  };

  function effectiveSort() {
    return settings.view === 'upcoming' ? 'due' : settings.sort;
  }

  function viewTasks() {
    const view = settings.view;
    const inView = data.tasks.filter(x => matchesView(x, view) && matchesQuery(x));
    if (view === 'completed') {
      return { active: inView.sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0)), done: [] };
    }
    const sorter = SORTERS[effectiveSort()] || SORTERS.manual;
    return {
      active: inView.filter(x => !x.done).sort(sorter),
      done: inView.filter(x => x.done).sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0)),
    };
  }

  const activeCount = view => data.tasks.filter(x => !x.done && matchesView(x, view)).length;

  // =====================================================================
  //  Mutations
  // =====================================================================
  function commit(opts = {}) {
    saveData(opts.debounced);
    if (!opts.silent) renderAll();
    scheduleSync();
  }

  function snapshot() { return clone(data); }

  function offerUndo(message, before) {
    showToast(message, { label: t('undo'), fn: () => { data = before; commit(); renderDetails(); } });
  }

  const WEEKDAYS = [
    ['الأحد', 'الاحد', 'sunday', 'sun'], ['الاثنين', 'الإثنين', 'monday', 'mon'], ['الثلاثاء', 'tuesday', 'tue'],
    ['الأربعاء', 'الاربعاء', 'wednesday', 'wed'], ['الخميس', 'thursday', 'thu'], ['الجمعة', 'الجمعه', 'friday', 'fri'],
    ['السبت', 'saturday', 'sat'],
  ];
  const toLatinDigits = str => str.replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

  // Pull a time out of free text. A bare number only counts as a time when it has a
  // colon, an am/pm marker, or a "at"/"الساعة" prefix — so "قراءة 20 صفحة" stays intact.
  function extractTime(text) {
    const re = /\s(?:(الساعة|الساعه|ساعة|at|@)\s*)?([0-9٠-٩]{1,2})(?::([0-9٠-٩]{2}))?\s*(a\.?m\.?|p\.?m\.?|ص|م|صباحاً|صباحا|الصبح|مساءً|مساء|المساء|ظهراً|ظهرا|الظهر|عصراً|عصرا|العصر|ليلاً|ليلا|بالليل)?(?=\s)/gi;
    let m;
    while ((m = re.exec(text))) {
      const [whole, prefix, hRaw, mRaw, suffixRaw] = m;
      if (!prefix && !mRaw && !suffixRaw) continue;
      let h = Number(toLatinDigits(hRaw));
      const min = mRaw ? Number(toLatinDigits(mRaw)) : 0;
      const suffix = (suffixRaw || '').toLowerCase();
      if (h > 23 || min > 59) continue;
      if (/^(p|م|مساء|المساء|عصر|العصر|ليل|بالليل)/.test(suffix)) { if (h < 12) h += 12; }
      else if (/^(ظهر|الظهر)/.test(suffix)) { if (h < 6) h += 12; }
      else if (/^(a|ص|صباح|الصبح)/.test(suffix)) { if (h === 12) h = 0; }
      else if (!mRaw && h >= 1 && h <= 6) h += 12; // "الساعة 5" almost always means the afternoon
      return { time: `${pad(h)}:${pad(min)}`, match: whole };
    }
    return null;
  }

  function parseSmart(raw) {
    let text = ` ${raw} `;
    const out = {};
    const bang = text.match(/\s(!{1,3})(?=\s)/);
    if (bang) { out.priority = ['low', 'med', 'high'][bang[1].length - 1]; text = text.replace(bang[0], ' '); }
    const tag = text.match(/\s#([^\s#]+)/);
    if (tag) {
      const name = tag[1].toLowerCase();
      const list = data.lists.find(l => listName(l).toLowerCase().replace(/\s+/g, '') === name || listName(l).toLowerCase().startsWith(name));
      if (list) { out.listId = list.id; text = text.replace(tag[0], ' '); }
    }
    const words = [
      [/\s(بعد غد|بعد غدٍ|بعد بكرة|بعد بكره|day after tomorrow)(?=\s)/i, 2],
      [/\s(today|tonight|اليوم|الليلة)(?=\s)/i, 0],
      [/\s(tomorrow|غدا|غداً|بكرة|بكره)(?=\s)/i, 1],
    ];
    for (const [re, n] of words) {
      const m = text.match(re);
      if (m) { out.due = addDays(todayKey(), n); text = text.replace(m[0], ' '); break; }
    }
    if (!out.due) {
      // Weekdays need a lead-in ("يوم الجمعة", "on friday") so names inside a title stay put.
      const m = text.match(/\s(يوم|on|next)\s+(\S+)(?=\s)/i);
      const idx = m ? WEEKDAYS.findIndex(names => names.includes(m[2].toLowerCase())) : -1;
      if (idx >= 0) {
        const diff = (idx - new Date().getDay() + 7) % 7 || 7;
        out.due = addDays(todayKey(), diff);
        text = text.replace(m[0], ' ');
      }
    }
    const time = extractTime(text);
    if (time) {
      out.time = time.time;
      text = text.replace(time.match, ' ');
      if (!out.due) out.due = time.time > nowTime() ? todayKey() : addDays(todayKey(), 1);
    }
    out.text = text.replace(/\s+/g, ' ').trim();
    if (!out.text) out.text = raw.trim();
    return out;
  }

  function addTask(raw) {
    const parsed = parseSmart(raw);
    const view = settings.view;
    const list = currentList();
    const minOrder = data.tasks.reduce((m, x) => Math.min(m, x.order), 0);
    const pickedTime = parsed.time || $('timeInput').value || null;
    let due = parsed.due || $('dueInput').value || (view === 'today' ? todayKey() : view === 'upcoming' ? addDays(todayKey(), 1) : null);
    if (pickedTime && !due) due = pickedTime > nowTime() ? todayKey() : addDays(todayKey(), 1);
    const task = {
      id: uid(),
      text: parsed.text.slice(0, 200),
      done: false, doneAt: null,
      priority: parsed.priority || ui.composerPriority,
      due,
      time: due && pickedTime ? pickedTime : null,
      remind: 'at',
      snoozeUntil: null,
      listId: parsed.listId || (list ? list.id : $('listSelect').value) || data.lists[0].id,
      starred: view === 'important',
      notes: '', subtasks: [],
      order: minOrder - 1,
      createdAt: Date.now(),
    };
    data.tasks.push(task);
    commit();
    const el = document.querySelector(`.task[data-id="${CSS.escape(task.id)}"]`);
    if (el) el.classList.add('new');
    haptic('light');
    // First dated task: offer to turn on reminders once.
    if (task.due && !settings.notify && !settings.askedNotify && Notifier.supported()) {
      settings.askedNotify = true; saveSettings();
      showToast(t('notifyPrompt'), { label: t('enableNotify'), fn: enableNotifications }, 8000);
    }
  }

  function setDone(task, done) {
    if (task.done === done) return;
    const prevDay = task.doneAt ? dateKey(new Date(task.doneAt)) : null;
    task.done = done;
    task.snoozeUntil = null;
    if (done) {
      task.doneAt = Date.now();
      const k = todayKey();
      data.history[k] = (data.history[k] || 0) + 1;
    } else {
      if (prevDay && data.history[prevDay]) {
        data.history[prevDay] -= 1;
        if (!data.history[prevDay]) delete data.history[prevDay];
      }
      task.doneAt = null;
    }
  }

  function toggleTask(id) {
    const task = findTask(id);
    if (!task) return;
    const hadActive = activeCount(settings.view) > 0;
    setDone(task, !task.done);
    if (task.done) {
      haptic('success');
      const el = document.querySelector(`.task[data-id="${CSS.escape(id)}"]`);
      if (el && !reducedMotion()) {
        el.classList.add('completing');
        setTimeout(() => { commit(); renderDetails(); }, 380);
      } else { commit(); renderDetails(); }
      if (hadActive && activeCount(settings.view) === 0 && settings.confetti) setTimeout(burstConfetti, 200);
    } else { commit(); renderDetails(); }
  }

  function deleteTask(id) {
    const before = snapshot();
    data.tasks = data.tasks.filter(x => x.id !== id);
    if (ui.openId === id) closeDetails();
    commit();
    offerUndo(t('deleted'), before);
  }

  function reorder(ids) {
    const tasks = ids.map(findTask).filter(Boolean);
    const orders = tasks.map(x => x.order).sort((a, b) => a - b);
    tasks.forEach((x, i) => { x.order = orders[i]; });
    // Keep orders unique so later reorders stay stable.
    const seen = new Set();
    data.tasks.sort((a, b) => a.order - b.order).forEach((x, i) => {
      if (seen.has(x.order)) x.order += i * 1e-6;
      seen.add(x.order);
    });
    commit();
  }

  // =====================================================================
  //  Rendering — sidebar
  // =====================================================================
  function renderNav() {
    document.querySelectorAll('#smartNav .nav-item').forEach(btn => {
      const active = settings.view === btn.dataset.view;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-current', active ? 'page' : 'false');
    });
    document.querySelectorAll('[data-count]').forEach(el => {
      const view = el.dataset.count;
      const n = view === 'completed' ? data.tasks.filter(x => x.done).length : activeCount(view);
      el.textContent = n || '';
      el.classList.toggle('alert', view === 'today' && data.tasks.some(isOverdue));
    });

    const nav = $('listNav');
    nav.replaceChildren(...data.lists.map(l => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'nav-item';
      b.dataset.view = 'list:' + l.id;
      const active = settings.view === b.dataset.view;
      b.classList.toggle('active', active);
      b.setAttribute('aria-current', active ? 'page' : 'false');
      b.style.setProperty('--list', l.color);
      const ico = document.createElement('span'); ico.className = 'nav-ico'; ico.textContent = l.emoji;
      const label = document.createElement('span'); label.className = 'nav-label'; label.textContent = listName(l);
      const count = document.createElement('span'); count.className = 'nav-count'; count.textContent = activeCount(b.dataset.view) || '';
      const bar = document.createElement('i'); bar.className = 'list-bar';
      b.append(bar, ico, label, count);
      return b;
    }));
  }

  function renderStats() {
    const today = todayKey();
    $('doneToday').textContent = data.history[today] || 0;
    let streak = 0;
    let day = data.history[today] ? today : addDays(today, -1);
    while (data.history[day]) { streak++; day = addDays(day, -1); }
    $('streakNum').textContent = streak;

    const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
    const max = Math.max(1, ...days.map(k => data.history[k] || 0));
    const chart = $('weekChart');
    chart.replaceChildren(...days.map(k => {
      const col = document.createElement('div');
      col.className = 'wk' + (k === today ? ' today' : '');
      const n = data.history[k] || 0;
      col.title = `${parseKey(k).toLocaleDateString(locale(), { weekday: 'long' })}: ${n}`;
      const bar = document.createElement('div');
      bar.className = 'wk-bar';
      bar.style.height = Math.max(8, (n / max) * 100) + '%';
      if (!n) bar.classList.add('zero');
      const lbl = document.createElement('span');
      lbl.textContent = parseKey(k).toLocaleDateString(locale(), { weekday: 'narrow' });
      col.append(bar, lbl);
      return col;
    }));
  }

  // =====================================================================
  //  Rendering — main
  // =====================================================================
  function fmtTime(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return new Date(2000, 0, 1, h, m).toLocaleTimeString(locale(), { hour: 'numeric', minute: '2-digit' });
  }

  function dueLabel(key) {
    const diff = dayDiff(key);
    if (diff === 0) return t('today');
    if (diff === 1) return t('tomorrow');
    if (diff === -1) return t('yesterday');
    const d = parseKey(key);
    if (diff > 1 && diff < 7) return d.toLocaleDateString(locale(), { weekday: 'long' });
    const opts = { month: 'short', day: 'numeric' };
    if (d.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric';
    return d.toLocaleDateString(locale(), opts);
  }

  function metaChip(text, cls) {
    const s = document.createElement('span');
    s.className = 'meta ' + (cls || '');
    s.textContent = text;
    return s;
  }

  function buildTask(task) {
    const li = $('taskTpl').content.firstElementChild.cloneNode(true);
    li.dataset.id = task.id;
    li.classList.add('p-' + task.priority);
    li.classList.toggle('done', task.done);
    li.classList.toggle('open', ui.openId === task.id);

    const check = li.querySelector('.check');
    check.setAttribute('aria-pressed', String(task.done));
    check.setAttribute('aria-label', t(task.done ? 'markUndone' : 'markDone'));

    li.querySelector('.task-title').textContent = task.text;

    const meta = li.querySelector('.task-meta');
    const list = findList(task.listId);
    if (list && !settings.view.startsWith('list:')) {
      const chip = metaChip(`${list.emoji} ${listName(list)}`, 'list-chip');
      chip.style.setProperty('--list', list.color);
      meta.append(chip);
    }
    if (task.due) {
      const overdue = isOverdue(task);
      const soon = !task.done && dayDiff(task.due) <= 1 && !overdue;
      const when = dueLabel(task.due) + (task.time ? ` · ${fmtTime(task.time)}` : '');
      meta.append(metaChip('📅 ' + (overdue ? `${t('overdue')} · ` : '') + when, overdue ? 'overdue' : soon ? 'soon' : ''));
      if (settings.notify && Notifier.fireTime(task)) meta.append(metaChip('🔔', 'bell'));
    }
    if (task.priority !== 'none') {
      meta.append(metaChip(t({ low: 'pLow', med: 'pMed', high: 'pHigh' }[task.priority]), 'prio ' + task.priority));
    }
    if (task.subtasks.length) {
      const doneSubs = task.subtasks.filter(s => s.done).length;
      meta.append(metaChip(`☑ ${doneSubs}/${task.subtasks.length}`, doneSubs === task.subtasks.length ? 'subs-done' : ''));
    }
    if (task.notes.trim()) meta.append(metaChip('📝', 'note'));
    if (!meta.childElementCount) meta.remove();

    const star = li.querySelector('.star-btn');
    star.classList.toggle('on', task.starred);
    star.setAttribute('aria-pressed', String(task.starred));
    star.setAttribute('aria-label', t(task.starred ? 'unstar' : 'star'));
    li.querySelector('.del-btn').setAttribute('aria-label', t('delete'));

    const body = li.querySelector('.task-body');
    body.tabIndex = 0;
    body.setAttribute('role', 'button');
    body.setAttribute('aria-label', task.text);
    return li;
  }

  function groupHeader(text, overdue) {
    const li = document.createElement('li');
    li.className = 'group-head' + (overdue ? ' overdue' : '');
    li.textContent = text;
    return li;
  }

  function renderHeader() {
    const view = settings.view;
    const list = currentList();
    $('viewIcon').textContent = list ? list.emoji : VIEW_ICONS[view];
    $('viewTitle').textContent = list ? listName(list) : t(view === 'all' ? 'allTasks' : view);
    document.documentElement.style.setProperty('--view-color', list ? list.color : 'var(--accent)');

    const h = new Date().getHours();
    $('greeting').textContent = t(h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening');
    $('viewDate').textContent = new Date().toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' });

    const inView = data.tasks.filter(x => matchesView(x, view));
    const total = view === 'completed' ? data.tasks.length : inView.length;
    const done = inView.filter(x => x.done).length;
    const pct = total ? Math.round(done / total * 100) : 0;
    const ring = $('ringFill');
    const C = ring.getTotalLength ? ring.getTotalLength() : 190;
    ring.style.strokeDasharray = C;
    ring.style.strokeDashoffset = C - C * pct / 100;
    $('ringPct').textContent = pct + '%';
    $('ring').title = t('tasksLeft')(total - done);
    $('ring').classList.toggle('full', pct === 100 && total > 0);

    const bell = $('bellBtn');
    bell.classList.toggle('on', settings.notify);
    bell.setAttribute('aria-label', t(settings.notify ? 'bellOn' : 'bellOff'));
    bell.title = t(settings.notify ? 'bellOn' : 'bellOff');

    $('listMenuBtn').hidden = !list;
    $('sortSelect').value = settings.sort;
    $('sortSelect').hidden = view === 'upcoming' || view === 'completed';
    document.body.classList.toggle('manual-sort', effectiveSort() === 'manual' && view !== 'completed' && !ui.query);
  }

  function renderLists() {
    const { active, done } = viewTasks();
    const listEl = $('taskList');
    const items = [];
    if (settings.view === 'upcoming') {
      let last = null;
      active.forEach(x => {
        if (x.due !== last) { items.push(groupHeader(dueLabel(x.due) + ' · ' + parseKey(x.due).toLocaleDateString(locale(), { day: 'numeric', month: 'long' }))); last = x.due; }
        items.push(buildTask(x));
      });
    } else if (settings.view === 'today' && effectiveSort() !== 'manual') {
      const overdue = active.filter(isOverdue);
      const rest = active.filter(x => !isOverdue(x));
      if (overdue.length) { items.push(groupHeader(t('overdue'), true)); overdue.forEach(x => items.push(buildTask(x))); }
      if (overdue.length && rest.length) items.push(groupHeader(t('today')));
      rest.forEach(x => items.push(buildTask(x)));
    } else {
      active.forEach(x => items.push(buildTask(x)));
    }
    listEl.replaceChildren(...items);

    const doneSection = $('doneSection');
    doneSection.hidden = !done.length;
    $('doneLabel').textContent = t('completedCount')(done.length);
    $('doneToggle').setAttribute('aria-expanded', String(settings.showDone));
    doneSection.classList.toggle('collapsed', !settings.showDone);
    $('doneList').replaceChildren(...(settings.showDone ? done.map(buildTask) : []));

    // Empty state
    const empty = $('empty');
    const nothing = !active.length;
    empty.hidden = !nothing;
    if (nothing) {
      let key;
      if (ui.query) key = 'emptySearch';
      else if (done.length) key = 'allDone';
      else key = { today: 'emptyToday', upcoming: 'emptyUpcoming', important: 'emptyImportant', all: 'emptyAll', completed: 'emptyCompleted' }[settings.view] || 'emptyList';
      const [title, sub] = t(key);
      $('emptyTitle').textContent = title;
      $('emptySub').textContent = sub;
      $('emptyArt').textContent = { emptySearch: '🔍', allDone: '🏆', emptyToday: '🌤️', emptyUpcoming: '🗓️', emptyImportant: '⭐', emptyCompleted: '🌱' }[key] || '🌿';
    }
  }

  function renderComposerLists() {
    const list = currentList();
    const sel = $('listSelect');
    const prev = sel.value;
    sel.replaceChildren(...data.lists.map(l => {
      const o = document.createElement('option');
      o.value = l.id;
      o.textContent = `${l.emoji} ${listName(l)}`;
      return o;
    }));
    sel.value = list ? list.id : (findList(prev) ? prev : data.lists[0].id);
    sel.hidden = Boolean(list);
  }

  function renderAll() {
    renderNav();
    renderStats();
    renderHeader();
    renderLists();
    renderComposerLists();
  }

  // =====================================================================
  //  Details panel
  // =====================================================================
  function openDetails(id) {
    ui.openId = id;
    document.body.classList.add('details-open');
    $('details').setAttribute('aria-hidden', 'false');
    renderDetails();
    document.querySelectorAll('.task').forEach(el => el.classList.toggle('open', el.dataset.id === id));
    requestAnimationFrame(() => { autosize($('dTitle')); });
  }

  function closeDetails() {
    if (!ui.openId) return;
    ui.openId = null;
    document.body.classList.remove('details-open');
    $('details').setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.task.open').forEach(el => el.classList.remove('open'));
  }

  function autosize(el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }

  function renderDetails() {
    const task = ui.openId && findTask(ui.openId);
    if (!task) { closeDetails(); return; }
    const title = $('dTitle');
    if (document.activeElement !== title) title.value = task.text;
    autosize(title);
    $('dCheck').setAttribute('aria-pressed', String(task.done));
    $('dCheck').setAttribute('aria-label', t(task.done ? 'markUndone' : 'markDone'));
    $('dCheck').className = `check lg p-${task.priority}` + (task.done ? ' on' : '');
    $('dStar').classList.toggle('on', task.starred);
    $('dStar').setAttribute('aria-pressed', String(task.starred));
    $('dStar').setAttribute('aria-label', t(task.starred ? 'unstar' : 'star'));
    $('dDue').value = task.due || '';
    $('dTime').value = task.time || '';
    $('dTime').disabled = !task.due;
    const remind = $('dRemind');
    if (remind.options.length !== Object.keys(REMINDERS).length || remind.dataset.lang !== settings.lang) {
      remind.replaceChildren(...Object.keys(REMINDERS).map(k => {
        const o = document.createElement('option'); o.value = k; o.textContent = t('remind')[k]; return o;
      }));
      remind.dataset.lang = settings.lang;
    }
    remind.value = task.remind;
    const hint = $('dNotifyHint');
    const wantsReminder = task.remind !== 'none' && !task.done;
    hint.hidden = !wantsReminder || (settings.notify && Boolean(task.due));
    $('dNotifyHintText').textContent = !task.due ? t('detailsHintNoDate') : t('detailsHintOff');
    hint.classList.toggle('actionable', Boolean(task.due) && !settings.notify);
    const dl = $('dList');
    dl.replaceChildren(...data.lists.map(l => {
      const o = document.createElement('option'); o.value = l.id; o.textContent = `${l.emoji} ${listName(l)}`; return o;
    }));
    dl.value = task.listId;
    $('dPriority').querySelectorAll('button').forEach(b => {
      const on = b.dataset.p === task.priority;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    if (document.activeElement !== $('dNotes')) $('dNotes').value = task.notes;
    $('dCreated').textContent = t('created')(new Date(task.createdAt).toLocaleDateString(locale(), { day: 'numeric', month: 'short', year: 'numeric' }));

    const subs = $('dSubtasks');
    subs.replaceChildren(...task.subtasks.map(s => {
      const li = document.createElement('li');
      li.className = 'sub' + (s.done ? ' done' : '');
      li.dataset.sid = s.id;
      const c = document.createElement('button');
      c.type = 'button'; c.className = 'check sm' + (s.done ? ' on' : ''); c.dataset.sub = 'toggle';
      c.setAttribute('aria-pressed', String(s.done));
      c.setAttribute('aria-label', t(s.done ? 'markUndone' : 'markDone'));
      c.innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
      const input = document.createElement('input');
      input.value = s.text; input.maxLength = 150; input.dataset.sub = 'text';
      input.setAttribute('aria-label', t('subtasks'));
      const del = document.createElement('button');
      del.type = 'button'; del.className = 'sub-del'; del.dataset.sub = 'delete'; del.textContent = '✕';
      del.setAttribute('aria-label', t('delete'));
      li.append(c, input, del);
      return li;
    }));
  }

  function withOpenTask(fn, opts) {
    const task = ui.openId && findTask(ui.openId);
    if (!task) return;
    fn(task);
    commit(opts);
    if (!opts || !opts.skipDetails) renderDetails();
  }

  // =====================================================================
  //  Drag & drop (pointer events: works with mouse and touch)
  // =====================================================================
  function initDrag() {
    const listEl = $('taskList');
    let drag = null;

    listEl.addEventListener('pointerdown', e => {
      const handle = e.target.closest('.handle');
      if (!handle || !document.body.classList.contains('manual-sort')) return;
      const li = handle.closest('.task');
      e.preventDefault();
      const rect = li.getBoundingClientRect();
      drag = { li, pointerId: e.pointerId, offsetY: e.clientY - rect.top, startY: e.clientY };
      li.classList.add('dragging');
      li.style.setProperty('--dy', '0px');
      handle.setPointerCapture(e.pointerId);
      document.body.classList.add('is-dragging');
    });

    listEl.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.pointerId) return;
      const { li } = drag;
      const siblings = [...listEl.querySelectorAll('.task:not(.dragging)')];
      const next = siblings.find(s => { const r = s.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
      const before = li.getBoundingClientRect().top;
      if (next) { if (li.nextElementSibling !== next) listEl.insertBefore(li, next); }
      else if (listEl.lastElementChild !== li) listEl.appendChild(li);
      const after = li.getBoundingClientRect().top;
      drag.startY += after - before;
      li.style.setProperty('--dy', (e.clientY - drag.startY) + 'px');

      // Auto-scroll near the edges of the viewport.
      const edge = 60;
      if (e.clientY < edge) window.scrollBy(0, -10);
      else if (e.clientY > window.innerHeight - edge) window.scrollBy(0, 10);
    });

    const end = e => {
      if (!drag || e.pointerId !== drag.pointerId) return;
      drag.li.classList.remove('dragging');
      drag.li.style.removeProperty('--dy');
      document.body.classList.remove('is-dragging');
      drag = null;
      reorder([...listEl.querySelectorAll('.task')].map(el => el.dataset.id));
    };
    listEl.addEventListener('pointerup', end);
    listEl.addEventListener('pointercancel', end);
  }

  // =====================================================================
  //  Toast
  // =====================================================================
  let toastTimer;
  // action: optional { label, fn } rendered as the toast's button (Undo, Turn on, …)
  function showToast(message, action, duration = 5000) {
    clearTimeout(toastTimer);
    ui.undo = action ? action.fn : null;
    $('toastMsg').textContent = message;
    const btn = $('toastBtn');
    btn.hidden = !action;
    btn.textContent = action ? action.label : '';
    const toast = $('toast');
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('show'));
    toastTimer = setTimeout(hideToast, duration);
  }
  function hideToast() {
    const toast = $('toast');
    toast.classList.remove('show');
    ui.undo = null;
    setTimeout(() => { if (!toast.classList.contains('show')) toast.hidden = true; }, 250);
  }

  // =====================================================================
  //  Confetti
  // =====================================================================
  function burstConfetti() {
    if (reducedMotion()) return;
    const canvas = $('confetti');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const colors = [ACCENTS[settings.accent], '#f1ddae', '#d8b878', '#a8864a', '#fff7e6', '#5fcf9c'];
    const parts = Array.from({ length: 140 }, () => ({
      x: innerWidth / 2, y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 16, vy: Math.random() * -14 - 4,
      size: Math.random() * 7 + 4, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)], life: 0,
    }));
    canvas.classList.add('on');
    let frame = 0;
    (function tick() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(p => {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - frame / 150);
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.moveTo(0, -p.size / 2); ctx.lineTo(p.size / 3, 0); ctx.lineTo(0, p.size / 2); ctx.lineTo(-p.size / 3, 0); ctx.closePath(); ctx.fill();
        ctx.restore();
      });
      if (++frame < 150) requestAnimationFrame(tick);
      else { ctx.clearRect(0, 0, innerWidth, innerHeight); canvas.classList.remove('on'); }
    })();
  }

  // =====================================================================
  //  Reminders & notifications
  //  Android app: exact alarms through Capacitor LocalNotifications, delivered
  //  even when the app is closed or the phone restarts. Website: timers while the
  //  page is open, shown through the service worker so mobile browsers work too.
  // =====================================================================
  const Native = window.NativeApp && window.NativeApp.isNative ? window.NativeApp : null;
  const DAILY_ID_BASE = 900; // 900–906: morning summaries for the next seven days
  const TEST_ID = 999;
  const MAX_SCHEDULED = 60;

  function notifId(taskId) {
    let h = 0;
    for (const ch of taskId) h = (Math.imul(31, h) + ch.charCodeAt(0)) | 0;
    return 1000 + (Math.abs(h) % 2000000000);
  }

  // "Today · 5:00 PM" relative to the moment the notification fires, not to now.
  function whenLabel(task, at) {
    const diff = Math.round((parseKey(task.due) - parseKey(dateKey(new Date(at)))) / 86400000);
    const day = diff === 0 ? t('today') : diff === 1 ? t('tomorrow')
      : parseKey(task.due).toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' });
    return task.time ? `${day} · ${fmtTime(task.time)}` : day;
  }

  const Notifier = {
    timers: [],
    signature: '',

    supported() { return Boolean(Native) || 'Notification' in window; },

    fireTime(task) {
      if (task.done || !task.due || REMINDERS[task.remind] == null) return null;
      const now = Date.now();
      if (task.snoozeUntil && task.snoozeUntil > now) return task.snoozeUntil;
      const [h, m] = (task.time || settings.allDayTime).split(':').map(Number);
      const d = parseKey(task.due);
      d.setHours(h, m, 0, 0);
      const at = d.getTime() - REMINDERS[task.remind] * 60000;
      return at > now ? at : null;
    },

    plan() {
      if (!settings.notify) return [];
      const items = [];
      data.tasks.forEach(task => {
        const at = this.fireTime(task);
        if (!at) return;
        const list = findList(task.listId);
        const bits = [whenLabel(task, at)];
        if (list) bits.push(`${list.emoji} ${listName(list)}`);
        if (task.subtasks.length) bits.push(`☑ ${task.subtasks.filter(x => x.done).length}/${task.subtasks.length}`);
        items.push({
          id: notifId(task.id), at, kind: 'task', taskId: task.id,
          title: (task.priority === 'high' ? '❗ ' : '') + task.text,
          body: bits.join('  ·  '),
          largeBody: task.notes.trim() ? `${bits.join('  ·  ')}\n${task.notes.trim().slice(0, 240)}` : undefined,
        });
      });
      items.sort((a, b) => a.at - b.at);
      items.length = Math.min(items.length, MAX_SCHEDULED);

      if (settings.daily) {
        const [h, m] = settings.dailyTime.split(':').map(Number);
        for (let i = 0; i < 7; i++) {
          const day = addDays(todayKey(), i);
          const d = parseKey(day); d.setHours(h, m, 0, 0);
          if (d.getTime() <= Date.now()) continue;
          const due = data.tasks.filter(x => !x.done && x.due === day).sort(SORTERS.due);
          const late = data.tasks.filter(x => !x.done && x.due && x.due < day).length;
          if (!due.length && !late) continue;
          const names = due.slice(0, 3).map(x => '• ' + x.text + (x.time ? ` (${fmtTime(x.time)})` : ''));
          if (due.length > 3) names.push(t('summaryMore')(due.length - 3));
          items.push({
            id: DAILY_ID_BASE + i, at: d.getTime(), kind: 'daily',
            title: t(h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening') + ' — ' + t('summaryTitle')(due.length) + (late ? t('overdueSuffix')(late) : ''),
            body: names.join('\n') || t('overdue'),
          });
        }
      }
      return items;
    },

    async permission() {
      if (Native) {
        try { const r = await Native.LocalNotifications.checkPermissions(); return r.display === 'granted' ? 'granted' : r.display === 'denied' ? 'denied' : 'prompt'; }
        catch { return 'prompt'; }
      }
      if (!('Notification' in window)) return 'unsupported';
      return Notification.permission === 'default' ? 'prompt' : Notification.permission;
    },

    async request() {
      if (Native) {
        try { const r = await Native.LocalNotifications.requestPermissions(); return r.display === 'granted'; }
        catch { return false; }
      }
      if (!('Notification' in window)) return false;
      try { return (await Notification.requestPermission()) === 'granted'; } catch { return false; }
    },

    async sync(force) {
      const items = this.plan();
      const sig = JSON.stringify(items.map(i => [i.id, i.at, i.title, i.body, i.largeBody]));
      if (!force && sig === this.signature) return;
      this.signature = sig;
      try {
        if (Native) await this.syncNative(items);
        else this.syncWeb(items);
      } catch (err) {
        this.signature = '';
        console.warn('Reminder sync failed', err);
      }
    },

    async syncNative(items) {
      const LN = Native.LocalNotifications;
      const pending = await LN.getPending();
      const stale = pending.notifications.filter(n => n.id !== TEST_ID).map(n => ({ id: n.id }));
      if (stale.length) await LN.cancel({ notifications: stale });
      if (!items.length || (await this.permission()) !== 'granted') return;
      // Without exact-alarm access the plugin would open system settings on every
      // schedule call; fall back to inexact alarms quietly instead.
      let exact = true;
      try { exact = (await LN.checkExactNotificationSetting()).exact_alarm === 'granted'; } catch { /* older Android */ }
      await LN.schedule({
        notifications: items.map(it => ({
          id: it.id, title: it.title, body: it.body, largeBody: it.largeBody,
          schedule: { at: new Date(it.at), allowWhileIdle: true },
          channelId: it.kind === 'daily' ? 'daily' : 'reminders',
          actionTypeId: it.kind === 'task' ? 'TASK_REMINDER' : undefined,
          group: it.kind === 'task' ? 'tasks' : 'summary',
          extra: { taskId: it.taskId || '', view: it.kind === 'daily' ? 'today' : '' },
          smallIcon: 'ic_stat_notify', iconColor: '#D8B878',
          isExactNotification: exact,
        })),
      });
    },

    syncWeb(items) {
      this.timers.forEach(clearTimeout);
      this.timers = [];
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      const horizon = Date.now() + 24 * 3600 * 1000; // re-armed hourly and on every change
      items.filter(it => it.at <= horizon).forEach(it => {
        this.timers.push(setTimeout(() => this.showWeb(it), Math.max(0, it.at - Date.now())));
      });
    },

    async showWeb(it) {
      const options = {
        body: it.body, tag: it.taskId || it.kind, renotify: true,
        icon: 'icons/icon-192.png', badge: 'icons/badge-96.png',
        lang: settings.lang, dir: settings.lang === 'ar' ? 'rtl' : 'ltr',
        data: { taskId: it.taskId || '', view: it.kind === 'daily' ? 'today' : '' },
      };
      const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : null;
      if (reg) {
        if (it.kind === 'task') options.actions = [{ action: 'done', title: t('notifDone') }, { action: 'snooze', title: t('notifSnooze') }];
        return reg.showNotification(it.title, options);
      }
      const n = new Notification(it.title, options);
      n.onclick = () => { window.focus(); handleNotificationAction('tap', options.data); n.close(); };
    },

    async test() {
      const item = { id: TEST_ID, kind: 'test', title: t('testTitle'), body: t('testBody') };
      if (Native) {
        await Native.LocalNotifications.schedule({ notifications: [{
          id: TEST_ID, title: item.title, body: item.body, channelId: 'reminders',
          schedule: { at: new Date(Date.now() + 1500), allowWhileIdle: true },
          smallIcon: 'ic_stat_notify', iconColor: '#D8B878', isExactNotification: false,
        }] });
      } else await this.showWeb(item);
    },
  };

  let syncTimer;
  function scheduleSync(force) {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => Notifier.sync(force), force ? 0 : 600);
  }

  async function enableNotifications() {
    const granted = await Notifier.request();
    settings.notify = granted;
    settings.askedNotify = true;
    saveSettings();
    renderAll();
    renderDetails();
    if ($('settingsDialog').open) renderNotifySettings();
    if (!granted) {
      showToast(t(Notifier.supported() ? 'notifyDenied' : 'notifyUnsupported'), null, 7000);
      return false;
    }
    scheduleSync(true);
    showToast(t('notifyEnabled'));
    haptic('success');
    return true;
  }

  // Shared by Android notification buttons, service-worker clicks and launch URLs.
  function handleNotificationAction(action, extra = {}) {
    const task = extra.taskId && findTask(extra.taskId);
    if (action === 'done' && task) {
      if (!task.done) { setDone(task, true); commit(); renderDetails(); }
      showToast(t('markedDone'));
    } else if (action === 'snooze' && task) {
      task.snoozeUntil = Date.now() + SNOOZE_MINUTES * 60000;
      commit();
      showToast(t('snoozed'));
    } else if (task) {
      if (!matchesView(task, settings.view)) setView(task.done ? 'completed' : 'all');
      openDetails(task.id);
    } else if (extra.view && isValidView(extra.view)) {
      setView(extra.view);
    }
  }

  function haptic(kind) {
    if (Native && Native.Haptics) {
      const p = kind === 'success' ? Native.Haptics.notification({ type: 'SUCCESS' }) : Native.Haptics.impact({ style: 'LIGHT' });
      if (p && p.catch) p.catch(() => {});
    } else if (navigator.vibrate && window.matchMedia('(pointer: coarse)').matches) {
      try { navigator.vibrate(kind === 'success' ? [8, 40, 12] : 6); } catch { /* ignore */ }
    }
  }

  async function initNativeText() {
    const LN = Native.LocalNotifications;
    try {
      await LN.createChannel({ id: 'reminders', name: t('channelName'), description: t('channelDesc'), importance: 5, visibility: 1, vibration: true, lights: true, lightColor: '#D8B878' });
      await LN.createChannel({ id: 'daily', name: t('dailyChannel'), importance: 3, visibility: 1, vibration: false });
      await LN.registerActionTypes({ types: [{ id: 'TASK_REMINDER', actions: [{ id: 'done', title: t('notifDone') }, { id: 'snooze', title: t('notifSnooze') }] }] });
    } catch (err) { console.warn('Notification setup failed', err); }
  }

  async function initNative() {
    if (!Native) return;
    document.documentElement.classList.add('native');
    const LN = Native.LocalNotifications;
    await initNativeText();
    LN.addListener('localNotificationActionPerformed', ({ actionId, notification }) => handleNotificationAction(actionId, notification.extra || {}));

    Native.App.addListener('backButton', () => {
      const dlg = document.querySelector('dialog[open]');
      if (dlg) dlg.close();
      else if (document.body.classList.contains('sidebar-open')) closeSidebar();
      else if (ui.openId) closeDetails();
      else if (ui.query) { $('searchInput').value = ''; ui.query = ''; renderHeader(); renderLists(); }
      else if (settings.view !== 'today') setView('today');
      else Native.App.minimizeApp();
    });
    Native.App.addListener('resume', () => { renderAll(); scheduleSync(); });
    if (Native.SplashScreen) Native.SplashScreen.hide().catch(() => {});
  }

  // =====================================================================
  //  Appearance & language
  // =====================================================================
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  function applyAppearance() {
    const dark = settings.theme === 'dark' || (settings.theme === 'system' && systemDark.matches);
    const root = document.documentElement;
    root.dataset.theme = dark ? 'dark' : 'light';
    root.dataset.accent = settings.accent;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#0b1f1a' : '#eef2ee';
    if (Native && Native.SystemBars) Native.SystemBars.setStyle({ style: dark ? 'DARK' : 'LIGHT' }).catch(() => {});
  }

  function applyLanguage() {
    const root = document.documentElement;
    root.lang = settings.lang;
    root.dir = settings.lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(',').forEach(pair => {
        const [attr, key] = pair.split(':');
        el.setAttribute(attr, t(key));
      });
    });
    document.title = t('appName');
  }

  function renderSettings() {
    const mark = (segId, value) => $(segId).querySelectorAll('button').forEach(b => {
      const on = b.dataset.v === value;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    mark('langSeg', settings.lang);
    mark('themeSeg', settings.theme);
    $('confettiToggle').checked = settings.confetti;
    $('appRow').hidden = Boolean(Native);
    $('appVersion').textContent = t('version')(APP_VERSION);
    renderNotifySettings();
    $('accentSwatches').replaceChildren(...Object.entries(ACCENTS).map(([name, color]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'swatch' + (settings.accent === name ? ' active' : '');
      b.style.background = color; b.dataset.accent = name;
      b.setAttribute('aria-label', t('gems')[name]); b.title = t('gems')[name]; b.setAttribute('aria-pressed', String(settings.accent === name));
      return b;
    }));
  }

  async function renderNotifySettings() {
    const state = Notifier.supported() ? await Notifier.permission() : 'unsupported';
    const on = settings.notify && state === 'granted';
    $('notifyToggle').checked = on;
    $('notifyToggle').disabled = state === 'unsupported';
    $('notifyStatus').textContent = state === 'unsupported' ? t('notifyUnsupported')
      : state === 'denied' ? t('notifyBlocked')
      : !on ? t('notifyOff') : Native ? t('notifyOnNative') : t('notifyOnWeb');
    $('notifySection').classList.toggle('off', !on);
    document.querySelectorAll('[data-needs-notify]').forEach(el => {
      el.classList.toggle('disabled', !on);
      el.querySelectorAll('input, button').forEach(c => { c.disabled = !on; });
    });
    $('allDayTime').value = settings.allDayTime;
    $('dailyTime').value = settings.dailyTime;
    $('dailyToggle').checked = settings.daily;
  }

  function openSettings(section) {
    renderSettings();
    $('settingsDialog').showModal();
    if (section) requestAnimationFrame(() => $(section).scrollIntoView({ block: 'start', behavior: 'smooth' }));
  }

  // =====================================================================
  //  Navigation
  // =====================================================================
  function setView(view) {
    if (!isValidView(view)) return;
    settings.view = view;
    saveSettings();
    closeSidebar();
    renderAll();
    $('main').scrollTop = 0;
  }

  function openSidebar() { document.body.classList.add('sidebar-open'); $('scrim').hidden = false; }
  function closeSidebar() { document.body.classList.remove('sidebar-open'); $('scrim').hidden = true; }

  // =====================================================================
  //  Events
  // =====================================================================
  function bindEvents() {
    // Composer
    $('composer').addEventListener('submit', e => {
      e.preventDefault();
      const input = $('taskInput');
      const text = input.value.trim();
      if (!text) { input.focus(); return; }
      addTask(text);
      input.value = '';
      $('dueInput').value = '';
      $('timeInput').value = '';
      $('timeInput').closest('.chip').classList.remove('active');
      document.querySelectorAll('.chip[data-quick]').forEach(c => c.classList.remove('active'));
      $('dueInput').closest('.chip').classList.remove('active');
      input.focus();
    });
    $('prioritySeg').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      ui.composerPriority = b.dataset.p;
      $('prioritySeg').querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
    });
    document.querySelectorAll('.chip[data-quick]').forEach(chip => chip.addEventListener('click', () => {
      const target = addDays(todayKey(), chip.dataset.quick === 'today' ? 0 : 1);
      const on = $('dueInput').value !== target || !chip.classList.contains('active');
      $('dueInput').value = on ? target : '';
      document.querySelectorAll('.chip[data-quick]').forEach(c => c.classList.toggle('active', on && c === chip));
      $('dueInput').closest('.chip').classList.remove('active');
    }));
    $('timeInput').addEventListener('change', () => {
      $('timeInput').closest('.chip').classList.toggle('active', Boolean($('timeInput').value));
    });
    $('dueInput').addEventListener('change', () => {
      document.querySelectorAll('.chip[data-quick]').forEach(c => c.classList.remove('active'));
      $('dueInput').closest('.chip').classList.toggle('active', Boolean($('dueInput').value));
    });

    // Navigation
    $('smartNav').addEventListener('click', e => { const b = e.target.closest('.nav-item'); if (b) setView(b.dataset.view); });
    $('listNav').addEventListener('click', e => { const b = e.target.closest('.nav-item'); if (b) setView(b.dataset.view); });
    $('menuBtn').addEventListener('click', openSidebar);
    $('closeSidebar').addEventListener('click', closeSidebar);
    $('scrim').addEventListener('click', () => { closeSidebar(); closeDetails(); });

    // Toolbar
    $('searchInput').addEventListener('input', e => { ui.query = e.target.value.trim(); renderHeader(); renderLists(); });
    $('sortSelect').addEventListener('change', e => { settings.sort = e.target.value; saveSettings(); renderAll(); });
    $('listMenuBtn').addEventListener('click', () => {
      const list = currentList(); if (!list) return;
      if (data.lists.length < 2) { showToast(t('lastList')); return; }
      const n = data.tasks.filter(x => x.listId === list.id).length;
      if (!confirm(t('confirmDeleteList')(listName(list), n))) return;
      const before = snapshot();
      data.tasks = data.tasks.filter(x => x.listId !== list.id);
      data.lists = data.lists.filter(l => l.id !== list.id);
      if (ui.openId && !findTask(ui.openId)) closeDetails();
      settings.view = 'all'; saveSettings();
      commit();
      offerUndo(t('listDeleted'), before);
    });

    // Task list interactions (both active and done lists)
    const onListClick = e => {
      const li = e.target.closest('.task'); if (!li) return;
      const actionEl = e.target.closest('[data-action]'); if (!actionEl) return;
      const id = li.dataset.id;
      const task = findTask(id); if (!task) return;
      switch (actionEl.dataset.action) {
        case 'toggle': toggleTask(id); break;
        case 'star': task.starred = !task.starred; commit(); renderDetails(); break;
        case 'delete': {
          if (!reducedMotion()) { li.classList.add('removing'); setTimeout(() => deleteTask(id), 200); }
          else deleteTask(id);
          break;
        }
        case 'open': ui.openId === id ? closeDetails() : openDetails(id); break;
      }
    };
    $('taskList').addEventListener('click', onListClick);
    $('doneList').addEventListener('click', onListClick);
    const onListKey = e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('task-body')) {
        e.preventDefault(); openDetails(e.target.closest('.task').dataset.id);
      }
    };
    $('taskList').addEventListener('keydown', onListKey);
    $('doneList').addEventListener('keydown', onListKey);

    $('doneToggle').addEventListener('click', () => { settings.showDone = !settings.showDone; saveSettings(); renderLists(); });
    $('clearDoneBtn').addEventListener('click', () => {
      const { done } = viewTasks();
      if (!done.length) return;
      const ids = new Set(done.map(x => x.id));
      const before = snapshot();
      data.tasks = data.tasks.filter(x => !ids.has(x.id));
      if (ids.has(ui.openId)) closeDetails();
      commit();
      offerUndo(t('cleared')(ids.size), before);
    });

    // Details panel
    $('dClose').addEventListener('click', closeDetails);
    $('dCheck').addEventListener('click', () => ui.openId && toggleTask(ui.openId));
    $('dStar').addEventListener('click', () => withOpenTask(x => { x.starred = !x.starred; }));
    $('dTitle').addEventListener('input', e => {
      autosize(e.target);
      const v = e.target.value.replace(/\n/g, ' ');
      if (v.trim()) withOpenTask(x => { x.text = v.slice(0, 200); }, { debounced: true, skipDetails: true });
    });
    $('dTitle').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } });
    $('dTitle').addEventListener('blur', renderDetails);
    $('dNotes').addEventListener('input', e => withOpenTask(x => { x.notes = e.target.value; }, { debounced: true, skipDetails: true }));
    $('dDue').addEventListener('change', e => withOpenTask(x => {
      x.due = e.target.value || null;
      if (!x.due) x.time = null;
      x.snoozeUntil = null;
    }));
    $('dTime').addEventListener('change', e => withOpenTask(x => { x.time = x.due && isTime(e.target.value) ? e.target.value : null; x.snoozeUntil = null; }));
    $('dRemind').addEventListener('change', e => withOpenTask(x => { x.remind = e.target.value in REMINDERS ? e.target.value : 'at'; x.snoozeUntil = null; }));
    $('dNotifyHint').addEventListener('click', () => {
      const task = ui.openId && findTask(ui.openId);
      if (task && !task.due) $('dDue').focus();
      else if (!settings.notify) enableNotifications();
    });
    $('bellBtn').addEventListener('click', () => { if (settings.notify) openSettings('notifySection'); else enableNotifications(); });
    $('dList').addEventListener('change', e => withOpenTask(x => { x.listId = e.target.value; }));
    $('dPriority').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      withOpenTask(x => { x.priority = b.dataset.p; });
    });
    $('dDelete').addEventListener('click', () => ui.openId && deleteTask(ui.openId));
    $('dSubForm').addEventListener('submit', e => {
      e.preventDefault();
      const input = $('dSubInput');
      const text = input.value.trim(); if (!text) return;
      withOpenTask(x => { x.subtasks.push({ id: uid(), text: text.slice(0, 150), done: false }); });
      input.value = '';
      input.focus();
    });
    $('dSubtasks').addEventListener('click', e => {
      const el = e.target.closest('[data-sub]'); if (!el) return;
      const sid = el.closest('.sub').dataset.sid;
      if (el.dataset.sub === 'toggle') withOpenTask(x => { const s = x.subtasks.find(s => s.id === sid); if (s) s.done = !s.done; });
      if (el.dataset.sub === 'delete') withOpenTask(x => { x.subtasks = x.subtasks.filter(s => s.id !== sid); });
    });
    $('dSubtasks').addEventListener('change', e => {
      if (e.target.dataset.sub !== 'text') return;
      const sid = e.target.closest('.sub').dataset.sid;
      const v = e.target.value.trim();
      withOpenTask(x => {
        if (v) { const s = x.subtasks.find(s => s.id === sid); if (s) s.text = v; }
        else x.subtasks = x.subtasks.filter(s => s.id !== sid);
      });
    });
    $('dSubtasks').addEventListener('keydown', e => {
      if (e.target.dataset.sub === 'text' && e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
    });

    // New list dialog
    let pickedColor = LIST_COLORS[0];
    const renderColors = () => $('listColors').replaceChildren(...LIST_COLORS.map(c => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'swatch' + (c === pickedColor ? ' active' : '');
      b.style.background = c; b.dataset.color = c; b.setAttribute('aria-label', c);
      b.setAttribute('aria-pressed', String(c === pickedColor));
      return b;
    }));
    $('addListBtn').addEventListener('click', () => {
      pickedColor = LIST_COLORS[data.lists.length % LIST_COLORS.length];
      $('listName').value = ''; $('listEmoji').value = '📁';
      renderColors();
      $('listDialog').showModal();
      $('listName').focus();
    });
    $('listColors').addEventListener('click', e => {
      const b = e.target.closest('.swatch'); if (!b) return;
      pickedColor = b.dataset.color; renderColors();
    });
    $('listCancel').addEventListener('click', () => $('listDialog').close());
    $('listForm').addEventListener('submit', e => {
      const name = $('listName').value.trim();
      if (!name) { e.preventDefault(); return; }
      const list = { id: uid(), key: '', name: name.slice(0, 30), emoji: [...$('listEmoji').value.trim()][0] || '📁', color: pickedColor };
      data.lists.push(list);
      saveData();
      setView('list:' + list.id);
    });

    // Settings dialog
    $('settingsBtn').addEventListener('click', () => openSettings());
    $('notifyToggle').addEventListener('change', async e => {
      if (e.target.checked) await enableNotifications();
      else { settings.notify = false; saveSettings(); scheduleSync(true); renderAll(); renderDetails(); }
      renderNotifySettings();
    });
    $('allDayTime').addEventListener('change', e => {
      if (!isTime(e.target.value)) return;
      settings.allDayTime = e.target.value; saveSettings(); scheduleSync(true); renderAll();
    });
    $('dailyTime').addEventListener('change', e => {
      if (!isTime(e.target.value)) return;
      settings.dailyTime = e.target.value; saveSettings(); scheduleSync(true);
    });
    $('dailyToggle').addEventListener('change', e => { settings.daily = e.target.checked; saveSettings(); scheduleSync(true); });
    $('testNotifyBtn').addEventListener('click', async () => {
      if (!settings.notify && !(await enableNotifications())) return;
      try { await Notifier.test(); } catch (err) { showToast(t('notifyDenied')); }
    });
    $('settingsClose').addEventListener('click', () => $('settingsDialog').close());
    $('langSeg').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      settings.lang = b.dataset.v; saveSettings(); applyLanguage(); renderSettings(); renderAll(); renderDetails();
      if (Native) initNativeText();
      scheduleSync(true);
    });
    $('themeSeg').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      settings.theme = b.dataset.v; saveSettings(); applyAppearance(); renderSettings();
    });
    $('accentSwatches').addEventListener('click', e => {
      const b = e.target.closest('.swatch'); if (!b) return;
      settings.accent = b.dataset.accent; saveSettings(); applyAppearance(); renderSettings();
    });
    $('confettiToggle').addEventListener('change', e => { settings.confetti = e.target.checked; saveSettings(); });
    $('exportBtn').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify({ app: 'todo', version: 4, exportedAt: new Date().toISOString(), ...data }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `tasks-${todayKey()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    $('importInput').addEventListener('change', async e => {
      const file = e.target.files[0];
      e.target.value = '';
      if (!file) return;
      try {
        const raw = JSON.parse(await file.text());
        const parsed = normalizeData(Array.isArray(raw) ? { tasks: raw } : raw);
        if (!confirm(t('confirmImport'))) return;
        const before = snapshot();
        data = parsed;
        if (!isValidView(settings.view)) settings.view = 'all';
        closeDetails();
        commit();
        $('settingsDialog').close();
        offerUndo(t('imported'), before);
      } catch { showToast(t('importFailed')); }
    });
    $('resetBtn').addEventListener('click', () => {
      if (!confirm(t('confirmReset'))) return;
      const before = snapshot();
      data = normalizeData({});
      settings.view = 'today'; saveSettings();
      closeDetails();
      commit();
      $('settingsDialog').close();
      offerUndo(t('resetDone'), before);
    });

    // Close dialogs by clicking the backdrop
    document.querySelectorAll('dialog.modal').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));

    $('toastBtn').addEventListener('click', () => { const fn = ui.undo; hideToast(); if (fn) fn(); });

    systemDark.addEventListener('change', () => { if (settings.theme === 'system') applyAppearance(); });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const el = document.activeElement;
      const typing = el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);
      if (document.querySelector('dialog[open]')) return;
      if (e.key === 'Escape') {
        if (el === $('searchInput') && ui.query) { el.value = ''; ui.query = ''; renderHeader(); renderLists(); return; }
        if (typing) { el.blur(); return; }
        if (document.body.classList.contains('sidebar-open')) { closeSidebar(); return; }
        closeDetails();
        return;
      }
      if (typing) return;
      if (e.key === '/') { e.preventDefault(); $('searchInput').focus(); }
      else if (e.key === 'n' || e.key === 'N' || e.key === 'ى') { e.preventDefault(); $('taskInput').focus(); }
      else if (/^[1-5]$/.test(e.key)) setView(SMART_VIEWS[Number(e.key) - 1]);
    });

    // Sync across tabs
    window.addEventListener('storage', e => {
      if (e.key === DATA_KEY) { data = normalizeData(storage.get(DATA_KEY)); if (!isValidView(settings.view)) settings.view = 'all'; renderAll(); renderDetails(); }
    });

    // Refresh date-dependent labels after midnight or when returning to the tab
    let lastDay = todayKey();
    const refreshDay = () => { if (todayKey() !== lastDay) { lastDay = todayKey(); renderAll(); } };
    setInterval(refreshDay, 60000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { refreshDay(); scheduleSync(true); } });
    setInterval(() => scheduleSync(true), 60 * 60 * 1000);
  }

  // =====================================================================
  //  Boot
  // =====================================================================
  // Launch links from notifications: ?action=done|snooze|tap&task=<id>&view=<view>
  function handleLaunchParams() {
    const params = new URLSearchParams(location.search);
    if (!params.has('action') && !params.has('task') && !params.has('view')) return;
    handleNotificationAction(params.get('action') || 'tap', { taskId: params.get('task') || '', view: params.get('view') || '' });
    history.replaceState(null, '', location.pathname);
  }

  load();
  applyAppearance();
  applyLanguage();
  bindEvents();
  initDrag();
  renderAll();
  $('sideApkLink').hidden = Boolean(Native);

  (async () => {
    await initNative();
    // Permission can be revoked from system settings while the app is closed.
    if (settings.notify && (await Notifier.permission()) !== 'granted') {
      settings.notify = false; saveSettings(); renderAll();
    }
    handleLaunchParams();
    scheduleSync(true);
  })();

  if (!Native && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
    navigator.serviceWorker.addEventListener('message', e => {
      if (e.data && e.data.type === 'notification-action') handleNotificationAction(e.data.action, e.data);
    });
  }
})();
