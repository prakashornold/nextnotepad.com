import { useMemo, useState } from 'react';

function ipToInt(ip: string) {
  const p = ip.split('.').map(n => parseInt(n));
  if (p.length !== 4 || p.some(n => isNaN(n) || n < 0 || n > 255)) return null;
  return (((p[0] << 24) >>> 0) + (p[1] << 16) + (p[2] << 8) + p[3]) >>> 0;
}

function intToIp(n: number) {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff].join('.');
}

export default function CidrTool() {
  const [cidr, setCidr] = useState('192.168.1.0/24');

  const info = useMemo(() => {
    const m = cidr.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
    if (!m) return { error: 'Enter a CIDR like 192.168.1.0/24' };
    const ip = ipToInt(m[1]);
    const prefix = parseInt(m[2]);
    if (ip === null) return { error: 'Invalid IP' };
    if (prefix < 0 || prefix > 32) return { error: 'Prefix must be 0-32' };
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    const network = (ip & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const total = prefix === 32 ? 1 : prefix === 31 ? 2 : (broadcast - network + 1);
    const usable = prefix >= 31 ? total : total - 2;
    const first = prefix >= 31 ? network : network + 1;
    const last = prefix >= 31 ? broadcast : broadcast - 1;
    return {
      network: intToIp(network),
      broadcast: intToIp(broadcast),
      netmask: intToIp(mask),
      wildcard: intToIp(~mask >>> 0),
      prefix,
      total,
      usable,
      first: intToIp(first),
      last: intToIp(last),
      binaryMask: mask.toString(2).padStart(32, '0').match(/.{8}/g)!.join('.'),
    };
  }, [cidr]);

  const row = (label: string, v: string | number) => (
    <div style={{ display: 'flex', gap: 8, padding: '3px 0', borderBottom: '1px solid var(--border-soft)' }}>
      <span style={{ width: 160, color: 'var(--fg-muted)', fontSize: 11 }}>{label}</span>
      <span className="mono" style={{ fontSize: 11 }}>{v}</span>
    </div>
  );

  return (
    <div className="h-full overflow-auto p-3 scrollbar-thin" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <input className="tool-input mono" style={{ fontSize: 14 }} value={cidr} onChange={e => setCidr(e.target.value)} placeholder="192.168.1.0/24" />
      {'error' in info ? (
        <div style={{ color: 'var(--dirty)', fontSize: 11 }}>{info.error}</div>
      ) : (
        <div style={{ padding: 10, border: '1px solid var(--border-soft)', background: 'var(--bg-panel)', borderRadius: 3 }}>
          {row('Network address', info.network)}
          {row('Broadcast address', info.broadcast)}
          {row('Netmask', info.netmask)}
          {row('Wildcard', info.wildcard)}
          {row('CIDR', `/${info.prefix}`)}
          {row('Binary mask', info.binaryMask)}
          {row('Total hosts', info.total)}
          {row('Usable hosts', info.usable)}
          {row('First usable', info.first)}
          {row('Last usable', info.last)}
        </div>
      )}
    </div>
  );
}
