import * as React from 'react';
import { ApiKeyManager, type ApiKey } from '@/components/ui/api-key-manager';

export default function ApiKeyManagerDemo() {
  const [keys, setKeys] = React.useState<ApiKey[]>([
    { id: '1', name: 'Production server', prefix: 'sk_live_4f2a', created: '12 Aug', lastUsed: '2 min ago' },
    { id: '2', name: 'CI pipeline', prefix: 'sk_live_9c1d', created: '3 Sep', lastUsed: '4 days ago' },
    { id: '3', name: 'Old staging', prefix: 'sk_test_77be', created: '2 Jan', revoked: true },
  ]);
  return (
    <ApiKeyManager
      className="w-[40rem] max-w-full"
      keys={keys}
      onCreate={(name) => setKeys((k) => [{ id: String(k.length + 1), name, prefix: 'sk_live_', secret: 'sk_live_b83f19a7c2e44d0f91ab', created: 'Today' }, ...k])}
      onRevoke={(id) => setKeys((k) => k.map((x) => (x.id === id ? { ...x, revoked: true, secret: undefined } : x)))}
    />
  );
}
