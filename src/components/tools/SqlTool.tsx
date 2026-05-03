import { useState } from 'react';

function formatSql(sql: string): string {
  const keywords = ['SELECT','FROM','WHERE','AND','OR','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN','OUTER JOIN','ON','GROUP BY','ORDER BY','HAVING','LIMIT','OFFSET','INSERT INTO','VALUES','UPDATE','SET','DELETE FROM','CREATE TABLE','ALTER TABLE','DROP TABLE','UNION','AS','CASE','WHEN','THEN','ELSE','END'];
  let out = sql.replace(/\s+/g, ' ').trim();
  keywords.sort((a, b) => b.length - a.length).forEach(kw => {
    const re = new RegExp('\\b' + kw.replace(' ', '\\s+') + '\\b', 'gi');
    out = out.replace(re, '\n' + kw.toUpperCase());
  });
  return out.trim();
}

export default function SqlTool() {
  const [sql, setSql] = useState('select id, name from users where status = 1 order by name limit 10;');
  const [out, setOut] = useState('');
  return (
    <div className="h-full flex flex-col gap-2 p-3">
      <div className="flex gap-2">
        <button className="tool-btn primary" onClick={() => setOut(formatSql(sql))}>Format</button>
        <button className="tool-btn" onClick={() => setOut(sql.replace(/\s+/g, ' ').trim())}>Minify</button>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2 min-h-0">
        <textarea className="tool-textarea mono scrollbar-thin" value={sql} onChange={e => setSql(e.target.value)} />
        <textarea className="tool-textarea mono scrollbar-thin" value={out} readOnly />
      </div>
    </div>
  );
}
