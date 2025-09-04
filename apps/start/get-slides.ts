import { fs, path } from 'zx';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appsPath = path.resolve(__dirname, '..', '..', 'apps');

interface Slide {
  name: string;
  description: string;
  path: string;
}

interface PackageJson {
  name?: string;
  description?: string;
}

/**
 * Finds all slide directories in the apps folder, reads their package.json,
 * and returns an array of slide metadata.
 */
export async function getSlides(): Promise<Slide[]> {
  try {
    const allDirs = await fs.readdir(appsPath);
    const slideDirs: string[] = [];
    for (const dir of allDirs) {
        const fullPath = path.join(appsPath, dir);
        try {
            const stat = await fs.stat(fullPath);
            if (stat.isDirectory() && dir.startsWith('slide')) {
                slideDirs.push(dir);
            }
        } catch {
            // Ignore errors for files like .DS_Store
        }
    }

    const slidesData = await Promise.all(
      slideDirs.map(async (dir): Promise<Slide | null> => {
        const packageJsonPath = path.join(appsPath, dir, 'package.json');
        try {
          // fs.readJson is a nice helper from fs-extra (via zx)
          const packageJson: PackageJson = await fs.readJson(packageJsonPath);
          return {
            name: packageJson.name ? (packageJson.name.charAt(0).toUpperCase() + packageJson.name.slice(1)) : (dir.charAt(0).toUpperCase() + dir.slice(1)),
            description: packageJson.description || 'No description available.',
            path: dir,
          };
        } catch (error) {
          console.warn(`Could not read or parse package.json for slide: ${dir}. Using directory name as fallback.`);
          return {
            name: dir.charAt(0).toUpperCase() + dir.slice(1),
            description: 'No description available.',
            path: dir,
          };
        }
      })
    );

    return slidesData.filter((slide): slide is Slide => slide !== null);
  } catch (error) {
    console.error('Error getting slides:', error);
    return [];
  }
}
