registerLab("knn", {
  meta: {
    topic: "ml",
    title: "KNN, K and the scale trap",
    blurb: "Drag the test point. Change K. Then turn standardisation off and watch Feature 2 hijack the distance because its range is ten times larger.",
    time: "7 min",
    examShort: "KNN and scaling",
    exam: "KNN classifies by the majority class of the K nearest records. It requires numeric input and standardisation when features have different scales. Small K overfits, large K oversmooths. Odd K avoids ties.",
    note: "If the exam asks why standardise before KNN, the answer is scale. A feature measured in euro can dominate one measured in years.",
    try: [
      "Turn standardisation off. The boundary is dominated by Feature 2. Turn it on and Feature 1 separates the classes.",
      "Set K = 1. The boundary is jagged and local. Increase K and it smooths out.",
      "Drag the star into the overlap. Watch the vote split between the classes.",
      "Switch between Euclidean and Manhattan distance. The neighbourhood changes slightly."
    ]
  },
  defaults: { k: 7, standardise: false, metric: "euclidean", testX: 5, testY: 50, seed: 1 },
  controls(state) {
    return `${rangeRow("kn-k", "K neighbours", 1, 25, 1, state.k, { digits: 0 })}
      ${switchRow("kn-standardise", "Standardise the features", state.standardise)}
      ${selectRow("kn-metric", "Distance metric", [{ value: "euclidean", label: "Euclidean" }, { value: "manhattan", label: "Manhattan" }], state.metric)}`;
  },
  bind({ state, draw, canvases }) {
    bindRange("kn-k", state, "k", draw, { digits: 0 });
    bindSwitch("kn-standardise", state, "standardise", draw);
    bindSelect("kn-metric", state, "metric", draw);
    const canvas = canvases[0];
    if (!canvas) return;
    let dragging = false;
    const updateFromPointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      const plot = chartFrame(rect.width, rect.height, { left: 56, right: 20, top: 22, bottom: 40 });
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      state.testX = clamp(((px - plot.left) / plot.width) * 10, 0, 10);
      state.testY = clamp((1 - (py - plot.top) / plot.height) * 100, 0, 100);
      draw();
    };
    canvas.addEventListener("pointerdown", (event) => {
      dragging = true;
      canvas.setPointerCapture(event.pointerId);
      updateFromPointer(event);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (dragging) updateFromPointer(event);
    });
    canvas.addEventListener("pointerup", () => { dragging = false; });
    canvas.addEventListener("pointercancel", () => { dragging = false; });
  },
  dataLabel: "New sample",
  onData(state) { state.seed = (state.seed || 1) + 1; },
  draw({ state, canvases, setMetrics }) {
    const points = knnData(state.seed);
    const stats = knnStats(points);
    const test = { x: state.testX, y: state.testY };
    const result = knnClassify(points, test, state.k, state.standardise, state.metric, stats);
    const loo = knnLeaveOneOut(points, state.k, state.standardise, state.metric);
    const { ctx, w, h } = setupCanvas(canvases[0]);
    const xDomain = [0, 10];
    const yDomain = [0, 100];
    const plot = chartFrame(w, h, { left: 56, right: 20, top: 22, bottom: 40 });

    const cols = 72;
    const rows = 72;
    const cellW = plot.width / cols;
    const cellH = plot.height / rows;
    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        const cx = xDomain[0] + ((i + 0.5) / cols) * (xDomain[1] - xDomain[0]);
        const cy = yDomain[0] + ((j + 0.5) / rows) * (yDomain[1] - yDomain[0]);
        const pred = knnClassify(points, { x: cx, y: cy }, state.k, state.standardise, state.metric, stats);
        ctx.fillStyle = pred.label === 0 ? withAlpha(LAB_COLORS.violet, 0.11) : withAlpha(LAB_COLORS.cyan, 0.11);
        ctx.fillRect(plot.left + i * cellW, plot.top + j * cellH, cellW + 0.5, cellH + 0.5);
      }
    }

    drawGrid(ctx, w, h, xDomain, yDomain, { xLabel: "Feature 1 (range 10)", yLabel: "Feature 2 (range 100)", xTicks: [0, 2, 4, 6, 8, 10], yTicks: [0, 20, 40, 60, 80, 100], frame: { left: 56, right: 20, top: 22, bottom: 40 } });

    result.neighbours.forEach((n) => {
      const p = points[n.index];
      drawSegment(ctx, plot, mapX(test.x, xDomain, plot), mapY(test.y, yDomain, plot), mapX(p.x, xDomain, plot), mapY(p.y, yDomain, plot), withAlpha(LAB_COLORS.amber, 0.28), 1, [3, 4]);
      drawCircle(ctx, mapX(p.x, xDomain, plot), mapY(p.y, yDomain, plot), 8, null, withAlpha(LAB_COLORS.amber, 0.85), 1.5);
    });

    points.forEach((p) => {
      drawCircle(ctx, mapX(p.x, xDomain, plot), mapY(p.y, yDomain, plot), 5, withAlpha(p.label === 0 ? LAB_COLORS.violet : LAB_COLORS.cyan, 0.9), "rgba(255,255,255,0.55)", 1);
    });

    const tx = mapX(test.x, xDomain, plot);
    const ty = mapY(test.y, yDomain, plot);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tx, ty - 10);
    ctx.lineTo(tx + 10, ty);
    ctx.lineTo(tx, ty + 10);
    ctx.lineTo(tx - 10, ty);
    ctx.closePath();
    ctx.fillStyle = LAB_COLORS.amber;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    drawText(ctx, "Drag the star", tx + 14, ty - 14, LAB_COLORS.amber, "10.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif");
    drawLegend(ctx, [
      { label: "Class A", color: LAB_COLORS.violet },
      { label: "Class B", color: LAB_COLORS.cyan },
      { label: "Test point", color: LAB_COLORS.amber }
    ], plot.left + 8, plot.top + 10);

    const warning = !state.standardise
      ? `<div class="lab-warning">${icon("info")}<span>Feature 2 has a range of 100 and Feature 1 has a range of 10. Without standardisation, Feature 2 dominates the distance. That is the scale trap.</span></div>`
      : "";
    setMetrics(
      warning +
      metricTile("Predicted class", result.label === 0 ? "A" : "B", "Majority vote", true) +
      metricTile("Votes", `${result.votes[0]} A / ${result.votes[1]} B`, `K = ${state.k}`, false) +
      metricTile("Leave-one-out", (loo * 100).toFixed(0) + "%", "Validation accuracy", false) +
      metricTile("K", String(state.k), "Neighbours", false) +
      metricTile("Standardised", state.standardise ? "Yes" : "No", "Feature scaling", false) +
      metricTile("Metric", state.metric === "euclidean" ? "Euclidean" : "Manhattan", "Distance", false) +
      metricTile("Training points", String(points.length), "Two classes", false) +
      metricTile("Bias / variance", state.k <= 2 ? "High variance" : state.k >= 18 ? "High bias" : "Balanced", "K controls flexibility", false)
    );
  }
});

