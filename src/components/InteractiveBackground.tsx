"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uPhase;
  uniform vec2 uPointer;
  uniform float uMobile;

  float blob(vec2 uv, vec2 center, float size) {
    return smoothstep(size, 0.0, distance(uv, center));
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * mix(0.09, 0.055, uMobile);
    float p = uPhase;

    vec2 a = vec2(
      0.18 + 0.16 * sin(t + p * 1.4),
      0.25 + 0.13 * cos(t * 1.3 + p)
    );
    vec2 b = vec2(
      0.78 + 0.12 * cos(t * 0.8 + p * 1.8),
      0.67 + 0.18 * sin(t + p * 0.7)
    );
    vec2 c = mix(vec2(0.5, 0.5), uPointer, 0.24 * (1.0 - uMobile));

    float fieldA = blob(uv, a, 0.62);
    float fieldB = blob(uv, b, 0.56);
    float pointerField = blob(uv, c, 0.34) * (1.0 - uMobile);

    vec3 paper = vec3(0.953, 0.941, 0.902);
    vec3 cobalt = vec3(0.075, 0.235, 0.86);
    vec3 coral = vec3(0.98, 0.31, 0.19);
    vec3 acid = vec3(0.72, 0.88, 0.22);

    float sectionMix = 0.5 + 0.5 * sin(p * 1.35);
    vec3 phaseColor = mix(cobalt, mix(coral, acid, sectionMix), smoothstep(0.12, 0.94, uv.y));
    vec3 color = paper;
    color = mix(color, cobalt, fieldA * 0.105);
    color = mix(color, phaseColor, fieldB * 0.08);
    color = mix(color, coral, pointerField * 0.08);

    vec2 grid = abs(fract(uv * vec2(18.0, 12.0)) - 0.5);
    float gridLine = 1.0 - smoothstep(0.485, 0.5, max(grid.x, grid.y));
    color = mix(color, vec3(0.12, 0.14, 0.2), gridLine * 0.018);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function InteractiveBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: !mobile,
      powerPreference: mobile ? "low-power" : "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const uniforms = {
      uTime: { value: 0 },
      uPhase: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uMobile: { value: mobile ? 1 : 0 },
    };
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    scene.add(new THREE.Mesh(geometry, material));

    let frame = 0;
    let targetPhase = 0;
    let currentPhase = 0;
    const targetPointer = new THREE.Vector2(0.5, 0.5);
    const sectionIds = ["hero", "certificates", "stack", "projects", "contacts"];

    const updatePhase = () => {
      const center = window.scrollY + window.innerHeight * 0.5;
      let closest = 0;
      let minDistance = Infinity;
      sectionIds.forEach((id, index) => {
        const section = document.getElementById(id);
        if (!section) return;
        const sectionCenter = section.offsetTop + section.offsetHeight * 0.5;
        const distance = Math.abs(center - sectionCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closest = index;
        }
      });
      targetPhase = closest;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (mobile) return;
      targetPointer.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    };
    const onResize = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      if (document.hidden) return;
      if (mobile && frame++ % 2) return;
      currentPhase += (targetPhase - currentPhase) * 0.035;
      uniforms.uPhase.value = currentPhase;
      uniforms.uPointer.value.lerp(targetPointer, 0.045);
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    updatePhase();
    window.addEventListener("scroll", updatePhase, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updatePhase);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="interactive-background" aria-hidden="true" />;
}
