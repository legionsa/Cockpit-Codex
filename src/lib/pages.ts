import type { Block } from './blocks';
import { validateBlock } from './blocks';

export interface Page {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  order: number;
  summary?: string;
  // legacy markdown fields kept for compatibility
  contentType?: 'markdown';
  content?: string;
  // blocks-based content (preferred)
  blocks?: Block[];
  figmaEmbedUrl?: string;
  codeSnippets?: {
    react?: string;
    tailwind?: string;
    tokensJson?: string;
  };
  tags?: string[];
  status: 'Draft' | 'Published' | 'Archived';
  version?: string;
  lastUpdated: string;
  children?: Page[];
}

  export function validatePage(page: unknown): page is Page {
    if (!page || typeof page !== 'object') return false;

    const p = page as Partial<Page>;
  
    // Required fields (lean validation)
    if (
      typeof p.id !== 'string' ||
      typeof p.title !== 'string' ||
      typeof p.slug !== 'string' ||
      typeof p.order !== 'number' ||
      typeof p.lastUpdated !== 'string' ||
      !['Draft', 'Published', 'Archived'].includes(p.status || '')
    ) {
      return false;
    }

    // Optional fields
    if (
      (p.parentId !== undefined && p.parentId !== null && typeof p.parentId !== 'string') ||
      (p.summary !== undefined && typeof p.summary !== 'string') ||
      (p.figmaEmbedUrl !== undefined && typeof p.figmaEmbedUrl !== 'string') ||
      (p.version !== undefined && typeof p.version !== 'string') ||
      (p.tags !== undefined && (!Array.isArray(p.tags) || !p.tags.every(tag => typeof tag === 'string')))
    ) {
      return false;
    }

    // Code snippets validation
    if (p.codeSnippets !== undefined) {
      const snippets = p.codeSnippets as Record<string, unknown>;
      if (
        typeof snippets !== 'object' ||
        (snippets.react !== undefined && typeof snippets.react !== 'string') ||
        (snippets.tailwind !== undefined && typeof snippets.tailwind !== 'string') ||
        (snippets.tokensJson !== undefined && typeof snippets.tokensJson !== 'string')
      ) {
        return false;
      }
    }

    // Blocks validation (if present)
    if (p.blocks !== undefined) {
      if (!Array.isArray(p.blocks)) return false;
      for (const b of p.blocks) {
        if (!validateBlock(b)) return false;
      }
    }

    return true;
  }

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function buildBreadcrumbs(pages: Page[], currentPageId: string): Array<{ title: string; href: string }> {
  const breadcrumbs: Array<{ title: string; href: string }> = [];
  let currentPage = pages.find(p => p.id === currentPageId);
  
  while (currentPage) {
    breadcrumbs.unshift({
      title: currentPage.title,
      href: `/${currentPage.slug}`
    });
    
    const parentId = currentPage.parentId;
    if (parentId) {
      const parentPage = pages.find(p => p.id === parentId);
      if (!parentPage) break;
      currentPage = parentPage;
    } else {
      break;
    }
  }
  
  return breadcrumbs;
}

export function buildPageTree(pages: Page[]): Page[] {
  const pageMap = new Map(pages.map(page => [page.id, { ...page, children: [] as Page[] }]));
  const tree: Page[] = [];
  
  pages.forEach(page => {
    if (page.parentId) {
      const parent = pageMap.get(page.parentId);
      const currentPage = pageMap.get(page.id);
      if (parent && currentPage) {
        parent.children = parent.children || [];
        parent.children.push(currentPage);
      }
    } else {
      const rootPage = pageMap.get(page.id);
      if (rootPage) {
        tree.push(rootPage);
      }
    }
  });
  
  return tree;
}