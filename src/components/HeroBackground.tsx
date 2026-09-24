'use client';

import { useEffect, useRef } from 'react';

/**
 * Fond cinématique du Hero rendu sur <canvas> :
 * sol de garage en perspective, étincelles montantes, poussière, balayage de lumière.
 * Pensé pour être remplacé plus tard par une vraie vidéo (voir Hero: placer une
 * <video> au même emplacement et masquer ce canvas).
 */
export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // --- Particules (étincelles / poussière) ---
    type P = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number; hue: number; spark: boolean };
    const parts: P[] = [];
    const COUNT = reduced ? 0 : Math.min(90, Math.floor((W * H) / 16000));

    const spawn = (initial = false): P => {
      const spark = Math.random() > 0.45;
      return {
        x: Math.random() * W,
        y: initial ? Math.random() * H : H + 20,
        vx: (Math.random() - 0.5) * 0.35,
        vy: spark ? -(0.5 + Math.random() * 1.4) : -(0.15 + Math.random() * 0.5),
        r: spark ? 0.6 + Math.random() * 1.6 : 0.4 + Math.random() * 1.2,
        life: 0,
        max: 200 + Math.random() * 400,
        hue: spark ? 28 + Math.random() * 18 : 40,
        spark,
      };
    };
    for (let i = 0; i < COUNT; i++) parts.push(spawn(true));

    let mouseX = W / 2;
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
    };
    window.addEventListener('mousemove', onMouse);

    let t = 0;
    let raf = 0;
    let running = false; // true seulement quand une boucle RAF est réellement active

    const draw = () => {
      if (!running) return;
      t += 1;
      ctx.clearRect(0, 0, W, H);

      // Vignette / profondeur
      const vg = ctx.createRadialGradient(W / 2, H * 0.42, H * 0.1, W / 2, H * 0.5, H * 0.95);
      vg.addColorStop(0, 'rgba(20,16,10,0.0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // --- Sol en perspective (grille qui défile) ---
      const horizon = H * 0.62;
      ctx.save();
      ctx.strokeStyle = 'rgba(255,122,0,0.10)';
      ctx.lineWidth = 1;
      // lignes horizontales qui se rapprochent
      const offset = (t * 0.6) % 40;
      for (let i = 0; i < 22; i++) {
        const z = i * 40 + offset;
        const p = z / (22 * 40);
        const y = horizon + Math.pow(p, 2.2) * (H - horizon);
        if (y > H) continue;
        ctx.globalAlpha = 0.08 + p * 0.22;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      // lignes de fuite verticales
      const vanishX = W / 2 + (mouseX - W / 2) * 0.04;
      for (let i = -10; i <= 10; i++) {
        const spread = i / 10;
        const topX = vanishX + spread * W * 0.06;
        const botX = vanishX + spread * W * 1.4;
        ctx.globalAlpha = 0.05 + Math.abs(spread) * 0.06;
        ctx.beginPath();
        ctx.moveTo(topX, horizon);
        ctx.lineTo(botX, H);
        ctx.stroke();
      }
      ctx.restore();

      // Lueur d'horizon (néon orange)
      const hg = ctx.createLinearGradient(0, horizon - 120, 0, horizon + 40);
      hg.addColorStop(0, 'rgba(255,122,0,0)');
      hg.addColorStop(1, 'rgba(255,138,20,0.14)');
      ctx.fillStyle = hg;
      ctx.fillRect(0, horizon - 120, W, 160);

      // Balayage de lumière lent
      const sweep = ((t * 0.4) % (W + 400)) - 200;
      const sg = ctx.createLinearGradient(sweep - 160, 0, sweep + 160, 0);
      sg.addColorStop(0, 'rgba(255,195,0,0)');
      sg.addColorStop(0.5, 'rgba(255,195,0,0.05)');
      sg.addColorStop(1, 'rgba(255,195,0,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, W, horizon);

      // --- Particules ---
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.997;
        const fade = 1 - p.life / p.max;
        if (p.y < -20 || p.life > p.max) {
          parts[i] = spawn();
          continue;
        }
        const alpha = Math.max(0, fade) * (p.spark ? 0.9 : 0.4);
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        glow.addColorStop(0, `hsla(${p.hue},100%,60%,${alpha})`);
        glow.addColorStop(1, 'hsla(40,100%,50%,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(draw);
    };

    // Démarre la boucle une seule fois (idempotent : jamais deux boucles concurrentes).
    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (!reduced) startLoop();
    else draw(); // rendu statique unique

    const onVis = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
