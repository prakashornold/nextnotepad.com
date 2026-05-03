import { useState } from 'react';

export default function JsonTool() {
  const [input, setInput] = useState('{"hello":"world","numbers":[1,2,3]}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const run = (mode: 'format' | 'minify' | 'validate') => {
    setError(''); setOutput('');
    try {
      const p = JSON.parse(input);
      if (mode === 'format') setOutput(JSON.stringify(p, null, indent));
      else if (mode === 'minify') setOutput(JSON.stringify(p));
      else setOutput('Valid JSON');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="h-full flex flex-col gap-2 p-3">
      <div className="flex items-center gap-2 flex-wrap">
        <button className="tool-btn primary" onClick={() => run('format')}>Format</button>
        <button className="tool-btn" onClick={() => run('minify')}>Minify</button>
        <button className="tool-btn" onClick={() => run('validate')}>Validate</button>
        <label className="text-[12px] text-[#bfbfbf] ml-2">Indent</label>
        <select className="tool-select" value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
          <option value={2}>2</option><option value={4}>4</option><option value={8}>8</option>
        </select>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2 min-h-0">
        <textarea className="tool-textarea mono scrollbar-thin" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JSON..." />
        <textarea className="tool-textarea mono scrollbar-thin" value={error || output} readOnly style={{ color: error ? '#ff6b6b' : undefined }} />
      </div>
    </div>
  );
}
