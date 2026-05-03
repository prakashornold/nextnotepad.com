import { useMemo, useState } from 'react';

type Field = { min: number; max: number; name: string };
const FIELDS: Field[] = [
  { name: 'minute', min: 0, max: 59 },
  { name: 'hour', min: 0, max: 23 },
  { name: 'day of month', min: 1, max: 31 },
  { name: 'month', min: 1, max: 12 },
  { name: 'day of week', min: 0, max: 6 },
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseField(expr: string, f: Field): number[] | string {
  if (expr === '*') return [];
  const out = new Set<number>();
  for (const part of expr.split(',')) {
    let step = 1;
    let range = part;
    const slash = part.split('/');
    if (slash.length === 2) { range = slash[0]; step = parseInt(slash[1]); }
    let lo = f.min, hi = f.max;
    if (range !== '*') {
      const [a, b] = range.split('-').map(n => parseInt(n));
      lo = a;
      hi = b !== undefined ? b : a;
      if (isNaN(a)) return 'invalid';
      if (lo < f.min || hi > f.max || lo > hi) return 'out-of-range';
    }
    for (let i = lo; i <= hi; i += step) out.add(i);
  }
  return [...out].sort((a, b) => a - b);
}

function describe(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return 'Cron must have 5 fields: minute hour dom month dow';
  const parsed = parts.map((p, i) => parseField(p, FIELDS[i]));
  for (let i = 0; i < parsed.length; i++) {
    if (typeof parsed[i] === 'string') return `Invalid ${FIELDS[i].name}: ${parsed[i]}`;
  }
  const [min, hour, dom, mon, dow] = parsed as number[][];
  const fmt = (arr: number[], all: string, mapper?: (n: number) => string) => {
    if (arr.length === 0) return all;
    const m = mapper || ((n: number) => String(n));
    if (arr.length > 6) return `${arr.length} values`;
    return arr.map(m).join(', ');
  };
  const minS = fmt(min, 'every minute');
  const hourS = fmt(hour, 'every hour');
  const domS = fmt(dom, 'every day');
  const monS = fmt(mon, 'every month', n => MONTHS[n - 1]);
  const dowS = fmt(dow, 'every weekday', n => DAYS[n]);
  return `At ${minS === 'every minute' ? 'every minute' : `minute ${minS}`}, ${hourS === 'every hour' ? '' : `hour ${hourS}, `}on ${domS}, in ${monS}, on ${dowS}.`;
}

export default function CronTool() {
  const [expr, setExpr] = useState('*/5 * * * *');

  const description = useMemo(() => describe(expr), [expr]);
  const nextRuns = useMemo(() => computeNext(expr, 10), [expr]);

  const presets = [
    ['Every minute', '* * * * *'],
    ['Every 5 minutes', '*/5 * * * *'],
    ['Every hour', '0 * * * *'],
    ['Every day at midnight', '0 0 * * *'],
    ['Every Monday at 9am', '0 9 * * 1'],
    ['First day of month', '0 0 1 * *'],
  ];

  return (
    <div className="h-full overflow-auto p-3 scrollbar-thin" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <input className="tool-input mono" style={{ fontSize: 14 }} value={expr} onChange={e => setExpr(e.target.value)} placeholder="* * * * *" />
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {presets.map(([label, val]) => (
          <button key={val} className="tool-btn" onClick={() => setExpr(val)}>{label}</button>
        ))}
      </div>
      <div style={{ padding: 10, background: 'var(--bg-panel)', border: '1px solid var(--border-soft)', borderRadius: 3 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Description</div>
        <div style={{ fontSize: 12 }}>{description}</div>
      </div>
      <div style={{ padding: 10, border: '1px solid var(--border-soft)', borderRadius: 3 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Next 10 runs (local)</div>
        <pre className="mono" style={{ fontSize: 11, margin: 0 }}>{nextRuns.join('\n')}</pre>
      </div>
    </div>
  );
}

function computeNext(expr: string, count: number): string[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return ['(invalid expression)'];
  const sets = parts.map((p, i) => {
    const r = parseField(p, FIELDS[i]);
    if (typeof r === 'string') return null;
    return r.length ? r : null;
  });
  if (sets.some(s => s === undefined)) return ['(invalid expression)'];
  const inSet = (set: number[] | null, v: number) => !set || set.includes(v);

  const results: string[] = [];
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  let safety = 366 * 24 * 60;
  while (results.length < count && safety-- > 0) {
    if (
      inSet(sets[0], d.getMinutes()) &&
      inSet(sets[1], d.getHours()) &&
      inSet(sets[2], d.getDate()) &&
      inSet(sets[3], d.getMonth() + 1) &&
      inSet(sets[4], d.getDay())
    ) {
      results.push(d.toLocaleString());
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return results.length ? results : ['(no upcoming matches in next year)'];
}
