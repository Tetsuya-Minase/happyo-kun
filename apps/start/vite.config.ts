import { defineConfig } from 'vite'
import { getSlides } from './get-slides.ts'
import path from 'path'
import fs from 'fs'

// Custom plugin to inject the slide list into index.html
function injectSlidesList() {
  return {
    name: 'inject-slides-list',
    async transformIndexHtml(html, context) {
      // Only apply to the root index.html (not slide pages)
      if (context.path && context.path.startsWith('/slide')) {
        return html;
      }
      
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

// Custom plugin to serve Slidev content for slides
function slideRoutesHandler() {
  return {
    name: 'slide-routes-handler',
    configureServer(server) {
      // Handle all slide routes
      server.middlewares.use('/slide', async (req, res, next) => {
        try {
          const slidesPath = path.resolve(__dirname, 'slides.md');
          
          if (!fs.existsSync(slidesPath)) {
            res.status(404).end('Slides not found');
            return;
          }

          const slidesContent = fs.readFileSync(slidesPath, 'utf-8');
          
          // Parse slide number from URL
          const slideMatch = req.url?.match(/\/(\d+)/);
          const slideNumber = slideMatch ? parseInt(slideMatch[1]) : 1;
          
          // Extract slides from markdown
          const slides = slidesContent.split(/^---$/gm).filter(slide => slide.trim());
          const totalSlides = slides.length;
          const currentSlide = slides[slideNumber - 1] || slides[0];
          
          // Convert markdown to basic HTML (simplified)
          const slideHtml = currentSlide
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^\*\*(.+)\*\*/gm, '<strong>$1</strong>')
            .replace(/^📝 (.+)$/gm, '<li>📝 $1</li>')
            .replace(/^🎨 (.+)$/gm, '<li>🎨 $1</li>')
            .replace(/^🚀 (.+)$/gm, '<li>🚀 $1</li>')
            .replace(/^🔧 (.+)$/gm, '<li>🔧 $1</li>')
            .replace(/^⚡ (.+)$/gm, '<li>⚡ $1</li>')
            .replace(/\n/g, '<br>');

          const fullHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide ${slideNumber} - happyo-kun</title>
    <style>
        /* Reset and base styles - Override any inherited styles */
        * { 
            margin: 0 !important; 
            padding: 0 !important; 
            box-sizing: border-box !important; 
        }
        html, body { 
            font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            height: 100vh !important;
            overflow: hidden !important;
            line-height: 1.4 !important;
        }
        
        /* Override any container styles */
        .container, .slides-section, main, section {
            display: none !important;
        }
        
        /* Slide-specific styles with high specificity */
        .slide-header {
            background: rgba(0,0,0,0.8) !important;
            padding: 12px 20px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            backdrop-filter: blur(10px) !important;
            position: relative !important;
            z-index: 1000 !important;
        }
        .slide-title {
            font-size: 16px !important;
            font-weight: 600 !important;
            opacity: 0.8 !important;
            color: white !important;
        }
        .slide-nav {
            display: flex !important;
            gap: 12px !important;
            align-items: center !important;
        }
        .slide-counter {
            font-size: 14px !important;
            opacity: 0.7 !important;
            margin-right: 16px !important;
            color: white !important;
        }
        .nav-btn {
            padding: 6px 12px !important;
            background: rgba(255,255,255,0.2) !important;
            color: white !important;
            text-decoration: none !important;
            border-radius: 6px !important;
            font-size: 14px !important;
            transition: all 0.2s !important;
            border: 1px solid rgba(255,255,255,0.3) !important;
        }
        .nav-btn:hover {
            background: rgba(255,255,255,0.3) !important;
            border-color: rgba(255,255,255,0.5) !important;
        }
        
        /* Main slide content */
        .slide-content {
            height: calc(100vh - 60px) !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
            padding: 60px 40px !important;
            position: relative !important;
            z-index: 100 !important;
        }
        .slide-content h1 {
            font-size: 4rem !important;
            margin-bottom: 2rem !important;
            font-weight: 800 !important;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3) !important;
            color: white !important;
            line-height: 1.2 !important;
        }
        .slide-content h2 {
            font-size: 2.5rem !important;
            margin-bottom: 1.5rem !important;
            font-weight: 700 !important;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3) !important;
            color: white !important;
            line-height: 1.3 !important;
        }
        .slide-content p, .slide-content li {
            font-size: 1.4rem !important;
            line-height: 1.8 !important;
            margin-bottom: 1rem !important;
            opacity: 0.95 !important;
            max-width: 800px !important;
            color: white !important;
        }
        .slide-content ul {
            list-style: none !important;
            text-align: left !important;
            max-width: 800px !important;
        }
        .slide-content li {
            margin-bottom: 0.8rem !important;
            padding-left: 0 !important;
            color: white !important;
        }
        .slide-content strong {
            color: #ffd700 !important;
            font-weight: 700 !important;
        }
        
        /* Controls */
        .slide-controls {
            position: fixed !important;
            bottom: 30px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            display: flex !important;
            gap: 20px !important;
            z-index: 1000 !important;
        }
        .control-btn {
            padding: 12px 20px !important;
            background: rgba(255,255,255,0.2) !important;
            color: white !important;
            border: 2px solid rgba(255,255,255,0.3) !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            text-decoration: none !important;
            font-size: 16px !important;
            transition: all 0.3s !important;
            font-weight: 600 !important;
        }
        .control-btn:hover:not(.disabled) {
            background: rgba(255,255,255,0.3) !important;
            border-color: rgba(255,255,255,0.5) !important;
            transform: translateY(-2px) !important;
        }
        .control-btn.disabled {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
            pointer-events: none !important;
        }
        
        @media (max-width: 768px) {
            .slide-content h1 { font-size: 2.5rem !important; }
            .slide-content h2 { font-size: 2rem !important; }
            .slide-content p, .slide-content li { font-size: 1.2rem !important; }
            .slide-controls { 
                flex-direction: column !important; 
                align-items: center !important;
                gap: 12px !important;
            }
        }
    </style>
</head>
<body>
    <div class="slide-header">
        <div class="slide-title">🎯 happyo-kun (発表くん)</div>
        <div class="slide-nav">
            <div class="slide-counter">${slideNumber} / ${totalSlides}</div>
            <a href="/" class="nav-btn">← ホーム</a>
        </div>
    </div>
    <div class="slide-content">
        ${slideHtml}
    </div>
    <div class="slide-controls">
        <a href="/slide/${Math.max(1, slideNumber - 1)}" class="control-btn ${slideNumber <= 1 ? 'disabled' : ''}" ${slideNumber <= 1 ? 'style="opacity:0.5;pointer-events:none;"' : ''}>← 前のスライド</a>
        <a href="/slide/${Math.min(totalSlides, slideNumber + 1)}" class="control-btn ${slideNumber >= totalSlides ? 'disabled' : ''}" ${slideNumber >= totalSlides ? 'style="opacity:0.5;pointer-events:none;"' : ''}>次のスライド →</a>
    </div>
    <script>
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const currentSlide = ${slideNumber};
            const totalSlides = ${totalSlides};
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                if (currentSlide > 1) {
                    window.location.href = '/slide/' + (currentSlide - 1);
                }
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault();
                if (currentSlide < totalSlides) {
                    window.location.href = '/slide/' + (currentSlide + 1);
                }
            } else if (e.key === 'Home') {
                window.location.href = '/slide/1';
            } else if (e.key === 'End') {
                window.location.href = '/slide/' + totalSlides;
            }
        });
    </script>
</body>
</html>`;
          
          res.setHeader('Content-Type', 'text/html');
          res.end(fullHtml);
        } catch (error) {
          console.error('Error serving slide:', error);
          next(error);
        }
      });
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
  plugins: [injectSlidesList(), slideRoutesHandler()],
})