import { $, fs, path } from 'zx';

// Set zx to be verbose so it prints commands
$.verbose = true;

/**
 * slides/ 配下の全てのスライドディレクトリを検出してビルドするスクリプト
 * 各スライドディレクトリ内の slides.md をエントリーポイントとしてビルドします
 */

// スライド名のバリデーション（セキュリティ対策）
function isValidSlideName(name: string): boolean {
  // アルファベット、数字、ハイフン、アンダースコアのみ許可
  // パストラバーサル対策
  return /^[a-z0-9_-]+$/i.test(name) &&
         !name.includes('..') &&
         !name.startsWith('.');
}

async function main(): Promise<void> {
  try {
    const slideDir = process.cwd();
    const slidesDir = path.join(slideDir, 'slides');
    const distDir = path.join(slideDir, 'dist');

    // slides ディレクトリの存在確認
    if (!(await fs.pathExists(slidesDir))) {
      console.error('❌ slides/ ディレクトリが見つかりません');
      process.exit(1);
    }

    // slides/ 内のディレクトリを検出
    const entries = await fs.readdir(slidesDir);
    const slideInfos: Array<{ name: string; mdPath: string; outputDir: string }> = [];

    // 各エントリーを検査してスライドディレクトリを特定
    for (const entry of entries) {
      const entryPath = path.join(slidesDir, entry);
      const stat = await fs.stat(entryPath);

      // ディレクトリのみ処理
      if (!stat.isDirectory()) {
        continue;
      }

      // ディレクトリ名のバリデーション
      if (!isValidSlideName(entry)) {
        console.warn(`⚠️  無効なスライド名をスキップ: ${entry}`);
        continue;
      }

      // slides.md の存在確認
      const mdPath = path.join(entryPath, 'slides.md');
      if (!(await fs.pathExists(mdPath))) {
        console.warn(`⚠️  ${entry}/ に slides.md が見つかりません。スキップします。`);
        continue;
      }

      // ビルド対象として追加
      slideInfos.push({
        name: entry,
        mdPath: mdPath,
        outputDir: path.join(distDir, entry)
      });
    }

    if (slideInfos.length === 0) {
      console.error('❌ slides/ 内にビルド可能なスライドが見つかりません');
      console.error('   各スライドディレクトリに slides.md を配置してください');
      process.exit(1);
    }

    console.log(`📁 ${slideInfos.length} 個のスライドを検出しました: ${slideInfos.map(s => s.name).join(', ')}`);

    // dist ディレクトリをクリーンアップ
    if (await fs.pathExists(distDir)) {
      await fs.remove(distDir);
      console.log('🧹 dist/ ディレクトリをクリーンアップしました');
    }

    // 各スライドを順次ビルド
    for (const slideInfo of slideInfos) {
      console.log(`\n📦 ${slideInfo.name} をビルド中...`);
      console.log(`   入力: ${slideInfo.mdPath}`);
      console.log(`   出力: ${slideInfo.outputDir}`);

      // Slidev でビルド
      // --base オプションで各スライドのベースパスを設定
      await $`npx slidev build ${slideInfo.mdPath} --base /${slideInfo.name}/ --out ${slideInfo.outputDir}`;

      console.log(`✅ ${slideInfo.name} のビルドが完了しました`);
    }

    console.log('\n🎉 全てのスライドのビルドが完了しました!');
    console.log(`📂 出力先: ${distDir}`);

  } catch (error) {
    console.error('\n❌ ビルドに失敗しました:', error);
    process.exit(1);
  }
}

main();
