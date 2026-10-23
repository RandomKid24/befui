import * as React from 'react';
import { FeatureFlagTable, type FeatureFlag } from '@/components/ui/feature-flag-table';

export default function FeatureFlagTableDemo() {
  const [flags, setFlags] = React.useState<FeatureFlag[]>([
    { key: 'new-checkout', name: 'New checkout', description: 'One-page checkout', enabled: true, rollout: 25, environments: ['Production', 'Staging'], owner: 'Payments' },
    { key: 'ai-search', name: 'AI search', description: 'Semantic results', enabled: true, rollout: 100, environments: ['Staging'], owner: 'Search' },
    { key: 'dark-mode', name: 'Dark mode', enabled: false, rollout: 0, environments: ['Production'], owner: 'Design' },
    { key: 'bulk-export', name: 'Bulk export', description: 'CSV of everything', enabled: true, rollout: 50, environments: ['Production'], owner: 'Data' },
  ]);
  return <FeatureFlagTable className="w-[44rem] max-w-full" flags={flags} onChange={setFlags} />;
}
