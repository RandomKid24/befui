import * as React from 'react';
import { brandColors, brandIcons } from '@/components/ui/brand-icons';
import { Toggle } from '@/components/ui/toggle';

const slug = (name: string) => name.replace(/Icon$/, '').replace(/Brand$/, '');

export default function BrandIconsDemo() {
  const [colour, setColour] = React.useState(false);
  return (
    <div className="grid w-full max-w-2xl gap-5">
      <Toggle variant="outline" pressed={colour} onPressedChange={setColour} className="justify-self-start">Brand colours</Toggle>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {Object.entries(brandIcons).map(([name, Icon]) => (
          <li key={name} className="grid justify-items-center gap-2 rounded-lg border p-3 text-xs text-muted-foreground">
            <Icon className="size-7 text-foreground" style={colour ? { color: brandColors[slug(name).toLowerCase()] } : undefined} />
            {slug(name)}
          </li>
        ))}
      </ul>
    </div>
  );
}
