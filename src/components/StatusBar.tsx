type Props = {
  line: number; col: number; selection: number;
  totalLines: number; totalChars: number;
  encoding: string; eol: string; language: string;
  zoom: number; size: number; wordWrap: boolean;
  tabSize: number; useTabs: boolean;
  insertMode: boolean;
  onEol: () => void;
  onEncoding: () => void;
  onLanguage: () => void;
  onWrap: () => void;
  onTabs: () => void;
  onInsert: () => void;
};

const eolLabel = (e: string) =>
  e === 'CRLF' ? 'Windows (CR LF)' : e === 'LF' ? 'Unix (LF)' : 'Macintosh (CR)';

export default function StatusBar(p: Props) {
  return (
    <div className="npp-status">
      <div className="npp-status-seg" style={{ minWidth: 130, flex: '0 0 auto' }}>
        {p.language === 'plaintext' ? 'Normal text file' : p.language}
      </div>
      <div className="npp-status-seg" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <span>length : {p.totalChars.toLocaleString()}</span>
        <span style={{ marginLeft: 16 }}>lines : {p.totalLines.toLocaleString()}</span>
      </div>
      <div className="npp-status-seg" style={{ minWidth: 200, justifyContent: 'center' }}>
        <span>Ln : {p.line}</span>
        <span style={{ marginLeft: 12 }}>Col : {p.col}</span>
        <span style={{ marginLeft: 12 }}>Sel : {p.selection} | {p.selection > 0 ? 1 : 0}</span>
      </div>
      <div className="npp-status-seg clickable" style={{ minWidth: 140, justifyContent: 'center' }} onClick={p.onEol}>
        {eolLabel(p.eol)}
      </div>
      <div className="npp-status-seg clickable" style={{ minWidth: 60, justifyContent: 'center' }} onClick={p.onEncoding}>
        {p.encoding}
      </div>
      <div className="npp-status-seg clickable" style={{ minWidth: 40, justifyContent: 'center' }} onClick={p.onInsert}>
        {p.insertMode ? 'INS' : 'OVR'}
      </div>
    </div>
  );
}
