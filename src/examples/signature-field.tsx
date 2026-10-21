import * as React from 'react';
import { SignatureField } from '@/components/ui/signature-field';

export default function SignatureFieldDemo() {
  const [png, setPng] = React.useState<string | null>(null);
  return (
    <div className="grid w-96 max-w-full gap-2">
      <SignatureField onChange={setPng} />
      <p className="text-xs text-muted-foreground">{png ? `Captured a ${Math.round(png.length / 1024)} KB PNG.` : 'Nothing signed yet.'}</p>
    </div>
  );
}
