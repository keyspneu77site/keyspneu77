'use client';

import * as THREE from 'three';
import { BRANDS, type Brand } from '@/lib/experience';
import { useStage, type Stage } from './useStage';

/**
 * Les marques montées à l'atelier, sur un carrousel 3D.
 *
 * Chaque marque est une plaque métallique posée sur un anneau que le
 * défilement fait tourner. Le nom est peint sur les deux faces : une plaque
 * qui passe derrière reste lisible.
 *
 * AUCUN LOGO N'EST REPRODUIT ICI. Les noms sont composés en typographie,
 * faute de fichiers officiels. Le jour où les vrais logos arrivent, il
 * suffit de renseigner `logo` dans `BRANDS` (lib/experience.ts) :
 * l'image remplace le texte sur la plaque, sans toucher à ce fichier.
 */

// Anneau large et plaques resserrees : a 3,4 la plaque de devant masquait
// completement ses deux voisines, on ne lisait qu'une marque a la fois.
const RAYON = 4.6;
const LARGEUR = 2.2;
const HAUTEUR = 1.1;

/**
 * Peint une plaque sur un canvas : fond métal brossé + nom (ou logo).
 * Renvoie la texture, et la fonction de repeinte pour les polices tardives.
 */
function plaquePeinte(marque: Brand) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext('2d');
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  if (!ctx) return { texture, peindre: () => {} };

  const peindre = (image?: HTMLImageElement) => {
    // Fond : dégradé sombre, pour que la plaque ne soit pas un aplat mort.
    const fond = ctx.createLinearGradient(0, 0, 0, c.height);
    fond.addColorStop(0, '#22222a');
    fond.addColorStop(0.5, '#141419');
    fond.addColorStop(1, '#0d0d11');
    ctx.fillStyle = fond;
    ctx.fillRect(0, 0, c.width, c.height);

    // Liseré doré intérieur
    ctx.strokeStyle = 'rgba(255,195,0,0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(26, 26, c.width - 52, c.height - 52);

    if (image) {
      // Vrai logo fourni : centré, à l'échelle, sans jamais être déformé.
      const k = Math.min((c.width * 0.62) / image.width, (c.height * 0.46) / image.height);
      const w = image.width * k;
      const h = image.height * k;
      ctx.drawImage(image, (c.width - w) / 2, (c.height - h) / 2, w, h);
      texture.needsUpdate = true;
      return;
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Nom de la marque
    try {
      ctx.letterSpacing = '10px';
    } catch {
      // Propriété non supportée : le rendu reste correct, juste plus serré.
    }
    ctx.font = "800 104px Sora, 'Arial Black', Impact, sans-serif";
    ctx.fillStyle = '#f5f5f7';
    ctx.fillText(marque.name.toUpperCase(), c.width / 2, c.height / 2 - 26);

    // Filet doré + mention
    const g = ctx.createLinearGradient(c.width * 0.3, 0, c.width * 0.7, 0);
    g.addColorStop(0, 'rgba(255,122,0,0)');
    g.addColorStop(0.5, '#ffc300');
    g.addColorStop(1, 'rgba(255,122,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(c.width * 0.3, c.height / 2 + 34, c.width * 0.4, 3);

    try {
      ctx.letterSpacing = '14px';
    } catch {
      /* sans conséquence */
    }
    ctx.font = "600 30px Inter, system-ui, sans-serif";
    ctx.fillStyle = 'rgba(154,154,164,0.95)';
    ctx.fillText('MONTÉ À L’ATELIER', c.width / 2, c.height / 2 + 86);

    texture.needsUpdate = true;
  };

  peindre();

  // Les polices de la page arrivent après le premier rendu : on repeint.
  document.fonts?.ready.then(() => peindre()).catch(() => {});

  // Logo officiel, si fourni.
  if (marque.logo) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => peindre(img);
    img.src = marque.logo;
  }

  return { texture, peindre };
}

