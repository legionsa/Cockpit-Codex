import { useState, useEffect } from 'react';
import type { Page } from '@/lib/pages';
import BlockEditor from '@/components/BlockEditor/BlockEditor';
import type { Block } from '@/lib/blocks';

interface PageEditorProps {
  page?: Page;
  parentId?: string;
  onSave: (page: Partial<Page>) => Promise<void>;
}

export default function PageEditor({ page, parentId, onSave }: PageEditorProps) {
  const [formData, setFormData] = useState<Partial<Page>>({
    title: '',
    summary: '',
    content: '',
    figmaEmbedUrl: '',
    tags: [],
    status: 'Draft',
    codeSnippets: {
      react: '',
      tailwind: '',
      tokensJson: ''
    },
    parentId
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (page) {
      setFormData(page);
    }
  }, [page]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSave(formData);
    } catch (err) {
      setError('Failed to save page');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
      <div>
        <label className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Summary
        </label>
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          className="w-full px-3 py-2 border rounded-md"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Content
        </label>
        <BlockEditor
          initialBlocks={formData.blocks || []}
          onChange={(blocks) => setFormData(prev => ({ ...prev, blocks }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Figma Embed URL
        </label>
        <input
          type="url"
          value={formData.figmaEmbedUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, figmaEmbedUrl: e.target.value }))}
          className="w-full px-3 py-2 border rounded-md"
          pattern="https://www\\.figma\\.com/embed.*"
          title="Must be a valid Figma embed URL"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            React Code
          </label>
          <textarea
            value={formData.codeSnippets?.react}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              codeSnippets: {
                ...prev.codeSnippets,
                react: e.target.value
              }
            }))}
            className="w-full px-3 py-2 border rounded-md font-mono"
            rows={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tailwind Code
          </label>
          <textarea
            value={formData.codeSnippets?.tailwind}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              codeSnippets: {
                ...prev.codeSnippets,
                tailwind: e.target.value
              }
            }))}
            className="w-full px-3 py-2 border rounded-md font-mono"
            rows={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tokens JSON
          </label>
          <textarea
            value={formData.codeSnippets?.tokensJson}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              codeSnippets: {
                ...prev.codeSnippets,
                tokensJson: e.target.value
              }
            }))}
            className="w-full px-3 py-2 border rounded-md font-mono"
            rows={6}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags?.join(', ')}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
          }))}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            status: e.target.value as Page['status']
          }))}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}