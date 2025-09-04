import { defineConfig } from 'vite'
import { getSlides } from './get-slides.ts'

// Custom plugin to inject the slide list into index.html
function injectSlidesList() {
  return {
    name: 'inject-slides-list',
    async transformIndexHtml(html) {
      const slides = await getSlides();
      const slidesHtml = slides.map(slide => `
        <div class="slide-card">
            <h3>${slide.name}</h3>
            <p>${slide.description}</p>
            <div class="card-actions">
                <a href="/${slide.path}/" class="btn btn-primary">スライドを開く</a>
                <a href="/${slide.path}/presenter" class="btn btn-secondary">プレゼンターモード</a>
            </div>
        </div>
      `).join('');

      return html.replace('<!--SLIDE_LIST-->', slidesHtml);
    }
  }
}

export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  },
  publicDir: 'public',
  plugins: [injectSlidesList()],
})