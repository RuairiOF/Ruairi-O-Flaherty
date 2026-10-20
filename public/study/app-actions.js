const FLASH_SESSION_LIMIT = 20;

function scheduleCard(id, rating) {
  const now = Date.now();
  const s = { ...getCardState(id) };
  s.ease = s.ease || 2.5;
  s.interval = s.interval || 0;

  if (rating === 0) {
    s.interval = 0;
    s.due = now + MINUTE_MS;
    s.ease = Math.max(1.3, s.ease - 0.2);
    s.lapses = (s.lapses || 0) + 1;
  } else if (rating === 1) {
    s.interval = Math.max(0.007, s.interval * 1.2);
    s.due = now + s.interval * DAY_MS;
    s.ease = Math.max(1.3, s.ease - 0.15);
  } else if (rating === 2) {
    s.interval = Math.max(0.25, s.interval * s.ease);
    s.due = now + s.interval * DAY_MS;
  } else {
    s.interval = Math.max(0.5, s.interval * s.ease * 1.3);
    s.due = now + s.interval * DAY_MS;
    s.ease = Math.min(3.2, s.ease + 0.15);
  }

  s.reps = (s.reps || 0) + 1;
  s.last = rating;
  s.lastSeen = now;
  state.cardStates[id] = s;
  save();
}

function startFlashSession(mode, topic = flashFilter) {
  flashFilter = topic || "all";
  let ids = [];
  if (mode === "due") {
    ids = dueCards(flashFilter).map((c) => c.id);
  } else {
    ids = FLASHCARDS.filter((c) => flashFilter === "all" || c.topic === flashFilter).map((c) => c.id);
    ids = shuffle(ids);
  }

  if (!ids.length) {
    showToast(mode === "due" ? "Nothing is due right now. Use Study all." : "No cards in this deck.", "bad");
    return;
  }

  flashSession = {
    ids: ids.slice(0, FLASH_SESSION_LIMIT),
    index: 0,
    flipped: false,
    results: { again: 0, hard: 0, good: 0, easy: 0 },
    finished: false
  };

  if (location.hash !== "#/flashcards") location.hash = "#/flashcards";
  else renderPage();
}

function flipFlashcard() {
  if (!flashSession || flashSession.finished) return;
  flashSession.flipped = !flashSession.flipped;
  renderPage();
}

function rateFlashcard(rating) {
  if (!flashSession || flashSession.finished || !flashSession.flipped) return;
  const card = FLASHCARD_BY_ID[flashSession.ids[flashSession.index]];
  if (!card) return;
  scheduleCard(card.id, rating);
  const key = ["again", "hard", "good", "easy"][rating];
  flashSession.results[key] += 1;
  recordStudy("reviews", 1);
  save();
  flashSession.index += 1;
  flashSession.flipped = false;
  if (flashSession.index >= flashSession.ids.length) flashSession.finished = true;
  renderPage();
}

function endFlashSession() {
  flashSession = null;
  renderPage();
}

function startQuiz(options = {}) {
  const topic = options.topic || quizFilter || "all";
  const weak = Boolean(options.weak);
  let pool = options.ids ? options.ids.map((id) => MCQ_BY_ID[id]).filter(Boolean) : MCQS.slice();
  if (topic !== "all") pool = pool.filter((q) => q.topic === topic);
  if (weak) pool = pool.filter((q) => (state.mcqStats[q.id]?.wrong || 0) > 0);
  pool = shuffle(pool);

  if (!pool.length) {
    showToast("No questions match that choice. Try a different topic.", "bad");
    return;
  }

  const count = options.count || quizLength;
  quizFilter = topic;
  quizSession = {
    ids: pool.slice(0, Math.min(count, pool.length)).map((q) => q.id),
    index: 0,
    answers: {},
    score: 0,
    mode: weak ? "weak" : "practice",
    topic,
    startedAt: Date.now(),
    finished: false
  };

  if (location.hash !== "#/quiz") location.hash = "#/quiz";
  else renderPage();
}

