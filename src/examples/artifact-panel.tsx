import { ArtifactPanel } from '@/components/ui/artifact-panel';

const code = `export function Greeting({ name }: { name: string }) {
  return <h1 className="text-2xl font-semibold">Hello, {name}</h1>;
}
`;

export default function ArtifactPanelDemo() {
  return (
    <ArtifactPanel className="h-80" title="Greeting component" language="tsx" filename="greeting.tsx" code={code}>
      <h1 className="text-2xl font-semibold">Hello, Aarav</h1>
    </ArtifactPanel>
  );
}
