import { useState } from 'react';

async function sha(algo: string, s: string) {
  const buf = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest(algo, buf);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function EncodeTool() {
  const [input, setInput] = useState('Hello NextNotepad!');
  const [output, setOutput] = useState('');

  const ops: { label: string; fn: () => void | Promise<void> }[] = [
    { label: 'Base64 Encode', fn: () => setOutput(btoa(unescape(encodeURIComponent(input)))) },
    { label: 'Base64 Decode', fn: () => { try { setOutput(decodeURIComponent(escape(atob(input)))); } catch { setOutput('Invalid base64'); } } },
    { label: 'URL Encode', fn: () => setOutput(encodeURIComponent(input)) },
    { label: 'URL Decode', fn: () => { try { setOutput(decodeURIComponent(input)); } catch { setOutput('Invalid URL'); } } },
    { label: 'HTML Encode', fn: () => setOutput(input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')) },
    { label: 'HTML Decode', fn: () => { const d = document.createElement('div'); d.innerHTML = input; setOutput(d.textContent || ''); } },
    { label: 'Hex Encode', fn: () => setOutput([...input].map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')) },
    { label: 'Hex Decode', fn: () => { try { setOutput(input.match(/.{1,2}/g)!.map(h => String.fromCharCode(parseInt(h, 16))).join('')); } catch { setOutput('Invalid hex'); } } },
    { label: 'MD5', fn: async () => setOutput('MD5 not available in browser crypto') },
    { label: 'SHA-1', fn: async () => setOutput(await sha('SHA-1', input)) },
    { label: 'SHA-256', fn: async () => setOutput(await sha('SHA-256', input)) },
    { label: 'SHA-512', fn: async () => setOutput(await sha('SHA-512', input)) },
    { label: 'JWT Decode', fn: () => {
      try {
        const [h, p] = input.split('.');
        const dec = (s: string) => JSON.parse(atob(s.replace(/-/g, '+').replace(/_/g, '/')));
        setOutput(JSON.stringify({ header: dec(h), payload: dec(p) }, null, 2));
      } catch { setOutput('Invalid JWT'); }
    } },
  ];

  return (
    <div className="h-full flex flex-col gap-2 p-3">
      <div className="flex items-center gap-1.5 flex-wrap">
        {ops.map(o => (
          <button key={o.label} className="tool-btn" onClick={o.fn}>{o.label}</button>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2 min-h-0">
        <textarea className="tool-textarea mono scrollbar-thin" value={input} onChange={e => setInput(e.target.value)} />
        <textarea className="tool-textarea mono scrollbar-thin" value={output} readOnly />
      </div>
    </div>
  );
}