function answerQuiz(optionIndex) {
  if (!quizSession || quizSession.finished) return;
  const q = MCQ_BY_ID[quizSession.ids[quizSession.index]];
  if (!q || quizSession.answers[q.id] !== undefined) return;
  const correct = optionIndex === q.answer;
  quizSession.answers[q.id] = optionIndex;
  if (correct) quizSession.score += 1;

  const prev = state.mcqStats[q.id] || { seen: 0, correct: 0, wrong: 0 };
  state.mcqStats[q.id] = {
    seen: prev.seen + 1,
    correct: prev.correct + (correct ? 1 : 0),
    wrong: prev.wrong + (correct ? 0 : 1)
  };
  save();
  if (correct && navigator.vibrate) navigator.vibrate(12);
  renderPage();
}

function nextQuizQuestion() {
  if (!quizSession || quizSession.finished) return;
  const q = MCQ_BY_ID[quizSession.ids[quizSession.index]];
  if (quizSession.answers[q.id] === undefined) {
    showToast("Choose an answer first.", "bad");
    return;
  }
  quizSession.index += 1;
  if (quizSession.index >= quizSession.ids.length) {
    finishQuiz();
    return;
  }
  renderPage();
}

function finishQuiz() {
  quizSession.finished = true;
  const total = quizSession.ids.length;
  const correct = quizSession.score;
  state.quizHistory.push({
    date: new Date().toISOString(),
    topic: quizSession.topic,
    total,
    correct,
    ids: quizSession.ids.slice()
  });
  recordStudy("quizzes", 1);
  save();
  renderPage();
  if (total && correct / total >= 0.8) burstConfetti();
}

function retryWrong() {
  if (!quizSession) return;
  const wrong = quizSession.ids.filter((id) => quizSession.answers[id] !== MCQ_BY_ID[id].answer);
  if (!wrong.length) {
    showToast("No wrong answers to retry.", "good");
    return;
  }
  startQuiz({ ids: wrong, topic: quizSession.topic, count: wrong.length });
}

function beginMock(mockId) {
  const mock = MOCK_BY_ID[mockId];
  if (!mock) return;
  const now = Date.now();
  mockSession = {
    mockId,
    answers: {},
    shortAnswers: {},
    index: 0,
    startedAt: now,
    endsAt: now + 40 * MINUTE_MS,
    submitted: false,
    result: null
  };
  state.mockDraft = {
    mockId,
    answers: {},
    shortAnswers: {},
    index: 0,
    startedAt: now,
    endsAt: mockSession.endsAt
  };
  save();
  if (location.hash !== "#/mock") location.hash = "#/mock";
  else renderPage();
  startMockTimer();
}

function startMock(mockId) {
  if (state.mockDraft) {
    showModal({
      title: "Replace the saved draft?",
      body: "You already have a mock in progress. Starting a new paper will discard the saved answers.",
      confirmLabel: "Start new paper",
      danger: true,
      onConfirm: () => {
        state.mockDraft = null;
        save();
        beginMock(mockId);
      }
    });
    return;
  }
  beginMock(mockId);
}

function saveMockDraft() {
  if (!mockSession || mockSession.submitted) return;
  state.mockDraft = {
    mockId: mockSession.mockId,
    answers: { ...mockSession.answers },
    shortAnswers: { ...mockSession.shortAnswers },
    index: mockSession.index,
    startedAt: mockSession.startedAt,
    endsAt: mockSession.endsAt
  };
  save();
}

function resumeMock() {
  const draft = state.mockDraft;
  if (!draft || !MOCK_BY_ID[draft.mockId]) {
    showToast("That draft is no longer available.", "bad");
    return;
  }
  mockSession = {
    mockId: draft.mockId,
    answers: { ...(draft.answers || {}) },
    shortAnswers: { ...(draft.shortAnswers || {}) },
    index: draft.index || 0,
    startedAt: draft.startedAt || Date.now(),
    endsAt: draft.endsAt || Date.now() + 40 * MINUTE_MS,
    submitted: false,
    result: null
  };
  if (Date.now() >= mockSession.endsAt) {
    finishMock(true);
    return;
  }
  renderPage();
  startMockTimer();
}

function discardMockDraft() {
  showModal({
    title: "Discard this mock?",
    body: "This removes the saved answers. You can start a fresh paper afterwards.",
    confirmLabel: "Discard draft",
    danger: true,
    onConfirm: () => {
      state.mockDraft = null;
      mockSession = null;
      stopMockTimer();
      save();
      renderPage();
      showToast("Draft discarded.");
    }
  });
}

