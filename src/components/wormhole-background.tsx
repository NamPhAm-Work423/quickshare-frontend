'use client';

import { useEffect, useRef } from 'react';

/**
 * Wormhole Space Nebula Background
 * - Deep space nebula gradient (purple, blue, pink, violet)
 * - Swirling vortex tunnel with depth
 * - Glowing stars/particles drifting toward center
 * - Smooth seamless animation loop
 * - Responsive + high-DPI aware
 */
export function WormholeBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let time = 0;
    let raf: number | null = null;

    // Particle systems
    const starCount = 300;
    const trailCount = 80;

    interface Star {
      angle: number;
      depth: number;
      size: number;
      brightness: number;
      speed: number;
      hue: number;
      trail: number;
    }

    interface Trail {
      angle: number;
      depth: number;
      length: number;
      width: number;
      hue: number;
      speed: number;
    }

    const stars: Star[] = [];
    const trails: Trail[] = [];

    // Nebula colors (purple, violet, magenta, blue, cyan)
    const nebulaHues = [280, 260, 320, 240, 200, 290];

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Safe modulo that handles negative numbers
    const mod = (n: number, m: number) => ((n % m) + m) % m;

    const createStar = (): Star => ({
      angle: Math.random() * Math.PI * 2,
      depth: rand(0.3, 1),
      size: rand(0.8, 2.5),
      brightness: rand(0.5, 1),
      speed: rand(0.003, 0.012),
      hue: nebulaHues[Math.floor(Math.random() * nebulaHues.length)],
      trail: rand(0.3, 0.8),
    });

    const createTrail = (): Trail => ({
      angle: Math.random() * Math.PI * 2,
      depth: rand(0.5, 1),
      length: rand(50, 150),
      width: rand(1, 3),
      hue: nebulaHues[Math.floor(Math.random() * nebulaHues.length)],
      speed: rand(0.006, 0.015),
    });

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Initialize particles
    for (let i = 0; i < starCount; i++) stars.push(createStar());
    for (let i = 0; i < trailCount; i++) trails.push(createTrail());

    const drawBackground = () => {
      // Deep space radial gradient
      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.max(width, height);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      
      // Animated subtle color pulse
      const pulse = Math.sin(time * 0.0002) * 0.5 + 0.5;
      const h1 = lerp(270, 290, pulse);
      const h2 = lerp(240, 260, pulse);

      bg.addColorStop(0, `hsl(${h1}, 80%, 12%)`);
      bg.addColorStop(0.2, `hsl(${h2}, 70%, 6%)`);
      bg.addColorStop(0.5, `hsl(260, 60%, 3%)`);
      bg.addColorStop(1, `hsl(240, 50%, 1%)`);

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
    };

    const drawNebulaGlow = () => {
      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(width, height) * 0.8;

      // Multiple layered nebula clouds
      const layers = [
        { offset: 0, hue: 280, size: 0.9, alpha: 0.08 },
        { offset: Math.PI * 0.3, hue: 320, size: 0.7, alpha: 0.06 },
        { offset: Math.PI * 0.7, hue: 240, size: 0.8, alpha: 0.05 },
        { offset: Math.PI * 1.2, hue: 260, size: 0.6, alpha: 0.07 },
      ];

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (const layer of layers) {
        const angleOffset = time * 0.00015 + layer.offset;
        const x = cx + Math.cos(angleOffset) * maxR * 0.15;
        const y = cy + Math.sin(angleOffset) * maxR * 0.1;
        const r = maxR * layer.size;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
        glow.addColorStop(0, `hsla(${layer.hue}, 100%, 60%, ${layer.alpha})`);
        glow.addColorStop(0.3, `hsla(${layer.hue}, 80%, 40%, ${layer.alpha * 0.6})`);
        glow.addColorStop(0.6, `hsla(${layer.hue}, 60%, 25%, ${layer.alpha * 0.3})`);
        glow.addColorStop(1, 'transparent');

        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();
    };

    const drawVortex = () => {
      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(width, height) * 0.45;

      ctx.save();
      ctx.translate(cx, cy);

      // Outer glow rings
      const ringCount = 20;
      for (let i = ringCount; i >= 0; i--) {
        const progress = i / ringCount;
        const radius = maxRadius * (0.1 + progress * 0.9);
        const rotation = time * 0.0006 * (2 - progress * 1.5);

        ctx.save();
        ctx.rotate(rotation);

        // Dynamic hue based on ring position
        const hue = 260 + progress * 40 + Math.sin(time * 0.001 + i * 0.5) * 20;
        const alpha = lerp(0.3, 0.02, progress);
        const lineWidth = lerp(8, 1, progress);

        // Draw spiral arms
        const arms = 4;
        for (let a = 0; a < arms; a++) {
          const armAngle = (a / arms) * Math.PI * 2;
          const spiralTwist = progress * Math.PI * 2;

          ctx.beginPath();
          ctx.arc(0, 0, radius, armAngle + spiralTwist, armAngle + spiralTwist + Math.PI * 0.4);
          
          const gradient = ctx.createLinearGradient(
            Math.cos(armAngle + spiralTwist) * radius,
            Math.sin(armAngle + spiralTwist) * radius,
            Math.cos(armAngle + spiralTwist + Math.PI * 0.4) * radius,
            Math.sin(armAngle + spiralTwist + Math.PI * 0.4) * radius
          );
          gradient.addColorStop(0, `hsla(${hue}, 90%, 70%, ${alpha})`);
          gradient.addColorStop(0.5, `hsla(${hue + 20}, 80%, 50%, ${alpha * 0.8})`);
          gradient.addColorStop(1, `hsla(${hue}, 70%, 40%, ${alpha * 0.3})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        ctx.restore();
      }

      // Bright center core
      const coreSize = maxRadius * 0.12;
      const coreHue = 280 + Math.sin(time * 0.002) * 30;
      
      const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize * 3);
      coreGlow.addColorStop(0, `hsla(${coreHue}, 100%, 95%, 1)`);
      coreGlow.addColorStop(0.1, `hsla(${coreHue}, 100%, 80%, 0.9)`);
      coreGlow.addColorStop(0.3, `hsla(${coreHue}, 90%, 60%, 0.5)`);
      coreGlow.addColorStop(0.6, `hsla(${coreHue + 30}, 80%, 40%, 0.2)`);
      coreGlow.addColorStop(1, 'transparent');

      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(0, 0, coreSize * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawTrails = () => {
      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.max(width, height) * 0.7;

      ctx.save();
      ctx.translate(cx, cy);

      for (const trail of trails) {
        // Move toward center with slight spiral
        trail.depth -= trail.speed;
        trail.angle += 0.008 * (1 - trail.depth);

        if (trail.depth <= 0.05) {
          Object.assign(trail, createTrail());
          trail.depth = 1;
        }

        const startRadius = maxRadius * trail.depth;
        const endRadius = maxRadius * Math.max(0.05, trail.depth - 0.15);

        const startX = Math.cos(trail.angle) * startRadius;
        const startY = Math.sin(trail.angle) * startRadius;
        const endX = Math.cos(trail.angle) * endRadius;
        const endY = Math.sin(trail.angle) * endRadius;

        const alpha = (1 - trail.depth) * 0.6;

        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.3, `hsla(${trail.hue}, 80%, 70%, ${alpha * 0.3})`);
        gradient.addColorStop(0.7, `hsla(${trail.hue}, 90%, 80%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${trail.hue}, 100%, 90%, ${alpha * 1.2})`);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = trail.width * (1.5 - trail.depth);
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawStars = () => {
      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.max(width, height) * 0.75;

      ctx.save();
      ctx.translate(cx, cy);

      for (const star of stars) {
        // Move toward center with spiral motion
        star.depth -= star.speed;
        star.angle += 0.004 * (1 - star.depth);

        if (star.depth <= 0.02) {
          Object.assign(star, createStar());
          star.depth = 1;
        }

        const radius = maxRadius * star.depth;
        const x = Math.cos(star.angle) * radius;
        const y = Math.sin(star.angle) * radius;

        const baseAlpha = (1 - star.depth) * star.brightness;
        // Twinkling
        const twinkle = 0.6 + Math.sin(time * 0.008 + star.angle * 5) * 0.4;
        const alpha = baseAlpha * twinkle;
        const size = star.size * (2 - star.depth) * 1.2;

        // Star glow
        const glowSize = size * 6;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        glow.addColorStop(0, `hsla(${star.hue}, 100%, 95%, ${alpha})`);
        glow.addColorStop(0.15, `hsla(${star.hue}, 90%, 80%, ${alpha * 0.7})`);
        glow.addColorStop(0.4, `hsla(${star.hue}, 80%, 60%, ${alpha * 0.3})`);
        glow.addColorStop(1, 'transparent');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        ctx.fillStyle = `hsla(0, 0%, 100%, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawCenterFlare = () => {
      const cx = width / 2;
      const cy = height / 2;
      const flareSize = Math.min(width, height) * 0.4;

      // Pulsing center light
      const pulse = 0.8 + Math.sin(time * 0.003) * 0.2;
      const hue = 280 + Math.sin(time * 0.001) * 20;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Vertical light beam
      const beamGradient = ctx.createLinearGradient(cx, cy - flareSize, cx, cy + flareSize);
      beamGradient.addColorStop(0, 'transparent');
      beamGradient.addColorStop(0.4, `hsla(${hue}, 100%, 90%, ${0.05 * pulse})`);
      beamGradient.addColorStop(0.5, `hsla(${hue}, 100%, 95%, ${0.12 * pulse})`);
      beamGradient.addColorStop(0.6, `hsla(${hue}, 100%, 90%, ${0.05 * pulse})`);
      beamGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = beamGradient;
      ctx.fillRect(cx - 3, cy - flareSize, 6, flareSize * 2);

      // Horizontal light beam
      const hBeamGradient = ctx.createLinearGradient(cx - flareSize, cy, cx + flareSize, cy);
      hBeamGradient.addColorStop(0, 'transparent');
      hBeamGradient.addColorStop(0.4, `hsla(${hue + 30}, 100%, 90%, ${0.04 * pulse})`);
      hBeamGradient.addColorStop(0.5, `hsla(${hue + 30}, 100%, 95%, ${0.1 * pulse})`);
      hBeamGradient.addColorStop(0.6, `hsla(${hue + 30}, 100%, 90%, ${0.04 * pulse})`);
      hBeamGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = hBeamGradient;
      ctx.fillRect(cx - flareSize, cy - 2, flareSize * 2, 4);

      ctx.restore();
    };

    const render = () => {
      time += 16;
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // Render layers
      drawBackground();
      drawNebulaGlow();
      drawTrails();
      drawVortex();
      drawStars();
      drawCenterFlare();

      raf = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener('resize', resize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full"
    />
  );
}
