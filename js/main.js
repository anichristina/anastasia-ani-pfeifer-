/* Ani Pfeifer — portfolio
   Everything animated lives here. Needs gsap + ScrollTrigger (loaded before this file). */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof gsap !== "undefined";
  if (hasGSAP && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
  if (hasGSAP) gsap.ticker.lagSmoothing(0);
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };

  /* ── helpers ─────────────────────────────── */
  /* ── menu ────────────────────────────────── */
  function initMenu() {
    var btn = $(".menu-btn"), menu = $(".menu");
    if (!btn || !menu) return;
    var closeBtn = $(".menu-close", menu), links = $$("a.big", menu);
    var open = false, lastFocus = null, tl = null;
    function setOpen(v) {
      open = v; btn.setAttribute("aria-expanded", v);
      if (v) { lastFocus = document.activeElement; menu.classList.add("is-open"); menu.removeAttribute("aria-hidden"); document.documentElement.style.overflow = "hidden"; }
      if (!hasGSAP || reduce) {
        menu.style.clipPath = v ? "none" : "inset(0 0 100% 0)";
        if (!v) { menu.classList.remove("is-open"); menu.setAttribute("aria-hidden", "true"); document.documentElement.style.overflow = ""; }
        if (v && links[0]) links[0].focus();
        return;
      }
      if (tl) tl.kill();
      tl = gsap.timeline();
      if (v) {
        tl.to(menu, { clipPath: "inset(0 0 0% 0)", duration: .7, ease: "power3.inOut" })
          .fromTo(links, { yPercent: 110, rotation: 4 }, { yPercent: 0, rotation: 0, duration: .6, stagger: .06, ease: "power3.out" }, "-=.3")
          .add(function () { if (links[0]) links[0].focus({ preventScroll: true }); });
      } else {
        tl.to(menu, { clipPath: "inset(100% 0 0 0)", duration: .55, ease: "power3.inOut" })
          .add(function () { menu.classList.remove("is-open"); menu.setAttribute("aria-hidden", "true"); gsap.set(menu, { clipPath: "inset(0 0 100% 0)" }); document.documentElement.style.overflow = ""; if (lastFocus) lastFocus.focus({ preventScroll: true }); });
      }
    }
    menu.setAttribute("aria-hidden", "true");
    btn.addEventListener("click", function () { setOpen(true); });
    if (closeBtn) closeBtn.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) setOpen(false); });
  }

  /* ── page wipe ───────────────────────────── */
  function initWipe() {
    var wipe = $(".wipe");
    if (!wipe || !hasGSAP || reduce) { if (wipe) wipe.style.display = "none"; return { reveal: function (cb) { cb && cb(); } }; }
    var off = function () { return window.innerHeight + parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--strip-h") || 160) + 200; };
    function reveal(cb) {
      gsap.to(wipe, { y: off(), duration: .85, ease: "power3.inOut", delay: .05, onComplete: function () { wipe.style.visibility = "hidden"; cb && cb(); } });
    }
    function cover(href) {
      wipe.style.visibility = "visible";
      gsap.fromTo(wipe, { y: -off() }, { y: 0, duration: .7, ease: "power3.inOut", onComplete: function () { window.location.href = href; } });
    }
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== "_self") return;
      var u = new URL(a.href, location.href);
      if (u.origin !== location.origin || (u.pathname === location.pathname && u.hash)) return;
      e.preventDefault(); cover(a.href);
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) { wipe.style.visibility = "hidden"; gsap.set(wipe, { y: off() }); } });
    return { reveal: reveal };
  }

  function introLanding() {
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".top", { yPercent: -100, duration: .6 })
      .from(".top .logo, .tab, .ig, .menu-btn", { scale: 0, rotation: function () { return rnd(-14, 14); }, stagger: .07, duration: .55, ease: "back.out(2.2)" }, "<.1")
      .from(".name.left", { xPercent: -40, opacity: 0, duration: .8 }, "<.1")
      .from(".name.right", { xPercent: 40, opacity: 0, duration: .8 }, "<")
      .from(".portrait .faces", { yPercent: 14, opacity: 0, duration: .9 }, "<.05")
      .from(".roles", { opacity: 0, y: 14, duration: .6 }, "<.4");
    var ul = $(".name .ani path");
    if (ul) {
      var len = ul.getTotalLength();
      gsap.set(ul, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(ul, { strokeDashoffset: 0, duration: .7, ease: "power2.inOut" }, "-=.2");
    }
    return tl;
  }

  function introSection() {
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".top", { yPercent: -100, duration: .5 })
      .from(".top .logo, .tab, .ig, .menu-btn", { scale: 0, rotation: function () { return rnd(-14, 14); }, stagger: .08, duration: .5, ease: "back.out(2.2)" }, "<.1")
      .from(".page-title span", { yPercent: 105, rotation: 3, duration: .8 }, "<.1");
    return tl;
  }

  function scrollMotion() {
    if (!hasGSAP || reduce || typeof ScrollTrigger === "undefined") return;
    // tiles
    if ($$(".tile").length) {
      ScrollTrigger.batch(".tile", {
        start: "top 92%", once: true,
        onEnter: function (b) { gsap.from(b, { y: 60, opacity: 0, rotation: function () { return rnd(-2.5, 2.5); }, duration: .8, stagger: .12, ease: "power3.out" }); }
      });
    }
    // about
    if ($(".about")) {
      gsap.from(".about h2", { y: 50, opacity: 0, stagger: .06, duration: .7, ease: "back.out(1.6)", scrollTrigger: { trigger: ".about h2", start: "top 85%", once: true } });
      gsap.from(".about p", { y: 36, opacity: 0, stagger: .15, duration: .8, ease: "power3.out", scrollTrigger: { trigger: ".about p", start: "top 88%", once: true } });
      gsap.from(".casual", { x: 90, rotation: 7, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".casual", start: "top 92%", once: true } });
      var pens = $$(".casual .pen path");
      if (pens.length) gsap.fromTo(pens, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, stagger: .35, ease: "power2.inOut", scrollTrigger: { trigger: ".casual", start: "top 80%", once: true } });
    }
    // parallax: portrait lags
    if ($(".hero")) {
      gsap.to(".portrait .faces", { y: 36, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .6 } });
    }
  }

  function initPortrait() {
    var wrap = $(".faces");
    if (!wrap) return;
    var base = $("img", wrap);
    // Face swap: list extra face PNGs (same canvas size, same position) in data-faces="img/face-2.webp,img/face-3.webp"
    var extra = (wrap.dataset.faces || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var faces = [base];
    extra.forEach(function (src) { var i = new Image(); i.src = src; i.alt = ""; i.className = "face-alt"; i.setAttribute("aria-hidden", "true"); wrap.appendChild(i); faces.push(i); });
    var cur = 0;
    function show(n) { faces[cur].style.opacity = 0; cur = n; faces[cur].style.opacity = 1; }
    if (faces.length > 1 && !reduce) {
      (function loop() {
        setTimeout(function () { show((cur + 1) % faces.length); loop(); }, rnd(900, 1900));
      })();
      wrap.addEventListener("mouseenter", function () { show((cur + 1) % faces.length); });
    }
    if (!hasGSAP || reduce) return;
    // stop-motion paper-cut wobble
    gsap.fromTo(wrap, { rotation: -1.3 }, { rotation: 1.3, duration: .5, ease: "steps(3)", yoyo: true, repeat: -1, delay: 1.4 });
    // pointer drift
    if (window.matchMedia("(pointer: fine)").matches) {
      var qx = gsap.quickTo(wrap.parentNode, "x", { duration: .8, ease: "power3" });
      var hero = $(".hero");
      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        qx(((e.clientX - r.left) / r.width - .5) * 26);
      });
    }
  }

  function initHovers() {
    if (!hasGSAP || reduce) return;
    $$(".tab").forEach(function (t) {
      t.addEventListener("mouseenter", function () { gsap.fromTo(t, { rotation: -4 }, { rotation: 0, duration: .8, ease: "elastic.out(1,.3)" }); });
    });
  }

  /* ── brush ripples: rings pulse outward from the middle, endlessly ── */
  function initRipples() {
    var box = $(".ripples");
    if (!box) return;
    var BASE = document.documentElement.getAttribute("data-base") || "";
    var srcs = [BASE + "img/ring-1.webp", BASE + "img/ring-2.webp", BASE + "img/ring-3.webp"];
    var N = 5, DUR = 7.5, rings = [];
    for (var i = 0; i < N; i++) {
      var d = document.createElement("div"); d.className = "ring";
      var im = new Image(); im.src = srcs[i % srcs.length]; im.alt = ""; d.appendChild(im);
      box.appendChild(d); rings.push(d);
    }
    if (!hasGSAP || reduce) {                       // still frame
      rings.forEach(function (r, i) { r.style.transform = "scale(" + (.45 + i * .55) + ")"; r.style.opacity = i < 4 ? .8 : 0; });
      return;
    }
    rings.forEach(function (r, i) {
      var tl = gsap.timeline({ repeat: -1, delay: 0 });
      tl.fromTo(r, { scale: .06, opacity: 0, rotation: function () { return rnd(-6, 6); } },
                   { scale: 3.3, duration: DUR, ease: "power1.in" }, 0)
        .to(r, { opacity: .95, duration: DUR * .22, ease: "power1.out" }, 0)
        .to(r, { opacity: 0, duration: DUR * .45, ease: "power1.in" }, DUR * .55);
      tl.progress(((i / N) + .0) % 1);           // spread them out from the first frame
    });
  }

  /* shrink tab / button labels until they sit inside their drawn boxes */
  function fitTabs() {
    $$(".tab").forEach(function (t) {
      var sp = t.firstElementChild; if (!sp) return;
      t.style.fontSize = ""; var fs = parseFloat(getComputedStyle(t).fontSize);
      var maxW = t.clientWidth * .84, maxH = t.clientHeight * .8, n = 0;
      while ((sp.scrollWidth > maxW || sp.offsetHeight > maxH) && n++ < 40) { fs *= .96; t.style.fontSize = fs + "px"; }
    });
  }

  /* photo gallery lightbox */
  function initLightbox() {
    var shots = $$("a.shot[data-lb]"); if (!shots.length) return;
    var lb = document.createElement("div"); lb.className = "lb"; lb.setAttribute("role", "dialog"); var LBT = {nl: ["Fotoweergave", "Sluiten", "Vorige", "Volgende"], de: ["Fotoansicht", "Schließen", "Zurück", "Weiter"]}[document.documentElement.lang] || ["Photo viewer", "Close", "Previous", "Next"];
    lb.setAttribute("aria-label", LBT[0]);
    lb.innerHTML = '<img alt=""><button class="x" aria-label="' + LBT[1] + '">' + LBT[1] + '</button><button class="p" aria-label="' + LBT[2] + '">&lt;</button><button class="n" aria-label="' + LBT[3] + '">&gt;</button>';
    document.body.appendChild(lb);
    var img = $("img", lb), cur = 0;
    function show(i) { cur = (i + shots.length) % shots.length; img.src = shots[cur].href; img.alt = $("img", shots[cur]).alt; lb.classList.add("on"); }
    function hide() { lb.classList.remove("on"); }
    shots.forEach(function (a, i) { a.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); show(i); }); });
    $(".x", lb).onclick = hide; $(".p", lb).onclick = function () { show(cur - 1); }; $(".n", lb).onclick = function () { show(cur + 1); };
    lb.addEventListener("click", function (e) { if (e.target === lb) hide(); });
    document.addEventListener("keydown", function (e) { if (!lb.classList.contains("on")) return; if (e.key === "Escape") hide(); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });
  }

  /* ── boot ────────────────────────────────── */
  function boot() {
    initRipples();
    initLightbox();
    fitTabs();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTabs);
    initMenu();
    initPortrait();
    initSparkles();
    initHovers();
    var wipe = initWipe();
    var run = function () {
      if (hasGSAP && !reduce) {
        if ($(".hero")) introLanding(); else if ($(".page-title")) introSection(); else gsap.from(".top", { yPercent: -100, duration: .5 });
      }
      scrollMotion();
    };
    if (hasGSAP && !reduce && $(".wipe")) { gsap.set($(".wipe"), { y: 0 }); wipe.reveal(); gsap.delayedCall(.35, run); } else run();

    var t; window.addEventListener("resize", function () {
      clearTimeout(t); t = setTimeout(function () {
        fitTabs();
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      }, 250);
    });
  }


  /* click sprinkle: hand-drawn stars fly out of the pointer and fade */
  var STAR_S = ["M60.6 11.8L73.7 42.7L107.4 44.6L80.7 67.1L87.5 101.8L59.7 81.6L29.3 99.3L39.1 66.3L13.1 44.5L47.6 41.6Z", "M48.4 9.9L68.0 39.4L103.5 34.6L81.0 61.6L98.7 92.6L65.0 81.2L40.7 105.9L41.0 72.1L9.2 56.3L43.8 46.0Z", "M40.4 12.9L64.7 39.4L97.1 26.8L81.1 57.7L101.5 84.9L68.9 80.0L49.3 110.0L42.8 74.3L9.5 65.1L41.4 49.5Z", "M81.5 12.7L78.5 49.4L109.0 66.6L75.5 75.7L69.3 111.1L50.6 79.7L14.8 85.1L38.5 57.0L22.1 26.8L55.9 37.9Z"];
  var STAR_O = [["M41.9 13.0L65.4 39.3L100.0 29.4L81.3 58.7L102.5 86.7L68.0 80.8L47.5 107.0L42.6 74.1L10.0 62.9L41.4 47.7Z", "M42.9 14.6L65.4 39.7L97.9 30.1L81.9 58.7L99.3 86.1L67.6 79.1L47.2 106.6L44.1 73.7L13.0 62.9L42.6 49.0Z"], ["M47.2 12.7L67.9 39.8L101.4 32.9L81.3 61.5L99.6 90.7L65.4 80.6L41.9 106.1L41.5 71.7L8.4 56.8L43.5 45.7Z", "M47.5 11.0L68.2 41.0L102.8 33.7L82.1 61.4L96.3 91.9L65.3 81.3L42.6 103.4L41.5 70.8L9.4 57.0L43.4 46.5Z"], ["M78.3 12.1L78.1 48.4L111.7 62.6L76.4 74.3L73.5 107.4L52.0 79.9L18.3 88.0L38.2 58.9L22.3 27.8L54.3 39.2Z", "M77.8 12.5L77.9 48.1L110.8 62.3L76.8 74.0L72.1 105.5L52.3 80.4L19.2 86.6L39.6 58.9L22.9 30.8L54.2 39.1Z"]];
  function initSparkles() {
    if (!hasGSAP || reduce) return;
    var NS = "http://www.w3.org/2000/svg", i;
    function make(solid, col) {
      var el = document.createElementNS(NS, "svg"), p, k;
      el.setAttribute("viewBox", "0 0 120 120"); el.setAttribute("class", "spark");
      if (solid) {
        p = document.createElementNS(NS, "path"); p.setAttribute("d", STAR_S[Math.floor(Math.random() * 4)]);
        p.setAttribute("fill", col); p.setAttribute("stroke", col === "#fff" ? "#ff00bf" : "#fff"); p.setAttribute("stroke-width", "7"); p.setAttribute("stroke-linejoin", "round"); p.setAttribute("paint-order", "stroke");
        el.appendChild(p);
      } else {
        var o = STAR_O[Math.floor(Math.random() * 3)];
        for (k = 0; k < o.length; k++) {
          p = document.createElementNS(NS, "path"); p.setAttribute("d", o[k]); p.setAttribute("fill", "none");
          p.setAttribute("stroke", col); p.setAttribute("stroke-width", "5"); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); el.appendChild(p);
        }
      }
      return el;
    }
    document.addEventListener("pointerdown", function (e) {
      if (e.button > 0) return;
      var n = 12;
      for (i = 0; i < n; i++) {
        var solid = i % 3 !== 0, col = ["#fff", "#ff00bf", "#fff", "#ffb3ec"][i % 4];
        if (!solid) col = i % 2 ? "#fff" : "#ff00bf";
        var el = make(solid, col); document.body.appendChild(el);
        var ang = (i / n) * Math.PI * 2 + Math.random() * .6, dist = 55 + Math.random() * 90, sc = .55 + Math.random() * .9;
        gsap.fromTo(el, { x: e.clientX, y: e.clientY, scale: 0, rotation: Math.random() * 90 - 45, opacity: 1 },
          { x: e.clientX + Math.cos(ang) * dist, y: e.clientY + Math.sin(ang) * dist + 14, scale: sc, rotation: "+=" + (Math.random() * 200 - 100),
            duration: .85 + Math.random() * .4, ease: "power3.out", onComplete: function () { if (this.targets()[0].parentNode) this.targets()[0].remove(); } });
        gsap.to(el, { opacity: 0, delay: .35, duration: .6 + Math.random() * .3, ease: "power1.in" });
      }
    }, { passive: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  // failsafe: never leave the page covered
  window.addEventListener("load", function () {
    setTimeout(function () { var w = $(".wipe"); if (w && w.getBoundingClientRect().top <= 0 && w.getBoundingClientRect().bottom >= window.innerHeight - 1 && !(window.gsap && gsap.isTweening(w))) w.style.visibility = "hidden"; }, 4000);
  });
})();
