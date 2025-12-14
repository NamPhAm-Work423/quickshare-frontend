'use client';

import { useEffect, useRef } from 'react';

/**
 * Enhanced Wormhole Space Nebula Background
 * - Deep space nebula gradient with richer colors
 * - Multi-layered swirling vortex with depth
 * - Dynamic particle systems with trails
 * - Responsive + mobile optimized
 * - Orientation aware
 */
export function WormholeBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Fixed canvas dimensions
    const FIXED_WIDTH = 1920;
    const FIXED_HEIGHT = 1080;
    const width = FIXED_WIDTH;
    const height = FIXED_HEIGHT;

    let time = 0;
    let raf: number | null = null;

    // Fixed particle counts
    const starCount = 300;
    const trailCount = 80;
    const dustCount = 150;

    interface Star {
      angle: number;
      depth: number;
      size: number;
      brightness: number;
      speed: number;
      hue: number;
      offset: number;
    }

    interface Trail {
      angle: number;
      depth: number;
      length: number;
      width: number;
      hue: number;
      speed: number;
      curve: number;
    }

    interface Dust {
      x: number;
      y: number;
      size: number;
      alpha: number;
      hue: number;
      drift: number;
      phase: number;
    }

    let stars: Star[] = [];
    let trails: Trail[] = [];
    let dust: Dust[] = [];

    // Enhanced nebula color palette
    const nebulaHues = [280, 260, 320, 240, 200, 290, 300, 270];

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const createStar = (): Star => ({
      angle: Math.random() * Math.PI * 2,
      depth: rand(0.2, 1),
      size: rand(0.6, 2.8),
      brightness: rand(0.4, 1),
      speed: rand(0.002, 0.01),
      hue: nebulaHues[Math.floor(Math.random() * nebulaHues.length)],
      offset: rand(0, Math.PI * 2),
    });

    const createTrail = (): Trail => ({
      angle: Math.random() * Math.PI * 2,
      depth: rand(0.4, 1),
      length: rand(40, 150),
      width: rand(0.8, 3),
      hue: nebulaHues[Math.floor(Math.random() * nebulaHues.length)],
      speed: rand(0.004, 0.014),
      curve: rand(-0.3, 0.3),
    });

    const createDust = (): Dust => ({
      x: rand(0, 1),
      y: rand(0, 1),
      size: rand(0.5, 2.5),
      alpha: rand(0.1, 0.4),
      hue: nebulaHues[Math.floor(Math.random() * nebulaHues.length)],
      drift: rand(-0.0003, 0.0003),
      phase: rand(0, Math.PI * 2),
    });

    const initParticles = () => {
      stars = [];
      trails = [];
      dust = [];

      for (let i = 0; i < starCount; i++) stars.push(createStar());
      for (let i = 0; i < trailCount; i++) trails.push(createTrail());
      for (let i = 0; i < dustCount; i++) dust.push(createDust());
    };

    const setupCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      // Set fixed canvas dimensions
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // Calculate scale to fit viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scaleX = viewportWidth / width;
      const scaleY = viewportHeight / height;
      const scale = Math.max(scaleX, scaleY); // Cover entire viewport
      
      // Apply transform to center and scale
      canvas.style.transform = `translate(-50%, -50%) scale(${scale})`;
      canvas.style.left = '50%';
      canvas.style.top = '50%';
    };

    const drawBackground = () => {
      const cx = width / 2;
      const cy = height / 2;
      // Extend gradient beyond viewport for edge coverage
      const maxR = Math.hypot(width, height);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      
      const pulse = Math.sin(time * 0.00015) * 0.5 + 0.5;
      const h1 = lerp(265, 295, pulse);
      const h2 = lerp(235, 265, pulse);

      bg.addColorStop(0, `hsl(${h1}, 85%, 14%)`);
      bg.addColorStop(0.15, `hsl(${h2}, 75%, 8%)`);
      bg.addColorStop(0.35, `hsl(255, 65%, 4%)`);
      bg.addColorStop(0.6, `hsl(245, 55%, 2%)`);
      bg.addColorStop(1, `hsl(235, 50%, 1%)`);

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
    };

    const drawNebulaGlow = () => {
      const cx = width / 2;
      const cy = height / 2;
      const baseR = Math.min(width, height) * 0.75;

      const layers = [
        { offset: 0, hue: 280, size: 1.0, alpha: 0.1, speed: 0.00012 },
        { offset: Math.PI * 0.4, hue: 320, size: 0.8, alpha: 0.08, speed: 0.00015 },
        { offset: Math.PI * 0.8, hue: 240, size: 0.9, alpha: 0.06, speed: 0.0001 },
        { offset: Math.PI * 1.3, hue: 260, size: 0.7, alpha: 0.09, speed: 0.00018 },
        { offset: Math.PI * 1.7, hue: 300, size: 0.6, alpha: 0.05, speed: 0.00014 },
      ];

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (const layer of layers) {
        const angleOffset = time * layer.speed + layer.offset;
        const wobble = Math.sin(time * 0.0002 + layer.offset) * baseR * 0.08;
        const x = cx + Math.cos(angleOffset) * (baseR * 0.12 + wobble);
        const y = cy + Math.sin(angleOffset) * (baseR * 0.08 + wobble * 0.5);
        const r = baseR * layer.size;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
        glow.addColorStop(0, `hsla(${layer.hue}, 100%, 65%, ${layer.alpha})`);
        glow.addColorStop(0.25, `hsla(${layer.hue}, 85%, 45%, ${layer.alpha * 0.7})`);
        glow.addColorStop(0.5, `hsla(${layer.hue}, 70%, 30%, ${layer.alpha * 0.4})`);
        glow.addColorStop(0.75, `hsla(${layer.hue}, 55%, 20%, ${layer.alpha * 0.15})`);
        glow.addColorStop(1, 'transparent');

        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();
    };

    const drawDust = () => {
      ctx.save();
      
      for (const d of dust) {
        // Gentle floating motion
        d.x += d.drift + Math.sin(time * 0.001 + d.phase) * 0.0001;
        d.y += Math.cos(time * 0.0008 + d.phase) * 0.0001;
        
        // Wrap around
        if (d.x < -0.1) d.x = 1.1;
        if (d.x > 1.1) d.x = -0.1;
        if (d.y < -0.1) d.y = 1.1;
        if (d.y > 1.1) d.y = -0.1;

        const x = d.x * width;
        const y = d.y * height;
        const twinkle = 0.7 + Math.sin(time * 0.003 + d.phase) * 0.3;
        const alpha = d.alpha * twinkle;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, d.size * 4);
        glow.addColorStop(0, `hsla(${d.hue}, 80%, 85%, ${alpha})`);
        glow.addColorStop(0.4, `hsla(${d.hue}, 70%, 60%, ${alpha * 0.4})`);
        glow.addColorStop(1, 'transparent');

        ctx.fillStyle = glow;
        ctx.fillRect(x - d.size * 4, y - d.size * 4, d.size * 8, d.size * 8);
      }

      ctx.restore();
    };

    const drawVortex = () => {
      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(width, height) * 0.42;

      ctx.save();
      ctx.translate(cx, cy);

      const ringCount = 22;
      const armCount = 4;

      for (let i = ringCount; i >= 0; i--) {
        const progress = i / ringCount;
        const easedProgress = easeOutQuart(progress);
        const radius = maxRadius * (0.08 + easedProgress * 0.92);
        const rotationSpeed = 0.0005;
        const rotation = time * rotationSpeed * (2.2 - progress * 1.6);

        ctx.save();
        ctx.rotate(rotation);

        const hue = 255 + progress * 50 + Math.sin(time * 0.0008 + i * 0.4) * 25;
        const alpha = lerp(0.35, 0.015, progress);
        const lineWidth = lerp(10, 0.8, progress);

        for (let a = 0; a < armCount; a++) {
          const armAngle = (a / armCount) * Math.PI * 2;
          const spiralTwist = easedProgress * Math.PI * 2.5;
          const arcLength = Math.PI * 0.42;

          ctx.beginPath();
          ctx.arc(0, 0, radius, armAngle + spiralTwist, armAngle + spiralTwist + arcLength);

          const gradient = ctx.createLinearGradient(
            Math.cos(armAngle + spiralTwist) * radius,
            Math.sin(armAngle + spiralTwist) * radius,
            Math.cos(armAngle + spiralTwist + arcLength) * radius,
            Math.sin(armAngle + spiralTwist + arcLength) * radius
          );
          
          gradient.addColorStop(0, `hsla(${hue}, 95%, 75%, ${alpha})`);
          gradient.addColorStop(0.3, `hsla(${hue + 15}, 90%, 60%, ${alpha * 0.9})`);
          gradient.addColorStop(0.6, `hsla(${hue + 25}, 85%, 50%, ${alpha * 0.6})`);
          gradient.addColorStop(1, `hsla(${hue}, 75%, 40%, ${alpha * 0.2})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        ctx.restore();
      }

      // Enhanced center core with multiple layers
      const coreSize = maxRadius * 0.11;
      const coreHue = 275 + Math.sin(time * 0.0015) * 35;

      // Outer core halo
      const outerHalo = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize * 5);
      outerHalo.addColorStop(0, `hsla(${coreHue}, 100%, 98%, 0.95)`);
      outerHalo.addColorStop(0.08, `hsla(${coreHue}, 100%, 90%, 0.85)`);
      outerHalo.addColorStop(0.2, `hsla(${coreHue}, 95%, 75%, 0.6)`);
      outerHalo.addColorStop(0.4, `hsla(${coreHue + 20}, 90%, 55%, 0.3)`);
      outerHalo.addColorStop(0.7, `hsla(${coreHue + 40}, 80%, 40%, 0.1)`);
      outerHalo.addColorStop(1, 'transparent');

      ctx.fillStyle = outerHalo;
      ctx.beginPath();
      ctx.arc(0, 0, coreSize * 5, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright core
      const innerCore = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize * 1.5);
      innerCore.addColorStop(0, `hsla(0, 0%, 100%, 1)`);
      innerCore.addColorStop(0.3, `hsla(${coreHue}, 100%, 95%, 0.95)`);
      innerCore.addColorStop(0.7, `hsla(${coreHue}, 90%, 80%, 0.7)`);
      innerCore.addColorStop(1, 'transparent');

      ctx.fillStyle = innerCore;
      ctx.beginPath();
      ctx.arc(0, 0, coreSize * 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawTrails = () => {
      const cx = width / 2;
      const cy = height / 2;
      // Extend trails to cover portrait screens
      const maxRadius = Math.hypot(width, height) * 0.55;

      ctx.save();
      ctx.translate(cx, cy);

      for (const trail of trails) {
        trail.depth -= trail.speed;
        trail.angle += (0.006 + trail.curve * 0.01) * (1 - trail.depth);

        if (trail.depth <= 0.03) {
          Object.assign(trail, createTrail());
          trail.depth = 1;
        }

        const startRadius = maxRadius * trail.depth;
        const endRadius = maxRadius * Math.max(0.03, trail.depth - 0.12);

        // Add curve to trails
        const curveOffset = trail.curve * (1 - trail.depth) * 0.15;
        const startAngle = trail.angle;
        const endAngle = trail.angle + curveOffset;

        const startX = Math.cos(startAngle) * startRadius;
        const startY = Math.sin(startAngle) * startRadius;
        const endX = Math.cos(endAngle) * endRadius;
        const endY = Math.sin(endAngle) * endRadius;

        const alpha = (1 - trail.depth) * 0.7;

        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.2, `hsla(${trail.hue}, 75%, 65%, ${alpha * 0.2})`);
        gradient.addColorStop(0.5, `hsla(${trail.hue}, 85%, 75%, ${alpha * 0.7})`);
        gradient.addColorStop(0.8, `hsla(${trail.hue}, 95%, 85%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${trail.hue}, 100%, 95%, ${alpha * 0.9})`);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        // Bezier curve for smoother trails
        const midX = (startX + endX) / 2 + Math.cos(trail.angle + Math.PI / 2) * trail.curve * 20;
        const midY = (startY + endY) / 2 + Math.sin(trail.angle + Math.PI / 2) * trail.curve * 20;
        ctx.quadraticCurveTo(midX, midY, endX, endY);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = trail.width * (1.8 - trail.depth);
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawStars = () => {
      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.hypot(width, height) * 0.6;

      ctx.save();
      ctx.translate(cx, cy);

      for (const star of stars) {
        star.depth -= star.speed;
        star.angle += 0.003 * (1 - star.depth);

        if (star.depth <= 0.01) {
          Object.assign(star, createStar());
          star.depth = 1;
        }

        const radius = maxRadius * star.depth;
        const x = Math.cos(star.angle) * radius;
        const y = Math.sin(star.angle) * radius;

        const baseAlpha = (1 - star.depth) * star.brightness;
        const twinkle = 0.5 + Math.sin(time * 0.006 + star.offset) * 0.5;
        const alpha = Math.min(baseAlpha * twinkle, 1);
        const size = star.size * (2.2 - star.depth) * 1.1;

        // Soft glow
        const glowSize = size * 7;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        glow.addColorStop(0, `hsla(${star.hue}, 100%, 98%, ${alpha})`);
        glow.addColorStop(0.12, `hsla(${star.hue}, 95%, 85%, ${alpha * 0.75})`);
        glow.addColorStop(0.35, `hsla(${star.hue}, 85%, 65%, ${alpha * 0.35})`);
        glow.addColorStop(0.6, `hsla(${star.hue}, 75%, 50%, ${alpha * 0.1})`);
        glow.addColorStop(1, 'transparent');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        ctx.fillStyle = `hsla(0, 0%, 100%, ${alpha * 0.95})`;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawCenterFlare = () => {
      const cx = width / 2;
      const cy = height / 2;
      const flareSize = Math.min(width, height) * 0.4;

      const pulse = 0.75 + Math.sin(time * 0.002) * 0.25;
      const hue = 275 + Math.sin(time * 0.0008) * 25;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Cross flare beams
      const beamWidth = 6;
      
      // Vertical beam
      const vGradient = ctx.createLinearGradient(cx, cy - flareSize, cx, cy + flareSize);
      vGradient.addColorStop(0, 'transparent');
      vGradient.addColorStop(0.35, `hsla(${hue}, 100%, 92%, ${0.04 * pulse})`);
      vGradient.addColorStop(0.5, `hsla(${hue}, 100%, 98%, ${0.15 * pulse})`);
      vGradient.addColorStop(0.65, `hsla(${hue}, 100%, 92%, ${0.04 * pulse})`);
      vGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = vGradient;
      ctx.fillRect(cx - beamWidth / 2, cy - flareSize, beamWidth, flareSize * 2);

      // Horizontal beam
      const hGradient = ctx.createLinearGradient(cx - flareSize, cy, cx + flareSize, cy);
      hGradient.addColorStop(0, 'transparent');
      hGradient.addColorStop(0.35, `hsla(${hue + 25}, 100%, 92%, ${0.035 * pulse})`);
      hGradient.addColorStop(0.5, `hsla(${hue + 25}, 100%, 98%, ${0.12 * pulse})`);
      hGradient.addColorStop(0.65, `hsla(${hue + 25}, 100%, 92%, ${0.035 * pulse})`);
      hGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = hGradient;
      ctx.fillRect(cx - flareSize, cy - beamWidth / 2 + 1, flareSize * 2, beamWidth - 2);

      // Diagonal rays (subtle)
      const rayAlpha = 0.025 * pulse;
      ctx.strokeStyle = `hsla(${hue + 15}, 100%, 90%, ${rayAlpha})`;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      
      const rayLen = flareSize * 0.7;
      const angles = [Math.PI / 4, -Math.PI / 4, Math.PI * 3 / 4, -Math.PI * 3 / 4];
      
      for (const angle of angles) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * rayLen, cy + Math.sin(angle) * rayLen);
        ctx.stroke();
      }

      ctx.restore();
    };

    // Edge vignette for depth
    const drawVignette = () => {
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, Math.min(width, height) * 0.3,
        width / 2, height / 2, Math.hypot(width, height) * 0.7
      );
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.6, 'transparent');
      gradient.addColorStop(1, 'rgba(0, 0, 10, 0.4)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    const render = () => {
      const dt = 16;
      time += dt;

      // Layer rendering
      drawBackground();
      drawNebulaGlow();
      drawDust();
      drawTrails();
      drawVortex();
      drawStars();
      drawCenterFlare();
      drawVignette();

      raf = requestAnimationFrame(render);
    };

    // Debounced resize handler for scaling only
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const debouncedResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setupCanvas, 100);
    };

    // Initial setup
    setupCanvas();
    initParticles();
    render();

    // Event listeners for scaling
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(setupCanvas, 200);
    });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', debouncedResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute -z-10"
      style={{
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        transformOrigin: 'center center',
      }}
    />
  );
}
