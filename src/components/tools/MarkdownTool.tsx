import { useState, useMemo } from 'react';

function md(s: string): string {
  let h = escapeHtml(s);
  h = h.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  h = h.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  h = h.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/\*(.+?)\*/g, '<em>$1</em>');
  h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
  h = h.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  h = h.replace(/^- (.*$)/gm, '<li>$1</li>');
  h = h.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  h = h.replace(/\n{2,}/g, '</p><p>');
  return '<p>' + h + '</p>';
}
function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
}

export default function MarkdownTool() {
  const [text, setText] = useState('# NextNotepad\n\n**Welcome** to the _Markdown_ preview.\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n`inline code` and [a link](https://example.com).');
  const html = useMemo(() => md(text), [text]);
  return (
    <div className="h-full grid grid-cols-2 gap-2 p-3 min-h-0">
      <textarea className="tool-textarea mono scrollbar-thin" value={text} onChange={e => setText(e.target.value)} />
      <div className="tool-textarea scrollbar-thin overflow-auto prose prose-invert" style={{ fontFamily: 'system-ui' }}>
        <div className="md-preview" dangerouslySetInnerHTML={{ __html: html }} />
        <style>{`
          .md-preview h1 { font-size: 22px; color: #BD93F9; margin: 6px 0; }
          .md-preview h2 { font-size: 18px; color: #8be9fd; margin: 6px 0; }
          .md-preview h3 { font-size: 15px; color: #50fa7b; margin: 6px 0; }
          .md-preview p { margin: 8px 0; line-height: 1.55; }
          .md-preview code { background: #2d2d2d; padding: 2px 5px; border-radius: 3px; color: #f1fa8c; }
          .md-preview ul { padding-left: 20px; list-style: disc; }
          .md-preview a { color: #8be9fd; text-decoration: underline; }
          .md-preview strong { color: #fff; }
        `}</style>
      </div>
    </div>
  );
}
