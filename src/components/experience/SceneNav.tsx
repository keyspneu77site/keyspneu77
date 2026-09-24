'use client';

import { SCENES } from '@/lib/experience';

/**
 * Navigation contextuelle — pas de navbar.
 *
 * Desktop : colonne discrète à droite ; le libellé n'apparaît qu'au survol,
 *           au focus clavier, ou sur la scène courante.
 * Mobile  : compteur « 03 / 07 » + libellé, en haut à gauche.
 *
 * Le clic amène en défilement fluide jusqu'à la scène, sauf si l'utilisateur
 * a demandé une réduction des animations — auquel cas le saut est immédiat.
 * Ce sont de vrais liens d'ancrage : la navigation clavier et le partage
 * d'URL continuent de fonctionner même sans JavaScript.
 */
export default function SceneNav({ active }: { active: number }) {
  const total = String(SCENES.length).padStart(2, '0');

  const aller = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const cible = document.getElementById(id);
    if (!cible) return; // ancre absente : on laisse le navigateur gérer
    e.preventDefault();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    cible.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <>
      {/* ---------- Desktop ---------- */}
      <nav
        aria-label="Progression dans le garage"
        className="pointer-events-none fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 pr-5 lg:block"
      >
        <ul className="flex flex-col items-end gap-2.5">
          {SCENES.map((s) => {
            const on = s.index === active;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => aller(e, s.id)}
                  aria-current={on ? 'step' : undefined}
                  className="pointer-events-auto group flex items-center justify-end gap-3 py-1 outline-none"
                >
                  <span
                    className={`font-display text-[0.58rem] tracking-[0.24em] transition-all duration-300 ${
                      on
                        ? 'text-chalk opacity-100'
                        : 'text-silver-dim opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                    }`}
                  >
                    {String(s.index).padStart(2, '0')} · {s.nav.toUpperCase()}
                  </span>
                  <span
                    className={`block h-px transition-all duration-300 ${
                      on
                        ? 'w-9 bg-orange'
                        : 'w-4 bg-white/25 group-hover:w-7 group-hover:bg-white/60 group-focus-visible:w-7'
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ---------- Mobile ---------- */}
      <div className="fixed left-4 top-4 z-30 flex items-center gap-2 lg:hidden">
        <span className="font-display text-[0.6rem] tracking-[0.28em] text-chalk">
          {String(active).padStart(2, '0')}
          <span className="text-silver-dim"> / {total}</span>
        </span>
        <span className="h-px w-5 bg-orange" />
        <span className="text-[0.6rem] uppercase tracking-[0.18em] text-silver-dim">
          {SCENES[active - 1]?.nav}
        </span>
      </div>
    </>
  );
}
