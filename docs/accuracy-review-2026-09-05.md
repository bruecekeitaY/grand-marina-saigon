# Handover and sales availability: accuracy review, 2026-09-05

Earlier site copy repeated an unverified claim that Lake was handed over in March 2023 and Lagoon, Cove and Sea in December 2023. It then inferred that every tower was complete, immediate possession was available, and most current supply was resale. These statements appeared in pricing, FAQ, news, tower articles, structured data and related-article summaries in Vietnamese, English and Japanese.

Do not restore those dates or infer the current primary/resale supply mix from building progress. The legacy project notes and generated articles are not verification of these claims.

## Verified source and its limits

[Masterise Homes' review published on 7 February 2026](https://masterisehomes.com/truyen-thong/tin-tuc-thuong-hieu/masterise-homes-mot-nam-khang-dinh-vi-the-tu-noi-luc-dai-han) says Sea officially opened in Q1 2025. The article was checked on 2026-09-05. An opening is not the same event as handover of an individual apartment and does not prove the handover status of the other towers.

The site's handover guide and news timeline now describe that sourced milestone explicitly as an opening. Lake, Lagoon, Cove and Sea handover dates and possession timing require the relevant dated developer notice, tower documents and unit handover record. No replacement handover date has been invented.

## When updating listings

- Identify the exact unit, tower, seller and date of the availability list.
- Compare developer offers and owner resale listings; do not describe either channel as sold out or dominant without current evidence.
- Confirm handover, occupation, any tenancy, possession timing and applicable sale/payment policy for that unit.
- Keep reference prices and historical payment examples distinct from current executable offers. This correction did not establish new price, stock, foreign-quota or financing figures.
- Update visible answers and FAQ JSON-LD together in VI, EN and JA.

## Validation

All changed HTML was checked for unchanged canonical URLs, hreflang maps, H1 counts and robots directives. JSON-LD parses successfully; every changed FAQ answer is present in visible content. Newly introduced local links and image sources resolve locally. The previously repeated March/December 2023 handover dates are absent from the changed public HTML.

This is a static HTML site with no build step. Browser review confirmed the Japanese pricing layout and found a relative hero-image path that failed under the language directories. All three handover guides now use the root image path, verified with HTTP 200. Mobile visual review is not claimed.

## Update, 2026-09-18: developer sales of Lake and Sea

New evidence allows one channel statement that the 2026-09-05 review could not make:

- **Lake and Sea are currently sold directly by Masterise Homes (primary sale).** Confirmed by the site owner, an active sales agent, on 2026-09-18. Masterise Homes' official project site ([The Residences](https://masterisehomes.com/grand-marina-saigon/the-residences), checked 2026-09-18) presents exactly two residences: JW Marriott Residences Grand Marina Saigon, Sea and Marriott Residences Grand Marina Saigon, Lake. Buyers therefore do not have to buy resale; owner resale also exists. Unit stock, prices and payment policy are still confirmed per unit at the time of enquiry.
- **Openings (not unit handover dates):** Lake held its grand opening in November 2023 ([VIR](https://vir.com.vn/marriott-residences-grand-marina-saigon-holds-grand-opening-ceremony-106945.html)). Sea officially opened in Q1 2025 — reported on 2025-02-26 by [VnExpress](https://e.vnexpress.net/news/business/masterise-homes-opens-first-ever-jw-marriott-urban-branded-residences-in-asia-pacific-4853839.html). Masterise launched the limited "Urban Signature" collection at Sea in May 2026 ([Thanh Niên](https://thanhnien.vn/grand-marina-saigon-chuong-moi-tu-mot-ky-cong-da-thanh-hinh-185260520163831423.htm)).
- **Lagoon and Cove:** no opening announced; the official project site does not present them as residences for sale, and its location map labels a tower on that side "Service Apartment". Their use and schedule are unconfirmed — do not state them.

The rules above still apply: no March/December 2023 handover dates, and no claim that either channel is sold out or dominant.

## Update, 2026-10-31: prices, areas, VAT and payment plans

A hub-wide check (Happy Land, 2026-10-31) found that the pricing table, the "Sky Villa / Duplex ~180–250 m²" and "Penthouse 300 m²+" rows, "10% VAT included in the listed price" and the 25/75 · 30/70 · fast-payment (95–100%, 8–12% discount) plans had been on the site since the first commit (2026-05-15) with no developer document behind them. None of the brochures, floor plans or owner manual in `materials/` contains prices, payment plans or a Sky Villa type, and the Sea penthouse plans top out at 259.09 m² NSA / 278.56 m² GSA.

Changed in VI, EN and JA (pricing, residences, FAQ, contact form option):

- Price table → broker reference prices from the hub's sales ledger (`docs/sales/status.json`, checked 2026-08-24; source masterisehomesbysalereal.vn): 1BR ~18 bn, 2BR ~25–30 bn, 3BR dual-key ~45–59 bn VND, ~353–500 million VND/m². Labelled as broker reference; the developer does not publish a price list. Penthouse price: not published.
- Areas → net areas (NSA) from the developer floor plans for Lake and Sea, as recorded in the hub's verified `unitTypes` (checked 2021-12-16): 1BR 51.84–61.08, 2BR 69.74–83.97, 3BR/dual-key 107.10–178.66, Sea penthouse (level 45, PH1–PH5) 151.42–259.09 m². The Sky Villa / Duplex row and the unsourced penthouse feature list (plunge pool, private lift, cinema, 270° view) were removed.
- VAT → "confirm on the quotation or contract whether the price includes VAT".
- Payment plans and bank-partner terms → removed; buyers are told to request the dated sales-policy document for the exact unit.
- The developer-website source link for the Sea opening (news timeline and handover guide) was replaced by the VnExpress report (2025-02-26), following the 2026-09-06 owner decision not to link developer sites from sales pages.
- The project address on the about and location pages now shows the new and former names: Phường Sài Gòn (Phường Bến Nghé, Quận 1 cũ).

Not changed (left for the owner): about 76 news articles still repeat the old price, payment-plan or Sky Villa figures (see the PR for the list), and the "developer funds the management fee for the first 3 years" statement still appears on pricing, FAQ and about pages.
