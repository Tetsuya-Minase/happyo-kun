---
theme: default
background: https://cover.sli.dev
title: 「ChatGPTくん、仕事できるの？できないの？」—— 業務で使い倒した結果報告
info: |
  生成AIを業務で使い倒した結果報告
class: text-center
highlighter: shiki
drawings:
  enabled: true
transition: slide-left
mdc: true
---

# ChatGPTくん、仕事できるの？<br>できないの？

業務で使い倒した結果報告

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

<!--
「ChatGPTくん、仕事できるの？できないの？」と題して〇〇が発表いたします。
-->

---

# 📋 目次

<div class="text-xl space-y-3 mt-8">

- 🙋 自己紹介
- 💡 イントロダクション
- 💻 コーディングでの利用
- 🔍 コードレビューでの利用
- 🔎 実装調査での利用
- 📝 資料整理での利用
- 🤔 仕事で使えるの？
- 📌 まとめ

</div>

<!--
本日のアジェンダは記載の通りです。
こんな感じのことを話していければと思います。
タイトルでChatGPTくんと言っていますが、実際には色々な生成AIツールを業務で使ってみた結果を共有いたします。
-->

---

# 🙋 自己紹介

<div>

## 〇〇

</div>

<div class="grid grid-cols-2">

<div>

### 職歴
- **2016/04〜** SIer
- **2019/02〜** Web系企業

</div>

<div>

### やってきたこと・やってること

- バックエンド、フロントエンド問わず開発
- 最近はTech Leadとしてプロダクトの開発を円滑に進めるために頑張ってる

</div>

</div>


<!--
簡単に自己紹介をさせて下さい。
〇〇と申します。
経歴としては3年弱SIerに勤めた後、Web系企業に転職し現在に至ります。
やってきたこととしてはバックエンド、フロントエンド問わず開発を行ってきました。
どちらかと言うとスキルセットととしてはフロントエンド寄りなので、バックエンドもやってると言う感じです。
ここ数年はTech Leadみたいな役割をやらせてもらうことが多く、最近はプロダクトの開発を円滑に進めるために頑張ってます。
-->

---
layout: center
class: text-center
---

# 💡 イントロダクション

<!--
カンペ：
-->

---

# 💡 イントロダクション 1/2

<div class="text-xl mt-8">

## みんな生成AI使ってる？

<div class="mt-8">

### こんな仕事ない？

- 😮‍💨 実質作業になってるリファクタリング
- 🧪 テストコードの実装
- 📊 調査依頼
- 📄 資料作成
- などなど

</div>

<div v-click>

<div class="mt-8 text-3xl text-orange-400 font-bold">
<p style="line-height: 1.1;">やりたくないよね？<br>全部AIに頼んじゃおう 🚀</p>
</div>

</div>

</div>

<!--
カンペ：
-->

---

# 💡 イントロダクション 2/2

<div class="grid grid-cols-2 gap-8 mt-8">

<div>

## ✅ 話すこと


- 業務で生成AI使って良かったなと思ったこと
- 簡単なデモ

</div>

<div>

## ❌ 話さないこと

- AIツールの細かい使い方
- プロンプトの書き方
- MCP

</div>

</div>

<!--
カンペ：
-->

---
layout: center
class: text-center
---

# 💻 コーディングでの利用

<!--
カンペ：
-->

---

# 💻 コーディングでの利用 1/4

<div class="text-2xl mt-8">

## 「あのAPIやあの処理と同じなんだよな...」

<v-clicks>

<div class="mt-12 text-center">

### 👉 AIに任せましょう 🤖

</div>

<div class="mt-8 text-lg text-gray-400">

次のスライドでデモを見てみましょう

</div>

</v-clicks>

</div>

<!--
カンペ：
-->

---

# 💻 コーディングでの利用 2/4

## 🎯 デモ用コード（既存実装）

<TerminalWindow title="UserController.ts" class="w-full">

```tsx
// interface layer
export class UserController {
  constructor(private getUsersUseCase: GetUsersUseCase) {}

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      // クエリパラメータの取得
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

      // ユースケースの実行
      const result = await this.getUsersUseCase.execute({ page, limit });

      // 成功レスポンス
      res.status(200).json(result);
    } catch (error) {
      // エラーハンドリング
      if (error instanceof Error) {
        res.status(400).json({
          error: { message: error.message, code: 'BAD_REQUEST' }
        });
      } else {
        res.status(500).json({
          error: { message: '内部サーバーエラーが発生しました', code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    }
  }
}
```

</TerminalWindow>

<!--
カンペ：
-->

---

# 💻 コーディングでの利用 3/4

## 📝 AIに投げたプロンプト

<TerminalWindow title="Claude Code" class="w-full">

以下の修正を行なって下さい。

# 要件
* 現状のUser取得APIに認証あり版を作成して下さい
* 基本的なロジックは同じでパスを変えて下さい
* レスポンスに`isOwnProfile`という項目を追加し、
  自分の情報であればtrueにして下さい
