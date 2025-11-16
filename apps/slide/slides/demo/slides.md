---
theme: default
background: https://cover.sli.dev
title: Demo Presentation
info: |
  ## Demo Presentation
  A demonstration of the multi-slide feature
class: text-center
highlighter: shiki
drawings:
  enabled: true
transition: slide-left
mdc: true
---

# Demo Presentation

🎨 デモプレゼンテーション

複数スライド機能のデモンストレーション

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

---

# マルチスライド機能

✅ **複数のスライドを同時管理** - presentations/ フォルダ内に複数の .md ファイルを配置

📁 **独立したビルド** - 各スライドは独立したディレクトリにビルドされます

🔗 **個別のURL** - `/スライド名/ページ番号` でアクセス可能

🎯 **共有リソース** - components と functions は全スライドで共有

---

# アクセス方法

このスライドには以下のURLでアクセスできます:

- **本番環境**: `/demo/1`, `/demo/2`, ...
- **プレゼンターモード**: `/demo/presenter/`

他のスライド:
- **intro**: `/intro/1`, `/intro/2`, ...

---

# まとめ

複数のプレゼンテーションを1つのプロジェクトで管理できるようになりました!

新しいスライドを追加するには:
1. `apps/slide/presentations/` に `.md` ファイルを作成
2. `pnpm build` を実行
3. `/【ファイル名】/1` でアクセス

🎉 完成!
