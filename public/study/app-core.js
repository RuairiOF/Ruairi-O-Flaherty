const DATA = window.STUDY_DATA;
const META = DATA.meta;
const TOPICS = DATA.topics;
const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
const FLASHCARDS = DATA.flashcards;
const FLASHCARD_BY_ID = Object.fromEntries(FLASHCARDS.map((c) => [c.id, c]));
const MCQS = DATA.mcqs;
const MCQ_BY_ID = Object.fromEntries(MCQS.map((q) => [q.id, q]));
const SHORTS = DATA.shorts;
const SHORT_BY_ID = Object.fromEntries(SHORTS.map((q) => [q.id, q]));
const MOCKS = DATA.mocks;
const MOCK_BY_ID = Object.fromEntries(MOCKS.map((m) => [m.id, m]));
const FORMULAS = DATA.formulas;
const FORMULA_BY_ID = Object.fromEntries(FORMULAS.map((f) => [f.id, f]));
const LESSONS = TOPICS.flatMap((t) => t.lessons.map((l) => ({ ...l, topic: t.id, topicName: t.name, accent: t.accent, soft: t.soft })));
const LESSON_BY_ID = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

const STORAGE_KEY = "meen41330-study-v1";
const SYNC_HOSTS = new Set(["100.96.24.13", "ruairis-mac-mini-3", "ruairis-mac-mini-3.tailc4b3ed.ts.net", "localhost"]);
const SYNC_ENABLED = SYNC_HOSTS.has(location.hostname);
const TEST_DATE = new Date(META.testDate);
const DAY_MS = 86400000;
const MINUTE_MS = 60000;

let flashSession = null;
let flashFilter = "all";
let quizSession = null;
let quizFilter = "all";
let quizLength = 10;
let mockSession = null;
let mockTimer = null;
let formulaDrill = null;
let revealedFormulas = new Set();
let openLessonId = null;
let modalCallback = null;
let toastTimer = null;
let confettiParticles = [];
let confettiFrame = null;
let draftSaveTimer = null;
let lastHash = null;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultState() {
  return {
    cardStates: {},
    learned: {},
    mcqStats: {},
    quizHistory: [],
    mockHistory: [],
    mockDraft: null,
    streak: { lastDay: null, count: 0 },
    daily: { day: todayKey(), reviews: 0, quizzes: 0, lessons: 0, mocks: 0 },
    settings: { dailyGoal: 20, blurFormulas: true },
    createdAt: Date.now(),
    updatedAt: 0
  };
}

function mergeState(saved) {
  const base = defaultState();
  const data = saved && typeof saved === "object" ? saved : {};
  return {
    ...base,
    ...data,
    cardStates: { ...base.cardStates, ...(data.cardStates || {}) },
    learned: { ...base.learned, ...(data.learned || {}) },
    mcqStats: { ...base.mcqStats, ...(data.mcqStats || {}) },
    quizHistory: Array.isArray(data.quizHistory) ? data.quizHistory : [],
    mockHistory: Array.isArray(data.mockHistory) ? data.mockHistory : [],
    mockDraft: data.mockDraft || null,
    streak: { ...base.streak, ...(data.streak || {}) },
    daily: { ...base.daily, ...(data.daily || {}) },
    settings: { ...base.settings, ...(data.settings || {}) }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return mergeState(JSON.parse(raw));
  } catch (error) {
    return defaultState();
  }
}

let state = loadState();

let serverSaveTimer = null;

function saveLocal() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    showToast("Could not save progress in this browser.", "bad");
  }
}

function scheduleServerSave() {
  if (!SYNC_ENABLED) return;
  clearTimeout(serverSaveTimer);
  serverSaveTimer = setTimeout(postState, 500);
}

async function postState() {
  if (!SYNC_ENABLED) return;
  try {
    await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    });
  } catch (error) {
    // The local copy remains the source of truth when the server is unavailable.
  }
}

async function syncFromServer() {
  if (!SYNC_ENABLED || !location.protocol.startsWith("http")) return;
  try {
    const response = await fetch("/api/state", { cache: "no-store" });
    if (!response.ok) return;
    const text = await response.text();
    if (!text || text.trim() === "{}") {
      postState();
      return;
    }
    const remote = JSON.parse(text);
    if (!remote || !remote.updatedAt) {
      postState();
      return;
    }
    const remoteTime = Number(remote.updatedAt) || 0;
    const localTime = Number(state.updatedAt) || 0;
    if (remoteTime > localTime + 1000) {
      state = mergeState(remote);
      saveLocal();
      renderPage();
      showToast("Progress synced from another device.", "good");
    } else if (!remoteTime || localTime > remoteTime + 1000) {
      postState();
    }
  } catch (error) {
    // Offline or server restarting. Local storage keeps working.
  }
}

