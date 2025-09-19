/*
  File: statis.js
  Versi: 3.0 (Selective Hide)
  Fungsi: Mendeteksi "tag pemicu" di dalam konten halaman statis
          dan menambahkan class ke body untuk mengaktifkan CSS pembersih.
*/

(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    // Cari elemen utama yang membungkus konten postingan/halaman
    const postBody = document.querySelector('.post-body');
    
    // Periksa apakah di dalam konten terdapat komentar pemicu kita
    if (postBody && postBody.innerHTML.includes('<!-- static-clean-page -->')) {
      document.body.classList.add('static-clean-mode');
      console.log('Mode halaman statis bersih (v3.0) diaktifkan.');
    }
  });
})();

