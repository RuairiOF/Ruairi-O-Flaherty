registerLab("bagging", {
  meta: {
    topic: "ml",
    title: "Bagging: many noisy trees",
    blurb: "One tree is jagged and changes completely when the sample changes. Average many bootstrap trees and the prediction settles down. That is bagging.",
    time: "7 min",
    examShort: "Bagging and forests",
    exam: "Bagging fits models on bootstrap resamples and averages them, which reduces variance. A random forest is bagging with trees plus a random subset of variables at each split. OOB error is a built-in estimate from the records left out of each bootstrap sample.",
    note: "With one feature this is bagging, not a full random forest. The forest adds random feature subsets at each split. The variance reduction idea is the same.",
    try: [
      "Set the number of trees to 1. The fit is jagged and unstable.",
      "Increase to 30 trees. The bagged average smooths out.",
      "Turn on individual trees. Each one is different because each sees a different bootstrap sample.",
      "Add noise. The single tree gets worse, while the average holds up better."
    ]
  },
  defaults: { trees: 12, noise: 0.18, showIndividual: false, seed: 1 },
  controls(state) {
    return `${rangeRow("bg-trees", "Number of trees", 1, 50, 1, state.trees, { digits: 0 })}
      ${rangeRow("bg-noise", "Noise", 0.02, 0.4, 0.01, state.noise, { digits: 2 })}
      ${switchRow("bg-individual", "Show individual trees", state.showIndividual)}`;
  },
  bind({ state, draw }) {
    bindRange("bg-trees", state, "trees", draw, { digits: 0 });
    bindRange("bg-noise", state, "noise", draw, { digits: 2 });
    bindSwitch("bg-individual", state, "showIndividual", draw);
  },
  dataLabel: "New sample",
  onData(state) { state.seed = (state.seed || 1) + 1; },
  draw({ state, canvases, setMetrics }) {
    const train = baggingData(state);
    const test = [];
    for (let i = 0; i <= 160; i += 1) {
      const x = i / 160;
      test.push({ x, y: Math.sin(2 * Math.PI * x) });
    }
    const rng = mulberry32(9000 + state.seed * 53);
    const treePreds = [];
    const treeMses = [];
    for (let t = 0; t < state.trees; t += 1) {
      const sample = train.map(() => train[Math.floor(rng() * train.length)]);
      const tree = buildRegressionTree(sample, 0, 4);
      const preds = test.map((p) => predictTree(tree, p.x));
      treePreds.push(preds);
      const mse = mean(preds.map((pred, i) => (pred - test[i].y) ** 2));
      treeMses.push(mse);
    }
    const bagged = test.map((_, i) => mean(treePreds.map((preds) => preds[i])));
    const single = treePreds[0];
    const singleMse = mean(single.map((pred, i) => (pred - test[i].y) ** 2));
    const avgSingleMse = mean(treeMses);
    const baggedMse = mean(bagged.map((pred, i) => (pred - test[i].y) ** 2));
    const variancePred = mean(test.map((_, i) => variance(treePreds.map((preds) => preds[i]))));
    const improvement = avgSingleMse ? ((avgSingleMse - baggedMse) / avgSingleMse) * 100 : 0;

    const { ctx, w, h } = setupCanvas(canvases[0]);
    const xDomain = [0, 1];
    const yDomain = [-1.6, 1.6];
    const plot = drawGrid(ctx, w, h, xDomain, yDomain, { xLabel: "x", yLabel: "y", xTicks: [0, 0.2, 0.4, 0.6, 0.8, 1], yTicks: [-1, 0, 1] });

    if (state.showIndividual) {
      treePreds.forEach((preds) => {
        drawPolyline(ctx, plot, preds.map((y, i) => ({ x: test[i].x, y })), xDomain, yDomain, withAlpha(LAB_COLORS.violet, 0.16), 1);
      });
    }
    drawPolyline(ctx, plot, test.map((p) => ({ x: p.x, y: p.y })), xDomain, yDomain, "rgba(255,255,255,0.28)", 1.5, [6, 5]);
    drawPolyline(ctx, plot, single.map((y, i) => ({ x: test[i].x, y })), xDomain, yDomain, withAlpha(LAB_COLORS.amber, 0.8), 1.8);
    drawPolyline(ctx, plot, bagged.map((y, i) => ({ x: test[i].x, y })), xDomain, yDomain, LAB_COLORS.cyan, 2.6);
    train.forEach((p) => {
      drawCircle(ctx, mapX(p.x, xDomain, plot), mapY(p.y, yDomain, plot), 3.8, withAlpha(LAB_COLORS.muted, 0.75), "rgba(255,255,255,0.3)", 1);
    });
    drawLegend(ctx, [
      { label: "True function", color: "rgba(255,255,255,0.28)" },
      { label: "One tree", color: LAB_COLORS.amber },
      { label: "Bagged average", color: LAB_COLORS.cyan },
      { label: "Training data", color: LAB_COLORS.muted }
    ], plot.left + 8, plot.top + 10);

    setMetrics(
      metricTile("Trees", String(state.trees), "Bootstrap models", true) +
      metricTile("One tree MSE", avgSingleMse.toFixed(3), "Average single tree", false) +
      metricTile("Bagged MSE", baggedMse.toFixed(3), "Ensemble average", true) +
      metricTile("Improvement", `${improvement.toFixed(0)}%`, "Error reduction", false) +
      metricTile("Prediction variance", variancePred.toFixed(3), "Across trees", false) +
      metricTile("Noise", state.noise.toFixed(2), "Data generation", false) +
      metricTile("Training points", String(train.length), "Bootstrap size", false) +
      metricTile("First tree MSE", singleMse.toFixed(3), "One random tree", false)
    );
  }
});

function baggingData(state) {
  const rng = mulberry32(9100 + state.seed * 59);
  const points = [];
  for (let i = 0; i < 45; i += 1) {
    const x = rng();
    points.push({ x, y: Math.sin(2 * Math.PI * x) + randomNormal(rng) * state.noise });
  }
  return points;
}

function buildRegressionTree(points, depth, maxDepth) {
  if (points.length < 8 || depth >= maxDepth) {
    return { leaf: true, value: mean(points.map((p) => p.y)) };
  }
  const sorted = points.slice().sort((a, b) => a.x - b.x);
  let best = null;
  for (let i = 1; i < sorted.length; i += 1) {
    const left = sorted.slice(0, i);
    const right = sorted.slice(i);
    if (left.length < 3 || right.length < 3) continue;
    const sse = sseOf(left) + sseOf(right);
    if (!best || sse < best.sse) {
      best = { split: (sorted[i - 1].x + sorted[i].x) / 2, left, right, sse };
    }
  }
  if (!best) return { leaf: true, value: mean(points.map((p) => p.y)) };
  return {
    leaf: false,
    split: best.split,
    left: buildRegressionTree(best.left, depth + 1, maxDepth),
    right: buildRegressionTree(best.right, depth + 1, maxDepth)
  };
}

function sseOf(points) {
  const m = mean(points.map((p) => p.y));
  return sum(points.map((p) => (p.y - m) ** 2));
}

function predictTree(node, x) {
  if (node.leaf) return node.value;
  return x <= node.split ? predictTree(node.left, x) : predictTree(node.right, x);
}
