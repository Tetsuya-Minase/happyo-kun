# プロジェクト仕様書: インタラクティブ・スライドアプリケーション

## 1. プロジェクト概要

### 1.1. プロジェクト名
- **名称**: happyo-kun (発表くん)
- **リポジトリ**: `github.com/yourusername/happyo-kun`
- **説明**: 🎯 Your presentation buddy - Interactive slides with live coding powered by Slidev & Cloudflare

### 1.2. 目的
本プロジェクトは、`Slidev` を用いて Markdown から生成されるインタラクティブなプレゼンテーションスライドを、Cloudflare のグローバルネットワークを通じて高速かつ安全に配信する Web アプリケーションを開発することを目的とします。

### 1.3. コア機能
* Markdown ファイルを元にしたスライドの静的サイト生成
* スライド上での JavaScript 実行によるインタラクティブなデモ（CSS のリアルタイム編集）
* スライドからバックエンド API へのデータ取得リクエスト
* リアルタイムCSSプレイグラウンド機能

-----

## 2. 技術スタック

| カテゴリ | 技術 | 役割・選定理由 |
| :--- | :--- | :--- |
| **フロントエンド** | Slidev | Markdown からスライドを生成するコアフレームワーク。Vue.js ベース。 |
| **インフラ** | Cloudflare Pages | 静的サイトのホスティングと CDN 配信。GitHub と連携した自動デプロイ。 |
| **バックエンド (API)** | Cloudflare Workers (Pages Functions) | 低遅延なサーバーレス API。スライドと同一ドメインで提供し CORS を回避。 |
| **言語** | TypeScript | フロントエンド（Slidev内）およびバックエンド (Workers) の開発言語。 |
| **パッケージ管理** | pnpm (with Workspaces) | モノレポ構成を効率的に管理。 |
| **CI/CD** | GitHub & Cloudflare Pages | GitHub へのプッシュをトリガーに、ビルドとデプロイを自動実行。 |

-----

## 3. アーキテクチャ

### 3.1. システム構成図

ユーザーからのリクエストは Cloudflare のエッジネットワークを経由し、静的なスライドコンテンツ (Pages) または API (Workers) にルーティングされます。

```mermaid
graph TD
    A[User Browser] --> B{Cloudflare Edge Network};
    B --> C[Cloudflare Pages (Static Slides)];
    B --> D[Cloudflare Workers (API)];

    subgraph GitHub Repository (Monorepo)
        E[/apps/slide]
        F[/apps/shared]
    end

    G[GitHub Actions] --> B;
    E --> G;
    F --> G;

    style C fill:#f9f,stroke:#333,stroke-width:2px
    style D fill:#ccf,stroke:#333,stroke-width:2px
```

### 3.2. ディレクトリ構造

`pnpm workspaces` を利用したモノレポ構成を採用します。

```plaintext
happyo-kun/
├── apps/
│   ├── slide/                    # Slidev アプリケーション
│   │   ├── slides.md            # メインスライド
│   │   ├── components/          # Vueコンポーネント
│   │   │   ├── CssPlayground.vue
│   │   │   └── ApiDemo.vue
│   │   ├── functions/           # Cloudflare Pages Functions
│   │   │   ├── _middleware.ts  # 共通ミドルウェア
│   │   │   └── api/
│   │   │       ├── hello.ts
│   │   │       └── css.ts
│   │   ├── public/              # 静的アセット
│   │   ├── styles/              # グローバルスタイル
│   │   │   └── main.css
│   │   ├── package.json
│   │   ├── vite.config.ts       # Vite設定
│   │   ├── .env.example         # 環境変数サンプル
│   │   └── tsconfig.json        # TypeScript設定
│   └── shared/                  # 共有コード
│       ├── types/               # 型定義
│       │   └── index.ts
│       ├── utils/               # ユーティリティ
│       │   └── api.ts
│       └── package.json
├── package.json                 # ルートpackage.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── .gitignore
├── LICENSE                      # MITライセンス
├── LICENSE-CONTENT             # コンテンツライセンス
├── README.md
└── .github/
    └── workflows/
        └── deploy.yml           # GitHub Actions設定
```

**注**: Cloudflare Pages Functions を利用する場合、APIコードは `/apps/slide/functions` のように、Pages プロジェクト内に配置することが推奨されます。

-----

## 4. 機能要件

### FR-1: スライド表示機能

