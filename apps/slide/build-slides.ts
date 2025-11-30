import { $, fs, path } from 'zx';

// Set zx to be verbose so it prints commands
$.verbose = true;

// ... (isValidSlideName 関数は変更なし) ...
function isValidSlideName(name: string): boolean {
  return /^[a-z0-9_-]+$/i.test(name) &&
    !name.includes('..') &&
    !name.startsWith('.');
}

async function main(): Promise<void> {
  try {
    const slideDir = process.cwd(); // ここが apps/slide の絶対パスになります
    const slidesDir = path.join(slideDir, 'slides');
    const distDir = path.join(slideDir, 'dist');

    // 親の vite.config.ts の絶対パスを取得
    const parentConfigPath = path.join(slideDir, 'vite.config.ts');

    // ... (中略: ディレクトリ検出ロジック等はそのまま) ...
    if (!(await fs.pathExists(slidesDir))) {
      console.error('❌ slides/ ディレクトリが見つかりません');
      process.exit(1);
    }

    const entries = await fs.readdir(slidesDir);
    const slideInfos: Array<{ name: string; mdPath: string; outputDir: string; dirPath: string }> = [];

    // ... (中略: slideInfos の生成ループはそのまま) ...
    for (const entry of entries) {
      const entryPath = path.join(slidesDir, entry);
      const stat = await fs.stat(entryPath);
      if (!stat.isDirectory()) continue;
      if (!isValidSlideName(entry)) continue;
      const mdPath = path.join(entryPath, 'slides.md');
      if (!(await fs.pathExists(mdPath))) continue;

      slideInfos.push({
        name: entry,
        mdPath: mdPath,
        dirPath: entryPath,
        outputDir: path.join(distDir, entry)
      });
    }

    // ... (中略: エラーチェックとクリーンアップはそのまま) ...
    if (slideInfos.length === 0) { /* ... */ }
    if (await fs.pathExists(distDir)) { /* ... */ }

    // 各スライドを順次ビルド
    for (const slideInfo of slideInfos) {
      console.log(`\n📦 ${slideInfo.name} をビルド中...`);

      // 【修正箇所】
      // Windows環境なども考慮し、パスのセパレータをスラッシュに統一します
      // (JSのimport文内ではバックスラッシュだとエスケープ問題が起きるため)
      const importPath = parentConfigPath.replace(/\\/g, '/');

      const tempConfigPath = path.join(slideInfo.dirPath, 'vite.config.ts');

      // 相対パスではなく、計算済みの絶対パスを埋め込みます
      const configContent = `
import config from '${importPath}'
export default config
`;

      await fs.writeFile(tempConfigPath, configContent);
      console.log(`   ⚙️  一時設定ファイルを作成: ${tempConfigPath}`);

      try {
        // Slidev でビルド
        await $`npx slidev build ${slideInfo.mdPath} --base /${slideInfo.name}/ --out ${slideInfo.outputDir}`;
        console.log(`✅ ${slideInfo.name} のビルドが完了しました`);

        // スライド固有のassetsディレクトリが存在する場合、ビルド出力にコピー
        const slideAssetsDir = path.join(slideInfo.dirPath, 'assets');
        if (await fs.pathExists(slideAssetsDir)) {
          const distAssetsDir = path.join(slideInfo.outputDir, 'assets');
          await fs.copy(slideAssetsDir, distAssetsDir, { overwrite: true });
          console.log(`   📁 assetsディレクトリをコピーしました`);
        }

        // 404.htmlは作成しない（ミドルウェアでSPAルーティングを処理）
        // const indexPath = path.join(slideInfo.outputDir, 'index.html');
        // const notFoundPath = path.join(slideInfo.outputDir, '404.html');
        // if (await fs.pathExists(indexPath)) {
        //   await fs.copy(indexPath, notFoundPath);
        //   console.log(`   📄 404.htmlを作成しました (SPAルーティング用)`);
        // }
      } finally {
        if (await fs.pathExists(tempConfigPath)) {
          await fs.remove(tempConfigPath);
          console.log(`   🗑️  一時設定ファイルを削除しました`);
        }
      }
    }

    console.log('\n🎉 全てのスライドのビルドが完了しました!');
    console.log(`📂 出力先: ${distDir}`);

  } catch (error) {
    console.error('\n❌ ビルドに失敗しました:', error);
    process.exit(1);
  }
}

main();