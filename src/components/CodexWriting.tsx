'use client';

import { useEffect, useRef, useState } from 'react';

export default function CodexWriting({ pageData = null }: { pageData?: any }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let instance: any = null;
    async function init() {
      try {
        const module = await import('@/vendor/codex.docs/src/frontend/js/modules/writing.js');
        const Writing = module.default;
        instance = new Writing();
  const settings: any = {};
        if (pageData) settings.page = pageData;
        if (containerRef.current) {
          // The module expects a module element; pass container
          instance.init(settings, containerRef.current);
        }
        setIsReady(true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load codex writing module', err);
      }
    }

    init();

    return () => {
      try {
        if (instance && typeof instance.destroy === 'function') instance.destroy();
      } catch (e) {}
    };
  }, [pageData]);

  return (
    <div ref={containerRef} className="codex-writing">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">URI</label>
          <input name="uri-input" className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Parent</label>
          <select name="parent" className="w-full px-3 py-2 border rounded-md">
            <option value="foundations">Foundations</option>
            <option value="components">Components</option>
          </select>
        </div>

        <div id="codex-editor" className="mb-4 bg-white rounded shadow p-4" />

        <div className="flex gap-2">
          <button name="js-submit-save" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          <button name="js-submit-remove" className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
        </div>
      </div>
    </div>
  );
}
