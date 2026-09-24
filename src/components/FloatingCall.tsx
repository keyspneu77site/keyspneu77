'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone } from 'lucide-react';
import { BRAND } from '@/lib/data';

/** CTA d'appel flottant — apparaît après le hero. Toujours à portée de pouce. */
export default function FloatingCall() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={`tel:${BRAND.phoneRaw}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          data-cursor="hover"
          aria-label={`Appeler ${BRAND.phone}`}
          className="fixed bottom-5 right-5 z-[800] flex items-center gap-2 rounded-full bg-gradient-to-r from-orange to-gold px-5 py-4 font-semibold text-black shadow-[0_10px_40px_-8px_rgba(255,122,0,0.8)]"
        >
          <span className="relative flex h-5 w-5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/30" />
            <Phone size={18} strokeWidth={2.6} />
          </span>
          <span className="hidden sm:inline">Appeler</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