function startMockTimer() {
  stopMockTimer();
  if (!mockSession || mockSession.submitted) return;
  updateMockTimer();
  mockTimer = setInterval(updateMockTimer, 1000);
}

function updateMockTimer() {
  if (!mockSession || mockSession.submitted) {
    stopMockTimer();
    return;
  }
  const remaining = Math.max(0, mockSession.endsAt - Date.now());
  const el = document.getElementById("examTimer");
  if (el) {
    el.textContent = clockString(remaining);
    el.classList.toggle("warn", remaining <= 10 * MINUTE_MS && remaining > 5 * MINUTE_MS);
    el.classList.toggle("bad", remaining <= 5 * MINUTE_MS);
  }
  if (remaining <= 0) {
    stopMockTimer();
    finishMock(true);
  }
}

function finishMock(auto = false) {
  if (!mockSession || mockSession.submitted) return;
  stopMockTimer();
  const mock = MOCK_BY_ID[mockSession.mockId];
  const mcqs = mock.mcqIds.map((id) => MCQ_BY_ID[id]);
  const mcqCorrect = mcqs.reduce((sum, q) => sum + (mockSession.answers[q.id] === q.answer ? 1 : 0), 0);
  const result = {
    date: new Date().toISOString(),
    mockId: mock.id,
    mcqCorrect,
    mcqTotal: mcqs.length,
    grades: {},
    shortScore: 0,
    shortGraded: 0,
    total: mcqCorrect,
    duration: Math.round((Date.now() - mockSession.startedAt) / 1000)
  };
  mockSession.submitted = true;
  mockSession.result = result;
  state.mockDraft = null;
  state.mockHistory.push(result);
  recordStudy("mocks", 1);
  save();
  renderPage();
  if (auto) showToast("Time is up. Your paper has been submitted.", "bad");
  else burstConfetti();
}

function gradeShort(shortId, score) {
  if (!mockSession || !mockSession.submitted || !mockSession.result) return;
  mockSession.result.grades[shortId] = score;
  const values = Object.values(mockSession.result.grades);
  const shortScore = values.reduce((sum, value) => sum + value, 0);
  const total = mockSession.result.mcqCorrect + shortScore;
  mockSession.result.shortScore = shortScore;
  mockSession.result.shortGraded = values.length;
  mockSession.result.total = total;
  save();
  renderPage();
  const mock = MOCK_BY_ID[mockSession.mockId];
  if (mock && Object.keys(mockSession.result.grades).length === mock.shortIds.length) {
    if (total >= 16) burstConfetti();
  }
}

function mockNext() {
  if (!mockSession) return;
  const mock = MOCK_BY_ID[mockSession.mockId];
  const total = mock.mcqIds.length + mock.shortIds.length;
  if (mockSession.index < total - 1) {
    mockSession.index += 1;
    saveMockDraft();
    renderPage();
  }
}

function mockPrev() {
  if (!mockSession) return;
  if (mockSession.index > 0) {
    mockSession.index -= 1;
    saveMockDraft();
    renderPage();
  }
}

function mockPalette(index) {
  if (!mockSession) return;
  const mock = MOCK_BY_ID[mockSession.mockId];
  const total = mock.mcqIds.length + mock.shortIds.length;
  if (index >= 0 && index < total) {
    mockSession.index = index;
    saveMockDraft();
    renderPage();
  }
}

function mockOption(optionIndex) {
  if (!mockSession || mockSession.submitted) return;
  const mock = MOCK_BY_ID[mockSession.mockId];
  const mcqs = mock.mcqIds.map((id) => MCQ_BY_ID[id]);
  if (mockSession.index >= mcqs.length) return;
  const q = mcqs[mockSession.index];
  mockSession.answers[q.id] = optionIndex;
  saveMockDraft();
  document.querySelectorAll(".exam-main .option").forEach((button, index) => {
    button.classList.toggle("selected", index === optionIndex);
  });
  updateMockAnsweredUI();
}

