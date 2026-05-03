import { useState } from 'react';

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function rand(max: number) { return Math.floor(Math.random() * max); }
function word() { return WORDS[rand(WORDS.length)]; }
function sentence() {
  const len = 5 + rand(12);
  const s = Array.from({ length: len }, word).join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}
function paragraph() {
  const len = 3 + rand(5);
  return Array.from({ length: len }, sentence).join(' ');
}

export default function LoremTool() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [out, setOut] = useState('');

  const generate = () => {
    if (type === 'words') setOut(Array.from({ length: count }, word).join(' '));
    else if (type === 'sentences') setOut(Array.from({ length: count }, sentence).join(' '));
    else setOut(Array.from({ length: count }, paragraph).join('\n\n'));
  };

  return (
    <div className="h-full flex flex-col gap-2 p-3">
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <select className="tool-input" value={type} onChange={e => setType(e.target.value as any)}>
          <option value="paragraphs">Paragraphs</option>
          <option value="sentences">Sentences</option>
          <option value="words">Words</option>
        </select>
        <input className="tool-input" type="number" min={1} max={200} value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} style={{ width: 70 }} />
        <button className="tool-btn primary" onClick={generate}>Generate</button>
        <button className="tool-btn" onClick={() => navigator.clipboard.writeText(out)} disabled={!out}>Copy</button>
      </div>
      <textarea className="tool-textarea scrollbar-thin" style={{ flex: 1 }} value={out} readOnly />
    </div>
  );
}
