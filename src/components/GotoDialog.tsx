import { useState } from 'react';
import { X } from 'lucide-react';

export default function GotoDialog({ maxLine, onClose, onGo }: { maxLine: number; onClose: () => void; onGo: (n: number) => void }) {
  const [n, setN] = useState('1');
  return (
    <>
      <div className="npp-dialog-backdrop" />
      <div className="npp-dialog" style={{ top: 120, left: '50%', transform: 'translateX(-50%)', minWidth: 300 }}>
        <div className="npp-dialog-title">
          <span>Go To...</span>
          <button className="npp-tool-btn" style={{ width: 18, height: 16, color: '#fff' }} onClick={onClose}><X size={11} /></button>
        </div>
        <div className="npp-dialog-body">
          <div className="npp-dialog-row">
            <label>Line:</label>
            <input className="tool-input" autoFocus value={n} onChange={e => setN(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { onGo(Math.min(maxLine, Math.max(1, Number(n) || 1))); onClose(); } }}
            />
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>You are at: any line (1 - {maxLine})</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, justifyContent: 'flex-end' }}>
            <button className="tool-btn primary" onClick={() => { onGo(Math.min(maxLine, Math.max(1, Number(n) || 1))); onClose(); }}>Go</button>
            <button className="tool-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
