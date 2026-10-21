import { Button } from '@/components/ui/button';
import { Coachmark } from '@/components/ui/coachmark';

/** Pinned beside the button. Dismiss it, then reload: with persistKey it stays gone (clear site data to see it again). */
export default function CoachmarkDemo() {
  return (
    <div className="py-24">
      <Coachmark persistKey="demo-export" title="New: export to PDF" description="Send any report as a PDF from here.">
        <Button variant="outline">Export</Button>
      </Coachmark>
    </div>
  );
}
