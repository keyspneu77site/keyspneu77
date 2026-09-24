'use client';

import { useEffect, useRef, useState } from 'react';
import { NETTOYAGE_AVANT_APRES } from '@/lib/experience';

/**
 * Preuve du nettoyage intérieur : trois véhicules réels, avant et après.
 *
 * Une grille de prix ne prouve rien. Ces six plans sont la seule chose du
 * site qui montre le travail fini, et c'est à ce titre qu'ils sont placés
 * juste sous les formules, pas dans une galerie séparée.
 *
 * DEUX VIDÉOS CÔTE À CÔTE, PAS UN CURSEUR DE COMPARAISON : un wipe suppose
 * deux plans au cadrage identique (trépied, même axe). Ici tout est à main
 * levée, l'avant et l'après ne suivent pas la même trajectoire — un curseur
 * ne superposerait rien de comparable.
 *
 * UN SEUL VÉHICULE MONTÉ À LA FOIS : les plans inactifs ne sont pas dans le
 * DOM, donc jamais téléchargés. On charge 2 fichiers (~0,8 Mo) au lieu de 6
 * (~2,5 Mo), et le reste seulement si le visiteur change d'onglet.
 *
 * LECTURE UNIQUEMENT À L'ÉCRAN : la scène three.js tourne déjà en fond ;
 * laisser deux vidéos décoder hors champ coûte du CPU pour rien. Un
 * IntersectionObserver met en pause dès que le bloc sort du cadre.
 *
 * `prefers-reduced-motion` : aucune lecture automatique, on affiche les
 * posters et les contrôles natifs — le visiteur lance s'il veut.
 */

/** Vidéo muette en boucle, jouée seulement quand le bloc est à l'écran. */
function Plan({
  src,
  poster,
  alt,
  role,
  actif,
  reduced,
}: {
  src: string;
  poster: string;
  alt: string;
  role: 'Avant' | 'Après';
  actif: boolean;
  reduced: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    if (actif) {
      // play() rejette si l'onglet est en arrière-plan ou la politique
      // d'autoplay refuse : sans le catch, la promesse remonte en erreur.
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [actif, reduced]);

  const avant = role === 'Avant';

  return (
    <figure className="relative m-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
      <video
        ref={ref}
        src={src}
        poster={poster}
        aria-label={alt}
        muted
        loop
        playsInline
        preload="none"
        controls={reduced}
        className="block h-full w-full object-cover"
        style={{ aspectRatio: '480 / 854' }}
      />
      <figcaption
        className={[
          'pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1',
          'text-[0.6rem] uppercase tracking-[0.22em] backdrop-blur-sm',
          avant ? 'bg-black/65 text-silver' : 'bg-orange/85 text-black',
        ].join(' ')}
      >
        {role}
      </figcaption>
    </figure>
  );
}

export default function AvantApres() {
  const [i, setI] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const bloc = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const el = bloc.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      // 25 % suffit : on démarre avant que le bloc soit centré, sans
      // déclencher pendant un défilement rapide qui ne s'y arrête pas.
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const preuve = NETTOYAGE_AVANT_APRES[i];

  return (
    <div ref={bloc} className="mt-14">
      <p className="text-[0.62rem] uppercase tracking-[0.28em] text-silver-dim">
        Avant / après — trois véhicules passés à l&apos;atelier
      </p>

      {/* Onglets : changer de véhicule monte une autre paire de plans. */}
      <div role="tablist" aria-label="Choisir un véhicule" className="mt-5 flex flex-wrap gap-2">
        {NETTOYAGE_AVANT_APRES.map((p, k) => {
          const on = k === i;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              id={`ap-tab-${p.id}`}
              aria-selected={on}
              aria-controls={`ap-panel-${p.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setI(k)}
              onKeyDown={(e) => {
                if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                e.preventDefault();
                const n = NETTOYAGE_AVANT_APRES.length;
                const next = (k + (e.key === 'ArrowRight' ? 1 : n - 1)) % n;
                setI(next);
                document.getElementById(`ap-tab-${NETTOYAGE_AVANT_APRES[next].id}`)?.focus();
              }}
              className={[
                // Les trois libellés tiennent sur une ligne dès 360 px : à deux
                // lignes, la rangée passait sous l'indicateur de scène fixé en
                // haut à gauche, et les deux devenaient illisibles.
                'rounded-full border px-3 py-1.5 text-[0.72rem] transition-colors',
                'sm:px-4 sm:py-2 sm:text-[0.78rem]',
                on
                  ? 'border-orange/60 bg-orange/15 text-chalk'
                  : 'border-white/10 bg-white/[0.03] text-silver-dim hover:text-silver',
              ].join(' ')}
            >
              {p.vehicule}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`ap-panel-${preuve.id}`}
        aria-labelledby={`ap-tab-${preuve.id}`}
        className="mt-5 grid grid-cols-2 gap-3"
      >
        {/* La clé porte l'id du véhicule : React démonte la paire précédente
            au lieu de réutiliser les <video>, sinon l'ancien plan reste
            affiché le temps que le nouveau se charge. */}
        <Plan
          key={`${preuve.id}-avant`}
          {...preuve.avant}
          role="Avant"
          actif={visible}
          reduced={reduced}
        />
        <Plan
          key={`${preuve.id}-apres`}
          {...preuve.apres}
          role="Après"
          actif={visible}
          reduced={reduced}
        />
      </div>

      <p className="mt-4 text-[0.78rem] leading-relaxed text-silver-dim">
        Plans bruts filmés à l&apos;atelier, sans retouche de couleur ni sur
        l&apos;avant ni sur l&apos;après.
      </p>
    </div>
  );
}
