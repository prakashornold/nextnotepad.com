import { useState } from 'react';

const UP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LO = 'abcdefghijklmnopqrstuvwxyz';
const NUM = '0123456789';
const SYM = '!@#$%^&*()-_=+[]{};:,.<>?/~';

export default function PasswordTool() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [num, setNum] = useState(true);
  const [sym, setSym] = useState(true);
  const [excludeAmbig, setExcludeAmbig] = useState(false);
  const [count, setCount] = useState(5);
  const [out, setOut] = useState('');

  const generate = () => {
    let pool = '';
    if (upper) pool += UP;
    if (lower) pool += LO;
    if (num) pool += NUM;
    if (sym) pool += SYM;
    if (excludeAmbig) pool = pool.replace(/[0OIl1]/g, '');
    if (!pool) { setOut(''); return; }
    const lines: string[] = [];
    for (let i = 0; i < count; i++) {
      const bytes = crypto.getRandomValues(new Uint32Array(length));
      let s = '';
      for (let j = 0; j < length; j++) s += pool[bytes[j] % pool.length];
      lines.push(s);
    }
    setOut(lines.join('\n'));
  };

  const entropy = Math.floor(length * Math.log2(
    (upper ? 26 : 0) + (lower ? 26 : 0) + (num ? 10 : 0) + (sym ? SYM.length : 0) || 1
  ));

  return (
    <div className="h-full flex flex-col gap-2 p-3">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ fontSize: 11 }}>Length</label>
        <input type="range" min={4} max={128} value={length} onChange={e => setLength(parseInt(e.target.value))} style={{ flex: 1, minWidth: 120 }} />
        <span className="mono" style={{ fontSize: 11, width: 30 }}>{length}</span>
        <label style={{ fontSize: 11 }}>Count</label>
        <input className="tool-input" type="number" min={1} max={100} value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} style={{ width: 60 }} />
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 11 }}>
        <label><input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} /> Uppercase</label>
        <label><input type="checkbox" checked={lower} onChange={e => setLower(e.target.checked)} /> Lowercase</label>
        <label><input type="checkbox" checked={num} onChange={e => setNum(e.target.checked)} /> Numbers</label>
        <label><input type="checkbox" checked={sym} onChange={e => setSym(e.target.checked)} /> Symbols</label>
        <label><input type="checkbox" checked={excludeAmbig} onChange={e => setExcludeAmbig(e.target.checked)} /> No ambiguous (0/O/I/l/1)</label>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <button className="tool-btn primary" onClick={generate}>Generate</button>
        <button className="tool-btn" onClick={() => navigator.clipboard.writeText(out)} disabled={!out}>Copy</button>
        <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Entropy: ~{entropy} bits</span>
      </div>
      <textarea className="tool-textarea mono scrollbar-thin" style={{ flex: 1 }} value={out} readOnly />
    </div>
  );
}
