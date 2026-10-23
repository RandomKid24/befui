import * as React from 'react';
import { TransferList } from '@/components/ui/transfer-list';

const roles = ['Viewer', 'Commenter', 'Editor', 'Billing admin', 'Workspace admin', 'Auditor', 'Support agent', 'Developer'].map((l) => ({ value: l.toLowerCase().replace(/\s+/g, '-'), label: l, disabled: l === 'Workspace admin' }));

export default function TransferListDemo() {
  const [value, setValue] = React.useState(['viewer', 'editor']);
  return <TransferList className="w-[40rem] max-w-full" items={roles} value={value} onChange={setValue} titles={['Roles', 'Assigned']} />;
}
