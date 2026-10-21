function getNextAction() {
  ensureDaily();
  const due = dueCards().length;
  const unlearned = LESSONS.find((l) => !isLessonLearned(l.id));
  if (state.daily.lessons < 1 && unlearned) {
    return {
      label: "Learn: " + unlearned.title,
      hint: "One lesson from " + unlearned.topicName,
      href: "#/learn/" + unlearned.topic,
      action: null
    };
  }
  if (due > 0) {
    return {
      label: "Review " + due + " card" + (due === 1 ? "" : "s"),
      hint: "Spaced repetition queue",
      href: "#/flashcards",
      action: "start-flash-due"
    };
  }
  if (state.daily.quizzes < 1) {
    return {
      label: "Take a 10-question quiz",
      hint: "Mixed topics, instant feedback",
      href: "#/quiz",
      action: null
    };
  }
  return {
    label: "Sit a full mock paper",
    hint: "40 minutes, 10 MCQs and 5 short answers",
    href: "#/mock",
    action: null
  };
}

function renderDashboard() {
  ensureDaily();
  const labCount = typeof LAB_REGISTRY !== "undefined" ? Object.keys(LAB_REGISTRY).length : 9;
  const time = timeToTest();
  const readiness = overallReadiness();
  const due = dueCards().length;
  const learnedCount = Object.keys(state.learned).length;
  const accuracy = quizAccuracy();
  const planLearnDone = state.daily.lessons > 0;
  const planCardsDone = state.daily.reviews >= state.settings.dailyGoal || due === 0;
  const planQuizDone = state.daily.quizzes > 0;
  const planMockDone = state.daily.mocks > 0;
  const next = getNextAction();
  const mockBest = bestMockScore();

  const planItems = [
    {
      done: planLearnDone,
      title: "Learn one lesson",
      meta: planLearnDone ? "Done for today" : "Start with the topic you know least",
      action: planLearnDone ? "" : `<a class="btn btn-ghost btn-sm" href="#/learn">Open</a>`
    },
    {
      done: planCardsDone,
      title: `Review ${state.settings.dailyGoal} flashcards`,
      meta: `${state.daily.reviews} reviewed today · ${due} due now`,
      action: planCardsDone ? "" : `<button class="btn btn-ghost btn-sm" data-action="start-flash-due" data-topic="all">Review</button>`
    },
    {
      done: planQuizDone,
      title: "Finish a quiz",
      meta: planQuizDone ? "Done for today" : "10 questions with instant feedback",
      action: planQuizDone ? "" : `<a class="btn btn-ghost btn-sm" href="#/quiz">Start</a>`
    },
    {
      done: planMockDone,
      title: "Sit a timed mock",
      meta: planMockDone ? "Done for today" : "Optional if the first three are done",
      action: planMockDone ? "" : `<a class="btn btn-ghost btn-sm" href="#/mock">Open</a>`
    }
  ];

  const topicCards = TOPICS.map((topic) => {
    const pct = topicMastery(topic.id);
    const learned = topic.lessons.filter((l) => isLessonLearned(l.id)).length;
    const cards = FLASHCARDS.filter((c) => c.topic === topic.id);
    const seen = cards.filter((c) => getCardState(c.id).reps > 0).length;
    return `<a class="topic-card" href="#/learn/${topic.id}" style="--accent:${topic.accent};--soft:${topic.soft}">
      <div class="topic-head">
        <span class="topic-badge">${escapeHtml(topic.short)}</span>
        <span class="pill">${pct}%</span>
      </div>
      <h3 class="topic-name">${escapeHtml(topic.name)}</h3>
      <p class="topic-meta">${learned}/${topic.lessons.length} lessons · ${seen}/${cards.length} cards seen</p>
      <div class="topic-progress">${progressBar(pct, topic.accent)}</div>
      <div class="topic-foot"><span>Mastery</span><span>${pct}%</span></div>
    </a>`;
  }).join("");

  return `
    <section class="hero">
      <div class="hero-card">
        <div>
          <div class="hero-top">
            <span class="pill pill-accent">Test 1 · 20% of grade</span>
            <span class="pill">${time.total <= 0 ? "Test day" : `${time.days} day${time.days === 1 ? "" : "s"} to go`}</span>
          </div>
          <h1 class="hero-title">One paper. Make it stick.</h1>
          <p class="hero-sub">Your scope is EDA, regression, classification and statistical ML. No coding. No calculator. Theory, interpretation and clean hand calculations. This desk turns the slides into active recall.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="${next.href}" ${next.action ? `data-action="${next.action}"` : ""} ${next.action === "start-flash-due" ? 'data-topic="all"' : ""}>${icon("play")} ${escapeHtml(next.label)}</a>
            <a class="btn btn-ghost" href="#/mock">${icon("clock")} Sit a mock</a>
          </div>
        </div>
        <div class="hero-top">
          <span class="pill">${icon("target")} ${escapeHtml(next.hint)}</span>
          <span class="pill">${icon("layers")} ${due} cards due</span>
        </div>
      </div>

      <div class="hero-side">
        <div class="countdown-card">
          <div class="between">
            <div>
              <p class="eyebrow">Test 1 countdown</p>
              <h2 style="font-size:24px;margin-top:4px;">Thursday 22 October</h2>
            </div>
            ${icon("clock")}
          </div>
          <div class="countdown-grid">
            <div class="countdown-unit"><div class="countdown-value" id="countdownDays">${time.days}</div><div class="countdown-label">Days</div></div>
            <div class="countdown-unit"><div class="countdown-value" id="countdownHours">${time.hours}</div><div class="countdown-label">Hours</div></div>
            <div class="countdown-unit"><div class="countdown-value" id="countdownMinutes">${time.minutes}</div><div class="countdown-label">Minutes</div></div>
          </div>
          <p class="small muted" style="margin-top:14px;">14.00 to 14.50 · Room 234 · Engineering building</p>
        </div>
        <div class="readiness-card">
          ${ring(readiness, 70, 7, "var(--cyan)", `${readiness}%`, "ready")}
          <div>
            <strong>${readiness >= 80 ? "You are close." : readiness >= 55 ? "Good base. Keep going." : "Start with the foundations."}</strong>
            <p>Readiness combines lessons, cards, quiz accuracy and mock scores.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="stats-grid">
      <div class="stat-card" style="--accent:var(--violet)">
        <div class="stat-icon">${icon("layers")}</div>
        <div><div class="stat-value">${due}</div><div class="stat-label">Cards due</div></div>
      </div>
      <div class="stat-card" style="--accent:var(--cyan)">
        <div class="stat-icon">${icon("book")}</div>
        <div><div class="stat-value">${learnedCount}<span class="muted-2" style="font-size:14px;">/${LESSONS.length}</span></div><div class="stat-label">Lessons learned</div></div>
      </div>
      <div class="stat-card" style="--accent:var(--amber)">
        <div class="stat-icon">${icon("check")}</div>
        <div><div class="stat-value">${accuracy}%</div><div class="stat-label">Quiz accuracy</div></div>
      </div>
      <div class="stat-card" style="--accent:var(--lime)">
        <div class="stat-icon">${icon("flame")}</div>
        <div><div class="stat-value">${state.streak.count || 0}</div><div class="stat-label">Day streak</div></div>
      </div>
    </section>

    <div class="dash-grid">
      <div class="card card-pad">
        <div class="between">
          <div>
            <h2 class="section-title">Today's plan</h2>
            <p class="section-sub">A short, ordered session beats a long passive read.</p>
          </div>
          <span class="pill">${state.daily.reviews}/${state.settings.dailyGoal} reviews</span>
        </div>
        <div class="plan-list">
          ${planItems.map((item) => `<div class="plan-item ${item.done ? "done" : ""}">
            <span class="plan-check">${item.done ? icon("check") : ""}</span>
            <div style="min-width:0;">
              <div class="plan-title">${escapeHtml(item.title)}</div>
              <div class="plan-meta">${escapeHtml(item.meta)}</div>
            </div>
            ${item.action || ""}
          </div>`).join("")}
        </div>
      </div>

      <div class="card card-pad brief-card">
        <div>
          <h2 class="section-title">Test brief</h2>
          <p class="section-sub">The facts from your emails and Brightspace.</p>
        </div>
        <div class="brief-row"><span class="brief-label">When</span><span class="brief-value">Thu 22 Oct · 14.00</span></div>
        <div class="brief-row"><span class="brief-label">Where</span><span class="brief-value">Room 234 · Engineering building</span></div>
        <div class="brief-row"><span class="brief-label">Format</span><span class="brief-value">10 MCQs + 5 short answers</span></div>
        <div class="brief-row"><span class="brief-label">Time</span><span class="brief-value">40 minutes</span></div>
        <div class="brief-row"><span class="brief-label">Rules</span><span class="brief-value">No calculator · no notes · no coding</span></div>
        <div class="callout">
          ${icon("bulb")}
          <span>${escapeHtml(META.caveat)}</span>
        </div>
      </div>
    </div>

    <a class="card card-pad interactive" href="#/labs" style="--accent:var(--violet);margin-bottom:18px;">
      <div class="between wrap">
        <div>
          <span class="pill pill-accent">New · ${labCount} interactive labs</span>
          <h2 class="section-title" style="margin-top:10px;">Play with the concepts</h2>
          <p class="section-sub">Drag the outlier, move the classification threshold, change K and watch the decision boundary, Gini gain and the bias-variance curves respond live.</p>
        </div>
        <span class="btn btn-primary">${icon("lab")} Open visual labs ${icon("arrow")}</span>
      </div>
    </a>

    <div class="section-head">
      <div>
        <h2 class="section-title">Topic mastery</h2>
        <p class="section-sub">Four blocks. One paper. Click a topic to learn it from scratch.</p>
      </div>
      <a class="section-link" href="#/progress">See full progress ${icon("arrow")}</a>
    </div>
    <div class="topic-grid">${topicCards}</div>

    <div class="section-head">
      <div>
        <h2 class="section-title">Quick actions</h2>
        <p class="section-sub">When you have five minutes, use one of these.</p>
      </div>
    </div>
    <div class="grid grid-4">
      <a class="card card-pad interactive" href="#/flashcards" style="--accent:var(--violet)">
        <span class="pill pill-accent">${icon("layers")} Memory</span>
        <h3 style="margin-top:14px;font-size:20px;">Review due cards</h3>
        <p class="small muted" style="margin-top:6px;">${due} cards are waiting. Rating them schedules the next review.</p>
      </a>
      <a class="card card-pad interactive" href="#/quiz" style="--accent:var(--cyan)">
        <span class="pill pill-accent">${icon("check")} Practice</span>
        <h3 style="margin-top:14px;font-size:20px;">Take a quick quiz</h3>
        <p class="small muted" style="margin-top:6px;">Ten questions, instant explanations, weak spots saved.</p>
      </a>
      <a class="card card-pad interactive" href="#/labs" style="--accent:var(--lime)">
        <span class="pill pill-accent">${icon("lab")} Explore</span>
        <h3 style="margin-top:14px;font-size:20px;">Open a visual lab</h3>
        <p class="small muted" style="margin-top:6px;">Change one thing and watch the metric move.</p>
      </a>
      <a class="card card-pad interactive" href="#/formulas" style="--accent:var(--amber)">
        <span class="pill pill-accent">${icon("sigma")} Recall</span>
        <h3 style="margin-top:14px;font-size:20px;">Drill the formulas</h3>
        <p class="small muted" style="margin-top:6px;">Hide the formulas, say them out loud, then reveal.</p>
      </a>
    </div>
  `;
}

