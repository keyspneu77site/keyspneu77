import { redirect } from 'next/navigation';

/**
 * L'expérience est désormais servie à la racine du site.
 *
 * Cette route est conservée en redirection plutôt que supprimée : c'est
 * l'adresse qui a circulé pendant la phase de test, et un lien déjà ouvert
 * ou enregistré ne doit pas tomber sur une 404.
 */
export default function ExperienceRedirect() {
  redirect('/');
}
