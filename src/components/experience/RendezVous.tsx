'use client';

import { useMemo, useState } from 'react';
import { MessageCircle, Phone, Send } from 'lucide-react';
import { GARAGE, PRESTATIONS_RDV, SOCIALS } from '@/lib/experience';

/**
 * Demande de rendez-vous.
 *
 * POURQUOI SANS SERVEUR :
 * le formulaire ne « part » nulle part. Il compose un message lisible et
 * ouvre WhatsApp ou l'application SMS du visiteur, déjà rempli — il n'a plus
 * qu'à appuyer sur envoyer. Conséquences, toutes voulues :
 *  - le site reste hébergeable en statique (Cloudflare Pages), sans backend ;
 *  - aucune donnée personnelle n'est stockée ni transmise à un tiers : le
 *    message ne quitte le téléphone du visiteur que s'il l'envoie lui-même ;
 *  - rien à maintenir, rien qui tombe en panne le dimanche.
 * En échange, le garage reçoit une demande à rappeler, pas une réservation
 * ferme : il n'y a pas d'agenda côté site.
 *
 * POUR BRANCHER UN ENVOI SERVEUR PLUS TARD (mail, Formspree, route API) :
 * seul `envoyer()` change — il suffit d'y faire un POST au lieu d'ouvrir un
 * lien. Les champs, la validation et le message composé restent identiques.
 */

type Champs = {
  nom: string;
  tel: string;
  vehicule: string;
  prestation: string;
  jour: string;
  moment: string;
  precisions: string;
};

const VIDE: Champs = {
  nom: '',
  tel: '',
  vehicule: '',
  prestation: PRESTATIONS_RDV[0],
  jour: '',
  moment: 'Peu importe',
  precisions: '',
};

/** Style commun des champs — défini une fois, pas recopié sur chaque input. */
const champ =
  'w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-[0.92rem] text-chalk ' +
  'placeholder:text-silver-dim/70 outline-none transition-colors duration-200 ' +
  'focus:border-orange/70 focus:bg-white/[0.06]';

const etiquette = 'mb-1.5 block text-[0.62rem] uppercase tracking-[0.2em] text-silver-dim';

/** Met la date au format français sans dépendance : « 2026-09-24 » → « 24/09/2026 ». */
function dateFr(iso: string): string {
  const [a, m, j] = iso.split('-');
  return a && m && j ? `${j}/${m}/${a}` : iso;
}

