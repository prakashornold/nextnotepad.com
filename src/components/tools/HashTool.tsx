import { useEffect, useState } from 'react';

const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

async function digest(algo: string, data: string) {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(data));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmac(algo: string, secret: string, data: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: algo }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashTool() {
  const [input, setInput] = useState('Hello NextNotepad!');
  const [mode, setMode] = useState<'hash' | 'hmac'>('hash');
  const [secret, setSecret] = useState('secret');
  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const r: Record<string, string> = {};
      for (const a of ALGOS) {
        try { r[a] = mode === 'hash' ? await digest(a, input) : await hmac(a, secret, input); }
        catch (e: any) { r[a] = e.message; }
      }
      setResults(r);
    })();
  }, [input, mode, secret]);

  return (
    <div className="h-full flex flex-col gap-2 p-3">
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <select className="tool-input" value={mode} onChange={e => setMode(e.target.value as any)}>
          <option value="hash">Hash</option>
          <option value="hmac">HMAC</option>
        </select>
        {mode === 'hmac' && (
          <input className="tool-input" placeholder="secret" value={secret} onChange={e => setSecret(e.target.value)} style={{ width: 200 }} />
        )}
      </div>
      <textarea className="tool-textarea scrollbar-thin" style={{ minHeight: 90 }} value={input} onChange={e => setInput(e.target.value)} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ALGOS.map(a => (
          <div key={a} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ width: 80, fontSize: 11, fontWeight: 600 }}>{a}</span>
            <input className="tool-input mono" style={{ flex: 1, fontSize: 11 }} readOnly value={results[a] || ''} />
            <button className="tool-btn" onClick={() => results[a] && navigator.clipboard.writeText(results[a])}>Copy</button>
          </div>
        ))}
      </div>
    </div>
  );
}
