import fs from 'fs';
import path from 'path';

export default function Home() {
  const pagesDir = path.join(process.cwd(), 'src/data/pages');
  let pages: any[] = [];
  try {
    const files = fs.readdirSync(pagesDir);
    pages = files.map((f) => {
      try {
        const content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
        return JSON.parse(content);
      } catch (e) { return null; }
    }).filter(Boolean);
  } catch (e) {
    pages = [];
  }

  return (
    <main className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">Cockpit Design System Codex</h1>
      <p className="text-lg mb-8">Your central source for design system documentation</p>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Pages</h2>
        <ul className="space-y-3">
          {pages.map((p: any) => (
            <li key={p.id} className="p-4 bg-white rounded shadow">
              <a href={`/page/${p.id}`} className="text-lg font-medium text-blue-600">{p.title}</a>
              <div className="text-sm text-gray-500">{p.summary || ''}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}