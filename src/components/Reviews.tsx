'use client';

import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { REVIEWS } from '@/lib/data';
import SectionHeading from './SectionHeading';

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} className={i < n ? 'fill-gold text-gold' : 'text-white/15'} strokeWidth={1.5} />
      ))}
    </div>
  );
}

function Card({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <div
      data-cursor="hover"
      className="group relative w-[300px] shrink-0 overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-carbon to-ink p-6 transition-colors duration-300 hover:border-orange/30 sm:w-[360px]"
    >
      <Quote className="absolute right-4 top-4 text-white/[0.04] transition-colors group-hover:text-orange/10" size={56} />
      <Stars n={r.rating} />
      <p className="mt-4 text-sm leading-relaxed text-silver">“{r.text}”</p>
      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange to-gold font-display text-sm text-black">
          {r.initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{r.name}</div>
          <div className="text-xs text-silver-dim">{r.city}</div>
        </div>
      </div>
    </div>
  );
}

export default function Reviews() {
  const row = [...REVIEWS, ...REVIEWS];
  return (
    <section id="avis" className="relative overflow-hidden border-y border-white/5 bg-ink py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            label="Avis clients"
            title={
              <>
                Ils nous font{' '}
                <span className="gradient-flame">confiance.</span>
              </>
            }
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass mb-14 flex items-center gap-4 rounded-2xl px-6 py-4"
          >
            <div className="font-display text-4xl gradient-flame">5,0</div>
            <div>
              <Stars n={5} />
              <div className="mt-1 text-xs text-silver-dim">Note moyenne · avis vérifiés</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bandeau d'avis défilant */}
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <motion.div
          className="flex gap-5 px-5"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
        >
          {row.map((r, i) => (
            <Card key={i} r={r} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
