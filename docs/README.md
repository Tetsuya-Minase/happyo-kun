# happyo-kun (発表くん) Documentation

## 概要

happyo-kun（発表くん）は、Slidevを使用したインタラクティブなプレゼンテーションアプリケーションです。Cloudflareの統合インフラストラクチャを活用し、Markdownベースのスライドにライブコーディング機能とAPI統合を組み合わせています。

## プロジェクト構成

```
happyo-kun/
├── apps/                         # アプリケーション層
│   ├── slide/                   # メインのSlidevアプリケーション
│   │   ├── slides.md           # スライドコンテンツ（Markdown）
│   │   ├── components/         # Vue.jsコンポーネント
│   │   │   ├── CssPlayground.vue  # CSSリアルタイムエディター
│   │   │   └── ApiDemo.vue        # API実演コンポーネント
│   │   ├── functions/          # Cloudflare Pages Functions
│   │   │   ├── _middleware.ts  # セキュリティミドルウェア
│   │   │   └── api/            # APIエンドポイント
│   │   │       ├── hello.ts    # 挨拶API
│   │   │       └── css.ts      # CSSスニペット処理API
│   │   └── dist/               # ビルド済み静的ファイル
│   └── shared/                 # 共有コード
│       ├── types/              # TypeScript型定義
│       └── utils/              # 共通ユーティリティ
├── .github/workflows/          # GitHub Actions CI/CD
├── docs/                       # プロジェクトドキュメント
│   ├── AGENT_PROMPT.md        # 詳細仕様書
│   └── README.md              # このファイル
└── pnpm-workspace.yaml        # pnpmワークスペース設定
```

## 主要な機能

### 🎨 インタラクティブCSSプレイグラウンド
- リアルタイムCSS編集機能
- ライブプレビューによる即座の結果確認
- スライド内での動的なスタイリングデモンストレーション

### 🚀 API統合
- Cloudflare Pages Functionsを活用したサーバーレスAPI
- スライドコンポーネントからのAPIコール
- セキュアな入力サニタイゼーション

### 📱 レスポンシブデザイン
- モバイルフレンドリーなプレゼンテーションインターフェース
- あらゆるデバイスサイズに対応

### ⚙️ 自動化されたCI/CD
- GitHub Actionsによる自動ビルド・デプロイ
- Cloudflare Pagesとの連携

## 技術スタック

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| **フロントエンド** | Slidev (Vue.js) | プレゼンテーションスライド生成 |
| **バックエンド** | Cloudflare Pages Functions | サーバーレスAPI |
| **インフラ** | Cloudflare Pages | 静的ホスティング・CDN |
| **言語** | TypeScript | 全体を通じた開発言語 |
| **パッケージ管理** | pnpm Workspaces | モノレポ管理 |
| **デプロイメント** | GitHub Actions | 自動CI/CD |

## 開発コマンド

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev                    # localhost:3030でスライドアプリを起動

# プロダクションビルド
pnpm build                  # apps/slide/distに静的サイトを生成

# プロダクションプレビュー
pnpm preview

# スライドのエクスポート
pnpm --filter slide export
```

## APIエンドポイント

### `GET /api/hello`
- **パラメータ**: `name` (オプション)
- **説明**: シンプルな挨拶メッセージを返すAPI
- **例**: `/api/hello?name=世界` → "Hello, 世界!"

### `POST /api/css`
- **説明**: CSSスニペットの処理・保存API
- **セキュリティ**: 入力サニタイゼーション実装済み

## セキュリティ機能

- **セキュリティミドルウェア**: 全APIリクエストの監視・制御
- **入力サニタイゼーション**: 危険なコードの自動フィルタリング
- **エラーハンドリング**: ユーザーフレンドリーなエラーメッセージ

## 開発ガイドライン

### コンポーネント開発
- Vue.js/Slidevの規約に従う
- 共有型定義は `/apps/shared/types/` を使用
- TypeScriptを必須とする

### API開発
- 全てのAPIコードは `/apps/slide/functions/` に配置
- 適切なエラーハンドリングを実装
- セキュリティベストプラクティスを遵守

### ビルド・デプロイ
- `pnpm build`でクリーンなdist/出力を確認
- GitHub Actionsによる自動デプロイ
- Cloudflare Pagesでの本番環境提供

## プロジェクトのステータス

✅ **実装済み機能**
- Slidevベースのプレゼンテーションアプリケーション
- Vue.jsコンポーネント (CssPlayground, ApiDemo)
- Cloudflare Pages Functions APIエンドポイント
- セキュリティミドルウェア
- GitHub ActionsによるCI/CDパイプライン
- pnpmワークスペース設定
- プロジェクト全体でのTypeScript導入

## さらに詳しい情報

詳細な技術仕様については、[AGENT_PROMPT.md](./AGENT_PROMPT.md) を参照してください。

---

**📝 Note**: このプロジェクトは継続的に改善・拡張される予定です。新機能の追加やバグ修正については、GitHub Issuesをご利用ください。