import * as React from 'react';
import { SidebarWorkspace } from '@/components/ui/sidebar-workspace';
import { OrgSwitcher } from '@/components/ui/org-switcher';
import { CalendarIcon, FileTextIcon, FolderIcon, HomeIcon, InboxIcon, StarIcon } from '@/components/ui/icons';

function Page({ title }: { title: string }) {
  return (
    <div className="flex-1 p-6">
      <h3 className="text-lg font-semibold capitalize">{title}</h3>
      <div className="mt-4 grid gap-2"><div className="h-3 w-3/4 rounded bg-muted" /><div className="h-3 w-1/2 rounded bg-muted" /><div className="h-24 rounded-lg bg-muted/60" /></div>
    </div>
  );
}

const orgs = [{ id: 'a', name: 'Aureole', plan: 'Team' }, { id: 'b', name: 'Beforth', plan: 'Free' }];
const groups = [
  { id: 'main', label: 'Workspace', items: [{ id: 'home', label: 'Home', icon: <HomeIcon /> }, { id: 'inbox', label: 'Inbox', icon: <InboxIcon />, count: 3 }, { id: 'calendar', label: 'Calendar', icon: <CalendarIcon /> }] },
  { id: 'fav', label: 'Favorites', items: [{ id: 'roadmap', label: 'Q4 roadmap', icon: <StarIcon /> }, { id: 'handbook', label: 'Team handbook', icon: <FileTextIcon /> }] },
  { id: 'projects', label: 'Projects', items: [{ id: 'website', label: 'Website relaunch', icon: <FolderIcon />, count: 8 }, { id: 'mobile', label: 'Mobile app', icon: <FolderIcon /> }, { id: 'hr', label: 'HR portal', icon: <FolderIcon />, count: 2 }] },
];

export default function SidebarWorkspaceDemo() {
  const [v, setV] = React.useState('home');
  const [org, setOrg] = React.useState('a');
  return (
    <div className="flex h-[26rem] w-full max-w-3xl overflow-hidden rounded-xl border bg-background">
      <SidebarWorkspace header={<OrgSwitcher orgs={orgs} value={org} onChange={setOrg} />} groups={groups} value={v} onChange={setV} onSearch={() => {}} user={{ name: 'Meera Iyer', email: 'meera@aureole.in' }} onSettings={() => {}} />
      <Page title={v} />
    </div>
  );
}