function updateMockAnsweredUI() {
  if (!mockSession) return;
  const mock = MOCK_BY_ID[mockSession.mockId];
  const mcqs = mock.mcqIds.map((id) => MCQ_BY_ID[id]);
  const shorts = mock.shortIds.map((id) => SHORT_BY_ID[id]);
  const count = mcqs.filter((q) => mockSession.answers[q.id] !== undefined).length
    + shorts.filter((q) => (mockSession.shortAnswers[q.id] || "").trim()).length;
  const progress = document.querySelector(".exam-progress");
  if (progress) progress.textContent = `${count} / ${mcqs.length + shorts.length} answered`;
  const current = document.querySelector(`.palette-btn[data-index="${mockSession.index}"]`);
  if (current) {
    const isShort = mockSession.index >= mcqs.length;
    const q = isShort ? shorts[mockSession.index - mcqs.length] : mcqs[mockSession.index];
    const answered = isShort ? Boolean((mockSession.shortAnswers[q.id] || "").trim()) : mockSession.answers[q.id] !== undefined;
    current.classList.toggle("answered", answered);
  }
}

function submitMock() {
  if (!mockSession || mockSession.submitted) return;
  const mock = MOCK_BY_ID[mockSession.mockId];
  const mcqs = mock.mcqIds.map((id) => MCQ_BY_ID[id]);
  const shorts = mock.shortIds.map((id) => SHORT_BY_ID[id]);
  const unanswered = mcqs.filter((q) => mockSession.answers[q.id] === undefined).length
    + shorts.filter((q) => !(mockSession.shortAnswers[q.id] || "").trim()).length;
  showModal({
    title: unanswered ? `${unanswered} unanswered question${unanswered === 1 ? "" : "s"}` : "Submit the paper?",
    body: unanswered
      ? "You can still submit. Unanswered questions score zero. Are you sure?"
      : "You will see the model answers and grade the short questions yourself.",
    confirmLabel: "Submit paper",
    danger: false,
    onConfirm: () => finishMock(false)
  });
}

function exitMock() {
  if (!mockSession || mockSession.submitted) return;
  saveMockDraft();
  mockSession = null;
  stopMockTimer();
  renderPage();
  showToast("Mock saved. Resume it from the mock page.", "good");
}

function backToMocks() {
  mockSession = null;
  stopMockTimer();
  if (location.hash !== "#/mock") location.hash = "#/mock";
  else renderPage();
}

function toggleFormula(id) {
  const card = document.querySelector(`[data-formula="${id}"]`);
  if (revealedFormulas.has(id)) {
    revealedFormulas.delete(id);
    if (card) {
      card.classList.remove("revealed");
      const hint = card.querySelector(".formula-hint");
      if (hint) hint.textContent = "Tap to reveal";
    }
  } else {
    revealedFormulas.add(id);
    if (card) {
      card.classList.add("revealed");
      const hint = card.querySelector(".formula-hint");
      if (hint) hint.textContent = "Tap to hide";
    }
  }
}

function revealAllFormulas() {
  state.settings.blurFormulas = false;
  revealedFormulas = new Set(FORMULAS.map((f) => f.id));
  save();
  renderPage();
}

function blurAllFormulas() {
  state.settings.blurFormulas = true;
  revealedFormulas.clear();
  save();
  renderPage();
}

function startFormulaDrill() {
  formulaDrill = {
    ids: shuffle(FORMULAS.map((f) => f.id)),
    index: 0,
    revealed: false
  };
  renderPage();
}

function formulaDrillReveal() {
  if (!formulaDrill) return;
  formulaDrill.revealed = true;
  renderPage();
}

function formulaDrillNext() {
  if (!formulaDrill) return;
  formulaDrill.index += 1;
  formulaDrill.revealed = false;
  renderPage();
}

function exitFormulaDrill() {
  formulaDrill = null;
  renderPage();
}

function resetEverything() {
  showModal({
    title: "Reset all progress?",
    body: "This clears your flashcard schedule, quiz history, mock scores and lesson ticks from this browser. It cannot be undone.",
    confirmLabel: "Reset everything",
    danger: true,
    onConfirm: () => {
      localStorage.removeItem(STORAGE_KEY);
      state = defaultState();
      flashSession = null;
      quizSession = null;
      mockSession = null;
      formulaDrill = null;
      revealedFormulas.clear();
      stopMockTimer();
      save();
      renderPage();
      showToast("Progress reset.", "good");
    }
  });
}

