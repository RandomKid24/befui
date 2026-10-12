import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { ArrowLeftIcon, HomeIcon } from '@/components/ui/icons';
import { SearchInput } from '@/components/ui/search-input';

/** Full-page 404 with a search box and two ways out. Swap the code and copy for 403 or 500. */
export default function NotFoundPage() {
  const [q, setQ] = React.useState('');
  return (
    <div className="grid min-h-[420px] place-items-center rounded-xl border bg-background">
      <ErrorState code={404} title="We can't find that page" description="The link may be broken, or the page may have moved.">
        <div className="mb-2 w-full"><SearchInput value={q} onValueChange={setQ} placeholder="Search the docs" /></div>
        <Button variant="outline" onClick={() => history.back()}><ArrowLeftIcon /> Go back</Button>
        <Button asChild><a href="/"><HomeIcon /> Home</a></Button>
      </ErrorState>
    </div>
  );
}
