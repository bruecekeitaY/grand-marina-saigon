// =========================================
// Grand Marina Saigon - 共通JavaScript
// =========================================

// =========================================
// モーション層（2026-08 追加）
// - HTML は変更せず、既存クラスを手がかりに gm-* を自動付与する
// - このブロックを最初に実行して、描画前にクラスを付ける（チラつき防止）
// - prefers-reduced-motion: reduce のときは何も付与しない
// =========================================
(function motionLayer() {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  // ---------- ヘルパー ----------
  function all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function rafThrottle(fn) {
    var ticking = false;
    return function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { fn(); ticking = false; });
    };
  }

  // =========================================
  // 1. スクロールリビール（全ページ共通）
  // =========================================
  // 出現アニメを付ける要素。既存のクラス名だけを手がかりにしている
  var REVEAL = [
    '.section-header',
    '.features > *',
    '.related-grid > *',
    '.price-cards > *',
    '.price-card',
    '.timeline-item',
    '.location-grid > *',
    '.media-row > *',
    '.media-grid > *',
    '.media-figure',
    '.info-box',
    '.cta-banner',
    '.spec-table',
    '.faq-item',
    '.contact-wrap > *',
    '.trust-badges',
    '.zalo-namecard',
    '.footer-grid > *',
    // 記事本文：見出し・図版・表・引用のみ（本文 p は読みやすさ優先で対象外）
    '.article > h2',
    '.article > h3',
    '.article > figure',
    '.article > table',
    '.article > blockquote'
  ].join(',');

  // 左右から出す要素（横並びの対比を出す）
  var REVEAL_LEFT = '.location-grid > :first-child';
  var REVEAL_RIGHT = '.location-grid > :last-child';

  // 子要素を順番にずらして出す親（カードグリッド）
  var STAGGER_PARENTS = ['.features', '.related-grid', '.price-cards', '.media-grid', '.media-row', '.footer-grid', '.timeline'];

  function tagReveals() {
    if (reduce) return [];

    var els = all(REVEAL);
    // 重複を除きつつクラス付与
    var seen = [];
    els.forEach(function (el) {
      if (el.classList.contains('gm-reveal')) return;
      el.classList.add('gm-reveal');
      seen.push(el);
    });

    all(REVEAL_LEFT).forEach(function (el) {
      if (el.classList.contains('gm-reveal')) el.classList.add('gm-reveal-left');
    });
    all(REVEAL_RIGHT).forEach(function (el) {
      if (el.classList.contains('gm-reveal') && !el.classList.contains('gm-reveal-left')) {
        el.classList.add('gm-reveal-right');
      }
    });

    // カードグリッドだけ順番にずらす（最大 0.45 秒まで）
    STAGGER_PARENTS.forEach(function (psel) {
      all(psel).forEach(function (parent) {
        var i = 0;
        Array.prototype.forEach.call(parent.children, function (child) {
          if (!child.classList.contains('gm-reveal')) return;
          child.style.setProperty('--gm-d', (Math.min(i * 9, 45) / 100) + 's');
          i++;
        });
      });
    });

    return seen;
  }

  var revealEls = tagReveals();
  var ioWorking = false;

  // 画面内に入っている要素を手動で表示（IntersectionObserver が使えないときの保険）
  function revealVisible() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var left = [];
    revealEls.forEach(function (el) {
      if (el.classList.contains('gm-in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add('gm-in');
      else left.push(el);
    });
    revealEls = left;
  }

  if (revealEls.length) {
    if (hasIO) {
      var io = new IntersectionObserver(function (entries) {
        ioWorking = true;
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('gm-in');
          io.unobserve(en.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(function (el) { io.observe(el); });

      // 保険：3秒経っても一度も発火しない環境では手動表示に切り替える
      setTimeout(function () {
        if (!ioWorking) revealVisible();
      }, 3000);
    } else {
      // IntersectionObserver 非対応ブラウザは即表示（隠れっぱなしを防ぐ）
      revealEls.forEach(function (el) { el.classList.add('gm-in'); });
      revealEls = [];
    }
  }

  // =========================================
  // 2. ヒーローの起動（ケンバーンズ + 文字の順次表示）
  // =========================================
  var hero = document.querySelector('.hero');
  var pageHero = document.querySelector('.page-hero');

  if (pageHero && !reduce) pageHero.classList.add('gm-armed');

  if (hero) {
    var armed = false;
    var armHero = function () {
      if (armed) return;
      armed = true;
      if (!reduce) hero.classList.add('gm-armed');
    };

    // ヒーロー画像（CSS と同じ /images/hero.webp）が読めたら has-image を付ける
    var img = new Image();
    img.onload = function () { hero.classList.add('has-image'); armHero(); };
    img.onerror = armHero; // 画像なし: グラデーション背景のまま
    img.src = '/images/hero.webp';

    // 画像が遅くても 1.2 秒で文字は出す
    setTimeout(armHero, 1200);

    // スクロール誘導インジケータ
    if (!reduce && !hero.querySelector('.gm-cue')) {
      var cue = document.createElement('span');
      cue.className = 'gm-cue';
      cue.setAttribute('aria-hidden', 'true');
      hero.appendChild(cue);
    }
  }

  // =========================================
  // 3. ヘッダー / 読了バー / トップへ戻る（スクロール連動）
  // =========================================
  var header = document.querySelector('.site-header');

  // 読了プログレスバーは記事ページのみ（パンくず + 本文がある page）
  var isArticlePage = !!(document.querySelector('.breadcrumb') && document.querySelector('.article'));
  var progress = null;
  if (isArticlePage) {
    progress = document.createElement('div');
    progress.className = 'gm-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);
  }

  // トップへ戻るボタン
  var toTop = document.createElement('button');
  toTop.className = 'gm-totop';
  toTop.type = 'button';
  toTop.innerHTML = '&#8593;';
  toTop.setAttribute('aria-label', (document.documentElement.lang || 'vi').startsWith('ja') ? 'ページ上部へ戻る'
    : (document.documentElement.lang || 'vi').startsWith('en') ? 'Back to top' : 'Lên đầu trang');
  document.body.appendChild(toTop);
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  var onScroll = rafThrottle(function () {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (header) header.classList.toggle('gm-scrolled', y > 40);
    toTop.classList.toggle('gm-show', y > 700);

    // IntersectionObserver が効いていない環境ではスクロール時に手動表示
    if (!ioWorking && revealEls.length) revealVisible();

    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(Math.max(y / h, 0), 1) : 0;
      progress.style.transform = 'scaleX(' + p + ')';
    }
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // =========================================
  // 4. 画像ライトボックス（記事の図版・メディア画像）
  // =========================================
  var zoomables = all('.article figure img, .media-figure img');
  if (zoomables.length) {
    var box = null;
    var boxImg = null;

    var closeBox = function () {
      if (!box) return;
      box.classList.remove('gm-open');
      document.body.style.overflow = '';
    };

    var openBox = function (src, alt) {
      if (!box) {
        box = document.createElement('div');
        box.className = 'gm-lightbox';
        box.innerHTML = '<button type="button" class="gm-lightbox-close" aria-label="Close">&times;</button><img alt="">';
        document.body.appendChild(box);
        boxImg = box.querySelector('img');
        box.addEventListener('click', closeBox);
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') closeBox();
        });
      }
      boxImg.src = src;
      boxImg.alt = alt || '';
      box.classList.add('gm-open');
      document.body.style.overflow = 'hidden';
    };

    zoomables.forEach(function (im) {
      im.classList.add('gm-zoomable');
      im.addEventListener('click', function () {
        openBox(im.currentSrc || im.src, im.alt);
      });
    });
  }

  // =========================================
  // 5. 数値のカウントアップ（HTML 側で data-count="2026" を付けた要素だけ）
  // =========================================
  var counters = all('[data-count]');
  if (counters.length) {
    var lang = document.documentElement.lang || 'vi';
    var locale = lang.startsWith('en') ? 'en-US' : lang.startsWith('ja') ? 'ja-JP' : 'vi-VN';

    var runCount = function (el) {
      var raw = el.getAttribute('data-count');
      var target = parseFloat(raw);
      if (isNaN(target)) return;
      var decimals = (raw.split('.')[1] || '').length;
      var t0 = null;
      var step = function (t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 1600, 1);
        var v = target * (1 - Math.pow(1 - p, 3));
        el.textContent = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString(locale);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (hasIO && !reduce) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          runCount(en.target);
          cio.unobserve(en.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(function (el) {
        var v = parseFloat(el.getAttribute('data-count'));
        if (!isNaN(v)) el.textContent = v.toLocaleString(locale);
      });
    }
  }
})();

// モバイルメニューの開閉
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('gm-open', open);
  });

  // メニュー内リンククリックで閉じる
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('gm-open');
    });
  });
}

