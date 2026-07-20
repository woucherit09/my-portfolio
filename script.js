document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const isCompact = window.matchMedia("(max-width: 900px)").matches;
  const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  // Lenis fights native touch scrolling and causes jank/freezes on phones.
  let lenis = null;
  if (!prefersReducedMotion && !isTouchDevice && !isCompact && typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    if (hasGsap) {
      lenis.on("scroll", () => ScrollTrigger.update());
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  const splitLines = () => {
    document.querySelectorAll("[data-split]").forEach((line) => {
      const text = line.textContent || "";
      line.textContent = "";
      [...text].forEach((char) => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = char === " " ? "\u00A0" : char;
        line.appendChild(span);
      });
    });
  };

  splitLines();

  const runLoaderAndHero = () => {
    if (!hasGsap || prefersReducedMotion) {
      document.body.classList.remove("is-loading");
      const loader = document.getElementById("loader");
      if (loader) loader.remove();
      document.querySelectorAll(".header, .hero-eyebrow, .hero-bottom, .hero-rail, .scroll-cue, .char, [data-reveal], [data-reveal-title]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const loader = document.getElementById("loader");
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        document.body.classList.remove("is-loading");
        if (loader) {
          loader.classList.add("is-done");
          loader.remove();
        }
      },
    });

    tl.to(".loader-mark", { scale: 1, duration: 0.45 })
      .to(".loader-brand", { clipPath: "inset(0 0% 0 0)", duration: 0.55 }, "-=0.15")
      .to(".loader-bar-fill", { width: "100%", duration: 0.7 }, "-=0.2")
      .to(loader, { yPercent: -100, duration: 0.85, ease: "power4.inOut" })
      .to(".header", { y: 0, duration: 0.7 }, "-=0.35")
      .to(".hero-eyebrow", { opacity: 1, duration: 0.5 }, "-=0.35")
      .to(".hero-line .char", { y: 0, duration: 0.85, stagger: 0.028, ease: "power4.out" }, "-=0.35")
      .to([".hero-bottom", ".hero-rail", ".scroll-cue"], { opacity: 1, duration: 0.7, stagger: 0.08 }, "-=0.4");
  };

  runLoaderAndHero();

  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Открыть меню");
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -20 });
      else target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav a");
  const progress = document.getElementById("scrollProgress");

  const onScrollUpdate = () => {
    const scrollY = (lenis ? lenis.scroll : window.scrollY) + 120;
    let currentId = "";
    sections.forEach((section) => {
      if (scrollY >= section.offsetTop) currentId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? ((lenis ? lenis.scroll : window.scrollY) / max) * 100 : 0;
      progress.style.width = `${Math.min(100, Math.max(0, value))}%`;
    }
  };

  if (lenis) lenis.on("scroll", onScrollUpdate);
  else window.addEventListener("scroll", onScrollUpdate, { passive: true });
  onScrollUpdate();

  if (hasGsap && !prefersReducedMotion) {
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });

    gsap.utils.toArray("[data-reveal-title]").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
        },
      });
    });

    ScrollTrigger.refresh();
  }

  if (isFinePointer && !prefersReducedMotion) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (event) => {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.28}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0)";
        el.style.transition = "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)";
        window.setTimeout(() => {
          el.style.transition = "";
        }, 450);
      });
    });
  }

  const cursor = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (cursor && ring && isFinePointer && !prefersReducedMotion) {
    document.body.classList.add("has-cursor");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let rx = x;
    let ry = y;

    window.addEventListener(
      "mousemove",
      (event) => {
        tx = event.clientX;
        ty = event.clientY;
        cursor.classList.add("is-on");
        ring.classList.add("is-on");
      },
      { passive: true }
    );

    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("is-link");
        ring.classList.add("is-link");
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-link");
        ring.classList.remove("is-link");
      });
    });

    const tick = () => {
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const projectModal = document.getElementById("projectModal");
  const privateTriggers = document.querySelectorAll("[data-private-project]");
  const backdrop = projectModal?.querySelector(".project-modal-backdrop");
  const dialog = projectModal?.querySelector(".project-modal-dialog");

  const openProjectModal = () => {
    if (!projectModal) return;
    projectModal.hidden = false;
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();

    if (hasGsap && !prefersReducedMotion) {
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.35 });
      gsap.fromTo(
        dialog,
        { opacity: 0, y: 24, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" }
      );
    } else if (backdrop && dialog) {
      backdrop.style.opacity = "1";
      dialog.style.opacity = "1";
      dialog.style.transform = "none";
    }

    projectModal.querySelector(".project-modal-close")?.focus();
  };

  const closeProjectModal = () => {
    if (!projectModal) return;

    const finish = () => {
      projectModal.hidden = true;
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    };

    if (hasGsap && !prefersReducedMotion) {
      gsap.to(backdrop, { opacity: 0, duration: 0.25 });
      gsap.to(dialog, {
        opacity: 0,
        y: 16,
        scale: 0.98,
        duration: 0.28,
        ease: "power2.in",
        onComplete: finish,
      });
    } else {
      finish();
    }
  };

  privateTriggers.forEach((trigger) => trigger.addEventListener("click", openProjectModal));

  if (projectModal) {
    projectModal.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", closeProjectModal);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !projectModal.hidden) closeProjectModal();
    });
  }

  window.addEventListener("resize", () => {
    if (hasGsap) ScrollTrigger.refresh();
  });
});
