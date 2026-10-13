'use client';

import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/toast';

const toggles = [
  ['Leave approvals', 'Email me when someone asks for leave.', true],
  ['Weekly digest', 'A Monday summary of your team.', true],
  ['Product news', 'New features and tips. Rarely.', false],
] as const;

export default function SettingsPage() {
  const [saving, setSaving] = React.useState(false);
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success('Settings saved'); }, 700);
  };
  return (
    <div className="mx-auto grid max-w-3xl gap-6 py-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your profile and how we contact you.</p>
      </div>
      <Tabs defaultValue="profile">
        <TabsList variant="pill">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="region">Region</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <Card className="p-6">
            <form onSubmit={save} className="grid gap-5">
              <div className="flex items-center gap-4">
                <Avatar name="Aditi Rao" size="lg" />
                <Button type="button" variant="outline" size="sm">Change photo</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="s-name"><Input id="s-name" defaultValue="Aditi Rao" /></Field>
                <Field label="Work email" htmlFor="s-mail"><Input id="s-mail" type="email" defaultValue="aditi@acme.in" /></Field>
                <Field label="Mobile"><PhoneInput /></Field>
              </div>
              <div className="flex justify-end"><Button type="submit" loading={saving}>Save changes</Button></div>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <Card className="divide-y">
            {toggles.map(([t, d, on]) => (
              <div key={t} className="flex items-center justify-between gap-4 p-4">
                <div><p className="text-sm font-medium">{t}</p><p className="text-[13px] text-muted-foreground">{d}</p></div>
                <Switch defaultChecked={on} aria-label={t} />
              </div>
            ))}
          </Card>
        </TabsContent>
        <TabsContent value="region" className="mt-4">
          <Card className="grid gap-4 p-6 sm:grid-cols-2">
            <Field label="Language">
              <Select defaultValue="en">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="hi">हिन्दी</SelectItem><SelectItem value="ar">العربية</SelectItem></SelectContent>
              </Select>
            </Field>
            <Field label="Time zone">
              <Select defaultValue="ist">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="ist">India (GMT+5:30)</SelectItem><SelectItem value="gst">Gulf (GMT+4)</SelectItem><SelectItem value="utc">UTC</SelectItem></SelectContent>
              </Select>
            </Field>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
