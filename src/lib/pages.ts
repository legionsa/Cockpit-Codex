export interface Page {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  order: number;
  summary?: string;
  contentType: 'markdown';
  content: string;
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