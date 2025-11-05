import fs from 'fs';
import path from 'path';
import React from 'react';

const pagesDir = path.join(process.cwd(), 'src/data/pages');

function renderBlock(block: any, idx: number) {
  if (!block || !block.type) return null;
  const t = block.type;
  switch (t) {
    case 'header': {
      const level = (block.data && block.data.level) || 2;
      const Tag = `h${Math.min(3, Math.max(1, level))}` as any;
      return <Tag key={idx} className="block-header">{block.data && block.data.text}</Tag>;
    }
    case 'paragraph':
      return <p key={idx} className="block-paragraph" dangerouslySetInnerHTML={{ __html: block.data?.text || '' }} />;
    case 'list':
      if (block.data && block.data.style === 'ordered') {
        return <ol key={idx} className="block-list">{(block.data.items || []).map((it: any, i: number) => <li key={i} dangerouslySetInnerHTML={{ __html: it }} />)}</ol>;
      }
      return <ul key={idx} className="block-list">{(block.data?.items || []).map((it: any, i: number) => <li key={i} dangerouslySetInnerHTML={{ __html: it }} />)}</ul>;
    case 'code':
      return (<pre key={idx} className="block-code"><code>{block.data?.code || block.data?.text || ''}</code></pre>);
    case 'image':
      return (<div key={idx} className="block-image"><img src={block.data?.file?.url || block.data?.url} alt={block.data?.caption || ''} className="max-w-full h-auto" /></div>);
    case 'embed':
      return (<div key={idx} className="block-embed" dangerouslySetInnerHTML={{ __html: block.data?.html || '' }} />);
    case 'raw':
      return (<div key={idx} className="block-raw" dangerouslySetInnerHTML={{ __html: block.data?.html || block.data?.text || '' }} />);
    case 'table':
      return (<div key={idx} className="block-table">{JSON.stringify(block.data)}</div>);
    default:
      return (<div key={idx} className="block-unknown">Unsupported block: {t}</div>);
  }
}

export default async function PageView({ params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const content = fs.readFileSync(path.join(pagesDir, `${id}.json`), 'utf8');
    const page = JSON.parse(content);
    const blocks = (page.editorBody && page.editorBody.blocks) || [];

    return (
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
        <div className="space-y-6 page">
          {blocks.map((b: any, i: number) => renderBlock(b, i))}
        </div>
      </main>
    );
  } catch (e) {
    return (<main className="p-6">Page not found</main>);
  }
}
