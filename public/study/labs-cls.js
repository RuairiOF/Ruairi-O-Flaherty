registerLab("classification", {
  meta: {
    topic: "cls",
    title: "The threshold, the confusion matrix and ROC",
    blurb: "Move the cut-off. Every confusion matrix cell, metric and ROC point updates. Then make the positive class rare and watch accuracy lie to you.",
    time: "8 min",
    examShort: "Classification metrics",
    exam: "Accuracy, precision, recall and specificity come from the four confusion matrix cells. Lowering the threshold usually raises recall and lowers precision. ROC plots true positive rate against false positive rate, and AUC summarises it. Accuracy is misleading on imbalanced data.",
    note: "Precision is TP divided by TP plus FP. Recall is TP divided by TP plus FN. Specificity is TN divided by TN plus FP. Do not mix them up under time pressure.",
    try: [
      "Set prevalence to 5% and press Predict all negative. Accuracy is high, recall is zero. That is the accuracy trap.",
      "Lower the threshold. Recall rises, precision usually falls. Watch the ROC point move.",
      "Increase separation. The classes overlap less and AUC rises.",
      "Find the threshold that maximises F1. Compare it with the threshold that maximises recall."
    ]
  },
  defaults: { threshold: 0.5, separation: 2, prevalence: 0.3, seed: 1 },
  canvases: [
    { id: "cls-scores", title: "Scores by class" },
    { id: "cls-roc", title: "ROC curve" }
  ],
  controls(state) {
    return `${rangeRow("cl-threshold", "Threshold", 0.01, 1, 0.01, state.threshold, { digits: 2 })}
      ${rangeRow("cl-separation", "Class separation", 0.4, 4, 0.1, state.separation, { digits: 1 })}
      ${rangeRow("cl-prevalence", "Prevalence of positives", 0.05, 0.5, 0.01, state.prevalence, { digits: 2 })}
      <button class="btn btn-ghost btn-sm btn-wide" type="button" data-lab-action="all-negative" style="margin-top:2px;">${icon("flag")} Predict all negative</button>`;
  },
  bind({ state, draw }) {
    bindRange("cl-threshold", state, "threshold", draw, { digits: 2 });
    bindRange("cl-separation", state, "separation", draw, { digits: 1 });
    bindRange("cl-prevalence", state, "prevalence", draw, { digits: 2 });
  },
  dataLabel: "New sample",
  onData(state) { state.seed = (state.seed || 1) + 1; },
  actions: {
    "all-negative"(state, draw) {
      state.threshold = 1;
      const el = document.getElementById("cl-threshold");
      const out = document.getElementById("cl-threshold-value");
      if (el) el.value = 1;
      if (out) out.textContent = "1.00";
      draw();
    }
  },
  draw({ state, canvases, setMetrics }) {
    const data = classificationData(state);
    const threshold = state.threshold;
    let tp = 0;
    let fp = 0;
    let fn = 0;
    let tn = 0;
    data.forEach((d) => {
      const predicted = d.score >= threshold ? 1 : 0;
      if (d.label === 1 && predicted === 1) tp += 1;
      else if (d.label === 0 && predicted === 1) fp += 1;
      else if (d.label === 1 && predicted === 0) fn += 1;
      else tn += 1;
    });
    const total = data.length;
    const accuracy = (tp + tn) / total;
    const precision = tp + fp ? tp / (tp + fp) : 0;
    const recall = tp + fn ? tp / (tp + fn) : 0;
    const specificity = tn + fp ? tn / (tn + fp) : 0;
    const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
    const roc = rocCurve(data);
    const auc = aucFromCurve(roc);

    drawScoreChart(canvases[0], data, threshold, state.seed);
    drawRocChart(canvases[1], roc, auc, recall, 1 - specificity);

    const prevalence = data.filter((d) => d.label === 1).length / total;
    const accuracyTrap = (prevalence <= 0.15 && accuracy >= 0.7 && recall < 0.6) || (recall === 0 && accuracy >= 0.6);
    const warning = accuracyTrap
      ? `<div class="lab-warning">${icon("info")}<span>Accuracy is high because the negative class dominates. A model that predicts all negative gets high accuracy and zero recall. Use precision, recall, F1 and AUC instead.</span></div>`
      : "";
    setMetrics(
      warning +
      metricTile("True positives", String(tp), "Correct positives", false) +
      metricTile("False positives", String(fp), "False alarms", false) +
      metricTile("False negatives", String(fn), "Missed positives", false) +
      metricTile("True negatives", String(tn), "Correct negatives", false) +
      metricTile("Accuracy", (accuracy * 100).toFixed(0) + "%", "All correct", false) +
      metricTile("Precision", precision.toFixed(2), "TP / (TP + FP)", false) +
      metricTile("Recall", recall.toFixed(2), "TP / (TP + FN)", true) +
      metricTile("Specificity", specificity.toFixed(2), "TN / (TN + FP)", false) +
      metricTile("F1", f1.toFixed(2), "Balances P and R", false) +
      metricTile("AUC", auc.toFixed(2), "Threshold independent", true) +
      metricTile("Prevalence", (prevalence * 100).toFixed(0) + "%", "Positives in the data", false) +
      metricTile("Threshold", threshold.toFixed(2), "Current cut-off", false)
    );
  }
});

