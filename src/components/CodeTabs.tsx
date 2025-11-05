interface CodeTabsProps {
  snippets: {
    react?: string;
    tailwind?: string;
    tokensJson?: string;
  };
}

export default function CodeTabs({ snippets }: CodeTabsProps) {
  return (
    <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {Object.keys(snippets).map((key) => (
          <button
            key={key}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>
      <div className="p-4">
        <pre className="overflow-x-auto">
          <code className="text-sm">{snippets.react}</code>
        </pre>
      </div>
    </div>
  );
}