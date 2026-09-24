'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Clock, MapPin, Phone } from 'lucide-react';
import {
  ARGUMENTS_PNEUS,
  BRANDS,
  ETAPES_ATELIER,
  GARAGE,
  HORAIRES,
  SCENES,
  SERVICES,
  SOCIALS,
  TARIFS,
} from '@/lib/experience';
import LogoLockup from '@/components/brand/LogoLockup';
import Avis from './Avis';
import AvantApres from './AvantApres';
import CallButton from './CallButton';
import Intro from './Intro';
import RendezVous from './RendezVous';
import RevealList from './RevealList';
import SceneCanvas from './SceneCanvas';
import SceneNav from './SceneNav';

/**
 * L'expérience KEYSPNEU77.
 *
 * Un seul espace continu : l'atelier filmé est un décor FIXE dont
 * l'avancement est lu sur la position de défilement du document. Les scènes
 * se succèdent par-dessus sans jamais le masquer complètement — d'où
 * l'impression d'un même lieu traversé, plutôt que d'une pile de sections.
 *
 * Aucune section n'est verrouillée : on lit le défilement, on ne le capture
 * jamais. Remonter fait donc reculer la caméra naturellement.
 *
 * 2026-09-18 : plus aucune photo de l'atelier. Le relief vient désormais de
 * la 3D (pneu, marques) et du décor filmé. Voir l'en-tête de lib/experience.ts.
 */

/**
 * three.js ne part PAS dans le bundle d'entrée.
 *
 * Les deux scènes 3D sont chargées à la demande : la page d'accueil reste
 * légère, et la bibliothèque (~150 Ko) n'est téléchargée que si le visiteur
 * descend jusqu'aux sections Pneus ou Marques. `ssr: false` parce qu'un
 * contexte WebGL n'existe pas côté serveur : le rendu statique serait vide.
 */
const Tyre3D = dynamic(() => import('@/components/three/Tyre3D'), { ssr: false });
const Brands3D = dynamic(() => import('@/components/three/Brands3D'), { ssr: false });

/**
 * Voile latéral sous les colonnes de texte.
 *
 * Le décor filmé alterne des plans très sombres (racks) et très clairs
 * (plafond hexagonal, affiches). Sans ce dégradé, la même page passait de
 * lisible à illisible d'une section à l'autre selon l'image en cours.
 * Il s'arrête à 62 % : l'atelier reste visible, on ne pose pas un aplat noir.
 */
function VoileGauche() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'linear-gradient(95deg, rgba(6,6,7,0.92) 0%, rgba(6,6,7,0.78) 26%, rgba(6,6,7,0.30) 48%, transparent 62%)',
      }}
    />
  );
}

/** En-tête de chapitre : « 03 — PNEUS ». Même gabarit partout. */
function Chapitre({ n, titre }: { n: number; titre: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="font-display text-[0.62rem] tracking-[0.3em] text-orange">
        {String(n).padStart(2, '0')}
      </span>
      <span className="h-px w-8 bg-orange/50" />
      <span className="text-[0.62rem] uppercase tracking-[0.28em] text-silver-dim">{titre}</span>
    </div>
  );
}

