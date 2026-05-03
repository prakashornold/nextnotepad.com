import { X } from 'lucide-react';
import { File } from 'lucide-react';

export type EditorTab = {
  id: string;
  name: string;
  content: string;
  original: string;
  language: string;
  fileId: string | null;
};

type Props = {
  tabs: EditorTab[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onReorder: (from: number, to: number) => void;
};

export default function TabBar({ tabs, activeId, onSelect, onClose, onReorder }: Props) {
  if (tabs.length === 0) {
    return <div className="npp-tabbar" style={{ minHeight: 24 }} />;
  }
  return (
    <div className="npp-tabbar scrollbar-thin">
      {tabs.map((t, i) => {
        const dirty = t.content !== t.original;
        const active = t.id === activeId;
        return (
          <div
            key={t.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', String(i))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const from = Number(e.dataTransfer.getData('text/plain'));
              onReorder(from, i);
            }}
            className={`npp-tab ${active ? 'active' : ''}`}
            onClick={() => onSelect(t.id)}
            title={t.name}
          >
            <File size={12} style={{ color: dirty ? 'var(--dirty)' : 'var(--saved)' }} />
            <span className={`tab-name ${dirty ? 'dirty' : ''} truncate`}>
              {t.name}
            </span>
            <span
              className="close-x"
              onClick={(e) => { e.stopPropagation(); onClose(t.id); }}
              title="Close"
            >
              <X size={11} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
