import { $, fs, path } from 'zx';

// Set zx to be verbose so it prints commands
$.verbose = true;

const rootDir: string = process.cwd();
const appsDir: string = path.join(rootDir, 'apps');
const startDistDir: string = path.join(appsDir, 'start', 'dist');

async function copySlideDistToBuild(distDir: string, slideDirs: string[]): Promise<void> {
  try {
    console.log('📋 Copying Slidev built files to integrated build...');

    for (const slideDir of slideDirs) {
      const slideDistPath = path.join(appsDir, slideDir, 'dist');
      if (!(await fs.pathExists(slideDistPath))) {
        console.log(`⚠️  ${slideDir} dist not found. Skipping...`);
        continue;
      }

      // slide/dist 内の各サブディレクトリ (intro, demo など) を start/dist にコピー
      const slideDirs = await fs.readdir(slideDistPath);
      for (const subDir of slideDirs) {
        const subDirPath = path.join(slideDistPath, subDir);
        const stat = await fs.stat(subDirPath);

        if (stat.isDirectory()) {
          const targetPath = path.join(distDir, subDir);
          await fs.copy(subDirPath, targetPath, { overwrite: true });
          console.log(`📋 Copied ${subDir}/ files to ${subDir}/`);
        }
      }
    }

    console.log('📋 All Slidev files copied successfully.');
  } catch (error) {
    console.error('❌ Error copying slide files:', error);
  }
}

async function createUnifiedRedirectsFile(distDir: string): Promise<void> {
  try {
    console.log('📋 Creating unified _redirects file...');

    const redirectRules: string[] = [];
    const entries = await fs.readdir(distDir);

    // 各サブディレクトリの _redirects ファイルを読み込む
    for (const entry of entries) {
      const entryPath = path.join(distDir, entry);
      const stat = await fs.stat(entryPath);

      if (stat.isDirectory()) {
        const redirectsFile = path.join(entryPath, '_redirects');
        if (await fs.pathExists(redirectsFile)) {
          const content = await fs.readFile(redirectsFile, 'utf-8');
          const lines = content.trim().split('\n').filter(line => line.trim());
          redirectRules.push(...lines);
          console.log(`📋 Found _redirects in ${entry}/`);
        }
      }
    }

    // ルートの _redirects ファイルに統合して書き込む
    if (redirectRules.length > 0) {
      const rootRedirectsFile = path.join(distDir, '_redirects');
      await fs.writeFile(rootRedirectsFile, redirectRules.join('\n') + '\n', 'utf-8');
      console.log(`📋 Created unified _redirects with ${redirectRules.length} rules`);
    } else {
      console.log('⚠️  No redirect rules found');
    }
  } catch (error) {
    console.error('❌ Error creating unified _redirects file:', error);
  }
}

async function generateSlideConfig(): Promise<void> {
  try {
    console.log('📋 Generating slide configuration...');

    const slidesDir = path.join(appsDir, 'slide', 'slides');
    const entries = await fs.readdir(slidesDir);
    const slides = [];

    for (const entry of entries) {
      const entryPath = path.join(slidesDir, entry);
      const stat = await fs.stat(entryPath);

      if (stat.isDirectory()) {
        const slidesFile = path.join(entryPath, 'slides.md');
        if (await fs.pathExists(slidesFile)) {
          const content = await fs.readFile(slidesFile, 'utf-8');

          // フロントマターから title と info を抽出
          const titleMatch = content.match(/^title:\s*(.+)$/m);
          const infoMatch = content.match(/^info:\s*\|?\s*\n?\s*(.+)/m);

          const slide = {
            title: titleMatch ? titleMatch[1].trim() : entry,
            description: infoMatch ? infoMatch[1].trim() : 'Slidevを使用したインタラクティブなプレゼンテーション',
            dirName: entry
          };

          slides.push(slide);
          console.log(`📋 Found slide: ${entry} (${slide.title})`);
        }
      }
    }

    // JSON ファイルに書き込む
    const configPath = path.join(appsDir, 'top', 'src', 'app', 'config', 'slide.json');
    await fs.ensureDir(path.dirname(configPath));
    await fs.writeJSON(configPath, { slides }, { spaces: 2 });
    console.log(`📋 Slide configuration written to ${configPath} (${slides.length} slides)`);

  } catch (error) {
    console.error('❌ Error generating slide configuration:', error);
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

    // 2. Build slide apps first
    for (const slideDir of slideDirs) {
      console.log(`\n📦 Building ${slideDir} application...`);
      await $`pnpm --filter ${slideDir} build`;
    }

    // 3. Generate slide configuration for top app
    console.log('\n📋 Generating slide configuration...');
    await generateSlideConfig();

    // 4. Build the start app
    console.log('\n📦 Building start application...');
    await $`pnpm --filter start build`;

    // 5. Copy slide functions to start's dist for API functionality
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

    // 6. Copy slide dist files (including 404.html for SPA routing) to integrated build
    await copySlideDistToBuild(startDistDir, slideDirs);

    // 7. Create unified _redirects file in the root of start/dist
    await createUnifiedRedirectsFile(startDistDir);

    console.log('\n✅ Integrated build completed successfully!');
    console.log(`📂 Output directory: ${startDistDir}`);

  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

main();