* **仕様**: `/apps/slide/slides.md` に記述された Markdown を元に、`slidev build` コマンドで HTML, CSS, JS を含む静的サイトを生成すること。
* **受け入れ基準**:
    * 生成されたサイトがブラウザで正しく表示されること
    * スライドのページ遷移が機能すること
    * キーボードショートカット（Space, Arrow Keys）が動作すること

### FR-2: CSSプレイグラウンド機能

* **仕様**: スライド内でリアルタイムにCSSを編集・プレビューできる機能
* **要求事項**:
    * テキストエリアでCSSコードを入力
    * iframeでプレビューをリアルタイム更新
    * デフォルトCSSテンプレートの提供
    * リセット機能
    * 保存機能（APIエンドポイント経由）
* **受け入れ基準**:
    * CSS入力後300ms以内にプレビューが更新されること
    * XSS攻撃を防ぐためのサニタイゼーション処理が実装されていること
    * 保存ボタンクリックでAPIに送信されること

### FR-3: API エンドポイント機能

* **仕様**: 以下の仕様で API エンドポイントを作成すること。

#### エンドポイント1: Hello API
* **パス**: `/api/hello`
* **メソッド**: `GET`
* **クエリパラメータ**: `name` (string, optional, default: "World")
* **成功レスポンス (200 OK)**:
  ```json
  {
    "message": "Hello, {name}!",
    "timestamp": 1234567890
  }
  ```

#### エンドポイント2: CSS保存API
* **パス**: `/api/css`
* **メソッド**: `POST`
* **リクエストボディ**:
  ```json
  {
    "css": "/* CSS code */",
    "timestamp": 1234567890
  }
  ```
* **成功レスポンス (200 OK)**:
  ```json
  {
    "success": true,
    "id": "uuid-string",
    "savedAt": 1234567890
  }
  ```

### FR-4: スライドからの API 連携

* **仕様**: スライド内にボタンを配置し、クリックすると `FR-3` で作成した API (`/api/hello`) にリクエストを送信し、結果を画面に表示すること。
* **受け入れ基準**:
    * ボタンクリック後、API から取得したメッセージ（例: "Hello, Slidev!"）がスライド上に表示されること
    * API 通信時に CORS エラーが発生しないこと
    * ローディング状態が表示されること

### FR-5: エラーハンドリング

* **仕様**: API通信エラー時の適切な処理
* **要求事項**:
    * ネットワークエラー時のフォールバック表示
    * タイムアウト処理（5秒）
    * ユーザーフレンドリーなエラーメッセージ
    * リトライボタンの提供
* **受け入れ基準**:
    * エラー時に赤色の通知が表示されること
    * エラーメッセージが日本語と英語で表示されること

-----

## 5. 型定義仕様

### 5.1. 共有型定義
```typescript
// /apps/shared/types/index.ts

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: number;
}

export interface HelloResponse {
  message: string;
  timestamp: number;
}

export interface CssSubmitRequest {
  css: string;
  timestamp: number;
}

export interface CssSubmitResponse {
  success: boolean;
  id: string;
  savedAt: number;
}

export interface ErrorResponse {
  error: true;
  message: string;
  code?: string;
  timestamp: number;
}
```

-----

## 6. コンポーネント仕様

### 6.1. CssPlayground.vue
```vue
<!-- /apps/slide/components/CssPlayground.vue -->
<template>
  <div class="css-playground">
    <div class="editor">
      <textarea v-model="cssCode" @input="onCssChange" />
      <div class="controls">
        <button @click="resetCss">リセット</button>
        <button @click="saveCss">保存</button>
      </div>
    </div>
    <div class="preview">
      <iframe ref="previewFrame" :srcdoc="previewHtml" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 実装詳細は開発時に記述
// デバウンス処理、サニタイゼーション、API通信を含む
</script>
```

### 6.2. ApiDemo.vue
```vue
<!-- /apps/slide/components/ApiDemo.vue -->
<template>
  <div class="api-demo">
    <input v-model="name" placeholder="名前を入力" />
    <button @click="callApi" :disabled="loading">
      {{ loading ? '送信中...' : 'API呼び出し' }}
    </button>
    <div v-if="response" class="response">
      {{ response }}
    </div>
    <div v-if="error" class="error">
      エラー: {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
// 実装詳細は開発時に記述
// API通信、エラーハンドリング、ローディング状態管理を含む
</script>
```

-----

## 7. 開発ステップ (詳細版)

