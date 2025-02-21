// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isTest = process.env.VITEST;

export async function createServer(
    root = process.cwd(),
    isProd = process.env.NODE_ENV === 'production',
    hmrPort,
) {
    const resolve = (p) => path.resolve(__dirname, p);

    const indexProd = isProd
        ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
        : '';

    const app = express();

    /**
     * @type {import('vite').ViteDevServer}
     */
    let vite;
    if (!isProd) {
        vite = await (
            await import('vite')
        ).createServer({
            root,
            logLevel: isTest ? 'error' : 'info',
            server: {
                middlewareMode: true,
                watch: {
                    // During tests we edit the files too fast and sometimes chokidar
                    // misses change events, so enforce polling for consistency
                    usePolling: true,
                    interval: 100,
                },
                hmr: {
                    port: hmrPort,
                },
            },
            ssr: true,
            appType: 'custom',
        });
        // use vite's connect instance as middleware
        app.use(vite.middlewares);
    } else {
        app.use((await import('compression')).default());
        app.use(
            (await import('serve-static')).default(resolve('dist/client'), {
                index: false,
            }),
        );
    }

    app.use('*', async (req, res) => {
        try {
            const url = req.originalUrl;

            let template, render;
            if (!isProd) {
                // always read fresh template in dev
                template = fs.readFileSync(resolve('index.html'), 'utf-8');
                template = await vite.transformIndexHtml(url, template);
                render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
            } else {
                template = indexProd;
                // @ts-ignore
                render = (await import('./dist/server/entry-server.js')).render;
            }

            // Фетч данных для маршрута SSR
            let result = null;
            if (url.includes('/static/')) {
                const response = await fetch(`http://localhost:5000/static-page?id=${1}`);
                const data = await response.json();
                result = data.page;
            }
            const data = `<script>window.__SSR_DATA__=${JSON.stringify(
                result
            )}</script>`;

            const context = {};
            const appHtml = render(url, context, result);

            if (context.url) {
                // Somewhere a `<Redirect>` was rendered
                return res.redirect(301, context.url);
            }

            const html = template
                .replace(`<!--app-html-->`, appHtml)
                .replace(`<!--ssr-data-->`, data);

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
            !isProd && vite.ssrFixStacktrace(e);
            console.log(e.stack);
            res.status(500).end(e.stack);
        }
    });

    return { app, vite };
}

if (!isTest) {
    createServer().then(({ app }) =>
        app.listen(5173, () => {
            console.log('http://localhost:5173');
        }),
    );
}