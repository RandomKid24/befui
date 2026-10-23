import * as React from 'react';
import { OrgSwitcher } from '@/components/ui/org-switcher';

const orgs = [
  { id: 'acme', name: 'Acme Inc', plan: 'Pro plan' },
  { id: 'side', name: 'Side Project', plan: 'Free plan' },
  { id: 'studio', name: 'Studio 24', plan: 'Team plan' },
];

export default function OrgSwitcherDemo() {
  const [id, setId] = React.useState('acme');
  return <OrgSwitcher orgs={orgs} value={id} onChange={setId} onCreate={() => {}} />;
}
