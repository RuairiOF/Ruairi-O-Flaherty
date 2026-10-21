const LAB_REGISTRY = {};
const LAB_STATE = {};
const LAB_COLORS = {
  text: "#f4f7ff",
  muted: "#9aa7c2",
  muted2: "#6f7d99",
  grid: "rgba(255,255,255,0.075)",
  faint: "rgba(255,255,255,0.03)",
  violet: "#8b7cff",
  cyan: "#38d9c9",
  lime: "#b6f09c",
  amber: "#ffb86b",
  red: "#ff6b81",
  green: "#4ade80",
  blue: "#6ea8fe"
};

function registerLab(id, config) {
  LAB_REGISTRY[id] = { id, ...config };
}

function getLabState(id) {
  const lab = LAB_REGISTRY[id];
  if (!lab) return {};
  if (!LAB_STATE[id]) LAB_STATE[id] = { ...lab.defaults };
  return LAB_STATE[id];
}

function renderLabs() {
  const labs = Object.values(LAB_REGISTRY);
  const cards = labs.map((lab, index) => {
    const topic = TOPIC_BY_ID[lab.meta.topic];
    return `<a class="lab-card" href="#/labs/${lab.id}" style="--accent:${topic.accent};--soft:${topic.soft}">
      <div class="lab-card-top">
        <div class="lab-preview">${icon("lab")}</div>
        <span class="lab-tag">Lab ${String(index + 1).padStart(2, "0")}</span>
      </div>
      <div>
        ${topicPill(lab.meta.topic)}
        <h2>${escapeHtml(lab.meta.title)}</h2>
        <p>${escapeHtml(lab.meta.blurb)}</p>
      </div>
      <div class="lab-card-foot">
        <span class="pill">${escapeHtml(lab.meta.time || "5 min")}</span>
        <span class="section-link">Open lab ${icon("arrow")}</span>
      </div>
    </a>`;
  }).join("");

  return `
    ${pageHead("Visual labs", "Play with the ideas", `${labs.length} interactive benches built around the exact exam questions. Change a control, predict what will happen, then check the chart and the numbers.`, `<a class="btn btn-ghost" href="#/learn">${icon("book")} Back to lessons</a>`)}
    <div class="card card-pad" style="margin-bottom:16px;">
      <div class="between wrap">
        <div>
          <h2 class="section-title">How to use a lab</h2>
          <p class="section-sub">Do not just drag the sliders. Predict first, then move one control and explain the change out loud.</p>
        </div>
        <span class="pill">${labs.length} labs</span>
      </div>
      <div class="grid grid-3" style="margin-top:16px;">
        <div class="glass" style="padding:15px;"><strong class="small">1. Predict</strong><p class="tiny muted" style="margin-top:5px;">Say what you think will happen before you touch the control.</p></div>
        <div class="glass" style="padding:15px;"><strong class="small">2. Change one thing</strong><p class="tiny muted" style="margin-top:5px;">Keep the rest fixed so the cause is obvious.</p></div>
        <div class="glass" style="padding:15px;"><strong class="small">3. Read the metric</strong><p class="tiny muted" style="margin-top:5px;">The chart is the intuition. The metric is the exam answer.</p></div>
      </div>
    </div>
    <div class="labs-grid">${cards}</div>
  `;
}

