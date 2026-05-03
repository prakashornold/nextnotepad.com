import { useState, useMemo } from 'react';

export default function TextTool() {
  const [text, setText] = useState('Hello World\nThis is a sample text.\nTry transforming it.');

  const stats = useMemo(() => {
    const chars = text.length;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const lines = text.split('\n').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    return { chars, words, lines, sentences };
  }, [text]);

  const ops: { label: string; fn: (s: string) => string }[] = [
    { label: 'UPPER', fn: s => s.toUpperCase() },
    { label: 'lower', fn: s => s.toLowerCase() },
    { label: 'Title Case', fn: s => s.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()) },
    { label: 'camelCase', fn: s => s.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
    { label: 'snake_case', fn: s => s.trim().replace(/\s+/g, '_').toLowerCase() },
    { label: 'kebab-case', fn: s => s.trim().replace(/\s+/g, '-').toLowerCase() },
    { label: 'Sort A-Z', fn: s => s.split('\n').sort().join('\n') },
    { label: 'Sort Z-A', fn: s => s.split('\n').sort().reverse().join('\n') },
    { label: 'Reverse Lines', fn: s => s.split('\n').reverse().join('\n') },
    { label: 'Shuffle', fn: s => s.split('\n').sort(() => Math.random() - 0.5).join('\n') },
    { label: 'Dedupe', fn: s => [...new Set(s.split('\n'))].join('\n') },
    { label: 'Trim', fn: s => s.split('\n').map(l => l.trim()).join('\n') },
    { label: 'Remove Empty', fn: s => s.split('\n').filter(l => l.trim()).join('\n') },
    { label: 'Number Lines', fn: s => s.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n') },
    { label: 'Reverse Text', fn: s => [...s].reverse().join('') },
    { label: 'Remove HTML', fn: s => s.replace(/<[^>]+>/g, '') },
    { label: 'Slug', fn: s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') },
  ];

  return (
    <div className="h-full flex flex-col gap-2 p-3">
      <div className="flex items-center gap-1.5 flex-wrap">
        {ops.map(o => (
          <button key={o.label} className="tool-btn" onClick={() => setText(o.fn(text))}>{o.label}</button>
        ))}
      </div>
      <textarea className="tool-textarea mono scrollbar-thin flex-1" value={text} onChange={e => setText(e.target.value)} />
      <div className="flex gap-4 text-[12px] text-[#bfbfbf]">
        <span>Chars: <b className="text-[#BD93F9]">{stats.chars}</b></span>
        <span>Words: <b className="text-[#BD93F9]">{stats.words}</b></span>
        <span>Lines: <b className="text-[#BD93F9]">{stats.lines}</b></span>
        <span>Sentences: <b className="text-[#BD93F9]">{stats.sentences}</b></span>
      </div>
    </div>
  );
}
