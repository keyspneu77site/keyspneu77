import type { MetadataRoute } from 'next';

// Généré une fois au build : requis par l'export statique (output: 'export').
export const dynamic = 'force-static';

/**
 * robots.txt.
 *
 * MODE DÉMO : quand `KEYS_DEMO=1` est posé au build, tout est interdit aux
 * robots et le sitemap n'est pas annoncé. C'est ce qu'on utilise pour les
 * aperçus temporaires montrés au client (tunnel, préproduction) : sans ça,
 * une URL d'aperçu indexée ferait du contenu dupliqué face au vrai domaine
 * et pourrait sortir dans Google à la place de keyspneu77.fr.
 *
 * Le build de production, lui, ne pose pas la variable : comportement normal.
 */
const demo = process.env.KEYS_DEMO === '1';

export default function robots(): MetadataRoute.Robots {
  if (demo) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.keyspneu77.fr/sitemap.xml',
  };
}
