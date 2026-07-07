# Corrosion — 廃棄物処理ボイラ 腐食対策アイデア集

廃棄物処理ボイラの腐食量測定・対策アイデアを集約するリポジトリ。

## ファイル構成

| ファイル | 内容 |
|---|---|
| `ChatGpt腐食.pdf` ほか計4つ | 元資料（ChatGPT 50案／Fable 18案／Gemini 20案／Opus 30案＝計118案） |
| `腐食対策アイデア_統合版.pdf` | 4資料をまたぐ重複案を「内容の同一性のみ」で統合した61案。A4 1枚2案＋表紙（計32p） |
| `腐食対策アイデア_統合版_評価付き.pdf` | 上記に、各案への「Claude評価」を統一色（赤 #c62828）で追記した版。元の文は不変 |
| `tools/ideas.json` | 統合61案のデータ（分類／タイトル／本文／統合元の出典）。カード順＝groups配列の平坦化順 |
| `tools/evals.json` | 各案への評価コメント。**61要素の文字列配列、カード番号順（ideas.json平坦化順と同一）** |
| `tools/gen.mjs` | PDF生成スクリプト。`evals.json` が存在すれば評価付き版として出力する |

## PDFの再生成方法

要件: Node.js 22＋Playwright＋Chromium＋日本語フォント（IPAGothic）。
Claude Code のリモート実行環境ならすべてプリインストール済み。

```bash
cd tools && node gen.mjs   # tools/out.pdf が生成される
cp tools/out.pdf 腐食対策アイデア_統合版_評価付き.pdf   # 目的に応じてリネーム配置
```

- `gen.mjs` は Playwright を絶対パス `/opt/node22/lib/node_modules/playwright` で import している。
  他環境では `npm i playwright` して import を `'playwright'` に書き換えること。
- クリーン版（評価なし）を再生成したい場合は `evals.json` を一時的に外して実行する。

## 作業経緯・引き継ぎメモ

- 作業ブランチ: `claude/consolidate-corrosion-pdfs-h18hbh`
- **統合方針**: 内容の是非・優劣は評価せず、「記述対象が同一か」のみで118案→61案に統合。
  各カード末尾の「同一と判断し統合した案」に統合元を明記（例: ChatGPT案6・7・8／Fable a／Opus 02）。
- **評価方針**: 元の統合文・出典表記には一切手を加えず、統一色（赤 #c62828）の
  「Claude評価」ブロックを各カード末尾に追加。実現性・費用対効果・優先度についての参考意見。
- **続きの作業をする場合**: `tools/ideas.json`（案の追加・修正）や `tools/evals.json`（評価の修正）を
  編集 → `node tools/gen.mjs` で再生成 → 生成PDFをリネームしてルートに配置 → コミット＆プッシュ。
- 進捗の最新状態は `git log --oneline` を参照。
