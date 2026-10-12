import * as React from 'react';
import { BellIcon, LockIcon, UserIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { SettingsLayout, SettingsSection } from '@/components/ui/settings-layout';
import { Switch } from '@/components/ui/switch';

export default function SettingsLayoutDemo() {
  const [tab, setTab] = React.useState('profile');
  const [email, setEmail] = React.useState(true);
  return (
    <SettingsLayout
      className="w-full"
      value={tab}
      onChange={setTab}
      items={[
        { id: 'profile', label: 'Profile', icon: <UserIcon /> },
        { id: 'notifications', label: 'Notifications', icon: <BellIcon /> },
        { id: 'security', label: 'Security', icon: <LockIcon /> },
      ]}
    >
      {tab === 'profile' && (
        <SettingsSection title="Personal info" description="Shown to teammates.">
          <Field label="Full name"><Input defaultValue="Aarav Mehta" /></Field>
          <Field label="Email"><Input type="email" defaultValue="aarav@acme.co" /></Field>
        </SettingsSection>
      )}
      {tab === 'notifications' && (
        <SettingsSection title="Email" description="Choose what lands in your inbox.">
          <label className="flex items-center justify-between gap-3 text-sm">Weekly summary <Switch checked={email} onCheckedChange={setEmail} /></label>
        </SettingsSection>
      )}
      {tab === 'security' && (
        <SettingsSection title="Password" description="Use at least 12 characters.">
          <Field label="New password"><Input type="password" /></Field>
        </SettingsSection>
      )}
    </SettingsLayout>
  );
}
