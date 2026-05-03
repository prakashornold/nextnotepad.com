import { useState } from 'react';

function beautifyHtml(s: string, indent = 2): string {
  const pad = ' '.repeat(indent);
  let depth = 0, out = '';
  s = s.replace(/>\s+</g, '><').trim();
  const tokens = s.split(/(<[^>]+>)/).filter(Boolean);
  for (const t of tokens) {
    if (t.startsWith('</')) { depth = Math.max(0, depth - 1); out += pad.repeat(depth) + t + '\n'; }
    else if (t.startsWith('<') && !t.endsWith('/>') && !/<(br|img|input|hr|meta|link)\b/i.test(t)) {
      out += pad.repeat(depth) + t + '\n'; depth++;
    } else if (t.startsWith('<')) {
      out += pad.repeat(depth) + t + '\n';
    } else {
      out += pad.repeat(depth) + t + '\n';
    }
  }
  return out.trim();
}

export default function HtmlTool() {
  const [input, setInput] = useState('<div><h1>Hello</h1><p>World</p></div>');
  const [output, setOutput] = useState('');

  return (
    <div className="h-full flex flex-col gap-2 p-3">
      <div className="flex gap-2 flex-wrap">
        <button className="tool-btn primary" onClick={() => setOutput(beautifyHtml(input))}>Beautify</button>
        <button className="tool-btn" onClick={() => setOutput(input.replace(/>\s+</g, '><').trim())}>Minify</button>
        <button className="tool-btn" onClick={() => { const d = document.createElement('div'); d.innerHTML = input; setOutput(d.textContent || ''); }}>Strip Tags</button>
        <button className="tool-btn" onClick={() => setOutput(input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'))}>Encode Entities</button>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2 min-h-0">
        <textarea className="tool-textarea mono scrollbar-thin" value={input} onChange={e => setInput(e.target.value)} />
        <textarea className="tool-textarea mono scrollbar-thin" value={output} readOnly />
      </div>
    </div>
  );
}