### Step 0: 前提条件の確認
```bash
# 必要なツールのバージョン確認
node --version  # v20.0.0以上
pnpm --version  # v8.0.0以上

# Cloudflare CLIのインストール
npm install -g wrangler
wrangler login
```

### Step 1: プロジェクトの初期設定
```bash
# リポジトリの作成
mkdir happyo-kun && cd happyo-kun
git init

# pnpmの初期化とworkspace設定
pnpm init
cat > pnpm-workspace.yaml << EOF
packages:
  - 'apps/*'
EOF

# 基本的な設定ファイル
cat > .gitignore << EOF
node_modules
.DS_Store
dist
.env
.env.local
*.log
.slidev
.vite
EOF

# ルートpackage.jsonの設定
cat > package.json << EOF
{
  "name": "happyo-kun",
  "version": "1.0.0",
  "private": true,
  "description": "🎯 Your presentation buddy - Interactive slides with live coding powered by Slidev & Cloudflare",
  "scripts": {
    "dev": "pnpm --filter slide dev",
    "build": "pnpm --filter slide build",
    "preview": "pnpm --filter slide preview"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
EOF
```

### Step 2: Slidevプロジェクトの作成
```bash
# Slidevアプリケーションの作成
mkdir -p apps/slide
cd apps/slide
pnpm create slidev@latest .
# テンプレート: Default を選択
# パッケージマネージャー: pnpm を選択

# 追加の依存関係
pnpm add -D @types/node vite @cloudflare/workers-types

# TypeScript設定
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["@cloudflare/workers-types"]
  }
}
EOF
```

### Step 3: Pages Functions の実装
```bash
# Functions ディレクトリ作成
mkdir -p apps/slide/functions/api

# ミドルウェアの作成
cat > apps/slide/functions/_middleware.ts << 'EOF'
export async function onRequest(context) {
  const response = await context.next();
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  return response;
}
EOF

# Hello APIの実装
cat > apps/slide/functions/api/hello.ts << 'EOF'
export async function onRequestGet(request) {
  const url = new URL(request.url);
  const name = url.searchParams.get('name') || 'World';
  
  return new Response(JSON.stringify({
    message: `Hello, ${name}!`,
    timestamp: Date.now()
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
EOF
```

### Step 4: 共有コードの設定
```bash
# 共有パッケージの作成
mkdir -p apps/shared/types apps/shared/utils
cd apps/shared

# package.json
cat > package.json << EOF
{
  "name": "@happyo-kun/shared",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "types": "types/index.ts"
}
EOF

# 型定義は上記セクション5.1参照
```

### Step 5: Vite設定
```typescript
// apps/slide/vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    __API_URL__: JSON.stringify(
      process.env.NODE_ENV === 'production' 
        ? '/api'
        : 'http://localhost:8788/api'
    )
  },
  slidev: {
    build: {
      out: 'dist'
    }
  }
})
```

-----

## 8. セキュリティ要件

### SR-1: Content Security Policy (CSP)
* **仕様**: XSS攻撃を防ぐためのCSPヘッダー設定
* **実装場所**: `/apps/slide/functions/_middleware.ts`（上記Step 3参照）

### SR-2: Rate Limiting
* **仕様**: API エンドポイントへの過度なリクエストを制限
* **制限**: IPアドレスごとに1分間100リクエストまで
* **実装例**:
```typescript
// functions/api/_rateLimit.ts
const rateLimitMap = new Map();

export async function checkRateLimit(request: Request): Promise<boolean> {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `rate_${ip}`;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1分
  const max = 100;

  const current = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };
  
  if (now > current.resetTime) {
    current.count = 0;
    current.resetTime = now + windowMs;
  }
  
  current.count++;
  rateLimitMap.set(key, current);
  
  return current.count <= max;
}
```

### SR-3: 入力サニタイゼーション
* **仕様**: CSSコードの危険な要素を除去
* **対象**: `expression()`, `javascript:`, `<script>` タグなど
* **最大長**: 100KB

-----

## 9. テスト要件

### T-1: ローカル動作確認
```bash
# Slidevの起動
cd apps/slide
pnpm dev
# http://localhost:3030 でアクセス可能

# 別ターミナルでPages Functions起動
npx wrangler pages dev dist --compatibility-date=2024-01-01
# http://localhost:8788 でアクセス可能
```

