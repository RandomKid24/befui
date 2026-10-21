import { SplitButton } from '@/components/ui/split-button';
import { toast } from '@/components/ui/toast';

export default function SplitButtonDemo() {
  return (
    <SplitButton
      onClick={() => toast.success('Published')}
      actions={[
        { label: 'Save as draft', onSelect: () => toast.info('Saved as draft') },
        { label: 'Schedule for later', onSelect: () => toast.info('Scheduled') },
        { label: 'Publish and share', onSelect: () => toast.success('Published and shared') },
      ]}
    >
      Publish
    </SplitButton>
  );
}
