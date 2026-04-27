import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Liest alle Clan-News aus dem Ordner assets/data/news/ (Decap CMS
// Folder Collection "News"). Pro Eintrag liegt dort eine JSON-Datei
// mit den Feldern id, game, type, text, createdAt.
export default async () => {
  const newsDir = join(process.cwd(), 'assets', 'data', 'news');

  let entries = [];
  try {
    const files = await readdir(newsDir);
    const jsonFiles = files.filter((f) => f.toLowerCase().endsWith('.json'));

    entries = await Promise.all(
      jsonFiles.map(async (file) => {
        const raw = await readFile(join(newsDir, file), 'utf-8');
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      })
    );
    entries = entries.filter(Boolean);
  } catch (err) {
    if (err && err.code !== 'ENOENT') {
      console.error('[api/news] read error:', err);
    }
    entries = [];
  }

  entries.sort((a, b) => {
    const ta = new Date(a && a.createdAt ? a.createdAt : 0).getTime();
    const tb = new Date(b && b.createdAt ? b.createdAt : 0).getTime();
    return tb - ta;
  });

  return new Response(JSON.stringify(entries), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=60'
    }
  });
};

export const config = {
  path: '/api/news'
};
