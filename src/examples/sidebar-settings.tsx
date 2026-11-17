import * as React from 'react';
import { SidebarSettings } from '@/components/ui/sidebar-settings';

function Page({ title }: { title: string }) {
  return (
    <div className="flex-1 p-6">
      <h3 className="text-lg font-semibold capitalize">{title}</h3>
      <div className="mt-4 grid gap-2"><div className="h-3 w-3/4 rounded bg-muted" /><div className="h-3 w-1/2 rounded bg-muted" /><div className="h-24 rounded-lg bg-muted/60" /></div>
    </div>
  );
}

const groups = [
  { label: 'Account', items: [{ id: 'profile', label: 'Profile' }, { id: 'security', label: 'Password and security' }, { id: 'notifications', label: 'Notifications' }] },
  { label: 'Workspace', items: [{ id: 'general', label: 'General' }, { id: 'members', label: 'Members and roles' }, { id: 'billing', label: 'Billing' }, { id: 'integrations', label: 'Integrations' }] },
  { label: 'Danger zone', items: [{ id: 'delete', label: 'Delete workspace', danger: true }] },
];

export default function SidebarSettingsDemo() {
  const [v, setV] = React.useState('profile');
  return (
    <div className="flex h-[26rem] w-full max-w-3xl overflow-hidden rounded-xl border bg-background">
      <SidebarSettings groups={groups} value={v} onChange={setV} />
      <Page title={v} />
    </div>
  );
}
