/*
  File: statis.js
  Fungsi: Menambahkan class khusus ke body untuk mengaktifkan CSS pembersih.
*/

(function() {
  // Tunggu hingga seluruh struktur halaman dimuat
  document.addEventListener('DOMContentLoaded', function() {
    
    // Cari kontainer halaman statis khusus kita
    const staticPageContainer = document.getElementById('clean-static-page');

    // Jika kontainer tersebut ada di halaman ini, jalankan proses pembersihan
    if (staticPageContainer) {
      
      // Tambahkan class 'clean-page-active' ke tag <body>.
      // CSS akan menggunakan class ini untuk menyembunyikan elemen tema lainnya.
      document.body.classList.add('clean-page-active');
      
      // Untuk memastikan semua elemen lain tersembunyi dengan andal,
      // pindahkan kontainer kita menjadi anak langsung dari <body>.
      // Ini mengeluarkannya dari struktur postingan default Blogger.
      document.body.appendChild(staticPageContainer);
      
      console.log('Mode halaman statis bersih diaktifkan.');
    }
  });
})();
