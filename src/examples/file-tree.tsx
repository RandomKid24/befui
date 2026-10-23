import * as React from 'react';
import { FileTree, type FileNode } from '@/components/ui/file-tree';

const files: FileNode[] = [
  { name: 'src', children: [
    { name: 'app', children: [{ name: 'page.tsx' }, { name: 'layout.tsx' }, { name: 'globals.css' }] },
    { name: 'components', children: [{ name: 'button.tsx' }, { name: 'card.tsx' }, { name: 'ui', children: [] }] },
    { name: 'lib', children: [{ name: 'utils.ts' }] },
  ] },
  { name: 'public', children: [{ name: 'logo.svg' }, { name: 'hero.png' }] },
  { name: 'package.json' },
  { name: 'README.md' },
  { name: 'tsconfig.json' },
];

export default function FileTreeDemo() {
  const [file, setFile] = React.useState('src/app/page.tsx');
  return (
    <div className="grid w-72 max-w-full gap-3">
      <FileTree className="rounded-xl border bg-card p-2" nodes={files} selected={file} onSelect={setFile} defaultOpen={['src', 'src/app']} />
      <p className="text-xs text-muted-foreground">Opened: <code>{file}</code></p>
    </div>
  );
}
