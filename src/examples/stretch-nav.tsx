import * as React from 'react';
import { StretchNav } from '@/components/ui/stretch-nav';

export default function StretchNavDemo() {
  const [view, setView] = React.useState('overview');
  return <StretchNav value={view} onChange={setView} items={[{ id: 'overview', label: 'Overview' }, { id: 'pipeline', label: 'Pipeline' }, { id: 'activity', label: 'Activity' }, { id: 'team', label: 'Team' }, { id: 'reports', label: 'Reports' }]} />;
}
