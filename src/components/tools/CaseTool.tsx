import { useMemo, useState } from 'react';

function words(s: string): string[] {
  return s
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-\.\s]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export default function CaseTool() {
  const [input, setInput] = useState('Hello World Example Text');

  const out = useMemo(() => {
    const w = words(input);
    const lower = w.map(x => x.toLowerCase());
    return {
      camel: lower.map((x, i) => i === 0 ? x : x[0].toUpperCase() + x.slice(1)).join(''),
      pascal: lower.map(x => x[0].toUpperCase() + x.slice(1)).join(''),
      snake: lower.join('_'),
      'screaming-snake': lower.join('_').toUpperCase(),
      kebab: lower.join('-'),
      'screaming-kebab': lower.join('-').toUpperCase(),
      constant: lower.join('_').toUpperCase(),
      dot: lower.join('.'),
      path: lower.join('/'),
      title: lower.map(x => x[0].toUpperCase() + x.slice(1)).join(' '),
      sentence: (lower[0]?.[0]?.toUpperCase() || '') + lower.join(' ').slice(1),
      upper: input.toUpperCase(),
      lower: input.toLowerCase(),
      slug: lower.map(x => x.replace(/[^a-z0-9]+/g, '')).filter(Boolean).join('-'),
      reverse: [...input].reverse().join(''),
    };
  }, [input]);

  return (
    <div className="h-full overflow-auto p-3 scrollbar-thin" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <textarea className="tool-textarea" style={{ minHeight: 70 }} value={input} onChange={e => setInput(e.target.value)} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {Object.entries(out).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ width: 140, fontSize: 11, fontWeight: 600 }}>{k}</span>
            <input className="tool-input mono" style={{ flex: 1, fontSize: 11 }} readOnly value={v} />
            <button className="tool-btn" onClick={() => navigator.clipboard.writeText(v)}>Copy</button>
          </div>
        ))}
      </div>
    </div>
  );
}