* 認証ありはCookieからリクエストユーザのIdを取得して下さい
* 認証なしは3分間のキャッシュできるようにして下さい

</TerminalWindow>

<v-click>

<div class="mt-8 text-xl text-green-400">

✨ AIが認証ありAPI + キャッシュ設定を自動実装！

</div>

</v-click>

<!--
カンペ：
-->

---

# 💻 コーディングでの利用 4/4

<div class="text-2xl mt-8">

## 「〇〇さんが困ってそうだから、<br>ちょっとしたツールが欲しいんだよな」

<v-clicks>

<div class="mt-12 text-center">

### 👉 AIに任せまs(ry 🤖

</div>

<div class="mt-8 text-lg">

**JIRAチケット起票フォーム**を作成してもらった例

- 必須項目・任意項目の設定
- 日本語UI
- カレンダー機能
- **エラーハンドリングも実装済み** 🎉

</div>

</v-clicks>

</div>

<!--
カンペ：
-->

---
layout: center
class: text-center
---

# 🔍 コードレビューでの利用

<!--
カンペ：
-->

---

# 🔍 コードレビューでの利用 1/3

<div class="text-2xl mt-8">

## 数百行に及ぶ変更...<br>file changesは数十にも...

<v-clicks>

<div class="mt-12 text-center">

### 👉 AIに任せましょう 🤖

</div>

<div class="mt-8 text-lg text-gray-400">

Reactのselectorでパフォーマンス問題を見つけた例

</div>

</v-clicks>

</div>

<!--
カンペ：
-->

---

# 🔍 コードレビューでの利用 2/3

## 🎯 デモ用コード

<TerminalWindow title="BadExample.tsx" class="w-full">

```tsx
import { useRef } from 'react'
import { useAppSelector } from '../store/hooks'

export function BadExample() {
  const renderCount = useRef(0)
  renderCount.current += 1

  const { name } = useAppSelector((state) => ({ name: state.demo.name }))

  return (
    <div>〜〜</div>
  )
}
```

</TerminalWindow>

<div class="mt-4">

## プロンプト

<TerminalWindow title="Claude Code" class="w-full">

BadExampleについて以下の観点に沿ってレビューしてください。
* パフォーマンス上ネックになるポイントがあれば改善案を提示して下さい
* デファクトスタンダードにのっとった実装になっているか確認して下さい

</TerminalWindow>

</div>

<!--
カンペ：
-->

---

# 🔍 コードレビューでの利用 3/3

## 🚨 AIが見つけたパフォーマンス問題

<TerminalWindow title="Claude Code - レビュー結果" class="w-full text-sm">

❌ useAppSelector のメモ化が効いていない（最重要）

問題点 (8行目):
const { name } = useAppSelector((state) => ({ name: state.demo.name }))

- 毎回新しいオブジェクト { name: ... } を生成するため、
  参照の等価性チェック（===）が常に false
- Redux の state がどこか一箇所でも変更されると、
  必ずこのコンポーネントが再レンダリング
- nameが変わっていなくても無駄な再レンダリングが発生

改善案:
// 方法1: プリミティブ値を直接取得（推奨）
const name = useAppSelector((state) => state.demo.name)

// 方法2: shallowEqualを使用
import { shallowEqual } from 'react-redux'
const { name } = useAppSelector(
  (state) => ({ name: state.demo.name }),
  shallowEqual
)

</TerminalWindow>

<v-click>

<div class="mt-4 text-xl text-green-400">

✨ パッと見で見落としていた問題を発見！

</div>

</v-click>

<!--
カンペ：
-->

---
layout: center
class: text-center
---

# 🔎 実装調査での利用

<!--
カンペ：
-->

---

# 🔎 実装調査での利用 1/3

<div class="text-2xl mt-8">

## 「〇〇って処理どうなってますか？」<br>って聞かれますよね？

<v-clicks>

<div class="mt-8">

自分で調べればわかるけど<br>探すの面倒だな... 😮‍💨

</div>

<div class="mt-12 text-center">

### 👉 AIに任せましょう 🤖

</div>

</v-clicks>

</div>

<!--
カンペ：
-->

---

# 🔎 実装調査での利用 2/3

## 📝 プロンプト例

<TerminalWindow title="Claude Code" class="w-full">

こちらのrepositoryにおいて、`src/libraries`配下のscriptに
おいてどの様な処理をする何のためのファイルなのか
ファイル単位で説明して下さい。

</TerminalWindow>

<v-click>

<div class="mt-8">

## 🎯 AIの回答（抜粋）

<TerminalWindow title="Claude Code - 調査結果" class="w-full text-sm">

1. date.ts - 日付文字列の解析と変換を行うユーティリティ
   - parseStringDate(): 文字列の日付をタイムスタンプに変換
   - dateFromDateString(): YYYY/MM/DD形式からDateオブジェクト生成

2. image.ts - 画像のレスポンシブ対応サイズ計算
   - getImageSize(): 用途に応じてPC・SP用のサイズを計算

