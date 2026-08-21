document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var visual = document.querySelector(".map-aerial");
  if (!visual) return;

  var popup = visual.querySelector(".map-popup");
  var popupZoom = popup.querySelector(".map-popup-zoom");
  var popupName = popup.querySelector(".map-popup-name");
  var popupDesc = popup.querySelector(".map-popup-desc");
  var points = visual.querySelectorAll(".map-point");
  var listItems = document.querySelectorAll(".map-list-item");

  var MAP_IMAGE = "images/map-aerial.jpg";
  var SOURCE_W = 1920;
  var SOURCE_H = 1080;
  var CONTENT_W = 968;
  var CONTENT_H = 1080;
  var ZOOM_SCALE = 1.6;
  var PREVIEW_SIZE = 200;

  function setZoom(pointEl) {
    var px = parseFloat(pointEl.dataset.px);
    var py = parseFloat(pointEl.dataset.py);
    var halfWindow = PREVIEW_SIZE / (2 * ZOOM_SCALE);
    var cx = Math.min(Math.max(px, halfWindow), CONTENT_W - halfWindow);
    var cy = Math.min(Math.max(py, halfWindow), CONTENT_H - halfWindow);
    var bgW = SOURCE_W * ZOOM_SCALE;
    var bgH = SOURCE_H * ZOOM_SCALE;
    var posX = -(cx * ZOOM_SCALE - PREVIEW_SIZE / 2);
    var posY = -(cy * ZOOM_SCALE - PREVIEW_SIZE / 2);

    popupZoom.style.backgroundImage = 'url("' + MAP_IMAGE + '")';
    popupZoom.style.backgroundSize = bgW + "px " + bgH + "px";
    popupZoom.style.backgroundPosition = posX + "px " + posY + "px";
  }

  function activate(area, pointEl) {
    popupName.textContent = pointEl.dataset.name;
    popupDesc.textContent = pointEl.dataset.desc;
    setZoom(pointEl);
    popup.style.left = pointEl.style.left;
    popup.style.top = pointEl.style.top;
    popup.classList.toggle("is-below", parseFloat(pointEl.style.top) < 50);
    popup.classList.add("is-visible");
    popup.setAttribute("aria-hidden", "false");

    points.forEach(function (p) {
      p.classList.toggle("is-active", p === pointEl);
    });
    listItems.forEach(function (li) {
      li.classList.toggle("is-active", li.dataset.area === area);
    });
  }

  function deactivate() {
    popup.classList.remove("is-visible");
    popup.setAttribute("aria-hidden", "true");
    points.forEach(function (p) {
      p.classList.remove("is-active");
    });
    listItems.forEach(function (li) {
      li.classList.remove("is-active");
    });
  }

  points.forEach(function (pointEl) {
    var area = pointEl.dataset.area;

    pointEl.addEventListener("mouseenter", function () {
      activate(area, pointEl);
    });
    pointEl.addEventListener("mouseleave", deactivate);
    pointEl.addEventListener("focus", function () {
      activate(area, pointEl);
    });
    pointEl.addEventListener("blur", deactivate);
    pointEl.addEventListener("click", function (e) {
      e.stopPropagation();
      if (pointEl.classList.contains("is-active")) {
        deactivate();
      } else {
        activate(area, pointEl);
      }
    });
  });

  listItems.forEach(function (li) {
    var area = li.dataset.area;
    var pointEl = visual.querySelector('.map-point[data-area="' + area + '"]');
    if (!pointEl) return;

    li.addEventListener("mouseenter", function () {
      activate(area, pointEl);
    });
    li.addEventListener("mouseleave", deactivate);
    li.addEventListener("click", function (e) {
      e.stopPropagation();
      if (li.classList.contains("is-active")) {
        deactivate();
      } else {
        activate(area, pointEl);
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (!visual.contains(e.target) && !e.target.closest(".map-list-item")) {
      deactivate();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  var lightboxImage = lightbox.querySelector(".lightbox-image");
  var lightboxName = lightbox.querySelector(".lightbox-caption-name");
  var lightboxNote = lightbox.querySelector(".lightbox-caption-note");
  var closeBtn = lightbox.querySelector(".lightbox-close");
  var triggers = document.querySelectorAll(".space-photo-trigger, .tebiki-photo-trigger, .scene-photo-trigger");

  function openLightbox(trigger) {
    var img = trigger.querySelector("img");
    lightboxImage.src = img.getAttribute("src");
    lightboxImage.alt = img.getAttribute("alt");
    lightboxName.textContent = trigger.dataset.name;
    lightboxNote.textContent = trigger.dataset.note;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openLightbox(trigger);
    });
  });

  closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
});
