import { useState } from 'react';
import { X } from 'lucide-react';

type Props = {
  mode: 'find' | 'replace';
  onClose: () => void;
  onFind: (q: string, opts: FindOpts) => number;
  onReplace: (q: string, r: string, opts: FindOpts) => void;
  onReplaceAll: (q: string, r: string, opts: FindOpts) => number;
};
export type FindOpts = { regex: boolean; matchCase: boolean; wholeWord: boolean; wrap: boolean };

export default function FindDialog({ mode: initial, onClose, onFind, onReplace, onReplaceAll }: Props) {
  const [mode, setMode] = useState<'find' | 'replace'>(initial);
  const [q, setQ] = useState('');
  const [r, setR] = useState('');
  const [opts, setOpts] = useState<FindOpts>({ regex: false, matchCase: false, wholeWord: false, wrap: true });
  const [status, setStatus] = useState('');

  const setOpt = (k: keyof FindOpts, v: boolean) => setOpts(o => ({ ...o, [k]: v }));

  return (
    <>
      <div className="npp-dialog-backdrop" />
      <div className="npp-dialog" style={{ top: 70, right: 40 }}>
        <div className="npp-dialog-title">
          <span>{mode === 'find' ? 'Find' : 'Replace'}</span>
          <button className="npp-tool-btn" style={{ width: 18, height: 16, color: '#fff' }} onClick={onClose}><X size={11} /></button>
        </div>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-soft)' }}>
          <div
            onClick={() => setMode('find')}
            className="npp-tools-tab"
            style={mode === 'find' ? { borderBottom: '2px solid var(--accent)', fontWeight: 'bold' } : {}}
          >Find</div>
          <div
            onClick={() => setMode('replace')}
            className="npp-tools-tab"
            style={mode === 'replace' ? { borderBottom: '2px solid var(--accent)', fontWeight: 'bold' } : {}}
          >Replace</div>
        </div>
        <div className="npp-dialog-body">
          <div className="npp-dialog-row">
            <label>Find what:</label>
            <input className="tool-input" autoFocus value={q} onChange={e => setQ(e.target.value)} />
          </div>
          {mode === 'replace' && (
            <div className="npp-dialog-row">
              <label>Replace with:</label>
              <input className="tool-input" value={r} onChange={e => setR(e.target.value)} />
            </div>
          )}
          <div className="npp-groupbox">
            <div className="npp-groupbox-title">Search Mode</div>
            <label style={{ marginRight: 14 }}><input type="checkbox" checked={opts.matchCase} onChange={e => setOpt('matchCase', e.target.checked)} /> Match case</label>
            <label style={{ marginRight: 14 }}><input type="checkbox" checked={opts.wholeWord} onChange={e => setOpt('wholeWord', e.target.checked)} /> Whole word</label>
            <label style={{ marginRight: 14 }}><input type="checkbox" checked={opts.regex} onChange={e => setOpt('regex', e.target.checked)} /> Regular expression</label>
            <label><input type="checkbox" checked={opts.wrap} onChange={e => setOpt('wrap', e.target.checked)} /> Wrap around</label>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, justifyContent: 'flex-end' }}>
            <button className="tool-btn primary" onClick={() => { const n = onFind(q, opts); setStatus(n > 0 ? `Found ${n} match(es)` : 'Not found'); }}>Find Next</button>
            {mode === 'replace' && (
              <>
                <button className="tool-btn" onClick={() => { onReplace(q, r, opts); }}>Replace</button>
                <button className="tool-btn" onClick={() => { const n = onReplaceAll(q, r, opts); setStatus(`Replaced ${n} occurrence(s)`); }}>Replace All</button>
              </>
            )}
            <button className="tool-btn" onClick={onClose}>Close</button>
          </div>
          {status && <div style={{ marginTop: 8, fontSize: 11, color: 'var(--accent)' }}>{status}</div>}
        </div>
      </div>
    </>
  );
}
