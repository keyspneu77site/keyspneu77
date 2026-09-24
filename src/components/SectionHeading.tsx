'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * En-tête de section : label + titre à mots révélés + intro, animés à l'entrée.
 */
export default function SectionHeading({
  label,
  title,
  intro,
  align = 'left',
}: {
  label: string;
  title: ReactNode;
  intro?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={`mb-14 max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease }}
        className={`mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-orange ${
          align === 'center' ? 'justify-center' : ''
        }`}
      >
        <span className="h-px w-8 bg-gradient-to-r from-orange to-transparent" />
        {label}
      </motion.div>

      <h2 className="text-section font-display">
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease }}
          className="block"
        >
          {title}
        </motion.span>
      </h2>

      {intro && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className={`mt-5 text-base leading-relaxed text-silver-dim ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {intro}
        </motion.p>
      )}
    </div>
  );
}
