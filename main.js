(function () {
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Intro overlay */
  var intro = document.getElementById("intro");
  if (intro) {
    window.addEventListener("load", function () {
      intro.classList.add("done");
      setTimeout(function () { intro.remove(); }, 2000);
    });
    /* safety: never trap the page if load stalls */
    setTimeout(function () { intro.classList.add("done"); }, 2600);
  }

  /* Nav scroll state + mobile menu */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.getElementById("navToggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Hero slideshow */
  var slides = document.querySelectorAll(".hero-slide");
  if (slides.length > 1 && !prefersReduced) {
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove("active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("active");
    }, 6000);
  }

  /* Rotating hero review quotes (same set as the review cards) */
  var quotes = [
    { text: "Scott cut our new driveway in a day and it came through winter without a single pothole.", name: "Grant M., Twizel" },
    { text: "Trenched the power to our shed and wired it up in the same visit. One call, all sorted.", name: "Karen H., Lake Ohau" },
    { text: "Turned up when he said he would, which counts for a lot out here. Tidy work, fair price.", name: "Mike T., Omarama" }
  ];
  var quoteEl = document.getElementById("heroQuote");
  var citeEl = document.getElementById("heroCite");
  var widget = document.getElementById("heroReview");
  if (quoteEl && citeEl && widget && !prefersReduced && quotes.length > 1) {
    var qi = 0;
    setInterval(function () {
      widget.classList.add("fading");
      setTimeout(function () {
        qi = (qi + 1) % quotes.length;
        quoteEl.textContent = "“" + quotes[qi].text + "”";
        citeEl.textContent = quotes[qi].name;
        widget.classList.remove("fading");
      }, 500);
    }, 6000);
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Gmail compose buttons (email built in JS so it can't be obfuscated) */
  document.querySelectorAll("a[data-gmail]").forEach(function (a) {
    var to = a.getAttribute("data-user") + "@" + a.getAttribute("data-domain");
    a.href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(to) +
      "&su=" + (a.getAttribute("data-su") || "") +
      "&body=" + (a.getAttribute("data-body") || "");
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* Footer year */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
