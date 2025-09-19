/*
  File: statis.js
  Versi: 2.1 (Otomatisasi Metadata)
  Fungsi: Mendeteksi halaman statis, menambahkan class ke body,
          dan memformat metadata tanggal secara otomatis.
*/

(function() {
  'use strict';

  /**
   * Mengubah tanggal format ISO (misal: 2025-09-19T08:08:00Z) menjadi format yang mudah dibaca.
   * @param {string} isoString - String tanggal dalam format ISO 8601.
   * @returns {string} Tanggal yang sudah diformat (misal: 19 September 2025).
   */
  function formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    // Menggunakan lokal 'id-ID' untuk format tanggal bahasa Indonesia.
    return date.toLocaleDateString('id-ID', options);
  }

  // Jalankan setelah semua elemen HTML dimuat
  document.addEventListener('DOMContentLoaded', function() {
    
    const staticPageContainer = document.getElementById('static-page-wrapper');

    // Hanya jalankan jika ini adalah halaman statis khusus kita
    if (staticPageContainer) {
      // 1. Aktifkan mode halaman bersih dengan menambahkan class ke body
      document.body.classList.add('static-page-active');
      document.body.appendChild(staticPageContainer);
      
      // 2. Proses dan format metadata tanggal secara otomatis
      const publishedEl = staticPageContainer.querySelector('.published-date');
      const updatedEl = staticPageContainer.querySelector('.updated-date');

      const publishedISO = publishedEl ? publishedEl.dataset.isoDate : null;
      const updatedISO = updatedEl ? updatedEl.dataset.isoDate : null;

      if (publishedEl && publishedISO) {
        publishedEl.textContent = ` | Diterbitkan: ${formatDate(publishedISO)}`;
      }

      if (updatedEl && updatedISO && publishedISO) {
        // Hanya tampilkan tanggal pembaruan jika berbeda hari dengan tanggal terbit
        if (updatedISO.substring(0, 10) !== publishedISO.substring(0, 10)) {
           updatedEl.textContent = ` | Diperbarui: ${formatDate(updatedISO)}`;
        } else {
           updatedEl.style.display = 'none'; // Sembunyikan jika sama
        }
      } else if (updatedEl) {
        updatedEl.style.display = 'none';
      }
      
      console.log('Mode halaman statis bersih (v2.1) diaktifkan.');
    }
  });

})();

