'use client';

import { useEffect, useRef, useState } from 'react';
import { GARAGE } from '@/lib/experience';
import LogoLockup from '@/components/brand/LogoLockup';

/**
 * Entrée cinématique — noir, logo, slogan, puis levée du rideau.
 *
 * Deux garanties de conception :
 *  1. Le défilement n'est JAMAIS bloqué. Si l'utilisateur agit (molette,
 *     tactile, clavier, clic), l'intro se retire immédiatement. Le site ne
 *     peut donc pas rester verrouillé, quoi qu'il arrive.
 *  2. Les phases sont pilotées par le temps écoulé dans une boucle rAF, et
 *     non par une cascade de setTimeout : une seule animation à annuler, et
 *     l'état final est atteint même si une trame est sautée.
 *
 * L'intro ne joue qu'une fois par session.
 */

const PHASES = { logo: 260, slogan: 900, lieu: 1500, sortie: 2500, fin: 3200 } as const;
const KEY = 'keys:intro-vue';

export default function Intro() {
  const [t, setT] = useState(0);
  const [gone, setGone] = useState(true);
  const raf = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let deja = false;
    try {
      deja = sessionStorage.getItem(KEY) === '1';
    } catch {
      // sessionStorage indisponible (navigation privée) : on joue l'intro.
    }
    if (reduced || deja) return;

    setGone(false);
    const start = performance.now();

    const tick = (now: number) => {
      const e = now - start;
      setT(e);
      if (e < PHASES.fin) {
        raf.current = requestAnimationFrame(tick);
      } else {
        finir();
      }
    };
    raf.current = requestAnimationFrame(tick);

    const finir = () => {
      cancelAnimationFrame(raf.current);
      setGone(true);
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {
        /* sans conséquence */
      }
    };

    const events: (keyof WindowEventMap)[] = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    events.forEach((ev) => window.addEventListener(ev, finir, { once: true, passive: true }));

    return () => {
      cancelAnimationFrame(raf.current);
      events.forEach((ev) => window.removeEventListener(ev, finir));
    };
  }, []);

  if (gone) return null;

  const apres = (ms: number) => t >= ms;
  const sortie = apres(PHASES.sortie);

  const monte = (actif: boolean) => ({
    opacity: actif ? 1 : 0,
    transform: actif ? 'translateY(0)' : 'translateY(14px)',
    transition: 'opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)',
  });

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9000] flex flex-col items-center justify-center bg-void px-6"
      style={{
        opacity: sortie ? 0 : 1,
        transition: 'opacity 650ms ease',
        pointerEvents: sortie ? 'none' : 'auto',
      }}
    >
      <div style={monte(apres(PHASES.logo))}>
        <LogoLockup baseline className="text-[clamp(1.5rem,6.5vw,2.8rem)]" />
      </div>

      <p
        className="mt-7 text-center font-display"
        style={{
          fontSize: 'clamp(1.05rem, 4.4vw, 1.9rem)',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
          background: 'linear-gradient(100deg,#ffd24c 0%,#ffc300 24%,#ff9e2c 60%,#ff7a00 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          ...monte(apres(PHASES.slogan)),
        }}
      >
        {GARAGE.slogan}
      </p>

      <div
        className="mt-10 flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.34em] text-silver-dim"
        style={monte(apres(PHASES.lieu))}
      >
        <span className="h-px w-6 bg-orange/60" />
        {GARAGE.address.city}
        <span className="text-orange">{GARAGE.address.zip.slice(0, 2)}</span>
        <span className="h-px w-6 bg-orange/60" />
      </div>
    </div>
  );
}
