'use client';

import { useId } from 'react';
import { GARAGE } from '@/lib/experience';

/**
 * Logo KEYSPNEU77 — VECTORIEL.
 *
 * Remplace `public/media/brand/logo-900.webp`, qui était la photo d'un logo
 * posé sur un mur gris : sur fond noir, cette photo formait un rectangle
 * clair posé au milieu de l'écran, avec sa vignette et son ombre portée.
 * Un SVG n'a pas de fond du tout — il n'y a donc plus rien à détourer, et le
 * logo reste net à n'importe quelle taille.
 *
 * L'échelle suit la taille de police héritée : tout est exprimé en `em`.
 * Une seule règle à respecter à l'usage : donner un `font-size` au parent.
 */
export default function LogoLockup({
  className = '',
  baseline = false,
}: {
  className?: string;
  /** Affiche « La clé de votre sécurité » sous le logotype. */
  baseline?: boolean;
}) {
  const uid = useId().replace(/:/g, '');
  const carcasse = `carcasse-${uid}`;
  const flamme = `flamme-${uid}`;

  /**
   * 5 rayons, répartis tous les 72°, du moyeu vers la jante.
   * Volontairement épais et courts : la marque doit rester lisible à 24 px
   * dans un pied de page, pas seulement en grand dans le hero.
   */
  const rayons = [-90, -18, 54, 126, 198].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return {
      deg,
      x1: 50 + 9 * Math.cos(a),
      y1: 50 + 9 * Math.sin(a),
      x2: 50 + 19 * Math.cos(a),
      y2: 50 + 19 * Math.sin(a),
    };
  });

  return (
    <span
      className={`inline-flex items-center gap-[0.44em] ${className}`}
      role="img"
      aria-label={`${GARAGE.name} — ${GARAGE.baseline}`}
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        focusable="false"
        className="block h-[1.5em] w-[1.5em] shrink-0"
      >
        <defs>
          {/* Assez clair pour se détacher d'un fond noir, assez sombre pour
              rester du caoutchouc sur un fond clair. */}
          <linearGradient id={carcasse} x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="#6a6a78" />
            <stop offset="45%" stopColor="#2e2e38" />
            <stop offset="100%" stopColor="#141419" />
          </linearGradient>
          <linearGradient id={flamme} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffd24c" />
            <stop offset="52%" stopColor="#ff9e2c" />
            <stop offset="100%" stopColor="#ff7a00" />
          </linearGradient>
        </defs>

        {/* Carcasse */}
        <circle cx="50" cy="50" r="37" fill="none" stroke={`url(#${carcasse})`} strokeWidth="20" />
        {/* Sculpture : crampons détourés dans la bande de roulement */}
        <circle
          cx="50"
          cy="50"
          r="37"
          fill="none"
          stroke="#08080a"
          strokeOpacity="0.62"
          strokeWidth="20"
          strokeDasharray="6.2 8.4"
        />
        {/* Liseré extérieur : détache le pneu du noir du fond */}
        <circle cx="50" cy="50" r="47" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="1.4" />

        {/* Creux de jante : aplat sombre, sinon les rayons flottent sur le fond */}
        <circle cx="50" cy="50" r="26" fill="#0b0b0e" />

        {/* Jante */}
        <circle cx="50" cy="50" r="21" fill="none" stroke={`url(#${flamme})`} strokeWidth="4.5" />
        <g stroke={`url(#${flamme})`} strokeWidth="5" strokeLinecap="round">
          {rayons.map((r) => (
            <line key={r.deg} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
          ))}
        </g>
        <circle cx="50" cy="50" r="7.5" fill={`url(#${flamme})`} />
      </svg>

      <span className="font-display leading-none tracking-[-0.02em]">
        <span className="flex items-baseline">
          <span className="gradient-silver">KEYS</span>
          <span className="text-chalk">PNEU</span>
          <span className="gradient-flame ml-[0.06em] text-[1.18em]">77</span>
        </span>
        {baseline && (
          <span className="mt-[0.4em] flex items-center gap-[0.5em]">
            <span className="h-px flex-1 bg-orange/45" />
            <span className="text-[0.26em] font-semibold tracking-[0.34em] text-silver-dim">
              {GARAGE.baseline}
            </span>
            <span className="h-px flex-1 bg-orange/45" />
          </span>
        )}
      </span>
    </span>
  );
}
