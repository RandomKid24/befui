import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

export default function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast.success('Saved', 'Your changes are live.')}>Success</Button>
      <Button variant="outline" onClick={() => toast.error('Could not save', 'Check your connection.')}>Error</Button>
      <Button variant="outline" onClick={() => toast.info('Heads up')}>Info</Button>
      <Button variant="outline" onClick={() => toast.success('Message deleted', undefined, { action: { label: 'Undo', onClick: () => toast.info('Restored') } })}>With undo</Button>
    </div>
  );
}
