import * as React from 'react';
import { SidebarSplit } from '@/components/ui/sidebar-split';
import { Avatar } from '@/components/ui/avatar';
import { CreditCardIcon, FolderIcon, UsersIcon } from '@/components/ui/icons';

function Page({ title }: { title: string }) {
  return (
    <div className="flex-1 p-6">
      <h3 className="text-lg font-semibold capitalize">{title}</h3>
      <div className="mt-4 grid gap-2"><div className="h-3 w-3/4 rounded bg-muted" /><div className="h-3 w-1/2 rounded bg-muted" /><div className="h-24 rounded-lg bg-muted/60" /></div>
    </div>
  );
}

const sections = [
  { id: 'projects', label: 'Projects', icon: <FolderIcon />, links: [{ id: 'all', label: 'All projects', count: 24 }, { id: 'mine', label: 'Assigned to me', count: 6 }, { id: 'archived', label: 'Archived' }] },
  { id: 'people', label: 'People', icon: <UsersIcon />, links: [{ id: 'directory', label: 'Directory', count: 128 }, { id: 'teams', label: 'Teams', count: 9 }, { id: 'invites', label: 'Pending invites', count: 3 }] },
  { id: 'billing', label: 'Billing', icon: <CreditCardIcon />, links: [{ id: 'plan', label: 'Plan' }, { id: 'invoices', label: 'Invoices' }, { id: 'methods', label: 'Payment methods' }] },
];

export default function SidebarSplitDemo() {
  const [section, setSection] = React.useState('projects');
  const [link, setLink] = React.useState('all');
  return (
    <div className="flex h-[26rem] w-full max-w-3xl overflow-hidden rounded-xl border bg-background">
      <SidebarSplit sections={sections} section={section} onSection={(s) => { setSection(s); setLink(sections.find((x) => x.id === s)!.links[0].id); }} link={link} onLink={setLink} footer={<Avatar name="Meera Iyer" size="sm" />} />
      <Page title={link} />
    </div>
  );
}
