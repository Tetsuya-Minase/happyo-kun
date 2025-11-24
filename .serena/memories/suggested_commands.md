# 推奨コマンド

## 開発コマンド

### 依存関係のインストール
```bash
pnpm install
```

### 開発サーバーの起動
```bash
# すべてのアプリを起動 (slide: 3030番ポート, start: 3000番ポート)
pnpm dev

# slideアプリのみ起動
pnpm dev:slide

# startアプリのみ起動
pnpm dev:start
```

### ビルド
```bash
# すべてのスライドをビルドし、統合ビルドを作成
pnpm build

# 個別のスライドアプリをビルド
pnpm --filter slide build

# startアプリをビルド
pnpm --filter start build
```

### プレビュー
```bash
# プロダクションビルドをプレビュー
pnpm preview
```

### スライドのエクスポート
```bash
pnpm --filter slide export
```

## ワークスペースコマンド

### 特定のワークスペースでコマンド実行
```bash
# slideアプリで実行
pnpm --filter slide <command>

# startアプリで実行
pnpm --filter start <command>

# sharedパッケージで実行
pnpm --filter shared <command>
```

## Git コマンド

### ブランチ操作
```bash
# 現在のブランチを確認
git branch

# 新しいブランチを作成して切り替え
git checkout -b feature/your-feature-name

# ステータス確認
git status

# 差分確認
git diff
```

### コミット
```bash
# ファイルをステージング
git add .

# コミット
git commit -m "feat: Add new feature"

# プッシュ
git push origin feature/your-feature-name
```

## macOS (Darwin) 固有コマンド

### ファイル操作
```bash
# ディレクトリの内容を表示
ls -la

# ディレクトリを再帰的に表示
ls -R

# ファイル検索
find . -name "*.ts"

# ファイル内容検索
grep -r "pattern" .
```

### プロセス管理
```bash
# ポートを使用しているプロセスを確認
lsof -i :3030
lsof -i :3000

# プロセスを終了
kill -9 <PID>
```

## デプロイメント

### GitHub Actions経由
- mainブランチへのプッシュで自動デプロイ
- プルリクエスト作成でプレビューデプロイ

## トラブルシューティング

### キャッシュクリア
```bash
# node_modulesとロックファイルを削除して再インストール
rm -rf node_modules pnpm-lock.yaml
pnpm install

# ビルドキャッシュをクリア
rm -rf dist .vite .slidev
```

### ポート衝突解決
```bash
# 使用中のポートを確認
lsof -i :3030
lsof -i :3000

# 強制終了
kill -9 <PID>
```
