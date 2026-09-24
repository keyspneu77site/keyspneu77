'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Tire from './Tire';

type Tile =
  | { type: 'photo'; src: string; alt: string; caption: string; span: string; pos?: string }
  | { type: 'statement'; title: string; sub: string; span: string }
  | { type: 'tire'; span: string };

/**
 * Galerie éditoriale. Les tuiles photo utilisent les vraies images du garage
 * (cadrages variés). Ajoutez simplement des objets { type:'photo', ... } quand
 * de nouvelles photos seront disponibles.
 */
const TILES: Tile[] = [
  { type: 'photo', src: '/images/atelier.jpg', alt: "Vue d'ensemble de l'atelier KEYSPNEU77", caption: "L'atelier", span: 'sm:col-span-2 sm:row-span-2', pos: 'object-center' },
  { type: 'statement', title: 'Noir & Orange', sub: 'Une signature visuelle', span: '' },
  { type: 'photo', src: '/images/facade.jpg', alt: 'Façade et enseigne KEYSPNEU77', caption: 'La devanture', span: 'sm:row-span-2', pos: 'object-top' },
  { type: 'tire', span: '' },
  { type: 'photo', src: '/images/atelier.jpg', alt: 'Rayonnage de pneus premium', caption: 'Le stock', span: '', pos: 'object-left' },
  { type: 'photo', src: '/images/atelier.jpg', alt: 'Ponts élévateurs et zone de montage', caption: 'La zone montage', span: 'sm:col-span-2', pos: 'object-right' },
];

export default function Gallery() {
  const [active, setActive] = useState<{ src: string; alt: string } | null>(null);

  // Fermeture au clavier (Échap) + verrouillage du défilement de fond
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  return (
    <section id="galerie" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <SectionHeading
        label="Galerie"
        title={
          <>
            Bienvenue dans{' '}
            <span className="gradient-flame">l'atelier.</span>
          </>
        }
        intro="Un lieu pensé comme un stand professionnel. Propreté, équipement, ambiance : le décor de votre tranquillité."
      />

      <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:grid-cols-4">
        {TILES.map((t, i) => {
          if (t.type === 'photo') {
            return (
              <motion.button
                key={i}
                onClick={() => setActive({ src: t.src, alt: t.alt })}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.05 }}
                data-cursor="hover"
                className={`group relative overflow-hidden rounded-2xl border border-white/8 ${t.span}`}
              >
                <Image
                  src={t.src}
                  alt={t.alt}
                  fill
                  sizes="(max-width:640px) 50vw, 25vw"
                  className={`object-cover ${t.pos ?? 'object-center'} scale-105 brightness-[0.85] transition-all duration-700 ease-out group-hover:scale-100 group-hover:brightness-100`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 flex w-full items-center justify-between p-4">
                  <span className="font-display text-sm uppercase tracking-wide text-white">{t.caption}</span>
                  <span className="flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Maximize2 size={14} className="text-white" />
                  </span>
                </div>
              </motion.button>
            );
          }
          if (t.type === 'statement') {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.05 }}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border border-orange/20 bg-gradient-to-br from-orange-deep/20 to-ink p-5 ${t.span}`}
              >
                <div className="aura right-[-30%] top-[-30%] h-40 w-40 bg-orange/30" />
                <span className="relative font-display text-3xl leading-none text-white">{t.title}</span>
                <span className="relative text-xs text-silver-dim">{t.sub}</span>
              </motion.div>
            );
          }
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.05 }}
              className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/8 bg-carbon ${t.span}`}
            >
              <motion.div
                className="h-24 w-24"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: 'linear', duration: 8 }}
              >
                <Tire className="h-full w-full opacity-80" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox plein écran */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[1100] flex items-center justify-center bg-void/92 p-4 backdrop-blur-xl sm:p-10"
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Fermer"
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white"
            >
              <X size={22} />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full max-h-[82vh] w-full max-w-5xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={active.src} alt={active.alt} fill className="object-contain" sizes="100vw" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
