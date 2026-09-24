'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, ChevronDown } from 'lucide-react';
import { BRAND } from '@/lib/data';
import HeroBackground from './HeroBackground';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Découpage par MOTS (unités insécables) — jamais lettre par lettre.
const LINE1 = BRAND.slogan.line1.split(' ');
const LINE2 = BRAND.slogan.line2.split(' ');

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>('.hero-word');

      // Intro — déclenchée à la fin du loader
      const runIntro = () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.from('.hero-media', { scale: 1.25, opacity: 0, duration: 1.6, ease: 'power2.out' })
          .from('.hero-eyebrow', { y: 30, opacity: 0, duration: 0.8 }, '-=1.1')
          .from(
            words,
            { yPercent: 120, opacity: 0, rotateZ: 4, stagger: 0.12, duration: 1 },
            '-=0.6'
          )
          .from('.hero-sub', { y: 24, opacity: 0, duration: 0.8 }, '-=0.6')
          .from('.hero-cta', { y: 24, opacity: 0, stagger: 0.12, duration: 0.7 }, '-=0.5')
          .from('.hero-badge', { scale: 0.8, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.6');
      };

      // Si le loader a déjà fini, on lance direct ; sinon on attend l'event
      const started = { current: false };
      const start = () => {
        if (started.current) return;
        started.current = true;
        runIntro();
      };
      window.addEventListener('keys:loaded', start, { once: true });
      // filet de sécurité
      const fallback = window.setTimeout(start, 2800);

      // Effet caméra au scroll : la scène avance / zoome / se floute
      gsap.to('.hero-media', {
        scale: 1.35,
        yPercent: 12,
        filter: 'blur(6px) brightness(0.5)',
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 },
      });
      gsap.to('.hero-content', {
        yPercent: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '70% top', scrub: 1 },
      });

      return () => {
        window.removeEventListener('keys:loaded', start);
        window.clearTimeout(fallback);
      };
    },
    { scope: root }
  );

  return (
    <section id="hero" ref={root} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden grain">
      {/* Couche média — remplaçable par une <video> plus tard */}
      <div className="hero-media absolute inset-0 will-change-transform">
        <Image
          src="/images/atelier.jpg"
          alt="Atelier premium KEYSPNEU77 à Montereau-Fault-Yonne"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/70 via-void/40 to-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/80 via-transparent to-void/60" />
      </div>

      {/* Fond animé canvas (étincelles, sol perspective) */}
      <HeroBackground />

      {/* Auras néon */}
      <div className="aura left-[-10%] top-[20%] h-[420px] w-[420px] bg-orange/20" />
      <div className="aura right-[-8%] top-[35%] h-[380px] w-[380px] bg-gold/15" />

      {/* Contenu */}
      <div className="hero-content relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 sm:px-8">
        <div className="hero-eyebrow mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-silver-dim">
          <span className="h-px w-8 bg-gradient-to-r from-orange to-transparent" />
          Spécialiste pneumatique · {BRAND.address.city.split('-')[0]} 77
        </div>

        <h1
          className="hero-title text-hero font-display"
          aria-label={`${BRAND.slogan.line1} ${BRAND.slogan.line2}`}
        >
          <span className="hero-line" aria-hidden>
            {LINE1.map((w, i) => (
              <span key={i} className="hero-word-mask">
                <span className="hero-word gradient-silver">{w}</span>
              </span>
            ))}
          </span>
          <span className="hero-line" aria-hidden>
            {LINE2.map((w, i) => (
              <span key={i} className="hero-word-mask">
                <span className="hero-word gradient-flame text-glow-orange">{w}</span>
              </span>
            ))}
          </span>
        </h1>

        <p className="hero-sub mt-6 max-w-xl text-base leading-relaxed text-silver sm:text-lg">
          Pneus neufs & d&apos;occasion, montage, équilibrage, géométrie. La précision
          d&apos;un atelier de course, au service de votre sécurité.{' '}
          <span className="text-white">{BRAND.tagline}.</span>
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="hero-cta">
            <MagneticButton href={`tel:${BRAND.phoneRaw}`} icon={<Phone size={17} strokeWidth={2.5} />}>
              Appeler maintenant
            </MagneticButton>
          </div>
          <div className="hero-cta">
            <MagneticButton href="#services" variant="ghost" icon={<ChevronDown size={17} />}>
              Découvrir l&apos;atelier
            </MagneticButton>
          </div>
        </div>

        {/* Badges de réassurance */}
        <div className="mt-12 flex flex-wrap gap-3">
          {[
            { k: 'Montage', v: 'jour même' },
            { k: 'Devis', v: 'gratuit' },
            { k: 'Prix', v: 'imbattables' },
          ].map((b) => (
            <div key={b.k} className="hero-badge glass flex items-center gap-2 rounded-full px-4 py-2 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-orange shadow-[0_0_10px_2px_rgba(255,122,0,0.7)]" />
              <span className="text-silver-dim">{b.k}</span>
              <span className="font-semibold text-white">{b.v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
