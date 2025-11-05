'use client';

import { Block } from '@/lib/blocks';
import { useState } from 'react';

interface BlockRendererProps {
  block: Block;
  onUpdate: (content: string) => void;
  onDelete: () => void;
}

export default function BlockRenderer({ block, onUpdate, onDelete }: BlockRendererProps) {
  const [isEditing, setIsEditing] = useState(true);

  const renderEditableContent = () => {
    switch (block.type) {
      case 'heading':
        return (
          <input
            type="text"
            value={block.content}
            onChange={(e) => onUpdate(e.target.value)}
            className="w-full p-2 text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        );
      case 'paragraph':
        return (
          <textarea
            value={block.content}
            onChange={(e) => onUpdate(e.target.value)}
            className="w-full p-2 bg-transparent border-none resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
          />
        );
      case 'image':
        return (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={block.src}
              onChange={(e) => onUpdate(e.target.value)}
              placeholder="Image URL"
              className="w-full p-2 bg-transparent border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {block.src && (
              <img src={block.src} alt={block.alt || ''} className="max-w-full h-auto" />
            )}
          </div>
        );
      case 'list':
        return (
          <textarea
            value={block.items.join('\n')}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="One item per line"
            className="w-full p-2 bg-transparent border-none resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={Math.max(3, block.items.length)}
          />
        );
      case 'quote':
        return (
          <div className="flex flex-col gap-2">
            <textarea
              value={block.content}
              onChange={(e) => onUpdate(e.target.value)}
              className="w-full p-2 bg-transparent border-none resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={2}
            />
          </div>
        );
      case 'code':
        return (
          <div className="flex flex-col gap-2">
            <textarea
              value={block.content}
              onChange={(e) => onUpdate(e.target.value)}
              className="w-full p-2 font-mono bg-gray-800 text-gray-100 border-none resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={5}
            />
          </div>
        );
      default:
        return <div>Unsupported block type: {block.type}</div>;
    }
  };

  return (
    <div className="group relative flex flex-col border rounded-lg p-2 hover:shadow-sm">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onDelete}
          className="p-1 text-sm text-red-600 hover:bg-red-50 rounded"
        >
          Delete
        </button>
      </div>
      {renderEditableContent()}
    </div>
  );
}