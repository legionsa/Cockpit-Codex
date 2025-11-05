import { NextResponse } from 'next/server';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { mkdirSync } from 'fs';
import { validatePage } from '@/lib/pages';
import type { Page } from '@/lib/pages';

export async function POST(request: Request) {
  try {
    const { pages } = await request.json();

    if (!Array.isArray(pages)) {
      return NextResponse.json(
        { message: 'Invalid input: Expected an array of pages' },
        { status: 400 }
      );
    }

    // Validate each page
    const invalidPages = pages.filter(page => !validatePage(page));
    if (invalidPages.length > 0) {
      return NextResponse.json(
        { 
          message: 'Invalid pages found in import',
          details: invalidPages.map(p => p.id || 'unknown')
        },
        { status: 400 }
      );
    }

    const dataPath = join(process.cwd(), 'data');
    const pagesPath = join(dataPath, 'pages.json');

    // Create data directory if it doesn't exist
    if (!existsSync(dataPath)) {
      mkdirSync(dataPath, { recursive: true });
    }

    // Read existing pages
    let existingPages: Page[] = [];
    if (existsSync(pagesPath)) {
      const content = readFileSync(pagesPath, 'utf-8');
      existingPages = JSON.parse(content);
    }

    // Update existing pages and add new ones
    const updatedPages = [...existingPages];
    pages.forEach(newPage => {
      const index = updatedPages.findIndex(p => p.id === newPage.id);
      if (index !== -1) {
        updatedPages[index] = newPage;
      } else {
        updatedPages.push(newPage);
      }
    });

    // Save to file
    writeFileSync(pagesPath, JSON.stringify(updatedPages, null, 2));

    return NextResponse.json({ message: 'Pages imported successfully' });
  } catch (error) {
    console.error('Error importing pages:', error);
    return NextResponse.json(
      { message: 'Failed to import pages' },
      { status: 500 }
    );
  }
}