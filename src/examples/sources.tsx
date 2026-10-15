import { SourceList, type Source } from '@/components/ui/sources';

const sources: Source[] = [
  { id: '1', title: 'Leave policy 2025: carry-forward and encashment', site: 'handbook.acme.co', href: '#policy' },
  { id: '2', title: 'Leave FAQ: what lapses on 31 March', site: 'help.acme.co', href: '#faq' },
  { id: '3', title: 'HR circular 14: changes to casual leave', site: 'intranet.acme.co', href: '#circular' },
];

export default function SourcesDemo() {
  return <SourceList sources={sources} className="w-full max-w-2xl" />;
}