function construire({ scene, camera }: Stage) {
  camera.position.set(0, 0.75, 11);
  camera.lookAt(0, -0.1, 0);

  const carrousel = new THREE.Group();
  scene.add(carrousel);

  const tranche = new THREE.MeshStandardMaterial({
    color: 0x2a2a33,
    metalness: 0.9,
    roughness: 0.3,
    envMapIntensity: 1.2,
  });

  const plaques: THREE.Mesh[] = [];
  const geo = new THREE.BoxGeometry(LARGEUR, HAUTEUR, 0.14);

  BRANDS.forEach((marque, i) => {
    const { texture } = plaquePeinte(marque);
    const face = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.45,
      roughness: 0.42,
      envMapIntensity: 1,
    });

    // Ordre des faces d'une BoxGeometry : +X, -X, +Y, -Y, +Z, -Z.
    // Le nom va devant ET derrière : une plaque au fond reste lisible.
    const plaque = new THREE.Mesh(geo, [tranche, tranche, tranche, tranche, face, face]);

    const a = (i / BRANDS.length) * Math.PI * 2;
    plaque.position.set(Math.sin(a) * RAYON, 0, Math.cos(a) * RAYON);
    plaque.rotation.y = a;
    plaque.userData.phase = i * 1.35;

    plaques.push(plaque);
    carrousel.add(plaque);
  });

  // Anneau doré : matérialise la trajectoire, donne l'échelle de la scène.
  const anneau = new THREE.Mesh(
    new THREE.TorusGeometry(RAYON, 0.012, 8, 160),
    new THREE.MeshStandardMaterial({
      color: 0xff9e2c,
      metalness: 0.9,
      roughness: 0.35,
      transparent: true,
      opacity: 0.5,
    })
  );
  anneau.rotation.x = Math.PI / 2;
  anneau.position.y = -HAUTEUR / 2 - 0.22;
  carrousel.add(anneau);

  // ---------- Lumières ----------
  scene.add(new THREE.AmbientLight(0x3c3c48, 1.2));

  const cle = new THREE.DirectionalLight(0xfff6ea, 2);
  cle.position.set(3, 4, 7);
  scene.add(cle);

  // Discret : a 2,6 la plaque de droite virait franchement a l'orange et
  // ne ressemblait plus aux trois autres.
  const contre = new THREE.DirectionalLight(0xff7a00, 1.6);
  contre.position.set(-4.5, 1, -5);
  scene.add(contre);

  return {
    update(t: number, p: number) {
      // Le défilement fait défiler les marques ; la dérive en `t` maintient
      // le mouvement quand la page est à l'arrêt.
      carrousel.rotation.y = -p * Math.PI * 1.9 - t * 0.08;

      // Étroit : on grossit au contraire. Un anneau entier ne tient pas dans
      // 390 px sans rendre les noms illisibles ; mieux vaut assumer le
      // carrousel qui deborde, avec une plaque de devant nette.
      const large = window.innerWidth >= 1024;
      const vise = large ? 1 : 0.85;
      carrousel.scale.setScalar(carrousel.scale.x + (vise - carrousel.scale.x) * 0.08);

      for (const plaque of plaques) {
        const phase = plaque.userData.phase as number;
        plaque.position.y = Math.sin(t * 0.6 + phase) * 0.12;
      }
    },
  };
}

export default function Brands3D({ className = '' }: { className?: string }) {
  const { hostRef, state } = useStage(construire);

  return (
    <div ref={hostRef} className={className}>
      {state !== 'actif' && (
        // Repli : ni WebGL, ni mouvement — les marques restent lisibles.
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 px-6">
          {BRANDS.map((m) => (
            <span
              key={m.name}
              className="font-display text-chalk"
              style={{ fontSize: 'clamp(1.1rem, 4vw, 2rem)', letterSpacing: '0.04em' }}
            >
              {m.name.toUpperCase()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
