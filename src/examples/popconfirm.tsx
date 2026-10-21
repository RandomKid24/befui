import { Button } from '@/components/ui/button';
import { Popconfirm } from '@/components/ui/popconfirm';
import { toast } from '@/components/ui/toast';

export default function PopconfirmDemo() {
  return (
    <Popconfirm title="Delete this invoice?" description="This cannot be undone." confirmLabel="Delete" destructive onConfirm={() => toast.success('Invoice deleted')}>
      <Button variant="outline">Delete invoice</Button>
    </Popconfirm>
  );
}
