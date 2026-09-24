'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type Stage = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  /** Carte d'environnement : indispensable au rendu des métaux (jante). */
  env: THREE.Texture;
};

export type Built = {
  /**
   * Appelée à chaque trame.
   * @param elapsed  secondes depuis le premier rendu
   * @param progress 0 → 1 : traversée de la section par la fenêtre
   */
  update: (elapsed: number, progress: number) => void;
};

export type StageState = 'attente' | 'actif' | 'indisponible';

/**
 * Socle three.js commun aux scènes 3D.
 *
 * Les garanties, dans l'ordre d'importance :
 *  1. RIEN n'est créé tant que la section n'approche pas de l'écran. Le
 *     contexte WebGL, les géométries et la carte d'environnement (coûteuse)
 *     n'existent que si l'utilisateur descend jusque-là.
 *  2. La boucle de rendu s'ARRÊTE dès que la section quitte l'écran. Deux
 *     scènes 3D sur la page ne tournent donc jamais en même temps.
 *  3. Si WebGL manque ou si l'utilisateur a demandé moins de mouvement, on
 *     renvoie « indisponible » : l'appelant affiche son repli et aucun
 *     contexte n'est jamais créé.
 *  4. Tout est libéré au démontage — géométries, matériaux, textures,
 *     environnement, contexte. Une page longue ne fuit pas.
 */
export function useStage(build: (stage: Stage) => Built) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<StageState>('attente');

  // `build` change à chaque rendu du parent ; on le lit par référence pour
  // que la scène ne soit pas reconstruite à chaque fois.
  const buildRef = useRef(build);
  buildRef.current = build;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Le canvas, comme le repli, sont en position absolue : il leur faut un
    // ancêtre positionné. On ne l'impose PAS via une classe `relative` en dur —
    // l'appelant passe souvent `absolute inset-0`, et les deux classes
    // entraient en conflit : `relative` l'emportait, `inset-0` ne dimensionnait
    // plus rien, le conteneur s'effondrait à une hauteur nulle et le canvas
    // restait invisible.
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState('indisponible');
      return;
    }

    let demonte = false;
    let demarre = false;
    let nettoyer: (() => void) | null = null;

    /** Construit la scène. Appelé une seule fois, à l'approche de l'écran. */
    const demarrer = () => {
      if (demarre || demonte) return;
      demarre = true;

      const canvas = document.createElement('canvas');
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true, // le décor filmé reste visible derrière
          antialias: true,
          powerPreference: 'high-performance',
        });
      } catch {
        setState('indisponible');
        return;
      }

      renderer.setClearAlpha(0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
      host.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0, 9);

      const pmrem = new THREE.PMREMGenerator(renderer);
      const salle = new RoomEnvironment();
      const env = pmrem.fromScene(salle, 0.04).texture;
      scene.environment = env;
      salle.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
      pmrem.dispose();

      const built = buildRef.current({ scene, camera, renderer, env });
      setState('actif');

      // ---- Dimensionnement ----
      const redimensionner = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (w === 0 || h === 0) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      redimensionner();
      const ro = new ResizeObserver(redimensionner);
      ro.observe(host);

      // ---- Boucle, suspendue hors écran ----
      let raf = 0;
      let visible = false;
      let t0 = 0;

      const trame = (now: number) => {
        if (demonte) return;
        if (t0 === 0) t0 = now;

        const r = host.getBoundingClientRect();
        const course = r.height + window.innerHeight;
        const parcouru = window.innerHeight - r.top;
        const progress = course > 0 ? Math.min(1, Math.max(0, parcouru / course)) : 0;

        built.update((now - t0) / 1000, progress);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(trame);
      };

      const io = new IntersectionObserver(
        ([e]) => {
          const desormais = e.isIntersecting;
          if (desormais === visible) return;
          visible = desormais;
          if (visible) {
            raf = requestAnimationFrame(trame);
          } else {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        },
        { rootMargin: '10% 0px' }
      );
      io.observe(host);

      nettoyer = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        scene.traverse((o) => {
          if (o instanceof THREE.Mesh || o instanceof THREE.InstancedMesh) {
            o.geometry.dispose();
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            mats.forEach((m) => {
              Object.values(m).forEach((v) => {
                if (v instanceof THREE.Texture) v.dispose();
              });
              m.dispose();
            });
          }
        });
        env.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        canvas.remove();
      };
    };

    // Déclencheur : on ne construit qu'à l'approche (une pleine hauteur d'écran).
    const veille = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          veille.disconnect();
          demarrer();
        }
      },
      { rootMargin: '100% 0px' }
    );
    veille.observe(host);

    return () => {
      demonte = true;
      veille.disconnect();
      nettoyer?.();
    };
  }, []);

  return { hostRef, state };
}
