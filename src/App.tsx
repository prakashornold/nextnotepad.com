import { useState, useEffect, useRef, useCallback } from 'react';
import Menubar from './components/Menubar';
import Toolbar from './components/Toolbar';
import TabBar, { EditorTab } from './components/TabBar';
import FileExplorer from './components/FileExplorer';
import Editor, { EditorHandle } from './components/Editor';
import StatusBar from './components/StatusBar';
import ToolsPanel from './components/ToolsPanel';
import FindDialog, { FindOpts } from './components/FindDialog';
import GotoDialog from './components/GotoDialog';
import PromptDialog, { DialogRequest } from './components/PromptDialog';
import { listFiles, createFile, updateFile, deleteFile } from './lib/store';
import type { NotepadFile } from './lib/supabase';
import { detectLanguage, LANGUAGES } from './lib/languages';
import { getTheme, setTheme as saveTheme, Theme } from './lib/theme';

export default function App() {
  const [theme, setThemeState] = useState<Theme>(getTheme());
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches);
  const [files, setFiles] = useState<NotepadFile[]>([]);
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [showExplorer, setShowExplorer] = useState(true);
  const [showTools, setShowTools] = useState(false);
  const [toolsTab, setToolsTab] = useState('json');
  const [wordWrap, setWordWrap] = useState(false);
  const [showWhitespace, setShowWhitespace] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(4);
  const [useTabs, setUseTabs] = useState(false);
  const [insertMode, setInsertMode] = useState(true);
  const [encoding, setEncoding] = useState('UTF-8');
  const [eol, setEol] = useState<'CRLF' | 'LF' | 'CR'>('LF');
  const [cursor, setCursor] = useState({ line: 1, col: 1, sel: 0 });
  const [findMode, setFindMode] = useState<null | 'find' | 'replace'>(null);
  const [gotoOpen, setGotoOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogRequest | null>(null);

  const showPrompt = (title: string, message: string, def = ''): Promise<string | null> =>
    new Promise((resolve) => setDialog({ kind: 'prompt', title, message, defaultValue: def, onResolve: (v) => resolve(v as string | null) }));
  const showConfirm = (title: string, message: string): Promise<boolean> =>
    new Promise((resolve) => setDialog({ kind: 'confirm', title, message, onResolve: (v) => resolve(!!v) }));
  const showAlert = (title: string, message: string): Promise<void> =>
    new Promise((resolve) => setDialog({ kind: 'alert', title, message, onResolve: () => resolve() }));

  const editorRef = useRef<EditorHandle>(null);
  const activeTab = tabs.find(t => t.id === activeTabId) || null;

  const applyTheme = (t: Theme) => { setThemeState(t); saveTheme(t); };

  const refresh = useCallback(async () => {
    const list = await listFiles();
    setFiles(list);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const fn = () => { setIsMobile(mq.matches); if (mq.matches) setShowExplorer(false); };
    fn();
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  const openFile = (f: NotepadFile) => {
    const existing = tabs.find(t => t.fileId === f.id);
    if (existing) { setActiveTabId(existing.id); return; }
    const t: EditorTab = {
      id: crypto.randomUUID(),
      name: f.name, content: f.content, original: f.content,
      language: f.language, fileId: f.id,
    };
    setTabs(ts => [...ts, t]);
    setActiveTabId(t.id);
  };

  const promptName = async (def: string, title: string) => {
    const v = await showPrompt(title, title, def);
    return v && v.trim() ? v.trim() : null;
  };

  const handleCreate = async (isFolder: boolean, parentId: string | null) => {
    const name = await promptName(isFolder ? 'new folder' : 'new 1.txt', `Enter the ${isFolder ? 'folder' : 'file'} name:`);
    if (!name) return;
    const lang = isFolder ? 'plaintext' : detectLanguage(name);
    const f = await createFile(name, isFolder, parentId, '', lang);
    if (f) { await refresh(); if (!isFolder) openFile(f); }
  };

  const handleRename = async (f: NotepadFile) => {
    const name = await promptName(f.name, 'Rename:');
    if (!name) return;
    await updateFile(f.id, { name, language: f.is_folder ? 'plaintext' : detectLanguage(name) });
    setTabs(ts => ts.map(t => t.fileId === f.id ? { ...t, name } : t));
    refresh();
  };

  const handleDelete = async (f: NotepadFile) => {
    const ok = await showConfirm('Delete', `Are you sure you want to delete "${f.name}"?`);
    if (!ok) return;
    await deleteFile(f.id);
    setTabs(ts => ts.filter(t => t.fileId !== f.id));
    refresh();
  };

  const handleDuplicate = async (f: NotepadFile) => {
    const name = await promptName(f.name.replace(/(\.\w+)?$/, ' - Copy$1'), 'Duplicate as:');
    if (!name) return;
    await createFile(name, f.is_folder, f.parent_id, f.content, f.language);
    refresh();
  };

  const newEmptyTab = () => {
    const n = tabs.filter(t => !t.fileId).length + 1;
    const t: EditorTab = {
      id: crypto.randomUUID(), name: `new ${n}`,
      content: '', original: '', language: 'plaintext', fileId: null,
    };
    setTabs(ts => [...ts, t]);
    setActiveTabId(t.id);
  };

  const closeTab = async (id: string) => {
    const tab = tabs.find(t => t.id === id);
    if (tab && tab.content !== tab.original) {
      const save = await showConfirm('Save', `Save file "${tab.name}" ?`);
      if (save && tab.fileId) await updateFile(tab.fileId, { content: tab.content });
    }
    setTabs(ts => {
      const idx = ts.findIndex(t => t.id === id);
      const next = ts.filter(t => t.id !== id);
      if (activeTabId === id) setActiveTabId(next[idx]?.id || next[idx - 1]?.id || null);
      return next;
    });
  };

  const reorder = (from: number, to: number) => {
    setTabs(ts => {
      const next = [...ts];
      const [m] = next.splice(from, 1);
      next.splice(to, 0, m);
      return next;
    });
  };

  const saveActive = async () => {
    if (!activeTab) return;
    if (activeTab.fileId) {
      await updateFile(activeTab.fileId, { content: activeTab.content, language: activeTab.language });
      setTabs(ts => ts.map(t => t.id === activeTab.id ? { ...t, original: t.content } : t));
    } else {
      const name = await promptName(activeTab.name.includes('.') ? activeTab.name : `${activeTab.name}.txt`, 'Save As:');
      if (!name) return;
      const f = await createFile(name, false, null, activeTab.content, detectLanguage(name));
      if (f) {
        setTabs(ts => ts.map(t => t.id === activeTab.id ? { ...t, name, fileId: f.id, original: t.content, language: f.language } : t));
        refresh();
      }
    }
  };

  const saveAll = async () => {
    for (const t of tabs) {
      if (t.fileId && t.content !== t.original) await updateFile(t.fileId, { content: t.content });
    }
    setTabs(ts => ts.map(t => ({ ...t, original: t.content })));
  };

  const autosaveRef = useRef<number | null>(null);
  useEffect(() => {
    if (autosaveRef.current) window.clearInterval(autosaveRef.current);
    autosaveRef.current = window.setInterval(() => {
      tabs.forEach(t => {
        if (t.fileId && t.content !== t.original) updateFile(t.fileId, { content: t.content });
      });
      setTabs(ts => ts.map(t => t.fileId ? { ...t, original: t.content } : t));
    }, 30000);
    return () => { if (autosaveRef.current) window.clearInterval(autosaveRef.current); };
  }, [tabs]);

  // --- find / replace core ---
  const buildRegex = (q: string, o: FindOpts) => {
    let p = o.regex ? q : q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (o.wholeWord) p = `\\b${p}\\b`;
    const flags = 'g' + (o.matchCase ? '' : 'i');
    return new RegExp(p, flags);
  };

  const doFind = (q: string, o: FindOpts): number => {
    if (!q || !activeTab) return 0;
    try {
      const re = buildRegex(q, o);
      const text = activeTab.content;
      const sel = editorRef.current?.getSelection();
      const from = sel ? sel.end : 0;
      re.lastIndex = from;
      let m = re.exec(text);
      if (!m && o.wrap) { re.lastIndex = 0; m = re.exec(text); }
      if (m) editorRef.current?.setSelection(m.index, m.index + m[0].length);
      const all = text.match(re);
      return all ? all.length : 0;
    } catch { return 0; }
  };

  const doReplace = (q: string, r: string, o: FindOpts) => {
    if (!activeTab) return;
    const sel = editorRef.current?.getSelection();
    if (sel && sel.start !== sel.end) {
      const selText = sel.value.substring(sel.start, sel.end);
      try {
        const re = buildRegex(q, o);
        if (re.test(selText)) {
          re.lastIndex = 0;
          const replaced = selText.replace(re, r);
          const nv = sel.value.substring(0, sel.start) + replaced + sel.value.substring(sel.end);
          setTabs(ts => ts.map(t => t.id === activeTab.id ? { ...t, content: nv } : t));
          requestAnimationFrame(() => editorRef.current?.setSelection(sel.start, sel.start + replaced.length));
        }
      } catch { /* ignore */ }
    }
    doFind(q, o);
  };

  const doReplaceAll = (q: string, r: string, o: FindOpts): number => {
    if (!activeTab || !q) return 0;
    try {
      const re = buildRegex(q, o);
      const count = (activeTab.content.match(re) || []).length;
      const nv = activeTab.content.replace(re, r);
      setTabs(ts => ts.map(t => t.id === activeTab.id ? { ...t, content: nv } : t));
      return count;
    } catch { return 0; }
  };

  const onAction = (a: string) => {
    if (a === 'file.new') newEmptyTab();
    else if (a === 'file.save' || a === 'file.saveAs' || a === 'file.saveCopy') saveActive();
    else if (a === 'file.saveAll') saveAll();
    else if (a === 'file.close' && activeTabId) closeTab(activeTabId);
    else if (a === 'file.closeAll' || a === 'win.closeAll') setTabs([]);
    else if (a === 'file.closeOthers') setTabs(ts => ts.filter(t => t.id === activeTabId));
    else if (a === 'view.explorer') setShowExplorer(s => !s);
    else if (a === 'view.tools') setShowTools(s => !s);
    else if (a === 'view.wrap') setWordWrap(w => !w);
    else if (a === 'view.whitespace') setShowWhitespace(w => !w);
    else if (a === 'view.zoomIn') setFontSize(s => Math.min(32, s + 1));
    else if (a === 'view.zoomOut') setFontSize(s => Math.max(8, s - 1));
    else if (a === 'view.zoomReset') setFontSize(14);
    else if (a === 'search.find') setFindMode('find');
    else if (a === 'search.replace') setFindMode('replace');
    else if (a === 'search.goto') setGotoOpen(true);
    else if (a === 'theme.light') applyTheme('light');
    else if (a === 'theme.dark') applyTheme('dark');
    else if (a.startsWith('tools.')) { setShowTools(true); setToolsTab(a.substring(6)); }
    else if (a.startsWith('lang.') && activeTab) {
      const l = a === 'lang.auto' ? detectLanguage(activeTab.name) : a.substring(5);
      setTabs(ts => ts.map(t => t.id === activeTab.id ? { ...t, language: l } : t));
    }
    else if (a === 'enc.ansi') setEncoding('ANSI');
    else if (a === 'enc.utf8') setEncoding('UTF-8');
    else if (a === 'enc.utf8bom') setEncoding('UTF-8-BOM');
    else if (a === 'enc.utf16be') setEncoding('UTF-16 BE BOM');
    else if (a === 'enc.utf16le') setEncoding('UTF-16 LE BOM');
    else if (a === 'help.about') showAlert('About NextNotepad', 'NextNotepad v1.0\n\nThe Developer\'s Notepad in your browser.\nInspired by Notepad++.\n\nnextnotepad.com');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); setWordWrap(w => !w); return; }
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === 's') { e.preventDefault(); e.shiftKey ? saveAll() : saveActive(); }
      else if (e.key === 'n') { e.preventDefault(); newEmptyTab(); }
      else if (e.key === 'w') { e.preventDefault(); activeTabId && closeTab(activeTabId); }
      else if (e.key === 'f') { e.preventDefault(); setFindMode('find'); }
      else if (e.key === 'h') { e.preventDefault(); setFindMode('replace'); }
      else if (e.key === 'g') { e.preventDefault(); setGotoOpen(true); }
      else if (e.key === '=' || e.key === '+') { e.preventDefault(); setFontSize(s => Math.min(32, s + 1)); }
      else if (e.key === '-') { e.preventDefault(); setFontSize(s => Math.max(8, s - 1)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const cycleLanguage = () => {
    if (!activeTab) return;
    const i = LANGUAGES.indexOf(activeTab.language);
    const next = LANGUAGES[(i + 1) % LANGUAGES.length];
    setTabs(ts => ts.map(t => t.id === activeTab.id ? { ...t, language: next } : t));
  };

  const total = {
    chars: activeTab?.content.length || 0,
    lines: activeTab?.content.split('\n').length || 0,
  };
  const fileSize = activeTab ? new Blob([activeTab.content]).size : 0;

  useEffect(() => {
    document.title = activeTab
      ? `${activeTab.content !== activeTab.original ? '*' : ''}${activeTab.name} - NextNotepad`
      : 'NextNotepad';
  }, [activeTab]);

  return (
    <div className="h-screen flex flex-col">
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {isMobile && (
          <div className="npp-hamburger" onClick={() => setShowExplorer(s => !s)} title="Toggle file explorer">
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M2 4 H16 M2 9 H16 M2 14 H16" stroke="currentColor" strokeWidth="2" /></svg>
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Menubar onAction={onAction} />
        </div>
      </div>
      <Toolbar onAction={onAction} theme={theme} />
      <TabBar tabs={tabs} activeId={activeTabId} onSelect={setActiveTabId} onClose={closeTab} onReorder={reorder} />

      <div className="flex-1 flex min-h-0 relative">
        {isMobile && showExplorer && (
          <div className="npp-panel-backdrop" onClick={() => setShowExplorer(false)} />
        )}
        {showExplorer && (
          <div className={isMobile ? 'mobile-drawer-wrap' : 'desktop-panel-wrap'}>
            <FileExplorer
              files={files}
              activeFileId={activeTab?.fileId || null}
              onOpen={(f) => { openFile(f); if (isMobile) setShowExplorer(false); }}
              onCreate={handleCreate}
              onRename={handleRename}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onRefresh={refresh}
              onClose={() => setShowExplorer(false)}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex flex-col min-h-0" style={{ position: 'relative' }}>
            {activeTab ? (
              <Editor
                ref={editorRef}
                value={activeTab.content}
                onChange={(v) => setTabs(ts => ts.map(t => t.id === activeTab.id ? { ...t, content: v } : t))}
                wordWrap={wordWrap}
                showWhitespace={showWhitespace}
                fontSize={fontSize}
                tabSize={tabSize}
                onCursorChange={(line, col, sel) => setCursor({ line, col, sel })}
              />
            ) : (
              <WelcomeScreen onNew={newEmptyTab} onCreate={() => handleCreate(false, null)} />
            )}
            {showTools && <ToolsPanel onClose={() => setShowTools(false)} initialTab={toolsTab} />}
          </div>
        </div>
      </div>

      <StatusBar
        line={cursor.line} col={cursor.col} selection={cursor.sel}
        totalLines={total.lines} totalChars={total.chars}
        encoding={encoding} eol={eol} language={activeTab?.language || 'Normal text file'}
        zoom={Math.round((fontSize / 14) * 100)} size={fileSize}
        wordWrap={wordWrap} tabSize={tabSize} useTabs={useTabs}
        insertMode={insertMode}
        onEol={() => setEol(e => e === 'LF' ? 'CRLF' : e === 'CRLF' ? 'CR' : 'LF')}
        onEncoding={() => setEncoding(e => e === 'UTF-8' ? 'ANSI' : e === 'ANSI' ? 'UTF-16 LE' : 'UTF-8')}
        onLanguage={cycleLanguage}
        onWrap={() => setWordWrap(w => !w)}
        onTabs={() => { setUseTabs(u => !u); setTabSize(s => s === 2 ? 4 : s === 4 ? 8 : 2); }}
        onInsert={() => setInsertMode(m => !m)}
      />

      {findMode && (
        <FindDialog
          mode={findMode}
          onClose={() => setFindMode(null)}
          onFind={doFind}
          onReplace={doReplace}
          onReplaceAll={doReplaceAll}
        />
      )}
      {gotoOpen && (
        <GotoDialog
          maxLine={total.lines}
          onClose={() => setGotoOpen(false)}
          onGo={(n) => editorRef.current?.gotoLine(n)}
        />
      )}
      {dialog && <PromptDialog req={dialog} onClose={() => setDialog(null)} />}
    </div>
  );
}

function WelcomeScreen({ onNew, onCreate }: { onNew: () => void; onCreate: () => void }) {
  return (
    <div className="npp-welcome">
      <div className="npp-welcome-card">
        <div className="npp-logo">N++</div>
        <h1 style={{ fontSize: 17, fontWeight: 'bold', margin: '2px 0 2px', fontFamily: 'Tahoma, sans-serif' }}>NextNotepad</h1>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 14 }}>The Developer's Notepad &mdash; nextnotepad.com</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
          <button onClick={onNew} className="tool-btn primary">New</button>
          <button onClick={onCreate} className="tool-btn">Create File...</button>
        </div>
        <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 10, fontSize: 11, color: 'var(--fg-muted)', textAlign: 'left', minWidth: 300 }}>
          <div style={{ textAlign: 'center', marginBottom: 6, fontWeight: 'bold', color: 'var(--fg)' }}>Keyboard Shortcuts</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 18px' }}>
            {[
              ['Ctrl+N', 'New file'],
              ['Ctrl+S', 'Save'],
              ['Ctrl+W', 'Close tab'],
              ['Ctrl+F', 'Find'],
              ['Ctrl+H', 'Replace'],
              ['Ctrl+G', 'Go to line'],
              ['Alt+Z', 'Word wrap'],
              ['Ctrl++', 'Zoom in'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="npp-kbd">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