function save() {
  state.updatedAt = Date.now();
  saveLocal();
  scheduleServerSave();
}

function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayKey(d);
}

function ensureDaily() {
  if (state.daily.day !== todayKey()) {
    state.daily = { day: todayKey(), reviews: 0, quizzes: 0, lessons: 0, mocks: 0 };
  }
}

function touchStreak() {
  const today = todayKey();
  if (state.streak.lastDay === today) return;
  if (state.streak.lastDay === yesterdayKey()) state.streak.count += 1;
  else state.streak.count = 1;
  state.streak.lastDay = today;
}

function recordStudy(kind, amount = 1) {
  ensureDaily();
  state.daily[kind] = (state.daily[kind] || 0) + amount;
  touchStreak();
}

function isLessonLearned(id) {
  return Boolean(state.learned[id]);
}

function markLessonLearned(id) {
  if (!state.learned[id]) {
    state.learned[id] = Date.now();
    recordStudy("lessons", 1);
    save();
  }
}

function getCardState(id) {
  return state.cardStates[id] || { interval: 0, ease: 2.5, due: 0, reps: 0, lapses: 0, last: null };
}

function dueCards(topicId = null, includeNew = true) {
  const now = Date.now();
  const filter = topicId && topicId !== "all" ? topicId : null;
  return FLASHCARDS.filter((card) => {
    if (filter && card.topic !== filter) return false;
    const s = getCardState(card.id);
    const isDue = s.due <= now;
    return includeNew ? isDue : isDue && s.reps > 0;
  });
}

function newCards(topicId = null) {
  const filter = topicId && topicId !== "all" ? topicId : null;
  return FLASHCARDS.filter((card) => (!filter || card.topic === filter) && getCardState(card.id).reps === 0);
}

function cardStats(topicId = null) {
  const filter = topicId && topicId !== "all" ? topicId : null;
  const cards = FLASHCARDS.filter((card) => !filter || card.topic === filter);
  let due = 0;
  let fresh = 0;
  let learning = 0;
  let mature = 0;
  cards.forEach((card) => {
    const s = getCardState(card.id);
    if (s.reps === 0) fresh += 1;
    if (s.due <= Date.now()) due += 1;
    if (s.reps > 0 && s.interval < 2) learning += 1;
    if (s.reps > 0 && s.interval >= 2) mature += 1;
  });
  return { total: cards.length, due, new: fresh, learning, mature };
}

function topicMastery(topicId) {
  const topic = TOPIC_BY_ID[topicId];
  if (!topic) return 0;
  const learned = topic.lessons.filter((l) => isLessonLearned(l.id)).length;
  const lessonPct = (learned / topic.lessons.length) * 100;
  const cards = FLASHCARDS.filter((c) => c.topic === topicId);
  const seenCards = cards.filter((c) => getCardState(c.id).reps > 0).length;
  const cardPct = cards.length ? (seenCards / cards.length) * 100 : 0;
  let seenQ = 0;
  let correctQ = 0;
  MCQS.filter((q) => q.topic === topicId).forEach((q) => {
    const s = state.mcqStats[q.id];
    if (s) {
      seenQ += s.seen;
      correctQ += s.correct;
    }
  });
  const quizPct = seenQ ? (correctQ / seenQ) * 100 : 0;
  if (!seenQ) return Math.round(lessonPct * 0.6 + cardPct * 0.4);
  return Math.round(lessonPct * 0.35 + cardPct * 0.3 + quizPct * 0.35);
}

function overallReadiness() {
  const topicAverage = TOPICS.reduce((sum, t) => sum + topicMastery(t.id), 0) / TOPICS.length;
  if (!state.mockHistory.length) return Math.round(topicAverage * 0.9);
  const completeMocks = state.mockHistory.filter((m) => m.shortGraded === undefined || m.shortGraded >= 5);
  if (!completeMocks.length) return Math.round(topicAverage * 0.9);
  const bestMock = Math.max(...completeMocks.map((m) => Math.min(100, (m.total / 20) * 100)));
  return Math.round(topicAverage * 0.68 + bestMock * 0.32);
}

function quizAccuracy() {
  let seen = 0;
  let correct = 0;
  Object.values(state.mcqStats).forEach((s) => {
    seen += s.seen || 0;
    correct += s.correct || 0;
  });
  return seen ? Math.round((correct / seen) * 100) : 0;
}

