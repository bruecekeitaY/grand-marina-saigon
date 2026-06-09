# SEO運用設定（Grand Marina Saigon / grandmarina）

このサイトの集客記事は、汎用スキル `seo-research`（調査）＋ プロジェクト専用スキル
`grandmarina-article`（HTML執筆）で量産する。MDXではなく**静的HTMLページ**を出力する。

## 1. サイトの基本
- サイト名: Grand Marina Saigon（販売代理／独立エージェントの紹介サイト）
- ドメイン: https://grandmarina-saigon.com
- 物件: Masterise Homes × Marriott / JW Marriott Branded Residences（ホーチミン1区 Ba Son）
- 技術: 素のHTML/CSS/JS。**フレームワーク・ビルドツールは導入しない**
- 公式注記: Masterise/Marriott 公式ではない旨をフッターに必ず明示
- 言語: ベトナム語（主・ルート直下）＋ 英語（副・`/en/` 配下）。両方を対で作る
- ターゲット読者: ベトナム現地・海外の投資家／高所得層／外国人購入検討者

## 2. CV（コンバージョン）目標
- 主CV: **Zalo でのやりとり**（`https://zalo.me/0903475802`）。電話 `0903475802`
- CV意図スコアの基準: 価格・購入手続き・投資価値・ローン・外国人購入=10 / 立地・施設・ブランド紹介=4–6 / 一般市況・用語解説=2–4

## 3. CTAの実装（このサイト専用）
- 記事内CTA: `.cta-banner` ブロック（記事中2〜3箇所）。例:
  ```html
  <div class="cta-banner">
    <h3>{見出し}</h3>
    <p>{一言}</p>
    <a href="https://zalo.me/0903475802" class="btn btn-zalo" target="_blank" rel="noopener">💬 Chat Zalo ngay</a>
  </div>
  ```
- グローバル: `<a class="zalo-float">` 追従ボタン（全ページ共通・テンプレに含む）
- 直前に文脈接続文を1文。3箇所のリードは毎回変える

## 4. 記事ファイル（出力先）
- VI: `news/{slug}.html`
- EN: `en/news/{slug}.html`
- slug: 英語ケバブケース（VI/EN共通のslugで対にする）
- frontmatter: **なし**（SEOは各HTMLの `<head>` に直接記述）
- テンプレート: `docs/seo/templates/article.vi.html` / `article.en.html` を必ず使う

## 5. 公開URL・相対パス（重要）
- URL形式: `https://grandmarina-saigon.com/news/{slug}.html`（EN: `/en/news/{slug}.html`）
- **相対パスの深さに注意**（記事はサブフォルダにあるため）:
  - VI記事 `news/{slug}.html` から: CSS=`../css/style.css` / JS=`../js/main.js` / 画像=`../images/...` / 各ページ=`../about.html` 等 / EN対=`../en/news/{slug}.html`
  - EN記事 `en/news/{slug}.html` から: CSS=`../../css/style.css` / JS=`../../js/main.js` / 画像=`../../images/...` / ENページ=`../about.html` 等 / VI対=`../../news/{slug}.html`
  - 絶対パス（`/favicon.svg`, `/_vercel/insights/script.js`）はそのまま
- 各記事の `<head>` に canonical ＋ hreflang(vi/en/x-default) を入れ、VI⇄ENを必ずペアで指す

## 6. `<head>` 必須SEOタグ（テンプレ済み）
- `<title>`（全角換算で簡潔・メインKW左寄せ）
- `<meta name="description">`（120〜160字相当）
- `<meta name="keywords">`
- `<link rel="canonical">` ＋ hreflang(vi/en/x-default)
- Open Graph 一式（og:title/description/type=article/image）
- JSON-LD: `Article`（or NewsArticle）＋ `BreadcrumbList`（Trang chủ > Tin tức > 記事名）
- 既存の google-site-verification / favicon / fonts / `css/style.css` を踏襲
- 画像は `alt` 必須・`loading="lazy"`

## 7. カテゴリ / 一覧連携
- カテゴリ区分は当面なし（すべて `news/` 配下のコラム/ガイド）
- 記事公開時に `news.html`（VI）と `en/news.html`（EN）に**記事カードのリンクを追加**する
  （`.related-grid` / `.related-card` のスタイルを流用、または記事一覧ブロックを設置）

## 8. 内部リンク方針
- 各記事3〜5本。本文 or `.related-pages` で主要ページ（about/location/residences/pricing/news/contact）と関連記事へ
- アンカーにメインKW or 関連KW。**公開済みページのみ**にリンク
- パスは §5 の相対パス規則で生成（リンク切れ厳禁）

## 9. ターゲットキーワード（集客記事の軸）
- VI: "Grand Marina Saigon", "Grand Marina Quận 1", "căn hộ hàng hiệu Marriott", "JW Marriott Residences", "Masterise Homes Ba Son", "Branded Residences là gì", "người nước ngoài mua nhà Việt Nam", "đầu tư căn hộ Quận 1"
- EN: "Grand Marina Saigon", "Marriott Branded Residences Vietnam", "luxury apartment District 1 HCMC", "foreigner buy property Vietnam", "branded residences investment"
- 調査は `/seo-research` を `hl=vi&gl=vn`（ベトナム語）/ `hl=en&gl=vn`（英語）で実施

## 10. 表現ルール（禁止/必須）
- 必須: 「公式ではない（独立代理店）」のフッター注記／情報は変動ありの注記（価格・面積・進捗）／画像alt
- 禁止: 誇大・断定的な投資保証（「必ず値上がり」等）。投資は一般情報に留め、個別の投資助言をしない
- 数値・市況は出典（Knight Frank/Savills 等）と時点を添える
- 価格・在庫の確定値はZaloで要確認、と促す

## 11. 環境・運用メモ
- プレビュー: `python -m http.server 8000` → `http://localhost:8000/news/{slug}.html`
- デプロイ: Vercel（`/_vercel/insights/script.js` 検出）。`real-estate-lp` を反映
- ハードコード定数: Zalo `0903475802` / URL `https://zalo.me/0903475802` / ドメイン `https://grandmarina-saigon.com`
- オーナーはコーディング初心者・日本語対応。変更点は簡潔に日本語で伝える
