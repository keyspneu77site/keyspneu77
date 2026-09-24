'use client';

import { motion } from 'motion/react';
import { Phone, MapPin, Navigation, MessageCircle, Clock } from 'lucide-react';
import { BRAND } from '@/lib/data';
import SectionHeading from './SectionHeading';
import MagneticButton from './MagneticButton';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Contact() {
  const wa = `https://wa.me/${BRAND.whatsapp.replace(/[^0-9]/g, '')}`;

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <div className="aura left-1/2 top-0 h-[400px] w-[500px] -translate-x-1/2 bg-orange/12" />

      <SectionHeading
        align="center"
        label="Contact"
        title={
          <>
            Prêt à rouler{' '}
            <span className="gradient-flame">en sécurité ?</span>
          </>
        }
        intro="Un conseil, un devis, une prise de rendez-vous : appelez, on décroche. Aucune prise de tête, que du concret."
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Carte infos + actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-b from-carbon to-ink p-8 sm:p-10"
        >
          <div className="aura right-[-20%] top-[-20%] h-52 w-52 bg-gold/15" />

          <div className="relative space-y-7">
            <a href={`tel:${BRAND.phoneRaw}`} className="group flex items-center gap-4" data-cursor="hover">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-orange">
                <Phone size={24} />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-widest text-silver-dim">Téléphone</span>
                <span className="font-display text-2xl text-white transition-colors group-hover:text-orange">
                  {BRAND.phone}
                </span>
              </span>
            </a>

            <div className="rule-glow" />

            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-orange">
                <MapPin size={24} />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-widest text-silver-dim">Adresse</span>
                <span className="block text-lg text-white">{BRAND.address.street}</span>
                <span className="block text-silver-dim">
                  {BRAND.address.zip} {BRAND.address.city}
                </span>
              </span>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-orange">
                <Clock size={24} />
              </span>
              <span className="w-full">
                <span className="mb-1 block text-xs uppercase tracking-widest text-silver-dim">Horaires</span>
                {BRAND.hours.map((h) => (
                  <span key={h.day} className="flex justify-between border-b border-white/5 py-1 text-sm last:border-0">
                    <span className="text-silver">{h.day}</span>
                    <span className={h.value === 'Fermé' ? 'text-silver-dim' : 'text-white'}>{h.value}</span>
                  </span>
                ))}
              </span>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
              <MagneticButton href={`tel:${BRAND.phoneRaw}`} icon={<Phone size={16} strokeWidth={2.5} />}>
                Appeler
              </MagneticButton>
              <MagneticButton href={wa} external variant="gold" icon={<MessageCircle size={16} strokeWidth={2.5} />}>
                WhatsApp
              </MagneticButton>
              <MagneticButton href={BRAND.maps} external variant="ghost" icon={<Navigation size={16} />}>
                Itinéraire
              </MagneticButton>
            </div>
          </div>
        </motion.div>

        {/* Faux "map" stylisé menant vers Google Maps */}
        <motion.a
          href={BRAND.maps}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="group relative flex min-h-[320px] items-end overflow-hidden rounded-3xl border border-white/8 bg-graphite"
        >
          {/* Grille type carte */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,122,0,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,122,0,0.12) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
          {/* Route diagonale */}
          <div className="absolute left-[-10%] top-1/2 h-1 w-[130%] -rotate-[18deg] bg-gradient-to-r from-transparent via-orange/50 to-transparent" />

          {/* Pin */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
            <span className="relative flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-60" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-gradient-to-br from-orange to-gold ring-4 ring-orange/20" />
            </span>
          </div>

          <div className="relative flex w-full items-center justify-between p-6">
            <div>
              <div className="font-display text-lg text-white">{BRAND.address.city}</div>
              <div className="text-xs text-silver-dim">Ouvrir dans Google Maps</div>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange to-gold text-black transition-transform group-hover:scale-110">
              <Navigation size={18} />
            </span>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
