'use client';

import { useState, useEffect } from 'react';
import PageEditor from '@/components/PageEditor';
import type { Page } from '@/lib/pages';

export default function Dashboard() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isFoundations, setIsFoundations] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      setPages(data);
    } catch (err) {
      setError('Failed to load pages');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(pageData: Partial<Page>) {
    try {
      if (selectedPage) {
        // Update existing page
        const res = await fetch(`/api/pages/${selectedPage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pageData)
        });
        
        if (!res.ok) throw new Error('Failed to update page');
        
        const updatedPage = await res.json();
        setPages(prev => prev.map(p => 
          p.id === updatedPage.id ? updatedPage : p
        ));
        setSelectedPage(null);
      } else {
        // Create new page
        const res = await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...pageData,
            parentId: isFoundations ? 'foundations' : 'components'
          })
        });
        
        if (!res.ok) throw new Error('Failed to create page');
        
        const newPage = await res.json();
        setPages(prev => [...prev, newPage]);
        setIsCreating(false);
      }
    } catch (err) {
      setError('Failed to save page');
    }
  }

  async function handleDelete(page: Page) {
    if (!confirm('Are you sure you want to archive this page?')) return;

    try {
      const res = await fetch(`/api/pages/${page.id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Failed to archive page');
      
      const archivedPage = await res.json();
      setPages(prev => prev.map(p => 
        p.id === archivedPage.id ? archivedPage : p
      ));
      setSelectedPage(null);
    } catch (err) {
      setError('Failed to archive page');
    }
  }

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <div className="space-x-4">
            <button
              onClick={() => {
                setSelectedPage(null);
                setIsCreating(true);
                setIsFoundations(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              New Foundations Page
            </button>
            <button
              onClick={() => {
                setSelectedPage(null);
                setIsCreating(true);
                setIsFoundations(false);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              New Components Page
            </button>
            <button
              onClick={() => {
                document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                window.location.href = '/logindash';
              }}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {(isCreating || selectedPage) ? (
          <PageEditor
            page={selectedPage || undefined}
            parentId={isFoundations ? 'foundations' : 'components'}
            onSave={handleSave}
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {pages.map(page => (
                  <tr key={page.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {page.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {page.parentId === 'foundations' ? 'Foundation' : 'Component'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        page.status === 'Published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : page.status === 'Draft'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(page.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedPage(page)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(page)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}