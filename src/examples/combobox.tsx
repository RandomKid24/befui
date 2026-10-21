import * as React from 'react';
import { Combobox, MultiCombobox, type ComboboxOption } from '@/components/ui/combobox';
import { Field } from '@/components/ui/label';

const seed: ComboboxOption[] = [
  { value: 'aarav', label: 'Aarav Mehta', description: 'Engineering Manager' },
  { value: 'diya', label: 'Diya Rao', description: 'Product Designer' },
  { value: 'kabir', label: 'Kabir Shah', description: 'Account Executive' },
  { value: 'meera', label: 'Meera Iyer', description: 'HR Business Partner' },
  { value: 'rohan', label: 'Rohan Das', description: 'Backend Engineer' },
  { value: 'isha', label: 'Isha Nair', description: 'Marketing Lead' },
];

export default function ComboboxDemo() {
  const [people, setPeople] = React.useState(seed);
  const [approver, setApprover] = React.useState<string>();
  const [watchers, setWatchers] = React.useState<string[]>(['diya']);
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Field label="Approver" htmlFor="appr">
        <Combobox id="appr" options={people} value={approver} onValueChange={setApprover} placeholder="Choose a person" searchPlaceholder="Search people..." />
      </Field>
      <Field label="Notify" htmlFor="notify" hint="Pick as many as you like, or type a new name and choose Create.">
        <MultiCombobox id="notify" options={people} value={watchers} onValueChange={setWatchers} placeholder="Add people" onCreate={(label) => { const value = label.toLowerCase().replace(/\s+/g, '-'); setPeople((p) => [...p, { value, label }]); setWatchers((w) => [...w, value]); }} />
      </Field>
    </div>
  );
}