function renderLearn() {
  const cards = TOPICS.map((topic) => {
    const pct = topicMastery(topic.id);
    const learned = topic.lessons.filter((l) => isLessonLearned(l.id)).length;
    return `<a class="card learn-card interactive" href="#/learn/${topic.id}" style="--accent:${topic.accent};--soft:${topic.soft}">
      <div class="learn-card-top">
        <span class="topic-badge">${escapeHtml(topic.short)}</span>
        <span class="pill">${learned}/${topic.lessons.length} lessons</span>
      </div>
      <h2>${escapeHtml(topic.name)}</h2>
      <p>${escapeHtml(topic.blurb)}</p>
      <div class="learn-card-foot">
        ${progressBar(pct, topic.accent)}
        <span class="small muted nowrap">${pct}%</span>
      </div>
    </a>`;
  }).join("");

  return `
    ${pageHead("Curriculum", "Learn the whole paper", "Four blocks, twenty-five short lessons. Read one, close it, then explain it back to yourself before you mark it learned.", `<a class="btn btn-ghost" href="#/flashcards">${icon("layers")} Flashcards</a>`)}
    <div class="learn-grid">${cards}</div>
    <div class="card card-pad" style="margin-top:18px;">
      <div class="between">
        <div>
          <h2 class="section-title">How to use this section</h2>
          <p class="section-sub">Do not read the slides twice. Read once, then retrieve.</p>
        </div>
      </div>
      <div class="grid grid-3" style="margin-top:16px;">
        <div class="glass" style="padding:15px;"><strong class="small">1. Read a lesson</strong><p class="tiny muted" style="margin-top:5px;">Each card is the minimum you need for that idea.</p></div>
        <div class="glass" style="padding:15px;"><strong class="small">2. Close it and explain</strong><p class="tiny muted" style="margin-top:5px;">Say the definition, the formula and one example out loud.</p></div>
        <div class="glass" style="padding:15px;"><strong class="small">3. Mark it learned</strong><p class="tiny muted" style="margin-top:5px;">Then test it with the topic quiz and flashcards.</p></div>
      </div>
    </div>
  `;
}

