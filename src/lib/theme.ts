export type Theme = 'light' | 'dark';

const KEY = 'nextnotepad_theme';

export function getTheme(): Theme {
  const v = localStorage.getItem(KEY);
  if (v === 'light' || v === 'dark') return v;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setTheme(t: Theme) {
  localStorage.setItem(KEY, t);
  document.documentElement.classList.remove('theme-light', 'theme-dark');
  document.documentElement.classList.add(`theme-${t}`);
}

export function applyInitialTheme() {
  setTheme(getTheme());
}
