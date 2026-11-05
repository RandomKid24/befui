import * as React from 'react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/ui/copy-button';
import { Reveal } from '@/components/ui/reveal';
import agentsSnippet from '../../scripts/agents-snippet.md?raw';
import { CodeBlock, Command } from './code';

const RAW = 'https://raw.githubusercontent.com/RandomKid24/befui/main/public';

const prompts = [
  ['Build a screen', 'Build a leave-approvals page with befui components. Check llms-full.txt first and add what is missing with the befui CLI.'],
  ['Swap in befui', 'Replace the hand-written buttons, inputs and tables in this project with the matching befui components. Add them with the CLI.'],
  ['Rebrand', 'Change the befui theme to use #7c3aed as the primary color. Edit the CSS variables only.'],
];

function UrlRow({ label, url }: { label: string; url: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border bg-muted/60 py-1.5 pl-3 pr-1.5">
      <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground">{label}</span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[12.5px]">{url}</code>
      <CopyButton value={url} className="size-7 shrink-0 border-transparent bg-transparent" />
    </div>
  );
}

export function AiPage() {
  const h2 = 'mt-12 mb-3 scroll-mt-20 text-xl font-semibold tracking-tight';
  return (
    <article className="max-w-3xl">
      <Reveal>
        <Badge variant="outline" className="mb-4">For Claude Code, Cursor, Copilot and friends</Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Use befui with AI</h1>
        <p className="mt-3 text-muted-foreground">
          Your agent should never retype a component. Give it the catalog and the CLI, and it reuses what exists, adds what is missing, and keeps the look consistent.
        </p>
      </Reveal>

      <h2 className={h2}>1. Run init once</h2>
      <p className="mb-3 text-[13px] text-muted-foreground">Adds the theme and helper, writes the befui rules into <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">AGENTS.md</code>, and registers the befui MCP server in <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">.mcp.json</code>. Restart your AI tool afterwards so it picks the server up.</p>
      <Command>npx github:RandomKid24/befui init</Command>
      <p className="mt-3 text-[13px] text-muted-foreground">Claude Code reads <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">CLAUDE.md</code>, so put <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">@AGENTS.md</code> in it. Cursor and Copilot pick up <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">AGENTS.md</code> directly.</p>

      <h2 className={h2}>The MCP server</h2>
      <p className="mb-3 text-[13px] text-muted-foreground">Connected agents get three tools, so they read the real source instead of guessing props. Add <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">add_components</code> with <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">all</code> to copy the whole library.</p>
      <div className="grid gap-2 text-sm">
        {[['list_components', 'Browse or search every component and block.'], ['get_component', 'Exact source, import path, npm packages and a working example.'], ['add_components', 'Copy components (and what they need) into the project and install packages.']].map(([n, d]) => (
          <div key={n} className="rounded-lg border bg-card px-3 py-2"><code className="font-mono text-[12.5px]">{n}</code><span className="text-muted-foreground"> · {d}</span></div>
        ))}
      </div>
      <p className="mt-3 text-[13px] text-muted-foreground">Not using <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">init</code>? Run <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">claude mcp add befui -- npx -y github:RandomKid24/befui mcp</code>, or add the same command to your tool's MCP config.</p>

      <h2 className={h2}>2. Just ask</h2>
      <p className="mb-3 text-[13px] text-muted-foreground">With the rules in place, plain requests work. A few to start with:</p>
      <div className="grid gap-2">
        {prompts.map(([t, p]) => (
          <div key={t} className="flex items-start gap-2 rounded-lg border bg-card py-2 pl-3 pr-1.5">
            <div className="min-w-0 flex-1"><p className="text-xs font-medium text-muted-foreground">{t}</p><p className="text-sm">{p}</p></div>
            <CopyButton value={p} className="size-7 shrink-0 border-transparent bg-transparent" />
          </div>
        ))}
      </div>

      <h2 className={h2}>The catalog, for agents</h2>
      <p className="mb-3 text-[13px] text-muted-foreground">Plain text, regenerated on every build. Point any tool at these, or paste a link into a chat.</p>
      <div className="grid gap-2">
        <UrlRow label="Short index" url={`${RAW}/llms.txt`} />
        <UrlRow label="Full + examples" url={`${RAW}/llms-full.txt`} />
      </div>
      <p className="mt-3 text-[13px] text-muted-foreground">The full file has every component with its import line, what it depends on and a working example.</p>

      <h2 className={h2}>The rules that get written</h2>
      <p className="mb-3 text-[13px] text-muted-foreground">This is what <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">init</code> puts in AGENTS.md. Paste it by hand into any rules file (<code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">.cursor/rules</code>, Copilot instructions) if you prefer.</p>
      <CodeBlock code={agentsSnippet} title="AGENTS.md" maxHeight={260} />

      <Alert variant="info" title="Keep it fresh" className="mt-12">
        The CLI always fetches the latest files from GitHub, so a new component is one <code className="font-mono text-xs">add</code> away. Re-running <code className="font-mono text-xs">init</code> refreshes the rules block without touching the rest of your AGENTS.md.
      </Alert>
    </article>
  );
}
