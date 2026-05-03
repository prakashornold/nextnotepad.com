import { useState, useRef, useEffect } from 'react';

type MenuAction = (action: string) => void;

const MENUS: Record<string, { label?: string; action?: string; shortcut?: string; sep?: boolean }[]> = {
  File: [
    { label: 'New', action: 'file.new', shortcut: 'Ctrl+N' },
    { label: 'Open...', action: 'file.open', shortcut: 'Ctrl+O' },
    { label: 'Reload from Disk', action: 'file.reload' },
    { label: 'Save', action: 'file.save', shortcut: 'Ctrl+S' },
    { label: 'Save As...', action: 'file.saveAs', shortcut: 'Ctrl+Alt+S' },
    { label: 'Save a Copy As...', action: 'file.saveCopy' },
    { label: 'Save All', action: 'file.saveAll', shortcut: 'Ctrl+Shift+S' },
    { sep: true },
    { label: 'Close', action: 'file.close', shortcut: 'Ctrl+W' },
    { label: 'Close All', action: 'file.closeAll' },
    { label: 'Close All but Active', action: 'file.closeOthers' },
    { sep: true },
    { label: 'Print...', action: 'file.print', shortcut: 'Ctrl+P' },
    { sep: true },
    { label: 'Exit', action: 'file.exit', shortcut: 'Alt+F4' },
  ],
  Edit: [
    { label: 'Undo', action: 'edit.undo', shortcut: 'Ctrl+Z' },
    { label: 'Redo', action: 'edit.redo', shortcut: 'Ctrl+Y' },
    { sep: true },
    { label: 'Cut', action: 'edit.cut', shortcut: 'Ctrl+X' },
    { label: 'Copy', action: 'edit.copy', shortcut: 'Ctrl+C' },
    { label: 'Paste', action: 'edit.paste', shortcut: 'Ctrl+V' },
    { label: 'Delete', action: 'edit.delete', shortcut: 'Del' },
    { label: 'Select All', action: 'edit.selectAll', shortcut: 'Ctrl+A' },
    { sep: true },
    { label: 'Duplicate Current Line', action: 'edit.dupLine', shortcut: 'Ctrl+D' },
    { label: 'Trim Trailing Space', action: 'edit.trim' },
  ],
  Search: [
    { label: 'Find...', action: 'search.find', shortcut: 'Ctrl+F' },
    { label: 'Find in Files...', action: 'search.findAll', shortcut: 'Ctrl+Shift+F' },
    { label: 'Replace...', action: 'search.replace', shortcut: 'Ctrl+H' },
    { label: 'Go to Line...', action: 'search.goto', shortcut: 'Ctrl+G' },
    { sep: true },
    { label: 'Mark...', action: 'search.mark' },
  ],
  View: [
    { label: 'Toggle File Explorer', action: 'view.explorer' },
    { label: 'Toggle Tools Panel', action: 'view.tools' },
    { sep: true },
    { label: 'Word Wrap', action: 'view.wrap', shortcut: 'Alt+Z' },
    { label: 'Show Symbol', action: 'view.symbols' },
    { sep: true },
    { label: 'Zoom In', action: 'view.zoomIn', shortcut: 'Ctrl++' },
    { label: 'Zoom Out', action: 'view.zoomOut', shortcut: 'Ctrl+-' },
    { label: 'Restore Default Zoom', action: 'view.zoomReset' },
    { sep: true },
    { label: 'Full Screen', action: 'view.full', shortcut: 'F11' },
  ],
  Encoding: [
    { label: 'ANSI', action: 'enc.ansi' },
    { label: 'UTF-8', action: 'enc.utf8' },
    { label: 'UTF-8 with BOM', action: 'enc.utf8bom' },
    { label: 'UTF-16 BE BOM', action: 'enc.utf16be' },
    { label: 'UTF-16 LE BOM', action: 'enc.utf16le' },
  ],
  Language: [
    { label: 'Auto-detect', action: 'lang.auto' },
    { sep: true },
    { label: 'C', action: 'lang.c' },
    { label: 'C++', action: 'lang.cpp' },
    { label: 'C#', action: 'lang.csharp' },
    { label: 'CSS', action: 'lang.css' },
    { label: 'HTML', action: 'lang.html' },
    { label: 'Java', action: 'lang.java' },
    { label: 'JavaScript', action: 'lang.javascript' },
    { label: 'JSON', action: 'lang.json' },
    { label: 'Markdown', action: 'lang.markdown' },
    { label: 'Python', action: 'lang.python' },
    { label: 'SQL', action: 'lang.sql' },
    { label: 'TypeScript', action: 'lang.typescript' },
    { label: 'XML', action: 'lang.xml' },
    { label: 'Normal Text', action: 'lang.plaintext' },
  ],
  Settings: [
    { label: 'Preferences...', action: 'settings.open' },
    { label: 'Style Configurator...', action: 'settings.style' },
    { label: 'Shortcut Mapper...', action: 'settings.shortcuts' },
    { sep: true },
    { label: 'Light Theme', action: 'theme.light' },
    { label: 'Dark Theme', action: 'theme.dark' },
  ],
  Tools: [
    { label: 'JSON Viewer', action: 'tools.json' },
    { label: 'XML Tools', action: 'tools.xml' },
    { label: 'HTML Tools', action: 'tools.html' },
    { label: 'Compare (Diff)', action: 'tools.diff' },
    { label: 'Text FX', action: 'tools.text' },
    { label: 'Case Converter', action: 'tools.case' },
    { sep: true },
    { label: 'Encoder / Decoder', action: 'tools.encode' },
    { label: 'Hash / HMAC', action: 'tools.hash' },
    { label: 'JWT Decoder', action: 'tools.jwt' },
    { label: 'RegEx Tester', action: 'tools.regex' },
    { sep: true },
    { label: 'Color Picker', action: 'tools.color' },
    { label: 'Number Converter', action: 'tools.number' },
    { label: 'UUID Generator', action: 'tools.uuid' },
    { label: 'Password Generator', action: 'tools.password' },
    { label: 'Lorem Ipsum', action: 'tools.lorem' },
    { sep: true },
    { label: 'Unix Timestamp', action: 'tools.timestamp' },
    { label: 'Cron Expression', action: 'tools.cron' },
    { label: 'CIDR / IP Calculator', action: 'tools.cidr' },
    { label: 'URL Parser', action: 'tools.url' },
    { label: 'HTTP Status Codes', action: 'tools.http' },
    { sep: true },
    { label: 'Markdown Preview', action: 'tools.markdown' },
    { label: 'SQL Formatter', action: 'tools.sql' },
  ],
  Window: [
    { label: 'Close All', action: 'win.closeAll' },
  ],
  Help: [
    { label: 'About NextNotepad', action: 'help.about' },
  ],
};

export default function Menubar({ onAction }: { onAction: MenuAction }) {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className="npp-menubar">
      {Object.keys(MENUS).map(name => (
        <div key={name} className="relative">
          <div
            className={`npp-menubar-item ${open === name ? 'open' : ''}`}
            onClick={() => setOpen(open === name ? null : name)}
            onMouseEnter={() => { if (open) setOpen(name); }}
          >
            {underlineFirst(name)}
          </div>
          {open === name && (
            <div className="npp-menu-popup">
              {MENUS[name].map((item, i) => (
                item.sep
                  ? <div key={i} className="npp-menu-sep" />
                  : (
                    <div
                      key={i}
                      className="npp-menu-item"
                      onClick={() => { item.action && onAction(item.action); setOpen(null); }}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && <span className="npp-menu-shortcut">{item.shortcut}</span>}
                    </div>
                  )
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function underlineFirst(s: string) {
  return (
    <>
      <span style={{ textDecoration: 'underline' }}>{s[0]}</span>
      {s.slice(1)}
    </>
  );
}