### T-2: ビルドテスト
```bash
# プロダクションビルド
pnpm run build

# ビルド成果物の確認
ls -la apps/slide/dist/
# index.html, assets/ などが生成されていることを確認
```

### T-3: API動作確認
```bash
# ローカルAPIテスト
curl http://localhost:8788/api/hello?name=Test

# 期待されるレスポンス
# {"message":"Hello, Test!","timestamp":1234567890}
```

### T-4: コンポーネント動作確認
- CssPlaygroundコンポーネント:
    - CSS入力でプレビューが更新される
    - リセットボタンで初期状態に戻る
    - 保存ボタンでAPIに送信される
- ApiDemoコンポーネント:
    - 名前入力後、ボタンクリックでAPI呼び出し
    - レスポンスが表示される
    - エラー時にエラーメッセージが表示される

-----

## 10. トラブルシューティング

### よくある問題と解決方法

| 問題 | 原因 | 解決方法 |
|-----|------|---------|
| CORS エラー | API URLの設定ミス | vite.config.tsの`__API_URL__`を確認 |
| ビルドエラー | Node.jsバージョン | Node.js v20以上を使用 |
| Functions 404 | ディレクトリ構造 | functions/ディレクトリの配置を確認 |
| pnpm workspace エラー | 設定ファイルの形式 | pnpm-workspace.yamlのインデントを確認 |
| Slidev起動エラー | ポート競合 | `--port 3031`でポート変更 |
| API timeout | Workers設定 | wrangler.tomlの設定確認 |

-----

## 11. デプロイ設定

### 11.1. GitHub Actions設定
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - run: pnpm install --frozen-lockfile
      
      - run: pnpm run build
      
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: 'happyo-kun'
          directory: 'apps/slide/dist'
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### 11.2. Cloudflare Pages設定
Cloudflare Dashboardで設定:
- **ビルドコマンド**: `pnpm run build`
- **ビルド出力ディレクトリ**: `apps/slide/dist`
- **環境変数**:
    - `NODE_VERSION`: 20
    - `PNPM_VERSION`: 8

-----

## 12. デプロイ後の検証

### 検証チェックリスト
- [ ] スライドが正しく表示される
- [ ] ページ遷移が動作する（矢印キー、スペースキー）
- [ ] APIエンドポイント `/api/hello` が応答する
- [ ] CSSプレイグラウンドが動作する
- [ ] コンソールにエラーが出ていない
- [ ] レスポンシブデザインが機能している
- [ ] HTTPSで配信されている
- [ ] CSPヘッダーが設定されている

### パフォーマンス目標
- Lighthouse スコア: 90以上
- First Contentful Paint: 1.5秒以内
- Time to Interactive: 3秒以内
- Total Blocking Time: 200ms以下

-----

## 13. 環境変数

### 開発環境 (.env.local)
```env
VITE_API_URL=http://localhost:8788/api
VITE_APP_NAME=happyo-kun
VITE_ENV=development
```

### 本番環境（Cloudflare Pages）
```env
NODE_VERSION=20
PNPM_VERSION=8
```

-----

## 14. README.md内容仕様

```markdown
# 🎯 happyo-kun (発表くん)

> Your presentation buddy - Interactive slides with live coding powered by Slidev & Cloudflare

## ✨ Features

- 📝 Markdown-driven slides
- 🎨 Real-time CSS playground
- 🚀 Powered by Cloudflare's global network
- 🔧 Interactive API demos
- ⚡ Lightning-fast performance

## 🚀 Quick Start

\`\`\`bash
# Clone repository
git clone https://github.com/yourusername/happyo-kun.git
cd happyo-kun

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
\`\`\`

## 📚 Documentation

See [docs](./docs) for detailed documentation.

## 📜 License

- System Code: [MIT License](LICENSE)
- Slide Content: See [LICENSE-CONTENT](LICENSE-CONTENT)

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.
```

-----

## 15. (将来的な拡張) Web Components

* **概要**: 将来的には、React や Angular で作成したコンポーネントを Web Components としてビルドし、スライド内に埋め込めるように拡張する可能性があります。
* **現状のタスク**: 今回の実装範囲には含めません。ただし、アーキテクチャがこれを妨げないようにしてください（現在のJamstackアーキテクチャはこの要件と互換性があります）。
* **拡張時の考慮事項**:
    - `/apps/components/` ディレクトリを追加
    - Web Components のビルドパイプライン構築
    - Custom Elements の登録処理実装