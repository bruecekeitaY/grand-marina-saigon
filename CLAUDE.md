# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**Grand Marina Saigon**（Masterise Homes × Marriott Branded Residences、ホーチミン1区 Ba Son）を販売する**独立エージェントのSEO重視マルチページサイト**。

- **目的**: "Grand Marina" 関連キーワードで検索流入 → Zalo（0903475802）で直接やりとりに繋げる
- **公式サイトではない**: 独立販売エージェントによる紹介サイトであることをフッター等で明示すること
- **位置づけ**: Happy Land（happylandrealty.com）がハブ、本サイトはスポーク（相互リンク）
- **言語**: ベトナム語（主、ルート直下）+ 英語（副、`/en/` 配下）

## ビルド / プレビュー / デプロイ

ビルドシステムなし。プレーン HTML / CSS / JS のみ。**フレームワークやビルドツールは導入しない方針**。

- プレビュー: `python -m http.server 8000` → `http://localhost:8000/`（`/en/` への絶対パスはローカルサーバー必須）
- テスト: 自動テストなし。目視 + DevTools モバイルビュー
- デプロイ: **GitHub `main` へ push → Vercel 自動デプロイ**（オーナー承認済み: main 直 push 可）

## アーキテクチャ（重要）

### 言語切替: JS トグルではなく別URL
- VI: ルート直下 / EN: `/en/` 配下。各ページ `<head>` の hreflang で VI⇄EN をペア指定
- canonical / hreflang のベースURL: `https://grand-marina-saigon.com`

### リードキャプチャ: Zalo へクライアントサイドリダイレクト（`js/main.js`）
- `#contact-form` の submit を横取り→ フォーム値を組み立てて `https://zalo.me/0903475802?text=...` を `window.open`
- **サーバー送信なし**（リードは Zalo チャット履歴のみ）。確認 alert は `<html lang>` で VI/EN 切替

### デザイントークン（`css/style.css` の `:root`）
- 配色変更はここだけ。`--color-primary: #0a2540` / `--color-accent: #c9a96e` / `--color-zalo: #0068ff`
- `--font-serif: Playfair Display` / `--font-sans: Inter`。モバイルファースト

### モバイルナビ / ヒーロー画像（`js/main.js`）
- `.nav-toggle` → `.nav-menu` の `is-open` トグル。`/images/hero.webp` があれば `.hero` に `has-image` 付与、無ければCSSグラデ

### モーション層（`js/main.js` 冒頭の IIFE + `css/style.css` 末尾の `gm-*`）
- **HTMLは触らない**。既存クラス（`.section-header` / `.features > *` / `.related-grid > *` / `.article > h2` 等）を手がかりに JS が `gm-reveal` を自動付与 → IntersectionObserver で `gm-in`
- 内容: ヒーローのケンバーンズ＋文字の順次表示、下層ページの `page-hero` 入場、スクロールリビール（カードは順送り）、ヘッダーの引き締め、記事の読了バー、トップへ戻る、画像ライトボックス、Zaloボタンの脈動
- JS が動かない環境ではクラスが付かない＝**従来通り全部見える**。`prefers-reduced-motion: reduce` は CSS 末尾で一括OFF
- `data-count="2026"` を付けた要素は数値カウントアップ（現状の HTML では未使用・任意）
- 動きを足す/減らすときは **この2ファイルだけ**を編集すること（333ページに一括で効く）

## ページ構成（2026-07 時点: 完成済み）

- 主要9ページ（index/about/location/residences/amenities/pricing/news/faq/contact）**VI・EN とも完成**
- news 記事 **101本 ×(VI+EN)**、`sitemap.xml` / `robots.txt` / og-image あり、`images/` 96枚
- **記事の追加は `/grandmarina-article` スキル**（news/{slug}.html + en/news/{slug}.html + 一覧リンクまで自動）。調査・構成は `/seo-research`

## SEO 必須事項

- 各ページ `<head>`: `<title>` / `<meta description>` / OG一式 / Schema.org `Residence` JSON-LD / hreflang。画像 `alt` 必須
- ターゲットKW — VI: "Grand Marina Saigon", "Grand Marina Quận 1", "căn hộ Marriott", "JW Marriott Residences", "Masterise Homes Ba Son" / EN: "Grand Marina Saigon", "Marriott Branded Residences Vietnam", "luxury apartment District 1 HCMC"

## ハードコード定数（変更時は全ファイル一括置換）

- 電話 / Zalo: `0903475802`（Zalo URL: `https://zalo.me/0903475802`）
- ベースURL: `https://grand-marina-saigon.com`
- 運営会社表記: Happy Land

## 残タスク

`TODO.md` を参照（このファイルにTODOを書かない）。

## ユーザー（オーナー）について

- コーディング初心者・日本語・PowerShell。平易にステップバイステップで説明し、編集後は変更点を簡潔に報告（共通指示は `~/.claude/CLAUDE.md`）
