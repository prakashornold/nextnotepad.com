import { useState } from 'react';

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const num = parseInt(n, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export default function ColorTool() {
  const [color, setColor] = useState('#BD93F9');
  const [bg, setBg] = useState('#1e1e1e');
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const fgL = luminance(rgb.r, rgb.g, rgb.b);
  const bgRgb = hexToRgb(bg);
  const bgL = luminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const ratio = (Math.max(fgL, bgL) + 0.05) / (Math.min(fgL, bgL) + 0.05);

  return (
    <div className="h-full flex gap-4 p-3">
      <div className="flex flex-col gap-3 w-64">
        <label className="text-[12px] text-[#bfbfbf]">Foreground</label>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-16 rounded cursor-pointer" />
        <input className="tool-input mono" value={color} onChange={e => setColor(e.target.value)} />
        <label className="text-[12px] text-[#bfbfbf] mt-2">Background</label>
        <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-full h-12 rounded cursor-pointer" />
        <input className="tool-input mono" value={bg} onChange={e => setBg(e.target.value)} />
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2 text-[12px]">
          <div className="bg-[#1e1e1e] p-3 rounded border border-[#3c3c3c]">
            <div className="text-[#bfbfbf] mb-1">HEX</div>
            <div className="mono text-[#BD93F9]">{color.toUpperCase()}</div>
          </div>
          <div className="bg-[#1e1e1e] p-3 rounded border border-[#3c3c3c]">
            <div className="text-[#bfbfbf] mb-1">RGB</div>
            <div className="mono text-[#BD93F9]">rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
          </div>
          <div className="bg-[#1e1e1e] p-3 rounded border border-[#3c3c3c]">
            <div className="text-[#bfbfbf] mb-1">HSL</div>
            <div className="mono text-[#BD93F9]">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
          </div>
        </div>
        <div className="flex-1 rounded border border-[#3c3c3c] flex items-center justify-center text-xl mono" style={{ background: bg, color }}>
          The quick brown fox jumps over the lazy dog
        </div>
        <div className="grid grid-cols-4 gap-2 text-[12px] text-center">
          <div className="bg-[#1e1e1e] p-2 rounded border border-[#3c3c3c]">
            <div className="text-[#bfbfbf]">Contrast</div>
            <div className="mono text-[#BD93F9] text-lg">{ratio.toFixed(2)}:1</div>
          </div>
          <div className={`p-2 rounded border border-[#3c3c3c] ${ratio >= 4.5 ? 'bg-green-900/40' : 'bg-red-900/40'}`}>
            <div className="text-[#bfbfbf]">AA Normal</div>
            <div>{ratio >= 4.5 ? 'Pass' : 'Fail'}</div>
          </div>
          <div className={`p-2 rounded border border-[#3c3c3c] ${ratio >= 3 ? 'bg-green-900/40' : 'bg-red-900/40'}`}>
            <div className="text-[#bfbfbf]">AA Large</div>
            <div>{ratio >= 3 ? 'Pass' : 'Fail'}</div>
          </div>
          <div className={`p-2 rounded border border-[#3c3c3c] ${ratio >= 7 ? 'bg-green-900/40' : 'bg-red-900/40'}`}>
            <div className="text-[#bfbfbf]">AAA</div>
            <div>{ratio >= 7 ? 'Pass' : 'Fail'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
