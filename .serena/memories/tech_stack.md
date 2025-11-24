# 技術スタック

## アーキテクチャ
pnpm workspace モノレポ構成

## フロントエンド
- **Slidev** (52.1.0): Vue.jsベースのスライドフレームワーク
- **Vue.js**: コンポーネントフレームワーク (Slidevに含まれる)
- **Vite** (^5.0.0): ビルドツール

## バックエンド
- **Cloudflare Pages Functions**: サーバーレスAPI
- **@cloudflare/workers-types** (^4.20240925.0): 型定義

## 言語
- **TypeScript** (^5.0.0): プロジェクト全体で使用
  - `target`: ES2020
  - `module`: ESNext
  - `strict`: true
  - `jsx`: preserve

## パッケージマネージャー
- **pnpm**: ワークスペース管理

## ビルド & 開発ツール
- **tsx** (^4.20.5): TypeScriptランナー
- **zx** (^8.8.1): スクリプト実行
- **concurrently** (^9.2.1): 並行タスク実行

## デプロイ
- **GitHub Actions**: CI/CD
- **Cloudflare Pages**: ホスティング

## モノレポ構成
```
apps/
├── slide/          # Slidevアプリケーション（メインアプリ）
├── start/          # ランディングページアプリケーション
└── shared/         # 共有コードと型定義
```

## ワークスペース管理
- `pnpm-workspace.yaml` で `apps/*` を管理
- 各アプリは独立したpackage.jsonを持つ
- 共有型定義は `@happyo-kun/shared` パッケージから提供