function renderTopic(topicId) {
  const topic = TOPIC_BY_ID[topicId];
  if (!topic) {
    return `<div class="card card-pad"><h2 class="section-title">Topic not found</h2><p class="muted" style="margin-top:8px;">That topic does not exist.</p><a class="btn btn-primary" href="#/learn" style="margin-top:16px;">Back to Learn</a></div>`;
  }
  if (openLessonId && !topic.lessons.some((l) => l.id === openLessonId)) openLessonId = null;
  const pct = topicMastery(topic.id);
  const learned = topic.lessons.filter((l) => isLessonLearned(l.id)).length;
  const cards = FLASHCARDS.filter((c) => c.topic === topic.id);
  const seen = cards.filter((c) => getCardState(c.id).reps > 0).length;
  const unlearned = topic.lessons.find((l) => !isLessonLearned(l.id));
  const defaultOpen = openLessonId || (unlearned ? unlearned.id : topic.lessons[0].id);

  const lessonHtml = topic.lessons.map((lesson, index) => {
    const isLearned = isLessonLearned(lesson.id);
    return `<details class="lesson" data-lesson="${lesson.id}" ${lesson.id === defaultOpen ? "open" : ""}>
      <summary data-lesson-summary="${lesson.id}">
        <span class="lesson-number">${String(index + 1).padStart(2, "0")}</span>
        <span>
          <span class="lesson-title">${escapeHtml(lesson.title)}</span>
          <span class="lesson-meta">${lesson.minutes} min read · ${isLearned ? "learned" : "not learned"}</span>
        </span>
        ${icon("chevron", "chevron")}
      </summary>
      <div class="lesson-body">
        ${paragraphs(lesson.body)}
        <div class="key-points">${lesson.keyPoints.map((point) => `<div class="key-point">${escapeHtml(point)}</div>`).join("")}</div>
        <div class="example-box"><strong>Example.</strong> ${escapeHtml(lesson.example)}</div>
        <div class="lesson-actions">
          <button class="btn ${isLearned ? "btn-ghost" : "btn-primary"} btn-sm" type="button" data-action="mark-learned" data-lesson="${lesson.id}" ${isLearned ? "disabled" : ""}>
            ${isLearned ? `${icon("check")} Learned` : "Mark as learned"}
          </button>
          <a class="btn btn-ghost btn-sm" href="#/flashcards" data-action="flash-topic" data-topic="${topic.id}">${icon("layers")} Cards for this topic</a>
          <a class="btn btn-ghost btn-sm" href="#/formulas">${icon("sigma")} Formulas</a>
        </div>
      </div>
    </details>`;
  }).join("");

  return `
    <a class="back-link" href="#/learn">${icon("chevron")} Back to curriculum</a>
    <section class="topic-hero" style="--accent:${topic.accent};--soft:${topic.soft}">
      <div class="between wrap">
        <div>
          <span class="topic-badge">${escapeHtml(topic.short)}</span>
          <h1>${escapeHtml(topic.name)}</h1>
          <p>${escapeHtml(topic.blurb)}</p>
        </div>
        ${ring(pct, 82, 8, topic.accent, `${pct}%`, "mastery")}
      </div>
      <div class="topic-hero-actions">
        <button class="btn btn-primary" type="button" data-action="start-topic-quiz" data-topic="${topic.id}">${icon("check")} Quiz this topic</button>
        <a class="btn btn-ghost" href="#/flashcards">${icon("layers")} Review cards</a>
        <span class="pill">${learned}/${topic.lessons.length} lessons · ${seen}/${cards.length} cards seen</span>
      </div>
    </section>

    <div class="lesson-list">${lessonHtml}</div>

    <div class="card card-pad" style="margin-top:18px;">
      <div class="between">
        <div>
          <h2 class="section-title">Exam lens</h2>
          <p class="section-sub">What this topic usually asks.</p>
        </div>
      </div>
      <div class="callout" style="margin-top:12px;">
        ${icon("target")}
        <span>${escapeHtml(topicExamLens(topic.id))}</span>
      </div>
    </div>
  `;
}

function topicExamLens(topicId) {
  const lenses = {
    eda: "Definitions, chart choice, robust summaries, correlation interpretation and one small calculation such as IQR or a mean.",
    reg: "Interpret intercept, slope, R squared and RMSE. Choose adjusted R squared or AIC. Explain prediction intervals, dummy variables and cross-validation.",
    cls: "Compute accuracy, precision, recall and specificity. Explain threshold trade-offs, ROC and AUC, imbalanced data and logistic coefficients.",
    ml: "Explain KNN, standardisation, Gini and entropy, tree splits, bagging versus random forest, OOB, variable importance and bias variance."
  };
  return lenses[topicId] || "";
}

function renderFlashcards() {
  if (flashSession) return renderFlashSession();

  const stats = cardStats(flashFilter);
  const due = dueCards(flashFilter).length;
  const filters = `<div class="chip-row">
    <button class="chip ${flashFilter === "all" ? "active" : ""}" type="button" data-action="flash-filter" data-topic="all">All topics</button>
    ${TOPICS.map((t) => `<button class="chip ${flashFilter === t.id ? "active" : ""}" type="button" data-action="flash-filter" data-topic="${t.id}" style="--accent:${t.accent};--soft:${t.soft}">${escapeHtml(t.short)} · ${escapeHtml(t.name)}</button>`).join("")}
  </div>`;

  return `
    ${pageHead("Memory lab", "Flashcards", "Active recall with a simple spaced repetition scheduler. Flip, rate honestly, and let the weak cards come back sooner.", `<a class="btn btn-ghost" href="#/quiz">${icon("check")} Quiz instead</a>`)}
    <section class="card setup-card">
      <div class="between wrap">
        <div>
          <h2 class="setup-title">${flashFilter === "all" ? "All decks" : TOPIC_BY_ID[flashFilter].name}</h2>
          <p class="setup-sub">${flashFilter === "all" ? "Mix all four topics or focus on one. Due cards include new cards you have never seen." : TOPIC_BY_ID[flashFilter].blurb}</p>
        </div>
        <span class="pill">${due} due now</span>
      </div>
      ${filters}
      <div class="deck-stats">
        <div class="deck-stat"><strong>${stats.total}</strong><span>Total cards</span></div>
        <div class="deck-stat"><strong>${stats.new}</strong><span>New</span></div>
        <div class="deck-stat"><strong>${stats.learning}</strong><span>Learning</span></div>
        <div class="deck-stat"><strong>${stats.mature}</strong><span>Mature</span></div>
      </div>
      <div class="setup-actions">
        <button class="btn btn-primary" type="button" data-action="start-flash-due" ${due === 0 ? "disabled" : ""}>${icon("play")} Review ${Math.min(due, 20)}${due > 20 ? " of " + due : ""} due</button>
        <button class="btn btn-ghost" type="button" data-action="start-flash-all">${icon("shuffle")} Study a ${Math.min(stats.total, 20)}-card mix</button>
        <button class="btn btn-ghost" type="button" data-action="flash-filter" data-topic="all">${icon("rotate")} Reset filter</button>
      </div>
    </section>

    <div class="grid grid-2">
      <div class="card card-pad">
        <div class="row">${icon("bulb")}<h2 class="section-title">How the scheduler works</h2></div>
        <p class="small muted" style="margin-top:10px;">Again brings the card back in about a minute. Hard in about ten minutes. Good tomorrow. Easy in a couple of days. Rate how it felt, not how fast you want it gone.</p>
      </div>
      <div class="card card-pad">
        <div class="row">${icon("target")}<h2 class="section-title">Best way to use cards</h2>
        <p class="small muted" style="margin-top:10px;">Say the answer out loud before flipping. If you only recognise it, mark Again. Recognition is not recall.</p>
      </div>
    </div>
  `;
}

