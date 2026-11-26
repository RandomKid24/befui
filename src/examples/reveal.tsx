import { Reveal, RevealGroup, TextReveal } from '@/components/ui/reveal';

export default function RevealDemo() {
  return (
    <div className="grid w-full max-w-lg gap-6">
      <TextReveal text="People software that gets out of the way." className="text-3xl font-semibold tracking-tight" />
      <div className="grid gap-3">
        {['Hire', 'Onboard', 'Pay'].map((t, i) => (
          <Reveal key={t} delay={i * 120} className="rounded-lg border bg-card p-4 text-sm font-medium">
            {i + 1}. {t}
          </Reveal>
        ))}
      </div>
      <RevealGroup className="grid grid-cols-3 gap-3">
        {['Open roles', 'In interview', 'Offers out', 'Joined', 'On leave', 'Leaving'].map((t, i) => (
          <div key={t} className="rounded-lg border bg-card p-3"><p className="text-2xl font-semibold tabular-nums">{[6, 14, 3, 9, 4, 1][i]}</p><p className="text-xs text-muted-foreground">{t}</p></div>
        ))}
      </RevealGroup>
    </div>
  );
}
