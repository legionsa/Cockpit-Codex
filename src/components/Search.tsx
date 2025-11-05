import { useEffect, useState, useCallback } from 'react';
import Fuse from 'fuse.js';
import type { Page } from '@/lib/pages';

interface SearchProps {
  onSearch: (query: string) => void;
  searchResults: Page[];
  isLoading: boolean;
}

export default function Search({ onSearch, searchResults, isLoading }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Toggle search with Cmd+K or /
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (!e.metaKey && !e.ctrlKey && e.key === '/')) {
      e.preventDefault();
      setIsOpen(true);
    }
    // Close with Escape
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (query) {
      onSearch(query);
    }
  }, [query, onSearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[20vh] px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages..."
              className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-gray-100 text-lg placeholder-gray-400"
              autoFocus
            />
            <kbd className="hidden sm:block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded">
              ESC to close
            </kbd>
          </div>
        </div>

        {query && (
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Searching...
              </div>
            ) : searchResults.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {searchResults.map((result) => (
                  <li key={result.id}>
                    <a
                      href={`/${result.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {result.parentId ? result.parentId.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' › ') + ' › ' : ''}
                        {result.title}
                      </div>
                      {result.summary && (
                        <div className="mt-1 text-sm text-gray-500">
                          {result.summary}
                        </div>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}