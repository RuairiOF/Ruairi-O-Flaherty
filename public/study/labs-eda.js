registerLab("mean-median", {
  meta: {
    topic: "eda",
    title: "The outlier and the mean",
    blurb: "Drag one extreme salary and watch the mean chase it while the median barely moves. This is the robustness idea the exam keeps asking about.",
    time: "4 min",
    examShort: "Robust location",
    exam: "Know which measure of location is robust, why the mean is sensitive to skew and outliers, and when to report the median and IQR.",
    note: "If a question says robust, think median, trimmed mean or IQR. If it says use every value, think mean.",
    try: [
      "Drag the outlier from 20k to 500k. Watch the mean and median. Which one moves?",
      "Turn skew on. The mean sits above the median because the right tail pulls it.",
      "Turn the trimmed mean on. It sits between the mean and the median, and it is less affected by the outlier."
    ]
  },
  defaults: { outlier: 220000, skew: false, showTrimmed: true, seed: 1 },
  controls(state) {
    return `${rangeRow("mm-outlier", "Outlier salary", 20000, 500000, 5000, state.outlier, { digits: 0 })}
      ${switchRow("mm-skew", "Add a right skew", state.skew)}
      ${switchRow("mm-trimmed", "Show 10% trimmed mean", state.showTrimmed)}`;
  },
  bind({ state, draw }) {
    bindRange("mm-outlier", state, "outlier", draw, { digits: 0 });
    bindSwitch("mm-skew", state, "skew", draw);
    bindSwitch("mm-trimmed", state, "showTrimmed", draw);
  },
  dataLabel: "New salary sample",
  onData(state) { state.seed = (state.seed || 1) + 1; },
  draw({ state, canvases, setMetrics }) {
    const values = salaryValues(state);
    const sorted = values.slice().sort((a, b) => a - b);
    const meanValue = mean(values);
    const medianValue = median(values);
    const trimmed = trimmedMean(values, 0.1);
    const sdValue = sd(values);
    const q1 = quantile(values, 0.25);
    const q3 = quantile(values, 0.75);
    const { ctx, w, h } = setupCanvas(canvases[0]);
    const maxValue = Math.max(550000, state.outlier * 1.12);
    const xDomain = [0, maxValue];
    const plot = chartFrame(w, h, { left: 34, right: 20, top: 58, bottom: 44 });
    const baseY = plot.top + plot.height * 0.52;

    ctx.save();
    const iqrX1 = mapX(q1, xDomain, plot);
    const iqrX2 = mapX(q3, xDomain, plot);
    ctx.fillStyle = withAlpha(LAB_COLORS.violet, 0.08);
    ctx.fillRect(iqrX1, plot.top, iqrX2 - iqrX1, plot.height);
    ctx.restore();

    drawGrid(ctx, w, h, xDomain, [0, 1], {
      frame: { left: 34, right: 20, top: 58, bottom: 44 },
      yTicks: [],
      xLabel: "Salary (euro)",
      xTicks: niceTicks(0, maxValue, 6)
    });

    ctx.save();
    const rng = mulberry32(77 + state.seed);
    values.forEach((value, index) => {
      const x = mapX(value, xDomain, plot);
      const jitter = (rng() - 0.5) * 62;
      const y = baseY + jitter;
      const isOutlier = value === state.outlier && index === values.length - 1;
      drawCircle(ctx, x, y, isOutlier ? 7 : 5, isOutlier ? withAlpha(LAB_COLORS.amber, 0.95) : withAlpha(LAB_COLORS.muted, 0.75), isOutlier ? LAB_COLORS.amber : "rgba(255,255,255,0.35)", 1.5);
      if (isOutlier) {
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.strokeStyle = withAlpha(LAB_COLORS.amber, 0.35);
        ctx.lineWidth = 1;
        ctx.stroke();
        drawText(ctx, "Outlier", x + 14, y - 16, LAB_COLORS.amber, "10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif");
      }
    });
    ctx.restore();

    const lines = [
      { value: meanValue, color: LAB_COLORS.violet, label: "Mean" },
      { value: medianValue, color: LAB_COLORS.cyan, label: "Median" }
    ];
    if (state.showTrimmed) lines.push({ value: trimmed, color: LAB_COLORS.lime, label: "Trimmed" });
    lines.forEach((line, index) => {
      const x = mapX(line.value, xDomain, plot);
      ctx.save();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 2;
      ctx.setLineDash(index === 0 ? [] : [5, 5]);
      ctx.beginPath();
      ctx.moveTo(x, plot.top + 8);
      ctx.lineTo(x, plot.top + plot.height);
      ctx.stroke();
      ctx.restore();
    });

    const legendItems = [
      { label: `Mean ${formatControl(meanValue, 0)}`, color: LAB_COLORS.violet },
      { label: `Median ${formatControl(medianValue, 0)}`, color: LAB_COLORS.cyan }
    ];
    if (state.showTrimmed) legendItems.push({ label: `Trimmed ${formatControl(trimmed, 0)}`, color: LAB_COLORS.lime });
    drawLegend(ctx, legendItems, plot.left + plot.width - 250, plot.top + 10);
    drawText(ctx, `n = ${values.length}`, plot.left + plot.width - 6, plot.top + plot.height - 8, LAB_COLORS.muted2, "10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "right");
    drawText(ctx, "IQR shaded", plot.left + plot.width - 6, plot.top + plot.height - 24, withAlpha(LAB_COLORS.violet, 0.85), "9.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "right");

    setMetrics(
      metricTile("Mean", formatControl(meanValue, 0), "Uses every value", true) +
      metricTile("Median", formatControl(medianValue, 0), "Middle value", false) +
      metricTile("Trimmed mean", state.showTrimmed ? formatControl(trimmed, 0) : "Off", "10% each tail", false) +
      metricTile("Mean - median", formatControl(meanValue - medianValue, 0), "The outlier effect", false) +
      metricTile("Standard deviation", formatControl(sdValue, 0), "Sensitive to the tail", false) +
      metricTile("IQR", formatControl(q3 - q1, 0), "Middle 50%", false) +
      metricTile("Range", formatControl(Math.max(...values) - Math.min(...values), 0), "Max minus min", false) +
      metricTile("Outlier", formatControl(state.outlier, 0), "One record", false)
    );
  }
});

registerLab("spread", {
  meta: {
    topic: "eda",
    title: "Spread, variance and the boxplot",
    blurb: "Stretch the data and watch variance grow with the square of the spread. Then add an outlier and see why the IQR is the robust measure.",
    time: "5 min",
    examShort: "Variability",
    exam: "Variance uses n minus 1 and squared units. Standard deviation returns to the original units. IQR is robust. A boxplot shows median, quartiles, whiskers and outliers.",
    note: "The exam may give you Q1 and Q3 and ask for the IQR, or give a boxplot and ask what it shows. Keep the four parts straight.",
    try: [
      "Double the spread. Standard deviation doubles, variance quadruples.",
      "Add the outlier. The range jumps, the IQR barely moves.",
      "Turn on deviations. The squared deviations are what variance averages."
    ]
  },
  defaults: { spread: 1, outlier: false, deviations: false, seed: 1 },
  controls(state) {
    return `${rangeRow("sp-spread", "Spread multiplier", 0.4, 2.5, 0.05, state.spread, { digits: 2, suffix: "x" })}
      ${switchRow("sp-outlier", "Add one extreme outlier", state.outlier)}
      ${switchRow("sp-deviations", "Show deviations from the mean", state.deviations)}`;
  },
  bind({ state, draw }) {
    bindRange("sp-spread", state, "spread", draw, { digits: 2, suffix: "x" });
    bindSwitch("sp-outlier", state, "outlier", draw);
    bindSwitch("sp-deviations", state, "deviations", draw);
  },
  dataLabel: "New sample",
  onData(state) { state.seed = (state.seed || 1) + 1; },
  draw({ state, canvases, setMetrics }) {
    const rng = mulberry32(500 + state.seed * 13);
    const values = [];
    for (let i = 0; i < 21; i += 1) values.push(clamp(50 + randomNormal(rng) * 8 * state.spread, 5, 95));
    if (state.outlier) values.push(150);
    const sorted = values.slice().sort((a, b) => a - b);
    const meanValue = mean(values);
    const sdValue = sd(values);
    const q1 = quantile(values, 0.25);
    const medianValue = median(values);
    const q3 = quantile(values, 0.75);
    const lowWhisker = Math.max(sorted[0], q1 - 1.5 * (q3 - q1));
    const highWhisker = Math.min(sorted[sorted.length - 1], q3 + 1.5 * (q3 - q1));
    const xDomain = [0, 160];
    const { ctx, w, h } = setupCanvas(canvases[0]);
    const plot = chartFrame(w, h, { left: 34, right: 20, top: 24, bottom: 44 });
    const dotBandTop = plot.top + 18;
    const dotBandBottom = plot.top + plot.height * 0.54;
    const boxY = plot.top + plot.height * 0.78;

    drawGrid(ctx, w, h, xDomain, [0, 1], {
      frame: { left: 34, right: 20, top: 24, bottom: 44 },
      yTicks: [],
      xLabel: "Value",
      xTicks: niceTicks(0, 160, 6)
    });

    const meanX = mapX(meanValue, xDomain, plot);
    const sd1 = mapX(meanValue - sdValue, xDomain, plot);
    const sd2 = mapX(meanValue + sdValue, xDomain, plot);
    ctx.save();
    ctx.fillStyle = withAlpha(LAB_COLORS.cyan, 0.07);
    ctx.fillRect(sd1, dotBandTop - 6, sd2 - sd1, dotBandBottom - dotBandTop + 12);
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = withAlpha(LAB_COLORS.cyan, 0.35);
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(meanX, dotBandTop - 8);
    ctx.lineTo(meanX, boxY + 22);
    ctx.stroke();
    ctx.restore();
    drawText(ctx, "Mean", meanX, dotBandTop - 16, LAB_COLORS.cyan, "600 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "center");

    const jitterRng = mulberry32(900 + state.seed);
    values.forEach((value) => {
      const x = mapX(value, xDomain, plot);
      const y = dotBandTop + jitterRng() * (dotBandBottom - dotBandTop);
      if (state.deviations) {
        ctx.save();
        ctx.strokeStyle = withAlpha(LAB_COLORS.violet, 0.18);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, boxY - 18);
        ctx.stroke();
        ctx.restore();
      }
      drawCircle(ctx, x, y, 4.5, withAlpha(LAB_COLORS.muted, 0.75), "rgba(255,255,255,0.3)", 1);
    });

    const boxLeft = mapX(q1, xDomain, plot);
    const boxRight = mapX(q3, xDomain, plot);
    const medianX = mapX(medianValue, xDomain, plot);
    ctx.save();
    ctx.fillStyle = withAlpha(LAB_COLORS.violet, 0.18);
    ctx.strokeStyle = LAB_COLORS.violet;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(boxLeft, boxY - 14, boxRight - boxLeft, 28, 5);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(medianX, boxY - 14);
    ctx.lineTo(medianX, boxY + 14);
    ctx.strokeStyle = LAB_COLORS.cyan;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mapX(lowWhisker, xDomain, plot), boxY);
    ctx.lineTo(boxLeft, boxY);
    ctx.moveTo(boxRight, boxY);
    ctx.lineTo(mapX(highWhisker, xDomain, plot), boxY);
    ctx.strokeStyle = LAB_COLORS.muted;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mapX(lowWhisker, xDomain, plot), boxY - 8);
    ctx.lineTo(mapX(lowWhisker, xDomain, plot), boxY + 8);
    ctx.moveTo(mapX(highWhisker, xDomain, plot), boxY - 8);
    ctx.lineTo(mapX(highWhisker, xDomain, plot), boxY + 8);
    ctx.stroke();
    ctx.restore();
    drawText(ctx, "Box = Q1 to Q3  ·  line = median  ·  whiskers = 1.5 IQR", plot.left + plot.width / 2, boxY + 30, LAB_COLORS.muted2, "9.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "center");
    drawText(ctx, "Boxplot", plot.left + 2, boxY - 28, LAB_COLORS.muted2, "10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif");

    setMetrics(
      metricTile("Mean", formatControl(meanValue, 1), "Location", true) +
      metricTile("Variance", formatControl(variance(values), 1), "Squared units", false) +
      metricTile("Standard deviation", formatControl(sdValue, 1), "Original units", false) +
      metricTile("IQR", formatControl(q3 - q1, 1), "Middle 50%", false) +
      metricTile("Range", formatControl(Math.max(...values) - Math.min(...values), 1), "Max minus min", false) +
      metricTile("Q1", formatControl(q1, 1), "25th percentile", false) +
      metricTile("Q3", formatControl(q3, 1), "75th percentile", false) +
      metricTile("n", String(values.length), "Records", false)
    );
  }
});

registerLab("correlation", {
  meta: {
    topic: "eda",
    title: "Correlation, outliers and the lurking variable",
    blurb: "A scatterplot is not a causal diagram. Add an outlier, then turn on a confounder and watch a strong correlation appear with no direct link.",
    time: "5 min",
    examShort: "Correlation",
    exam: "Pearson r runs from minus 1 to plus 1 and measures linear association. It is sensitive to outliers. Spearman uses ranks. Correlation does not imply causation, and a third variable can drive both.",
    note: "If the exam says linear association, Pearson. If it says monotonic or rank, Spearman. If it says causation, slow down.",
    try: [
      "Set strength to 0.9, then add the outlier. Pearson drops sharply. Spearman holds up better.",
      "Turn on the confounder. The correlation stays strong, but the colour shows that z drives both x and y.",
      "Set strength to 0. What happens to the regression line? It goes flat, even if the points still have structure."
    ]
  },
  defaults: { strength: 0.8, outlier: false, confounder: false, seed: 1 },
  controls(state) {
    return `${rangeRow("co-strength", "Relationship strength", 0, 1, 0.05, state.strength, { digits: 2 })}
      ${switchRow("co-outlier", "Add one outlier", state.outlier)}
      ${switchRow("co-confounder", "Add a lurking variable z", state.confounder)}`;
  },
  bind({ state, draw }) {
    bindRange("co-strength", state, "strength", draw, { digits: 2 });
    bindSwitch("co-outlier", state, "outlier", draw);
    bindSwitch("co-confounder", state, "confounder", draw);
  },
  dataLabel: "New sample",
  onData(state) { state.seed = (state.seed || 1) + 1; },
  draw({ state, canvases, setMetrics }) {
    const rng = mulberry32(700 + state.seed * 19);
    const points = [];
    if (state.confounder) {
      for (let i = 0; i < 55; i += 1) {
        const z = rng();
        const noise = (1 - state.strength) * 2.4 + 0.18;
        const x = clamp(1.2 + 7.6 * z + randomNormal(rng) * noise, 0.2, 9.8);
        const y = clamp(1.2 + 7.6 * z + randomNormal(rng) * noise, 0.2, 9.8);
        points.push({ x, y, z });
      }
    } else {
      for (let i = 0; i < 55; i += 1) {
        const x = 0.5 + rng() * 9;
        const noise = (1 - state.strength) * 3.2 + 0.25;
        const y = clamp(1.2 + state.strength * 0.85 * x + randomNormal(rng) * noise, 0.2, 9.8);
        points.push({ x, y, z: null });
      }
    }
    if (state.outlier) points.push({ x: 9.4, y: 0.8, z: null, outlier: true });
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const r = pearson(xs, ys);
    const rho = spearman(xs, ys);
    const fit = linreg(points.map((p) => ({ x: p.x, y: p.y })));
    const { ctx, w, h } = setupCanvas(canvases[0]);
    const xDomain = [0, 10];
    const yDomain = [0, 10];
    const plot = drawGrid(ctx, w, h, xDomain, yDomain, { xLabel: "x", yLabel: "y", xTicks: [0, 2, 4, 6, 8, 10], yTicks: [0, 2, 4, 6, 8, 10] });

    if (state.confounder) {
      points.forEach((p) => {
        const color = p.z === null ? LAB_COLORS.muted : mixHex(LAB_COLORS.cyan, LAB_COLORS.amber, p.z);
        drawCircle(ctx, mapX(p.x, xDomain, plot), mapY(p.y, yDomain, plot), 4.2, withAlpha(color, 0.85), withAlpha(color, 0.95), 1);
      });
      drawLegend(ctx, [{ label: "z low", color: LAB_COLORS.cyan }, { label: "z high", color: LAB_COLORS.amber }], plot.left + 10, plot.top + 12);
    } else {
      points.forEach((p) => {
        drawCircle(ctx, mapX(p.x, xDomain, plot), mapY(p.y, yDomain, plot), p.outlier ? 6 : 4.2, p.outlier ? withAlpha(LAB_COLORS.amber, 0.95) : withAlpha(LAB_COLORS.violet, 0.7), p.outlier ? LAB_COLORS.amber : "rgba(255,255,255,0.3)", 1);
        if (p.outlier) {
          ctx.save();
          ctx.strokeStyle = withAlpha(LAB_COLORS.amber, 0.35);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(mapX(p.x, xDomain, plot), mapY(p.y, yDomain, plot), 12, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
          drawText(ctx, "Outlier", mapX(p.x, xDomain, plot) - 12, mapY(p.y, yDomain, plot) - 18, LAB_COLORS.amber, "10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "right");
        }
      });
    }

    const x1 = 0;
    const y1 = fit.intercept + fit.slope * x1;
    const x2 = 10;
    const y2 = fit.intercept + fit.slope * x2;
    drawSegment(ctx, plot, mapX(x1, xDomain, plot), mapY(y1, yDomain, plot), mapX(x2, xDomain, plot), mapY(y2, yDomain, plot), withAlpha(LAB_COLORS.text, 0.65), 2, [6, 5]);
    drawText(ctx, `r = ${r.toFixed(2)}`, plot.left + plot.width - 10, plot.top + 14, LAB_COLORS.text, "600 12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "right");

    setMetrics(
      metricTile("Pearson r", r.toFixed(2), "Linear association", true) +
      metricTile("Spearman rho", rho.toFixed(2), "Rank association", false) +
      metricTile("Slope", fit.slope.toFixed(2), "Y per unit x", false) +
      metricTile("R squared", fit.r2.toFixed(2), "Variance explained", false) +
      metricTile("Points", String(points.length), "Records", false) +
      metricTile("Outlier", state.outlier ? "On" : "Off", "One extreme point", false) +
      metricTile("Confounder", state.confounder ? "On" : "Off", "z drives x and y", false) +
      metricTile("Causation", "Not proven", "Correlation is not causation", false)
    );
  }
});

function salaryValues(state) {
  const rng = mulberry32(1200 + state.seed * 17);
  const values = [];
  for (let i = 0; i < 18; i += 1) values.push(clamp(38000 + randomNormal(rng) * 7000, 22000, 65000));
  if (state.skew) {
    for (let i = 0; i < 5; i += 1) values.push(52000 + Math.abs(randomNormal(rng)) * 22000);
  }
  values.push(state.outlier);
  return values;
}

function trimmedMean(values, proportion) {
  const sorted = values.slice().sort((a, b) => a - b);
  const trim = Math.floor(sorted.length * proportion);
  const kept = sorted.slice(trim, sorted.length - trim);
  return mean(kept);
}

function mixHex(hexA, hexB, t) {
  const a = parseInt(hexA.slice(1), 16);
  const b = parseInt(hexB.slice(1), 16);
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}
