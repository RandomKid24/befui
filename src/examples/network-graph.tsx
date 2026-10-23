import { NetworkGraph } from '@/components/ui/network-graph';

const nodes = [
  { id: 'api', label: 'API gateway', group: 0 }, { id: 'auth', label: 'Auth', group: 0 }, { id: 'users', label: 'Users', group: 1 }, { id: 'billing', label: 'Billing', group: 1 },
  { id: 'orders', label: 'Orders', group: 1 }, { id: 'search', label: 'Search', group: 1 }, { id: 'pg', label: 'Postgres', group: 2 }, { id: 'redis', label: 'Redis', group: 2 },
  { id: 'queue', label: 'Queue', group: 2 }, { id: 'mail', label: 'Mailer', group: 3 }, { id: 'pay', label: 'Payments', group: 3 },
];
const links = [
  ['api', 'auth'], ['api', 'users'], ['api', 'orders'], ['api', 'search'], ['api', 'billing'], ['auth', 'redis'], ['users', 'pg'], ['orders', 'pg'], ['orders', 'queue'],
  ['billing', 'pg'], ['billing', 'pay'], ['queue', 'mail'], ['search', 'redis'], ['orders', 'pay'],
].map(([source, target]) => ({ source: source!, target: target! }));

export default function NetworkGraphDemo() {
  return <NetworkGraph className="w-[42rem] max-w-full" nodes={nodes} links={links} groups={[{ name: 'Edge' }, { name: 'Services' }, { name: 'Stores' }, { name: 'External' }]} />;
}
