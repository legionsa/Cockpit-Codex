import { useState, useRef } from 'react';
import type { Page } from '@/lib/pages';

interface ImportExportActionsProps {
  onImport: (pages: Page[]) => Promise<void>;
  onExport: (pageIds: string[]) => Promise<void>;
  selectedPageIds: string[];
  className?: string;
}

export default function ImportExportActions({
  onImport,
  onExport,
  selectedPageIds,
  className = ''
}: ImportExportActionsProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError('');

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Basic validation
      if (!Array.isArray(data)) {
        throw new Error('Invalid file format. Expected an array of pages.');
      }

      // More detailed validation could be added here

      await onImport(data);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import file');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      await onExport(selectedPageIds);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={handleImport}
          className="hidden"
          id="import-json"
        />
        <label
          htmlFor="import-json"
          className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
            isImporting ? 'opacity-75 cursor-wait' : ''
          }`}
        >
          {isImporting ? 'Importing...' : 'Import JSON'}
        </label>
      </div>

      <button
        onClick={handleExport}
        disabled={selectedPageIds.length === 0}
        className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          selectedPageIds.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        }`}
      >
        {selectedPageIds.length === 0 ? 'Select pages to export' : 'Export Selected'}
      </button>

      {importError && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {importError}
        </div>
      )}
    </div>
  );
}