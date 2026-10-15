import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type DateRange } from '@/components/ui/calendar';
import { DateRangePicker } from '@/components/ui/date-picker';
import { Field } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LeaveRequest() {
  const [range, setRange] = React.useState<DateRange>();
  return (
    <Card className="w-full max-w-md">
      <CardHeader><CardTitle>Request leave</CardTitle><CardDescription>Your manager gets it straight away.</CardDescription></CardHeader>
      <CardContent className="grid gap-4">
        <Field label="Type">
          <Select defaultValue="casual">
            <SelectTrigger aria-label="Leave type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Casual leave</SelectItem>
              <SelectItem value="sick">Sick leave</SelectItem>
              <SelectItem value="earned">Earned leave</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Dates"><DateRangePicker value={range} onChange={setRange} /></Field>
      </CardContent>
    </Card>
  );
}
