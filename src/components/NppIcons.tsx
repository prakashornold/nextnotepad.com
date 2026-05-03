/* Classic Notepad++ 16x16 style toolbar icons, simplified as SVGs.
   Designed to evoke the original Windows-era icons (floppy, folder, etc.) */

type P = { size?: number };

const SIZE = 16;
const wrap = (children: React.ReactNode, s = SIZE) => (
  <svg width={s} height={s} viewBox="0 0 16 16" shapeRendering="crispEdges">
    {children}
  </svg>
);

export const IcoNew = ({ size = SIZE }: P) => wrap(
  <>
    <path d="M3 2 H10 L13 5 V14 H3 Z" fill="#FFFFFF" stroke="#000" />
    <path d="M10 2 V5 H13" fill="none" stroke="#000" />
    <path d="M5 7 H11 M5 9 H11 M5 11 H9" stroke="#808080" />
  </>, size
);

export const IcoOpen = ({ size = SIZE }: P) => wrap(
  <>
    <path d="M1 4 H6 L7 5 H14 V13 H1 Z" fill="#FFD88C" stroke="#8B6914" />
    <path d="M2 6 H13 L12 12 H3 Z" fill="#FFE7B3" stroke="#8B6914" />
  </>, size
);

export const IcoSave = ({ size = SIZE }: P) => wrap(
  <>
    <rect x="2" y="2" width="12" height="12" fill="#4B7BC9" stroke="#1E3F75" />
    <rect x="4" y="2" width="8" height="5" fill="#E6E6E6" stroke="#1E3F75" />
    <rect x="9" y="3" width="2" height="3" fill="#1E3F75" />
    <rect x="4" y="9" width="8" height="5" fill="#F5F5F5" stroke="#1E3F75" />
    <path d="M5 10 H11 M5 12 H11" stroke="#777" />
  </>, size
);

export const IcoSaveAll = ({ size = SIZE }: P) => wrap(
  <>
    <rect x="4" y="4" width="10" height="10" fill="#4B7BC9" stroke="#1E3F75" />
    <rect x="5" y="4" width="8" height="4" fill="#E6E6E6" stroke="#1E3F75" />
    <rect x="2" y="2" width="10" height="10" fill="#6E9DDB" stroke="#1E3F75" />
    <rect x="3" y="2" width="8" height="4" fill="#F5F5F5" stroke="#1E3F75" />
    <rect x="8" y="3" width="2" height="2" fill="#1E3F75" />
  </>, size
);

export const IcoClose = ({ size = SIZE }: P) => wrap(
  <>
    <path d="M3 2 H10 L13 5 V14 H3 Z" fill="#FFFFFF" stroke="#000" />
    <path d="M5 7 L11 13 M11 7 L5 13" stroke="#C00" strokeWidth="2" />
  </>, size
);

export const IcoPrint = ({ size = SIZE }: P) => wrap(
  <>
    <rect x="3" y="2" width="10" height="6" fill="#FFF" stroke="#000" />
    <rect x="1" y="6" width="14" height="6" fill="#B8B8B8" stroke="#000" />
    <rect x="3" y="10" width="10" height="4" fill="#FFF" stroke="#000" />
    <rect x="11" y="8" width="2" height="1" fill="#0A0" />
  </>, size
);

export const IcoCut = ({ size = SIZE }: P) => wrap(
  <>
    <circle cx="5" cy="11" r="2.5" fill="none" stroke="#000" />
    <circle cx="11" cy="11" r="2.5" fill="none" stroke="#000" />
    <path d="M5 11 L13 2 M11 11 L3 2" stroke="#000" />
  </>, size
);

export const IcoCopy = ({ size = SIZE }: P) => wrap(
  <>
    <rect x="5" y="5" width="9" height="10" fill="#FFF" stroke="#000" />
    <rect x="2" y="2" width="9" height="10" fill="#FFF" stroke="#000" />
    <path d="M4 5 H9 M4 7 H9 M4 9 H8" stroke="#808080" />
  </>, size
);

export const IcoPaste = ({ size = SIZE }: P) => wrap(
  <>
    <rect x="2" y="3" width="12" height="12" fill="#FFD88C" stroke="#8B6914" />
    <rect x="4" y="2" width="8" height="3" fill="#B8B8B8" stroke="#000" />
    <rect x="6" y="1" width="4" height="2" fill="#FFF" stroke="#000" />
    <rect x="5" y="7" width="8" height="6" fill="#FFF" stroke="#000" />
  </>, size
);

export const IcoUndo = ({ size = SIZE }: P) => wrap(
  <>
    <path d="M3 7 Q3 3 8 3 Q13 3 13 8 Q13 12 9 12" fill="none" stroke="#005AB5" strokeWidth="2" />
    <path d="M1 7 L3 5 L5 7 Z" fill="#005AB5" />
  </>, size
);