function maybeRestoreDraft() {
  if (!state.mockDraft) return;
  if (!MOCK_BY_ID[state.mockDraft.mockId]) {
    state.mockDraft = null;
    save();
  }
}

function handleGlobalClick(event) {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const lessonSummary = target.closest("[data-lesson-summary]");
  if (lessonSummary) {
    openLessonId = lessonSummary.dataset.lessonSummary;
  }

  const el = target.closest("[data-action]");
  if (!el || !el.isConnected) return;
  const action = el.dataset.action;

  if (action === "modal-close") {
    if (el.classList.contains("modal-backdrop") && target !== el) return;
    closeModal();
    return;
  }

  if (action === "modal-confirm") {
    const callback = modalCallback;
    closeModal();
    if (callback) callback();
    return;
  }

  if (action === "open-sheet") {
    openSheet();
    return;
  }

  if (action === "close-sheet") {
    closeSheet();
    return;
  }

  if (action === "shortcuts") {
    closeSheet();
    showShortcuts();
    return;
  }

  if (action === "reset") {
    closeSheet();
    resetEverything();
    return;
  }

  if (action === "mark-learned") {
    const id = el.dataset.lesson;
    if (id) {
      markLessonLearned(id);
      openLessonId = id;
      showToast("Lesson marked learned.", "good");
      renderPage();
    }
    return;
  }

  if (action === "start-flash-due") {
    if (el.tagName === "A") event.preventDefault();
    if (el.dataset.topic) flashFilter = el.dataset.topic;
    startFlashSession("due", flashFilter);
    return;
  }

  if (action === "start-flash-all") {
    if (el.tagName === "A") event.preventDefault();
    startFlashSession("all", flashFilter);
    return;
  }

  if (action === "flash-topic") {
    if (el.tagName === "A") event.preventDefault();
    flashFilter = el.dataset.topic || "all";
    if (location.hash !== "#/flashcards") location.hash = "#/flashcards";
    else renderPage();
    return;
  }

  if (action === "flash-filter") {
    flashFilter = el.dataset.topic || "all";
    renderPage();
    return;
  }

  if (action === "flip-card") {
    event.preventDefault();
    flipFlashcard();
    return;
  }

  if (action === "rate-card") {
    event.preventDefault();
    const rating = Number(el.dataset.rating);
    rateFlashcard(rating);
    return;
  }

  if (action === "flash-exit") {
    endFlashSession();
    return;
  }

  if (action === "quiz-filter") {
    quizFilter = el.dataset.topic || "all";
    renderPage();
    return;
  }

  if (action === "quiz-length") {
    quizLength = Number(el.dataset.length) || 10;
    renderPage();
    return;
  }

  if (action === "start-quiz") {
    startQuiz();
    return;
  }

  if (action === "start-weak-quiz") {
    startQuiz({ weak: true, topic: "all", count: quizLength });
    return;
  }

  if (action === "start-topic-quiz") {
    quizFilter = el.dataset.topic || "all";
    quizLength = 10;
    startQuiz({ topic: quizFilter, count: 10 });
    return;
  }

  if (action === "quiz-option") {
    answerQuiz(Number(el.dataset.index));
    return;
  }

  if (action === "quiz-next") {
    nextQuizQuestion();
    return;
  }

  if (action === "retry-wrong") {
    retryWrong();
    return;
  }

  if (action === "quiz-new") {
    quizSession = null;
    renderPage();
    return;
  }

  if (action === "start-mock") {
    startMock(el.dataset.mock);
    return;
  }

  if (action === "resume-mock") {
    resumeMock();
    return;
  }

  if (action === "discard-mock") {
    discardMockDraft();
    return;
  }

  if (action === "mock-option") {
    mockOption(Number(el.dataset.index));
    return;
  }

  if (action === "mock-palette") {
    mockPalette(Number(el.dataset.index));
    return;
  }

  if (action === "mock-next") {
    mockNext();
    return;
  }

  if (action === "mock-prev") {
    mockPrev();
    return;
  }

  if (action === "mock-submit") {
    submitMock();
    return;
  }

  if (action === "mock-exit") {
    exitMock();
    return;
  }

  if (action === "mock-back") {
    if (el.tagName === "A") event.preventDefault();
    backToMocks();
    return;
  }

  if (action === "mock-retry") {
    beginMock(el.dataset.mock);
    return;
  }

  if (action === "grade-short") {
    gradeShort(el.dataset.short, Number(el.dataset.score));
    return;
  }

  if (action === "formula-toggle") {
    toggleFormula(el.dataset.formula);
    return;
  }

  if (action === "formula-reveal-all") {
    revealAllFormulas();
    return;
  }

  if (action === "formula-blur-all") {
    blurAllFormulas();
    return;
  }

  if (action === "formula-drill") {
    startFormulaDrill();
    return;
  }

  if (action === "formula-drill-reveal") {
    formulaDrillReveal();
    return;
  }

  if (action === "formula-drill-next") {
    formulaDrillNext();
    return;
  }

  if (action === "formula-drill-exit") {
    exitFormulaDrill();
    return;
  }
}

function handleShortInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.matches("[data-short-input]")) return;
  if (!mockSession || mockSession.submitted) return;
  const id = target.dataset.shortInput;
  mockSession.shortAnswers[id] = target.value;
  clearTimeout(draftSaveTimer);
  draftSaveTimer = setTimeout(saveMockDraft, 350);
  updateMockAnsweredUI();
}

function handleGlobalKeydown(event) {
  const target = event.target instanceof Element ? event.target : null;
  const typing = target && target.closest("input, textarea, select");

  if (event.key === "Escape") {
    closeModal();
    closeSheet();
    return;
  }

  if (typing) return;

  if (event.key === "?") {
    event.preventDefault();
    showShortcuts();
    return;
  }

  const onButton = target && target.closest("button, a");
  if (onButton && (event.key === " " || event.key === "Enter")) return;

  if (flashSession && !flashSession.finished) {
    if (event.key === " ") {
      event.preventDefault();
      flipFlashcard();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      flipFlashcard();
      return;
    }
    if (["1", "2", "3", "4"].includes(event.key) && flashSession.flipped) {
      event.preventDefault();
      rateFlashcard(Number(event.key) - 1);
      return;
    }
  }

  if (quizSession && !quizSession.finished) {
    if (["1", "2", "3", "4"].includes(event.key)) {
      event.preventDefault();
      answerQuiz(Number(event.key) - 1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      nextQuizQuestion();
      return;
    }
  }

  if (formulaDrill) {
    if (event.key === " " && !formulaDrill.revealed) {
      event.preventDefault();
      formulaDrillReveal();
      return;
    }
    if (event.key === "Enter" && formulaDrill.revealed) {
      event.preventDefault();
      formulaDrillNext();
      return;
    }
  }

  if (mockSession && !mockSession.submitted) {
    const mock = MOCK_BY_ID[mockSession.mockId];
    const isMcq = mockSession.index < mock.mcqIds.length;
    if (isMcq && ["1", "2", "3", "4"].includes(event.key)) {
      event.preventDefault();
      mockOption(Number(event.key) - 1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      mockNext();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      mockPrev();
      return;
    }
  }
}

function resizeConfetti() {
  const canvas = document.getElementById("confetti");
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
}

function burstConfetti() {
  const canvas = document.getElementById("confetti");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  resizeConfetti();
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const colors = ["#8b7cff", "#38d9c9", "#b6f09c", "#ffb86b", "#ff6b81", "#ffffff"];
  confettiParticles = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: -30 * dpr - Math.random() * canvas.height * 0.25,
    vx: (Math.random() - 0.5) * 6 * dpr,
    vy: (2 + Math.random() * 4) * dpr,
    size: (4 + Math.random() * 6) * dpr,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.2
  }));

  cancelAnimationFrame(confettiFrame);
  const start = performance.now();
  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08 * dpr;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - elapsed / 2800);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (elapsed < 2800) confettiFrame = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  confettiFrame = requestAnimationFrame(frame);
}

document.addEventListener("click", handleGlobalClick);
document.addEventListener("input", handleShortInput);
window.addEventListener("beforeunload", () => {
  saveMockDraft();
  if (SYNC_ENABLED) {
    try {
      navigator.sendBeacon("/api/state", new Blob([JSON.stringify(state)], { type: "application/json" }));
    } catch (error) {
      // Ignore. The next save will catch up.
    }
  }
});

init();
