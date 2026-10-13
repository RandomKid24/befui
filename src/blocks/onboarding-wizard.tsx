'use client';

import * as React from 'react';
import { CheckCircleIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { Segmented } from '@/components/ui/segmented';
import { Stepper } from '@/components/ui/stepper';
import { Switch } from '@/components/ui/switch';

const STEPS = [{ title: 'Profile' }, { title: 'Team' }, { title: 'Preferences' }, { title: 'Done' }];

export default function OnboardingWizard() {
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('eng');
  const [team, setTeam] = React.useState('');
  const [size, setSize] = React.useState('2-10');
  const [digest, setDigest] = React.useState(true);
  const [tips, setTips] = React.useState(false);
  const [error, setError] = React.useState('');

  function next() {
    if (step === 0 && !name.trim()) return setError('Enter your name.');
    if (step === 1 && !team.trim()) return setError('Name your team.');
    setError('');
    setStep(step + 1);
  }
  const back = () => { setError(''); setStep(step - 1); };

  return (
    <div className="mx-auto grid w-full max-w-xl gap-6 py-4">
      <Stepper steps={STEPS} current={step} />
      <Card className="grid gap-5 p-6">
        {step < 3 && <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Step {step + 1} of 4</p>}

        {step === 0 && (
          <div className="grid gap-4">
            <div className="grid gap-1">
              <h2 className="text-lg font-semibold tracking-tight">Tell us about you</h2>
              <p className="text-[13px] text-muted-foreground">This is how teammates will see you.</p>
            </div>
            <Field label="Full name" htmlFor="ow-name" error={error}>
              <Input id="ow-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Mehta" aria-invalid={!!error} />
            </Field>
            <Field label="What do you do?">
              <Segmented value={role} onValueChange={setRole} options={[{ value: 'eng', label: 'Engineering' }, { value: 'design', label: 'Design' }, { value: 'ops', label: 'Operations' }]} />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4">
            <div className="grid gap-1">
              <h2 className="text-lg font-semibold tracking-tight">Set up your team</h2>
              <p className="text-[13px] text-muted-foreground">You can invite people later.</p>
            </div>
            <Field label="Team name" htmlFor="ow-team" error={error}>
              <Input id="ow-team" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Acme Inc." aria-invalid={!!error} />
            </Field>
            <Field label="Team size">
              <Segmented value={size} onValueChange={setSize} options={[{ value: '1', label: 'Just me' }, { value: '2-10', label: '2 to 10' }, { value: '11+', label: '11 or more' }]} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4">
            <div className="grid gap-1">
              <h2 className="text-lg font-semibold tracking-tight">How should we keep in touch?</h2>
              <p className="text-[13px] text-muted-foreground">Change this any time in settings.</p>
            </div>
            <label className="flex items-center justify-between gap-3 text-sm">Weekly summary email <Switch checked={digest} onCheckedChange={setDigest} /></label>
            <label className="flex items-center justify-between gap-3 text-sm">Product tips and news <Switch checked={tips} onCheckedChange={setTips} /></label>
          </div>
        )}

        {step === 3 && (
          <div className="grid justify-items-center gap-3 py-4 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-success/10 text-success"><CheckCircleIcon className="size-6" /></span>
            <h2 className="text-lg font-semibold tracking-tight">You are all set</h2>
            <p className="text-[13px] text-muted-foreground">Welcome, <b className="text-foreground">{name}</b>. <b className="text-foreground">{team}</b> is ready.</p>
            <Button onClick={() => { setStep(0); setName(''); setTeam(''); }}>Go to dashboard</Button>
          </div>
        )}

        {step < 3 && (
          <div className="flex justify-between gap-2">
            <Button variant="ghost" onClick={back} disabled={step === 0}>Back</Button>
            <Button onClick={next}>{step === 2 ? 'Finish' : 'Next'}</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
