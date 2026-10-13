'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';
import { EmptyState } from '@/components/ui/empty-state';
import { KeyIcon, PlusIcon, TrashIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

interface ApiKey { id: string; name: string; secret: string; created: string; scope: 'Read' | 'Read and write' }

const rand = () => Array.from({ length: 24 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');

export default function ApiKeysPage() {
  const [keys, setKeys] = React.useState<ApiKey[]>([{ id: '1', name: 'Production server', secret: `bef_live_${rand()}`, created: '2 Sep 2026', scope: 'Read and write' }]);
  const [name, setName] = React.useState('');
  const [shown, setShown] = React.useState<string>();

  const create = () => {
    if (!name.trim()) return toast.error('Give the key a name');
    const k: ApiKey = { id: String(Date.now()), name: name.trim(), secret: `bef_live_${rand()}`, created: 'Today', scope: 'Read' };
    setKeys((l) => [k, ...l]);
    setShown(k.id);
    setName('');
  };
  const mask = (s: string) => `${s.slice(0, 8)}${'•'.repeat(16)}${s.slice(-4)}`;

  return (
    <div className="grid gap-4">
      <div className="grid gap-1"><h1 className="text-xl font-semibold tracking-tight">API keys</h1><p className="text-[13px] text-muted-foreground">Keys let your servers call the API. Keep them secret.</p></div>
      <Card>
        <CardHeader><CardTitle>Create a key</CardTitle><CardDescription>New keys can read data. Change the scope after creating.</CardDescription></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Input className="max-w-xs" aria-label="Key name" placeholder="e.g. Staging worker" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && create()} />
          <Button onClick={create}><PlusIcon /> Create key</Button>
        </CardContent>
      </Card>
      {keys.length === 0 ? (
        <EmptyState icon={<KeyIcon />} title="No keys yet" description="Create one above to start calling the API." />
      ) : (
        <Card className="divide-y">
          {keys.map((k) => (
            <div key={k.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="grid min-w-0 flex-1 gap-1">
                <div className="flex items-center gap-2 text-sm font-medium">{k.name}<Badge>{k.scope}</Badge></div>
                <code className="truncate font-mono text-xs text-muted-foreground">{shown === k.id ? k.secret : mask(k.secret)}</code>
                <span className="text-xs text-muted-foreground">Created {k.created}</span>
              </div>
              <Button size="xs" variant="outline" onClick={() => setShown(shown === k.id ? undefined : k.id)}>{shown === k.id ? 'Hide' : 'Reveal'}</Button>
              <CopyButton value={k.secret} aria-label={`Copy ${k.name}`} />
              <Button size="icon-sm" variant="ghost" aria-label={`Revoke ${k.name}`} onClick={() => setKeys((l) => l.filter((x) => x.id !== k.id))}><TrashIcon /></Button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
