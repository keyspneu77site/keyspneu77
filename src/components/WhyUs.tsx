'use client';

import { motion } from 'motion/react';
import {
  Timer,
  BadgeCheck,
  Cog,
  MessagesSquare,
  Tags,
  Award,
  type LucideIcon,
} from 'lucide-react';
import { REASONS } from '@/lib/data';
import SectionHeading from './SectionHeading';

const ICONS: Record<string, LucideIcon> = {
  Timer,
  BadgeCheck,
  Cog,
  MessagesSquare,
  Tags,
  Award,
};

const ease = [0.16, 1, 0.3, 1] as const;

export default function WhyUs() {
  return (
    <section id="pourquoi" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <div className="aura right-[-15%] top-[20%] h-[420px] w-[420px] bg-gold/10" />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        {/* Colonne gauche — titre + preuve */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            label="Pourquoi nous"
            title={
              <>
                La confiance,<br />
                <span className="gradient-flame">au premier contact.</span>
              </>
            }
            intro="Un garage qui vient d'ouvrir, avec l'exigence d'un nom déjà installé. Voici ce qui fait la différence, dès votre première visite."
          />

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { n: '7', l: 'prestations expertes' },
              { n: '4', l: 'marques premium' },
              { n: '30 min', l: 'temps moyen' },
              { n: '100 %', l: 'satisfaction visée' },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease, delay: i * 0.08 }}
                className="rounded-xl border border-white/8 bg-carbon/50 p-4"
              >
                <div className="font-display text-3xl gradient-flame">{s.n}</div>
                <div className="mt-1 text-xs text-silver-dim">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Colonne droite — raisons */}
        <div className="grid gap-4 sm:grid-cols-2">
          {REASONS.map((r, i) => {
            const Icon = ICONS[r.icon] ?? Award;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, ease, delay: (i % 2) * 0.08 }}
                data-cursor="hover"
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-carbon to-ink p-6 transition-colors duration-300 hover:border-orange/30"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-orange transition-transform duration-500 group-hover:-translate-y-1">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  {r.stat && (
                    <span className="font-display text-2xl text-white/10 transition-colors group-hover:text-orange/40">
                      {r.stat}
                    </span>
                  )}
                </div>
                <h3 className="mb-1.5 font-display text-xl text-white">{r.title}</h3>
                <p className="text-sm leading-relaxed text-silver-dim">{r.desc}</p>
                <div className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-orange to-gold transition-transform duration-500 group-hover:scale-x-100" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
