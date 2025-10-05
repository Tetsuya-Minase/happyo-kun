import { fs, path } from 'zx';

export interface SlideMetadata {
  name: string;
  description: string;
  dirName: string;
}

/**
 * appsディレクトリをスキャンして、slide*で始まるディレクトリのメタデータを取得
 */
export async function getSlides(): Promise<SlideMetadata[]> {
  const appsDir = path.join(process.cwd(), '..', '..');
  const appsPath = path.join(appsDir, 'apps');

  if (!(await fs.pathExists(appsPath))) {
    console.warn(`Apps directory not found: ${appsPath}`);
    return [];
  }

  const allDirs = await fs.readdir(appsPath);
  const slides: SlideMetadata[] = [];

  for (const dir of allDirs) {
    if (!dir.startsWith('slide')) {
      continue;
    }

    const fullPath = path.join(appsPath, dir);

    try {
      const stat = await fs.stat(fullPath);
      if (!stat.isDirectory()) {
        continue;
      }

      // package.jsonを読み込んでメタデータを取得
      const packageJsonPath = path.join(fullPath, 'package.json');
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        slides.push({
          name: packageJson.name || dir,
          description: packageJson.description || 'スライドプレゼンテーション',
          dirName: dir
        });
      } else {
        // package.jsonがない場合はデフォルト値を使用
        slides.push({
          name: dir,
          description: 'スライドプレゼンテーション',
          dirName: dir
        });
      }
    } catch (e) {
      console.warn(`Could not process ${fullPath}, skipping.`);
    }
  }

  return slides;
}
