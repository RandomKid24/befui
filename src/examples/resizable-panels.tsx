import { ResizablePanels } from '@/components/ui/resizable-panels';

export default function ResizablePanelsDemo() {
  return (
    <ResizablePanels
      className="w-[42rem] max-w-full"
      left={<ul className="grid gap-1 text-sm">{['Inbox', 'Starred', 'Sent', 'Drafts', 'Archive'].map((x) => <li key={x} className="rounded-md px-2 py-1.5 hover:bg-secondary">{x}</li>)}</ul>}
      center={<div className="text-sm"><p className="font-medium">Quarterly planning</p><p className="mt-1 text-muted-foreground">Drag the thin lines to resize the side panels, or use the arrow buttons to collapse them.</p></div>}
      right={<div className="text-sm text-muted-foreground"><p className="font-medium text-foreground">Details</p><p className="mt-1">From: Aarav Mehta</p><p>Labels: Planning</p></div>}
    />
  );
}