function classificationData(state) {
  const total = 260;
  const prevalence = clamp(state.prevalence, 0.02, 0.9);
  const positives = Math.max(6, Math.round(total * prevalence));
  const negatives = Math.max(6, total - positives);
  const shift = state.separation / 2;
  const rng = mulberry32(4200 + state.seed * 37);
  const data = [];
  for (let i = 0; i < negatives; i += 1) {
    data.push({ score: sigmoid(randomNormal(rng) - shift), label: 0 });
  }
  for (let i = 0; i < positives; i += 1) {
    data.push({ score: sigmoid(randomNormal(rng) + shift), label: 1 });
  }
  return data;
}

function rocCurve(data) {
  const thresholds = [];
  for (let t = 0; t <= 1.0001; t += 0.002) thresholds.push(t);
  const points = thresholds.map((t) => {
    let tp = 0;
    let fp = 0;
    let fn = 0;
    let tn = 0;
    data.forEach((d) => {
      const predicted = d.score >= t ? 1 : 0;
      if (d.label === 1 && predicted === 1) tp += 1;
      else if (d.label === 0 && predicted === 1) fp += 1;
      else if (d.label === 1 && predicted === 0) fn += 1;
      else tn += 1;
    });
    return { tpr: tp + fn ? tp / (tp + fn) : 0, fpr: fp + tn ? fp / (fp + tn) : 0 };
  });
  points.push({ fpr: 0, tpr: 0 });
  points.push({ fpr: 1, tpr: 1 });
  points.sort((a, b) => a.fpr - b.fpr || a.tpr - b.tpr);
  const unique = [];
  points.forEach((p) => {
    if (!unique.length || Math.abs(p.fpr - unique[unique.length - 1].fpr) > 1e-6 || Math.abs(p.tpr - unique[unique.length - 1].tpr) > 1e-6) unique.push(p);
  });
  return unique;
}

function aucFromCurve(points) {
  let area = 0;
  for (let i = 1; i < points.length; i += 1) {
    area += (points[i].fpr - points[i - 1].fpr) * (points[i].tpr + points[i - 1].tpr) / 2;
  }
  return clamp(area, 0, 1);
}

