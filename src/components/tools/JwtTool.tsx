import { useMemo, useState } from 'react';

function b64urlDecode(s: string): string {
  const pad = s.length % 4 === 0 ? 0 : 4 - (s.length % 4);
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad);
  return decodeURIComponent(escape(atob(b64)));
}

function b64urlEncode(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmacSign(algo: string, secret: string, data: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: algo },
    false,
    ['sign', 'verify']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return b64urlEncode(new Uint8Array(sig));
}

const ALG_MAP: Record<string, string> = { HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512' };

export default function JwtTool() {
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [verifyState, setVerifyState] = useState<'idle' | 'ok' | 'bad'>('idle');

  const parts = token.split('.');
  const decoded = useMemo(() => {
    try {
      const header = parts[0] ? JSON.parse(b64urlDecode(parts[0])) : {};
      const payload = parts[1] ? JSON.parse(b64urlDecode(parts[1])) : {};
      return { header, payload, error: null as string | null };
    } catch (e: any) {
      return { header: {}, payload: {}, error: e.message as string };
    }
  }, [token]);

  const verify = async () => {
    try {
      const algo = ALG_MAP[decoded.header?.alg];
      if (!algo) { setVerifyState('bad'); return; }
      const expected = await hmacSign(algo, secret, `${parts[0]}.${parts[1]}`);
      setVerifyState(expected === parts[2] ? 'ok' : 'bad');
    } catch { setVerifyState('bad'); }
  };

  const fmtTime = (t: unknown) => {
    if (typeof t !== 'number') return null;
    try { return new Date(t * 1000).toISOString(); } catch { return null; }
  };

  const claims = [
    ['iat', 'Issued At'], ['exp', 'Expires At'], ['nbf', 'Not Before'],
    ['iss', 'Issuer'], ['sub', 'Subject'], ['aud', 'Audience'], ['jti', 'JWT ID'],
  ];

  return (
    <div className="h-full flex flex-col gap-2 p-3">
      <div className="flex gap-2 items-center flex-wrap">
        <span style={{ fontWeight: 600, fontSize: 11 }}>JWT Token</span>
        <button className="tool-btn" onClick={() => navigator.clipboard.writeText(token)}>Copy</button>
        <button className="tool-btn" onClick={verify}>Verify Signature</button>
        {verifyState === 'ok' && <span style={{ color: 'var(--saved)', fontWeight: 600 }}>Signature valid</span>}
        {verifyState === 'bad' && <span style={{ color: 'var(--dirty)', fontWeight: 600 }}>Signature invalid</span>}
        <input className="tool-input" style={{ flex: 1, minWidth: 180 }} placeholder="HMAC secret" value={secret} onChange={e => { setSecret(e.target.value); setVerifyState('idle'); }} />
      </div>
      <textarea
        className="tool-textarea mono scrollbar-thin"
        style={{ minHeight: 80 }}
        value={token}
        onChange={e => { setToken(e.target.value); setVerifyState('idle'); }}
        spellCheck={false}
      />
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 min-h-0" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, minHeight: 0 }}>
        <div className="flex flex-col gap-1 min-h-0">
          <div style={{ fontWeight: 600, fontSize: 11 }}>Header</div>
          <pre className="tool-textarea mono scrollbar-thin" style={{ flex: 1, margin: 0, whiteSpace: 'pre-wrap' }}>
            {decoded.error ? decoded.error : JSON.stringify(decoded.header, null, 2)}
          </pre>
        </div>
        <div className="flex flex-col gap-1 min-h-0">
          <div style={{ fontWeight: 600, fontSize: 11 }}>Payload</div>
          <pre className="tool-textarea mono scrollbar-thin" style={{ flex: 1, margin: 0, whiteSpace: 'pre-wrap' }}>
            {decoded.error ? '' : JSON.stringify(decoded.payload, null, 2)}
          </pre>
          {!decoded.error && (
            <div style={{ fontSize: 11, background: 'var(--bg-panel)', border: '1px solid var(--border-soft)', padding: 6, borderRadius: 3 }}>
              {claims.map(([k, label]) => decoded.payload[k] !== undefined && (
                <div key={k}><b>{label}</b>: {String(decoded.payload[k])}{fmtTime(decoded.payload[k]) && ` (${fmtTime(decoded.payload[k])})`}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
