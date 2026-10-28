'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox, MultiCombobox } from '@/components/ui/combobox';
import { Input, Textarea } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';

const opt = (...labels: string[]) => labels.map((label) => ({ value: label.toLowerCase().replace(/\W+/g, '-'), label }));

const departments = ['Engineering', 'Design', 'Product', 'Sales', 'Marketing', 'People', 'Finance'];
const employment = ['Full time', 'Part time', 'Contract', 'Intern'];
const workModes = ['On site', 'Hybrid', 'Remote'];
const shifts = ['Day (9 to 6)', 'Early (7 to 4)', 'Late (12 to 9)'];
const laptops = ['MacBook Air 13"', 'MacBook Pro 14"', 'ThinkPad T14', 'Bring your own'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const countries = opt('India', 'United States', 'United Kingdom', 'Germany', 'Singapore', 'Australia', 'Canada', 'UAE');
const offices = opt('Pune', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'London', 'Remote hub');
const managers = [
  { value: 'meera', label: 'Meera Iyer', description: 'HR Business Partner' },
  { value: 'aarav', label: 'Aarav Mehta', description: 'Engineering Manager' },
  { value: 'diya', label: 'Diya Rao', description: 'Product Designer' },
  { value: 'rohan', label: 'Rohan Das', description: 'Backend Engineer' },
];
const tools = opt('Email and calendar', 'Slack', 'GitHub', 'Figma', 'Jira', 'Notion', 'Payroll portal', 'VPN');

type Values = Record<string, string | undefined>;
const required: Record<string, string> = {
  name: 'Enter the full name.',
  department: 'Choose a department.',
  type: 'Choose an employment type.',
  manager: 'Choose a reporting manager.',
  start: 'Pick a start date.',
};

function Pick({ id, value, onChange, items, placeholder, invalid }: { id: string; value?: string; onChange: (v: string) => void; items: string[]; placeholder?: string; invalid?: boolean }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} aria-invalid={invalid || undefined}><SelectValue placeholder={placeholder ?? 'Select'} /></SelectTrigger>
      <SelectContent>{items.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
    </Select>
  );
}

export default function NewHireForm() {
  const [v, setV] = React.useState<Values>({ mode: 'Hybrid', shift: 'Day (9 to 6)' });
  const [access, setAccess] = React.useState<string[]>(['email-and-calendar', 'slack']);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const set = (k: string) => (val: string | undefined) => {
    setV((s) => ({ ...s, [k]: val }));
    if (val) setErrors((e) => ({ ...e, [k]: '' }));
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = Object.fromEntries(Object.entries(required).filter(([k]) => !v[k]?.trim()));
    setErrors(next);
    if (!Object.keys(next).length) toast.success('Onboarding started', `${v.name} joins ${v.department} on ${v.start}.`);
  }

  return (
    <div className="grid place-items-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>New hire onboarding</CardTitle>
          <CardDescription>Fill this once. IT, payroll and the manager each get their part.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} noValidate className="grid gap-6">
            <fieldset className="grid items-start gap-4 sm:grid-cols-2">
              <legend className="mb-3 text-sm font-medium">Person</legend>
              <Field label="Full name" htmlFor="nh-name" required error={errors.name}>
                <Input id="nh-name" aria-invalid={!!errors.name || undefined} value={v.name ?? ''} onChange={(e) => set('name')(e.target.value)} placeholder="Ananya Kulkarni" />
              </Field>
              <Field label="Personal email" htmlFor="nh-email">
                <Input id="nh-email" type="email" placeholder="name@example.com" />
              </Field>
              <Field label="Country" htmlFor="nh-country">
                <Combobox id="nh-country" options={countries} value={v.country} onValueChange={set('country')} placeholder="Search countries" />
              </Field>
              <Field label="T-shirt size" htmlFor="nh-size">
                <Pick id="nh-size" value={v.size} onChange={set('size')} items={sizes} />
              </Field>
            </fieldset>

            <fieldset className="grid items-start gap-4 sm:grid-cols-2">
              <legend className="mb-3 text-sm font-medium">Role</legend>
              <Field label="Department" htmlFor="nh-dept" required error={errors.department}>
                <Pick id="nh-dept" invalid={!!errors.department} value={v.department} onChange={set('department')} items={departments} />
              </Field>
              <Field label="Employment type" htmlFor="nh-type" required error={errors.type}>
                <Pick id="nh-type" invalid={!!errors.type} value={v.type} onChange={set('type')} items={employment} />
              </Field>
              <Field label="Reporting manager" htmlFor="nh-manager" required error={errors.manager}>
                <Combobox id="nh-manager" invalid={!!errors.manager} options={managers} value={v.manager} onValueChange={set('manager')} placeholder="Choose a person" />
              </Field>
              <Field label="Start date" htmlFor="nh-start" required error={errors.start}>
                <Input id="nh-start" type="date" aria-invalid={!!errors.start || undefined} value={v.start ?? ''} onChange={(e) => set('start')(e.target.value)} />
              </Field>
            </fieldset>

            <fieldset className="grid items-start gap-4 sm:grid-cols-2">
              <legend className="mb-3 text-sm font-medium">Where and when</legend>
              <Field label="Office" htmlFor="nh-office">
                <Combobox id="nh-office" options={offices} value={v.office} onValueChange={set('office')} placeholder="Choose an office" />
              </Field>
              <Field label="Work mode" htmlFor="nh-mode">
                <Pick id="nh-mode" value={v.mode} onChange={set('mode')} items={workModes} />
              </Field>
              <Field label="Shift" htmlFor="nh-shift">
                <Pick id="nh-shift" value={v.shift} onChange={set('shift')} items={shifts} />
              </Field>
              <Field label="Laptop" htmlFor="nh-laptop" hint="Ships three days before the start date.">
                <Pick id="nh-laptop" value={v.laptop} onChange={set('laptop')} items={laptops} />
              </Field>
            </fieldset>

            <fieldset className="grid gap-4">
              <legend className="mb-3 text-sm font-medium">Access</legend>
              <Field label="Tools to set up" htmlFor="nh-tools">
                <MultiCombobox id="nh-tools" options={tools} value={access} onValueChange={setAccess} placeholder="Pick tools" />
              </Field>
              <Field label="Notes for IT or the manager" htmlFor="nh-notes">
                <Textarea id="nh-notes" placeholder="Accessibility needs, a second monitor, anything else" />
              </Field>
            </fieldset>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => { setV({ mode: 'Hybrid', shift: 'Day (9 to 6)' }); setAccess([]); setErrors({}); }}>Reset</Button>
              <Button type="submit">Start onboarding</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
