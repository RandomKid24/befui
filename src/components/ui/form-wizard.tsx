'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Stepper } from './stepper';

export interface WizardStep {
  title: string;
  description?: string;
  content: React.ReactNode;
  /** Return true to let the user move on, or a message to show instead. Runs on Next and Finish. */
  validate?: () => true | string;
}

/**
 * A form split into steps: a stepper on top, one step's fields at a time, Back and Next below. Each step can `validate` before it lets you
 * move on. Your fields keep their own state, so keep it in the parent (or one `<form>`) and the values survive going back.
 */
export function FormWizard({ steps, onFinish, finishLabel = 'Finish', className }: { steps: WizardStep[]; onFinish: () => void; finishLabel?: string; className?: string }) {
  const [i, setI] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const last = i === steps.length - 1;
  const next = () => {
    const ok = steps[i]!.validate?.() ?? true;
    if (ok !== true) return setError(ok);
    setError(null);
    last ? onFinish() : setI(i + 1);
  };
  return (
    <div className={cn('w-full', className)}>
      <Stepper steps={steps.map(({ title, description }) => ({ title, description }))} current={i} />
      <div className="mt-6 min-h-24" aria-live="polite">{steps[i]!.content}</div>
      {error ? <p role="alert" className="mt-2 text-sm text-destructive">{error}</p> : null}
      <div className="mt-6 flex justify-between">
        <Button variant="ghost" disabled={i === 0} onClick={() => { setError(null); setI(i - 1); }}>Back</Button>
        <Button onClick={next}>{last ? finishLabel : 'Next'}</Button>
      </div>
    </div>
  );
}
