/**
 * Pneu / jante vectoriel réutilisable (loader, accents visuels).
 * Rendu détaillé : bande de roulement crantée + jante sport 5 branches.
 *
 * ⚠️ SSR : toutes les coordonnées sont pré-calculées UNE SEULE FOIS au chargement
 * du module puis ARRONDIES à une précision fixe (`round`). Les fonctions
 * trigonométriques (Math.cos/sin) ne sont pas garanties bit-à-bit identiques
 * entre l'environnement serveur (Node) et le client (navigateur) : sans arrondi,
 * la sérialisation produit des flottants légèrement différents
 * (ex. 15.995535832909482 vs 15.995535832909468) → Hydration mismatch React.
 * L'arrondi rend le SVG parfaitement déterministe et identique des deux côtés.
 */

// Arrondi à 3 décimales — bien au-dessus de l'écart de précision (~14e décimale).
const round = (n: number) => Math.round(n * 1000) / 1000;

const CX = 100;
const CY = 100;

// Crantage de la bande de roulement (48 dents)
const TREAD = Array.from({ length: 48 }, (_, i) => {
  const a = (i / 48) * Math.PI * 2;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return {
    x1: round(CX + cos * 88),
    y1: round(CY + sin * 88),
    x2: round(CX + cos * 97),
    y2: round(CY + sin * 97),
  };
});

// 5 branches sport de la jante
const SPOKES = Array.from({ length: 5 }, (_, i) => {
  const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const perp = a + Math.PI / 2;
  const pcos = Math.cos(perp);
  const psin = Math.sin(perp);
  const w = 9;
  const bx = CX + cos * 60;
  const by = CY + sin * 60;
  const ix = CX + cos * 20;
  const iy = CY + sin * 20;
  return `M ${round(ix + pcos * 7)} ${round(iy + psin * 7)} L ${round(bx + pcos * w)} ${round(
    by + psin * w
  )} L ${round(bx - pcos * w)} ${round(by - psin * w)} L ${round(ix - pcos * 7)} ${round(
    iy - psin * 7
  )} Z`;
});

// Écrous de fixation
const NUTS = Array.from({ length: 5 }, (_, i) => {
  const a = (i / 5) * Math.PI * 2 - Math.PI / 2 + Math.PI / 5;
  return {
    cx: round(CX + Math.cos(a) * 13),
    cy: round(CY + Math.sin(a) * 13),
  };
});

export default function Tire({ className = '', glow = true }: { className?: string; glow?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="rubber" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#2a2a30" />
          <stop offset="70%" stopColor="#141418" />
          <stop offset="100%" stopColor="#0a0a0c" />
        </radialGradient>
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e9e9ee" />
          <stop offset="50%" stopColor="#9a9aa4" />
          <stop offset="100%" stopColor="#4a4a52" />
        </linearGradient>
        <linearGradient id="rimEdge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffc300" />
          <stop offset="100%" stopColor="#ff7a00" />
        </linearGradient>
      </defs>

      {/* Pneu */}
      <circle cx={CX} cy={CY} r="96" fill="url(#rubber)" />
      {/* Crantage de la bande de roulement */}
      {TREAD.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#050506" strokeWidth="4" />
      ))}
      <circle cx={CX} cy={CY} r="84" fill="none" stroke="#050506" strokeWidth="2" opacity="0.6" />

      {/* Jante */}
      <circle cx={CX} cy={CY} r="66" fill="url(#rim)" />
      <circle cx={CX} cy={CY} r="66" fill="none" stroke="url(#rimEdge)" strokeWidth="2" opacity={glow ? 0.9 : 0.4} />
      <circle cx={CX} cy={CY} r="20" fill="#26262c" stroke="url(#rim)" strokeWidth="3" />
      <circle cx={CX} cy={CY} r="6" fill="url(#rimEdge)" />

      {/* 5 branches sport */}
      {SPOKES.map((d, i) => (
        <path key={i} d={d} fill="url(#rim)" stroke="#3a3a42" strokeWidth="1" />
      ))}
      {/* Écrous */}
      {NUTS.map((n, i) => (
        <circle key={i} cx={n.cx} cy={n.cy} r="2.4" fill="#1a1a1e" />
      ))}
    </svg>
  );
}
