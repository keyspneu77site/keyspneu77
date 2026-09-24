'use client';

import * as THREE from 'three';
import { useStage, type Stage } from './useStage';

/**
 * Pneu monté sur jante, en WebGL.
 *
 * Tout est construit par le code — aucun fichier de modèle à charger, donc
 * rien à télécharger en plus de three.js lui-même.
 *
 *  - la gomme est une LatheGeometry : un profil de flanc réel (talon,
 *    flanc, épaulement, sommet) révolutionné autour de l'axe ;
 *  - la sculpture est faite de VRAIS pavés (InstancedMesh, 4 rangées
 *    décalées). Un relief géométrique, pas une texture : la silhouette du
 *    pneu est dentelée sur ses bords, ce qu'un bump map ne donne jamais ;
 *  - la jante est métallique et lit la carte d'environnement, d'où ses
 *    reflets ; les rebords sont dorés, seule touche de marque.
 *
 * Le défilement fait tourner la roue. Au repos elle tourne quand même,
 * lentement : une roue figée a l'air cassée.
 */

/** Profil du flanc, du talon au sommet (rayon, position sur l'axe). */
const PROFIL: [number, number][] = [
  [1.3, -0.68],
  [1.34, -0.66],
  [1.55, -0.64],
  [1.85, -0.58],
  [2.02, -0.48],
  [2.1, -0.34],
  [2.13, -0.18],
  [2.14, 0],
  [2.13, 0.18],
  [2.1, 0.34],
  [2.02, 0.48],
  [1.85, 0.58],
  [1.55, 0.64],
  [1.34, 0.66],
  [1.3, 0.68],
];

/** Rayon de la gomme à une position donnée sur l'axe (interpolation linéaire). */
function rayonA(y: number) {
  for (let i = 0; i < PROFIL.length - 1; i++) {
    const [r1, y1] = PROFIL[i];
    const [r2, y2] = PROFIL[i + 1];
    if (y >= y1 && y <= y2) {
      const k = y2 === y1 ? 0 : (y - y1) / (y2 - y1);
      return r1 + (r2 - r1) * k;
    }
  }
  return PROFIL[PROFIL.length - 1][0];
}

/** Rangées de crampons : position sur l'axe, nombre, décalage angulaire. */
const RANGEES = [
  { y: -0.4, n: 42, decale: 0 },
  { y: -0.14, n: 42, decale: 0.5 },
  { y: 0.14, n: 42, decale: 0 },
  { y: 0.4, n: 42, decale: 0.5 },
];

