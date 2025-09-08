import { $, fs, path } from 'zx';

// Set zx to be verbose so it prints commands
$.verbose = true;

const rootDir: string = process.cwd();
const appsDir: string = path.join(rootDir, 'apps');
const startDistDir: string = path.join(appsDir, 'start', 'dist');

async function copySlideDistToBuild(distDir: string): Promise<void> {
  try {
    console.log('📋 Copying Slidev built files to integrated build...');
    
    const slideDistPath = path.join(appsDir, 'slide', 'dist');
    if (!(await fs.pathExists(slideDistPath))) {
      console.log('⚠️  Slidev dist not found. Building slide app first...');
      await $`pnpm --filter slide build`;
    }

    // Copy slide dist to /slide path in start dist
    const slideTargetPath = path.join(distDir, 'slide');
    await fs.copy(slideDistPath, slideTargetPath, { overwrite: true });
    
    console.log('📋 Copied Slidev files successfully.');
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

    // 5. Copy slide dist files to integrated build
    await copySlideDistToBuild(startDistDir);
    
    // 6. Create _redirects file for SPA routing
    const redirectsContent = `
# Slide files (Slidev built files)
/slide/*   /slide/:splat   200

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