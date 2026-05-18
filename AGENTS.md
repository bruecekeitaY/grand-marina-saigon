# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## プロジェクト概要

**Grand Marina Saigon**(Masterise Homes × Marriott Branded Residences、ホーチミン1区 Ba Son)を販売する**独立エージェントのSEO重視マルチページサイト**。

- **目的**: "Grand Marina" 関連キーワードで Google 検索流入を獲得 → Zalo(0903475802)で直接やりとりに繋げる
- **公式サイトではない**: Masterise Homes 公式ではなく独立販売エージェントによる紹介サイトであることをフッター等で明示すること
- **言語**: ベトナム語(主、ルート直下)+ 英語(副、`/en/` 配下)

## ビルド / プレビュー

ビルドシステムなし。プレーン HTML / CSS / JS のみ。**フレームワーク(React 等)やビルドツールは導入しない方針**。

- **プレビュー**: `index.html` をブラウザで直接開いてOK。ただし `/en/` への絶対パスリンクはローカルファイル直開きでは動かないので、ローカルサーバーを使う:
  ```powershell
  python -m http.server 8000
  ```
  → `http://localhost:8000/`
- **テスト**: 自動テストなし。各ページを目視 + DevTools のモバイルビューで確認
- **デプロイ**: Netlify 予定。`real-estate-lp` フォルダごとドラッグ&ドロップ

## アーキテクチャ(重要)

### 言語切替: JS トグルではなく別URL
- VI: ルート直下(`/index.html`, `/about.html`, ...)
- EN: `/en/` 配下(`/en/index.html`, `/en/about.html`, ...)
- 各ページの `<head>` に `<link rel="alternate" hreflang="...">` を入れて Google にペア関係を伝える
- **既知の問題**: hreflang の URL が `https://example.com/` プレースホルダーのまま。独自ドメイン取得時に全ページ一括置換が必要

### リードキャプチャ: Zalo へクライアントサイドリダイレクト(`js/main.js`)
- `#contact-form` の submit を JS で横取りし、フォーム値を Zalo メッセージに組み立てて `https://zalo.me/0903475802?text=...` を `window.open` する
- **サーバー送信していない** — リードは Zalo のチャット履歴として残るだけ
- 確認 alert は `<html lang="...">` を見て VI / EN で切り替え
- リード一覧で管理したい場合は、この submit ハンドラを Formspree / Netlify Forms に差し替える(構造はそのままで OK)

### デザイントークン(`css/style.css` の `:root`)
- 配色変更はここだけ触る。個別ページのスタイルは編集しない
- `--color-primary: #0a2540`(ネイビー)/ `--color-accent: #c9a96e`(Marriott 風ゴールド)/ `--color-zalo: #0068ff`(CTAボタン)
- `--font-serif: Playfair Display`(見出し)/ `--font-sans: Inter`(本文)
- モバイルファースト設計

### モバイルナビとヒーロー画像(`js/main.js`)
- `.nav-toggle` で `.nav-menu` に `is-open` クラスをトグル。リンククリックで自動クローズ
- `images/hero.jpg` が存在するかを JS で動的に検出し、あれば `.hero` に `has-image` クラスを付与して背景画像化、無ければ CSS のグラデーション背景フォールバック

## ページ構成と現状

| ファイル | 役割 | EN 版 |
|---|---|---|
| `index.html` | トップ(ヒーロー + CTA) | ✅ `en/index.html` |
| `about.html` | プロジェクト概要 | ✅ `en/about.html` |
| `location.html` | 立地・周辺 | ❌ 未作成 |
| `residences.html` | 部屋タイプ・間取り | ❌ 未作成 |
| `amenities.html` | 施設・Marriott サービス | ❌ 未作成 |
| `pricing.html` | 価格・支払いプラン | ❌ 未作成 |
| `news.html` | お知らせ・市況 | ❌ 未作成 |
| `faq.html` | FAQ | ❌ 未作成 |
| `contact.html` | 問い合わせ | ❌ 未作成 |

新規ページ追加時:
1. VI 版をルート直下に作る
2. `<head>` に hreflang リンク と Schema.org `Residence` JSON-LD を入れる
3. ヘッダー/フッターは既存ページからコピペして言語切替リンクを正しく設定
4. EN 版を `/en/` 配下に対訳で作成

## SEO 必須事項

- 各ページ `<head>` に必須: `<title>`, `<meta name="description">`, `<meta name="keywords">`, Open Graph 一式, Schema.org `Residence` JSON-LD
- ターゲットキーワード(本文に自然に含めること):
  - VI: "Grand Marina Saigon", "Grand Marina Quận 1", "căn hộ Marriott", "JW Marriott Residences", "Masterise Homes Ba Son"
  - EN: "Grand Marina Saigon", "Marriott Branded Residences Vietnam", "luxury apartment District 1 HCMC"
- 画像 `alt` 属性必須

## ハードコード定数(変更時は全ファイル一括置換)

- 電話 / Zalo: `0903475802`
- Zalo URL: `https://zalo.me/0903475802`
- hreflang ベース URL: `https://example.com`(本番ドメイン取得後に置換)

## 未対応項目(やり残し)

- [ ] `images/` フォルダが空 — hero, 間取り, 施設写真, og-image(1200×630)が必要
- [ ] hreflang URL がプレースホルダー(`example.com`)
- [ ] EN 版が `index` と `about` の 2 ページのみ
- [ ] `sitemap.xml`, `robots.txt` 未作成
- [ ] `news.html` の記事コンテンツが未投入
- [ ] フォームが Zalo リダイレクトのみ(リード一覧で管理したい場合は要置換)
- [ ] 担当者氏名・会社名が `docs/project-info.txt` でも未記入

## ユーザー(オーナー)について

- コーディング初心者、ベトナム現地で不動産営業
- 日本語でやりとり、専門用語は避けてステップバイステップで説明
- ファイル編集後は「何を変えたか」を簡潔に伝える
- Windows 11 + PowerShell(コマンド例は PowerShell 構文で)
