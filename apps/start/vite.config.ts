import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import { existsSync, readdirSync } from 'fs'
import { getSlides } from './get-slides'

// Custom plugin to inject the slide list into index.html
function injectSlidesList() {
  return {
    name: 'inject-slides-list',
    async transformIndexHtml(html) {
      const isDev = process.env.NODE_ENV !== 'production'
      const appsDir = path.join(__dirname, '..')

      // slide*で始まるディレクトリを動的に検出
      const slides = await getSlides()

      if (slides.length === 0) {
        const noSlidesHtml = `
          <div class="slide-card">
            <h3>スライドが見つかりません</h3>
            <p>apps/配下にslide*で始まるディレクトリを作成してください</p>
          </div>
        `;
        return html.replace('<!--SLIDE_LIST-->', noSlidesHtml);
      }

      // presentations/ 内の .md ファイルをスキャンしてスライドリストを生成
      const presentationsPath = path.join(appsDir, 'slide', 'presentations');
      const presentations: { name: string; description: string }[] = [];

      if (existsSync(presentationsPath)) {
        const files = readdirSync(presentationsPath);
        for (const file of files) {
          if (file.endsWith('.md')) {
            const slideName = path.basename(file, '.md');
            presentations.push({
              name: slideName,
              description: `${slideName} プレゼンテーション`
            });
          }
        }
      }

      // 各スライドのHTMLを生成
      const slidesHtml = presentations.map(slide => {
        // In dev, point to Slidev dev server; in prod/preview, use integrated path
        const slideBase = isDev ? `http://localhost:3030/` : `/${slide.name}/`
        const presenterBase = isDev ? `http://localhost:3030/presenter/` : `/${slide.name}/presenter/`

        return `
          <div class="slide-card">
            <h3>${slide.name}</h3>
            <p>${slide.description}</p>
            <div class="card-actions">
              <a href="${slideBase}" class="btn btn-primary" target="_blank">スライドを開く</a>
              <a href="${presenterBase}" class="btn btn-secondary" target="_blank">プレゼンターモード</a>
            </div>
          </div>
        `;
      }).join('\n');

      return html.replace('<!--SLIDE_LIST-->', slidesHtml);
    }
  }
}

export default defineConfig({
  server: {
    port: 3000,
  },
  // Ensure preview serves /slide*/* to /slide*/index.html for integrated build preview
  plugins: [
    injectSlidesList(),
    {
      name: 'preview-rewrite-slide-to-index',
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || ''
          const hasExt = /\.[^/]+$/.test(url)

          // Check if URL matches any presentation name pattern
          // e.g., /intro/1, /demo/2, etc.
          const presentationMatch = url.match(/^\/([^/]+)(\/.*)?$/)
          if (presentationMatch && !hasExt) {
            const presentationName = presentationMatch[1]
            const slideIndexPath = path.resolve(__dirname, 'dist', presentationName, 'index.html')
            if (fs.existsSync(slideIndexPath)) {
              res.setHeader('Content-Type', 'text/html; charset=utf-8')
              res.end(fs.readFileSync(slideIndexPath))
              return
            }
          }
          next()
        })
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
  publicDir: 'public',
})
