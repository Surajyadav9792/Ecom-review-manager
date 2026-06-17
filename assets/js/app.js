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

  // Time filter buttons (updates Chart.js data)
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
      
      var range = btn.getAttribute("data-range");
      if (range) {
        updateTrendChart(range);
      }
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

  // Nav item interactions (Fully functional wireframe routing)
  document.querySelectorAll(".nav-item").forEach(function (item) {
    item.addEventListener("click", function () {
      // Visual active state toggle
      document.querySelectorAll(".nav-item").forEach(function (n) {
        n.classList.remove("active");
      });
      item.classList.add("active");
      
      // Close sidebar on mobile
      if (window.innerWidth < 768) {
        var sidebar = document.getElementById("sidebar");
        if (sidebar) sidebar.classList.remove("open");
      }

      var id = item.id;
      if (id === "nav-dashboard") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        renderReviews(MOCK_REVIEWS);
        document.querySelectorAll(".sentiment-filter-btn").forEach(function (b) {
          if (b.dataset.filter === "all") b.classList.add("active");
          else b.classList.remove("active");
        });
        showToast("success", "Viewing main intelligence dashboard");
      }
      else if (id === "nav-reviews") {
        var reviewsSection = document.querySelector(".reviews-table-card");
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        renderReviews(MOCK_REVIEWS);
        document.querySelectorAll(".sentiment-filter-btn").forEach(function (b) {
          if (b.dataset.filter === "all") b.classList.add("active");
          else b.classList.remove("active");
        });
        showToast("success", "Viewing all customer reviews");
      }
      else if (id === "nav-analytics") {
        var chartsSection = document.querySelector(".charts-grid");
        if (chartsSection) {
          chartsSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        showToast("success", "Viewing review trend analytics");
      }
      else if (id === "nav-products") {
        var keywordsSection = document.getElementById("keywordsCloud");
        if (keywordsSection) {
          keywordsSection.closest(".card").scrollIntoView({ behavior: "smooth", block: "center" });
        }
        showToast("success", "Showing product performance & trending keywords");
      }
      else if (id === "nav-amazon" || id === "nav-flipkart" || id === "nav-google" || id === "nav-trustpilot") {
        var platformName = id.replace("nav-", "");
        var platformDisplayNames = {
          amazon: "Amazon",
          flipkart: "Flipkart",
          google: "Google Reviews",
          trustpilot: "Trustpilot"
        };
        var displayName = platformDisplayNames[platformName];
        
        // Filter reviews table by platform
        var filteredReviews = MOCK_REVIEWS.filter(function (r) {
          return r.platform.toLowerCase() === platformName;
        });
        
        renderReviews(filteredReviews);
        
        // Reset sentiment filter buttons
        document.querySelectorAll(".sentiment-filter-btn").forEach(function (b) {
          b.classList.remove("active");
        });
        
        // Scroll to table
        var reviewsSection = document.querySelector(".reviews-table-card");
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        
        showToast("success", "Filtered reviews by " + displayName);
      }
      else if (id === "nav-integrations") {
        var platformsSection = document.querySelector(".platforms-grid");
        if (platformsSection) {
          platformsSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        showToast("success", "Viewing connected review platforms");
      }
      else if (id === "nav-settings") {
        showToast("warning", "Settings panel is a simulated wireframe demo");
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
