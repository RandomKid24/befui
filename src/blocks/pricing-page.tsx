'use client';

import * as React from 'react';
import { PricingCard } from '@/components/ui/pricing-card';
import { Segmented } from '@/components/ui/segmented';
import { Accordion } from '@/components/ui/accordion';
import { Reveal } from '@/components/ui/reveal';
import { toast } from '@/components/ui/toast';

const plans = [
  { name: 'Starter', description: 'For teams up to 25.', price: 299, features: ['Leave and attendance', 'Employee directory', 'Email support'] },
  { name: 'Growth', description: 'Payroll included.', price: 499, highlighted: true, features: ['Everything in Starter', 'Payroll and payslips', 'Approvals workflow', 'Priority support'] },
  { name: 'Scale', description: 'For multi-entity companies.', price: 899, features: ['Everything in Growth', 'SSO and audit log', 'Custom roles', 'Dedicated manager'] },
];

export default function PricingPage() {
  const [cycle, setCycle] = React.useState<'monthly' | 'yearly'>('yearly');
  const yearly = cycle === 'yearly';
  return (
    <div className="grid justify-items-center gap-10 py-6">
      <Reveal className="grid max-w-xl justify-items-center gap-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Simple pricing that grows with your team</h2>
        <p className="text-muted-foreground">Start free for 14 days. No card needed. Change or cancel any time.</p>
        <Segmented value={cycle} onValueChange={setCycle} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly, save 20%' }]} />
      </Reveal>
      <div className="flex flex-wrap items-stretch justify-center gap-4">
        {plans.map((p) => (
          <PricingCard key={p.name} {...p} price={yearly ? Math.round(p.price * 0.8) : p.price} onSelect={() => toast.success(`${p.name} selected`, yearly ? 'Billed yearly.' : 'Billed monthly.')} />
        ))}
      </div>
      <Accordion
        className="w-full max-w-2xl"
        defaultOpen={['a']}
        items={[
          { id: 'a', title: 'What counts as a seat?', content: 'Anyone who signs in. Employees who only receive payslips by email are free.' },
          { id: 'b', title: 'Can I switch plans later?', content: 'Yes. Upgrades apply immediately and are pro-rated. Downgrades start next cycle.' },
          { id: 'c', title: 'Do you offer GST invoices?', content: 'Every invoice carries your GSTIN and is available from the billing page.' },
        ]}
      />
    </div>
  );
}
