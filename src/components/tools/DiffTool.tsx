import { useState, useMemo } from 'react';

function diffLines(a: string, b: string) {
  const al = a.split('\n'), bl = b.split('\n');
  const out: { type: 'eq' | 'add' | 'del'; text: string }[] = [];
  let i = 0, j = 0;
  while (i < al.length || j < bl.length) {
    if (al[i] === bl[j]) { out.push({ type: 'eq', text: al[i] || '' }); i++; j++; }
    else if (j < bl.length && !al.includes(bl[j], i)) { out.push({ type: 'add', text: bl[j] }); j++; }
    else if (i < al.length && !bl.includes(al[i], j)) { out.push({ type: 'del', text: al[i] }); i++; }
    else { out.push({ type: 'del', text: al[i] || '' }); out.push({ type: 'add', text: bl[j] || '' }); i++; j++; }
  }
  return out;
}

export default function DiffTool() {
  const [left, setLeft] = useState('Line one\nLine two\nLine three');
  const [right, setRight] = useState('Line one\nLine TWO\nLine three\nLine four');
  const result = useMemo(() => diffLines(left, right), [left, right]);

  return (
    <div className="h-full flex flex-col gap-2 p-3">
      <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
        <textarea className="tool-textarea mono scrollbar-thin" value={left} onChange={e => setLeft(e.target.value)} placeholder="Original..." />
        <textarea className="tool-textarea mono scrollbar-thin" value={right} onChange={e => setRight(e.target.value)} placeholder="Modified..." />
      </div>
      <div className="flex-1 bg-[#1e1e1e] border border-[#3c3c3c] rounded overflow-auto scrollbar-thin mono text-[12.5px] min-h-0">
        {result.map((r, i) => (
          <div key={i} className="flex px-2" style={{
            background: r.type === 'add' ? 'rgba(80,250,123,0.12)' : r.type === 'del' ? 'rgba(255,85,85,0.15)' : 'transparent',
            color: r.type === 'add' ? '#50fa7b' : r.type === 'del' ? '#ff5555' : '#d4d4d4',
          }}>
            <span className="w-5 opacity-60">{r.type === 'add' ? '+' : r.type === 'del' ? '-' : ' '}</span>
            <span className="whitespace-pre">{r.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
