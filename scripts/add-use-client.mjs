// Adds 'use client' to every component and block that needs it and lacks it. Safe to re-run.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { hasDirective, needsClient } from './use-client.mjs';

let changed = 0;
for (const dir of ['src/components/ui', 'src/blocks']) {
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.tsx')) continue;
    const path = `${dir}/${f}`;
    const src = readFileSync(path, 'utf8');
    if (needsClient(src) && !hasDirective(src)) {
      writeFileSync(path, `'use client';\n\n${src}`);
      changed++;
    }
  }
}
console.log(`use client: added to ${changed} file${changed === 1 ? '' : 's'}`);
