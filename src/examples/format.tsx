import { Currency, formatBytes, formatCompact, formatCurrency, formatDuration, formatPercent } from '@/components/ui/format';

const rows: [string, string][] = [
  ['formatCurrency(1250000)', formatCurrency(1250000)],
  ['formatCurrency(1250000, { compact: true })', formatCurrency(1250000, { compact: true })],
  ['formatCurrency(4999.5, { currency: "USD", locale: "en-US" })', formatCurrency(4999.5, { currency: 'USD', locale: 'en-US' })],
  ['formatCompact(48200)', formatCompact(48200)],
  ['formatPercent(0.1234)', formatPercent(0.1234)],
  ['formatBytes(1536000)', formatBytes(1536000)],
  ['formatDuration(3725)', formatDuration(3725)],
];

export default function FormatDemo() {
  return (
    <div className="grid w-full max-w-xl grid-cols-[minmax(0,1fr)] gap-4">
      <dl className="grid grid-cols-[minmax(0,1fr)] gap-1.5 rounded-xl border bg-card p-4 font-mono text-xs">
        {rows.map(([call, out]) => <div key={call} className="flex justify-between gap-4"><dt className="min-w-0 truncate text-muted-foreground">{call}</dt><dd className="shrink-0 font-semibold text-foreground">{out}</dd></div>)}
      </dl>
      <p className="flex gap-4 text-sm">Net change: <Currency value={42500} signed /> <Currency value={-18200} signed /></p>
    </div>
  );
}
