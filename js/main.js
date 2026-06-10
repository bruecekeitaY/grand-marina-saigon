// =========================================
// Grand Marina Saigon - 共通JavaScript
// =========================================

// モバイルメニューの開閉
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('is-open');
  });

  // メニュー内リンククリックで閉じる
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
    });
  });
}

// ヒーロー画像があれば自動で背景に反映
(function checkHeroImage() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const img = new Image();
  img.onload = () => hero.classList.add('has-image');
  img.onerror = () => { /* 画像なし: グラデーション背景のまま */ };
  // CSSと同じパスを試す
  const isEn = window.location.pathname.indexOf('/en/') !== -1;
  img.src = (isEn ? '../images/hero.webp' : 'images/hero.webp');
})();

// モバイル追従CTAバー（全ページに自動挿入）
(function mobileCtaBar() {
  if (document.querySelector('.mobile-cta-bar')) return;
  const isEn = (document.documentElement.lang || 'vi').startsWith('en');
  const bar = document.createElement('div');
  bar.className = 'mobile-cta-bar';
  bar.innerHTML =
    '<a href="https://zalo.me/0903475802" target="_blank" rel="noopener" class="mcta mcta-zalo">💬 ' +
    (isEn ? 'Chat Zalo' : 'Chat Zalo') + '</a>' +
    '<a href="tel:0903475802" class="mcta mcta-call">📞 ' +
    (isEn ? 'Call now' : 'Gọi ngay') + '</a>';
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
