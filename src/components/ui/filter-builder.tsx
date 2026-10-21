'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';
import { PlusIcon, XIcon } from './icons';

export interface FilterField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'select';
  /** The choices, for `type: 'select'`. */
  options?: string[];
}

export interface FilterRule {
  field: string;
  op: string;
  value: string;
}

const ops: Record<string, string[]> = {
  text: ['contains', 'is', 'is not', 'starts with'],
  number: ['=', '>', '<', 'between'],
  select: ['is', 'is not'],
};

const sel = 'h-9 rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

/** True when `row` passes every rule. Use it to filter your data with the rules this component gives you. */
export function matchesFilters(row: Record<string, unknown>, rules: FilterRule[]) {
  return rules.every((r) => {
    if (r.value === '') return true;
    const raw = row[r.field], v = String(raw ?? '').toLowerCase(), q = r.value.toLowerCase();
    switch (r.op) {
      case 'contains': return v.includes(q);
      case 'is': return v === q;
      case 'is not': return v !== q;
      case 'starts with': return v.startsWith(q);
      case '=': return Number(raw) === Number(r.value);
      case '>': return Number(raw) > Number(r.value);
      case '<': return Number(raw) < Number(r.value);
      case 'between': { const [a, b] = r.value.split('-').map(Number); return Number(raw) >= (a ?? -Infinity) && Number(raw) <= (b ?? Infinity); }
      default: return true;
    }
  });
}

/**
 * "Field, operator, value" rows that all must match, the filter builder from Notion or Linear. Controlled: `rules` in, `onChange` out.
 * Pair it with `matchesFilters(row, rules)` to filter an array. For `between`, type the range as `10-50`.
 */
export function FilterBuilder({ fields, rules, onChange, className }: { fields: FilterField[]; rules: FilterRule[]; onChange: (rules: FilterRule[]) => void; className?: string }) {
  const kind = (key: string) => fields.find((f) => f.key === key)?.type ?? 'text';
  const set = (i: number, patch: Partial<FilterRule>) => onChange(rules.map((r, k) => (k === i ? { ...r, ...patch } : r)));
  const add = () => { const f = fields[0]!; onChange([...rules, { field: f.key, op: ops[f.type ?? 'text']![0]!, value: '' }]); };
  return (
    <div className={cn('grid gap-2', className)}>
      {rules.map((r, i) => {
        const f = fields.find((x) => x.key === r.field);
        return (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <span className="w-12 text-xs text-muted-foreground">{i === 0 ? 'Where' : 'and'}</span>
            <select aria-label="Field" className={sel} value={r.field} onChange={(e) => set(i, { field: e.target.value, op: ops[kind(e.target.value)]![0]!, value: '' })}>
              {fields.map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}
            </select>
            <select aria-label="Operator" className={sel} value={r.op} onChange={(e) => set(i, { op: e.target.value })}>
              {ops[kind(r.field)]!.map((o) => <option key={o}>{o}</option>)}
            </select>
            {f?.type === 'select' ? (
              <select aria-label="Value" className={sel} value={r.value} onChange={(e) => set(i, { value: e.target.value })}>
                <option value="">Any</option>
                {f.options?.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <Input aria-label="Value" className="h-9 w-40" value={r.value} placeholder={r.op === 'between' ? '10-50' : 'Value'} onChange={(e) => set(i, { value: e.target.value })} />
            )}
            <button type="button" aria-label="Remove filter" onClick={() => onChange(rules.filter((_, k) => k !== i))} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"><XIcon className="size-4" /></button>
          </div>
        );
      })}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={add}><PlusIcon className="size-4" />Add filter</Button>
        {rules.length > 0 && <Button variant="ghost" size="sm" onClick={() => onChange([])}>Clear all</Button>}
      </div>
    </div>
  );
}
