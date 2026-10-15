import * as React from 'react';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Field, Label } from '@/components/ui/label';
import { BellIcon, LockIcon, UserIcon } from '@/components/ui/icons';
import { SettingsLayout, SettingsSection } from '@/components/ui/settings-layout';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/toast';

const rows = [
  ['leave', 'Leave requests', 'When someone asks for time off'],
  ['payslip', 'Payslips', 'When a new payslip is ready'],
  ['digest', 'Weekly digest', 'A Monday summary of your team'],
] as const;

export default function SettingsPage() {
  const [tab, setTab] = React.useState('profile');
  const [name, setName] = React.useState('Aarav Mehta');
  const [bio, setBio] = React.useState('Platform engineer. Likes small, sharp tools.');
  const [on, setOn] = React.useState<Record<string, boolean>>({ leave: true, payslip: true, digest: false });
  const [confirm, setConfirm] = React.useState(false);
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
      {tab === 'profile' && (
        <SettingsSection title="Personal info" description="Shown to teammates.">
          <div className="flex items-center gap-4"><Avatar name={name} size="xl" /><Button variant="outline" size="sm">Change photo</Button></div>
          <Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Bio" hint={`${bio.length}/160`}><Textarea value={bio} maxLength={160} onChange={(e) => setBio(e.target.value)} /></Field>
          <div><Button onClick={() => toast.success('Profile saved')}>Save changes</Button></div>
        </SettingsSection>
      )}
      {tab === 'notifications' && (
        <SettingsSection title="Email" description="Choose what lands in your inbox.">
          {rows.map(([id, label, hint]) => (
            <div key={id} className="flex items-center justify-between gap-4">
              <div><Label htmlFor={id}>{label}</Label><p className="text-[13px] text-muted-foreground">{hint}</p></div>
              <Switch id={id} checked={on[id]} onCheckedChange={(v) => { setOn({ ...on, [id]: v }); toast.info(v ? `${label} on` : `${label} off`); }} />
            </div>
          ))}
        </SettingsSection>
      )}
      {tab === 'security' && (
        <SettingsSection title="Danger zone" description="This cannot be undone.">
          <div><Button variant="destructive" onClick={() => setConfirm(true)}>Delete my account</Button></div>
          <AlertDialog open={confirm} onOpenChange={setConfirm} destructive title="Delete your account?" description="Your profile and settings are removed for good." confirmLabel="Delete" onConfirm={() => toast.success('Account deleted')} />
        </SettingsSection>
      )}
    </SettingsLayout>
  );
}
