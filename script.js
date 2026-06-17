let currentSlide = CONFIG.startSlide;

function loadSlide() {
  const viewer = document.getElementById("viewer");

  // Cache-busting to detect updated PDF
  const timestamp = new Date().getTime();

  viewer.src = `dashboard.pdf#page=${currentSlide}&zoom=page-fit&t=${timestamp}`;
}

function nextSlide() {
  currentSlide++;

  if (currentSlide > CONFIG.endSlide) {
    currentSlide = CONFIG.startSlide;
  }

  loadSlide();
}

// Initial load
loadSlide();

// Rotate slides
setInterval(nextSlide, CONFIG.interval);

// Auto refresh entire page (detect new uploaded PDF)
setInterval(() => {
  location.reload(true);
}, CONFIG.refreshInterval);
