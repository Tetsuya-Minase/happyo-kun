# コードベースの構造

## ディレクトリ構造

```
happyo-kun/
├── .github/
│   └── workflows/              # GitHub Actions CI/CD設定
├── apps/
│   ├── slide/                  # Slidevアプリケーション (メインアプリ)
│   │   ├── slides/            # 複数のスライドプレゼンテーション
│   │   │   ├── intro/         # イントロスライド
│   │   │   │   ├── slides.md  # スライド内容 (/intro/ でアクセス)
│   │   │   │   └── assets/    # スライド固有のアセット
│   │   │   └── demo/          # デモスライド
│   │   │       ├── slides.md  # スライド内容 (/demo/ でアクセス)
│   │   │       └── assets/    # スライド固有のアセット
│   │   ├── components/        # 共有Vueコンポーネント
│   │   │   ├── ApiDemo.vue    # API統合デモコンポーネント
│   │   │   └── CssPlayground.vue  # リアルタイムCSSエディタ
│   │   ├── functions/         # 共有Cloudflare Pages Functions
│   │   │   ├── _middleware.ts # セキュリティミドルウェア
│   │   │   └── api/           # APIエンドポイント
│   │   │       ├── hello.ts   # 挨拶API
│   │   │       └── css.ts     # CSSスニペットAPI
│   │   ├── dist/              # ビルド済み静的ファイル (複数スライド構造)
│   │   │   ├── intro/         # ビルド済みイントロスライド
│   │   │   └── demo/          # ビルド済みデモスライド
│   │   ├── build-slides.ts    # 複数スライドビルドスクリプト
│   │   ├── vite.config.ts     # Vite設定
│   │   ├── tsconfig.json      # TypeScript設定
│   │   └── package.json       # slideアプリのパッケージ設定
│   ├── start/                 # ランディングページアプリケーション
│   │   ├── index.html         # メインランディングページ
│   │   ├── dist/              # 統合ビルド出力
│   │   ├── vite.config.ts     # Vite設定
│   │   └── package.json       # startアプリのパッケージ設定
│   └── shared/                # 共有コードと型定義
│       ├── types/             # TypeScript型定義
│       │   └── index.ts
│       ├── utils/             # 共通ユーティリティ
│       │   └── api.ts
│       └── package.json       # sharedパッケージ設定
├── docs/                      # プロジェクトドキュメント
├── scripts/
│   └── build.ts               # 統合ビルドスクリプト
├── .gitignore                 # Git除外設定
├── pnpm-workspace.yaml        # pnpm ワークスペース設定
├── package.json               # ルートパッケージ設定
├── CLAUDE.md                  # Claude Code向けガイダンス
└── LICENSE                    # ライセンス

```

## 主要ファイルの役割

### ルートレベル
- **pnpm-workspace.yaml**: ワークスペース設定 (`apps/*` を管理)
- **package.json**: ルートレベルのスクリプトと開発依存関係
- **CLAUDE.md**: Claude Codeへの指示とプロジェクト概要

### apps/slide/ (Slidevアプリケーション)
- **slides/**: 各ディレクトリが独立したプレゼンテーション
  - 各ディレクトリには `slides.md` (必須) と `assets/` (オプション) を含む
  - URLパターン: `/【ディレクトリ名】/【ページ数】`
- **components/**: 全プレゼンテーションで共有されるVueコンポーネント
- **functions/**: 全プレゼンテーションで共有されるCloudflare Pages Functions
  - `_middleware.ts`: セキュリティミドルウェア
  - `api/`: RESTful APIエンドポイント
- **build-slides.ts**: 複数スライドをビルドするスクリプト
- **vite.config.ts**: Slidev用Vite設定
- **tsconfig.json**: TypeScript設定 (strict mode有効)

### apps/start/ (ランディングページ)
- **index.html**: メインのランディングページ
- **dist/**: 最終的な統合ビルド出力ディレクトリ
  - slideアプリのビルド結果がここにコピーされる
  - functionsディレクトリもここにコピーされる

### apps/shared/ (共有コード)
- **types/**: プロジェクト全体で使用する型定義
- **utils/**: 共通ユーティリティ関数

### scripts/
- **build.ts**: 統合ビルドプロセスを管理
  1. すべてのslideアプリをビルド
  2. startアプリをビルド
  3. slidesのfunctionsをstart/distにコピー
  4. slidesのdistファイルをstart/distにコピー

## ビルドフロー

```
1. pnpm build (ルート)
   ↓
2. scripts/build.ts 実行
   ↓
3. slideアプリをビルド
   → apps/slide/dist/intro/
   → apps/slide/dist/demo/
   ↓
4. startアプリをビルド
   → apps/start/dist/
   ↓
5. functionsをコピー
   → apps/start/dist/functions/
   ↓
6. スライドをコピー
   → apps/start/dist/intro/
   → apps/start/dist/demo/
   ↓
7. 最終出力: apps/start/dist/
```

## 重要な規約

### 新しいプレゼンテーションの追加
1. `apps/slide/slides/` に新しいディレクトリを作成
2. `slides.md` ファイルを作成
3. (オプション) `assets/` ディレクトリを作成
4. `pnpm build` を実行
5. `/【ディレクトリ名】/1` でアクセス可能

### API エンドポイントの追加
1. `apps/slide/functions/api/` に新しいファイルを作成
2. `onRequestGet` や `onRequestPost` をエクスポート
3. 入力バリデーションとエラーハンドリングを実装
4. すべてのプレゼンテーションから自動的に利用可能

### コンポーネントの追加
1. `apps/slide/components/` に新しい `.vue` ファイルを作成
2. `<script setup lang="ts">` を使用
3. すべてのプレゼンテーションから自動的に利用可能

## デプロイメント構造
- **本番環境**: Cloudflare Pages
- **ビルド出力**: `apps/start/dist/`
- **ルーティング**: Cloudflare Pagesが自動的にSPAルーティングを処理
