registerLab("least-squares", {
  meta: {
    topic: "reg",
    title: "Least squares, residuals and R squared",
    blurb: "Move the line yourself. The residuals and RSS update live. Then press Best fit and see exactly what least squares is minimising.",
    time: "6 min",
    examShort: "Regression fit",
    exam: "A residual is observed minus fitted. Least squares chooses the line that minimises the residual sum of squares. R squared is the share of variance explained, and RMSE is the typical error in the units of Y.",
    note: "If the exam gives you a line and a point, compute the fitted value first, then the residual. Do not confuse R squared with accuracy.",
    try: [
      "Use the sliders to make RSS as small as you can, then press Best fit. The dashed line is the least-squares line.",
      "Add the outlier. The best-fit line tilts toward it and RSS increases.",
      "Move the line away from the points. Watch R squared fall and RMSE rise. They both punish bad fit."
    ]
  },
  defaults: { slope: 1, intercept: 3, residuals: true, outlier: false, seed: 1 },
  controls(state) {
    return `${rangeRow("ls-slope", "Your slope", 0, 3, 0.05, state.slope, { digits: 2 })}
      ${rangeRow("ls-intercept", "Your intercept", 0, 8, 0.1, state.intercept, { digits: 1 })}
      ${switchRow("ls-residuals", "Show residuals", state.residuals)}
      ${switchRow("ls-outlier", "Add an outlier", state.outlier)}
      <button class="btn btn-soft btn-sm btn-wide" type="button" data-lab-action="best" style="margin-top:2px;">${icon("target")} Snap to best fit</button>`;
  },
  bind({ state, draw }) {
    bindRange("ls-slope", state, "slope", draw, { digits: 2 });
    bindRange("ls-intercept", state, "intercept", draw, { digits: 1 });
    bindSwitch("ls-residuals", state, "residuals", draw);
    bindSwitch("ls-outlier", state, "outlier", draw);
  },
  dataLabel: "New sample",
  onData(state) { state.seed = (state.seed || 1) + 1; },
  actions: {
    best(state, draw) {
      const points = leastSquaresData(state);
      const fit = linreg(points);
      state.slope = Number(fit.slope.toFixed(2));
      state.intercept = Number(fit.intercept.toFixed(1));
      const slopeEl = document.getElementById("ls-slope");
      const interceptEl = document.getElementById("ls-intercept");
      const slopeOut = document.getElementById("ls-slope-value");
      const interceptOut = document.getElementById("ls-intercept-value");
      if (slopeEl) slopeEl.value = state.slope;
      if (interceptEl) interceptEl.value = state.intercept;
      if (slopeOut) slopeOut.textContent = state.slope.toFixed(2);
      if (interceptOut) interceptOut.textContent = state.intercept.toFixed(1);
      draw();
    }
  },
  draw({ state, canvases, setMetrics }) {
    const points = leastSquaresData(state);
    const best = linreg(points);
    const userPred = points.map((p) => state.intercept + state.slope * p.x);
    const userResiduals = points.map((p, i) => p.y - userPred[i]);
    const userRss = sum(userResiduals.map((e) => e * e));
    const tss = sum(points.map((p) => (p.y - mean(points.map((q) => q.y))) ** 2));
    const userR2 = tss ? 1 - userRss / tss : 0;
    const userRmse = Math.sqrt(userRss / points.length);
    const { ctx, w, h } = setupCanvas(canvases[0]);
    const xDomain = [0, 12];
    const yDomain = [0, 20];
    const plot = drawGrid(ctx, w, h, xDomain, yDomain, { xLabel: "x", yLabel: "y", xTicks: [0, 2, 4, 6, 8, 10, 12], yTicks: [0, 5, 10, 15, 20] });

    if (state.residuals) {
      points.forEach((p, i) => {
        const x = mapX(p.x, xDomain, plot);
        const yObs = mapY(p.y, yDomain, plot);
        const yFit = mapY(userPred[i], yDomain, plot);
        ctx.save();
        ctx.strokeStyle = withAlpha(LAB_COLORS.amber, 0.55);
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x, yObs);
        ctx.lineTo(x, yFit);
        ctx.stroke();
        ctx.restore();
      });
    }

    points.forEach((p) => {
      const isOutlier = p.outlier;
      drawCircle(ctx, mapX(p.x, xDomain, plot), mapY(p.y, yDomain, plot), isOutlier ? 6 : 4.8, isOutlier ? withAlpha(LAB_COLORS.amber, 0.95) : withAlpha(LAB_COLORS.violet, 0.75), isOutlier ? LAB_COLORS.amber : "rgba(255,255,255,0.32)", 1.2);
      if (isOutlier) drawText(ctx, "Outlier", mapX(p.x, xDomain, plot) + 10, mapY(p.y, yDomain, plot) - 14, LAB_COLORS.amber, "10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif");
    });

    const userY1 = state.intercept + state.slope * 0;
    const userY2 = state.intercept + state.slope * 12;
    drawSegment(ctx, plot, mapX(0, xDomain, plot), mapY(userY1, yDomain, plot), mapX(12, xDomain, plot), mapY(userY2, yDomain, plot), LAB_COLORS.cyan, 2.5);
    const bestY1 = best.intercept + best.slope * 0;
    const bestY2 = best.intercept + best.slope * 12;
    drawSegment(ctx, plot, mapX(0, xDomain, plot), mapY(bestY1, yDomain, plot), mapX(12, xDomain, plot), mapY(bestY2, yDomain, plot), withAlpha(LAB_COLORS.text, 0.7), 2, [7, 5]);
    drawLegend(ctx, [{ label: "Your line", color: LAB_COLORS.cyan }, { label: "Least squares", color: withAlpha(LAB_COLORS.text, 0.7) }], plot.left + 10, plot.top + 12);
    drawText(ctx, `RSS ${formatControl(userRss, 1)}`, plot.left + plot.width - 10, plot.top + 14, LAB_COLORS.amber, "600 11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", "right");

    setMetrics(
      metricTile("Your RSS", formatControl(userRss, 1), "Lower is better", true) +
      metricTile("Best RSS", formatControl(best.rss, 1), "Least squares", false) +
      metricTile("Your R squared", userR2.toFixed(2), "Variance explained", false) +
      metricTile("Best R squared", best.r2.toFixed(2), "Optimal line", false) +
      metricTile("Your RMSE", formatControl(userRmse, 2), "Units of y", false) +
      metricTile("Best RMSE", formatControl(best.rmse, 2), "Least squares", false) +
      metricTile("Your slope", state.slope.toFixed(2), "Change in y per x", false) +
      metricTile("Best slope", best.slope.toFixed(2), "Least squares", false)
    );
  }
});

