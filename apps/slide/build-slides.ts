import { $, fs, path } from 'zx';

// Set zx to be verbose so it prints commands
$.verbose = true;

/**
 * presentations/ 配下の全ての .md ファイルを検出してビルドするスクリプト
 */
async function main(): Promise<void> {
  try {
    const slideDir = process.cwd();
    const presentationsDir = path.join(slideDir, 'presentations');
    const distDir = path.join(slideDir, 'dist');

    // presentations ディレクトリの存在確認
    if (!(await fs.pathExists(presentationsDir))) {
      console.error('❌ presentations/ ディレクトリが見つかりません');
      process.exit(1);
    }

    // presentations/ 内の .md ファイルを検出
    const files = await fs.readdir(presentationsDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    if (mdFiles.length === 0) {
      console.error('❌ presentations/ 内に .md ファイルが見つかりません');
      process.exit(1);
    }

    console.log(`📁 ${mdFiles.length} 個のスライドを検出しました: ${mdFiles.join(', ')}`);

    // dist ディレクトリをクリーンアップ
    if (await fs.pathExists(distDir)) {
      await fs.remove(distDir);
      console.log('🧹 dist/ ディレクトリをクリーンアップしました');
    }

    // 各 .md ファイルを順次ビルド
    for (const mdFile of mdFiles) {
      const slideName = path.basename(mdFile, '.md');
      const mdPath = path.join(presentationsDir, mdFile);
      const outputDir = path.join(distDir, slideName);

      console.log(`\n📦 ${slideName} をビルド中...`);
      console.log(`   入力: ${mdPath}`);
      console.log(`   出力: ${outputDir}`);

      // Slidev でビルド
      // --base オプションで各スライドのベースパスを設定
      await $`npx slidev build ${mdPath} --base /${slideName}/ --out ${outputDir}`;

      console.log(`✅ ${slideName} のビルドが完了しました`);
    }

    console.log('\n🎉 全てのスライドのビルドが完了しました!');
    console.log(`📂 出力先: ${distDir}`);

  } catch (error) {
    console.error('\n❌ ビルドに失敗しました:', error);
    process.exit(1);
  }
}

main();