export const IcoRedo = ({ size = SIZE }: P) => wrap(
  <>
    <path d="M13 7 Q13 3 8 3 Q3 3 3 8 Q3 12 7 12" fill="none" stroke="#005AB5" strokeWidth="2" />
    <path d="M15 7 L13 5 L11 7 Z" fill="#005AB5" />
  </>, size
);

export const IcoFind = ({ size = SIZE }: P) => wrap(
  <>
    <circle cx="7" cy="7" r="4" fill="#FFF" stroke="#000" strokeWidth="1.5" />
    <path d="M10 10 L14 14" stroke="#000" strokeWidth="2" />
  </>, size
);

export const IcoReplace = ({ size = SIZE }: P) => wrap(
  <>
    <circle cx="6" cy="6" r="3.5" fill="#FFF" stroke="#000" strokeWidth="1.3" />
    <path d="M9 9 L13 13" stroke="#000" strokeWidth="1.8" />
    <path d="M9 2 L13 2 L13 6" stroke="#C00" fill="none" />
    <path d="M13 6 L11 4" stroke="#C00" />
  </>, size
);

export const IcoZoomIn = ({ size = SIZE }: P) => wrap(
  <>
    <circle cx="7" cy="7" r="4" fill="#FFF" stroke="#000" strokeWidth="1.5" />
    <path d="M5 7 H9 M7 5 V9" stroke="#000" strokeWidth="1.5" />
    <path d="M10 10 L14 14" stroke="#000" strokeWidth="2" />
  </>, size
);

export const IcoZoomOut = ({ size = SIZE }: P) => wrap(
  <>
    <circle cx="7" cy="7" r="4" fill="#FFF" stroke="#000" strokeWidth="1.5" />
    <path d="M5 7 H9" stroke="#000" strokeWidth="1.5" />
    <path d="M10 10 L14 14" stroke="#000" strokeWidth="2" />
  </>, size
);

export const IcoWrap = ({ size = SIZE }: P) => wrap(
  <>
    <path d="M2 4 H14 M2 8 H12 Q14 8 14 10 Q14 12 12 12 H8" stroke="#000" fill="none" strokeWidth="1.3" />
    <path d="M10 10 L8 12 L10 14" stroke="#C00" fill="none" strokeWidth="1.3" />
  </>, size
);

export const IcoShowWS = ({ size = SIZE }: P) => wrap(
  <>
    <circle cx="4" cy="8" r="1" fill="#808080" />
    <circle cx="8" cy="8" r="1" fill="#808080" />
    <circle cx="12" cy="8" r="1" fill="#808080" />
    <path d="M2 13 L14 13" stroke="#808080" />
  </>, size
);

export const IcoExplorer = ({ size = SIZE }: P) => wrap(
  <>
    <rect x="1" y="2" width="6" height="12" fill="#E4E1D1" stroke="#000" />
    <rect x="7" y="2" width="8" height="12" fill="#FFFFFF" stroke="#000" />
    <path d="M2 5 H6 M2 7 H6 M2 9 H5" stroke="#808080" />
  </>, size
);

export const IcoToolsPanel = ({ size = SIZE }: P) => wrap(
  <>
    <rect x="1" y="2" width="14" height="8" fill="#FFF" stroke="#000" />
    <rect x="1" y="10" width="14" height="4" fill="#E4E1D1" stroke="#000" />
    <path d="M4 12 H12" stroke="#808080" />
  </>, size
);

export const IcoMacroRec = ({ size = SIZE }: P) => wrap(
  <circle cx="8" cy="8" r="5" fill="#D00" stroke="#600" />, size
);

export const IcoMacroStop = ({ size = SIZE }: P) => wrap(
  <rect x="4" y="4" width="8" height="8" fill="#333" stroke="#000" />, size
);

export const IcoMacroPlay = ({ size = SIZE }: P) => wrap(
  <path d="M4 3 L13 8 L4 13 Z" fill="#0A0" stroke="#040" />, size
);

export const IcoSun = ({ size = SIZE }: P) => wrap(
  <>
    <circle cx="8" cy="8" r="3" fill="#F2C100" stroke="#8B6914" />
    <path d="M8 1 V3 M8 13 V15 M1 8 H3 M13 8 H15 M3 3 L4.5 4.5 M11.5 11.5 L13 13 M13 3 L11.5 4.5 M4.5 11.5 L3 13" stroke="#8B6914" />
  </>, size
);

export const IcoMoon = ({ size = SIZE }: P) => wrap(
  <path d="M11 2 A6 6 0 1 0 14 11 A5 5 0 0 1 11 2 Z" fill="#AACCFF" stroke="#335577" />, size
);
