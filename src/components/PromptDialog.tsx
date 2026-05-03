import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

type Kind = 'prompt' | 'confirm' | 'alert';

export type DialogRequest = {
  kind: Kind;
  title: string;
  message: string;
  defaultValue?: string;
  okText?: string;
  cancelText?: string;
  onResolve: (value: string | boolean | null) => void;
};

export default function PromptDialog({ req, onClose }: { req: DialogRequest; onClose: () => void }) {
  const [v, setV] = useState(req.defaultValue || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (req.kind === 'prompt') inputRef.current?.focus();
    inputRef.current?.select();
  }, [req]);

  const ok = () => {
    if (req.kind === 'prompt') req.onResolve(v.trim() ? v : null);
    else if (req.kind === 'confirm') req.onResolve(true);
    else req.onResolve(true);
    onClose();
  };
  const cancel = () => {
    if (req.kind === 'prompt') req.onResolve(null);
    else if (req.kind === 'confirm') req.onResolve(false);
    else req.onResolve(true);
    onClose();
  };

  return (
    <>
      <div className="npp-dialog-overlay" onClick={cancel} />
      <div className="npp-dialog" style={{ top: '30%', left: '50%', transform: 'translate(-50%, -30%)', minWidth: 380 }}>
        <div className="npp-dialog-title">
          <span>{req.title}</span>
          <button className="npp-tool-btn" style={{ width: 18, height: 16 }} onClick={cancel}><X size={11} /></button>
        </div>
        <div className="npp-dialog-body">
          <div style={{ marginBottom: req.kind === 'prompt' ? 8 : 14, whiteSpace: 'pre-wrap' }}>{req.message}</div>
          {req.kind === 'prompt' && (
            <input
              ref={inputRef}
              className="tool-input"
              style={{ width: '100%' }}
              value={v}
              onChange={(e) => setV(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') ok();
                else if (e.key === 'Escape') cancel();
              }}
            />
          )}
          <div style={{ display: 'flex', gap: 6, marginTop: 14, justifyContent: 'flex-end' }}>
            <button className="tool-btn primary" onClick={ok}>{req.okText || 'OK'}</button>
            {req.kind !== 'alert' && (
              <button className="tool-btn" onClick={cancel}>{req.cancelText || 'Cancel'}</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
