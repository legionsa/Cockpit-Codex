'use client';

import { useState } from 'react';
import { Block } from '@/lib/blocks';
import BlockPalette from './BlockPalette';
import BlockRenderer from './BlockRenderer';

interface BlockEditorProps {
  initialBlocks?: Block[];
  onChange?: (blocks: Block[]) => void;
}

export default function BlockEditor({ initialBlocks = [], onChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);

  const handleAddBlock = (blockType: Block['type']) => {
    const id = `block-${Date.now()}`;
    
    let newBlock: Block;
    switch (blockType) {
      case 'heading':
        newBlock = { id, type: 'heading', level: 2, content: '' };
        break;
      case 'paragraph':
        newBlock = { id, type: 'paragraph', content: '' };
        break;
      case 'image':
        newBlock = { id, type: 'image', src: '' };
        break;
      case 'list':
        newBlock = { id, type: 'list', items: [] };
        break;
      case 'quote':
        newBlock = { id, type: 'quote', content: '' };
        break;
      case 'code':
        newBlock = { id, type: 'code', language: 'typescript', content: '' };
        break;
      default:
        throw new Error(`Unsupported block type: ${blockType}`);
    }

    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    onChange?.(updatedBlocks);
  };

  const handleUpdateBlock = (blockId: string, content: string | string[]) => {
    const updatedBlocks = blocks.map(block => {
      if (block.id !== blockId) return block;
      
      switch (block.type) {
        case 'list':
          return { ...block, items: typeof content === 'string' ? content.split('\n') : content };
        case 'heading':
        case 'paragraph':
        case 'quote':
        case 'code':
          return { ...block, content: typeof content === 'string' ? content : content.join('\n') };
        default:
          return block;
      }
    });
    setBlocks(updatedBlocks);
    onChange?.(updatedBlocks);
  };

  const handleDeleteBlock = (blockId: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== blockId);
    setBlocks(updatedBlocks);
    onChange?.(updatedBlocks);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <BlockPalette onAddBlock={handleAddBlock} />
      <div className="flex flex-col gap-2">
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            onUpdate={(content) => handleUpdateBlock(block.id, content)}
            onDelete={() => handleDeleteBlock(block.id)}
          />
        ))}
      </div>
    </div>
  );
}