// モバイル追従CTAバー（全ページに自動挿入）
(function mobileCtaBar() {
  if (document.querySelector('.mobile-cta-bar')) return;
  const lang = (document.documentElement.lang || 'vi').slice(0, 2);
  // 外国人客はZaloを持っていないため、EN/JAではWhatsAppも並べる
  const isForeign = lang === 'en' || lang === 'ja';
  const CALL = { en: 'Call now', ja: '電話する', vi: 'Gọi ngay' }[lang] || 'Gọi ngay';
  const bar = document.createElement('div');
  bar.className = isForeign ? 'mobile-cta-bar mobile-cta-bar--wa' : 'mobile-cta-bar';
  bar.innerHTML =
    (isForeign
      ? '<a href="https://wa.me/84903475802" target="_blank" rel="noopener" class="mcta mcta-wa">WhatsApp</a>'
      : '') +
    '<a href="https://zalo.me/0903475802" target="_blank" rel="noopener" class="mcta mcta-zalo">💬 Zalo</a>' +
    '<a href="tel:0903475802" class="mcta mcta-call">📞 ' + CALL + '</a>';
  document.body.appendChild(bar);
})();

// フォーム送信処理：Zaloへ確実に誘導（in-appブラウザでも消えないフォールバックを表示）
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const isEn = (document.documentElement.lang || 'vi').startsWith('en');
    const fd = new FormData(contactForm);
    const get = (k) => (fd.get(k) || '').toString().trim();
    const name = get('name'), phone = get('phone'), message = get('message');
    const interest = get('interest'), purpose = get('purpose'), email = get('email');

    const lines = [
      isEn ? 'Hello, I am interested in Grand Marina Saigon.' : 'Xin chào, tôi quan tâm đến Grand Marina Saigon.',
      '',
      (isEn ? 'Name: ' : 'Tên: ') + name,
      (isEn ? 'Phone: ' : 'Điện thoại: ') + phone,
    ];
    if (email) lines.push('Email: ' + email);
    if (interest) lines.push((isEn ? 'Unit type: ' : 'Loại căn: ') + interest);
    if (purpose) lines.push((isEn ? 'Purpose: ' : 'Mục đích: ') + purpose);
    if (message) lines.push((isEn ? 'Message: ' : 'Tin nhắn: ') + message);
    const zaloUrl = 'https://zalo.me/0903475802?text=' + encodeURIComponent(lines.join('\n'));

    // 常に見えるフォールバック（Zaloが自動で開かない環境でもリンクを確実に残す）
    let fb = document.querySelector('#zalo-fallback');
    if (!fb) {
      fb = document.createElement('div');
      fb.id = 'zalo-fallback';
      fb.className = 'zalo-fallback';
      contactForm.insertAdjacentElement('afterend', fb);
    }
    fb.innerHTML =
      '<p class="zfb-title">' + (isEn ? 'Almost done — open Zalo to send your details' : 'Sắp xong — mở Zalo để gửi thông tin của bạn') + '</p>' +
      '<a href="' + zaloUrl + '" target="_blank" rel="noopener" class="btn btn-zalo">💬 ' + (isEn ? 'Open Zalo to send' : 'Mở Zalo để gửi') + '</a>' +
      '<p class="zfb-note">' + (isEn ? 'If Zalo does not open automatically, tap the button above or call ' : 'Nếu Zalo không tự mở, bấm nút trên hoặc gọi ') +
      '<a href="tel:0903475802">0903 475 802</a></p>';
    fb.style.display = 'block';

    // ベストエフォートで自動オープン（ブロックされてもフォールバックが残る）
    try { window.open(zaloUrl, '_blank'); } catch (_) {}
    fb.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
