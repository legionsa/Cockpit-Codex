export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'video'
  | 'figmaEmbed'
  | 'code'
  | 'tokenTable'
  | 'alert'
  | 'list'
  | 'quote'
  | 'childPagesGrid'
  | 'button'
  | 'divider'
  | 'spacer';

export interface BaseBlock {
  id: string;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 1 | 2 | 3;
  content: string;
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  content: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  caption?: string;
  alt?: string;
  align?: 'left' | 'center' | 'right';
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  url: string;
  caption?: string;
}

export interface FigmaEmbedBlock extends BaseBlock {
  type: 'figmaEmbed';
  url: string;
  height?: number | string;
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  language: string;
  content: string;
}

export interface TokenTableBlock extends BaseBlock {
  type: 'tokenTable';
  tokenGroup: string;
  description?: string;
}

export interface AlertBlock extends BaseBlock {
  type: 'alert';
  variant: 'info' | 'warning' | 'success' | 'danger';
  content: string;
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  ordered?: boolean;
  items: string[];
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  content: string;
  author?: string;
}

export interface ChildPagesGridBlock extends BaseBlock {
  type: 'childPagesGrid';
  childIds: string[];
  layout?: '1col' | '2col' | '3col';
}

export interface ButtonBlock extends BaseBlock {
  type: 'button';
  label: string;
  url: string;
  variant?: 'primary' | 'secondary' | 'link';
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  size?: 'sm' | 'md' | 'lg';
}

export interface SpacerBlock extends BaseBlock {
  type: 'spacer';
  size?: number | string;
}

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | VideoBlock
  | FigmaEmbedBlock
  | CodeBlock
  | TokenTableBlock
  | AlertBlock
  | ListBlock
  | QuoteBlock
  | ChildPagesGridBlock
  | ButtonBlock
  | DividerBlock
  | SpacerBlock;

export function validateBlock(block: unknown): block is Block {
  if (!block || typeof block !== 'object') return false;
  const b = block as any;
  if (typeof b.type !== 'string' || typeof b.id !== 'string') return false;

  switch (b.type) {
    case 'heading':
      return (b.level === 1 || b.level === 2 || b.level === 3) && typeof b.content === 'string';
    case 'paragraph':
      return typeof b.content === 'string';
    case 'image':
      return typeof b.src === 'string';
    case 'video':
      return typeof b.url === 'string';
    case 'figmaEmbed':
      return typeof b.url === 'string';
    case 'code':
      return typeof b.language === 'string' && typeof b.content === 'string';
    case 'tokenTable':
      return typeof b.tokenGroup === 'string';
    case 'alert':
      return ['info', 'warning', 'success', 'danger'].includes(b.variant) && typeof b.content === 'string';
    case 'list':
      return Array.isArray(b.items) && b.items.every((i: any) => typeof i === 'string');
    case 'quote':
      return typeof b.content === 'string';
    case 'childPagesGrid':
      return Array.isArray(b.childIds) && b.childIds.every((i: any) => typeof i === 'string');
    case 'button':
      return typeof b.label === 'string' && typeof b.url === 'string';
    case 'divider':
      return true;
    case 'spacer':
      return true;
    default:
      return false;
  }
}
