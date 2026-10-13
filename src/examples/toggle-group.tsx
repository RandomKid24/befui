import * as React from 'react';
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, ItalicIcon, UnderlineIcon } from '@/components/ui/icons';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function ToggleGroupDemo() {
  const [format, setFormat] = React.useState<string[]>(['bold']);
  const [align, setAlign] = React.useState('left');
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ToggleGroup type="multiple" variant="outline" size="icon" value={format} onValueChange={setFormat} aria-label="Text formatting">
        <ToggleGroupItem value="bold" aria-label="Bold"><BoldIcon /></ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic"><ItalicIcon /></ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline"><UnderlineIcon /></ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" size="icon" value={align} onValueChange={(v) => v && setAlign(v)} aria-label="Alignment">
        <ToggleGroupItem value="left" aria-label="Align left"><AlignLeftIcon /></ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center"><AlignCenterIcon /></ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right"><AlignRightIcon /></ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