function drawScoreChart(canvas, data, threshold, seed) {
  const { ctx, w, h } = setupCanvas(canvas);
  const xDomain = [0, 1];
  const yDomain = [0, 1];
  const plot = drawGrid(ctx, w, h, xDomain, yDomain, { xLabel: "Predicted probability", yTicks: [], bottom: 40, left: 82 });
  ctx.save();
  ctx.fillStyle = "rgba(56,217,201,0.045)";
  const xThreshold = mapX(threshold, xDomain, plot);
  ctx.fillRect(xThreshold, plot.top, plot.left + plot.width - xThreshold, plot.height);
  ctx.restore();

  const rng = mulberry32(seed * 101 + 7);
  data.forEach((d) => {
    const predicted = d.score >= threshold ? 1 : 0;
    let color;
    if (d.label === 1 && predicted === 1) color = LAB_COLORS.green;
    else if (d.label === 0 && predicted === 1) color = LAB_COLORS.red;
    else if (d.label === 1 && predicted === 0) color = LAB_COLORS.amber;
    else color = LAB_COLORS.muted2;
    const baseY = d.label === 1 ? 0.64 : 0.36;
    const y = baseY + (rng() - 0.5) * 0.20;
    drawCircle(ctx, mapX(d.score, xDomain, plot), mapY(y, yDomain, plot), 3.4, withAlpha(color, 0.85), null, 0);
  });

  drawText(ctx, "Negative class", plot.left - 10, mapY(0.36, yDomain, plot), LAB_COLORS.muted, "10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "right");
  drawText(ctx, "Positive class", plot.left - 10, mapY(0.64, yDomain, plot), LAB_COLORS.muted, "10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "right");
  ctx.save();
  ctx.strokeStyle = LAB_COLORS.text;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(xThreshold, plot.top);
  ctx.lineTo(xThreshold, plot.top + plot.height);
  ctx.stroke();
  ctx.restore();
  drawText(ctx, `threshold ${threshold.toFixed(2)}`, xThreshold, plot.top - 10, LAB_COLORS.text, "600 10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "center");
  drawText(ctx, "predicted negative", mapX(0.5, xDomain, plot) - 50, plot.top + 12, LAB_COLORS.muted2, "9.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "center");
  drawText(ctx, "predicted positive", mapX(0.5, xDomain, plot) + 90, plot.top + 12, LAB_COLORS.cyan, "9.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "center");
  drawLegend(ctx, [
    { label: "TP", color: LAB_COLORS.green },
    { label: "FP", color: LAB_COLORS.red },
    { label: "FN", color: LAB_COLORS.amber },
    { label: "TN", color: LAB_COLORS.muted2 }
  ], plot.left + 8, plot.top + plot.height - 12);
}

function drawRocChart(canvas, roc, auc, recall, fpr) {
  const { ctx, w, h } = setupCanvas(canvas);
  const xDomain = [0, 1];
  const yDomain = [0, 1];
  const plot = drawGrid(ctx, w, h, xDomain, yDomain, { xLabel: "False positive rate", yLabel: "True positive rate", xTicks: [0, 0.2, 0.4, 0.6, 0.8, 1], yTicks: [0, 0.2, 0.4, 0.6, 0.8, 1] });
  drawSegment(ctx, plot, mapX(0, xDomain, plot), mapY(0, yDomain, plot), mapX(1, xDomain, plot), mapY(1, yDomain, plot), "rgba(255,255,255,0.18)", 1.5, [5, 5]);

  ctx.save();
  ctx.beginPath();
  roc.forEach((p, i) => {
    const x = mapX(p.fpr, xDomain, plot);
    const y = mapY(p.tpr, yDomain, plot);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(mapX(1, xDomain, plot), mapY(0, yDomain, plot));
  ctx.closePath();
  ctx.fillStyle = withAlpha(LAB_COLORS.cyan, 0.08);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = LAB_COLORS.cyan;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  roc.forEach((p, i) => {
    const x = mapX(p.fpr, xDomain, plot);
    const y = mapY(p.tpr, yDomain, plot);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.restore();

  drawCircle(ctx, mapX(fpr, xDomain, plot), mapY(recall, yDomain, plot), 5.5, LAB_COLORS.amber, "#0b1220", 2);
  drawText(ctx, `AUC ${auc.toFixed(2)}`, plot.left + plot.width - 8, plot.top + 12, LAB_COLORS.cyan, "600 12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "right");
  drawText(ctx, `current point (${fpr.toFixed(2)}, ${recall.toFixed(2)})`, plot.left + plot.width - 8, plot.top + 28, LAB_COLORS.muted2, "9.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "right");
}
