export function detectLanguage(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const map: Record<string, string> = {
    js: 'javascript', mjs: 'javascript', cjs: 'javascript',
    ts: 'typescript', tsx: 'typescript', jsx: 'javascript',
    py: 'python', rb: 'ruby', go: 'go', rs: 'rust',
    java: 'java', kt: 'kotlin', swift: 'swift',
    c: 'c', h: 'c', cpp: 'cpp', hpp: 'cpp', cc: 'cpp', cs: 'csharp',
    php: 'php', html: 'html', htm: 'html', css: 'css', scss: 'scss', sass: 'sass',
    json: 'json', xml: 'xml', yml: 'yaml', yaml: 'yaml', toml: 'toml',
    sql: 'sql', md: 'markdown', sh: 'shell', bash: 'shell', ps1: 'powershell',
    dockerfile: 'dockerfile', graphql: 'graphql', gql: 'graphql',
    txt: 'plaintext',
  };
  return map[ext] || 'plaintext';
}

export const LANGUAGES = [
  'plaintext','javascript','typescript','python','ruby','go','rust','java','kotlin','swift',
  'c','cpp','csharp','php','html','css','scss','json','xml','yaml','toml','sql','markdown',
  'shell','powershell','dockerfile','graphql'
];
