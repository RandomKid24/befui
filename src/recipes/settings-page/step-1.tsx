import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { BellIcon, LockIcon, UserIcon } from '@/components/ui/icons';
import { SettingsLayout, SettingsSection } from '@/components/ui/settings-layout';

export default function SettingsPage() {
  const [tab, setTab] = React.useState('profile');
  return (
    <SettingsLayout
      className="w-[48rem] max-w-full"
      value={tab}
      onChange={setTab}
      items={[
        { id: 'profile', label: 'Profile', icon: <UserIcon /> },
        { id: 'notifications', label: 'Notifications', icon: <BellIcon /> },
        { id: 'security', label: 'Security', icon: <LockIcon /> },
      ]}
    >
      <SettingsSection title="Personal info" description="Shown to teammates.">
        <Field label="Full name"><Input defaultValue="Aarav Mehta" /></Field>
        <Field label="Email"><Input type="email" defaultValue="aarav@acme.co" /></Field>
      </SettingsSection>
    </SettingsLayout>
  );
}
