'use client';

import { Instagram } from 'lucide-react';
import { BRAND } from '@/lib/data';

/** Icônes de marque (TikTok / Snapchat absents de lucide → SVG maison). */
function TikTok({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.5 3c.3 2.1 1.6 3.7 3.7 4v2.6c-1.4.1-2.7-.3-3.9-1v6.3c0 3.4-2.6 5.8-5.9 5.5-2.7-.3-4.7-2.6-4.6-5.3.1-2.6 2.2-4.7 4.8-4.7.3 0 .6 0 .9.1v2.7c-.3-.1-.6-.2-.9-.2-1.2 0-2.2 1-2.2 2.2 0 1.2 1 2.2 2.2 2.2 1.3 0 2.3-1 2.3-2.4V3h3.6z" />
    </svg>
  );
}
function Snapchat({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.2c2.6 0 4.3 2 4.4 4.6 0 .5 0 1 .1 1.4.4.2.9.1 1.4-.1.6-.2 1.2.6.7 1.2-.4.5-1.2.7-1.8.9-.3.1-.4.3-.3.6.5 1.7 1.9 3 3.6 3.5.5.1.5.8 0 1-.7.3-1.5.4-1.9.6-.1.3.1.7-.3.9-.5.2-1.3-.2-2.2-.1-.8.1-1.4 1.1-2.9 1.4-.6.1-1.1.1-1.6.1s-1 0-1.6-.1c-1.5-.3-2.1-1.3-2.9-1.4-.9-.1-1.7.3-2.2.1-.4-.2-.2-.6-.3-.9-.4-.2-1.2-.3-1.9-.6-.5-.2-.5-.9 0-1 1.7-.5 3.1-1.8 3.6-3.5.1-.3 0-.5-.3-.6-.6-.2-1.4-.4-1.8-.9-.5-.6.1-1.4.7-1.2.5.2 1 .3 1.4.1.1-.4.1-.9.1-1.4C7.7 4.2 9.4 2.2 12 2.2z" />
    </svg>
  );
}

const ICON: Record<string, React.ComponentType<{ size?: number }>> = {
  Instagram: (p) => <Instagram size={p.size} />,
  TikTok,
  Snapchat,
};

export default function Socials({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {BRAND.socials.map((s) => {
        const Icon = ICON[s.name] ?? Instagram;
        return (
          <a
            key={s.name}
            href={s.href}
            aria-label={s.name}
            data-cursor="hover"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-silver-dim transition-all duration-300 hover:scale-110 hover:border-transparent hover:text-black"
          >
            <span className="absolute inset-0 scale-0 rounded-full bg-gradient-to-br from-orange to-gold transition-transform duration-300 group-hover:scale-100" />
            <span className="relative">
              <Icon size={size} />
            </span>
          </a>
        );
      })}
    </div>
  );
}
