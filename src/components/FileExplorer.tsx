import { useState } from 'react';
import {
  File, Folder, FolderOpen, ChevronRight, ChevronDown,
  FilePlus, FolderPlus, Search as SearchIcon, RefreshCw, X
} from 'lucide-react';
import type { NotepadFile } from '../lib/supabase';

type Props = {
  files: NotepadFile[];
  activeFileId: string | null;
  onOpen: (f: NotepadFile) => void;
  onCreate: (isFolder: boolean, parentId: string | null) => void;
  onRename: (f: NotepadFile) => void;
  onDelete: (f: NotepadFile) => void;
  onDuplicate: (f: NotepadFile) => void;
  onRefresh: () => void;
  onClose: () => void;
};

function FileIcon({ name }: { name: string }) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const color: Record<string, string> = {
    js: '#D4A02A', jsx: '#2E8FC9', ts: '#2E8FC9', tsx: '#2E8FC9',
    py: '#3776AB', json: '#C39B4A', html: '#E34C26', css: '#264DE4',
    md: '#4A90B9', sql: '#00758F', xml: '#E35A16', sh: '#4CA24C',
  };
  return <File size={13} style={{ color: color[ext] || 'var(--fg-muted)' }} />;
}

export default function FileExplorer({
  files, activeFileId, onOpen, onCreate, onRename, onDelete, onDuplicate, onRefresh, onClose
}: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState('');
  const [ctx, setCtx] = useState<{ x: number; y: number; file: NotepadFile | null } | null>(null);

  const roots = files.filter(f => !f.parent_id);
  const childrenOf = (id: string) => files.filter(f => f.parent_id === id);
  const matches = (f: NotepadFile) => !filter || f.name.toLowerCase().includes(filter.toLowerCase());

  const renderNode = (f: NotepadFile, depth: number): JSX.Element | null => {
    const kids = f.is_folder ? childrenOf(f.id) : [];
    const isOpen = !!expanded[f.id];
    const isActive = activeFileId === f.id;
    if (!matches(f) && !kids.some(matches)) return null;
    return (
      <div key={f.id}>
        <div
          className={`npp-tree-item ${isActive ? 'active' : ''}`}
          style={{ paddingLeft: 4 + depth * 14 }}
          onClick={() => f.is_folder ? setExpanded(e => ({ ...e, [f.id]: !e[f.id] })) : onOpen(f)}
          onDoubleClick={() => !f.is_folder && onOpen(f)}
          onContextMenu={(e) => { e.preventDefault(); setCtx({ x: e.clientX, y: e.clientY, file: f }); }}
        >
          {f.is_folder
            ? (isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />)
            : <span style={{ width: 11, display: 'inline-block' }} />}
          {f.is_folder
            ? (isOpen ? <FolderOpen size={13} style={{ color: '#D4A02A' }} /> : <Folder size={13} style={{ color: '#D4A02A' }} />)
            : <FileIcon name={f.name} />}
          <span className="truncate flex-1">{f.name}</span>
        </div>
        {f.is_folder && isOpen && kids.map(k => renderNode(k, depth + 1))}
      </div>
    );
  };

  return (
    <div className="npp-panel npp-panel-sized">
      <div className="npp-panel-title">
        <span>Folder as Workspace</span>
        <div className="flex items-center gap-1">
          <button className="npp-tool-btn" style={{ width: 16, height: 16, color: '#fff' }} title="New File" onClick={() => onCreate(false, null)}><FilePlus size={11} /></button>
          <button className="npp-tool-btn" style={{ width: 16, height: 16, color: '#fff' }} title="New Folder" onClick={() => onCreate(true, null)}><FolderPlus size={11} /></button>
          <button className="npp-tool-btn" style={{ width: 16, height: 16, color: '#fff' }} title="Refresh" onClick={onRefresh}><RefreshCw size={11} /></button>
          <button className="npp-tool-btn" style={{ width: 16, height: 16, color: '#fff' }} title="Close" onClick={onClose}><X size={11} /></button>
        </div>
      </div>
      <div style={{ background: 'var(--bg-panel)', padding: 4, borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ position: 'relative' }}>
          <SearchIcon size={11} style={{ position: 'absolute', left: 5, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-dim)' }} />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search..."
            className="npp-search-box"
            style={{ paddingLeft: 20 }}
          />
        </div>
      </div>
      <div className="npp-panel-body scrollbar-thin">
        {roots.length === 0 && (
          <div style={{ padding: 12, color: 'var(--fg-dim)', fontSize: 12 }}>
            <div className="mb-2">No files.</div>
            <button className="tool-btn" onClick={() => onCreate(false, null)}>New File</button>
          </div>
        )}
        {roots.map(r => renderNode(r, 0))}
      </div>

      {ctx && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setCtx(null)} />
          <div className="npp-ctx" style={{ top: ctx.y, left: ctx.x }}>
            {!ctx.file?.is_folder && <div className="npp-ctx-item" onClick={() => { ctx.file && onOpen(ctx.file); setCtx(null); }}>Open</div>}
            <div className="npp-ctx-item" onClick={() => { ctx.file && onRename(ctx.file); setCtx(null); }}>Rename</div>
            <div className="npp-ctx-item" onClick={() => { ctx.file && onDuplicate(ctx.file); setCtx(null); }}>Duplicate</div>
            <div className="npp-ctx-sep" />
            <div className="npp-ctx-item" onClick={() => { ctx.file && navigator.clipboard.writeText(ctx.file.name); setCtx(null); }}>Copy Name</div>
            <div className="npp-ctx-sep" />
            <div className="npp-ctx-item" style={{ color: 'var(--dirty)' }} onClick={() => { ctx.file && onDelete(ctx.file); setCtx(null); }}>Delete</div>
          </div>
        </>
      )}
    </div>
  );
}
