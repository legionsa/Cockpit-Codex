import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { Page } from '@/lib/pages';

const pagesDir = path.join(process.cwd(), 'src/data/pages');

export async function POST(request: Request) {
  const { pages, action } = await request.json();
  
  try {
    switch (action) {
      case 'import':
        await handleImport(pages);
        break;
      case 'bulkPublish':
        await handleBulkAction(pages, 'Published');
        break;
      case 'bulkArchive':
        await handleBulkAction(pages, 'Archived');
        break;
      case 'bulkDelete':
        await handleBulkDelete(pages);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bulk action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk action' },
      { status: 500 }
    );
  }
}

async function handleImport(pages: Page[]) {
  // Validate pages
  for (const page of pages) {
    if (!page.id || !page.title || !page.slug || page.parentId === undefined) {
      throw new Error('Invalid page data');
    }
  }

  // Write each page to file
  for (const page of pages) {
    const filePath = path.join(pagesDir, `${page.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(page, null, 2));
  }
}

async function handleBulkAction(pageIds: string[], status: 'Published' | 'Archived') {
  for (const id of pageIds) {
    const filePath = path.join(pagesDir, `${id}.json`);
    const content = await fs.readFile(filePath, 'utf8');
    const page = JSON.parse(content);
    
    const updatedPage = {
      ...page,
      status,
      lastUpdated: new Date().toISOString()
    };
    
    await fs.writeFile(filePath, JSON.stringify(updatedPage, null, 2));
  }
}

async function handleBulkDelete(pageIds: string[]) {
  for (const id of pageIds) {
    const filePath = path.join(pagesDir, `${id}.json`);
    await fs.unlink(filePath);
  }
}