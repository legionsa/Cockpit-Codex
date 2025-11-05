module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/lib/blocks.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validateBlock",
    ()=>validateBlock
]);
function validateBlock(block) {
    if (!block || typeof block !== 'object') return false;
    const b = block;
    if (typeof b.type !== 'string' || typeof b.id !== 'string') return false;
    switch(b.type){
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
            return [
                'info',
                'warning',
                'success',
                'danger'
            ].includes(b.variant) && typeof b.content === 'string';
        case 'list':
            return Array.isArray(b.items) && b.items.every((i)=>typeof i === 'string');
        case 'quote':
            return typeof b.content === 'string';
        case 'childPagesGrid':
            return Array.isArray(b.childIds) && b.childIds.every((i)=>typeof i === 'string');
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
}),
"[project]/src/lib/pages.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildBreadcrumbs",
    ()=>buildBreadcrumbs,
    "buildPageTree",
    ()=>buildPageTree,
    "generateSlug",
    ()=>generateSlug,
    "validatePage",
    ()=>validatePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$blocks$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/blocks.ts [app-route] (ecmascript)");
;
function validatePage(page) {
    if (!page || typeof page !== 'object') return false;
    const p = page;
    // Required fields (lean validation)
    if (typeof p.id !== 'string' || typeof p.title !== 'string' || typeof p.slug !== 'string' || typeof p.order !== 'number' || typeof p.lastUpdated !== 'string' || ![
        'Draft',
        'Published',
        'Archived'
    ].includes(p.status || '')) {
        return false;
    }
    // Optional fields
    if (p.parentId !== undefined && p.parentId !== null && typeof p.parentId !== 'string' || p.summary !== undefined && typeof p.summary !== 'string' || p.figmaEmbedUrl !== undefined && typeof p.figmaEmbedUrl !== 'string' || p.version !== undefined && typeof p.version !== 'string' || p.tags !== undefined && (!Array.isArray(p.tags) || !p.tags.every((tag)=>typeof tag === 'string'))) {
        return false;
    }
    // Code snippets validation
    if (p.codeSnippets !== undefined) {
        const snippets = p.codeSnippets;
        if (typeof snippets !== 'object' || snippets.react !== undefined && typeof snippets.react !== 'string' || snippets.tailwind !== undefined && typeof snippets.tailwind !== 'string' || snippets.tokensJson !== undefined && typeof snippets.tokensJson !== 'string') {
            return false;
        }
    }
    // Blocks validation (if present)
    if (p.blocks !== undefined) {
        if (!Array.isArray(p.blocks)) return false;
        for (const b of p.blocks){
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$blocks$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateBlock"])(b)) return false;
        }
    }
    return true;
}
function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function buildBreadcrumbs(pages, currentPageId) {
    const breadcrumbs = [];
    let currentPage = pages.find((p)=>p.id === currentPageId);
    while(currentPage){
        breadcrumbs.unshift({
            title: currentPage.title,
            href: `/${currentPage.slug}`
        });
        const parentId = currentPage.parentId;
        if (parentId) {
            const parentPage = pages.find((p)=>p.id === parentId);
            if (!parentPage) break;
            currentPage = parentPage;
        } else {
            break;
        }
    }
    return breadcrumbs;
}
function buildPageTree(pages) {
    const pageMap = new Map(pages.map((page)=>[
            page.id,
            {
                ...page,
                children: []
            }
        ]));
    const tree = [];
    pages.forEach((page)=>{
        if (page.parentId) {
            const parent = pageMap.get(page.parentId);
            const currentPage = pageMap.get(page.id);
            if (parent && currentPage) {
                parent.children = parent.children || [];
                parent.children.push(currentPage);
            }
        } else {
            const rootPage = pageMap.get(page.id);
            if (rootPage) {
                tree.push(rootPage);
            }
        }
    });
    return tree;
}
}),
"[project]/src/app/api/pages/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pages$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/pages.ts [app-route] (ecmascript)");
;
;
;
;
const pagesDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/data/pages');
const redirectsPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/data/redirects.json');
async function GET() {
    const files = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readdir(pagesDir);
    const pages = await Promise.all(files.map(async (file)=>{
        const content = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(pagesDir, file), 'utf8');
        return JSON.parse(content);
    }));
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(pages);
}
async function POST(request) {
    const data = await request.json();
    const { title, parentId } = data;
    if (!title) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Title is required'
        }, {
            status: 400
        });
    }
    const slug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pages$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateSlug"])(title);
    const id = parentId ? `${parentId}-${slug}` : slug;
    // Check for existing page with same slug under same parent
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(pagesDir, `${id}.json`));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Page with this slug already exists under the selected parent'
        }, {
            status: 409
        });
    } catch  {
    // File doesn't exist, we can proceed
    }
    const page = {
        id,
        title,
        slug,
        parentId,
        order: Date.now(),
        contentType: 'markdown',
        content: '',
        status: 'Draft',
        lastUpdated: new Date().toISOString(),
        ...data
    };
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(pagesDir, `${id}.json`), JSON.stringify(page, null, 2));
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(page);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4658ca3d._.js.map