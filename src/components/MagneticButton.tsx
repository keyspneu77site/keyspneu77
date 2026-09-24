'use client';

import { useMagnetic } from '@/hooks/useMagnetic';
import type { ReactNode } from 'react';

type Props = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'gold';
  className?: string;
  icon?: ReactNode;
  ariaLabel?: string;
  external?: boolean;
};

/**
 * Bouton premium : hover magnétique, glow, remplissage lumineux animé,
 * micro-interaction sur l'icône.
 */
export default function MagneticButton({
  href,
  onClick,
  children,
  variant = 'primary',
  className = '',
  icon,
  ariaLabel,
  external,
}: Props) {
  const ref = useMagnetic<HTMLAnchorElement & HTMLButtonElement>(0.4);

  const base =
    'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300 will-change-transform';

  const styles = {
    primary:
      'text-black bg-gradient-to-r from-orange to-gold shadow-[0_0_40px_-8px_rgba(255,122,0,0.6)] hover:shadow-[0_0_60px_-6px_rgba(255,122,0,0.85)]',
    gold: 'text-black bg-gradient-to-r from-gold-soft to-gold shadow-[0_0_40px_-10px_rgba(255,195,0,0.6)]',
    ghost:
      'text-chalk border border-white/15 bg-white/[0.03] hover:border-orange/60 hover:text-white',
  }[variant];

  const inner = (
    <>
      {/* Reflet lumineux qui balaie au survol */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        {icon && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={`${base} ${styles} ${className}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <button ref={ref} onClick={onClick} aria-label={ariaLabel} className={`${base} ${styles} ${className}`}>
      {inner}
    </button>
  );
}
