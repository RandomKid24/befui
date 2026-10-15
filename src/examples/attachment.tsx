import * as React from 'react';
import { Attachment } from '@/components/ui/attachment';

export default function AttachmentDemo() {
  const [files, setFiles] = React.useState(['offer-letter-v3.pdf', 'org-chart.png']);
  const [pct, setPct] = React.useState(35);
  React.useEffect(() => {
    const id = setInterval(() => setPct((p) => (p >= 100 ? 8 : p + 9)), 700);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex flex-wrap gap-2">
      {files.map((f) => <Attachment key={f} name={f} size={f.endsWith('pdf') ? '248 KB' : '1.2 MB'} onRemove={() => setFiles((l) => l.filter((x) => x !== f))} />)}
      <Attachment name="payroll-october.xlsx" status="uploading" progress={pct} />
      <Attachment name="scan-0042.png" status="error" onRemove={() => {}} />
    </div>
  );
}
