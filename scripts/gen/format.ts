// Readable HTML from renderToStaticMarkup output. Only breaks lines between element children (never inside text), so layout is unchanged.
const VOID = new Set(['input', 'img', 'br', 'hr', 'meta', 'link', 'source', 'wbr', 'col']);
export type Node = { tag: string; open: string; kids: Node[]; text?: string };

export function parse(html: string): Node[] {
  const root: Node = { tag: '', open: '', kids: [] };
  const stack = [root];
  for (const m of html.matchAll(/<!--[\s\S]*?-->|<\/?[\w:-]+(?:"[^"]*"|'[^']*'|[^'">])*>|[^<]+/g)) {
    const t = m[0];
    const top = stack[stack.length - 1]!;
    if (t.startsWith('</')) stack.pop();
    else if (t.startsWith('<!--') || !t.startsWith('<')) top.kids.push({ tag: '', open: '', kids: [], text: t });
    else {
      const name = /^<([\w:-]+)/.exec(t)![1]!;
      const n: Node = { tag: name, open: t, kids: [] };
      top.kids.push(n);
      if (!VOID.has(name) && !t.endsWith('/>')) stack.push(n);
    }
  }
  return root.kids;
}

function out(n: Node, depth: number, width: number): string {
  const pad = '  '.repeat(depth);
  if (n.text !== undefined) return n.text;
  const close = VOID.has(n.tag) || n.open.endsWith('/>') ? '' : `</${n.tag}>`;
  if (!n.kids.length) return n.open + close;
  const elementsOnly = n.kids.every((k) => k.text === undefined);
  const inline = n.open + n.kids.map((k) => out(k, 0, width)).join('') + close;
  if (!elementsOnly || (inline.length <= width && !inline.includes('\n'))) return inline;
  return `${n.open}\n${n.kids.map((k) => pad + '  ' + out(k, depth + 1, width)).join('\n')}\n${pad}${close}`;
}

export function format(html: string, width = 100) {
  return parse(html).map((n) => out(n, 0, width)).join('\n');
}

/** &quot; inside :json attributes -> single-quoted attribute with plain quotes, and ="" -> bare attribute. */
export function tidyAttrs(html: string) {
  // :json attributes read best single-quoted with plain quotes inside; a literal ' becomes &#39;
  return html.replace(/ ((?::|~)[\w-]+)="([^"]*)"/g, (all, name: string, v: string) => {
    if (!/&(quot|#x27|lt|gt|amp);/.test(v)) return all;
    const raw = v.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    return ` ${name}='${raw.replace(/&/g, '&amp;').replace(/'/g, '&#39;')}'`;
  });
}
