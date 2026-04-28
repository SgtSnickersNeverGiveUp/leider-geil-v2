// News-API: liest alle JSON-Dateien aus dem Repo-Ordner `assets/data/news/`
// (relativ zum Projekt-Root) ein und gibt sie als JSON-Array zurück.
//
// Damit die JSON-Dateien zur Laufzeit der Function existieren, werden sie
// per `included_files = ["assets/data/news/**"]` in `netlify.toml` mit ins
// Function-Bundle aufgenommen. Netlify legt sie dann unter dem gleichen
// relativen Pfad ab, weshalb hier `process.cwd()/assets/data/news/` als
// Quelle verwendet wird.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const NEWS_DIR = join(process.cwd(), 'assets', 'data', 'news')

export default async () => {
  let files: string[] = []
  try {
    files = readdirSync(NEWS_DIR).filter((f) => f.toLowerCase().endsWith('.json'))
  } catch (err) {
    console.error(`[/api/news] News-Ordner konnte nicht gelesen werden (${NEWS_DIR}):`, err)
    return Response.json([], { headers: { 'cache-control': 'no-store' } })
  }

  const entries: unknown[] = []
  for (const file of files) {
    const filePath = join(NEWS_DIR, file)
    try {
      const raw = readFileSync(filePath, 'utf8')
      entries.push(JSON.parse(raw))
    } catch (err) {
      console.warn(
        `[/api/news] Ungültiges JSON in ${file} – Datei wird übersprungen:`,
        (err as Error).message,
      )
    }
  }

  return Response.json(entries, { headers: { 'cache-control': 'no-store' } })
}

export const config = {
  path: '/api/news',
}
