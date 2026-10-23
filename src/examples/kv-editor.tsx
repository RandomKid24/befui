import * as React from 'react';
import { KvEditor, type KvPair } from '@/components/ui/kv-editor';

export default function KvEditorDemo() {
  const [pairs, setPairs] = React.useState<KvPair[]>([
    { key: 'DATABASE_URL', value: 'postgres://app:s3cret@db.acme.co/prod' },
    { key: 'STRIPE_KEY', value: 'sk_live_51Hxyz' },
    { key: 'LOG_LEVEL', value: 'info' },
  ]);
  return <KvEditor className="w-[38rem] max-w-full" pairs={pairs} onChange={setPairs} />;
}