function renderLab(id) {
  const lab = LAB_REGISTRY[id];
  if (!lab) {
    return `<div class="card card-pad"><h2 class="section-title">Lab not found</h2><p class="muted" style="margin-top:8px;">That visual lab does not exist.</p><a class="btn btn-primary" href="#/labs" style="margin-top:16px;">Back to labs</a></div>`;
  }
  const state = getLabState(id);
  const topic = TOPIC_BY_ID[lab.meta.topic];
  const canvases = lab.canvases || [{ id: "lab-canvas", title: "Live chart" }];
  const chartHtml = canvases.length === 1
    ? `<div class="card lab-chart-card">
        <div class="lab-chart-head"><h2>${escapeHtml(canvases[0].title)}</h2><span class="pill">Live</span></div>
        <canvas id="${canvases[0].id}" class="lab-canvas"></canvas>
      </div>`
    : `<div class="lab-chart-grid">
        ${canvases.map((c) => `<div class="card lab-chart-card">
          <div class="lab-chart-head"><h2>${escapeHtml(c.title)}</h2><span class="pill">Live</span></div>
          <canvas id="${c.id}" class="lab-canvas"></canvas>
        </div>`).join("")}
      </div>`;

  return `
    <a class="back-link" href="#/labs">${icon("chevron")} Back to visual labs</a>
    <section class="lab-hero" style="--accent:${topic.accent};--soft:${topic.soft}">
      <div class="between wrap">
        <div>
          <span class="topic-badge">${escapeHtml(topic.short)}</span>
          <h1>${escapeHtml(lab.meta.title)}</h1>
          <p>${escapeHtml(lab.meta.blurb)}</p>
          <div class="lab-hero-meta">
            <span class="pill">${escapeHtml(lab.meta.time || "5 min")}</span>
            <span class="pill">Interactive</span>
            <span class="pill">${escapeHtml(lab.meta.examShort || "Exam link")}</span>
          </div>
        </div>
        <div class="lab-preview lab-hero-icon">${icon("lab")}</div>
      </div>
    </section>
    <div class="lab-layout">
      ${chartHtml}
      <aside class="card lab-controls-card">
        <h2>Controls</h2>
        ${lab.controls(state)}
        <div class="lab-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-lab-reset>${icon("rotate")} Reset lab</button>
          ${lab.dataLabel ? `<button class="btn btn-ghost btn-sm" type="button" data-lab-data>${icon("shuffle")} ${escapeHtml(lab.dataLabel)}</button>` : ""}
        </div>
      </aside>
    </div>
    <div id="labMetrics" class="lab-metrics"></div>
    <div class="grid grid-2">
      <div class="card card-pad">
        <h2 class="section-title">Try this</h2>
        <ul class="lab-try">${(lab.meta.try || []).map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>
      </div>
      <div class="card card-pad">
        <h2 class="section-title">Exam lens</h2>
        <p class="small muted">${escapeHtml(lab.meta.exam)}</p>
        ${lab.meta.note ? `<p class="lab-note">${escapeHtml(lab.meta.note)}</p>` : ""}
      </div>
    </div>
  `;
}

function mountLab(id) {
  const lab = LAB_REGISTRY[id];
  if (!lab) return;
  if (labCleanup) {
    labCleanup();
    labCleanup = null;
  }
  const state = getLabState(id);
  const canvases = (lab.canvases || [{ id: "lab-canvas" }]).map((c) => document.getElementById(c.id)).filter(Boolean);
  const setMetrics = (html) => {
    const el = document.getElementById("labMetrics");
    if (el) el.innerHTML = html;
  };
  const draw = () => {
    if (lab.draw) lab.draw({ state, canvases, setMetrics });
  };
  if (lab.bind) lab.bind({ state, draw, canvases, setMetrics });
  document.querySelectorAll("[data-lab-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.labAction;
      if (lab.actions && lab.actions[name]) lab.actions[name](state, draw);
    });
  });
  const reset = document.querySelector("[data-lab-reset]");
  if (reset) {
    reset.addEventListener("click", () => {
      LAB_STATE[id] = { ...lab.defaults };
      renderPage();
      window.scrollTo(0, 0);
    });
  }
  const dataButton = document.querySelector("[data-lab-data]");
  if (dataButton) {
    dataButton.addEventListener("click", () => {
      if (lab.onData) lab.onData(state);
      else state.seed = (state.seed || 1) + 1;
      draw();
    });
  }
  const ro = new ResizeObserver(() => draw());
  canvases.forEach((canvas) => {
    if (canvas.parentElement) ro.observe(canvas.parentElement);
  });
  draw();
  labCleanup = () => {
    ro.disconnect();
    if (lab.cleanup) lab.cleanup();
  };
}

function rangeRow(id, label, min, max, step, value, opts = {}) {
  const digits = opts.digits ?? 0;
  const suffix = opts.suffix ?? "";
  return `<div class="control">
    <div class="control-label"><span>${escapeHtml(label)}</span><span class="control-value" id="${id}-value">${formatControl(value, digits, suffix)}</span></div>
    <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}" aria-label="${escapeHtml(label)}">
  </div>`;
}

function switchRow(id, label, checked) {
  return `<label class="switch"><input type="checkbox" id="${id}" ${checked ? "checked" : ""}><span class="switch-track"><span class="switch-thumb"></span></span><span>${escapeHtml(label)}</span></label>`;
}

function selectRow(id, label, options, value) {
  return `<div class="control">
    <div class="control-label"><span>${escapeHtml(label)}</span></div>
    <select id="${id}" aria-label="${escapeHtml(label)}">${options.map((o) => `<option value="${escapeHtml(o.value)}" ${o.value === value ? "selected" : ""}>${escapeHtml(o.label)}</option>`).join("")}</select>
  </div>`;
}

