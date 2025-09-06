// Skrip untuk memastikan elemen #article-share benar-benar hilang di halaman statis
document.addEventListener('DOMContentLoaded', function() {
  var staticPageCustom = document.querySelector('.static-page-custom');
  if (staticPageCustom) {
    var shareSection = document.getElementById('article-share');
    if (shareSection) {
      shareSection.remove(); // Langsung hapus elemennya dari halaman
    }
  }
});

// Skrip untuk memanggil tooltip
<b:if cond='!data:view.isPreview'>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
      })
    });
  </script>
</b:if>
