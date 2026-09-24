'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Tire from './Tire';

/**
 * Écran de chargement cinématique :
 * pneu qui tourne + compteur 0→100 + rideau qui se lève.
 * Émet l'événement `keys:loaded` quand terminé.
 */
export default function Loader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 400 : 2200;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // easing out-cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setDone(true);
          window.dispatchEvent(new Event('keys:loaded'));
        }, 200);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-void"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              className="h-28 w-28 sm:h-36 sm:w-36"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, ease: 'linear', duration: 1.1 }}
            >
              <Tire className="h-full w-full drop-shadow-[0_0_40px_rgba(255,122,0,0.35)]" />
            </motion.div>

            <div className="mt-8 flex items-baseline gap-3">
              <span className="font-display text-5xl sm:text-6xl tabular-nums gradient-flame">
                {count.toString().padStart(3, '0')}
              </span>
              <span className="text-silver-dim text-lg">%</span>
            </div>

            <div className="mt-6 h-px w-56 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-deep to-gold"
                style={{ width: `${count}%` }}
              />
            </div>

            <p className="mt-6 font-display text-xs tracking-[0.4em] text-silver-dim">
              KEYS<span className="text-orange">PNEU</span>77
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
