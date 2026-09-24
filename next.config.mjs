/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Export 100 % statique (dossier out/) : le site n'a ni API ni rendu serveur,
  // il est servi tel quel par Cloudflare Pages.
  output: 'export',
  outputFileTracingRoot: import.meta.dirname,
  // Accès au serveur de dev depuis les autres appareils du réseau local
  // (téléphone, tablette) : sans cette liste, Next 15 bloque les requêtes
  // dont l'origine n'est pas localhost. Sans effet en production.
  // Accès au serveur de dev depuis les autres appareils : réseau local et
  // Tailscale (5G). Next ne résout PAS les jokers larges du type '*.ts.net'
  // ni '100.*' — le journal montrait la requête bloquée malgré eux. Les hôtes
  // sont donc déclarés explicitement. Sans effet en production.
  allowedDevOrigins: [
    'chokbar.tailb10be6.ts.net',
    '100.70.44.31',
    '192.168.1.186',
    '192.168.1.*',
    '192.168.0.*',
  ],
  images: {
    // Images servies telles quelles (pas d'API d'optimisation serveur) :
    // rendu identique dev/prod et compatibilité hébergement statique (Cloudflare Pages).
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
