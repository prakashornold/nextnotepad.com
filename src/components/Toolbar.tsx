import {
  IcoNew, IcoSave, IcoSaveAll, IcoClose,
  IcoFind, IcoReplace, IcoZoomIn, IcoZoomOut, IcoWrap, IcoShowWS,
  IcoExplorer, IcoToolsPanel,
  IcoSun, IcoMoon
} from './NppIcons';

type Props = { onAction: (a: string) => void; theme: 'light' | 'dark' };

type Btn = { icon: React.ComponentType; action: string; title: string; sep?: boolean };

const BTNS: Btn[] = [
  { icon: IcoNew, action: 'file.new', title: 'New (Ctrl+N)' },
  { icon: IcoSave, action: 'file.save', title: 'Save (Ctrl+S)' },
  { icon: IcoSaveAll, action: 'file.saveAll', title: 'Save All (Ctrl+Shift+S)' },
  { icon: IcoClose, action: 'file.close', title: 'Close (Ctrl+W)', sep: true },
  { icon: IcoFind, action: 'search.find', title: 'Find (Ctrl+F)' },
  { icon: IcoReplace, action: 'search.replace', title: 'Replace (Ctrl+H)' },
  { icon: IcoZoomIn, action: 'view.zoomIn', title: 'Zoom In' },
  { icon: IcoZoomOut, action: 'view.zoomOut', title: 'Zoom Out' },
  { icon: IcoWrap, action: 'view.wrap', title: 'Word Wrap' },
  { icon: IcoShowWS, action: 'view.whitespace', title: 'Show White Space and TAB', sep: true },
  { icon: IcoExplorer, action: 'view.explorer', title: 'Folder as Workspace' },
  { icon: IcoToolsPanel, action: 'view.tools', title: 'Tools Panel' },
];

export default function Toolbar({ onAction, theme }: Props) {
  return (
    <div className="npp-toolbar">
      {BTNS.map((b, i) => {
        const I = b.icon as any;
        return (
          <div key={i} className="flex items-center">
            <button title={b.title} onClick={() => onAction(b.action)} className="npp-tool-btn">
              <I />
            </button>
            {b.sep && <div className="npp-tool-sep" />}
          </div>
        );
      })}
      <div className="flex-1" />
      <button
        title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        onClick={() => onAction(theme === 'dark' ? 'theme.light' : 'theme.dark')}
        className="npp-tool-btn"
      >
        {theme === 'dark' ? <IcoSun /> : <IcoMoon />}
      </button>
    </div>
  );
}