import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { Page } from '@/lib/pages';

const pagesDir = path.join(process.cwd(), 'src/data/pages');
const redirectsPath = path.join(process.cwd(), 'src/data/redirects.json');

// GET /api/pages/[id] - Get single page
export async function GET(request: Request) {
  const id = request.url.split('/').pop()!;
  try {
    const content = await fs.readFile(
      path.join(pagesDir, `${id}.json`),
      'utf8'
    );
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json(
      { error: 'Page not found' },
      { status: 404 }
    );
  }
}

// PUT /api/pages/[id] - Update page
export async function PUT(request: Request) {
  const id = request.url.split('/').pop()!;
  const data = await request.json();
  const filePath = path.join(pagesDir, `${id}.json`);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    const existingPage = JSON.parse(content);

    // If moving to a new parent, handle redirects
    if (data.parentId !== existingPage.parentId) {
      const redirectsContent = await fs.readFile(redirectsPath, 'utf8');
      const redirects = JSON.parse(redirectsContent);
      
      redirects.push({
        from: `/${existingPage.slug}`,
        to: `/${data.parentId ? `${data.parentId}/` : ''}${data.slug || existingPage.slug}`
      });

      await fs.writeFile(redirectsPath, JSON.stringify(redirects, null, 2));
    }

    const updatedPage: Page = {
      ...existingPage,
      ...data,
      id, // Prevent ID changes
      lastUpdated: new Date().toISOString()
    };

    await fs.writeFile(filePath, JSON.stringify(updatedPage, null, 2));
    return NextResponse.json(updatedPage);
  } catch {
    return NextResponse.json(
      { error: 'Page not found' },
      { status: 404 }
    );
  }
}

// DELETE /api/pages/[id] - Archive page
export async function DELETE(request: Request) {
  const id = request.url.split('/').pop()!;
  const filePath = path.join(pagesDir, `${id}.json`);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    const page = JSON.parse(content);

    // Soft delete by updating status
    const archivedPage = {
      ...page,
      status: 'Archived',
      lastUpdated: new Date().toISOString()
    };

    await fs.writeFile(filePath, JSON.stringify(archivedPage, null, 2));
    return NextResponse.json(archivedPage);
  } catch {
    return NextResponse.json(
      { error: 'Page not found' },
      { status: 404 }
    );
  }
}