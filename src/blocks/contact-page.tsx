'use client';

import * as React from 'react';
import { CheckCircleIcon, MailIcon } from '@/components/ui/icons';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, Textarea } from '@/components/ui/input';
import { Field } from '@/components/ui/label';

const faqs = [
  { id: 'reply', title: 'How fast do you reply?', content: 'Usually within one working day. Urgent issues get a same-day answer.' },
  { id: 'demo', title: 'Can I get a demo?', content: 'Yes. Tell us your team size in the message and we will book 30 minutes.' },
  { id: 'billing', title: 'Who do I talk to about billing?', content: 'Use this form and pick billing in your message. It goes straight to finance.' },
  { id: 'security', title: 'Where do I report a security issue?', content: 'Email security@acme.co. Please do not post it publicly.' },
];

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export default function ContactPage() {
  const [values, setValues] = React.useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = React.useState<Errors>({});
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues({ ...values, [key]: e.target.value });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Enter a valid email.';
    if (!values.message.trim()) next.message = 'Write a message.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 800); // replace with a real request
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 py-6 lg:grid-cols-2">
      <div className="grid content-start gap-6">
        <div className="grid gap-2">
          <h2 className="text-3xl font-semibold tracking-tight">Contact us</h2>
          <p className="text-muted-foreground">Questions, ideas or a bug to report? Send a note and a real person will answer.</p>
        </div>
        {sent ? (
          <Card className="grid justify-items-center gap-3 p-8 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-success/10 text-success"><CheckCircleIcon className="size-6" /></span>
            <h3 className="text-lg font-semibold tracking-tight">Message sent</h3>
            <p className="text-[13px] text-muted-foreground">Thanks, {values.name}. We will reply to {values.email} soon.</p>
            <Button variant="outline" onClick={() => { setSent(false); setValues({ name: '', email: '', message: '' }); }}>Send another</Button>
          </Card>
        ) : (
          <Card className="p-6">
            <form onSubmit={submit} noValidate className="grid gap-4">
              <Field label="Name" error={errors.name}><Input value={values.name} onChange={set('name')} aria-invalid={!!errors.name} /></Field>
              <Field label="Email" error={errors.email}><Input type="email" leftIcon={<MailIcon />} value={values.email} onChange={set('email')} aria-invalid={!!errors.email} /></Field>
              <Field label="Message" error={errors.message}><Textarea rows={5} value={values.message} onChange={set('message')} aria-invalid={!!errors.message} /></Field>
              <Button type="submit" loading={loading}>Send message</Button>
            </form>
          </Card>
        )}
      </div>
      <div className="grid content-start gap-3">
        <h3 className="text-lg font-semibold tracking-tight">Common questions</h3>
        <Accordion items={faqs} />
      </div>
    </div>
  );
}