function weakMcqIds() {
  return MCQS.filter((q) => (state.mcqStats[q.id]?.wrong || 0) > 0)
    .sort((a, b) => (state.mcqStats[b.id].wrong || 0) - (state.mcqStats[a.id].wrong || 0))
    .map((q) => q.id);
}

function bestMockScore() {
  const complete = state.mockHistory.filter((m) => m.shortGraded === undefined || m.shortGraded >= 5);
  if (!complete.length) return null;
  return Math.max(...complete.map((m) => m.total || 0));
}

function streakText() {
  const count = state.streak.count || 0;
  return `${count} day${count === 1 ? "" : "s"} streak`;
}

function timeToTest() {
  const diff = TEST_DATE.getTime() - Date.now();
  const total = Math.max(0, diff);
  const days = Math.floor(total / DAY_MS);
  const hours = Math.floor((total % DAY_MS) / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  return { total, days, hours, minutes, seconds };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function clockString(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
}

function formatDuration(seconds) {
  if (!seconds) return "0 min";
  const m = Math.round(seconds / 60);
  return `${m} min`;
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "short" });
  } catch (error) {
    return "";
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function paragraphs(text) {
  return text
    .split(/\n\n+/)
    .map((p) => `<p>${escapeHtml(p).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function icon(name, cls = "") {
  return `<svg class="icon ${cls}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function ring(percent, size = 74, stroke = 7, color = "var(--violet)", label = null, sub = "") {
  const value = clamp(Number(percent) || 0, 0, 100);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  return `<div class="ring-wrap" style="width:${size}px;height:${size}px">
    <svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle class="ring-track" cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke-width="${stroke}"></circle>
      <circle class="ring-fill" cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke-width="${stroke}" stroke="${color}" stroke-dasharray="${circumference.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"></circle>
    </svg>
    <div class="ring-label"><strong>${label ?? `${Math.round(value)}%`}</strong>${sub ? `<span>${escapeHtml(sub)}</span>` : ""}</div>
  </div>`;
}

function progressBar(percent, accent = "var(--violet)") {
  return `<div class="bar" style="--accent:${accent}"><div class="bar-fill" style="width:${clamp(Number(percent) || 0, 0, 100)}%"></div></div>`;
}

function topicPill(topicId) {
  const topic = TOPIC_BY_ID[topicId];
  if (!topic) return "";
  return `<span class="pill pill-accent" style="--accent:${topic.accent};--soft:${topic.soft}">${escapeHtml(topic.short)}</span>`;
}

function difficultyLabel(difficulty) {
  if (difficulty >= 3) return "Stretch";
  if (difficulty === 2) return "Core";
  return "Foundation";
}

function pageHead(eyebrow, title, subtitle, actions = "") {
  return `<div class="page-head">
    <div>
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h1 class="page-title">${escapeHtml(title)}</h1>
      ${subtitle ? `<p class="page-sub">${escapeHtml(subtitle)}</p>` : ""}
    </div>
    ${actions ? `<div class="page-actions">${actions}</div>` : ""}
  </div>`;
}

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, "");
  const parts = raw.split("/").filter(Boolean);
  return { page: parts[0] || "dashboard", param: parts[1] || null };
}

const PAGE_META = {
  dashboard: ["Study desk", "Dashboard"],
  learn: ["Curriculum", "Learn"],
  flashcards: ["Memory lab", "Flashcards"],
  quiz: ["Practice", "Quiz"],
  mock: ["Exam simulation", "Mock exam"],
  formulas: ["Formula lab", "Formulas"],
  progress: ["Your progress", "Progress"]
};

