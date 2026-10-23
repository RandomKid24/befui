import { Markdown } from '@/components/ui/markdown';

const text = `# Release notes

Version **2.4** ships today. It adds *offline mode* and fixes the \`sync\` bug reported in [issue 482](https://example.com/issues/482).

## What changed
- Faster startup, about **40%** quicker
- New \`--watch\` flag for the CLI
- Dark mode follows the system

1. Update the package
2. Run the migration
3. Restart the app

> Heads up: the old config format is read-only from now on.

\`\`\`bash
npm install acme@2.4
acme migrate --dry-run
\`\`\`
`;

export default function MarkdownDemo() {
  return <Markdown className="w-[36rem] max-w-full">{text}</Markdown>;
}
