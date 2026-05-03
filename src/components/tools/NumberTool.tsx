import { useState } from 'react';

export default function NumberTool() {
  const [val, setVal] = useState('255');
  const [base, setBase] = useState(10);
  const num = parseInt(val, base);
  const ok = !isNaN(num);

  const [ts, setTs] = useState(Math.floor(Date.now() / 1000).toString());
  const tsNum = parseInt(ts, 10);
  const tsOk = !isNaN(tsNum);
  const date = tsOk ? new Date(tsNum * 1000) : null;

  return (
    <div className="h-full flex flex-col gap-4 p-3 overflow-auto scrollbar-thin">
      <section>
        <h3 className="text-[13px] text-[#BD93F9] mb-2 font-semibold">Number Base Converter</h3>
        <div className="flex gap-2 items-center mb-2">
          <input className="tool-input mono w-48" value={val} onChange={e => setVal(e.target.value)} />
          <select className="tool-select" value={base} onChange={e => setBase(Number(e.target.value))}>
            <option value={2}>Binary</option>
            <option value={8}>Octal</option>
            <option value={10}>Decimal</option>
            <option value={16}>Hex</option>
          </select>
        </div>
        {ok && (
          <div className="grid grid-cols-4 gap-2 text-[12px]">
            <Card label="Binary" value={num.toString(2)} />
            <Card label="Octal" value={num.toString(8)} />
            <Card label="Decimal" value={num.toString(10)} />
            <Card label="Hex" value={num.toString(16).toUpperCase()} />
          </div>
        )}
      </section>

      <section>
        <h3 className="text-[13px] text-[#BD93F9] mb-2 font-semibold">Unix Timestamp Converter</h3>
        <div className="flex gap-2 items-center mb-2">
          <input className="tool-input mono w-48" value={ts} onChange={e => setTs(e.target.value)} />
          <button className="tool-btn" onClick={() => setTs(Math.floor(Date.now() / 1000).toString())}>Now</button>
        </div>
        {tsOk && date && (
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <Card label="ISO" value={date.toISOString()} />
            <Card label="Local" value={date.toString()} />
          </div>
        )}
      </section>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#1e1e1e] p-2 rounded border border-[#3c3c3c]">
      <div className="text-[#bfbfbf] text-[11px]">{label}</div>
      <div className="mono text-[#BD93F9] break-all">{value}</div>
    </div>
  );
}
