'use client';

import * as React from 'react';
import { IndianRupeeIcon, PlusIcon } from '@/components/ui/icons';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

const stages = ['New', 'Contacted', 'Quoted', 'Won'] as const;
type Stage = (typeof stages)[number];
type Lead = { id: number; company: string; owner: string; value: number; stage: Stage; hot?: boolean };

const seed: Lead[] = [
  { id: 1, company: 'Sunrise Pharma', owner: 'Isha Nair', value: 420000, stage: 'New', hot: true },
  { id: 2, company: 'Bharat Forge Supplies', owner: 'Kabir Shah', value: 180000, stage: 'New' },
  { id: 3, company: 'Kaveri Chemicals', owner: 'Kabir Shah', value: 950000, stage: 'Contacted' },
  { id: 4, company: 'Orion Textiles', owner: 'Isha Nair', value: 310000, stage: 'Quoted', hot: true },
  { id: 5, company: 'Metro Packaging', owner: 'Diya Rao', value: 275000, stage: 'Quoted' },
  { id: 6, company: 'Apex Dyes', owner: 'Diya Rao', value: 640000, stage: 'Won' },
];
const lakh = (n: number) => `₹${(n / 100000).toFixed(1)}L`;

/** Drag a card between columns, or use the arrow on a card for keyboard and touch. */
export default function LeadPipeline() {
  const [leads, setLeads] = React.useState(seed);
  const [dragId, setDragId] = React.useState<number | null>(null);
  const [over, setOver] = React.useState<Stage | null>(null);

  const move = (id: number, stage: Stage) => {
    setLeads((l) => l.map((x) => (x.id === id ? { ...x, stage } : x)));
    if (stage === 'Won') toast.success('Deal won', 'Nice. Moved to Won.');
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Lead pipeline</h2>
          <p className="text-[13px] text-muted-foreground">{leads.length} open leads worth {lakh(leads.reduce((s, l) => s + l.value, 0))}</p>
        </div>
        <Button size="sm"><PlusIcon /> New lead</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stages.map((stage, si) => {
          const col = leads.filter((l) => l.stage === stage);
          return (
            <div
              key={stage}
              onDragOver={(e) => { e.preventDefault(); setOver(stage); }}
              onDragLeave={() => setOver((o) => (o === stage ? null : o))}
              onDrop={() => { if (dragId !== null) move(dragId, stage); setDragId(null); setOver(null); }}
              className={cn('flex min-h-48 flex-col gap-2 rounded-xl border bg-muted/60 p-2 transition-colors', over === stage && 'border-primary/50 bg-accent')}
            >
              <div className="flex items-center justify-between px-1.5 py-1">
                <span className="text-[13px] font-medium">{stage}</span>
                <span className="text-xs text-muted-foreground">{col.length} · {lakh(col.reduce((s, l) => s + l.value, 0))}</span>
              </div>
              {col.map((l) => (
                <Card
                  key={l.id}
                  draggable
                  onDragStart={() => setDragId(l.id)}
                  onDragEnd={() => { setDragId(null); setOver(null); }}
                  className={cn('cursor-grab p-3 transition-opacity active:cursor-grabbing', dragId === l.id && 'opacity-40')}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-medium leading-snug">{l.company}</p>
                    {l.hot && <Badge variant="danger">Hot</Badge>}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center text-xs font-medium tabular-nums"><IndianRupeeIcon className="size-3 text-muted-foreground" />{(l.value / 100000).toFixed(1)}L</span>
                    <div className="flex items-center gap-1.5">
                      <Avatar name={l.owner} size="xs" />
                      {si < stages.length - 1 && (
                        <Button variant="ghost" size="xs" className="h-6 px-1.5 text-muted-foreground" aria-label={`Move ${l.company} to ${stages[si + 1]}`} onClick={() => move(l.id, stages[si + 1])}>
                          →
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
