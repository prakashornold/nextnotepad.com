import { useMemo, useState } from 'react';

export default function UrlParserTool() {
  const [url, setUrl] = useState('https://user:pass@example.com:8443/path/to/page?foo=1&bar=baz#section');

  const parsed = useMemo(() => {
    try {
      const u = new URL(url);
      const params: [string, string][] = [];
      u.searchParams.forEach((v, k) => params.push([k, v]));
      return { u, params, error: null as string | null };
    } catch (e: any) {
      return { u: null, params: [] as [string, string][], error: e.message as string };
    }
  }, [url]);

  const row = (label: string, v: string) => (
    <div style={{ display: 'flex', gap: 8, padding: '3px 0', borderBottom: '1px solid var(--border-soft)' }}>
      <span style={{ width: 110, color: 'var(--fg-muted)', fontSize: 11 }}>{label}</span>
      <span className="mono" style={{ fontSize: 11, wordBreak: 'break-all' }}>{v || '-'}</span>
    </div>
  );

  return (
    <div className="h-full overflow-auto p-3 scrollbar-thin" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <textarea className="tool-textarea mono" style={{ minHeight: 60 }} value={url} onChange={e => setUrl(e.target.value)} />
      {parsed.error && <div style={{ color: 'var(--dirty)', fontSize: 11 }}>{parsed.error}</div>}
      {parsed.u && (
        <>
          <div style={{ padding: 10, border: '1px solid var(--border-soft)', background: 'var(--bg-panel)', borderRadius: 3 }}>
            {row('Protocol', parsed.u.protocol)}
            {row('Username', parsed.u.username)}
            {row('Password', parsed.u.password)}
            {row('Host', parsed.u.host)}
            {row('Hostname', parsed.u.hostname)}
            {row('Port', parsed.u.port)}
            {row('Pathname', parsed.u.pathname)}
            {row('Search', parsed.u.search)}
            {row('Hash', parsed.u.hash)}
            {row('Origin', parsed.u.origin)}
          </div>
          {parsed.params.length > 0 && (
            <div style={{ padding: 10, border: '1px solid var(--border-soft)', borderRadius: 3 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Query parameters</div>
              {parsed.params.map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, padding: '2px 0' }}>
                  <span className="mono" style={{ color: 'var(--accent)', minWidth: 120 }}>{k}</span>
                  <span className="mono" style={{ wordBreak: 'break-all' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