registerLab("gini", {
  meta: {
    topic: "ml",
    title: "Gini, entropy and the best split",
    blurb: "Drag the split through a row of records. The parent and child impurities update. The best split is the one with the largest gain.",
    time: "6 min",
    examShort: "Tree splits",
    exam: "Gini is 1 minus the sum of squared class probabilities. Entropy is minus the sum of p log2 p. A pure node has impurity 0. Gini gain is parent impurity minus the weighted child impurity. The best split maximises the gain.",
    note: "Weight each child by its share of the records. A pure child is not automatically the best split if it is tiny.",
    try: [
      "Drag the split from left to right. Watch the weighted child impurity. The best split is the lowest point.",
      "Switch between Gini and entropy. The numbers change, but the best split is often in the same region.",
      "Shuffle the labels. The best gain collapses because there is no clean split."
    ]
  },
  defaults: { split: 10, criterion: "gini", seed: 1 },
  controls(state) {
    return `${rangeRow("gi-split", "Split after record", 1, 19, 1, state.split, { digits: 0 })}
      ${selectRow("gi-criterion", "Impurity measure", [{ value: "gini", label: "Gini impurity" }, { value: "entropy", label: "Entropy" }], state.criterion)}
      <button class="btn btn-soft btn-sm btn-wide" type="button" data-lab-action="best" style="margin-top:2px;">${icon("target")} Best split</button>`;
  },
  bind({ state, draw }) {
    bindRange("gi-split", state, "split", draw, { digits: 0 });
    bindSelect("gi-criterion", state, "criterion", draw);
  },
  dataLabel: "Shuffle labels",
  onData(state) { state.seed = (state.seed || 1) + 1; },
  actions: {
    best(state, draw) {
      let bestSplit = 1;
      let bestWeighted = Infinity;
      for (let split = 1; split < 20; split += 1) {
        const labels = giniLabels(state.seed);
        const left = labels.slice(0, split);
        const right = labels.slice(split);
        const weighted = (left.length / labels.length) * impurity(left, state.criterion) + (right.length / labels.length) * impurity(right, state.criterion);
        if (weighted < bestWeighted - 1e-9) {
          bestWeighted = weighted;
          bestSplit = split;
        }
      }
      state.split = bestSplit;
      const el = document.getElementById("gi-split");
      const out = document.getElementById("gi-split-value");
      if (el) el.value = bestSplit;
      if (out) out.textContent = String(bestSplit);
      draw();
    }
  },
  draw({ state, canvases, setMetrics }) {
    const labels = giniLabels(state.seed);
    const split = clamp(state.split, 1, labels.length - 1);
    const left = labels.slice(0, split);
    const right = labels.slice(split);
    const parentImp = impurity(labels, state.criterion);
    const leftImp = impurity(left, state.criterion);
    const rightImp = impurity(right, state.criterion);
    const weighted = (left.length / labels.length) * leftImp + (right.length / labels.length) * rightImp;
    const gain = parentImp - weighted;
    const { ctx, w, h } = setupCanvas(canvases[0]);
    const plot = chartFrame(w, h, { left: 40, right: 20, top: 20, bottom: 40 });
    const nodeW = 156;
    const nodeH = 58;
    const rootX = plot.left + plot.width / 2;
    const leftX = plot.left + plot.width * 0.27;
    const rightX = plot.left + plot.width * 0.73;
    const rootY = plot.top + 12;
    const childY = plot.top + 120;

    ctx.save();
    ctx.strokeStyle = withAlpha(LAB_COLORS.text, 0.22);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(rootX, rootY + nodeH);
    ctx.lineTo(leftX + nodeW / 2, childY);
    ctx.moveTo(rootX, rootY + nodeH);
    ctx.lineTo(rightX + nodeW / 2, childY);
    ctx.stroke();
    ctx.restore();
    drawText(ctx, `x <= ${split}`, (rootX + leftX + nodeW / 2) / 2 - 18, (rootY + nodeH + childY) / 2, LAB_COLORS.muted, "10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "center");
    drawText(ctx, `x > ${split}`, (rootX + rightX + nodeW / 2) / 2 + 18, (rootY + nodeH + childY) / 2, LAB_COLORS.muted, "10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "center");

    drawNode(ctx, rootX - nodeW / 2, rootY, nodeW, nodeH, labels, `Parent · ${state.criterion === "gini" ? "Gini" : "Entropy"} ${parentImp.toFixed(3)}`, LAB_COLORS.violet);
    drawNode(ctx, leftX, childY, nodeW, nodeH, left, `Left · ${state.criterion === "gini" ? "Gini" : "Entropy"} ${leftImp.toFixed(3)}`, LAB_COLORS.cyan);
    drawNode(ctx, rightX, childY, nodeW, nodeH, right, `Right · ${state.criterion === "gini" ? "Gini" : "Entropy"} ${rightImp.toFixed(3)}`, LAB_COLORS.amber);

    const stripY = h - 104;
    const stripPlot = { left: 40, top: stripY, right: 20, bottom: 46, width: w - 60, height: 52 };
    const xDomain = [0, labels.length];
    const splitX = mapX(split, xDomain, stripPlot);
    ctx.save();
    ctx.fillStyle = withAlpha(LAB_COLORS.violet, 0.035);
    ctx.fillRect(stripPlot.left, stripPlot.top - 14, splitX - stripPlot.left, 58);
    ctx.fillStyle = withAlpha(LAB_COLORS.amber, 0.035);
    ctx.fillRect(splitX, stripPlot.top - 14, stripPlot.left + stripPlot.width - splitX, 58);
    ctx.restore();
    labels.forEach((label, index) => {
      const x = mapX(index + 0.5, xDomain, stripPlot);
      const y = stripPlot.top + (label === 0 ? 10 : 36);
      drawCircle(ctx, x, y, 5, withAlpha(label === 0 ? LAB_COLORS.violet : LAB_COLORS.cyan, 0.9), "rgba(255,255,255,0.4)", 1);
    });
    ctx.save();
    ctx.strokeStyle = LAB_COLORS.text;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(splitX, stripPlot.top - 18);
    ctx.lineTo(splitX, stripPlot.top + 48);
    ctx.stroke();
    ctx.restore();
    drawText(ctx, "Class A", 10, stripPlot.top + 10, LAB_COLORS.violet, "9.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif");
    drawText(ctx, "Class B", 10, stripPlot.top + 36, LAB_COLORS.cyan, "9.5px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif");
    drawText(ctx, "Feature values, sorted", stripPlot.left + stripPlot.width / 2, h - 8, LAB_COLORS.muted2, "10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "center");

    setMetrics(
      metricTile("Parent impurity", parentImp.toFixed(3), state.criterion === "gini" ? "Gini" : "Entropy", true) +
      metricTile("Left impurity", leftImp.toFixed(3), `${left.length} records`, false) +
      metricTile("Right impurity", rightImp.toFixed(3), `${right.length} records`, false) +
      metricTile("Weighted child", weighted.toFixed(3), "Size weighted", false) +
      metricTile("Gain", gain.toFixed(3), "Parent minus child", true) +
      metricTile("Split", String(split), "After this record", false)
    );
  }
});

registerLab("bias-variance", {
  meta: {
    topic: "ml",
    title: "KNN regression and the bias-variance trade-off",
    blurb: "One slider moves the model from a jagged overfit to a smooth underfit. The training and test error curves show why the best K is in the middle.",
    time: "7 min",
    examShort: "Bias and variance",
    exam: "Small K gives a flexible model with low bias and high variance. Large K gives a rigid model with high bias and low variance. Training error can be zero while test error is high. Choose K with validation.",
    note: "If training error keeps falling while test error rises, you are overfitting. The best model is not the one with the lowest training error.",
    try: [
      "Set K = 1. Training error is zero, but the fit is jagged and test error is high.",
      "Increase K. The fit smooths, test error falls, then rises again.",
      "Add noise. The gap between training and test error grows.",
      "Find the K at the bottom of the test curve. That is the validation choice."
    ]
  },
  defaults: { k: 5, noise: 0.18, sampleSize: 40, seed: 1 },
  canvases: [
    { id: "bv-fit", title: "KNN fit" },
    { id: "bv-curve", title: "Train and test error" }
  ],
  controls(state) {
    return `${rangeRow("bv-k", "K neighbours", 1, 30, 1, state.k, { digits: 0 })}
      ${rangeRow("bv-noise", "Noise", 0.02, 0.5, 0.01, state.noise, { digits: 2 })}
      ${rangeRow("bv-size", "Training points", 20, 80, 1, state.sampleSize, { digits: 0 })}`;
  },
  bind({ state, draw }) {
    bindRange("bv-k", state, "k", draw, { digits: 0 });
    bindRange("bv-noise", state, "noise", draw, { digits: 2 });
    bindRange("bv-size", state, "sampleSize", draw, { digits: 0 });
  },
  dataLabel: "New sample",
  onData(state) { state.seed = (state.seed || 1) + 1; },
  draw({ state, canvases, setMetrics }) {
    const train = biasVarianceData(state);
    const test = [];
    for (let i = 0; i <= 200; i += 1) {
      const x = i / 200;
      test.push({ x, y: Math.sin(2 * Math.PI * x) });
    }
    const maxK = 30;
    const trainErrors = [];
    const testErrors = [];
    for (let k = 1; k <= maxK; k += 1) {
      let trainSe = 0;
      train.forEach((p) => {
        const pred = knnRegressionPredict(train, p.x, k);
        trainSe += (p.y - pred) ** 2;
      });
      let testSe = 0;
      test.forEach((p) => {
        const pred = knnRegressionPredict(train, p.x, k);
        testSe += (p.y - pred) ** 2;
      });
      trainErrors.push(trainSe / train.length);
      testErrors.push(testSe / test.length);
    }
    const bestK = testErrors.indexOf(Math.min(...testErrors)) + 1;
    const currentK = clamp(state.k, 1, maxK);
    const currentTrain = trainErrors[currentK - 1];
    const currentTest = testErrors[currentK - 1];

    const fitCanvas = canvases[0];
    const { ctx, w, h } = setupCanvas(fitCanvas);
    const xDomain = [0, 1];
    const yDomain = [-1.45, 1.45];
    const plot = drawGrid(ctx, w, h, xDomain, yDomain, { xLabel: "x", yLabel: "y", xTicks: [0, 0.2, 0.4, 0.6, 0.8, 1], yTicks: [-1, 0, 1] });
    const trueLine = test.map((p) => ({ x: p.x, y: p.y }));
    drawPolyline(ctx, plot, trueLine, xDomain, yDomain, "rgba(255,255,255,0.28)", 1.5, [6, 5]);
    const fitLine = [];
    for (let i = 0; i <= 200; i += 1) {
      const x = i / 200;
      fitLine.push({ x, y: knnRegressionPredict(train, x, currentK) });
    }
    drawPolyline(ctx, plot, fitLine, xDomain, yDomain, LAB_COLORS.cyan, 2.5);
    train.forEach((p) => {
      drawCircle(ctx, mapX(p.x, xDomain, plot), mapY(p.y, yDomain, plot), 4, withAlpha(LAB_COLORS.violet, 0.8), "rgba(255,255,255,0.35)", 1);
    });
    drawLegend(ctx, [{ label: "True function", color: "rgba(255,255,255,0.28)" }, { label: `KNN fit, K = ${currentK}`, color: LAB_COLORS.cyan }, { label: "Training data", color: LAB_COLORS.violet }], plot.left + 8, plot.top + 10);

    const curveCanvas = canvases[1];
    const c = setupCanvas(curveCanvas);
    const kDomain = [1, maxK];
    const yMax = Math.max(...testErrors) * 1.18 || 1;
    const yMin = 0;
    const curvePlot = drawGrid(c.ctx, c.w, c.h, kDomain, [yMin, yMax], { xLabel: "K", yLabel: "Mean squared error", xTicks: [1, 5, 10, 15, 20, 25, 30] });
    c.ctx.save();
    c.ctx.fillStyle = "rgba(255,107,129,0.05)";
    c.ctx.fillRect(mapX(1, kDomain, curvePlot), curvePlot.top, mapX(4, kDomain, curvePlot) - mapX(1, kDomain, curvePlot), curvePlot.height);
    c.ctx.fillStyle = "rgba(255,184,107,0.045)";
    c.ctx.fillRect(mapX(19, kDomain, curvePlot), curvePlot.top, mapX(30, kDomain, curvePlot) - mapX(19, kDomain, curvePlot), curvePlot.height);
    c.ctx.restore();
    drawText(c.ctx, "high variance", mapX(1.5, kDomain, curvePlot) + 2, curvePlot.top + curvePlot.height - 10, withAlpha(LAB_COLORS.red, 0.8), "9px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif");
    drawText(c.ctx, "high bias", mapX(25, kDomain, curvePlot), curvePlot.top + curvePlot.height - 10, withAlpha(LAB_COLORS.amber, 0.8), "9px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "center");
    for (let k = 1; k <= maxK; k += 1) {
      drawSegment(c.ctx, curvePlot, mapX(k, kDomain, curvePlot), mapY(trainErrors[k - 1], [yMin, yMax], curvePlot), mapX(k, kDomain, curvePlot), mapY(testErrors[k - 1], [yMin, yMax], curvePlot), withAlpha(LAB_COLORS.muted2, 0.18), 1);
    }
    drawPolyline(c.ctx, curvePlot, trainErrors.map((v, i) => ({ x: i + 1, y: v })), kDomain, [yMin, yMax], LAB_COLORS.violet, 2);
    drawPolyline(c.ctx, curvePlot, testErrors.map((v, i) => ({ x: i + 1, y: v })), kDomain, [yMin, yMax], LAB_COLORS.cyan, 2.5);
    drawCircle(c.ctx, mapX(currentK, kDomain, curvePlot), mapY(currentTest, [yMin, yMax], curvePlot), 5, LAB_COLORS.amber, "#0b1220", 2);
    drawCircle(c.ctx, mapX(bestK, kDomain, curvePlot), mapY(testErrors[bestK - 1], [yMin, yMax], curvePlot), 5, null, LAB_COLORS.green, 2);
    drawLegend(c.ctx, [{ label: "Training error", color: LAB_COLORS.violet }, { label: "Test error", color: LAB_COLORS.cyan }], curvePlot.left + 8, curvePlot.top + 10);
    drawLegend(c.ctx, [{ label: "Current K", color: LAB_COLORS.amber }, { label: "Best K", color: LAB_COLORS.green }], curvePlot.left + 8, curvePlot.top + 26);

    setMetrics(
      metricTile("Current K", String(currentK), "Selected model", true) +
      metricTile("Training MSE", currentTrain.toFixed(3), "Fit to seen data", false) +
      metricTile("Test MSE", currentTest.toFixed(3), "New data", true) +
      metricTile("Gap", (currentTest - currentTrain).toFixed(3), "Overfitting signal", false) +
      metricTile("Best K", String(bestK), "Lowest test error", false) +
      metricTile("Best test MSE", testErrors[bestK - 1].toFixed(3), "Validation choice", false) +
      metricTile("Noise", state.noise.toFixed(2), "Data generation", false) +
      metricTile("Training points", String(train.length), "Sample size", false)
    );
  }
});

/* KNN helpers */
function knnData(seed) {
  const rng = mulberry32(6000 + seed * 41);
  const points = [];
  for (let i = 0; i < 18; i += 1) {
    points.push({ x: clamp(2.2 + randomNormal(rng) * 0.85, 0.2, 9.8), y: clamp(50 + randomNormal(rng) * 17, 4, 96), label: 0 });
  }
  for (let i = 0; i < 18; i += 1) {
    points.push({ x: clamp(7.6 + randomNormal(rng) * 0.85, 0.2, 9.8), y: clamp(50 + randomNormal(rng) * 17, 4, 96), label: 1 });
  }
  return points;
}

function knnStats(points) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    xMean: mean(xs),
    yMean: mean(ys),
    xSd: sd(xs) || 1,
    ySd: sd(ys) || 1
  };
}

function knnTransform(point, stats, standardise) {
  if (!standardise) return { x: point.x, y: point.y };
  return { x: (point.x - stats.xMean) / stats.xSd, y: (point.y - stats.yMean) / stats.ySd };
}

function knnDistance(a, b, metric) {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  if (metric === "manhattan") return dx + dy;
  return Math.sqrt(dx * dx + dy * dy);
}

function knnClassify(points, test, k, standardise, metric, stats = null) {
  const s = stats || knnStats(points);
  const query = knnTransform(test, s, standardise);
  const distances = points.map((p, index) => {
    const q = knnTransform(p, s, standardise);
    return { index, d: knnDistance(q, query, metric), label: p.label };
  }).sort((a, b) => a.d - b.d);
  const neighbours = distances.slice(0, Math.min(k, distances.length));
  const votes = [0, 0];
  neighbours.forEach((n) => { votes[n.label] += 1; });
  let label = votes[0] >= votes[1] ? 0 : 1;
  if (votes[0] === votes[1] && neighbours.length) label = neighbours[0].label;
  return { label, votes, neighbours };
}

function knnLeaveOneOut(points, k, standardise, metric) {
  if (points.length < 2) return 0;
  let correct = 0;
  points.forEach((p, index) => {
    const rest = points.filter((_, i) => i !== index);
    const stats = knnStats(rest);
    const result = knnClassify(rest, p, k, standardise, metric, stats);
    if (result.label === p.label) correct += 1;
  });
  return correct / points.length;
}

/* Gini helpers */
function giniLabels(seed) {
  const rng = mulberry32(7000 + seed * 43);
  const labels = [];
  for (let i = 0; i < 20; i += 1) {
    if (i < 8) labels.push(0);
    else if (i >= 12) labels.push(1);
    else labels.push(rng() < 0.5 ? 0 : 1);
  }
  return labels;
}

function impurity(labels, criterion) {
  if (!labels.length) return 0;
  const pA = labels.filter((l) => l === 0).length / labels.length;
  const pB = 1 - pA;
  if (criterion === "entropy") {
    return -(pA ? pA * Math.log2(pA) : 0) - (pB ? pB * Math.log2(pB) : 0);
  }
  return 1 - (pA * pA + pB * pB);
}

function drawNode(ctx, x, y, w, h, labels, title, color) {
  const countA = labels.filter((l) => l === 0).length;
  const countB = labels.length - countA;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 12);
  ctx.fillStyle = withAlpha(color, 0.08);
  ctx.fill();
  ctx.strokeStyle = withAlpha(color, 0.4);
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
  drawText(ctx, title, x + 12, y + 16, color, "600 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif");
  drawText(ctx, `${countA} A / ${countB} B`, x + 12, y + 36, LAB_COLORS.text, "11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif");
}

/* Bias-variance helpers */
function biasVarianceData(state) {
  const rng = mulberry32(8000 + state.seed * 47);
  const points = [];
  for (let i = 0; i < state.sampleSize; i += 1) {
    const x = rng();
    points.push({ x, y: Math.sin(2 * Math.PI * x) + randomNormal(rng) * state.noise });
  }
  return points;
}

function knnRegressionPredict(train, x, k) {
  const nearest = train.map((p) => ({ d: Math.abs(p.x - x), y: p.y })).sort((a, b) => a.d - b.d).slice(0, Math.min(k, train.length));
  return mean(nearest.map((n) => n.y));
}

function drawPolyline(ctx, plot, points, xDomain, yDomain, color, width = 2, dash = []) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = mapX(p.x, xDomain, plot);
    const y = mapY(p.y, yDomain, plot);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.restore();
}
