import * as React from 'react';
import { FormWizard } from '@/components/ui/form-wizard';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

/** Three steps. The first will not let you on until the name is filled in. */
export default function FormWizardDemo() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  return (
    <FormWizard
      className="w-[32rem] max-w-full"
      finishLabel="Create account"
      onFinish={() => toast.success('Account created', name)}
      steps={[
        { title: 'You', description: 'Who are you', validate: () => (name.trim() ? true : 'Enter your name to continue.'), content: <Input aria-label="Name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} /> },
        { title: 'Contact', description: 'How to reach you', content: <Input aria-label="Email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} /> },
        { title: 'Review', content: <p className="text-sm text-muted-foreground">Creating an account for <b className="text-foreground">{name || '…'}</b>{email ? <> ({email})</> : null}.</p> },
      ]}
    />
  );
}
