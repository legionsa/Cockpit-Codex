import { useState } from 'react';
import type { Page } from '@/lib/pages';

interface DashboardSearchProps {
  pages: Page[];
  onFilter: (filtered: Page[]) => void;
  onBulkAction: (action: 'publish' | 'archive' | 'delete', pageIds: string[]) => void;
  selectedPageIds: string[];
}

export default function DashboardSearch({ pages, onFilter, onBulkAction, selectedPageIds }: DashboardSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'lastUpdated'>('lastUpdated');
  const [filterType, setFilterType] = useState<'all' | 'foundations' | 'components'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Draft' | 'Published' | 'Archived'>('all');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, sortBy, filterType, filterStatus);
  };

  const handleSortChange = (value: 'title' | 'lastUpdated') => {
    setSortBy(value);
    applyFilters(searchTerm, value, filterType, filterStatus);
  };

  const handleTypeFilter = (value: 'all' | 'foundations' | 'components') => {
    setFilterType(value);
    applyFilters(searchTerm, sortBy, value, filterStatus);
  };

  const handleStatusFilter = (value: 'all' | 'Draft' | 'Published' | 'Archived') => {
    setFilterStatus(value);
    applyFilters(searchTerm, sortBy, filterType, value);
  };

  const applyFilters = (
    search: string,
    sort: 'title' | 'lastUpdated',
    type: 'all' | 'foundations' | 'components',
    status: 'all' | 'Draft' | 'Published' | 'Archived'
  ) => {
    let filtered = [...pages];

    // Apply search
    if (search) {
      filtered = filtered.filter(page =>
        page.title.toLowerCase().includes(search.toLowerCase()) ||
        (page.content?.toLowerCase() || '').includes(search.toLowerCase())
      );
    }

    // Apply type filter
    if (type !== 'all') {
      filtered = filtered.filter(page =>
        type === 'foundations' ? page.parentId === 'foundations' : page.parentId === 'components'
      );
    }

    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(page => page.status === status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sort === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
    });

    onFilter(filtered);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div className="flex gap-4 items-center">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as 'title' | 'lastUpdated')}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="lastUpdated">Sort by: Last Updated</option>
            <option value="title">Sort by: Title</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => handleTypeFilter(e.target.value as 'all' | 'foundations' | 'components')}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">All Types</option>
            <option value="foundations">Foundations</option>
            <option value="components">Components</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => handleStatusFilter(e.target.value as 'all' | 'Draft' | 'Published' | 'Archived')}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>
          {selectedPageIds.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => onBulkAction('publish', selectedPageIds)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Publish Selected
              </button>
              <button
                onClick={() => onBulkAction('archive', selectedPageIds)}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Archive Selected
              </button>
              <button
                onClick={() => onBulkAction('delete', selectedPageIds)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}