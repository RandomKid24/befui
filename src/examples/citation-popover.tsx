import { CitationPopover } from '@/components/ui/citation-popover';

export default function CitationPopoverDemo() {
  return (
    <p className="max-w-lg text-sm leading-7">
      Unused casual leave lapses on 31 March
      <CitationPopover n={1} source={{ title: 'Leave policy 2025: carry-forward and encashment', site: 'handbook.acme.co', href: '#policy', quote: 'Casual leave does not carry forward. Any balance at the end of the financial year lapses.' }} />
      , while up to 30 days of earned leave can be carried over
      <CitationPopover n={2} source={{ title: 'Leave FAQ: what lapses on 31 March', site: 'help.acme.co', href: '#faq', quote: 'Earned leave carries forward up to a maximum of 30 days.' }} />
      .
    </p>
  );
}
