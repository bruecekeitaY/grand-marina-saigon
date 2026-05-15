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
  img.src = (isEn ? '../images/hero.jpg' : 'images/hero.jpg');
})();

// フォーム送信処理
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const message = formData.get('message') || '';

    // Zaloへメッセージ付きで遷移するパターン
    // (将来サーバー送信に置き換え可能)
    const text = encodeURIComponent(
      `Xin chào, tôi quan tâm đến Grand Marina Saigon.\n\nTên: ${name}\nĐiện thoại: ${phone}\n${message ? 'Tin nhắn: ' + message : ''}`
    );
    const zaloUrl = `https://zalo.me/0903475802?text=${text}`;

    // 確認メッセージ
    const lang = document.documentElement.lang || 'vi';
    const confirmMsg = lang.startsWith('en')
      ? 'Thank you! We will contact you shortly via Zalo / phone.'
      : 'Cảm ơn bạn! Chúng tôi sẽ liên hệ qua Zalo / điện thoại trong thời gian sớm nhất.';

    alert(confirmMsg);
    // Zaloへリダイレクト(任意)
    window.open(zaloUrl, '_blank');

    contactForm.reset();
  });
}