function renderPage() {
  const route = parseRoute();
  const page = PAGE_META[route.page] ? route.page : "dashboard";
  if (page !== "flashcards") flashSession = null;
  if (page !== "quiz") quizSession = null;
  if (page !== "mock") stopMockTimer();

  const view = document.getElementById("view");
  if (!view) return;

  if (page === "learn" && route.param) {
    view.innerHTML = renderTopic(route.param);
  } else if (page === "learn") {
    view.innerHTML = renderLearn();
  } else if (page === "flashcards") {
    view.innerHTML = renderFlashcards();
  } else if (page === "quiz") {
    view.innerHTML = renderQuiz();
  } else if (page === "mock") {
    view.innerHTML = renderMock();
  } else if (page === "formulas") {
    view.innerHTML = renderFormulas();
  } else if (page === "progress") {
    view.innerHTML = renderProgress();
  } else {
    view.innerHTML = renderDashboard();
  }

  const meta = PAGE_META[page] || PAGE_META.dashboard;
  document.getElementById("pageEyebrow").textContent = meta[0];
  document.getElementById("pageTitle").textContent = page === "learn" && route.param ? TOPIC_BY_ID[route.param]?.name || "Learn" : meta[1];
  const titleName = page === "learn" && route.param ? (TOPIC_BY_ID[route.param]?.name || "Learn") : meta[1];
  document.title = `${titleName} · Data Analytics`;

  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === page);
  });

  updateStreakPill();
  updateCountdowns();

  if (page === "mock" && mockSession && !mockSession.submitted) startMockTimer();

  const shouldScrollTop = lastHash !== location.hash
    || page === "mock"
    || page === "quiz"
    || page === "flashcards"
    || (page === "formulas" && formulaDrill);
  if (shouldScrollTop) {
    window.scrollTo(0, 0);
    lastHash = location.hash;
  }
}

function updateStreakPill() {
  const el = document.getElementById("streakText");
  if (el) el.textContent = streakText();
}

function updateCountdowns() {
  const time = timeToTest();
  const mini = document.getElementById("miniCountdown");
  if (mini) {
    if (time.total <= 0) {
      mini.innerHTML = `<strong>Now</strong><span>go get it</span>`;
    } else if (time.days >= 1) {
      mini.innerHTML = `<strong>${time.days}</strong><span>day${time.days === 1 ? "" : "s"}</span>`;
    } else {
      mini.innerHTML = `<strong>${time.hours}</strong><span>hour${time.hours === 1 ? "" : "s"}</span>`;
    }
  }
  const days = document.getElementById("countdownDays");
  const hours = document.getElementById("countdownHours");
  const minutes = document.getElementById("countdownMinutes");
  if (days) days.textContent = String(time.days);
  if (hours) hours.textContent = String(time.hours);
  if (minutes) minutes.textContent = String(time.minutes);
}

function showToast(message, type = "") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `toast show ${type}`.trim();
  toastTimer = setTimeout(() => {
    toast.className = "toast";
  }, 2400);
}

function showModal({ title, body, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false, onConfirm = null }) {
  const root = document.getElementById("modalRoot");
  if (!root) return;
  modalCallback = onConfirm;
  root.innerHTML = `<div class="modal-backdrop" data-action="modal-close">
    <div class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
      <h2>${escapeHtml(title)}</h2>
      <div class="modal-body">${body}</div>
      <div class="modal-actions">
        <button class="btn btn-ghost" type="button" data-action="modal-close">${escapeHtml(cancelLabel)}</button>
        ${onConfirm ? `<button class="btn ${danger ? "btn-danger" : "btn-primary"}" type="button" data-action="modal-confirm">${escapeHtml(confirmLabel)}</button>` : ""}
      </div>
    </div>
  </div>`;
}

function closeModal() {
  const root = document.getElementById("modalRoot");
  if (root) root.innerHTML = "";
  modalCallback = null;
}

function showShortcuts() {
  const rows = [
    ["Space", "Flip the current flashcard"],
    ["1 to 4", "Rate a flashcard after flipping"],
    ["1 to 4", "Answer a quiz question"],
    ["Enter", "Next question"],
    ["?", "Open this shortcut sheet"],
    ["Esc", "Close a dialog or menu"]
  ];
  showModal({
    title: "Keyboard shortcuts",
    body: `<div class="shortcut-list">${rows.map(([key, text]) => `<div class="shortcut-row"><span>${escapeHtml(text)}</span><span class="kbd">${escapeHtml(key)}</span></div>`).join("")}</div>`,
    confirmLabel: "Close",
    cancelLabel: "Close",
    onConfirm: null
  });
}

function openSheet() {
  const sheet = document.getElementById("sheet");
  if (sheet) sheet.hidden = false;
}

function closeSheet() {
  const sheet = document.getElementById("sheet");
  if (sheet) sheet.hidden = true;
}

function stopMockTimer() {
  if (mockTimer) {
    clearInterval(mockTimer);
    mockTimer = null;
  }
}

function init() {
  ensureDaily();
  saveLocal();
  window.addEventListener("hashchange", renderPage);
  window.addEventListener("resize", resizeConfetti);
  document.addEventListener("keydown", handleGlobalKeydown);
  renderPage();
  setInterval(updateCountdowns, 30000);
  setInterval(() => {
    ensureDaily();
    updateStreakPill();
  }, 60000);
  maybeRestoreDraft();
  syncFromServer();
}