registerLab("intervals", {
  meta: {
    topic: "reg",
    title: "Confidence, prediction and extrapolation",
    blurb: "Move a test x along the line. The confidence band is for the mean response. The prediction band is for one new observation, and it is always wider.",
    time: "5 min",
    examShort: "Prediction intervals",
    exam: "A confidence interval is around the mean response. A prediction interval is around an individual value and is wider. Extrapolation means predicting outside the observed range, which is risky.",
    note: "The prediction interval includes the extra variability of one observation. If the question says one new record, choose the prediction interval.",
    try: [
      "Move x to the middle of the data. The bands are narrowest there.",
      "Move x to the edge. Both bands widen. The prediction band stays wider than the confidence band.",
      "Turn on extrapolation. The model is now outside the data, and the bands fan out."
    ]
  },
  defaults: { x0: 5, showCI: true, showPI: true, extrapolate: false, seed: 1 },
  controls(state) {
    return `${rangeRow("in-x0", "Test x", -4, 18, 0.1, state.x0, { digits: 1 })}
      ${switchRow("in-ci", "Show confidence band", state.showCI)}
      ${switchRow("in-pi", "Show prediction band", state.showPI)}
      ${switchRow("in-extrapolate", "Allow extrapolation", state.extrapolate)}`;
  },
  bind({ state, draw }) {
    bindRange("in-x0", state, "x0", draw, { digits: 1 });
    bindSwitch("in-ci", state, "showCI", draw);
    bindSwitch("in-pi", state, "showPI", draw);
    bindSwitch("in-extrapolate", state, "extrapolate", draw);
  },
  dataLabel: "New sample",
  onData(state) { state.seed = (state.seed || 1) + 1; },
  draw({ state, canvases, setMetrics }) {
    const points = intervalData(state);
    const fit = linreg(points);
    const n = points.length;
    const xs = points.map((p) => p.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const xDomain = state.extrapolate ? [minX - 6, maxX + 8] : [minX - 1, maxX + 1];
    const grid = [];
    for (let i = 0; i <= 120; i += 1) grid.push(xDomain[0] + (i / 120) * (xDomain[1] - xDomain[0]));
    const tCrit = 2.048;
    const ciLower = [];
    const ciUpper = [];
    const piLower = [];
    const piUpper = [];
    grid.forEach((x) => {
      const yhat = fit.intercept + fit.slope * x;
      const seMean = fit.s * Math.sqrt(1 / n + (x - fit.xbar) ** 2 / fit.sxx);
      const sePred = fit.s * Math.sqrt(1 + 1 / n + (x - fit.xbar) ** 2 / fit.sxx);
      ciLower.push(yhat - tCrit * seMean);
      ciUpper.push(yhat + tCrit * seMean);
      piLower.push(yhat - tCrit * sePred);
      piUpper.push(yhat + tCrit * sePred);
    });
    const yValues = points.map((p) => p.y).concat(piLower, piUpper);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const yPad = (yMax - yMin) * 0.12 || 1;
    const yDomain = [yMin - yPad, yMax + yPad];
    const { ctx, w, h } = setupCanvas(canvases[0]);
    const plot = drawGrid(ctx, w, h, xDomain, yDomain, { xLabel: "x", yLabel: "y" });

    if (state.extrapolate) {
      ctx.save();
      ctx.fillStyle = "rgba(255,107,129,0.045)";
      const leftEdge = mapX(minX, xDomain, plot);
      const rightEdge = mapX(maxX, xDomain, plot);
      ctx.fillRect(plot.left, plot.top, leftEdge - plot.left, plot.height);
      ctx.fillRect(rightEdge, plot.top, plot.left + plot.width - rightEdge, plot.height);
      ctx.restore();
      drawText(ctx, "outside the data", plot.left + 8, plot.top + 12, withAlpha(LAB_COLORS.red, 0.9), "10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif");
    }

    if (state.showPI) drawBandWithY(ctx, plot, xDomain, yDomain, grid, piLower, piUpper, withAlpha(LAB_COLORS.cyan, 0.07));
    if (state.showCI) drawBandWithY(ctx, plot, xDomain, yDomain, grid, ciLower, ciUpper, withAlpha(LAB_COLORS.violet, 0.12));

    const lineY1 = fit.intercept + fit.slope * xDomain[0];
    const lineY2 = fit.intercept + fit.slope * xDomain[1];
    drawSegment(ctx, plot, mapX(xDomain[0], xDomain, plot), mapY(lineY1, yDomain, plot), mapX(xDomain[1], xDomain, plot), mapY(lineY2, yDomain, plot), LAB_COLORS.text, 2.2);

    points.forEach((p) => {
      drawCircle(ctx, mapX(p.x, xDomain, plot), mapY(p.y, yDomain, plot), 4.2, withAlpha(LAB_COLORS.muted, 0.72), "rgba(255,255,255,0.3)", 1);
    });

    const yhat = fit.intercept + fit.slope * state.x0;
    const seMean = fit.s * Math.sqrt(1 / n + (state.x0 - fit.xbar) ** 2 / fit.sxx);
    const sePred = fit.s * Math.sqrt(1 + 1 / n + (state.x0 - fit.xbar) ** 2 / fit.sxx);
    const ci = [yhat - tCrit * seMean, yhat + tCrit * seMean];
    const pi = [yhat - tCrit * sePred, yhat + tCrit * sePred];
    const x = mapX(state.x0, xDomain, plot);
    ctx.save();
    ctx.strokeStyle = withAlpha(LAB_COLORS.text, 0.55);
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x, plot.top);
    ctx.lineTo(x, plot.top + plot.height);
    ctx.stroke();
    ctx.restore();
    drawCircle(ctx, x, mapY(yhat, yDomain, plot), 5, LAB_COLORS.text, "#0b1220", 2);
    if (state.showCI) {
      ctx.save();
      ctx.strokeStyle = LAB_COLORS.violet;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, mapY(ci[0], yDomain, plot));
      ctx.lineTo(x, mapY(ci[1], yDomain, plot));
      ctx.stroke();
      ctx.restore();
    }
    if (state.showPI) {
      ctx.save();
      ctx.strokeStyle = LAB_COLORS.cyan;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, mapY(pi[0], yDomain, plot));
      ctx.lineTo(x, mapY(pi[1], yDomain, plot));
      ctx.stroke();
      ctx.restore();
    }

    const extrapolating = state.x0 < minX || state.x0 > maxX;
    const warning = extrapolating
      ? `<div class="lab-warning">${icon("info")}<span>This x is outside the observed data. The line is now an extrapolation, and the intervals are much wider. Treat it with caution.</span></div>`
      : "";
    setMetrics(
      warning +
      metricTile("Predicted y", yhat.toFixed(2), `At x = ${state.x0.toFixed(1)}`, true) +
      metricTile("CI width", (ci[1] - ci[0]).toFixed(2), "Mean response", false) +
      metricTile("PI width", (pi[1] - pi[0]).toFixed(2), "One new record", false) +
      metricTile("PI wider by", ((pi[1] - pi[0]) - (ci[1] - ci[0])).toFixed(2), "Extra observation noise", false) +
      metricTile("Data range", `${minX.toFixed(1)} to ${maxX.toFixed(1)}`, "Observed x", false) +
      metricTile("n", String(n), "Records", false) +
      metricTile("Residual SE", fit.s.toFixed(2), "s", false) +
      metricTile("Status", extrapolating ? "Extrapolation" : "Inside data", extrapolating ? "Be careful" : "Safer", false)
    );
  }
});

function leastSquaresData(state) {
  const rng = mulberry32(2400 + state.seed * 23);
  const points = [];
  for (let i = 1; i <= 11; i += 1) {
    const x = i;
    const y = clamp(1.8 + 1.25 * x + randomNormal(rng) * 1.1, 0.5, 19);
    points.push({ x, y });
  }
  if (state.outlier) points.push({ x: 10.4, y: 17.5, outlier: true });
  return points;
}

function intervalData(state) {
  const rng = mulberry32(3100 + state.seed * 29);
  const points = [];
  for (let i = 0; i < 30; i += 1) {
    const x = 0.5 + (i / 29) * 9.5;
    const y = 2.5 + 1.25 * x + randomNormal(rng) * 1.05;
    points.push({ x, y });
  }
  return points;
}
