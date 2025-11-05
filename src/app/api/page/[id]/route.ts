import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src/data/pages');

export async function GET(request: Request) {
  const id = request.url.split('/').pop();
  if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });

  try {
    const content = await fs.readFile(path.join(pagesDir, `${id}.json`), 'utf8');
    const page = JSON.parse(content);
    // codex.docs expects fields like _id and body
    const result = Object.assign({}, page, { _id: page.id, _parent: page.parentId, body: page.editorBody || null });
    return NextResponse.json({ success: true, result });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
  }
}

export async function POST(request: Request) {
  // codex.docs uses POST to update an existing page at /api/page/:id
  const id = request.url.split('/').pop();
  if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });

  const data = await request.json();

  try {
    const filePath = path.join(pagesDir, `${id}.json`);
    const content = await fs.readFile(filePath, 'utf8');
    const existing = JSON.parse(content);

    const editorBody = data.body || existing.editorBody;
    const parent = data.parent || existing.parentId;
    const uri = data.uri || existing.slug;
    const title = (editorBody && editorBody.blocks && editorBody.blocks[0] && editorBody.blocks[0].data && editorBody.blocks[0].data.text) || existing.title;

    const updated = {
      ...existing,
      title,
      slug: uri,
      parentId: parent,
      editorBody,
      lastUpdated: new Date().toISOString(),
    };

    await fs.writeFile(filePath, JSON.stringify(updated, null, 2));
    return NextResponse.json({ success: true, result: { _id: id, uri: `/${updated.slug}` } });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const id = request.url.split('/').pop();
  if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });

  try {
    const filePath = path.join(pagesDir, `${id}.json`);
    const content = await fs.readFile(filePath, 'utf8');
    const page = JSON.parse(content);

    const archived = {
      ...page,
      status: 'Archived',
      lastUpdated: new Date().toISOString(),
    };

    await fs.writeFile(filePath, JSON.stringify(archived, null, 2));
    return NextResponse.json({ success: true, result: { _id: id } });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to archive page' }, { status: 500 });
  }
}
