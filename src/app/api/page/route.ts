import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { generateSlug } from '@/lib/pages';

const pagesDir = path.join(process.cwd(), 'src/data/pages');

export async function PUT(request: Request) {
  // Create new page (codex.docs uses PUT for create)
  const data = await request.json();

  const editorBody = data.body || {};
  const parent = data.parent || null;
  const uri = data.uri || '';

  // Derive title from first header block if present
  let title = 'Untitled';
  try {
    const first = (editorBody.blocks && editorBody.blocks[0]) || null;
    if (first && first.type === 'header' && first.data && first.data.text) title = first.data.text;
  } catch (e) {}

  const slug = uri || generateSlug(title);
  const id = parent ? `${parent}-${slug}` : slug;

  const page = {
    id,
    title,
    slug,
    parentId: parent,
    order: Date.now(),
    contentType: 'editorjs',
    editorBody,
    status: 'Draft',
    lastUpdated: new Date().toISOString(),
  };

  try {
    await fs.writeFile(path.join(pagesDir, `${id}.json`), JSON.stringify(page, null, 2));
    return NextResponse.json({ success: true, result: { uri: `/${page.slug}`, _id: id } });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to create page' }, { status: 500 });
  }
}
