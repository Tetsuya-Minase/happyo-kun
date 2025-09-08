import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'

// Custom plugin to inject the slide list into index.html
function injectSlidesList() {
  return {
    name: 'inject-slides-list',
    async transformIndexHtml(html) {
      const isDev = process.env.NODE_ENV !== 'production'
      // In dev, point to Slidev dev server; in prod/preview, use integrated path
      const slideBase = isDev ? 'http://localhost:3030/slide/' : '/slide/'
      const presenterBase = isDev ? 'http://localhost:3030/slide/presenter/' : '/slide/presenter/'
      const slidesHtml = `
        <div class="slide-card">
            <h3>happyo-kun スライド</h3>
            <p>インタラクティブなプレゼンテーション体験</p>
            <div class="card-actions">
                <a href="${slideBase}" class="btn btn-primary" target="_blank">スライドを開く</a>
                <a href="${presenterBase}" class="btn btn-secondary" target="_blank">プレゼンターモード</a>
            </div>
        </div>
      `;

      return html.replace('<!--SLIDE_LIST-->', slidesHtml);
    }
  }
}

export default defineConfig({
  server: {
    port: 3000,
  },
  // Ensure preview serves /slide/* to /slide/index.html for integrated build preview
  plugins: [
    injectSlidesList(),
    {
      name: 'preview-rewrite-slide-to-index',
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || ''
          // Bypass assets and files with extensions; rewrite HTML routes under /slide
          const isSlideRoute = url === '/slide' || url.startsWith('/slide/')
          const hasExt = /\.[^/]+$/.test(url)
          if (isSlideRoute && !hasExt) {
            const slideIndexPath = path.resolve(__dirname, 'dist', 'slide', 'index.html')
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
