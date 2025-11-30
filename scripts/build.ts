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

    // 3. Build the start app 
    console.log('\n📦 Building start application...');
    await $`pnpm --filter start build`;

    // 4. Copy slide functions to start's dist for API functionality
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

    // 5. Copy slide dist files (including 404.html for SPA routing) to integrated build
    await copySlideDistToBuild(startDistDir, slideDirs);

    console.log('\n✅ Integrated build completed successfully!');
    console.log(`📂 Output directory: ${startDistDir}`);

  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

main();
