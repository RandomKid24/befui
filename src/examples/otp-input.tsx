import * as React from 'react';
import { OtpInput } from '@/components/ui/otp-input';
import { toast } from '@/components/ui/toast';

export default function OtpInputDemo() {
  const [v, setV] = React.useState('');
  const [bad, setBad] = React.useState(false);
  const [ok, setOk] = React.useState(false);
  return (
    <div className="grid justify-items-center gap-3">
      <OtpInput
        value={v}
        invalid={bad}
        success={ok}
        onChange={(x) => { setV(x); setBad(false); setOk(false); }}
        onComplete={(x) => (x === '123456' ? (setOk(true), toast.success('Verified')) : (setBad(true), setTimeout(() => setV(''), 500)))}
      />
      <p className="text-xs text-muted-foreground">Try 123456, or paste any code.</p>
    </div>
  );
}
