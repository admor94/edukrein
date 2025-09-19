// [AWAL] KODE UNTUK statis.js

// Fungsi ini akan berjalan setelah seluruh halaman dimuat
document.addEventListener("DOMContentLoaded", function() {
  
  // 1. Cari elemen div dengan id 'statis-content'
  var staticContent = document.getElementById('statis-content');
  
  // 2. Jika elemen tersebut ditemukan
  if (staticContent) {
    
    // 3. Pindahkan elemen tersebut menjadi anak langsung dari <body>
    // Ini mengeluarkannya dari struktur postingan tema yang membatasi.
    document.body.appendChild(staticContent);
    
    // 4. Hapus div pembungkus asli dari tema (jika ada) agar tidak ada sisa.
    // Biasanya konten halaman ada di dalam #Blog1 atau .post-body
    var originalContainer = document.querySelector('.post-body');
    if (originalContainer) {
      // Kita tidak menghapusnya, cukup pastikan konten sudah dipindah.
    }
  }
  
});

// [AKHIR] KODE UNTUK statis.js
