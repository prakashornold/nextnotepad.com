import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { applyInitialTheme } from './lib/theme';

applyInitialTheme();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(<App />);
