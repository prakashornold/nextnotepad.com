import { useState } from 'react';

function uuidv4() {
  return (crypto as any).randomUUID ? (crypto as any).randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function nanoid(len = 21) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  let s = '';
  for (const b of bytes) s += alphabet[b % alphabet.length];
  return s;
}

export default function UuidTool() {
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<'uuid' | 'nanoid' | 'guid-upper' | 'uuid-no-dash'>('uuid');
  const [output, setOutput] = useState('');

  const generate = () => {
    const n = Math.max(1, Math.min(500, count));
    const lines: string[] = [];
    for (let i = 0; i < n; i++) {
      let v = uuidv4();
      if (format === 'nanoid') v = nanoid(21);
      else if (format === 'guid-upper') v = `{${v.toUpperCase()}}`;
      else if (format === 'uuid-no-dash') v = v.replace(/-/g, '');
      lines.push(v);
    }
    setOutput(lines.join('\n'));
  };

  return (
    <div className="h-full flex flex-col gap-2 p-3">
      <div className="flex gap-2 items-center flex-wrap">
        <label style={{ fontSize: 11 }}>Format</label>
        <select className="tool-input" value={format} onChange={e => setFormat(e.target.value as any)}>
          <option value="uuid">UUID v4</option>
          <option value="uuid-no-dash">UUID v4 (no dashes)</option>
          <option value="guid-upper">GUID {'{UPPER}'}</option>
          <option value="nanoid">NanoID</option>
        </select>
        <label style={{ fontSize: 11 }}>Count</label>
        <input className="tool-input" type="number" min={1} max={500} value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} style={{ width: 70 }} />
        <button className="tool-btn primary" onClick={generate}>Generate</button>
        <button className="tool-btn" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>Copy</button>
      </div>
      <textarea className="tool-textarea mono scrollbar-thin" style={{ flex: 1 }} value={output} readOnly placeholder="Press Generate..." />
    </div>
  );
}
