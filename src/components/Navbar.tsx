'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { Phone, Menu, X } from 'lucide-react';
import { NAV_LINKS, BRAND } from '@/lib/data';
import Wordmark from './Wordmark';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-[900] px-4 pt-3 sm:px-6"
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 ${
            scrolled ? 'glass-strong shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)]' : 'bg-transparent'
          }`}
        >
          <a href="#hero" className="flex items-center gap-2" aria-label="Accueil KEYSPNEU77">
            <Wordmark size="sm" />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative rounded-full px-3.5 py-2 text-[13px] font-medium text-silver-dim transition-colors hover:text-white"
                >
                  {l.label}
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-orange to-gold transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${BRAND.phoneRaw}`}
              className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-orange to-gold px-4 py-2 text-[13px] font-semibold text-black shadow-[0_0_30px_-10px_rgba(255,122,0,0.8)] transition-transform hover:scale-[1.03] sm:flex"
            >
              <Phone size={15} strokeWidth={2.5} />
              {BRAND.phone}
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>

        {/* Barre de progression scroll */}
        <div className="mx-auto mt-2 h-px max-w-7xl overflow-hidden px-6">
          <motion.div className="h-full origin-left bg-gradient-to-r from-orange to-gold" style={{ scaleX: progress }} />
        </div>
      </motion.header>

      {/* Menu mobile plein écran */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex flex-col bg-void/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex items-center justify-between px-5 pt-5">
              <Wordmark size="sm" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white"
              >
                <X size={22} />
              </button>
            </div>

            <ul className="flex flex-1 flex-col justify-center gap-1 px-6">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/5 py-4 font-display text-3xl uppercase text-chalk transition-colors hover:text-orange"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="p-6">
              <a
                href={`tel:${BRAND.phoneRaw}`}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange to-gold py-4 font-semibold text-black"
              >
                <Phone size={18} strokeWidth={2.5} /> {BRAND.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
