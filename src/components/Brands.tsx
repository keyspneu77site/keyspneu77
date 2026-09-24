'use client';

import { motion } from 'motion/react';
import { BRANDS } from '@/lib/data';
import SectionHeading from './SectionHeading';

function Marquee({ reverse = false, speed = 32 }: { reverse?: boolean; speed?: number }) {
  const items = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS];
  return (
    <div className="relative flex overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <motion.div
        className="flex shrink-0 items-center gap-16 pr-16"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {items.map((b, i) => (
          <span
            key={i}
            data-cursor="hover"
            className="select-none whitespace-nowrap font-display text-3xl uppercase tracking-tight text-silver-dim/60 transition-colors duration-300 hover:text-white sm:text-5xl"
          >
            {b.name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Brands() {
  return (
    <section id="marques" className="relative overflow-hidden border-y border-white/5 bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          label="Nos marques"
          title={
            <>
              Les meilleures gommes,{' '}
              <span className="gradient-flame">réunies ici.</span>
            </>
          }
          intro="Nous travaillons avec les leaders mondiaux du pneumatique. Une exigence de qualité qui ne se négocie pas."
        />
      </div>

      <div className="flex flex-col gap-6">
        <Marquee speed={30} />
        <div className="rule-glow mx-8" />
        <Marquee reverse speed={38} />
      </div>

      {/* Grille de logos “cartes” */}
      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 px-5 sm:grid-cols-4 sm:px-8">
        {BRANDS.map((b, i) => (
          <motion.div
            key={b.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            data-cursor="hover"
            className="group flex items-center justify-center rounded-xl border border-white/8 bg-carbon/60 py-8 transition-all duration-300 hover:border-orange/40 hover:bg-carbon"
          >
            <span className="font-display text-xl uppercase text-silver-dim transition-colors group-hover:text-white sm:text-2xl">
              {b.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