function renderFlashSession() {
  if (flashSession.finished || flashSession.index >= flashSession.ids.length) {
    return renderFlashSummary();
  }
  const card = FLASHCARD_BY_ID[flashSession.ids[flashSession.index]];
  const pct = (flashSession.index / flashSession.ids.length) * 100;
  const flipped = flashSession.flipped;
  const topic = TOPIC_BY_ID[card.topic];

  return `
    <div class="flash-shell">
      <div class="flash-top">
        <button class="btn btn-ghost btn-sm" type="button" data-action="flash-exit">${icon("close")} End</button>
        <div class="flash-progress"><span style="width:${pct}%"></span></div>
        <span class="flash-counter">${flashSession.index + 1} / ${flashSession.ids.length}</span>
      </div>
      <div class="flash-stage">
        <div class="flashcard ${flipped ? "flipped" : ""}" data-action="flip-card" role="button" tabindex="0" aria-label="Flashcard. Press Space to flip.">
          <div class="flash-face flash-front">
            <div class="flash-topline">
              <span class="pill pill-accent" style="--accent:${topic.accent};--soft:${topic.soft}">${escapeHtml(topic.short)}</span>
              <span class="pill">${difficultyLabel(card.difficulty)}</span>
            </div>
            <div class="flash-text">${escapeHtml(card.front)}</div>
            <div class="flash-hint"><strong>Hint.</strong> ${escapeHtml(card.hint)}</div>
            <div class="flash-tap">Tap or press Space</div>
          </div>
          <div class="flash-face flash-back">
            <div class="flash-topline">
              <span class="pill pill-accent" style="--accent:${topic.accent};--soft:${topic.soft}">Answer</span>
              <span class="pill">${escapeHtml(topic.short)}</span>
            </div>
            <div class="flash-text">${escapeHtml(card.back)}</div>
            <div class="flash-hint">Rate honestly. The scheduler uses your rating.</div>
          </div>
        </div>
      </div>
      <div class="flash-controls">
        ${flipped ? `<div class="rating-row">
          <button class="rating-btn" type="button" data-action="rate-card" data-rating="0">Again<span>1 min</span></button>
          <button class="rating-btn" type="button" data-action="rate-card" data-rating="1">Hard<span>10 min</span></button>
          <button class="rating-btn" type="button" data-action="rate-card" data-rating="2">Good<span>6+ hours</span></button>
          <button class="rating-btn" type="button" data-action="rate-card" data-rating="3">Easy<span>12+ hours</span></button>
        </div>` : `<div class="flash-before">
          <button class="btn btn-primary" type="button" data-action="flip-card">${icon("rotate")} Reveal answer</button>
          <button class="btn btn-ghost" type="button" data-action="flash-exit">End session</button>
        </div>`}
      </div>
      <p class="flash-keyhint">Space to flip · 1 Again · 2 Hard · 3 Good · 4 Easy</p>
    </div>
  `;
}

function renderFlashSummary() {
  const results = flashSession.results || { again: 0, hard: 0, good: 0, easy: 0 };
  const total = results.again + results.hard + results.good + results.easy;
  return `
    <div class="flash-shell">
      <div class="card session-summary">
        <span class="pill pill-accent">${icon("check")} Session complete</span>
        <h2>${total} card${total === 1 ? "" : "s"} reviewed.</h2>
        <p>The cards you rated Again or Hard will return first. That is the system working, not a failure.</p>
        <div class="summary-grid">
          <div class="summary-cell"><strong style="color:var(--red)">${results.again}</strong><span>Again</span></div>
          <div class="summary-cell"><strong style="color:var(--amber)">${results.hard}</strong><span>Hard</span></div>
          <div class="summary-cell"><strong style="color:var(--cyan)">${results.good}</strong><span>Good</span></div>
          <div class="summary-cell"><strong style="color:var(--green)">${results.easy}</strong><span>Easy</span></div>
        </div>
        <div class="row" style="justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-primary" type="button" data-action="start-flash-due">${icon("rotate")} Review due again</button>
          <button class="btn btn-ghost" type="button" data-action="start-flash-all">${icon("shuffle")} Study all</button>
          <a class="btn btn-ghost" href="#/dashboard">${icon("home")} Dashboard</a>
        </div>
      </div>
    </div>
  `;
}

function renderQuiz() {
  if (quizSession) {
    return quizSession.finished ? renderQuizResult() : renderQuizQuestion();
  }

  const weak = weakMcqIds().length;
  const filters = `<div class="chip-row">
    <button class="chip ${quizFilter === "all" ? "active" : ""}" type="button" data-action="quiz-filter" data-topic="all">Mixed</button>
    ${TOPICS.map((t) => `<button class="chip ${quizFilter === t.id ? "active" : ""}" type="button" data-action="quiz-filter" data-topic="${t.id}" style="--accent:${t.accent};--soft:${t.soft}">${escapeHtml(t.short)}</button>`).join("")}
  </div>`;
  const lengths = [10, 20, 30].map((n) => `<button class="chip ${quizLength === n ? "active" : ""}" type="button" data-action="quiz-length" data-length="${n}">${n} questions</button>`).join("");

  return `
    ${pageHead("Practice", "Quiz", "Ten questions by default. Instant feedback, a short explanation, and every wrong answer is saved so you can drill it later.", `<button class="btn btn-ghost" type="button" data-action="shortcuts">${icon("keyboard")} Keys</button>`)}
    <section class="card setup-card">
      <div class="between wrap">
        <div>
          <h2 class="setup-title">Build a quiz</h2>
          <p class="setup-sub">Choose a topic or mix all four. The question bank is written in the exam style: definitions, interpretation, comparisons and small calculations.</p>
        </div>
        <span class="pill">${MCQS.length} questions available</span>
      </div>
      <div class="stack" style="margin-top:18px;">
        <div>
          <p class="tiny muted-2" style="text-transform:uppercase;letter-spacing:.1em;margin-bottom:7px;">Topic</p>
          ${filters}
        </div>
        <div>
          <p class="tiny muted-2" style="text-transform:uppercase;letter-spacing:.1em;margin-bottom:7px;">Length</p>
          <div class="chip-row" style="margin-top:0;">${lengths}</div>
        </div>
      </div>
      <div class="setup-actions">
        <button class="btn btn-primary" type="button" data-action="start-quiz">${icon("play")} Start quiz</button>
        <button class="btn btn-ghost" type="button" data-action="start-weak-quiz" ${weak === 0 ? "disabled" : ""}>${icon("target")} Weak spots ${weak ? `(${weak})` : ""}</button>
      </div>
      <div class="deck-stats">
        <div class="deck-stat"><strong>${MCQS.length}</strong><span>Questions</span></div>
        <div class="deck-stat"><strong>${quizAccuracy()}%</strong><span>Your accuracy</span></div>
        <div class="deck-stat"><strong>${weak}</strong><span>Weak spots</span></div>
        <div class="deck-stat"><strong>${state.quizHistory.length}</strong><span>Quizzes done</span></div>
      </div>
    </section>
    <div class="grid grid-2">
      <div class="card card-pad">
        <div class="row">${icon("bulb")}<h2 class="section-title">Read the question twice</h2></div>
        <p class="small muted" style="margin-top:10px;">The common error is a definition swap. Precision is not recall. R squared is not accuracy. Median is not mean. Slow down on the wording.</p>
      </div>
      <div class="card card-pad">
        <div class="row">${icon("target")}<h2 class="section-title">Weak spots</h2></div>
        <p class="small muted" style="margin-top:10px;">Every wrong answer is saved. Use the weak spots button to build a quiz from the questions you have missed before.</p>
      </div>
    </div>
  `;
}

