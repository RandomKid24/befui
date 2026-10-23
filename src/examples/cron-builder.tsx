import * as React from 'react';
import { CronBuilder } from '@/components/ui/cron-builder';

export default function CronBuilderDemo() {
  const [cron, setCron] = React.useState('0 9 * * 1');
  return <CronBuilder className="w-[34rem] max-w-full" value={cron} onChange={setCron} />;
}
