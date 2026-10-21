import * as React from 'react';
import { FilterBuilder, matchesFilters, type FilterRule } from '@/components/ui/filter-builder';

const people = [
  { name: 'Aarav Mehta', team: 'Engineering', age: 31 }, { name: 'Diya Rao', team: 'Design', age: 27 }, { name: 'Kabir Shah', team: 'Sales', age: 35 },
  { name: 'Meera Iyer', team: 'People', age: 29 }, { name: 'Rohan Das', team: 'Engineering', age: 41 }, { name: 'Isha Nair', team: 'Sales', age: 26 },
];

export default function FilterBuilderDemo() {
  const [rules, setRules] = React.useState<FilterRule[]>([{ field: 'team', op: 'is', value: 'Engineering' }]);
  const rows = people.filter((p) => matchesFilters(p, rules));
  return (
    <div className="grid w-[40rem] max-w-full gap-4">
      <FilterBuilder
        rules={rules}
        onChange={setRules}
        fields={[{ key: 'name', label: 'Name' }, { key: 'team', label: 'Team', type: 'select', options: ['Engineering', 'Design', 'Sales', 'People'] }, { key: 'age', label: 'Age', type: 'number' }]}
      />
      <p className="text-sm text-muted-foreground">{rows.length} of {people.length}: {rows.map((r) => r.name).join(', ') || 'no matches'}</p>
    </div>
  );
}
