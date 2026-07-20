document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  let lenis = null;
  if (!prefersReducedMotion && typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

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
      if (lenis) {
        lenis.scrollTo(target, { offset: -20 });
      } else {
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    });
  });

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav a");

  const setActiveLink = () => {
    const scrollY = window.scrollY + 120;
    let currentId = "";

    sections.forEach((section) => {
      if (scrollY >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${currentId}`);
    });
  };

  if (lenis) {
    lenis.on("scroll", setActiveLink);
  } else {
    window.addEventListener("scroll", setActiveLink, { passive: true });
  }
  setActiveLink();

  const parallaxLines = document.querySelectorAll("[data-parallax]");
  if (!prefersReducedMotion && parallaxLines.length) {
    const updateParallax = () => {
      const y = window.scrollY;
      parallaxLines.forEach((line) => {
        const speed = Number(line.getAttribute("data-parallax")) || 0;
        line.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
    };

    if (lenis) {
      lenis.on("scroll", ({ scroll }) => {
        parallaxLines.forEach((line) => {
          const speed = Number(line.getAttribute("data-parallax")) || 0;
          line.style.transform = `translate3d(0, ${scroll * speed}px, 0)`;
        });
      });
    } else {
      window.addEventListener("scroll", updateParallax, { passive: true });
      updateParallax();
    }
  }

  const stackWrap = document.getElementById("stackTrackWrap");
  if (stackWrap && !prefersReducedMotion) {
    stackWrap.addEventListener(
      "wheel",
      (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        const maxScroll = stackWrap.scrollWidth - stackWrap.clientWidth;
        if (maxScroll <= 0) return;

        const atStart = stackWrap.scrollLeft <= 0 && event.deltaY < 0;
        const atEnd = stackWrap.scrollLeft >= maxScroll - 1 && event.deltaY > 0;
        if (atStart || atEnd) return;

        event.preventDefault();
        stackWrap.scrollLeft += event.deltaY;
      },
      { passive: false }
    );
  }

  const cursor = document.getElementById("cursorDot");
  if (cursor && isFinePointer && !prefersReducedMotion) {
    document.body.classList.add("has-cursor");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    window.addEventListener(
      "mousemove",
      (event) => {
        tx = event.clientX;
        ty = event.clientY;
        cursor.classList.add("is-on");
      },
      { passive: true }
    );

    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-link"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-link"));
    });

    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
});
