import * as React from 'react';
import { FloatingShell, GlassPanel } from '@/components/ui/floating-shell';
import { GridIcon, HomeIcon, UsersIcon, WalletIcon } from '@/components/ui/icons';

export default function FloatingShellDemo() {
  const [view, setView] = React.useState('overview');
  return (
    <FloatingShell
      className="max-w-4xl overflow-hidden rounded-xl border"
      brand={{ name: 'Northwind', tagline: 'Workspace', mark: <HomeIcon /> }}
      value={view}
      onChange={setView}
      groups={[{ label: 'Menu', items: [{ id: 'overview', label: 'Overview', icon: <GridIcon /> }, { id: 'people', label: 'People', icon: <UsersIcon />, badge: 3 }, { id: 'money', label: 'Money', icon: <WalletIcon /> }] }]}
    >
      <GlassPanel title="Your page goes here" note={`Showing ${view}`}><p className="text-sm text-muted-foreground">Put your cards and tables inside the frame.</p></GlassPanel>
    </FloatingShell>
  );
}
