'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type DateRange, addDays, startOfDay } from '@/components/ui/calendar';
import { Combobox, MultiCombobox } from '@/components/ui/combobox';
import { DateRangePicker } from '@/components/ui/date-picker';
import { Input, Textarea } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { Alert } from '@/components/ui/alert';

const people = [
  { value: 'meera', label: 'Meera Iyer', description: 'HR Business Partner' },
  { value: 'aarav', label: 'Aarav Mehta', description: 'Engineering Manager' },
  { value: 'diya', label: 'Diya Rao', description: 'Product Designer' },
  { value: 'rohan', label: 'Rohan Das', description: 'Backend Engineer' },
];
const weekdaysBetween = (a: Date, b: Date) => {
  let n = 0;
  for (let d = a; d <= b; d = addDays(d, 1)) if (d.getDay() !== 0 && d.getDay() !== 6) n++;
  return n;
};

export default function LeaveRequestForm() {
  const [type, setType] = React.useState('casual');
  const [range, setRange] = React.useState<DateRange>();
  const [approver, setApprover] = React.useState<string>();
  const [notify, setNotify] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<{ range?: string; approver?: string }>({});
  const days = range?.from && range.to ? weekdaysBetween(range.from, range.to) : 0;
  const today = startOfDay(new Date());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = {
      range: range?.from && range.to ? undefined : 'Pick a start and an end date.',
      approver: approver ? undefined : 'Choose who approves this.',
    };
    setErrors(next);
    if (!next.range && !next.approver) toast.success('Leave requested', `${days} working day${days === 1 ? '' : 's'}, sent to ${people.find((p) => p.value === approver)?.label}.`);
  }

  return (
    <div className="grid place-items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Request leave</CardTitle>
          <CardDescription>Your approver gets an email right away.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4">
            <Field label="Leave type" htmlFor="lt">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="lt"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual leave</SelectItem>
                  <SelectItem value="sick">Sick leave</SelectItem>
                  <SelectItem value="earned">Earned leave</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Dates" htmlFor="dates" required error={errors.range}>
              <DateRangePicker id="dates" value={range} onChange={(r) => { setRange(r); if (r?.from && r.to) setErrors((e) => ({ ...e, range: undefined })); }} disabledDays={(d) => d < today} />
            </Field>
            {days > 0 && (
              <Alert variant={days > 5 ? 'warning' : 'info'} title={`${days} working day${days === 1 ? '' : 's'}`}>
                {days > 5 ? 'More than 5 days needs two approvals.' : 'Weekends are not counted.'}
              </Alert>
            )}
            <Field label="Approver" htmlFor="approver" required error={errors.approver}>
              <Combobox id="approver" options={people} value={approver} onValueChange={(v) => { setApprover(v); if (v) setErrors((e) => ({ ...e, approver: undefined })); }} placeholder="Choose a person" />
            </Field>
            <Field label="Also notify" htmlFor="notify">
              <MultiCombobox id="notify" options={people.filter((p) => p.value !== approver)} value={notify} onValueChange={setNotify} placeholder="Optional" />
            </Field>
            <Field label="Reason" htmlFor="reason">
              <Textarea id="reason" placeholder="Anything the approver should know" />
            </Field>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost">Cancel</Button>
              <Button type="submit">Submit request</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
