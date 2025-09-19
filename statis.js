document.addEventListener("DOMContentLoaded", function() {
    var staticWrapper = document.getElementById('statis-wrapper-content');
    if (staticWrapper) {
      document.body.appendChild(staticWrapper);
      document.getElementById('statis-wrapper').remove(); // Hapus div pembungkus awal
    }
  });