function formatControl(value, digits = 0, suffix = "") {
  if (typeof value !== "number") return `${value}${suffix}`;
  const abs = Math.abs(value);
  if (abs >= 1000000) return `${(value / 1000000).toFixed(1)}M${suffix}`;
  if (abs >= 10000) return `${(value / 1000).toFixed(0)}k${suffix}`;
  if (abs >= 1000) return `${(value / 1000).toFixed(1)}k${suffix}`;
  return `${value.toFixed(digits)}${suffix}`;
}

function bindRange(id, state, key, draw, opts = {}) {
  const el = document.getElementById(id);
  const out = document.getElementById(`${id}-value`);
  if (!el) return;
  el.addEventListener("input", () => {
    state[key] = Number(el.value);
    if (out) out.textContent = formatControl(state[key], opts.digits ?? 0, opts.suffix ?? "");
    draw();
  });
}

function bindSwitch(id, state, key, draw) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("change", () => {
    state[key] = el.checked;
    draw();
  });
}

function bindSelect(id, state, key, draw) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("change", () => {
    state[key] = el.value;
    draw();
  });
}

function metricTile(label, value, note = "", accent = false) {
  return `<div class="metric-tile">
    <div class="metric-value ${accent ? "accent" : ""}">${escapeHtml(value)}</div>
    <div class="metric-label">${escapeHtml(label)}</div>
    ${note ? `<div class="metric-note">${escapeHtml(note)}</div>` : ""}
  </div>`;
}

function metricMeter(label, value, max, note = "") {
  const pct = max ? clamp((value / max) * 100, 0, 100) : 0;
  return `<div class="metric-tile">
    <div class="metric-value">${escapeHtml(formatControl(value, 0))}</div>
    <div class="metric-label">${escapeHtml(label)}</div>
    <div class="lab-meter"><span style="width:${pct}%"></span></div>
    ${note ? `<div class="metric-note">${escapeHtml(note)}</div>` : ""}
  </div>`;
}

/* Data helpers */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomNormal(rng) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function sum(values) {
  return values.reduce((a, b) => a + b, 0);
}

function mean(values) {
  return values.length ? sum(values) / values.length : 0;
}

function median(values) {
  if (!values.length) return 0;
  const s = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function variance(values) {
  if (values.length < 2) return 0;
  const m = mean(values);
  return sum(values.map((v) => (v - m) ** 2)) / (values.length - 1);
}

function sd(values) {
  return Math.sqrt(variance(values));
}

function quantileSorted(sorted, p) {
  if (!sorted.length) return 0;
  if (sorted.length === 1) return sorted[0];
  const pos = (sorted.length - 1) * p;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  return sorted[base];
}

function quantile(values, p) {
  return quantileSorted(values.slice().sort((a, b) => a - b), p);
}

function iqr(values) {
  return quantile(values, 0.75) - quantile(values, 0.25);
}

function pearson(xs, ys) {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return 0;
  const mx = mean(xs);
  const my = mean(ys);
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (let i = 0; i < n; i += 1) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }
  if (sxx === 0 || syy === 0) return 0;
  return sxy / Math.sqrt(sxx * syy);
}

function rank(values) {
  const sorted = values.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const ranks = new Array(values.length);
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1].v === sorted[i].v) j += 1;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k += 1) ranks[sorted[k].i] = avg;
    i = j + 1;
  }
  return ranks;
}

function spearman(xs, ys) {
  return pearson(rank(xs), rank(ys));
}

function linreg(points) {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0, rmse: 0, rss: 0, tss: 0, r: 0, sx: 0, sy: 0, sxx: 0, xbar: 0, ybar: 0, s: 0 };
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xbar = mean(xs);
  const ybar = mean(ys);
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  points.forEach((p) => {
    sxx += (p.x - xbar) ** 2;
    sxy += (p.x - xbar) * (p.y - ybar);
    syy += (p.y - ybar) ** 2;
  });
  const slope = sxx ? sxy / sxx : 0;
  const intercept = ybar - slope * xbar;
  const preds = points.map((p) => intercept + slope * p.x);
  const rss = sum(points.map((p, i) => (p.y - preds[i]) ** 2));
  const tss = syy;
  const r2 = tss ? 1 - rss / tss : 0;
  const rmse = Math.sqrt(rss / n);
  const r = sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
  return { slope, intercept, r2, rmse, rss, tss, r, sx: sd(xs), sy: sd(ys), sxx, xbar, ybar, s: n > 2 ? Math.sqrt(rss / (n - 2)) : 0, preds };
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function niceTicks(min, max, count = 5) {
  if (min === max) return [min];
  const span = max - min;
  const raw = span / count;
  const power = Math.pow(10, Math.floor(Math.log10(raw)));
  const error = raw / power;
  let mult = 1;
  if (error >= 7.5) mult = 10;
  else if (error >= 3.5) mult = 5;
  else if (error >= 1.5) mult = 2;
  const step = mult * power;
  const start = Math.ceil(min / step) * step;
  const ticks = [];
  for (let v = start; v <= max + step * 0.001; v += step) ticks.push(Number(v.toFixed(10)));
  return ticks;
}

