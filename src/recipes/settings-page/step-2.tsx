import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Field } from '@/components/ui/label';
import { BellIcon, LockIcon, UserIcon } from '@/components/ui/icons';
import { SettingsLayout, SettingsSection } from '@/components/ui/settings-layout';
import { toast } from '@/components/ui/toast';

export default function SettingsPage() {
  const [tab, setTab] = React.useState('profile');
  const [name, setName] = React.useState('Aarav Mehta');
  const [bio, setBio] = React.useState('Platform engineer. Likes small, sharp tools.');
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
        <div className="flex items-center gap-4">
          <Avatar name={name} size="xl" />
          <Button variant="outline" size="sm">Change photo</Button>
        </div>
        <Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Email"><Input type="email" defaultValue="aarav@acme.co" /></Field>
        <Field label="Bio" hint={`${bio.length}/160`}><Textarea value={bio} maxLength={160} onChange={(e) => setBio(e.target.value)} /></Field>
        <div><Button onClick={() => toast.success('Profile saved')}>Save changes</Button></div>
      </SettingsSection>
    </SettingsLayout>
  );
}
