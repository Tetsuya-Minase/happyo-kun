import { defineConfig } from 'vite'
import path from 'path'

// Custom plugin to inject the slide list into index.html
function injectSlidesList() {
  return {
    name: 'inject-slides-list',
    async transformIndexHtml(html) {
      const slidesHtml = `
        <div class="slide-card">
            <h3>happyo-kun スライド</h3>
            <p>インタラクティブなプレゼンテーション体験</p>
            <div class="card-actions">
                <a href="http://localhost:3030/" class="btn btn-primary" target="_blank">スライドを開く</a>
                <a href="http://localhost:3030/presenter/" class="btn btn-secondary" target="_blank">プレゼンターモード</a>
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
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
  publicDir: 'public',
  plugins: [injectSlidesList()],
})