function renderQuizQuestion() {
  const q = MCQ_BY_ID[quizSession.ids[quizSession.index]];
  const answered = quizSession.answers[q.id] !== undefined;
  const selected = quizSession.answers[q.id];
  const pct = (quizSession.index / quizSession.ids.length) * 100;
  const topic = TOPIC_BY_ID[q.topic];
  const correctIndex = q.answer;

  const options = q.options.map((option, index) => {
    let cls = "option";
    if (answered) {
      if (index === correctIndex) cls += " correct";
      else if (index === selected) cls += " wrong";
    }
    return `<button class="${cls}" type="button" data-action="quiz-option" data-index="${index}" ${answered ? "disabled" : ""}>
      <span class="option-letter">${String.fromCharCode(65 + index)}</span>
      <span>${escapeHtml(option)}</span>
    </button>`;
  }).join("");

  return `
    <div class="quiz-shell">
      <div class="quiz-top">
        <span class="quiz-score">${quizSession.score} correct</span>
        <div class="bar" style="--accent:${topic.accent}"><div class="bar-fill" style="width:${pct}%"></div></div>
        <span class="flash-counter">${quizSession.index + 1} / ${quizSession.ids.length}</span>
      </div>
      <div class="card quiz-question">
        <div class="quiz-kicker">
          ${topicPill(q.topic)}
          <span class="pill">${difficultyLabel(q.difficulty)}</span>
          <span class="pill">Question ${quizSession.index + 1}</span>
        </div>
        <h2>${escapeHtml(q.question)}</h2>
        <div class="option-list">${options}</div>
        ${answered ? `<div class="explanation"><strong>${selected === correctIndex ? "Correct." : "Not quite."}</strong> ${escapeHtml(q.explanation)}</div>` : ""}
        <div class="quiz-actions">
          ${answered ? `<button class="btn btn-primary" type="button" data-action="quiz-next">${quizSession.index + 1 >= quizSession.ids.length ? "See results" : "Next question"} ${icon("arrow")}</button>` : `<span class="small muted-2">Choose an answer. Use keys 1 to 4.</span>`}
        </div>
      </div>
    </div>
  `;
}

function renderQuizResult() {
  const total = quizSession.ids.length;
  const correct = quizSession.score;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const wrongIds = quizSession.ids.filter((id) => quizSession.answers[id] !== MCQ_BY_ID[id].answer);
  const byTopic = {};
  quizSession.ids.forEach((id) => {
    const q = MCQ_BY_ID[id];
    if (!byTopic[q.topic]) byTopic[q.topic] = { correct: 0, total: 0 };
    byTopic[q.topic].total += 1;
    if (quizSession.answers[id] === q.answer) byTopic[q.topic].correct += 1;
  });

  const breakdown = Object.entries(byTopic).map(([topicId, data]) => {
    const topic = TOPIC_BY_ID[topicId];
    const value = Math.round((data.correct / data.total) * 100);
    return `<div class="breakdown-row"><span>${escapeHtml(topic.short)}</span>${progressBar(value, topic.accent)}<span class="right">${data.correct}/${data.total}</span></div>`;
  }).join("");

  const review = wrongIds.length ? `<div class="card card-pad" style="margin-top:16px;">
    <h2 class="section-title">Review what you missed</h2>
    <div class="review-list">
      ${wrongIds.map((id) => {
        const q = MCQ_BY_ID[id];
        const yours = quizSession.answers[id];
        return `<div class="review-item">
          <strong>${escapeHtml(q.question)}</strong>
          <div class="answer-line">Your answer: ${yours !== undefined ? escapeHtml(q.options[yours]) : "Not answered"}</div>
          <div class="answer-line">Correct answer: <b>${escapeHtml(q.options[q.answer])}</b></div>
          <div class="answer-line muted" style="margin-top:6px;">${escapeHtml(q.explanation)}</div>
        </div>`;
      }).join("")}
    </div>
  </div>` : `<div class="card card-pad" style="margin-top:16px;"><div class="empty">No wrong answers. That is a clean run.</div></div>`;

  return `
    <div class="quiz-result">
      <div class="card result-hero">
        ${ring(pct, 96, 9, pct >= 70 ? "var(--green)" : pct >= 50 ? "var(--amber)" : "var(--red)", `${pct}%`, "score")}
        <div>
          <p class="eyebrow">Quiz complete</p>
          <h2>${correct} out of ${total}</h2>
          <p>${pct >= 80 ? "Strong. Move to a timed mock." : pct >= 60 ? "A solid base. Drill the wrong answers, then retry." : "Go back to the lesson summaries for the topics you missed, then try again."}</p>
          <div class="result-breakdown">${breakdown}</div>
        </div>
      </div>
      ${review}
      <div class="row wrap" style="margin-top:16px;">
        ${wrongIds.length ? `<button class="btn btn-primary" type="button" data-action="retry-wrong">${icon("rotate")} Retry the ${wrongIds.length} missed</button>` : ""}
        <button class="btn btn-ghost" type="button" data-action="quiz-new">${icon("shuffle")} New quiz</button>
        <a class="btn btn-ghost" href="#/dashboard">${icon("home")} Dashboard</a>
      </div>
    </div>
  `;
}

function renderMock() {
  if (mockSession) {
    return mockSession.submitted ? renderMockReview() : renderMockExam();
  }
  if (state.mockDraft) {
    return renderMockResume();
  }

  const cards = MOCKS.map((mock) => {
    const best = state.mockHistory.filter((m) => m.mockId === mock.id).reduce((max, m) => Math.max(max, m.total || 0), 0);
    return `<div class="card mock-card" style="--accent:var(--violet);--soft:rgba(139,124,255,.12)">
      <div class="between">
        <span class="pill pill-accent">${icon("clock")} 40 minutes</span>
        <span class="pill">${best ? `Best ${best}/20` : "Not sat yet"}</span>
      </div>
      <h2>${escapeHtml(mock.title)}</h2>
      <p>${escapeHtml(mock.subtitle)}</p>
      <div class="mock-meta">
        <span class="pill">10 MCQs</span>
        <span class="pill">5 short answers</span>
        <span class="pill">No calculator</span>
      </div>
      <button class="btn btn-primary" type="button" data-action="start-mock" data-mock="${mock.id}">${icon("play")} Start paper</button>
    </div>`;
  }).join("");

  return `
    ${pageHead("Exam simulation", "Mock exam", "The real format: 40 minutes, 10 multiple choice questions and 5 short answers. No notes, no calculator. Grade the short answers yourself with the model answers.", `<span class="pill">${icon("clock")} 40:00</span>`)}
    <section class="card card-pad" style="margin-bottom:16px;">
      <div class="between wrap">
        <div>
          <h2 class="section-title">Before you start</h2>
          <p class="section-sub">Sit this at a desk, with a pen and paper, and no tabs open. The point is to practise the real conditions.</p>
        </div>
        <span class="pill">Test 1 · Thu 22 Oct</span>
      </div>
      <div class="grid grid-3" style="margin-top:16px;">
        <div class="glass" style="padding:15px;"><strong class="small">No calculator</strong><p class="tiny muted" style="margin-top:5px;">The numbers are chosen to be simple. Show your work.</p></div>
        <div class="glass" style="padding:15px;"><strong class="small">No coding</strong><p class="tiny muted" style="margin-top:5px;">You will not write R or Python. You will interpret and explain.</p></div>
        <div class="glass" style="padding:15px;"><strong class="small">No notes</strong><p class="tiny muted" style="margin-top:5px;">Write your formula sheet from memory first, then put it away before you start.</p></div>
      </div>
    </section>
    <div class="mock-grid">${cards}</div>
    <div class="callout" style="margin-top:16px;">
      ${icon("info")}
      <span>Short answers are self graded. After submitting, compare your answer with the model answer and award 0, 1 or 2 marks. Be honest. The score is for you.</span>
    </div>
  `;
}