3. articles.ts - ブログ記事のメタデータ管理とタグ処理
   - getArticleMetaData(): 全記事を読み込み、メタデータを抽出
   - getTagCount(): タグごとの件数を集計

</TerminalWindow>

</div>

</v-click>

<!--
カンペ：
-->

---

# 🔎 実装調査での利用 3/3

## 🔧 追加質問もスムーズに

<TerminalWindow title="Claude Code" class="w-full">

追加で教えて下さい。
こちらのprojectではprismjsを利用していると思います。
テキストのインラインコードのコントラスト比が低いため
改善したいです。どこを修正すれば良いでしょうか？

</TerminalWindow>

<v-click>

<div class="mt-4">

## ✨ AIの回答

<TerminalWindow title="Claude Code - 調査結果" class="w-full text-sm">
<div>
⏺ 見つかりました！インラインコードのコントラスト比が低い原因は
src/styles/templates/mdTemplate.css:120 にあります。

問題の箇所: 120行目の opacity: 20%; が原因！

修正方法:

```css
.md-article p > code {
    background-color: var(--color-gray-300);
    /* opacity: 20%; を削除 */
    color: var(--color-gray-800);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
}
```
</div>
</TerminalWindow>

</div>

</v-click>

<!--
カンペ：
-->

---
layout: center
class: text-center
---

# 📝 資料整理での利用

<!--
カンペ：
-->

---

# 📝 資料整理での利用

<div class="text-2xl mt-8">

## 「急遽プレゼン資料作らなきゃ...」<br>話すことは決まってるんだけどな...

<v-clicks>

<div class="mt-12 text-center">

### 👉 AIに任せましょう 🤖

</div>

<div class="mt-8 text-xl">

**NotebookLM** を使ってみた

<div class="text-lg text-gray-400 mt-4">

資料をアップロードするだけで<br>構成やスクリプトを自動生成

</div>

<div class="mt-8 text-green-400">

✨ 最近notebooklmで感動した！

</div>

</div>

</v-clicks>

</div>

<!--
カンペ：
-->

---
layout: center
class: text-center
---

# 🤔 仕事で使えるの？

<!--
カンペ：
-->

---

# 🤔 仕事で使えるの？ 1/2

<v-clicks>

<div class="text-2xl mt-8">

## 使えるっちゃ使えるが<br>使えないっちゃ使えない 🤷

</div>

<div class="mt-8 text-xl">

### 今までの仕事が半分の時間で出来た！

<div class="text-red-400 font-bold mt-4">

❌ は無い

</div>

<div class="text-gray-400 mt-2">

（自分の生産性がAIで爆上がりした！は無い）

</div>

</div>

<div class="mt-12 text-2xl text-green-400">

## 何が変わった？

自分の**手足として働くパートナー**が増えた<br>
自分が**150%働ける**様になった感覚

</div>

</v-clicks>

<!--
カンペ：
-->

---

# 🤔 仕事で使えるの？ 2/2

<div class="grid grid-cols-2 gap-8 mt-8">

<div>

## ✅ 使えるポイント

<v-clicks>

### 単純作業系
- 一定やり方を教えれば勝手にできる様な内容
- 人間がやらなくて良いと思えるレベル

### 資料整理系
- 最近notebooklmで感動
- 人間がやらなくて良いと思えるレベル

</v-clicks>

</div>

<div>

## ❌ 使えないポイント

<v-clicks>

### 人間が見た方が早いこと
- 数年前のコードもあれば数日前のコードもある様なプロダクト
- AIは確実に実装がブレる

### 複雑なこと
- 人間がシンプルにして上げた方が精度が高い

### 人間が対応しきれない
- AIがやったからOKという世界はまだ来てない
- 最後のボトルネックは人間

</v-clicks>

</div>

</div>

<!--
カンペ：
-->

---
layout: center
class: text-center
---

# 📌 まとめ

<div class="text-2xl mt-12">

## AI使って人間は楽していきましょう 🚀

</div>

<!--
カンペ：
-->

---
layout: center
class: text-center
---

<div class="mt-8">


<div class="text-2xl text-gray-400 mb-8">

ちなみに...

</div>

<v-clicks>

<div class="text-3xl text-orange-400 font-bold mb-12">

このスライド自体も<br>AIに作ってもらいました 🤖✨

</div>

<div class="text-lg text-gray-500">

（原稿は人間が書きましたが、<br>スライド化は全部AIにお任せ）

</div>

<div class="mt-16 text-2xl text-gray-500">

Thank you for listening! 🎉

</div>

</v-clicks>

</div>

<!--
カンペ：
-->

<style>
/* 通常スライドのタイトルを左上に固定 */
.slidev-layout:not(.slidev-layout-center) h1 {
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 2rem;
}

/* セクション区切りスライド以外のタイトルを左詰め */
.slidev-page:not([class*="text-center"]) h1 {
  text-align: left;
}

/* コンテンツエリアの調整 */
.slidev-layout {
  padding-top: 2rem;
}
</style>
