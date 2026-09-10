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
  uniform vec2 uResolution;
  uniform float uMobile;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 pointer = (uPointer - 0.5) * vec2(aspect, 1.0);
    float t = uTime * mix(0.34, 0.18, uMobile);
    float phase = uPhase;

    vec3 paper = vec3(0.957, 0.937, 0.902);
    vec3 plum = vec3(0.36, 0.18, 0.31);
    vec3 terracotta = vec3(0.76, 0.31, 0.20);
    vec3 gold = vec3(0.82, 0.63, 0.25);

    float pointerDistance = length(p - pointer);
    float pointerPull = exp(-pointerDistance * 3.8) * (1.0 - uMobile);
    float grain = noise(p * 5.0 + vec2(t * 0.08, phase * 0.21));
    float flowLines = 0.0;

    for (int i = 0; i < 9; i++) {
      float fi = float(i) - 4.0;
      float wave = sin(p.x * 2.25 + fi * 0.52 + t + phase * 0.32) * 0.075;
      wave += sin(p.x * 5.1 - t * 0.55 + fi) * 0.016;
      wave += (grain - 0.5) * 0.024;
      wave += (pointer.y - p.y) * pointerPull * 0.14;
      float distanceToLine = abs(p.y - wave - fi * 0.042);
      flowLines += 1.0 - smoothstep(0.002, 0.0065, distanceToLine);
    }

    float ribbonMask = smoothstep(1.25, 0.2, abs(p.x - 0.2));
    ribbonMask *= smoothstep(0.48, 0.08, abs(p.y));
    flowLines *= ribbonMask;

    float scanPosition = fract(t * 0.055 + phase * 0.13);
    float scanBand = smoothstep(0.17, 0.0, abs(uv.y - scanPosition));
    float sectionMix = 0.5 + 0.5 * sin(phase * 1.35);
    vec3 phaseColor = mix(plum, terracotta, sectionMix);
    vec3 color = paper;
    color = mix(color, phaseColor, flowLines * (0.28 + scanBand * 0.34));
    color = mix(color, gold, scanBand * flowLines * 0.1);

    float hairline = 1.0 - smoothstep(0.0, 0.0015, abs(fract(uv.y * 16.0) - 0.5));
    color = mix(color, vec3(0.1), hairline * 0.018);

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
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
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
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
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
