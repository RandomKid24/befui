'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DonutChart } from '@/components/ui/charts';
import { FloatingShell, GlassPanel, glass } from '@/components/ui/floating-shell';
import { formatCurrency } from '@/components/ui/format';
import { BuildingIcon, CalculatorIcon, GridIcon, HomeIcon, WalletIcon } from '@/components/ui/icons';
import { LineChart } from '@/components/ui/line-chart';
import { NumberTicker } from '@/components/ui/number-ticker';
import { ReturnCalculator } from '@/components/ui/return-calculator';
import { RevealGroup } from '@/components/ui/reveal';
import { SearchInput } from '@/components/ui/search-input';
import { Segmented } from '@/components/ui/segmented';
import { cn } from '@/lib/utils';

// Demo data: swap for your API. Every total on screen is worked out from these rows.
const homes = [
  { name: 'Lakeview 4B', city: 'Pune', value: 9_800_000, rent: 38_000, paid: 38_000, tenant: 'Anita Kulkarni' },
  { name: 'Palm Court 12', city: 'Pune', value: 7_400_000, rent: 29_000, paid: 0, tenant: 'Farhan Ali' },
  { name: 'Harbour Row 7', city: 'Mumbai', value: 18_600_000, rent: 72_000, paid: 72_000, tenant: 'Joseph Thomas' },
  { name: 'Cedar House', city: 'Bengaluru', value: 12_200_000, rent: 46_000, paid: 20_000, tenant: 'Divya Menon' },
  { name: 'Orchid 2A', city: 'Bengaluru', value: 8_100_000, rent: 31_000, paid: 31_000, tenant: 'Karan Shah' },
];
const history = [51.2, 51.9, 52.1, 52.8, 53.0, 53.9, 54.1, 54.6, 54.9, 55.3, 55.8, 56.1];
const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
const money = (n: number) => formatCurrency(n);
const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);

export default function PropertyDesk() {
  const [view, setView] = React.useState('overview');
  const [range, setRange] = React.useState<'6' | '12'>('12');
  const [reminded, setReminded] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState('');
  const worth = sum(homes.map((h) => h.value));
  const due = sum(homes.map((h) => h.rent));
  const collected = sum(homes.map((h) => h.paid));
  const owing = homes.filter((h) => h.paid < h.rent);
  const cities = [...new Set(homes.map((h) => h.city))];
  const found = homes.filter((h) => `${h.name} ${h.city} ${h.tenant}`.toLowerCase().includes(query.trim().toLowerCase()));

  const rentList = (
    <GlassPanel title="Rent to chase" note={`${money(collected)} of ${money(due)} collected this month`}>
      <div role="meter" aria-label="Rent collected" aria-valuemin={0} aria-valuemax={due} aria-valuenow={collected} className="h-2 overflow-hidden rounded-sm bg-foreground/10"><div className="h-full bg-success" style={{ width: `${(collected / due) * 100}%` }} /></div>
      <ul className="mt-3 divide-y divide-foreground/10">
        {owing.map((h) => (
          <li key={h.name} className="flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0"><p className="truncate text-sm font-medium">{h.tenant}</p><p className="truncate text-xs text-muted-foreground">{money(h.rent - h.paid)} due, {h.name}</p></div>
            <Button size="sm" variant="outline" disabled={reminded.includes(h.name)} onClick={() => setReminded([...reminded, h.name])}>{reminded.includes(h.name) ? 'Reminded' : 'Remind'}</Button>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );

  return (
    <FloatingShell
      className="[--primary:#c2410c] dark:[--primary:#fb923c] dark:[--primary-foreground:#1c0a00]"
      brand={{ name: 'Keystone', tagline: 'Property desk', mark: <HomeIcon /> }}
      value={view}
      onChange={setView}
      groups={[
        { label: 'Invest', items: [{ id: 'overview', label: 'Overview', icon: <GridIcon /> }, { id: 'homes', label: 'Properties', icon: <BuildingIcon /> }, { id: 'rent', label: 'Rent', icon: <WalletIcon />, badge: owing.length }] },
        { label: 'Plan', items: [{ id: 'calc', label: 'Calculator', icon: <CalculatorIcon /> }] },
      ]}
      footer={<><p className="text-xs text-muted-foreground">Homes you own</p><p className="text-lg font-semibold tabular-nums">{homes.length} in {cities.length} cities</p></>}
    >
      {view === 'overview' && (
        <RevealGroup className="grid gap-3 xl:grid-cols-3 [&>:first-child]:xl:col-span-2 [&>:last-child]:xl:col-span-2">
          <GlassPanel title="Portfolio value" note="Every home at today's valuation" action={<Segmented value={range} onValueChange={setRange} options={[{ value: '6', label: '6 months' }, { value: '12', label: '1 year' }]} />}>
            <p className="text-4xl font-semibold tracking-tight tabular-nums">₹<NumberTicker value={worth} /></p>
            <LineChart area className="mt-3" labels={months.slice(-Number(range))} series={[{ name: 'Value, ₹ million', data: history.slice(-Number(range)), color: 'text-primary' }]} format={(n) => `${Math.round(n)}M`} />
          </GlassPanel>
          {rentList}
          <GlassPanel title="Where the money sits" note="Value by city" className="h-full">
            <DonutChart centerLabel={`${cities.length} cities`} data={cities.map((c, i) => ({ label: c, value: sum(homes.filter((h) => h.city === c).map((h) => h.value)), color: ['var(--primary)', 'var(--info)', 'var(--success)'][i] }))} />
          </GlassPanel>
          <GlassPanel title="Gross yield" note="A year of rent against value" className="h-full">
            <ul className="grid gap-3">
              {[...homes].sort((a, b) => b.rent / b.value - a.rent / a.value).map((h) => (
                <li key={h.name} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-3 text-[13px]">
                  <span className="truncate">{h.name}</span>
                  <span className="h-2 overflow-hidden rounded-sm bg-foreground/10"><span className="block h-full bg-primary" style={{ width: `${((h.rent * 12) / h.value / 0.06) * 100}%` }} /></span>
                  <span className="text-end tabular-nums">{(((h.rent * 12) / h.value) * 100).toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </RevealGroup>
      )}
      {view === 'homes' && (
        <div className="grid gap-3">
          <SearchInput aria-label="Search properties" placeholder="Search by home, city or tenant" value={query} onValueChange={setQuery} />
          {!found.length && <p className={cn(glass, 'p-6 text-sm text-muted-foreground')}>No property matches “{query}”.</p>}
          <RevealGroup className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {found.map((h) => (
              <GlassPanel key={h.name} title={h.name} note={h.city}>
                <p className="text-2xl font-semibold tabular-nums">{money(h.value)}</p>
                <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-foreground/10 pt-3 text-sm"><div><dt className="text-xs text-muted-foreground">Rent</dt><dd className="tabular-nums">{money(h.rent)}</dd></div><div><dt className="text-xs text-muted-foreground">Tenant</dt><dd className="truncate">{h.tenant}</dd></div></dl>
              </GlassPanel>
            ))}
          </RevealGroup>
        </div>
      )}
      {view === 'rent' && <div className="max-w-2xl">{owing.length ? rentList : <p className={cn(glass, 'p-6 text-sm')}>All rent is in.</p>}</div>}
      {view === 'calc' && <ReturnCalculator className={cn(glass, 'max-w-4xl')} />}
    </FloatingShell>
  );
}
