import { useMemo, useState } from 'react';

const STATUSES: Array<[number, string, string]> = [
  [100, 'Continue', 'The server has received the request headers and the client should proceed to send the request body.'],
  [101, 'Switching Protocols', 'The requester has asked the server to switch protocols.'],
  [200, 'OK', 'Standard response for successful HTTP requests.'],
  [201, 'Created', 'The request has been fulfilled and a new resource has been created.'],
  [202, 'Accepted', 'The request has been accepted for processing, but the processing has not been completed.'],
  [204, 'No Content', 'The server successfully processed the request and is not returning any content.'],
  [301, 'Moved Permanently', 'This and all future requests should be directed to the given URI.'],
  [302, 'Found', 'The resource was found but at a different URI.'],
  [304, 'Not Modified', 'Indicates that the resource has not been modified since last requested.'],
  [307, 'Temporary Redirect', 'The request should be repeated with another URI.'],
  [308, 'Permanent Redirect', 'The request and all future requests should be repeated using another URI.'],
  [400, 'Bad Request', 'The server cannot or will not process the request due to a client error.'],
  [401, 'Unauthorized', 'Authentication is required and has failed or has not been provided.'],
  [403, 'Forbidden', 'The request was valid, but the server is refusing action.'],
  [404, 'Not Found', 'The requested resource could not be found.'],
  [405, 'Method Not Allowed', 'A request method is not supported for the requested resource.'],
  [408, 'Request Timeout', 'The server timed out waiting for the request.'],
  [409, 'Conflict', 'Indicates that the request could not be processed because of conflict in the current state.'],
  [410, 'Gone', 'The resource requested is no longer available and will not be available again.'],
  [418, "I'm a teapot", 'The server refuses the attempt to brew coffee with a teapot.'],
  [422, 'Unprocessable Entity', 'The request was well-formed but was unable to be followed due to semantic errors.'],
  [429, 'Too Many Requests', 'The user has sent too many requests in a given amount of time.'],
  [500, 'Internal Server Error', 'A generic error message when an unexpected condition was encountered.'],
  [501, 'Not Implemented', 'The server either does not recognize the request method, or it lacks the ability to fulfill the request.'],
  [502, 'Bad Gateway', 'The server was acting as a gateway or proxy and received an invalid response.'],
  [503, 'Service Unavailable', 'The server cannot handle the request (because it is overloaded or down for maintenance).'],
  [504, 'Gateway Timeout', 'The server was acting as a gateway or proxy and did not receive a timely response.'],
];

export default function HttpStatusTool() {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return STATUSES;
    return STATUSES.filter(([n, t, d]) => String(n).includes(s) || t.toLowerCase().includes(s) || d.toLowerCase().includes(s));
  }, [q]);

  const color = (n: number) => {
    if (n < 200) return '#7D7D7D';
    if (n < 300) return 'var(--saved)';
    if (n < 400) return '#B08800';
    if (n < 500) return '#D18000';
    return 'var(--dirty)';
  };

  return (
    <div className="h-full flex flex-col gap-2 p-3">
      <input className="tool-input" value={q} onChange={e => setQ(e.target.value)} placeholder="Search HTTP status codes..." />
      <div style={{ flex: 1, overflow: 'auto' }} className="scrollbar-thin">
        {filtered.map(([n, t, d]) => (
          <div key={n} style={{ padding: '6px 4px', borderBottom: '1px solid var(--border-soft)' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: color(n), width: 40 }}>{n}</span>
              <span style={{ fontWeight: 600 }}>{t}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
