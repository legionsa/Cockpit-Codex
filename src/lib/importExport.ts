import type { Page } from './pages';

export interface ExportData {
  version: string;
  exportDate: string;
  pages: Page[];
}

export async function exportPages(pages: Page[]): Promise<string> {
  const exportData: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    pages
  };
  
  return JSON.stringify(exportData, null, 2);
}

export async function importPages(jsonData: string): Promise<Page[]> {
  try {
    const data: ExportData = JSON.parse(jsonData);
    
    // Basic validation
    if (!data.version || !data.pages || !Array.isArray(data.pages)) {
      throw new Error('Invalid file format');
    }

    // Validate each page
    data.pages.forEach(page => {
      if (!page.id || !page.title || !page.slug || page.parentId === undefined) {
        throw new Error('Invalid page data');
      }
    });

    return data.pages;
  } catch (error) {
    throw new Error('Failed to parse import file');
  }
}

export function downloadJson(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}