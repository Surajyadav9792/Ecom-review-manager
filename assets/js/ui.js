/* ============================================
   FileSure — UI Rendering & Interactions
   DOM rendering, modal, toast, helper functions
   ============================================ */

// ─── Helper Functions ───────────────────────────────────

function renderStars(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += '<span class="' + (i <= rating ? "" : "empty") + '">★</span>';
  }
  return '<div class="stars">' + html + "</div>";
}

function sentimentIcon(sentiment) {
  var icons = { positive: "↑", negative: "↓", neutral: "→" };
  return icons[sentiment] || "";
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatStatus(status) {
  var labels = {
    responded: "✓ Responded",
    pending: "● Pending",
    urgent: "! Urgent",
  };
  return labels[status] || status;
}

function escapeHtml(str) {
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function generateResponseHint(review) {
  if (review.sentiment === "negative") {
    return (
      "We're sorry to hear about your experience with " +
      review.product +
      ". We'd like to resolve this for you..."
    );
  }
  if (review.sentiment === "neutral") {
    return (
      "Thank you for your honest feedback about " +
      review.product +
      ". We'd like to address your concerns..."
    );
  }
  return "Thank you for your wonderful review of " + review.product + "!";
}

// ─── Render: Reviews Table ──────────────────────────────

function renderReviews(reviews) {
  var tbody = document.getElementById("reviewsTableBody");
  if (!tbody) return;

  tbody.innerHTML = reviews
    .map(function (r) {
      return (
        '<tr>' +
        '<td><div class="review-product">' +
        '<div class="review-product-thumb">' + r.productIcon + '</div>' +
        '<span class="review-product-name">' + r.product + '</span>' +
        '</div></td>' +
        '<td class="review-text" title="' + escapeHtml(r.text) + '">' + escapeHtml(r.text) + '</td>' +
        '<td>' + renderStars(r.rating) + '</td>' +
        '<td><span class="sentiment-badge ' + r.sentiment + '">' + sentimentIcon(r.sentiment) + ' ' + capitalize(r.sentiment) + '</span></td>' +
        '<td><span class="platform-badge">' + r.platform + '</span></td>' +
        '<td><span class="response-status ' + r.responseStatus + '">' + formatStatus(r.responseStatus) + '</span></td>' +
        '<td><button class="action-btn' + (r.responseStatus === "urgent" ? " primary" : "") + '" onclick="openResponseModal(' + r.id + ')">' +
        (r.responseStatus === "responded" ? "View" : "Respond") +
        '</button></td>' +
        '</tr>'
      );
    })
    .join("");
}

// ─── Render: Alerts ─────────────────────────────────────

function renderAlerts() {
  var container = document.getElementById("alertsList");
  if (!container) return;

  container.innerHTML = ALERTS.map(function (a) {
    return (
      '<div class="alert-item ' + (a.type === "urgent" ? "" : a.type) + '">' +
      '<span class="alert-icon">' + a.icon + '</span>' +
      '<div class="alert-content">' +
      '<div class="alert-title">' + a.title + '</div>' +
      '<div class="alert-desc">' + a.desc + '</div>' +
      '</div>' +
      '<span class="alert-time">' + a.time + '</span>' +
      '</div>'
    );
  }).join("");
}

// ─── Render: Keywords Cloud ─────────────────────────────

function renderKeywords() {
  var container = document.getElementById("keywordsCloud");
  if (!container) return;

  container.innerHTML = KEYWORDS.map(function (k) {
    return '<span class="keyword-tag ' + k.size + " " + k.type + '">' + k.text + "</span>";
  }).join("");
}

// ─── KPI Counter Animation ─────────────────────────────

function animateKPICounters() {
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || "";
    var prefix = el.dataset.prefix || "";
    var isDecimal = String(target).includes(".");
    var duration = 1200;
    var startTime = performance.now();

    function updateCounter(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 3);
      var current = target * easeOut;

      if (isDecimal) {
        el.textContent = prefix + current.toFixed(1) + suffix;
      } else {
        el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

// ─── Modal ──────────────────────────────────────────────

var currentReviewForResponse = null;

function openResponseModal(reviewId) {
  currentReviewForResponse = MOCK_REVIEWS.find(function (r) { return r.id === reviewId; });
  var overlay = document.getElementById("responseModal");
  if (!overlay || !currentReviewForResponse) return;

  var review = currentReviewForResponse;
  document.getElementById("modalReviewerName").textContent = review.reviewer;
  document.getElementById("modalProductName").textContent = review.product;
  document.getElementById("modalReviewText").textContent = review.text;
  document.getElementById("modalRating").innerHTML = renderStars(review.rating);

  var textarea = document.getElementById("responseText");
  if (review.responseStatus === "responded") {
    textarea.value =
      "Thank you for your feedback! We appreciate your review and are glad you enjoyed the product.";
  } else {
    textarea.value = "";
    textarea.placeholder = generateResponseHint(review);
  }

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  var overlay = document.getElementById("responseModal");
  if (!overlay) return;
  overlay.classList.remove("active");
  document.body.style.overflow = "";
  currentReviewForResponse = null;
}

function sendResponse() {
  var responseText = document.getElementById("responseText").value.trim();
  if (!responseText) {
    showToast("error", "Please enter a response before sending.");
    return;
  }

  if (currentReviewForResponse) {
    currentReviewForResponse.responseStatus = "responded";
    renderReviews(
      currentSentimentFilter === "all"
        ? MOCK_REVIEWS
        : MOCK_REVIEWS.filter(function (r) { return r.sentiment === currentSentimentFilter; })
    );
  }

  closeModal();
  showToast("success", "Response sent successfully! The reviewer will be notified.");
}

// ─── Toast Notifications ────────────────────────────────

function showToast(type, message) {
  var container = document.getElementById("toastContainer");
  if (!container) return;

  var icons = { success: "✅", error: "❌", warning: "⚠️" };

  var toast = document.createElement("div");
  toast.className = "toast " + type;
  toast.innerHTML =
    '<span class="toast-icon">' + (icons[type] || "ℹ️") + "</span>" +
    '<span class="toast-message">' + message + "</span>" +
    '<button class="toast-close" onclick="this.parentElement.remove()">✕</button>';
  container.appendChild(toast);

  setTimeout(function () {
    if (toast.parentElement) {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(40px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(function () { toast.remove(); }, 300);
    }
  }, 4000);
}
