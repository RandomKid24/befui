import * as React from 'react';
import { OtpInput } from '@/components/ui/otp-input';
import { toast } from '@/components/ui/toast';

export default function OtpInputDemo() {
  const [v, setV] = React.useState('');
  const [bad, setBad] = React.useState(false);
  const [ok, setOk] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const check = (code: string) => {
    setChecking(true);
    // stands in for your API call
    timer.current = setTimeout(() => {
      setChecking(false);
      if (code === '123456') { setOk(true); toast.success('Verified'); }
      else { setBad(true); timer.current = setTimeout(() => setV(''), 500); }
    }, 1200);
  };
  return (
    <div className="grid justify-items-center gap-3">
      <OtpInput
        value={v}
        invalid={bad}
        success={ok}
        verifying={checking}
        onChange={(x) => { setV(x); setBad(false); setOk(false); }}
        onComplete={check}
      />
      <p className="text-xs text-muted-foreground">Try 123456, or paste any code.</p>
    </div>
  );
}
