import { useState } from 'react';

function formatXml(xml: string, indent = 2): string {
  const PADDING = ' '.repeat(indent);
  const reg = /(>)(<)(\/*)/g;
  let formatted = '';
  let pad = 0;
  xml.replace(reg, '$1\r\n$2$3').split('\r\n').forEach((node) => {
    let i = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) i = 0;
    else if (node.match(/^<\/\w/)) { if (pad > 0) pad -= 1; }
    else if (node.match(/^<\w[^>]*[^/]>.*$/)) i = 1;
    else i = 0;
    formatted += PADDING.repeat(pad) + node + '\n';
    pad += i;
  });
  return formatted.trim();
}

export default function XmlTool() {
  const [input, setInput] = useState('<root><item id="1">Hello</item></root>');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const validate = (s: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(s, 'application/xml');
    const err = doc.getElementsByTagName('parsererror')[0];
    if (err) throw new Error(err.textContent || 'Invalid XML');
    return doc;
  };

  const run = (mode: string) => {
    setError(''); setOutput('');
    try {
      if (mode === 'format') { validate(input); setOutput(formatXml(input)); }
      else if (mode === 'minify') { validate(input); setOutput(input.replace(/>\s+</g, '><').trim()); }
      else if (mode === 'validate') { validate(input); setOutput('Valid XML'); }
      else if (mode === 'toJson') {
        const doc = validate(input);
        const toObj = (node: Element): any => {
          const o: any = {};
          for (const a of Array.from(node.attributes)) o['@' + a.name] = a.value;
          for (const c of Array.from(node.children)) {
            const v = toObj(c);
            if (o[c.tagName]) { if (!Array.isArray(o[c.tagName])) o[c.tagName] = [o[c.tagName]]; o[c.tagName].push(v); }
            else o[c.tagName] = v;
          }
          if (!node.children.length && node.textContent) return node.textContent;
          return o;
        };
        setOutput(JSON.stringify({ [doc.documentElement.tagName]: toObj(doc.documentElement) }, null, 2));
      }
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div className="h-full flex flex-col gap-2 p-3">
      <div className="flex items-center gap-2 flex-wrap">
        <button className="tool-btn primary" onClick={() => run('format')}>Beautify</button>
        <button className="tool-btn" onClick={() => run('minify')}>Minify</button>
        <button className="tool-btn" onClick={() => run('validate')}>Validate</button>
        <button className="tool-btn" onClick={() => run('toJson')}>XML to JSON</button>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2 min-h-0">
        <textarea className="tool-textarea mono scrollbar-thin" value={input} onChange={(e) => setInput(e.target.value)} />
        <textarea className="tool-textarea mono scrollbar-thin" value={error || output} readOnly style={{ color: error ? '#ff6b6b' : undefined }} />
      </div>
    </div>
  );
}