function construire({ scene, camera }: Stage) {
  // Recul : à 9 unités la roue débordait de l'écran en haut et en bas.
  camera.position.set(0, 0, 12.5);

  const roue = new THREE.Group();
  const socle = new THREE.Group(); // porte l'inclinaison, la roue porte la rotation
  socle.add(roue);
  scene.add(socle);

  // ---------- Gomme ----------
  // Du caoutchouc, pas du plastique gris : très sombre, très mat, et presque
  // insensible à la carte d'environnement qui, sinon, le délave.
  const gomme = new THREE.MeshStandardMaterial({
    color: 0x0d0d11,
    roughness: 0.96,
    metalness: 0,
    envMapIntensity: 0.18,
  });
  const carcasse = new THREE.Mesh(
    new THREE.LatheGeometry(
      PROFIL.map(([r, y]) => new THREE.Vector2(r, y)),
      128
    ),
    gomme
  );
  roue.add(carcasse);

  // ---------- Sculpture : pavés en relief ----------
  const total = RANGEES.reduce((s, r) => s + r.n, 0);
  const pave = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.2, 0.3, 0.11),
    new THREE.MeshStandardMaterial({
      color: 0x121218,
      roughness: 0.96,
      metalness: 0,
      envMapIntensity: 0.16,
    }),
    total
  );
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const axeY = new THREE.Vector3(0, 1, 0);
  const pos = new THREE.Vector3();
  const un = new THREE.Vector3(1, 1, 1);

  let k = 0;
  for (const rangee of RANGEES) {
    const rayon = rayonA(rangee.y) + 0.04;
    for (let i = 0; i < rangee.n; i++) {
      const a = ((i + rangee.decale) / rangee.n) * Math.PI * 2;
      pos.set(Math.cos(a) * rayon, rangee.y, Math.sin(a) * rayon);
      q.setFromAxisAngle(axeY, Math.PI / 2 - a);
      pave.setMatrixAt(k++, m.compose(pos, q, un));
    }
  }
  pave.instanceMatrix.needsUpdate = true;
  roue.add(pave);

  // ---------- Jante ----------
  // Alu poli : assez sombre pour que les hautes lumières ressortent. Un
  // argent trop clair, sous une carte d'environnement uniforme, rend plat.
  const alu = new THREE.MeshStandardMaterial({
    color: 0x9fa0ac,
    metalness: 1,
    roughness: 0.24,
    envMapIntensity: 1.6,
  });
  const or = new THREE.MeshStandardMaterial({
    color: 0xffc300,
    metalness: 1,
    roughness: 0.22,
    envMapIntensity: 1.8,
  });
  const fonte = new THREE.MeshStandardMaterial({
    color: 0x55565f,
    metalness: 0.9,
    roughness: 0.55,
    envMapIntensity: 1,
  });
  const sombre = new THREE.MeshStandardMaterial({
    color: 0x16161b,
    metalness: 0.8,
    roughness: 0.4,
    envMapIntensity: 0.7,
  });

  // Fût de jante, FERMÉ au fond : ouvert, on voyait le vide au travers des
  // branches et la roue ressemblait à un anneau percé.
  const fut = new THREE.Mesh(new THREE.CylinderGeometry(1.28, 1.28, 1.3, 64, 1, true), sombre);
  roue.add(fut);

  const fond = new THREE.Mesh(new THREE.CircleGeometry(1.28, 64), sombre);
  fond.rotation.x = Math.PI / 2;
  fond.position.y = -0.5;
  roue.add(fond);

  // Rebords dorés, de part et d'autre — fins : c'est un liseré, pas un cerceau.
  for (const y of [-0.63, 0.63]) {
    const rebord = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.038, 14, 72), or);
    rebord.rotation.x = Math.PI / 2;
    rebord.position.y = y;
    roue.add(rebord);
  }

  // Disque de frein + bol, entrevus derrière les branches : c'est ce qui
  // remplit le creux de jante et donne la profondeur.
  const disque = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 0.06, 56), fonte);
  disque.position.y = -0.04;
  roue.add(disque);

  const bol = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.3, 32), sombre);
  bol.position.y = 0.1;
  roue.add(bol);

  // Couronne de jante côté caméra
  const couronne = new THREE.Mesh(new THREE.TorusGeometry(1.14, 0.1, 16, 72), alu);
  couronne.rotation.x = Math.PI / 2;
  couronne.position.y = 0.26;
  roue.add(couronne);

  // 5 branches, fuselées du moyeu vers la jante (prisme à 4 pans : une boîte
  // droite donnait des rayons plats, très « jouet »).
  const branche = new THREE.CylinderGeometry(0.13, 0.19, 0.92, 4);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const b = new THREE.Mesh(branche, alu);
    b.position.set(Math.cos(a) * 0.74, 0.28, Math.sin(a) * 0.74);
    // L'axe du cylindre est Y. On le couche (Z), puis on le pointe vers
    // l'extérieur (Y) : l'axe résultant vaut bien (cos a, 0, sin a).
    b.rotation.set(0, Math.PI - a, Math.PI / 2);
    roue.add(b);
  }

  // Moyeu + écrous
  const moyeu = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.36, 0.26, 32), alu);
  moyeu.position.y = 0.34;
  roue.add(moyeu);

  const centre = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.3, 32), or);
  centre.position.y = 0.38;
  roue.add(centre);

  const ecrou = new THREE.CylinderGeometry(0.052, 0.052, 0.1, 6);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.6;
    const e = new THREE.Mesh(ecrou, alu);
    e.position.set(Math.cos(a) * 0.5, 0.36, Math.sin(a) * 0.5);
    roue.add(e);
  }

  // Couche la roue : l'axe du tour est Y, la face doit regarder la caméra.
  roue.rotation.x = Math.PI / 2;

  // ---------- Lumières ----------
  scene.add(new THREE.AmbientLight(0x3a3a46, 1.1));

  const cle = new THREE.DirectionalLight(0xfff4e6, 2.4);
  cle.position.set(4, 5, 6);
  scene.add(cle);

  const contre = new THREE.DirectionalLight(0xff7a00, 3.6);
  contre.position.set(-5.5, 1.5, -4);
  scene.add(contre);

  const appoint = new THREE.DirectionalLight(0xffc300, 1.1);
  appoint.position.set(2.5, -4.5, 2);
  scene.add(appoint);

  // ---------- Animation ----------
  return {
    update(t: number, p: number) {
      // Défilement = rotation. Le terme en `t` évite la roue figée à l'arrêt.
      roue.rotation.y = p * Math.PI * 3.2 + t * 0.18;

      // On lit la largeur de la FENETRE, pas le rapport du canvas : sous
      // 1024 px la roue a son propre bloc, dont le canvas est large et bas —
      // son rapport aurait fait croire a un grand ecran et decale la roue.
      const large = window.innerWidth >= 1024;
      const viseX = large ? 1.9 : 0;
      const viseEchelle = large ? 1 : 1.3;
      socle.position.x += (viseX - socle.position.x) * 0.08;
      socle.scale.setScalar(socle.scale.x + (viseEchelle - socle.scale.x) * 0.08);

      // Bascule douce : la roue n'est jamais parfaitement de face.
      socle.rotation.y = -0.34 + Math.sin(t * 0.3) * 0.05;
      socle.rotation.x = 0.13 + Math.cos(t * 0.24) * 0.035;
      socle.position.y = Math.sin(t * 0.45) * 0.09 + (0.5 - p) * (large ? 0.5 : 0.25);
    },
  };
}

export default function Tyre3D({ className = '' }: { className?: string }) {
  const { hostRef, state } = useStage(construire);

  return (
    <div ref={hostRef} className={`pointer-events-none ${className}`} aria-hidden>
      {state !== 'actif' && (
        // Repli : ni WebGL, ni mouvement — un pneu dessiné, pas un trou noir.
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-[58%] w-auto opacity-70">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#1c1c22" strokeWidth="18" />
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#000"
              strokeOpacity="0.5"
              strokeWidth="18"
              strokeDasharray="5 7.4"
            />
            <circle cx="50" cy="50" r="27" fill="none" stroke="#ffc300" strokeWidth="3" />
            <circle cx="50" cy="50" r="6" fill="#ff9e2c" />
          </svg>
        </div>
      )}
    </div>
  );
}
