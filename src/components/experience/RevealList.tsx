'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Révèle ses éléments un à un au fil de l'avancée dans la section.
 *
 * Le déclencheur est la position de l'élément dans la fenêtre, pas une
 * animation autonome : remonter referme la liste, ce qui garde l'expérience
 * cohérente avec le reste du site où tout suit le défilement.
 *
 * `prefers-reduced-motion` : tout est affiché d'emblée, sans transition.
 */
export default function RevealList({
  items,
  className = '',
  itemClassName = '',
}: {
  items: React.ReactNode[];
  className?: string;
  itemClassName?: string;
}) {
  const root = useRef<HTMLUListElement>(null);
  const [n, setN] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduced) {
      setN(items.length);
      return;
    }
    const el = root.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const h = window.innerHeight;
      // 0 quand la liste arrive par le bas, 1 quand elle atteint le tiers haut.
      const p = (h - r.top) / (h * 0.78);
      const k = Math.round(Math.min(1, Math.max(0, p)) * items.length);
      setN((prev) => (prev === k ? prev : k));
    };
    const onScroll = () => {
      if (raf === 0) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items.length, reduced]);

  return (
    <ul ref={root} className={className}>
      {items.map((it, i) => {
        const on = i < n;
        return (
          <li
            key={i}
            className={itemClassName}
            style={{
              opacity: on ? 1 : 0,
              transform: on ? 'translateY(0)' : 'translateY(18px)',
              transition: reduced
                ? 'none'
                : `opacity 620ms cubic-bezier(0.16,1,0.3,1) ${i * 55}ms, transform 620ms cubic-bezier(0.16,1,0.3,1) ${i * 55}ms`,
            }}
          >
            {it}
          </li>
        );
      })}
    </ul>
  );
}
