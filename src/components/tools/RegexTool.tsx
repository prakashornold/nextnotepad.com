import { useState, useMemo } from 'react';

export default function RegexTool() {
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Emails: hello@world.com, foo@bar.io. Not an email.');

  const { matches, error, highlighted } = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      const ms = [...text.matchAll(re)];
      let last = 0, html = '';
      for (const m of ms) {
        const start = m.index!;
        html += escapeHtml(text.slice(last, start));
        html += `<mark style="background:#BD93F9;color:#1e1e1e;padding:0 2px;border-radius:2px">${escapeHtml(m[0])}</mark>`;
        last = start + m[0].length;
      }
      html += escapeHtml(text.slice(last));
      return { matches: ms, error: '', highlighted: html };
    } catch (e: any) {
      return { matches: [], error: e.message, highlighted: escapeHtml(text) };
    }
  }, [pattern, flags, text]);

  return (
    <div className="h-full flex flex-col gap-2 p-3">
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-[12px] text-[#bfbfbf]">Pattern</label>
        <input className="tool-input mono flex-1 min-w-[200px]" value={pattern} onChange={e => setPattern(e.target.value)} />
        <label className="text-[12px] text-[#bfbfbf]">Flags</label>
        <input className="tool-input mono w-20" value={flags} onChange={e => setFlags(e.target.value)} />
      </div>
      {error && <div className="text-[#ff6b6b] text-[12px]">{error}</div>}
      <div className="flex-1 grid grid-cols-2 gap-2 min-h-0">
        <textarea className="tool-textarea mono scrollbar-thin" value={text} onChange={e => setText(e.target.value)} />
        <div className="tool-textarea mono scrollbar-thin overflow-auto whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
      <div className="text-[12px] text-[#bfbfbf]">
        Matches: <b className="text-[#BD93F9]">{matches.length}</b>
        {matches.slice(0, 10).map((m, i) => (
          <span key={i} className="ml-3 mono text-[#50fa7b]">"{m[0]}"</span>
        ))}
      </div>
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
