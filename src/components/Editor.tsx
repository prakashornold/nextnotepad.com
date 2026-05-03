import { useRef, useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  wordWrap: boolean;
  fontSize: number;
  tabSize: number;
  showWhitespace: boolean;
  onCursorChange: (line: number, col: number, selLen: number) => void;
};

export type EditorHandle = {
  getSelection: () => { start: number; end: number; value: string };
  setSelection: (start: number, end: number) => void;
  focus: () => void;
  gotoLine: (n: number) => void;
};

const Editor = forwardRef<EditorHandle, Props>(function Editor(
  { value, onChange, wordWrap, fontSize, tabSize, showWhitespace, onCursorChange }, ref
) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const lines = value.split('\n');
  const [currentLine, setCurrentLine] = useState(1);
  const [scrollTop, setScrollTop] = useState(0);
  const [listening, setListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [micLang, setMicLang] = useState<string>(() => {
    try { return localStorage.getItem('npp-mic-lang') || 'te-IN'; } catch { return 'te-IN'; }
  });
  const [showLangPicker, setShowLangPicker] = useState(false);
  const micLangRef = useRef(micLang);
  useEffect(() => { micLangRef.current = micLang; try { localStorage.setItem('npp-mic-lang', micLang); } catch { /* ignore */ } }, [micLang]);

  const LANGS: { code: string; label: string }[] = [
    { code: 'te-IN', label: 'Telugu' },
    { code: 'en-IN', label: 'English (India)' },
    { code: 'en-US', label: 'English (US)' },
    { code: 'en-GB', label: 'English (UK)' },
    { code: 'hi-IN', label: 'Hindi' },
    { code: 'ta-IN', label: 'Tamil' },
    { code: 'kn-IN', label: 'Kannada' },
    { code: 'ml-IN', label: 'Malayalam' },
    { code: 'mr-IN', label: 'Marathi' },
    { code: 'bn-IN', label: 'Bengali' },
    { code: 'gu-IN', label: 'Gujarati' },
    { code: 'pa-IN', label: 'Punjabi' },
    { code: 'ur-IN', label: 'Urdu' },
    { code: 'ar-SA', label: 'Arabic' },
    { code: 'es-ES', label: 'Spanish' },
    { code: 'fr-FR', label: 'French' },
    { code: 'de-DE', label: 'German' },
    { code: 'zh-CN', label: 'Chinese' },
    { code: 'ja-JP', label: 'Japanese' },
  ];
  const recogRef = useRef<any>(null);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const anchorRef = useRef<number>(0);
  const interimLenRef = useRef<number>(0);
  const manualStopRef = useRef<boolean>(false);
  const listeningRef = useRef<boolean>(false);
  const lineHeight = Math.round(fontSize * 1.4);

  useEffect(() => { valueRef.current = value; }, [value]);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { listeningRef.current = listening; }, [listening]);

  const SpeechRecognition: any = typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;
  const speechSupported = !!SpeechRecognition;

  const applyDictation = (text: string, commitFinal: boolean) => {
    const ta = taRef.current;
    const cur = valueRef.current;
    const anchor = anchorRef.current;
    const prevLen = interimLenRef.current;
    const nv = cur.substring(0, anchor) + text + cur.substring(anchor + prevLen);
    valueRef.current = nv;
    onChangeRef.current(nv);
    interimLenRef.current = commitFinal ? 0 : text.length;
    if (commitFinal) anchorRef.current = anchor + text.length;
    const caret = anchor + text.length;
    requestAnimationFrame(() => {
      if (ta) {
        try { ta.setSelectionRange(caret, caret); } catch { /* ignore */ }
      }
    });
  };

  const startRecog = () => {
    const r = new SpeechRecognition();
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 3;
    r.lang = micLangRef.current || 'te-IN';
    r.onresult = (ev: any) => {
      let finalChunk = '';
      let interimChunk = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const res = ev.results[i];
        const t = res[0].transcript;
        if (res.isFinal) finalChunk += t;
        else interimChunk += t;
      }
      if (finalChunk) {
        const needsLead = anchorRef.current > 0
          && !/\s$/.test(valueRef.current.slice(0, anchorRef.current));
        const text = (needsLead ? ' ' : '') + finalChunk.trim() + ' ';
        applyDictation(text, true);
      }
      if (interimChunk) {
        const needsLead = anchorRef.current > 0
          && !/\s$/.test(valueRef.current.slice(0, anchorRef.current));
        applyDictation((needsLead ? ' ' : '') + interimChunk, false);
      }
    };
    r.onerror = (ev: any) => {
      if (ev.error === 'no-speech' || ev.error === 'aborted' || ev.error === 'network') return;
      setSpeechError(ev.error === 'not-allowed' ? 'Microphone permission denied.' : `Speech error: ${ev.error}`);
      setTimeout(() => setSpeechError(null), 3500);
    };
    r.onend = () => {
      if (!manualStopRef.current && listeningRef.current) {
        setTimeout(() => {
          if (manualStopRef.current || !listeningRef.current) return;
          try { startRecog(); } catch { setListening(false); }
        }, 120);
        return;
      }
      setListening(false);
    };
    recogRef.current = r;
    r.start();
  };

  const toggleMic = () => {
    if (!speechSupported) {
      setSpeechError('Speech recognition not supported in this browser.');
      setTimeout(() => setSpeechError(null), 3000);
      return;
    }
    if (listening) {
      manualStopRef.current = true;
      try { recogRef.current?.stop(); } catch { /* ignore */ }
      return;
    }
    try {
      const ta = taRef.current;
      const start = ta ? ta.selectionStart : valueRef.current.length;
      anchorRef.current = start;
      interimLenRef.current = 0;
      manualStopRef.current = false;
      setListening(true);
      startRecog();
    } catch (err: any) {
      setListening(false);
      setSpeechError(err?.message || 'Failed to start speech recognition.');
      setTimeout(() => setSpeechError(null), 3000);
    }
  };

  useEffect(() => () => {
    manualStopRef.current = true;
    try { recogRef.current?.stop(); } catch { /* ignore */ }
  }, []);

  useImperativeHandle(ref, () => ({
    getSelection: () => {
      const ta = taRef.current!;
      return { start: ta.selectionStart, end: ta.selectionEnd, value: ta.value };
    },
    setSelection: (s, e) => {
      const ta = taRef.current!;
      ta.focus();
      ta.setSelectionRange(s, e);
    },
    focus: () => taRef.current?.focus(),
    gotoLine: (n) => {
      const ta = taRef.current!;
      const parts = ta.value.split('\n');
      const target = Math.max(1, Math.min(n, parts.length));
      let pos = 0;
      for (let i = 0; i < target - 1; i++) pos += parts[i].length + 1;
      ta.focus();
      ta.setSelectionRange(pos, pos + (parts[target - 1]?.length || 0));
    }
  }));

  const handleCursor = () => {
    const ta = taRef.current;
    if (!ta) return;
    const before = ta.value.substring(0, ta.selectionStart);
    const line = before.split('\n').length;
    const col = before.length - before.lastIndexOf('\n');
    const selLen = ta.selectionEnd - ta.selectionStart;
    setCurrentLine(line);
    onCursorChange(line, col, selLen);
  };

  useEffect(handleCursor, [value]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const s = ta.selectionStart, en = ta.selectionEnd;
      const spaces = ' '.repeat(tabSize);
      const nv = ta.value.substring(0, s) + spaces + ta.value.substring(en);
      onChange(nv);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + spaces.length; });
    }
  };

  const syncScroll = () => {
    if (taRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop;
      setScrollTop(taRef.current.scrollTop);
    }
  };

  // optional whitespace rendering (light overlay)
  const display = showWhitespace ? value.replace(/ /g, '·').replace(/\t/g, '→   ') : value;

  return (
    <div className="npp-editor-wrap">
      <div
        ref={gutterRef}
        className="npp-gutter scrollbar-thin"
        style={{ fontSize, lineHeight: `${lineHeight}px`, overflow: 'hidden' }}
      >
        {lines.map((_, i) => (
          <div key={i} className={`npp-gutter-line ${i + 1 === currentLine ? 'current' : ''}`} style={{ height: lineHeight }}>
            {i + 1}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <div
          className="npp-current-line"
          style={{
            top: 4 + (currentLine - 1) * lineHeight - scrollTop,
            height: lineHeight,
          }}
        />
        {showWhitespace && (
          <pre className="mono" aria-hidden style={{
            position: 'absolute', inset: 0, margin: 0, padding: '4px 8px',
            pointerEvents: 'none', color: '#bbb', fontSize,
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
            lineHeight: 1.4
          }}>{display}</pre>
        )}
        <button
          type="button"
          onClick={toggleMic}
          className="npp-mic-btn"
          title={listening ? 'Stop dictation' : `Start voice dictation (${LANGS.find(l => l.code === micLang)?.label || micLang})`}
          aria-label={listening ? 'Stop dictation' : 'Start voice dictation'}
          data-active={listening ? 'true' : 'false'}
        >
          {listening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
        <button
          type="button"
          onClick={() => setShowLangPicker(s => !s)}
          className="npp-mic-lang-btn"
          title="Choose dictation language"
        >
          {LANGS.find(l => l.code === micLang)?.label?.slice(0, 3).toUpperCase() || micLang.slice(0, 2).toUpperCase()}
        </button>
        {showLangPicker && (
          <>
            <div className="fixed inset-0" style={{ zIndex: 4 }} onClick={() => setShowLangPicker(false)} />
            <div className="npp-mic-lang-menu scrollbar-thin">
              {LANGS.map(l => (
                <div
                  key={l.code}
                  className={`npp-mic-lang-item ${l.code === micLang ? 'active' : ''}`}
                  onClick={() => {
                    setMicLang(l.code);
                    setShowLangPicker(false);
                    if (listeningRef.current) {
                      try { recogRef.current?.stop(); } catch { /* ignore */ }
                    }
                  }}
                >
                  {l.label}
                </div>
              ))}
            </div>
          </>
        )}
        {speechError && <div className="npp-mic-toast">{speechError}</div>}
        <textarea
          ref={taRef}
          className="npp-code scrollbar-thin"
          style={{
            fontSize,
            lineHeight: `${lineHeight}px`,
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
            overflowWrap: wordWrap ? 'break-word' : 'normal',
            background: 'transparent',
            position: 'relative',
            zIndex: 1,
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          onSelect={handleCursor}
          onClick={handleCursor}
          onKeyUp={handleCursor}
          onScroll={syncScroll}
          spellCheck={false}
        />
      </div>
    </div>
  );
});

export default Editor;
