# コーディングスタイルと規約

## TypeScript設定
- **strictモード有効**: `strict: true`
- **target**: ES2020
- **module**: ESNext
- **moduleResolution**: node
- **jsx**: preserve
- **esModuleInterop**: true
- **skipLibCheck**: true
- **forceConsistentCasingInFileNames**: true
- **allowImportingTsExtensions**: true
- **noEmit**: true
- **isolatedModules**: true

## Vue.js コンポーネント規約
### Script Setup構文
- `<script setup lang="ts">` を使用
- Composition APIスタイル

### リアクティブ変数
- `ref()` を使用してリアクティブな値を定義
- `computed()` を使用して計算プロパティを定義

### 命名規則
- コンポーネント名: PascalCase (例: `ApiDemo.vue`, `CssPlayground.vue`, `TerminalWindow.vue`)
- 変数名: camelCase
- 定数: camelCase
- CSS クラス: kebab-case

### エラーハンドリング
```typescript
try {
  // API呼び出しなど
} catch (err: any) {
  // エラーハンドリング
  console.error('エラーメッセージ:', err)
}
```

## Cloudflare Pages Functions規約
### エクスポート関数
- `onRequestGet`: GET リクエストハンドラ
- `onRequestPost`: POST リクエストハンドラ
- `onRequestOptions`: OPTIONS リクエストハンドラ (CORS対応)

### レスポンス形式
```typescript
return new Response(JSON.stringify({
  message: 'メッセージ',
  timestamp: Date.now()
}), {
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### 入力バリデーション
- 常に入力値を検証する
- 長さ制限を設ける (例: 100文字)
- エラー時は適切なステータスコードを返す (400, 500等)

## ファイル構成規約
### スライドディレクトリ
```
slides/
├── intro/
│   ├── slides.md    # スライド内容
│   └── assets/      # スライド固有のアセット
└── demo/
    ├── slides.md
    └── assets/
```

### 共有コンポーネント
- `apps/slide/components/` に配置
- すべてのプレゼンテーションから利用可能

### API関数
- `apps/slide/functions/api/` に配置
- すべてのプレゼンテーションで共有

## コメント規約
- 日本語コメント可
- 複雑なロジックには説明コメントを追加
- TODOコメントは避け、Issueで管理

## スタイリング
### Vue コンポーネント
- `<style scoped>` を使用
- レスポンシブデザイン対応 (`@media` クエリを使用)
- CSS変数よりも直接的な値を使用

### カラースキーム
- プライマリカラー: `#4ecdc4`
- 成功: `#d4edda`
- エラー: `#f8d7da`

## エラーメッセージ
- ユーザーフレンドリーな日本語メッセージ
- 技術的な詳細はコンソールログに出力
