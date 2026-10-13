import { Button } from '@/components/ui/button';
import { SearchIcon } from '@/components/ui/icons';
import { InputAddon, InputGroup, InputGroupInput } from '@/components/ui/input-group';

export default function InputGroupDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup>
        <InputAddon>https://</InputAddon>
        <InputGroupInput aria-label="Site name" placeholder="befui" />
        <InputAddon side="end">.com</InputAddon>
      </InputGroup>
      <InputGroup>
        <InputAddon>$</InputAddon>
        <InputGroupInput aria-label="Amount" type="number" placeholder="0.00" />
        <InputAddon side="end">USD</InputAddon>
      </InputGroup>
      <InputGroup>
        <InputAddon className="border-e-0 bg-transparent pe-0"><SearchIcon /></InputAddon>
        <InputGroupInput aria-label="Search" placeholder="Search components" />
        <InputAddon side="end" className="border-s-0 bg-transparent px-1.5"><Button size="xs">Go</Button></InputAddon>
      </InputGroup>
    </div>
  );
}
