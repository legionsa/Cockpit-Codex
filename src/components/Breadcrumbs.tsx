interface BreadcrumbsProps {
  items: Array<{
    title: string;
    href: string;
  }>;
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            <a
              href={item.href}
              className={`text-sm ${
                index === items.length - 1
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-blue-500 hover:text-blue-700'
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}