import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

export default function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast.success('Saved', 'Your changes are live.')}>Success</Button>
      <Button variant="outline" onClick={() => toast.error('Could not save', 'Check your connection.')}>Error</Button>
      <Button variant="outline" onClick={() => toast.info('Heads up')}>Info</Button>
      <Button
        variant="outline"
        onClick={() => {
          const t = toast.progress('Exporting report.pdf', '0%');
          let n = 0;
          const timer = setInterval(() => { n += 20; t.update(n, `${n}%`); if (n >= 100) { clearInterval(timer); t.success('Report ready', 'report.pdf'); } }, 500);
        }}
      >
        With progress
      </Button>
      <Button variant="outline" onClick={() => toast.success('Message deleted', undefined, { action: { label: 'Undo', onClick: () => toast.info('Restored') } })}>With undo</Button>
    </div>
  );
}
