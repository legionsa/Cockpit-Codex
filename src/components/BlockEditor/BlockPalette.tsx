'use client';

import { BlockType } from '@/lib/blocks';

interface BlockPaletteProps {
  onAddBlock: (type: BlockType) => void;
}

const COMMON_BLOCKS: { type: BlockType; label: string }[] = [
  { type: 'heading', label: 'Heading' },
  { type: 'paragraph', label: 'Paragraph' },
  { type: 'image', label: 'Image' },
  { type: 'list', label: 'List' },
  { type: 'quote', label: 'Quote' },
  { type: 'code', label: 'Code' },
];

export default function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  return (
    <div className="flex gap-2 p-2 bg-gray-100 rounded">
      {COMMON_BLOCKS.map(({ type, label }) => (
        <button
          key={type}
          onClick={() => onAddBlock(type)}
          className="px-3 py-1 text-sm bg-white rounded shadow hover:bg-gray-50"
        >
          {label}
        </button>
      ))}
    </div>
  );
}