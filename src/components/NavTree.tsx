interface NavTreeProps {
  items: Array<{
    id: string;
    title: string;
    slug: string;
    parentId: string | null;
    children?: Array<any>;
  }>;
  level?: number;
}

export default function NavTree({ items, level = 0 }: NavTreeProps) {
  return (
    <ul className={`${level > 0 ? 'ml-4' : ''} space-y-2`}>
      {items.map((item) => (
        <li key={item.id} className="py-1">
          <a href={`/${item.slug}`} className="hover:text-blue-500">
            {item.title}
          </a>
          {item.children && item.children.length > 0 && (
            <NavTree items={item.children} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}