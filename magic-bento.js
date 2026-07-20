/**
 * MagicBento — vanilla port of the React Bits interactive bento grid.
 * Bound to #stackGrid cards inside the Stack section.
 */
(function () {
  "use strict";

  const DEFAULT_PARTICLE_COUNT = 12;
  const DEFAULT_SPOTLIGHT_RADIUS = 300;
  const DEFAULT_GLOW_COLOR = "132, 0, 255";
  const MOBILE_BREAKPOINT = 768;

  function createParticleElement(x, y, color) {
    const el = document.createElement("div");
    el.className = "particle";
    el.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(${color}, 1);
      box-shadow: 0 0 6px rgba(${color}, 0.6);
      pointer-events: none;
      z-index: 100;
      left: ${x}px;
      top: ${y}px;
    `;
    return el;
  }

  function calculateSpotlightValues(radius) {
    return {
      proximity: radius * 0.5,
      fadeDistance: radius * 0.75,
    };
  }

  function updateCardGlowProperties(card, mouseX, mouseY, glow, radius) {
    const rect = card.getBoundingClientRect();
    const relativeX = ((mouseX - rect.left) / rect.width) * 100;
    const relativeY = ((mouseY - rect.top) / rect.height) * 100;
    card.style.setProperty("--glow-x", `${relativeX}%`);
    card.style.setProperty("--glow-y", `${relativeY}%`);
    card.style.setProperty("--glow-intensity", String(glow));
    card.style.setProperty("--glow-radius", `${radius}px`);
  }

  function attachParticleCard(card, options) {
    const {
      disableAnimations = false,
      particleCount = DEFAULT_PARTICLE_COUNT,
      glowColor = DEFAULT_GLOW_COLOR,
      enableTilt = false,
      clickEffect = true,
      enableMagnetism = true,
    } = options;

    if (disableAnimations || typeof gsap === "undefined") return () => {};

    card.classList.add("particle-container");
    card.style.position = "relative";
    card.style.overflow = "hidden";

    let particles = [];
    let timeouts = [];
    let isHovered = false;
    let memoizedParticles = [];
    let particlesInitialized = false;
    let magnetismTween = null;

    function initializeParticles() {
      if (particlesInitialized) return;
      const { width, height } = card.getBoundingClientRect();
      memoizedParticles = Array.from({ length: particleCount }, () =>
        createParticleElement(Math.random() * width, Math.random() * height, glowColor)
      );
      particlesInitialized = true;
    }

    function clearAllParticles() {
      timeouts.forEach(clearTimeout);
      timeouts = [];
      if (magnetismTween) magnetismTween.kill();

      particles.forEach((particle) => {
        gsap.to(particle, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "back.in(1.7)",
          onComplete: () => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
          },
        });
      });
      particles = [];
    }

    function animateParticles() {
      if (!isHovered) return;
      if (!particlesInitialized) initializeParticles();

      memoizedParticles.forEach((particle, index) => {
        const timeoutId = setTimeout(() => {
          if (!isHovered) return;
          const clone = particle.cloneNode(true);
          card.appendChild(clone);
          particles.push(clone);

          gsap.fromTo(
            clone,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
          );

          gsap.to(clone, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            rotation: Math.random() * 360,
            duration: 2 + Math.random() * 2,
            ease: "none",
            repeat: -1,
            yoyo: true,
          });

          gsap.to(clone, {
            opacity: 0.3,
            duration: 1.5,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
        }, index * 100);

        timeouts.push(timeoutId);
      });
    }

    function handleMouseEnter() {
      isHovered = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(card, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
    }

    function handleMouseLeave() {
      isHovered = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (enableMagnetism) {
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }

    let moveScheduled = false;
    let lastMoveEvent = null;

    function applyMove() {
      moveScheduled = false;
      const e = lastMoveEvent;
      if (!e) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        gsap.to(card, {
          rotateX: ((y - centerY) / centerY) * -10,
          rotateY: ((x - centerX) / centerX) * 10,
          duration: 0.2,
          ease: "power2.out",
          transformPerspective: 1000,
          overwrite: "auto",
        });
      }

      if (enableMagnetism) {
        magnetismTween = gsap.to(card, {
          x: (x - centerX) * 0.05,
          y: (y - centerY) * 0.05,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    }

    function handleMouseMove(e) {
      if (!enableTilt && !enableMagnetism) return;
      lastMoveEvent = e;
      if (!moveScheduled) {
        moveScheduled = true;
        requestAnimationFrame(applyMove);
      }
    }

    function handleClick(e) {
      if (!clickEffect) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;
      card.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    }

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("click", handleClick);

    return function dispose() {
      isHovered = false;
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }

  function attachGlobalSpotlight(grid, options) {
    const {
      disableAnimations = false,
      enabled = true,
      spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
      glowColor = DEFAULT_GLOW_COLOR,
    } = options;

    if (disableAnimations || !enabled || typeof gsap === "undefined") return () => {};

    const section = grid.closest(".bento-section") || grid;
    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate3d(-50%, -50%, 0);
      transition: opacity 0.35s ease;
      mix-blend-mode: screen;
      will-change: transform, opacity;
    `;
    document.body.appendChild(spotlight);

    const cards = Array.from(grid.querySelectorAll(".magic-bento-card"));
    const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);

    let rafId = null;
    let lastX = 0;
    let lastY = 0;
    let dirty = false;

    function process() {
      rafId = null;
      dirty = false;

      const rect = section.getBoundingClientRect();
      const mouseInside =
        lastX >= rect.left && lastX <= rect.right && lastY >= rect.top && lastY <= rect.bottom;

      // Only touch the DOM when the pointer is near the section; keeps the
      // handler nearly free while scrolling the rest of the page.
      if (!mouseInside) {
        if (spotlight.style.opacity !== "0") {
          spotlight.style.opacity = "0";
          for (let i = 0; i < cards.length; i++) {
            cards[i].style.setProperty("--glow-intensity", "0");
          }
        }
        return;
      }

      spotlight.style.transform = `translate3d(${lastX}px, ${lastY}px, 0) translate(-50%, -50%)`;

      let minDistance = Infinity;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(lastX - centerX, lastY - centerY) -
          Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);
        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) glowIntensity = 1;
        else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }
        updateCardGlowProperties(card, lastX, lastY, glowIntensity, spotlightRadius);
      }

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;
      spotlight.style.opacity = String(targetOpacity);
    }

    function handleMouseMove(e) {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!dirty) {
        dirty = true;
        rafId = requestAnimationFrame(process);
      }
    }

    function handleMouseLeave() {
      spotlight.style.opacity = "0";
      for (let i = 0; i < cards.length; i++) {
        cards[i].style.setProperty("--glow-intensity", "0");
      }
    }

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return function dispose() {
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (spotlight.parentNode) spotlight.parentNode.removeChild(spotlight);
    };
  }

  function initMagicBento(grid, userOptions) {
    if (!grid) return null;

    const opts = Object.assign(
      {
        enableStars: true,
        enableSpotlight: true,
        enableBorderGlow: true,
        disableAnimations: false,
        spotlightRadius: DEFAULT_SPOTLIGHT_RADIUS,
        particleCount: DEFAULT_PARTICLE_COUNT,
        enableTilt: false,
        glowColor: DEFAULT_GLOW_COLOR,
        clickEffect: true,
        enableMagnetism: true,
      },
      userOptions || {}
    );

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldDisable = opts.disableAnimations || isMobile || prefersReducedMotion;

    grid.classList.add("card-grid", "bento-section");

    const cards = Array.from(grid.querySelectorAll(".magic-bento-card"));
    cards.forEach((card) => {
      card.style.setProperty("--glow-color", opts.glowColor);
      if (opts.enableBorderGlow) card.classList.add("magic-bento-card--border-glow");
    });

    const disposers = [];

    if (opts.enableSpotlight) {
      disposers.push(
        attachGlobalSpotlight(grid, {
          disableAnimations: shouldDisable,
          enabled: opts.enableSpotlight,
          spotlightRadius: opts.spotlightRadius,
          glowColor: opts.glowColor,
        })
      );
    }

    if (opts.enableStars) {
      cards.forEach((card) => {
        disposers.push(
          attachParticleCard(card, {
            disableAnimations: shouldDisable,
            particleCount: opts.particleCount,
            glowColor: opts.glowColor,
            enableTilt: opts.enableTilt,
            clickEffect: opts.clickEffect,
            enableMagnetism: opts.enableMagnetism,
          })
        );
      });
    }

    return {
      dispose() {
        disposers.forEach((fn) => fn && fn());
      },
    };
  }

  function boot() {
    const grid = document.getElementById("stackGrid");
    if (!grid) return;

    initMagicBento(grid, {
      enableStars: true,
      enableSpotlight: true,
      enableBorderGlow: true,
      enableTilt: false,
      enableMagnetism: true,
      clickEffect: true,
      glowColor: "132, 0, 255",
      particleCount: 8,
      spotlightRadius: 300,
    });
  }

  window.initMagicBento = initMagicBento;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