export default function RendezVous() {
  const [v, setV] = useState<Champs>(VIDE);
  const [touche, setTouche] = useState(false);

  const snap = SOCIALS.find((s) => s.id === 'snapchat');

  /** Le nom et le téléphone suffisent : sans eux, le garage ne peut pas rappeler. */
  const valide = v.nom.trim().length > 1 && v.tel.replace(/\D/g, '').length >= 9;

  const message = useMemo(() => {
    const l = [
      'Bonjour, je souhaite prendre rendez-vous.',
      '',
      `Nom : ${v.nom.trim()}`,
      `Téléphone : ${v.tel.trim()}`,
      `Prestation : ${v.prestation}`,
    ];
    if (v.vehicule.trim()) l.push(`Véhicule : ${v.vehicule.trim()}`);
    if (v.jour) l.push(`Jour souhaité : ${dateFr(v.jour)}`);
    if (v.moment && v.moment !== 'Peu importe') l.push(`Moment : ${v.moment}`);
    if (v.precisions.trim()) l.push('', `Précisions : ${v.precisions.trim()}`);
    l.push('', `— envoyé depuis le site ${GARAGE.name}`);
    return l.join('\n');
  }, [v]);

  const envoyer = (canal: 'whatsapp' | 'sms') => {
    if (!valide) {
      setTouche(true);
      return;
    }
    const texte = encodeURIComponent(message);
    const href =
      canal === 'whatsapp'
        ? `https://wa.me/${GARAGE.phoneE164}?text=${texte}`
        : `sms:+${GARAGE.phoneE164}?&body=${texte}`;
    window.open(href, canal === 'whatsapp' ? '_blank' : '_self');
  };

  const maj = (k: keyof Champs) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setV((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        envoyer('whatsapp');
      }}
      className="mx-auto w-full max-w-[560px] text-left"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={etiquette} htmlFor="rdv-nom">
            Nom *
          </label>
          <input
            id="rdv-nom"
            className={champ}
            value={v.nom}
            onChange={maj('nom')}
            autoComplete="name"
            placeholder="Votre nom"
          />
        </div>

        <div>
          <label className={etiquette} htmlFor="rdv-tel">
            Téléphone *
          </label>
          <input
            id="rdv-tel"
            className={champ}
            value={v.tel}
            onChange={maj('tel')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="06 12 34 56 78"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={etiquette} htmlFor="rdv-prestation">
            Prestation
          </label>
          <select
            id="rdv-prestation"
            className={`${champ} appearance-none`}
            value={v.prestation}
            onChange={maj('prestation')}
          >
            {PRESTATIONS_RDV.map((p) => (
              <option key={p} value={p} className="bg-carbon text-chalk">
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={etiquette} htmlFor="rdv-vehicule">
            Véhicule
          </label>
          <input
            id="rdv-vehicule"
            className={champ}
            value={v.vehicule}
            onChange={maj('vehicule')}
            placeholder="Marque, modèle, taille de pneus si connue"
          />
        </div>

        <div>
          <label className={etiquette} htmlFor="rdv-jour">
            Jour souhaité
          </label>
          <input
            id="rdv-jour"
            className={champ}
            value={v.jour}
            onChange={maj('jour')}
            type="date"
          />
        </div>

        <div>
          <label className={etiquette} htmlFor="rdv-moment">
            Moment
          </label>
          <select
            id="rdv-moment"
            className={`${champ} appearance-none`}
            value={v.moment}
            onChange={maj('moment')}
          >
            {['Peu importe', 'Matin', 'Après-midi', 'Fin de journée'].map((m) => (
              <option key={m} value={m} className="bg-carbon text-chalk">
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={etiquette} htmlFor="rdv-precisions">
            Précisions
          </label>
          <input
            id="rdv-precisions"
            className={champ}
            value={v.precisions}
            onChange={maj('precisions')}
            placeholder="Facultatif"
          />
        </div>
      </div>

      {/* Message d'erreur : affiché seulement après une tentative d'envoi.
          Pas de champ qui rougit pendant la frappe. */}
      {touche && !valide && (
        <p role="alert" className="mt-4 text-[0.78rem] text-ember">
          Il manque votre nom ou votre numéro — sans eux, le garage ne peut pas vous rappeler.
        </p>
      )}

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.03]"
        >
          <Send size={16} strokeWidth={2.5} aria-hidden />
          Envoyer sur WhatsApp
        </button>
        <button
          type="button"
          onClick={() => envoyer('sms')}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-chalk transition-colors duration-300 hover:border-orange/70"
        >
          <MessageCircle size={16} strokeWidth={2.5} aria-hidden />
          Par SMS
        </button>
      </div>

      <p className="mt-4 text-[0.72rem] leading-relaxed text-silver-dim">
        Votre message s&apos;ouvre déjà rempli : vous n&apos;avez plus qu&apos;à l&apos;envoyer.
        Le garage vous rappelle pour confirmer le créneau.
      </p>

      {/* Les deux autres chemins, pour qui ne veut pas remplir de formulaire. */}
      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-7">
        <span className="text-[0.62rem] uppercase tracking-[0.22em] text-silver-dim">
          Ou directement
        </span>
        <a
          href={GARAGE.phoneHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors duration-300 hover:text-orange"
        >
          <Phone size={15} strokeWidth={2.5} aria-hidden />
          {GARAGE.phone}
        </a>
        {snap && (
          <a
            href={snap.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-chalk transition-colors duration-300 hover:text-gold"
          >
            <MessageCircle size={15} strokeWidth={2.5} aria-hidden />
            Snapchat @{snap.handle}
          </a>
        )}
      </div>
    </form>
  );
}
