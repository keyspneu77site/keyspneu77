/**
 * Logotype KEYSPNEU77 en typographie (reproduit l'identité du logo réel).
 * KEYS = argent · PNEU = blanc · 77 = orange.
 */
export default function Wordmark({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const scale = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' }[size];
  return (
    <span className={`font-display leading-none tracking-tight ${scale} ${className}`} aria-label="KEYSPNEU77">
      <span className="gradient-silver">KEYS</span>
      <span className="text-chalk">PNEU</span>
      <span className="gradient-flame">77</span>
    </span>
  );
}
