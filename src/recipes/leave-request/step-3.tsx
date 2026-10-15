import * as React from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type DateRange } from '@/components/ui/calendar';
import { DateRangePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';

const BALANCE = 7;
const days = (r?: DateRange) => (r?.from && r.to ? Math.round((r.to.getTime() - r.from.getTime()) / 86400000) + 1 : 0);

export default function LeaveRequest() {
  const [range, setRange] = React.useState<DateRange>();
  const [reason, setReason] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const used = days(range);
  const over = used > BALANCE;
  const submit = () => {
    setBusy(true);
    // swap this timeout for your request
    setTimeout(() => { setBusy(false); setSent(true); toast.success('Request sent', `${used} day${used === 1 ? '' : 's'} to your manager`); }, 800);
  };
  if (sent) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="grid gap-4 pt-6">
          <Alert variant="success" title="Sent to your manager">You will get a notification when it is approved.</Alert>
          <Button variant="outline" onClick={() => { setSent(false); setRange(undefined); setReason(''); }}>Request another</Button>
        </CardContent>
      </Card>
    );
  }
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
        <Field label="Dates" error={over ? `You only have ${BALANCE} days left.` : undefined}><DateRangePicker value={range} onChange={setRange} /></Field>
        <div className="grid gap-1.5">
          <div className="flex justify-between text-[13px]"><span className="text-muted-foreground">Balance after this</span><span className="font-medium tabular-nums">{Math.max(0, BALANCE - used)} of {BALANCE} days</span></div>
          <Progress value={(Math.max(0, BALANCE - used) / BALANCE) * 100} tone={over ? 'danger' : undefined} aria-label="Leave balance" />
        </div>
        <Field label="Reason"><Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Optional" /></Field>
      </CardContent>
      <CardFooter className="justify-end"><Button onClick={submit} loading={busy} disabled={!used || over}>Send request</Button></CardFooter>
    </Card>
  );
}
