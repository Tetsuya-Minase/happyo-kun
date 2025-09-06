import { $, fs, path } from 'zx';

// Set zx to be verbose so it prints commands
$.verbose = true;

const rootDir: string = process.cwd();
const appsDir: string = path.join(rootDir, 'apps');
const startDistDir: string = path.join(appsDir, 'start', 'dist');

async function main(): Promise<void> {
  try {
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
      console.log('No slide directories found. Only building the start app.');
    }

    // 2. Build the start app first
    await $`pnpm --filter start build`;

    // 3. Build each slide app
    for (const slideDir of slideDirs) {
      await $`pnpm --filter ${slideDir} build`;

      const slideDistPath = path.join(appsDir, slideDir, 'dist');
      const slideFunctionsPath = path.join(appsDir, slideDir, 'functions');

      // 4. Copy slide's dist to start's dist
      const targetDistPath = path.join(startDistDir, slideDir);
      console.log(`> Copying ${slideDistPath} to ${targetDistPath}`);
      await fs.rm(targetDistPath, { recursive: true, force: true });
      await fs.copy(slideDistPath, targetDistPath);

      // 5. Copy slide's functions to start's dist (if they exist)
      if (await fs.pathExists(slideFunctionsPath)) {
        const targetFunctionsPath = path.join(startDistDir, 'functions');
        console.log(`> Copying ${slideFunctionsPath} to ${targetFunctionsPath}`);
        await fs.copy(slideFunctionsPath, targetFunctionsPath, { overwrite: true });
      } else {
        console.log(`> No 'functions' directory found for ${slideDir}. Skipping copy.`);
      }
    }

    console.log('\n✅ Build completed successfully!');

  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

main();