function formatTick(value) {
  const abs = Math.abs(value);
  if (abs >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${(value / 1000).toFixed(abs >= 10000 ? 0 : 1)}k`;
  if (abs >= 10) return value.toFixed(0);
  if (abs >= 1) return value.toFixed(1);
  return value.toFixed(2);
}

/* Canvas helpers */
function setupCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(1, rect.width);
  const h = Math.max(1, rect.height);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  return { ctx, w, h };
}

function chartFrame(w, h, opts = {}) {
  const left = opts.left ?? 56;
  const right = opts.right ?? 20;
  const top = opts.top ?? 22;
  const bottom = opts.bottom ?? 40;
  return { left, top, right, bottom, width: Math.max(1, w - left - right), height: Math.max(1, h - top - bottom) };
}

function mapX(value, domain, plot) {
  return plot.left + ((value - domain[0]) / (domain[1] - domain[0] || 1)) * plot.width;
}

function mapY(value, domain, plot) {
  return plot.top + plot.height - ((value - domain[0]) / (domain[1] - domain[0] || 1)) * plot.height;
}

function drawGrid(ctx, w, h, xDomain, yDomain, opts = {}) {
  const plot = chartFrame(w, h, opts.frame);
  ctx.save();
  ctx.strokeStyle = LAB_COLORS.grid;
  ctx.lineWidth = 1;
  ctx.fillStyle = LAB_COLORS.muted2;
  ctx.font = "10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const xTicks = opts.xTicks || niceTicks(xDomain[0], xDomain[1], 5);
  const yTicks = opts.yTicks || niceTicks(yDomain[0], yDomain[1], 5);
  xTicks.forEach((t) => {
    const x = mapX(t, xDomain, plot);
    ctx.beginPath();
    ctx.moveTo(x, plot.top);
    ctx.lineTo(x, plot.top + plot.height);
    ctx.stroke();
    ctx.fillText(formatTick(t), x, plot.top + plot.height + 8);
  });
  yTicks.forEach((t) => {
    const y = mapY(t, yDomain, plot);
    ctx.beginPath();
    ctx.moveTo(plot.left, y);
    ctx.lineTo(plot.left + plot.width, y);
    ctx.stroke();
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(formatTick(t), plot.left - 8, y);
  });
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.moveTo(plot.left, plot.top + plot.height);
  ctx.lineTo(plot.left + plot.width, plot.top + plot.height);
  ctx.moveTo(plot.left, plot.top);
  ctx.lineTo(plot.left, plot.top + plot.height);
  ctx.stroke();
  if (opts.xLabel) {
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = LAB_COLORS.muted;
    ctx.font = "10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    ctx.fillText(opts.xLabel, plot.left + plot.width / 2, h - 4);
  }
  if (opts.yLabel) {
    ctx.save();
    ctx.translate(12, plot.top + plot.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = LAB_COLORS.muted;
    ctx.font = "10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    ctx.fillText(opts.yLabel, 0, 0);
    ctx.restore();
  }
  ctx.restore();
  return plot;
}

function drawSegment(ctx, plot, x1, y1, x2, y2, color, width = 2, dash = []) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawCircle(ctx, x, y, r, fill, stroke = null, width = 1) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.stroke();
  }
  ctx.restore();
}

function drawText(ctx, text, x, y, color = LAB_COLORS.text, font = "11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", align = "left", baseline = "middle") {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawBandWithY(ctx, plot, xDomain, yDomain, xs, lower, upper, fill) {
  ctx.save();
  ctx.beginPath();
  xs.forEach((x, i) => {
    const px = mapX(x, xDomain, plot);
    const py = mapY(upper[i], yDomain, plot);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  for (let i = xs.length - 1; i >= 0; i -= 1) {
    ctx.lineTo(mapX(xs[i], xDomain, plot), mapY(lower[i], yDomain, plot));
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
}

function drawLegend(ctx, items, x, y) {
  ctx.save();
  ctx.font = "10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textBaseline = "middle";
  let cx = x;
  items.forEach((item) => {
    drawCircle(ctx, cx, y, 4, item.color);
    ctx.fillStyle = LAB_COLORS.muted;
    ctx.textAlign = "left";
    ctx.fillText(item.label, cx + 8, y);
    cx += ctx.measureText(item.label).width + 28;
  });
  ctx.restore();
}

function withAlpha(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}
