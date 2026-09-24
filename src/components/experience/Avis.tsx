'use client';

import { Star } from 'lucide-react';
import { AVIS, avisGoogleHref } from '@/lib/experience';

/**
 * Les avis Google du garage.
 *
 * CE QUI EST POSSIBLE, ET CE QUI NE L'EST PAS :
 * on ne peut pas publier un avis sur Google Maps depuis un site. Google
 * n'expose aucune API en écriture sur les avis, et le faire serait de toute
 * façon contraire à ses conditions d'utilisation : un avis doit être écrit
 * par une personne connectée à son propre compte Google. Le bouton ci-dessous
 * envoie donc le visiteur sur le formulaire officiel — c'est le seul circuit
 * légitime, et c'est celui que tout le monde utilise.
 *
 * Les avis affichés sont recopiés tels quels depuis la fiche (voir `AVIS`
 * dans lib/experience.ts). Aucun n'est inventé ni reformulé.
 */

/** Rangée d'étoiles. Une seule étoile est décrite aux lecteurs d'écran. */
function Etoiles({ n, taille = 13 }: { n: number; taille?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${n} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={taille}
          aria-hidden
          className={i < n ? 'text-gold' : 'text-white/15'}
          fill="currentColor"
          strokeWidth={0}
        />
      ))}
    </span>
  );
}

export default function Avis() {
  return (
    <>
      {/* ---------- La note, en gros ---------- */}
      <div className="mt-10 flex flex-wrap items-end gap-x-6 gap-y-3">
        <span
          className="font-display leading-none text-gold"
          style={{ fontSize: 'clamp(3rem, 12vw, 5.5rem)', letterSpacing: '-0.04em' }}
        >
          {AVIS.note}
        </span>
        <div className="pb-2">
          <Etoiles n={5} taille={17} />
          <p className="mt-2 text-[0.68rem] uppercase tracking-[0.22em] text-silver-dim">
            {AVIS.total} avis Google
          </p>
        </div>
      </div>

      {/* ---------- Les avis ----------
          Colonne unique sur mobile, deux colonnes dès que la place existe.
          Les textes tronqués par Google le restent : on ne complète pas les
          propos de quelqu'un d'autre. */}
      <ul className="mt-10 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
        {AVIS.liste.map((a) => (
          <li
            key={a.auteur}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-display text-[0.95rem] text-chalk">{a.auteur}</span>
              <span className="shrink-0 text-[0.62rem] uppercase tracking-[0.14em] text-silver-dim">
                {a.date}
              </span>
            </div>
            <div className="mt-2.5">
              <Etoiles n={a.note} />
            </div>
            <p className="mt-3.5 text-[0.88rem] leading-relaxed text-silver">
              {a.texte}
              {a.tronque && <span className="text-silver-dim">…</span>}
            </p>
          </li>
        ))}
      </ul>

      {/* ---------- Laisser un avis ---------- */}
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <a
          href={avisGoogleHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full bg-chalk px-7 py-3.5 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.03]"
        >
          <Star size={15} fill="currentColor" strokeWidth={0} aria-hidden />
          Laisser un avis sur Google
        </a>
        <p className="text-[0.72rem] leading-relaxed text-silver-dim">
          L&apos;avis est publié sur la fiche Google du garage,
          <br className="hidden sm:block" /> depuis votre compte Google.
        </p>
      </div>
    </>
  );
}
