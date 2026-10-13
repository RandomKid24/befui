import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { MinusIcon, PlusIcon } from '@/components/ui/icons';

export default function ButtonGroupDemo() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <ButtonGroup aria-label="Range">
        <Button variant="outline">Day</Button>
        <Button variant="outline">Week</Button>
        <Button variant="outline">Month</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical" aria-label="Zoom">
        <Button variant="outline" size="icon" aria-label="Zoom in"><PlusIcon /></Button>
        <Button variant="outline" size="icon" aria-label="Zoom out"><MinusIcon /></Button>
      </ButtonGroup>
    </div>
  );
}
