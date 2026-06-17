/* ============================================
   FileSure — Main Application Entry Point
   Event binding & bootstrap
   ============================================ */

// ─── State ──────────────────────────────────────────────
var currentSentimentFilter = "all";

// ─── Bootstrap ──────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  renderReviews(MOCK_REVIEWS);
  renderAlerts();
  renderKeywords();
  initCharts();
  bindEvents();
  animateKPICounters();
});

// ─── Event Binding ──────────────────────────────────────

function bindEvents() {
  // Mobile sidebar toggle
  var mobileMenuBtn = document.getElementById("mobileMenuBtn");
  var sidebar = document.getElementById("sidebar");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });
  }

  // Sentiment filter buttons
  var filterButtons = document.querySelectorAll(".sentiment-filter-btn");
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var filter = btn.dataset.filter;
      currentSentimentFilter = filter;

      if (filter === "all") {
        renderReviews(MOCK_REVIEWS);
      } else {
        renderReviews(
          MOCK_REVIEWS.filter(function (r) { return r.sentiment === filter; })
        );
      }
    });
  });

  // Time filter buttons (visual toggle for demo)
  var timeFilterBtns = document.querySelectorAll(".time-filter-btn:not(.sentiment-filter-btn)");
  timeFilterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var parent = btn.closest(".card-actions");
      if (parent) {
        parent.querySelectorAll(".time-filter-btn").forEach(function (b) {
          b.classList.remove("active");
        });
      }
      btn.classList.add("active");
      showToast("success", "Showing data for " + btn.textContent + " period");
    });
  });

  // Modal controls
  var modalOverlay = document.getElementById("responseModal");
  var modalCloseBtn = document.getElementById("modalCloseBtn");
  var modalCancelBtn = document.getElementById("modalCancelBtn");
  var modalSendBtn = document.getElementById("modalSendBtn");

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener("click", closeModal);
  if (modalSendBtn) modalSendBtn.addEventListener("click", sendResponse);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Nav item highlight
  document.querySelectorAll(".nav-item").forEach(function (item) {
    item.addEventListener("click", function () {
      document.querySelectorAll(".nav-item").forEach(function (n) {
        n.classList.remove("active");
      });
      item.classList.add("active");
      if (window.innerWidth < 768) {
        sidebar.classList.remove("open");
      }
    });
  });

  // Search box — real-time filtering
  var searchInput = document.querySelector(".search-box input");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      var query = e.target.value.toLowerCase();
      if (query.length === 0) {
        renderReviews(MOCK_REVIEWS);
        return;
      }
      var filtered = MOCK_REVIEWS.filter(function (r) {
        return (
          r.product.toLowerCase().includes(query) ||
          r.text.toLowerCase().includes(query) ||
          r.reviewer.toLowerCase().includes(query) ||
          r.platform.toLowerCase().includes(query)
        );
      });
      renderReviews(filtered);
    });
  }
}
