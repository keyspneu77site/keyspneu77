'use client';

import { motion } from 'motion/react';
import { Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { BRAND, NAV_LINKS } from '@/lib/data';
import Wordmark from './Wordmark';
import Socials from './Socials';
import MagneticButton from './MagneticButton';

export default function Footer() {
  const year = 2026; // année fixe (build) — mettez `new Date().getFullYear()` si dynamique souhaité

  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-ink">
      {/* Bandeau CTA géant */}
      <div className="relative mx-auto max-w-7xl px-5 py-24 text-center sm:px-8 sm:py-32">
        <div className="aura left-1/2 top-0 h-[360px] w-[560px] -translate-x-1/2 bg-orange/12" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mb-4 text-xs uppercase tracking-[0.4em] text-orange"
        >
          {BRAND.tagline}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative font-display leading-[0.95] text-balance [font-size:clamp(2.25rem,11vw,7rem)]"
        >
          <span className="gradient-silver">LE GRIP</span>{' '}
          <span className="gradient-flame">COMMENCE ICI</span>
        </motion.h2>

        <div className="relative mt-10 flex justify-center">
          <MagneticButton href={`tel:${BRAND.phoneRaw}`} icon={<Phone size={17} strokeWidth={2.5} />}>
            {BRAND.phone}
          </MagneticButton>
        </div>
      </div>

      <div className="rule-glow mx-5 sm:mx-8" />

      {/* Grille footer */}
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark size="md" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-silver-dim">
            Le spécialiste du pneumatique à {BRAND.address.city}. Vente, montage,
            équilibrage et géométrie — avec l'exigence d'un stand de course.
          </p>
          <Socials className="mt-6" />
        </div>

        <div>
          <h3 className="mb-4 text-xs uppercase tracking-widest text-silver-dim">Navigation</h3>
          <ul className="space-y-2.5">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group inline-flex items-center gap-1 text-sm text-silver transition-colors hover:text-orange">
                  {l.label}
                  <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs uppercase tracking-widest text-silver-dim">Coordonnées</h3>
          <a href={`tel:${BRAND.phoneRaw}`} className="flex items-center gap-2 text-sm text-silver transition-colors hover:text-orange">
            <Phone size={15} /> {BRAND.phone}
          </a>
          <a href={BRAND.maps} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-start gap-2 text-sm text-silver transition-colors hover:text-orange">
            <MapPin size={15} className="mt-0.5 shrink-0" />
            <span>
              {BRAND.address.street}
              <br />
              {BRAND.address.zip} {BRAND.address.city}
            </span>
          </a>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-silver-dim sm:flex-row sm:px-8">
          <p>© {year} {BRAND.name}. Tous droits réservés.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="transition-colors hover:text-white">Mentions légales</a>
            <a href="#" className="transition-colors hover:text-white">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