function renderMockResume() {
  const draft = state.mockDraft;
  const mock = MOCK_BY_ID[draft.mockId];
  const remaining = Math.max(0, draft.endsAt - Date.now());
  const expired = remaining <= 0;
  return `
    ${pageHead("Exam simulation", "Resume your mock", "You have a paper in progress. Pick up where you left off, or discard it and start fresh.", "")}
    <div class="card card-pad" style="max-width:720px;margin:0 auto;">
      <div class="between wrap">
        <div>
          <span class="pill pill-accent">${icon("clock")} ${expired ? "Time expired" : clockString(remaining) + " remaining"}</span>
          <h2 class="section-title" style="margin-top:12px;">${escapeHtml(mock?.title || "Mock paper")}</h2>
          <p class="small muted" style="margin-top:6px;">${expired ? "The timer has run out. Resume to submit and grade it." : "Your answers were saved in this browser."}</p>
        </div>
        ${ring(expired ? 100 : Math.round((remaining / (40 * 60000)) * 100), 80, 8, expired ? "var(--red)" : "var(--cyan)", expired ? "0:00" : clockString(remaining))}
      </div>
      <div class="row wrap" style="margin-top:18px;">
        <button class="btn btn-primary" type="button" data-action="resume-mock">${icon("play")} ${expired ? "Submit and review" : "Resume paper"}</button>
        <button class="btn btn-ghost" type="button" data-action="discard-mock">${icon("close")} Discard draft</button>
      </div>
    </div>
  `;
}

function renderMockExam() {
  const mock = MOCK_BY_ID[mockSession.mockId];
  const mcqs = mock.mcqIds.map((id) => MCQ_BY_ID[id]);
  const shorts = mock.shortIds.map((id) => SHORT_BY_ID[id]);
  const total = mcqs.length + shorts.length;
  const index = clamp(mockSession.index, 0, total - 1);
  mockSession.index = index;
  const isMcq = index < mcqs.length;
  const answeredCount = mcqs.filter((q) => mockSession.answers[q.id] !== undefined).length + shorts.filter((q) => (mockSession.shortAnswers[q.id] || "").trim()).length;
  const remaining = Math.max(0, mockSession.endsAt - Date.now());

  let body = "";
  if (isMcq) {
    const q = mcqs[index];
    const selected = mockSession.answers[q.id];
    body = `<div class="quiz-kicker">${topicPill(q.topic)}<span class="pill">Part 1 · MCQ ${index + 1} of ${mcqs.length}</span><span class="pill">${difficultyLabel(q.difficulty)}</span></div>
      <h2>${escapeHtml(q.question)}</h2>
      <div class="option-list">
        ${q.options.map((option, optionIndex) => `<button class="option ${selected === optionIndex ? "selected" : ""}" type="button" data-action="mock-option" data-index="${optionIndex}">
          <span class="option-letter">${String.fromCharCode(65 + optionIndex)}</span>
          <span>${escapeHtml(option)}</span>
        </button>`).join("")}
      </div>`;
  } else {
    const q = shorts[index - mcqs.length];
    const value = mockSession.shortAnswers[q.id] || "";
    body = `<div class="quiz-kicker">${topicPill(q.topic)}<span class="pill">Part 2 · Short answer ${index - mcqs.length + 1} of ${shorts.length}</span><span class="pill">${q.marks} marks</span></div>
      <h2>${escapeHtml(q.question)}</h2>
      <div class="exam-short">
        <textarea data-short-input="${q.id}" placeholder="Write your answer here. Show your working where relevant.">${escapeHtml(value)}</textarea>
        <p class="exam-note">Aim for 2 to 4 sentences or a short calculation with interpretation. Method marks matter.</p>
      </div>`;
  }

  const palette = Array.from({ length: total }, (_, i) => {
    const isShort = i >= mcqs.length;
    const q = isShort ? shorts[i - mcqs.length] : mcqs[i];
    const answered = isShort ? Boolean((mockSession.shortAnswers[q.id] || "").trim()) : mockSession.answers[q.id] !== undefined;
    return `<button class="palette-btn ${answered ? "answered" : ""} ${i === index ? "current" : ""}" type="button" data-action="mock-palette" data-index="${i}" title="${isShort ? "Short answer" : "MCQ"} ${i + 1}">${i + 1}</button>`;
  }).join("");

  return `
    <div class="exam-shell">
      <div class="exam-head">
        <div class="exam-head-left">
          <span class="pill">${escapeHtml(mock.title)}</span>
          <span class="exam-timer ${remaining <= 5 * 60000 ? "bad" : remaining <= 10 * 60000 ? "warn" : ""}" id="examTimer">${clockString(remaining)}</span>
          <span class="exam-progress">${answeredCount} / ${total} answered</span>
        </div>
        <div class="exam-head-right">
          <button class="btn btn-ghost btn-sm" type="button" data-action="mock-exit">${icon("close")} Save and exit</button>
          <button class="btn btn-primary btn-sm" type="button" data-action="mock-submit">${icon("flag")} Submit paper</button>
        </div>
      </div>
      <div class="exam-grid">
        <div class="card exam-main">
          ${body}
          <div class="exam-nav">
            <button class="btn btn-ghost btn-sm" type="button" data-action="mock-prev" ${index === 0 ? "disabled" : ""}>${icon("chevron", "prev")} Previous</button>
            <button class="btn btn-soft btn-sm" type="button" data-action="mock-next" ${index >= total - 1 ? "disabled" : ""}>Next ${icon("arrow")}</button>
          </div>
        </div>
        <aside class="card exam-palette">
          <h3>Question palette</h3>
          <div class="palette-grid">${palette}</div>
          <div class="tiny muted-2" style="margin-top:10px;">1 to 10 are MCQs. 11 to 15 are short answers.</div>
        </aside>
      </div>
    </div>
  `;
}

