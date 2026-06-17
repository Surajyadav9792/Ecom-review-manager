/* ============================================
   FileSure — Chart Initialization
   Chart.js configuration for all dashboard charts
   ============================================ */

/**
 * Shared Chart.js tooltip config for consistent styling.
 */
const CHART_TOOLTIP = {
  backgroundColor: "#1e1e2e",
  titleColor: "#f1f5f9",
  bodyColor: "#94a3b8",
  borderColor: "rgba(255,255,255,0.08)",
  borderWidth: 1,
  padding: 12,
  cornerRadius: 8,
  titleFont: { weight: "600", family: "Inter" },
  bodyFont: { family: "Inter" },
};

/**
 * Initialise the Review Trends line chart.
 */
function initTrendChart() {
  const ctx = document.getElementById("trendChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: MONTHLY_REVIEW_DATA.labels,
      datasets: [
        {
          label: "Positive",
          data: MONTHLY_REVIEW_DATA.positive,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.08)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#22c55e",
        },
        {
          label: "Neutral",
          data: MONTHLY_REVIEW_DATA.neutral,
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245,158,11,0.05)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#f59e0b",
        },
        {
          label: "Negative",
          data: MONTHLY_REVIEW_DATA.negative,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.05)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#ef4444",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            color: "#94a3b8",
            font: { size: 11, family: "Inter" },
            usePointStyle: true,
            pointStyle: "circle",
            padding: 16,
          },
        },
        tooltip: CHART_TOOLTIP,
      },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.04)", drawBorder: false },
          ticks: { color: "#64748b", font: { size: 11, family: "Inter" } },
        },
        y: {
          grid: { color: "rgba(255,255,255,0.04)", drawBorder: false },
          ticks: { color: "#64748b", font: { size: 11, family: "Inter" } },
          beginAtZero: true,
        },
      },
    },
  });
}

/**
 * Initialise the Sentiment Distribution doughnut chart.
 */
function initSentimentChart() {
  const ctx = document.getElementById("sentimentChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Positive", "Neutral", "Negative"],
      datasets: [
        {
          data: [72, 18, 10],
          backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
          borderColor: "transparent",
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#94a3b8",
            font: { size: 11, family: "Inter" },
            usePointStyle: true,
            pointStyle: "circle",
            padding: 16,
          },
        },
        tooltip: {
          ...CHART_TOOLTIP,
          callbacks: {
            label: function (context) {
              return ` ${context.label}: ${context.parsed}%`;
            },
          },
        },
      },
    },
  });
}

/**
 * Boot all charts.
 */
function initCharts() {
  initTrendChart();
  initSentimentChart();
}
