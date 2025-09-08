import { $, fs, path } from 'zx';

// Set zx to be verbose so it prints commands
$.verbose = true;

const rootDir: string = process.cwd();
const appsDir: string = path.join(rootDir, 'apps');
const startDistDir: string = path.join(appsDir, 'start', 'dist');

async function generateSlideFiles(distDir: string): Promise<void> {
  try {
    console.log('📋 Generating static slide files...');
    
    const slidesPath = path.join(appsDir, 'start', 'slides.md');
    if (!(await fs.pathExists(slidesPath))) {
      console.log('⚠️  slides.md not found, skipping slide generation.');
      return;
    }

    const slidesContent = await fs.readFile(slidesPath, 'utf-8');
    const slides = slidesContent.split(/^---$/gm).filter(slide => slide.trim());
    
    // Create slide directory
    const slideDir = path.join(distDir, 'slide');
    await fs.ensureDir(slideDir);
    
    // Generate each slide page
    for (let i = 0; i < slides.length; i++) {
      const slideNumber = i + 1;
      const slide = slides[i];
      
      const slideHtml = slide
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^\*\*(.+)\*\*/gm, '<strong>$1</strong>')
        .replace(/^📝 (.+)$/gm, '<li>📝 $1</li>')
        .replace(/^🎨 (.+)$/gm, '<li>🎨 $1</li>')
        .replace(/^🚀 (.+)$/gm, '<li>🚀 $1</li>')
        .replace(/^🔧 (.+)$/gm, '<li>🔧 $1</li>')
        .replace(/^⚡ (.+)$/gm, '<li>⚡ $1</li>')
        .replace(/\n/g, '<br>');

      const fileName = slideNumber === 1 ? 'index.html' : `${slideNumber}.html`;
      const filePath = path.join(slideDir, fileName);
      
      const htmlContent = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide ${slideNumber} - happyo-kun</title>
    <style>
        * { margin: 0 !important; padding: 0 !important; box-sizing: border-box !important; }
        html, body { 
            font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            height: 100vh !important;
            overflow: hidden !important;
            line-height: 1.4 !important;
        }
        .container, .slides-section, main, section { display: none !important; }
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
            <div class="slide-counter">${slideNumber} / ${slides.length}</div>
            <a href="/" class="nav-btn">← ホーム</a>
        </div>
    </div>
    <div class="slide-content">
        ${slideHtml}
    </div>
    <div class="slide-controls">
        <a href="/slide/${slideNumber > 1 ? (slideNumber - 1 === 1 ? '' : slideNumber - 1) : ''}" class="control-btn ${slideNumber <= 1 ? 'disabled' : ''}">← 前のスライド</a>
        <a href="/slide/${slideNumber < slides.length ? slideNumber + 1 : ''}" class="control-btn ${slideNumber >= slides.length ? 'disabled' : ''}">次のスライド →</a>
    </div>
    <script>
        document.addEventListener('keydown', (e) => {
            const currentSlide = ${slideNumber};
            const totalSlides = ${slides.length};
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                if (currentSlide > 1) {
                    const prevSlide = currentSlide - 1;
                    window.location.href = '/slide/' + (prevSlide === 1 ? '' : prevSlide);
                }
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault();
                if (currentSlide < totalSlides) {
                    window.location.href = '/slide/' + (currentSlide + 1);
                }
            } else if (e.key === 'Home') {
                window.location.href = '/slide/';
            } else if (e.key === 'End') {
                window.location.href = '/slide/' + totalSlides;
            }
        });
    </script>
</body>
</html>`;
      
      await fs.writeFile(filePath, htmlContent);
      console.log(`  ✅ Generated ${fileName}`);
    }
    
    console.log(`📋 Generated ${slides.length} slide files successfully.`);
  } catch (error) {
    console.error('❌ Error generating slide files:', error);
  }
}

async function main(): Promise<void> {
  try {
    console.log('🚀 Building integrated happyo-kun application...\n');

    // 1. Find all slide directories
    const allDirs = await fs.readdir(appsDir);
    const slideDirs: string[] = [];
    for (const dir of allDirs) {
        const fullPath = path.join(appsDir, dir);
        try {
            const stat = await fs.stat(fullPath);
            if (stat.isDirectory() && dir.startsWith('slide')) {
                slideDirs.push(dir);
            }
        } catch (e) {
            // Ignore errors for files that might not be accessible, like .DS_Store
            console.warn(`Could not stat ${fullPath}, skipping.`);
        }
    }

    if (slideDirs.length === 0) {
      console.log('⚠️  No slide directories found. Only building the start app.');
    } else {
      console.log(`📁 Found ${slideDirs.length} slide directories: ${slideDirs.join(', ')}`);
    }

    // 2. Build the integrated start app (now includes slide functionality)
    console.log('\n📦 Building start application with integrated slides...');
    await $`pnpm --filter start build`;

    // 3. Copy slide functions to start's dist for API functionality
    for (const slideDir of slideDirs) {
      const slideFunctionsPath = path.join(appsDir, slideDir, 'functions');

      if (await fs.pathExists(slideFunctionsPath)) {
        const targetFunctionsPath = path.join(startDistDir, 'functions');
        console.log(`📋 Copying ${slideDir} functions to integrated build...`);
        await fs.copy(slideFunctionsPath, targetFunctionsPath, { overwrite: true });
      } else {
        console.log(`ℹ️  No functions directory found for ${slideDir}. Skipping copy.`);
      }
    }

    // 4. Generate static slide files and _redirects
    await generateSlideFiles(startDistDir);
    
    // 5. Create _redirects file for SPA routing
    const redirectsContent = `
# Static slide files
/slide/    /slide/index.html   200
/slide/1   /slide/index.html   200
/slide/2   /slide/2.html       200
/slide/3   /slide/3.html       200  
/slide/4   /slide/4.html       200

# Fallback to home for other routes
/*         /index.html         200
`;
    const redirectsPath = path.join(startDistDir, '_redirects');
    await fs.writeFile(redirectsPath, redirectsContent.trim());
    console.log('📄 Created _redirects file for SPA routing.');

    console.log('\n✅ Integrated build completed successfully!');
    console.log(`📂 Output directory: ${startDistDir}`);

  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

main();
