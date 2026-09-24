'use client';

import { useEffect, useRef, useState } from 'react';
import { SEQUENCE } from '@/lib/experience';

/**
 * Moteur de séquence d'images piloté par le défilement.
 *
 * Choix technique (arbitré sur les vrais fichiers) :
 *  - Séquence d'images + Canvas plutôt que <video> + scrub. La vidéo MP4 est
 *    plus légère (8,9 Mo contre 12,2) mais le déplacement image par image
 *    n'est pas fiable sur iOS/Android et saccade au défilement inverse.
 *  - Desktop : 1280x720 paysage. Mobile : 720x1282 RECADRÉ EN PORTRAIT —
 *    une image paysage devrait être agrandie ~2,3x pour remplir un écran de
 *    téléphone, ce qui détruisait la netteté.
 *
 * Mémoire : jamais plus de `cap` images en cache. Une « échelle » d'images
 * réparties sur toute la séquence est conservée en permanence pour servir de
 * repli instantané, le reste glisse avec la position et est libéré derrière.
 */

const LADDER_STEP = 10;
const AHEAD = 24;
const BEHIND = 10;
const MAX_PARALLEL = 6;
const CAP = { desktop: 150, mobile: 100 } as const;
const EASE = 0.1;

type Props = {
  /** Progression 0→1 fournie par le parent (lecture du scroll). */
  progressRef: React.RefObject<number>;
  className?: string;
};

export default function SceneCanvas({ progressRef, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [variant, setVariant] = useState<'desktop' | 'mobile' | null>(null);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mqReduce.matches);
    const portrait = window.matchMedia('(max-width: 820px)').matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setVariant(portrait || conn?.saveData ? 'mobile' : 'desktop');
  }, []);

  useEffect(() => {
    // Mouvement réduit : on ne charge aucune séquence, le poster suffit.
    if (!variant || reduced) return;

    const conf = SEQUENCE[variant];
    const { dir, count } = conf;
    const cap = CAP[variant];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const cache = new Map<number, HTMLImageElement>();
    const pending = new Set<number>();
    const failed = new Set<number>();

    const ladder: number[] = [];
    for (let i = 0; i < count; i += LADDER_STEP) ladder.push(i);
    if (ladder[ladder.length - 1] !== count - 1) ladder.push(count - 1);
    const ladderSet = new Set(ladder);

    let disposed = false;

    const url = (i: number) => `${dir}/f_${String(i + 1).padStart(4, '0')}.webp`;

    function load(i: number, done?: () => void) {
      if (disposed || i < 0 || i >= count) return;
      if (cache.has(i) || pending.has(i) || failed.has(i)) return;
      if (pending.size >= MAX_PARALLEL) return;
      pending.add(i);
      const img = new Image();
      img.decoding = 'async';
      img.src = url(i);
      img.onload = () => {
        pending.delete(i);
        if (!disposed) cache.set(i, img);
        done?.();
      };
      img.onerror = () => {
        pending.delete(i);
        failed.add(i);
        done?.();
      };
    }

    const boot = Array.from(new Set([...ladder, ...Array.from({ length: 12 }, (_, k) => k)]));
    let bootDone = 0;
    const bootTick = () => {
      bootDone++;
      if (disposed) return;
      if (bootDone >= boot.length) setReady(true);
      for (const i of boot) load(i, bootTick);
    };
    for (const i of boot) load(i, bootTick);

    /** Repli : l'image exacte, sinon la plus proche déjà chargée. */
    function nearest(i: number) {
      const exact = cache.get(i);
      if (exact) return exact;
      for (let r = 1; r < count; r++) {
        const a = cache.get(i - r);
        if (a) return a;
        const b = cache.get(i + r);
        if (b) return b;
      }
      return null;
    }

    function evict(centre: number) {
      if (cache.size <= cap) return;
      const out: number[] = [];
      for (const i of cache.keys()) {
        if (ladderSet.has(i)) continue;
        if (i >= centre - BEHIND && i <= centre + AHEAD) continue;
        out.push(i);
      }
      out.sort((a, b) => Math.abs(b - centre) - Math.abs(a - centre));
      for (const i of out) {
        if (cache.size <= cap) break;
        cache.delete(i);
      }
    }

    let cw = 0;
    let ch = 0;
    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = canvas.clientWidth;
      ch = canvas.clientHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function draw(i: number) {
      const img = nearest(i);
      if (!img || !ctx) return;
      const s = Math.max(cw / img.width, ch / img.height);
      const w = img.width * s;
      const h = img.height * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }

    let curr = 0;
    let lastIdx = -1;
    let raf = 0;

    const tick = () => {
      if (disposed) return;
      const target = progressRef.current ?? 0;
      curr += (target - curr) * EASE;
      const idx = Math.max(0, Math.min(count - 1, Math.round(curr * (count - 1))));
      if (idx !== lastIdx) {
        draw(idx);
        lastIdx = idx;
        for (let k = 0; k <= AHEAD; k++) load(idx + k);
        for (let k = 1; k <= BEHIND; k++) load(idx - k);
        evict(idx);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      cache.clear();
      pending.clear();
    };
  }, [variant, reduced, progressRef]);

  return (
    <div className={className} aria-hidden>
      {/* Poster : premier rendu instantané, et seul visuel si mouvement réduit. */}
      <img
        src={SEQUENCE.poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: ready && !reduced ? 0 : 1, transition: 'opacity 600ms ease' }}
      />
      {!reduced && (
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
      )}
    </div>
  );
}
