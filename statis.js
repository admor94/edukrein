/*
  File: statis.js (External)
  Versi: 5.0 (Modular & Robust)
  Fungsi: Menambahkan class 'static-clean-mode' ke body jika pemicu ditemukan.
          Ini berfungsi sebagai fallback untuk browser yang tidak mendukung :has().
*/
(function() {
  // Fungsi ini akan berjalan setelah seluruh halaman dimuat
  function initStaticPageMode() {
    // Cari elemen pemicu di dalam halaman
    const trigger = document.getElementById('static-page-trigger');
    
    // Jika pemicu ditemukan, tambahkan class ke body
    if (trigger) {
      document.body.classList.add('static-clean-mode');
      console.log('Static page clean mode activated via JavaScript.');
    }
  }

  // Jalankan fungsi setelah DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStaticPageMode);
  } else {
    // DOM sudah siap
    initStaticPageMode();
  }
})();

