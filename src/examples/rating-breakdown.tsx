import * as React from 'react';
import { RatingBreakdown } from '@/components/ui/rating-breakdown';

export default function RatingBreakdownDemo() {
  const [sel, setSel] = React.useState<number | null>(null);
  return (
    <div className="grid w-[32rem] max-w-full gap-3">
      <RatingBreakdown counts={[812, 340, 96, 38, 54]} selected={sel} onSelect={setSel} />
      <p className="text-center text-xs text-muted-foreground">{sel ? `Showing ${sel}-star reviews` : 'Click a row to filter reviews'}</p>
    </div>
  );
}