export default function GarageExperience() {
  const progressRef = useRef(0);
  const [active, setActive] = useState(1);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    let b = 0;
    const a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, []);

  useEffect(() => {
    const sections = SCENES.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      const mid = window.innerHeight / 2;
      let current = 1;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          current = SCENES.find((s) => s.id === el.id)?.index ?? 1;
          break;
        }
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (raf === 0) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const monte = (delai: number) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? 'translateY(0)' : 'translateY(22px)',
    transition: `opacity 900ms cubic-bezier(0.16,1,0.3,1) ${delai}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${delai}ms`,
  });

  return (
    <div className="relative bg-void text-chalk">
      <Intro />

      {/* ---------- DÉCOR FIXE : l'atelier filmé ---------- */}
      <SceneCanvas progressRef={progressRef} className="fixed inset-0 z-0" />
      {/* Trois couches sur le décor filmé. Sans elles, le plafond hexagonal —
          très clair — délavait toute la page et le texte flottait dessus. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,6,7,0.93) 0%, rgba(6,6,7,0.64) 30%, rgba(6,6,7,0.70) 70%, rgba(6,6,7,0.96) 100%)',
        }}
      />
      {/* Vignette : ramène le regard au centre, referme les bords. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 28%, rgba(6,6,7,0.55) 78%, rgba(6,6,7,0.85) 100%)',
        }}
      />
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[1]" />

      <SceneNav active={active} />
      <CallButton />

      <div className="relative z-[2]">
        {/* ================= 01 — ENTRÉE ================= */}
        <section
          id="entree"
          aria-labelledby="entree-title"
          className="relative flex min-h-[100svh] flex-col justify-center px-5 sm:px-8 lg:px-16"
        >
          <div style={monte(0)}>
            <LogoLockup baseline className="text-[clamp(1.6rem,6vw,3.2rem)]" />
          </div>

          {/* Slogan : deux lignes insécables. Jamais de découpe lettre à lettre,
              jamais de mot orphelin coupé. */}
          <h1 id="entree-title" className="font-display m-0 mt-10">
            <span
              className="block whitespace-nowrap text-chalk"
              style={{
                fontSize: 'clamp(1.75rem, 8vw, 5rem)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                ...monte(120),
              }}
            >
              Le grip
            </span>
            <span
              className="gradient-flame block whitespace-nowrap"
              style={{
                fontSize: 'clamp(1.75rem, 8vw, 5rem)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                ...monte(240),
              }}
            >
              commence ici
            </span>
          </h1>

          <div
            className="mt-7 flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.32em] text-silver-dim"
            style={monte(360)}
          >
            <span className="h-px w-6 bg-orange/60" />
            {GARAGE.address.city}
            <span className="text-orange">{GARAGE.address.zip.slice(0, 2)}</span>
          </div>

          <div className="mt-9 flex flex-wrap gap-3" style={monte(480)}>
            <a
              href={GARAGE.phoneHref}
              className="inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.03]"
            >
              <Phone size={16} strokeWidth={2.5} />
              Appeler le garage
            </a>
            <a
              href="#atelier"
              className="inline-flex items-center gap-2 rounded-full border border-white/18 px-6 py-3 text-sm font-semibold text-chalk transition-colors duration-300 hover:border-orange/70"
            >
              Entrer dans l&apos;atelier
            </a>
          </div>
        </section>

        {/* ================= 02 — ATELIER =================
            Aucune illustration : le décor filmé DERRIÈRE le texte est
            l'atelier. Y superposer une photo du même lieu était redondant. */}
        <section
          id="atelier"
          aria-labelledby="atelier-title"
          className="relative flex min-h-[100svh] items-center px-5 py-24 sm:px-8 lg:px-16"
        >
          <VoileGauche />
          <div className="relative w-full max-w-[640px]">
            <Chapitre n={2} titre="Atelier" />
            <h2
              id="atelier-title"
              className="font-display m-0 text-chalk"
              style={{
                fontSize: 'clamp(1.9rem, 6vw, 3.8rem)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              Chaque roue passe
              <br />
              entre les mêmes mains
            </h2>
            <p className="mt-6 max-w-[46ch] text-[0.98rem] leading-relaxed text-silver">
              Les mêmes machines, le même contrôle, du premier démontage au serrage
              final. Rien n&apos;est sous-traité.
            </p>

            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
              {ETAPES_ATELIER.map((mot) => (
                <li
                  key={mot}
                  className="flex items-center gap-2.5 text-[0.7rem] uppercase tracking-[0.2em] text-silver-dim"
                >
                  <span className="h-1 w-1 rounded-full bg-orange" />
                  {mot}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= 03 — PNEUS (3D) ================= */}
        <section
          id="pneus"
          aria-labelledby="pneus-title"
          className="relative flex min-h-[110svh] flex-col justify-center overflow-hidden px-5 py-24 sm:px-8 lg:px-16"
        >
          <VoileGauche />

          <div className="relative w-full max-w-[520px]">
            <Chapitre n={3} titre="Pneus" />
            <h2
              id="pneus-title"
              className="font-display m-0 text-chalk"
              style={{
                fontSize: 'clamp(1.9rem, 6vw, 3.8rem)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              Neuf ou occasion
            </h2>
            <p className="mt-6 max-w-[42ch] text-[0.98rem] leading-relaxed text-silver">
              L&apos;occasion est contrôlée une par une : profondeur de gomme, flancs,
              date de fabrication. Ce qui ne passe pas ne se vend pas.
            </p>

            {/* Le prix unique est L'argument du garage : même tarif du 13 au
                21 pouces. On l'affiche donc en entier, pas en note de bas de
                bloc — c'est ce que le visiteur est venu chercher. */}
            <div className="mt-10 rounded-2xl border border-orange/25 bg-void/55 p-6 backdrop-blur-md">
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-silver-dim">
                {TARIFS.pneus.paire.label}
              </p>
              <p
                className="font-display mt-2 leading-none text-gold"
                style={{ fontSize: 'clamp(2.2rem, 8vw, 3.4rem)' }}
              >
                {TARIFS.pneus.paire.prix}
              </p>
              <p className="mt-3 text-[0.82rem] text-silver">{TARIFS.pneus.paire.mention}</p>
              <p className="mt-1 text-[0.82rem] text-orange">{TARIFS.pneus.paire.tailles}</p>

              <p className="mt-5 flex items-baseline gap-3 border-t border-white/10 pt-4 text-[0.86rem] text-silver">
                <span>{TARIFS.pneus.quatre.label}</span>
                <span className="font-display text-gold">{TARIFS.pneus.quatre.prix}</span>
              </p>
            </div>

            <ul className="mt-8 grid list-none grid-cols-1 gap-x-6 gap-y-2.5 p-0 sm:grid-cols-2">
              {ARGUMENTS_PNEUS.map((a) => (
                <li key={a} className="flex items-start gap-2.5 text-[0.86rem] text-silver">
                  <span aria-hidden className="mt-[0.52em] h-1 w-1 shrink-0 rounded-full bg-orange" />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Sous 1024 px la roue prend son PROPRE bloc, sous la colonne : en
              fond, même très atténuée, elle passait derrière le paragraphe et
              le rendait pénible à lire. Au-delà, elle reprend toute la section
              et se décale d'elle-même à droite du texte. */}
          <Tyre3D className="relative mt-12 h-[36svh] w-full lg:absolute lg:inset-0 lg:mt-0 lg:h-auto" />
        </section>

        {/* ================= 04 — MARQUES (3D) ================= */}
        <section
          id="marques"
          aria-labelledby="marques-title"
          className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-20"
        >
          {/* Pas de VoileGauche ici : il assombrissait la plaque de gauche du
              carrousel. Le titre est déjà porté par le voile radial en dessous. */}
          <div className="relative px-5 sm:px-8 lg:px-16">
            <Chapitre n={4} titre="Marques" />
            <h2
              id="marques-title"
              className="font-display m-0 text-chalk"
              style={{
                fontSize: 'clamp(1.9rem, 6vw, 3.8rem)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              Ce qu&apos;on monte
            </h2>
          </div>

          {/* Voile local : le decor filme (machines, racks) passait devant les
              plaques et les rendait illisibles. */}
          <div className="relative mt-2">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 55%, rgba(6,6,7,0.88) 0%, rgba(6,6,7,0.60) 55%, transparent 80%)',
              }}
            />
            <Brands3D className="relative h-[56svh] w-full sm:h-[60svh]" />
          </div>

          <p className="px-5 text-center text-[0.68rem] uppercase tracking-[0.22em] text-silver-dim sm:px-8 lg:px-16">
            {BRANDS.length} marques montées à l&apos;atelier — autres références sur demande
          </p>
        </section>

        {/* ================= 05 — SERVICES ================= */}
        <section
          id="services"
          aria-labelledby="services-title"
          className="relative flex min-h-[110svh] items-center px-5 py-24 sm:px-8 lg:px-16"
        >
          <VoileGauche />
          <div className="relative w-full max-w-[620px]">
            <Chapitre n={5} titre="Services" />
            <h2
              id="services-title"
              className="font-display m-0 text-chalk"
              style={{
                fontSize: 'clamp(1.9rem, 6vw, 3.8rem)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              Ce qu&apos;on fait
            </h2>

            {/* Les 4 prestations, révélées une à une, chacune avec sa ligne de
                précision. Aucune statistique inventée : ni nombre de clients,
                ni années d'expérience. */}
            <RevealList
              className="mt-10 flex flex-col"
              itemClassName="border-b border-white/10 py-4"
              items={SERVICES.map((s) => (
                <div key={s.id}>
                  <span
                    className="font-display block text-chalk"
                    style={{ fontSize: 'clamp(1.05rem, 3.4vw, 1.65rem)', letterSpacing: '-0.01em' }}
                  >
                    {s.label}
                  </span>
                  <span className="mt-1.5 block text-[0.84rem] leading-relaxed text-silver-dim">
                    {s.detail}
                  </span>
                </div>
              ))}
            />

            {/* Les trois formules de nettoyage, avec le contenu réel de chacune :
                un prix seul ne dit pas ce qu'on achète. */}
            <div className="mt-14">
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-silver-dim">
                Nettoyage intérieur — nos formules
              </p>

              <ul className="mt-5 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-3">
                {TARIFS.nettoyage.formules.map((f) => (
                  <li
                    key={f.formule}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
                  >
                    <p className="font-display text-[0.95rem] text-chalk">{f.formule}</p>
                    <p
                      className="font-display mt-1 leading-none text-gold"
                      style={{ fontSize: 'clamp(1.6rem, 6vw, 2.1rem)' }}
                    >
                      {f.prix}
                    </p>
                    <ul className="mt-4 list-none space-y-2 p-0">
                      {f.prestations.map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-2 text-[0.78rem] leading-snug text-silver"
                        >
                          <span
                            aria-hidden
                            className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-orange/70"
                          />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                {TARIFS.nettoyage.supplements.map((s) => (
                  <span key={s.label} className="text-[0.8rem] text-silver-dim">
                    {s.label} <span className="text-gold">{s.prix}</span>
                  </span>
                ))}
              </div>

              <p className="mt-4 text-[0.84rem] text-silver">{TARIFS.nettoyage.domicile}</p>

              {/* La preuve du travail, juste sous les prix : trois
                  véhicules filmés avant et après passage à l’atelier. */}
              <AvantApres />
            </div>
          </div>
        </section>

        {/* ================= 06 — AVIS =================
            Les avis Google du garage : 4,9 sur 34 avis. Recopiés, jamais
            réécrits. Le détail de ce qui est possible côté Google est dans
            l'en-tête de Avis.tsx. */}
        <section
          id="avis"
          aria-labelledby="avis-title"
          className="relative flex min-h-[100svh] items-center px-5 py-24 sm:px-8 lg:px-16"
        >
          <VoileGauche />
          <div className="relative w-full max-w-[1100px]">
            <Chapitre n={6} titre="Avis" />
            <h2
              id="avis-title"
              className="font-display m-0 text-chalk"
              style={{
                fontSize: 'clamp(1.9rem, 6vw, 3.8rem)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              Ce qu&apos;ils en disent
            </h2>

            <Avis />
          </div>
        </section>

        {/* ================= 07 — RENDEZ-VOUS =================
            Fond graphique : un halo, pas une photo de bâche froissée. */}
        <section
          id="contact"
          aria-labelledby="contact-title"
          className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center sm:px-8"
        >
          <div
            aria-hidden
            className="aura left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2"
            style={{ background: 'radial-gradient(circle, rgba(255,122,0,0.22), transparent 68%)' }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(6,6,7,0.45) 0%, rgba(6,6,7,0.80) 55%, rgba(6,6,7,0.97) 100%)',
            }}
          />

          <div className="relative z-10 flex w-full flex-col items-center">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-orange">
              Prêt à prendre la route ?
            </p>

            <h2 id="contact-title" className="m-0 mt-7">
              <LogoLockup baseline className="text-[clamp(1.5rem,7vw,3.4rem)]" />
            </h2>

            <p
              className="font-display mt-9 text-chalk"
              style={{ fontSize: 'clamp(1.35rem, 5vw, 2.2rem)', letterSpacing: '-0.02em' }}
            >
              Prendre rendez-vous
            </p>

            {/* Le formulaire n'envoie rien à un serveur : il ouvre WhatsApp ou
                les SMS déjà remplis. Voir l'en-tête de RendezVous.tsx. */}
            <div className="mt-8 w-full">
              <RendezVous />
            </div>

            {/* ---------- Venir sur place ---------- */}
            <div className="mt-14 w-full max-w-[560px] border-t border-white/10 pt-10">
              <address className="not-italic leading-relaxed text-silver">
                {GARAGE.address.street}
                <br />
                {GARAGE.address.zip} {GARAGE.address.city}
              </address>

              <p className="mt-4 inline-flex items-center gap-2.5 text-[0.88rem] text-silver">
                <Clock size={15} strokeWidth={2.5} className="text-orange" aria-hidden />
                {HORAIRES.resume}
              </p>

              <a
                href={GARAGE.phoneHref}
                className="font-display mt-7 flex items-center justify-center gap-3 text-gold transition-colors duration-300 hover:text-orange"
                style={{ fontSize: 'clamp(1.5rem, 6.5vw, 2.6rem)', letterSpacing: '-0.01em' }}
              >
                <Phone size={22} strokeWidth={2.5} aria-hidden />
                {GARAGE.phone}
              </a>

              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a
                  href={GARAGE.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.03]"
                >
                  <Phone size={16} strokeWidth={2.5} aria-hidden />
                  Appeler
                </a>
                <a
                  href={GARAGE.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-chalk transition-colors duration-300 hover:border-orange/70"
                >
                  <MapPin size={16} strokeWidth={2.5} aria-hidden />
                  Itinéraire
                </a>
              </div>

              <div className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.76rem] uppercase tracking-[0.18em] text-silver-dim transition-colors duration-300 hover:text-gold"
                  >
                    {s.label} · @{s.handle}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
