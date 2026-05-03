import { useEffect, useState } from 'react';

export default function TimestampTool() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [input, setInput] = useState(String(Math.floor(Date.now() / 1000)));
  const [iso, setIso] = useState(new Date().toISOString().slice(0, 19));

  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const asNum = Number(input);
  const tsDate = Number.isFinite(asNum)
    ? new Date(asNum > 1e12 ? asNum : asNum * 1000)
    : null;

  const isoDate = (() => { try { return new Date(iso); } catch { return null; } })();

  const row = (label: string, v: string) => (
    <div style={{ display: 'flex', gap: 8, padding: '2px 0' }}>
      <span style={{ width: 160, color: 'var(--fg-muted)', fontSize: 11 }}>{label}</span>
      <span className="mono" style={{ fontSize: 11, userSelect: 'text' }}>{v}</span>
    </div>
  );

  return (
    <div className="h-full overflow-auto p-3 scrollbar-thin" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ border: '1px solid var(--border-soft)', borderRadius: 3, padding: 10, background: 'var(--bg-panel)' }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Current time</div>
        {row('Unix (seconds)', String(now))}
        {row('Unix (ms)', String(now * 1000))}
        {row('ISO 8601 UTC', new Date(now * 1000).toISOString())}
        {row('RFC 2822', new Date(now * 1000).toUTCString())}
        {row('Local', new Date(now * 1000).toString())}
      </div>

      <div style={{ border: '1px solid var(--border-soft)', borderRadius: 3, padding: 10 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Unix timestamp to date</div>
        <input className="tool-input mono" style={{ width: '100%' }} value={input} onChange={e => setInput(e.target.value)} placeholder="seconds or milliseconds" />
        {tsDate && !isNaN(tsDate.getTime()) && (
          <div style={{ marginTop: 8 }}>
            {row('ISO 8601 UTC', tsDate.toISOString())}
            {row('Local', tsDate.toString())}
            {row('Relative', relative(tsDate.getTime() - Date.now()))}
          </div>
        )}
      </div>

      <div style={{ border: '1px solid var(--border-soft)', borderRadius: 3, padding: 10 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Date to Unix</div>
        <input className="tool-input mono" style={{ width: '100%' }} value={iso} onChange={e => setIso(e.target.value)} placeholder="YYYY-MM-DDTHH:mm:ss" />
        {isoDate && !isNaN(isoDate.getTime()) && (
          <div style={{ marginTop: 8 }}>
            {row('Unix (seconds)', String(Math.floor(isoDate.getTime() / 1000)))}
            {row('Unix (ms)', String(isoDate.getTime()))}
            {row('ISO 8601 UTC', isoDate.toISOString())}
          </div>
        )}
      </div>
    </div>
  );
}

function relative(ms: number): string {
  const abs = Math.abs(ms);
  const units: [number, string][] = [
    [60_000, 'second'], [3_600_000, 'minute'], [86_400_000, 'hour'],
    [2_592_000_000, 'day'], [31_536_000_000, 'month'], [Infinity, 'year'],
  ];
  const divs: [number, string][] = [
    [1000, 'second'], [60_000, 'minute'], [3_600_000, 'hour'],
    [86_400_000, 'day'], [2_592_000_000, 'month'], [31_536_000_000, 'year'],
  ];
  let pick = divs[0];
  for (let i = 0; i < units.length; i++) { if (abs < units[i][0]) { pick = divs[i]; break; } }
  const n = Math.round(abs / pick[0]);
  const label = `${n} ${pick[1]}${n === 1 ? '' : 's'}`;
  return ms >= 0 ? `in ${label}` : `${label} ago`;
}
