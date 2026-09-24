'use client';

import { Phone } from 'lucide-react';
import { GARAGE } from '@/lib/experience';

/**
 * CTA téléphone flottante.
 * Discrète par choix : pastille seule sur mobile, pastille + numéro à partir
 * de `sm`. Elle ne recouvre jamais le contenu (coin bas, au-dessus de la barre
 * de progression) et reste atteignable au clavier.
 */
export default function CallButton() {
  return (
    <a
      href={GARAGE.phoneHref}
      aria-label={`Appeler ${GARAGE.name} au ${GARAGE.phone}`}
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border border-orange/40 bg-void/80 px-4 py-3 backdrop-blur-md transition-colors duration-300 hover:border-orange hover:bg-orange sm:px-5"
    >
      <Phone
        size={16}
        strokeWidth={2.5}
        className="text-orange transition-colors duration-300 group-hover:text-black"
      />
      <span className="hidden text-[0.78rem] font-semibold tracking-wide text-chalk transition-colors duration-300 group-hover:text-black sm:inline">
        {GARAGE.phone}
      </span>
    </a>
  );
}
