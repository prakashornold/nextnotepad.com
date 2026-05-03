import { useEffect, useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import JsonTool from './tools/JsonTool';
import XmlTool from './tools/XmlTool';
import TextTool from './tools/TextTool';
import EncodeTool from './tools/EncodeTool';
import RegexTool from './tools/RegexTool';
import ColorTool from './tools/ColorTool';
import MarkdownTool from './tools/MarkdownTool';
import NumberTool from './tools/NumberTool';
import DiffTool from './tools/DiffTool';
import SqlTool from './tools/SqlTool';
import HtmlTool from './tools/HtmlTool';
import JwtTool from './tools/JwtTool';
import UuidTool from './tools/UuidTool';
import TimestampTool from './tools/TimestampTool';
import CronTool from './tools/CronTool';
import PasswordTool from './tools/PasswordTool';
import LoremTool from './tools/LoremTool';
import HashTool from './tools/HashTool';
import CidrTool from './tools/CidrTool';
import UrlParserTool from './tools/UrlParserTool';
import CaseTool from './tools/CaseTool';
import HttpStatusTool from './tools/HttpStatusTool';

const TABS = [
  { id: 'json', label: 'JSON Viewer', comp: JsonTool },
  { id: 'xml', label: 'XML Tools', comp: XmlTool },
  { id: 'html', label: 'HTML Tools', comp: HtmlTool },
  { id: 'diff', label: 'Compare', comp: DiffTool },
  { id: 'text', label: 'Text FX', comp: TextTool },
  { id: 'case', label: 'Case Convert', comp: CaseTool },
  { id: 'encode', label: 'Encoder', comp: EncodeTool },
  { id: 'hash', label: 'Hash / HMAC', comp: HashTool },
  { id: 'jwt', label: 'JWT', comp: JwtTool },
  { id: 'regex', label: 'RegEx', comp: RegexTool },
  { id: 'color', label: 'Color Picker', comp: ColorTool },
  { id: 'number', label: 'Number Convert', comp: NumberTool },
  { id: 'uuid', label: 'UUID', comp: UuidTool },
  { id: 'password', label: 'Password Gen', comp: PasswordTool },
  { id: 'timestamp', label: 'Timestamp', comp: TimestampTool },
  { id: 'cron', label: 'Cron', comp: CronTool },
  { id: 'cidr', label: 'CIDR / IP', comp: CidrTool },
  { id: 'url', label: 'URL Parser', comp: UrlParserTool },
  { id: 'http', label: 'HTTP Status', comp: HttpStatusTool },
  { id: 'markdown', label: 'Markdown', comp: MarkdownTool },
  { id: 'sql', label: 'SQL Format', comp: SqlTool },
  { id: 'lorem', label: 'Lorem Ipsum', comp: LoremTool },
];

export default function ToolsPanel({ onClose, initialTab }: { onClose: () => void; initialTab?: string }) {
  const [active, setActive] = useState(initialTab || 'json');
  const [maximized, setMaximized] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches);
  const Active = TABS.find(t => t.id === active)?.comp || JsonTool;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const fn = () => setIsMobile(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  return (
    <div style={{
      position: maximized ? 'absolute' : 'relative',
      inset: maximized ? 0 : undefined,
      display: 'flex',
      flexDirection: 'column',
      height: maximized ? '100%' : 320,
      background: 'var(--bg-editor)',
      borderTop: '1px solid var(--border)',
      zIndex: maximized ? 20 : 1,
      minHeight: 0,
    }}>
      <div className="npp-tools-header" style={{ flexShrink: 0 }}>
        {isMobile ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 8, minWidth: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>Tool:</span>
            <select
              value={active}
              onChange={(e) => setActive(e.target.value)}
              className="tool-select"
              style={{ flex: 1, minWidth: 0, height: 22, fontSize: 12 }}
            >
              {TABS.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', overflowX: 'auto', minWidth: 0 }} className="scrollbar-thin">
            {TABS.map(t => (
              <div key={t.id} className={`npp-tools-tab ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>
                {t.label}
              </div>
            ))}
          </div>
        )}
        <button className="npp-tool-btn" onClick={() => setMaximized(m => !m)} title={maximized ? 'Restore' : 'Maximize'}>
          {maximized ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>
        <button className="npp-tool-btn" onClick={onClose} title="Close"><X size={12} /></button>
      </div>
      <div className="npp-tool-body" style={{ flex: 1, minHeight: 0, padding: 0, overflow: 'auto' }}>
        <Active />
      </div>
    </div>
  );
}