function renderMockReview() {
  const mock = MOCK_BY_ID[mockSession.mockId];
  const mcqs = mock.mcqIds.map((id) => MCQ_BY_ID[id]);
  const shorts = mock.shortIds.map((id) => SHORT_BY_ID[id]);
  const result = mockSession.result;
  const mcqCorrect = result.mcqCorrect;
  const shortScore = Object.values(result.grades || {}).reduce((sum, value) => sum + value, 0);
  const total = mcqCorrect + shortScore;
  const pct = Math.round((total / 20) * 100);
  const graded = Object.keys(result.grades || {}).length;
  const allGraded = graded === shorts.length;

  const mcqReview = mcqs.map((q) => {
    const yours = mockSession.answers[q.id];
    const correct = yours === q.answer;
    return `<div class="review-item">
      <strong>${escapeHtml(q.question)}</strong>
      <div class="answer-line">Your answer: ${yours !== undefined ? escapeHtml(q.options[yours]) : "Not answered"} ${correct ? `<span class="good">Correct</span>` : `<span class="bad">Wrong</span>`}</div>
      ${!correct ? `<div class="answer-line">Correct answer: <b>${escapeHtml(q.options[q.answer])}</b></div>` : ""}
      <div class="answer-line muted" style="margin-top:6px;">${escapeHtml(q.explanation)}</div>
    </div>`;
  }).join("");

  const shortReview = shorts.map((q, index) => {
    const grade = result.grades?.[q.id];
    const yourAnswer = mockSession.shortAnswers[q.id] || "Not answered.";
    return `<div class="short-review">
      <div class="between wrap">
        <h3>${index + 11}. ${escapeHtml(q.question)}</h3>
        <span class="pill">${q.marks} marks</span>
      </div>
      <div class="your-answer"><strong class="small">Your answer.</strong><br>${escapeHtml(yourAnswer)}</div>
      <div class="model-answer"><strong class="small">Model answer.</strong><br>${escapeHtml(q.model)}</div>
      <div class="guidance"><strong>Marking guide.</strong> ${escapeHtml(q.guidance)}</div>
      <div class="grade-row">
        ${[0, 1, 2].map((score) => `<button class="grade-btn ${grade === score ? "active" : ""}" type="button" data-action="grade-short" data-short="${q.id}" data-score="${score}">${score} / 2</button>`).join("")}
      </div>
    </div>`;
  }).join("");

  return `
    <div class="mock-review">
      <div class="card review-score">
        ${ring(pct, 104, 9, pct >= 70 ? "var(--green)" : pct >= 50 ? "var(--amber)" : "var(--red)", `${total}/20`, "total")}
        <div>
          <p class="eyebrow">${escapeHtml(mock.title)} · submitted</p>
          <h2>${allGraded ? `${total} out of 20` : `${mcqCorrect} out of 10 on the MCQs`}</h2>
          <p>${allGraded ? (pct >= 80 ? "That is a strong paper. Keep the mistakes warm and revisit them tomorrow." : pct >= 60 ? "A passable base. The short answers and the weak MCQs are where the next marks are." : "Do not panic. Reread the one pagers, then retake this paper in two days.") : `Grade the short answers below. ${graded} of ${shorts.length} graded.`}</p>
          <div class="row wrap" style="margin-top:12px;">
            <span class="pill">MCQ ${mcqCorrect}/10</span>
            <span class="pill">Short ${shortScore}/10</span>
            <span class="pill">Total ${total}/20</span>
          </div>
        </div>
      </div>

      <div class="card card-pad" style="margin-top:16px;">
        <div class="between">
          <div>
            <h2 class="section-title">Part 1 · Multiple choice</h2>
            <p class="section-sub">The correct answer and the reason.</p>
          </div>
          <span class="pill">${mcqCorrect} / 10</span>
        </div>
        <div class="review-list">${mcqReview}</div>
      </div>

      <div class="card card-pad" style="margin-top:16px;">
        <div class="between">
          <div>
            <h2 class="section-title">Part 2 · Short answers</h2>
            <p class="section-sub">Compare, then award yourself 0, 1 or 2. Be honest.</p>
          </div>
          <span class="pill">${shortScore} / 10</span>
        </div>
        <div style="margin-top:14px;">${shortReview}</div>
      </div>

      <div class="row wrap" style="margin-top:16px;">
        <button class="btn btn-primary" type="button" data-action="mock-retry" data-mock="${mock.id}">${icon("rotate")} Retake this paper</button>
        <a class="btn btn-ghost" href="#/mock" data-action="mock-back">${icon("clock")} Back to mocks</a>
        <a class="btn btn-ghost" href="#/dashboard">${icon("home")} Dashboard</a>
      </div>
    </div>
  `;
}

function renderFormulas() {
  if (formulaDrill) return renderFormulaDrill();

  const cards = FORMULAS.map((f) => {
    const topic = TOPIC_BY_ID[f.topic];
    const revealed = !state.settings.blurFormulas || revealedFormulas.has(f.id);
    return `<div class="formula-card ${revealed ? "revealed" : ""}" data-action="formula-toggle" data-formula="${f.id}" role="button" tabindex="0" style="--accent:${topic.accent};--soft:${topic.soft}">
      <div class="between">
        <h3>${escapeHtml(f.name)}</h3>
        ${topicPill(f.topic)}
      </div>
      <div class="formula-text">${escapeHtml(f.formula)}</div>
      <div class="formula-meaning">${escapeHtml(f.meaning)}</div>
      <div class="formula-example">${escapeHtml(f.example)}</div>
      <div class="formula-hint">${revealed ? "Tap to hide" : "Tap to reveal"}</div>
    </div>`;
  }).join("");

  return `
    ${pageHead("Formula lab", "Formulas", "Cover the formula, say it out loud, then reveal. Recognition is not recall. Use drill mode when the list feels familiar.", `<button class="btn btn-ghost" type="button" data-action="formula-drill">${icon("play")} Drill mode</button>`)}
    <div class="card card-pad" style="margin-bottom:16px;">
      <div class="between wrap">
        <div>
          <h2 class="section-title">${state.settings.blurFormulas ? "Blur is on" : "Blur is off"}</h2>
          <p class="section-sub">${FORMULAS.length} formulas across the four topics. The exam bans a calculator, so know the arithmetic as well as the formula.</p>
        </div>
        <div class="row wrap">
          <button class="btn btn-ghost btn-sm" type="button" data-action="formula-blur-all">${icon("rotate")} Blur all</button>
          <button class="btn btn-ghost btn-sm" type="button" data-action="formula-reveal-all">${icon("bulb")} Reveal all</button>
        </div>
      </div>
    </div>
    <div class="formula-grid">${cards}</div>
  `;
}

function renderFormulaDrill() {
  const ids = formulaDrill.ids;
  if (formulaDrill.index >= ids.length) {
    return `<div class="card drill-card">
      <span class="pill pill-accent">${icon("check")} Drill complete</span>
      <h2 class="section-title" style="margin-top:14px;font-size:clamp(2rem,4vw,3rem);">${ids.length} formulas reviewed.</h2>
      <p class="small muted" style="margin-top:8px;">Say them again tomorrow. The exam bans a calculator, so the arithmetic needs to be automatic too.</p>
      <div class="drill-actions">
        <button class="btn btn-primary" type="button" data-action="formula-drill">${icon("rotate")} Drill again</button>
        <button class="btn btn-ghost" type="button" data-action="formula-drill-exit">${icon("sigma")} Back to formulas</button>
      </div>
    </div>`;
  }
  const f = FORMULA_BY_ID[ids[formulaDrill.index]];
  const topic = TOPIC_BY_ID[f.topic];
  return `<div class="drill-card card" style="--accent:${topic.accent};--soft:${topic.soft}">
    <div class="between">
      <span class="pill pill-accent">${escapeHtml(topic.name)}</span>
      <span class="pill">${formulaDrill.index + 1} / ${ids.length}</span>
    </div>
    <h2 class="section-title" style="margin-top:18px;font-size:clamp(1.8rem,3vw,2.6rem);">${escapeHtml(f.name)}</h2>
    <div class="formula-text" style="filter:${formulaDrill.revealed ? "none" : "blur(7px)"};opacity:${formulaDrill.revealed ? "1" : ".55"};">${escapeHtml(f.formula)}</div>
    ${formulaDrill.revealed ? `<p class="small muted">${escapeHtml(f.meaning)}</p><p class="tiny muted-2" style="margin-top:8px;">${escapeHtml(f.example)}</p>` : `<p class="tiny muted-2">Say the formula out loud, then reveal.</p>`}
    <div class="drill-actions">
      ${formulaDrill.revealed ? `<button class="btn btn-primary" type="button" data-action="formula-drill-next">Next ${icon("arrow")}</button>` : `<button class="btn btn-primary" type="button" data-action="formula-drill-reveal">${icon("bulb")} Reveal</button>`}
      <button class="btn btn-ghost" type="button" data-action="formula-drill-exit">${icon("close")} Exit</button>
    </div>
    <p class="tiny muted-2" style="margin-top:12px;">Space to reveal · Enter for next</p>
  </div>`;
}

