import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { generateSlug } from '@/lib/pages';
import type { Page } from '@/lib/pages';

const pagesDir = path.join(process.cwd(), 'src/data/pages');
const redirectsPath = path.join(process.cwd(), 'src/data/redirects.json');

// GET /api/pages - List all pages
export async function GET() {
  const files = await fs.readdir(pagesDir);
  const pages = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(path.join(pagesDir, file), 'utf8');
      return JSON.parse(content);
    })
  );
  
  return NextResponse.json(pages);
}

// POST /api/pages - Create new page
export async function POST(request: Request) {
  const data = await request.json();
  const { title, parentId } = data;
  
  if (!title) {
    return NextResponse.json(
      { error: 'Title is required' },
      { status: 400 }
    );
  }

  const slug = generateSlug(title);
  const id = parentId ? `${parentId}-${slug}` : slug;
  
  // Check for existing page with same slug under same parent
  try {
    await fs.access(path.join(pagesDir, `${id}.json`));
    return NextResponse.json(
      { error: 'Page with this slug already exists under the selected parent' },
      { status: 409 }
    );
  } catch {
    // File doesn't exist, we can proceed
  }

  const page: Page = {
    id,
    title,
    slug,
    parentId,
    order: Date.now(), // Temporary order, should be managed properly
    contentType: 'markdown',
    content: '',
    status: 'Draft',
    lastUpdated: new Date().toISOString(),
    ...data
  };

  await fs.writeFile(
    path.join(pagesDir, `${id}.json`),
    JSON.stringify(page, null, 2)
  );

  return NextResponse.json(page);
}