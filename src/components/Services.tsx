'use client';

import { useRef } from 'react';
import { motion } from 'motion/react';
import {
  CircleDot,
  Recycle,
  Wrench,
  Gauge,
  Crosshair,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { SERVICES } from '@/lib/data';
import SectionHeading from './SectionHeading';

const ICONS: Record<string, LucideIcon> = {
  CircleDot,
  Recycle,
  Wrench,
  Gauge,
  Crosshair,
  ShieldCheck,
  Sparkles,
};

function TiltCard({ service, index }: { service: (typeof SERVICES)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = ICONS[service.icon] ?? CircleDot;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: none)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-py * 10).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(px * 12).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(px * 100 + 50).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(py * 100 + 50).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.08 }}
      style={{ perspective: 1000 }}
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data-cursor="hover"
        className="group relative h-full rounded-2xl border border-white/8 bg-gradient-to-b from-carbon to-ink p-7 transition-shadow duration-300 hover:shadow-[0_30px_80px_-40px_rgba(255,122,0,0.6)]"
        style={{
          transform: 'rotateX(var(--rx,0)) rotateY(var(--ry,0))',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.25s ease-out',
        }}
      >
        {/* Reflet lumineux suivant la souris */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(300px circle at var(--gx,50%) var(--gy,50%), rgba(255,122,0,0.14), transparent 65%)',
          }}
        />
        {/* Bordure dégradée au survol */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent [mask:linear-gradient(#000,#000)] transition-colors duration-300 group-hover:border-orange/30" />

        <div style={{ transform: 'translateZ(40px)' }} className="relative flex h-full flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black/40">
              <Icon className="text-orange transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" size={26} strokeWidth={1.8} />
              <div className="absolute inset-0 rounded-xl bg-orange/10 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-widest text-silver-dim">
              {service.tag}
            </span>
          </div>

          <h3 className="mb-2 font-display text-2xl text-white">{service.title}</h3>
          <p className="flex-1 text-sm leading-relaxed text-silver-dim">{service.desc}</p>

          <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-orange opacity-0 transition-all duration-300 group-hover:opacity-100">
            En savoir plus
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

          {/* Numéro en filigrane */}
          <span className="pointer-events-none absolute -right-1 -top-2 font-display text-6xl text-white/[0.03]">
            {(index + 1).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <div className="aura left-[-15%] top-[10%] h-[400px] w-[400px] bg-orange/10" />
      <SectionHeading
        label="Nos prestations"
        title={
          <>
            Tout le pneu.<br />
            <span className="gradient-flame">Rien d'autre.</span>
          </>
        }
        intro="Un garage 100 % dédié au pneumatique. Chaque prestation exécutée avec la précision et l'exigence d'un stand de course."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <TiltCard key={s.id} service={s} index={i} />
        ))}
      </div>
    </section>
  );
}
