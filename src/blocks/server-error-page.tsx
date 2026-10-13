'use client';

import * as React from 'react';
import { RefreshIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Timeline } from '@/components/ui/timeline';

export default function ServerErrorPage() {
  const [loading, setLoading] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  function retry() {
    setFailed(false);
    setLoading(true);
    setTimeout(() => { setLoading(false); setFailed(true); }, 1000); // replace with a real request
  }

  return (
    <div className="mx-auto grid w-full max-w-xl gap-4">
      <ErrorState code={500} title="Something went wrong on our side" description="This is not your fault. Our team has been told and is already looking into it.">
        <Button onClick={retry} loading={loading}><RefreshIcon /> Try again</Button>
        <Button variant="outline">View status page</Button>
      </ErrorState>
      {failed && <p role="status" className="text-center text-[13px] text-muted-foreground">Still not working. We are on it, so please try again in a few minutes.</p>}
      <Card className="grid gap-3 p-5">
        <h3 className="text-sm font-semibold tracking-tight">Incident update</h3>
        <Timeline
          items={[
            { title: 'Monitoring', description: 'A fix is rolling out. Pages should start loading again.', time: '2 min ago', tone: 'info' },
            { title: 'Identified', description: 'A database failover caused the errors.', time: '14 min ago', tone: 'success' },
            { title: 'Investigating', description: 'We are seeing errors on some pages.', time: '31 min ago', tone: 'warning' },
          ]}
        />
      </Card>
    </div>
  );
}