function renderProgress() {
  ensureDaily();
  const readiness = overallReadiness();
  const masteryRows = TOPICS.map((topic) => {
    const pct = topicMastery(topic.id);
    const learned = topic.lessons.filter((l) => isLessonLearned(l.id)).length;
    const cards = FLASHCARDS.filter((c) => c.topic === topic.id);
    const seen = cards.filter((c) => getCardState(c.id).reps > 0).length;
    return `<div class="mastery-row">
      <div class="mastery-name">${escapeHtml(topic.name)}<span>${learned}/${topic.lessons.length} lessons · ${seen}/${cards.length} cards</span></div>
      ${progressBar(pct, topic.accent)}
      <div class="mastery-pct">${pct}%</div>
    </div>`;
  }).join("");

  const quizRows = state.quizHistory.slice(-5).reverse().map((q) => `<div class="history-item">
    ${icon("check")}
    <strong>${escapeHtml(q.topic === "all" ? "Mixed quiz" : TOPIC_BY_ID[q.topic]?.short || "Quiz")}</strong>
    <span class="muted-2">${formatDate(q.date)}</span>
    <span class="right">${q.correct}/${q.total}</span>
  </div>`).join("");

  const mockRows = state.mockHistory.slice(-5).reverse().map((m) => `<div class="history-item">
    ${icon("clock")}
    <strong>${escapeHtml(MOCK_BY_ID[m.mockId]?.title || "Mock")}</strong>
    <span class="muted-2">${formatDate(m.date)}</span>
    <span class="right">${m.total}/20${m.shortGraded !== undefined && m.shortGraded < 5 ? " partial" : ""}</span>
  </div>`).join("");

  const weak = weakMcqIds().slice(0, 5);
  const weakRows = weak.map((id) => {
    const q = MCQ_BY_ID[id];
    return `<div class="weak-item"><span>${escapeHtml(q.question)}</span><span class="pill">${state.mcqStats[id]?.wrong || 0} miss${(state.mcqStats[id]?.wrong || 0) === 1 ? "" : "es"}</span></div>`;
  }).join("");

  return `
    ${pageHead("Your progress", "Progress", "The numbers are here to point you at the next weak spot, not to make you feel good or bad.", `<button class="btn btn-ghost" type="button" data-action="shortcuts">${icon("keyboard")} Keys</button>`)}
    <section class="card readiness-hero">
      ${ring(readiness, 128, 10, readiness >= 70 ? "var(--green)" : readiness >= 45 ? "var(--amber)" : "var(--red)", `${readiness}%`, "ready")}
      <div>
        <h2>${readiness >= 80 ? "You are in good shape." : readiness >= 55 ? "The base is there. Tighten the weak spots." : "Build the base first."}</h2>
        <p>Readiness blends lesson coverage, card coverage, quiz accuracy and your best mock. A high score here means you have touched everything and performed under time pressure. It does not guarantee a grade, but it is a useful guide.</p>
        <div class="row wrap" style="margin-top:12px;">
          <span class="pill">${Object.keys(state.learned).length}/${LESSONS.length} lessons</span>
          <span class="pill">${FLASHCARDS.filter((c) => getCardState(c.id).reps > 0).length}/${FLASHCARDS.length} cards seen</span>
          <span class="pill">${quizAccuracy()}% quiz accuracy</span>
          <span class="pill">${state.mockHistory.length} mock${state.mockHistory.length === 1 ? "" : "s"}</span>
        </div>
      </div>
    </section>

    <section class="stats-grid">
      <div class="stat-card" style="--accent:var(--violet)"><div class="stat-icon">${icon("layers")}</div><div><div class="stat-value">${FLASHCARDS.reduce((sum, c) => sum + (getCardState(c.id).reps || 0), 0)}</div><div class="stat-label">Card reviews</div></div></div>
      <div class="stat-card" style="--accent:var(--cyan)"><div class="stat-icon">${icon("check")}</div><div><div class="stat-value">${quizAccuracy()}%</div><div class="stat-label">Quiz accuracy</div></div></div>
      <div class="stat-card" style="--accent:var(--amber)"><div class="stat-icon">${icon("book")}</div><div><div class="stat-value">${Object.keys(state.learned).length}/${LESSONS.length}</div><div class="stat-label">Lessons learned</div></div></div>
      <div class="stat-card" style="--accent:var(--lime)"><div class="stat-icon">${icon("flame")}</div><div><div class="stat-value">${state.streak.count || 0}</div><div class="stat-label">Day streak</div></div></div>
    </section>

    <div class="dash-grid">
      <div class="card card-pad">
        <h2 class="section-title">Mastery by topic</h2>
        <p class="section-sub">The weakest topic is the best place to spend the next 30 minutes.</p>
        <div class="mastery-list" style="margin-top:16px;">${masteryRows}</div>
      </div>
      <div class="card card-pad">
        <h2 class="section-title">Weak spots</h2>
        <p class="section-sub">Questions you have missed before. Drill them until they stop appearing here.</p>
        <div class="weak-list">${weakRows || `<div class="empty">No weak spots yet. Take a quiz to start tracking.</div>`}</div>
        ${weak.length ? `<button class="btn btn-primary btn-sm" type="button" data-action="start-weak-quiz" style="margin-top:14px;">${icon("target")} Drill weak spots</button>` : ""}
      </div>
    </div>

    <div class="dash-grid" style="margin-top:16px;">
      <div class="card card-pad">
        <h2 class="section-title">Recent quizzes</h2>
        <div class="history-list" style="margin-top:14px;">${quizRows || `<div class="empty">No quizzes yet.</div>`}</div>
      </div>
      <div class="card card-pad">
        <h2 class="section-title">Recent mocks</h2>
        <div class="history-list" style="margin-top:14px;">${mockRows || `<div class="empty">No mocks yet. Sit one when you have 40 quiet minutes.</div>`}</div>
      </div>
    </div>

    <div class="card card-pad" style="margin-top:16px;">
      <div class="between wrap">
        <div>
          <h2 class="section-title">Reset progress</h2>
          <p class="section-sub">This clears your card schedule, quiz history and mock scores from this browser.</p>
        </div>
        <button class="btn btn-danger" type="button" data-action="reset">${icon("rotate")} Reset everything</button>
      </div>
    </div>
  `;
}
