/*
  ===================================================================
  KODE JAVASCRIPT UNTUK HALAMAN STATIS BLOGGER
  Tempel kode ini di dalam tag <script>...</script> setelah CSS.
  ===================================================================
*/
document.addEventListener('DOMContentLoaded', function() {
    
    // Fungsionalitas untuk Navbar saat scroll
    const navbar = document.querySelector('#landingpage-edukrein .navbar-landing');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Fungsionalitas untuk Accordion FAQ
    const landingPageWrapper = document.querySelector('#landingpage-edukrein .lp-digital-product');
    if (landingPageWrapper) {
        const faqItems = landingPageWrapper.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Tutup semua item FAQ lainnya
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Buka item yang diklik jika sebelumnya tidak aktif
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
    
    // BARU: Menampilkan halaman setelah semua siap untuk menghindari FOUC (Flash of Unstyled Content)
    const landingPageContainer = document.getElementById('landingpage-edukrein');
    if (landingPageContainer) {
        // Hapus link eksternal CSS dan JS yang mungkin ada dari HTML
        const externalLink = document.querySelector('link[href="https://admor94.github.io/edukrein/dplp.css"]');
        const externalScript = document.querySelector('script[src="https://admor94.github.io/edukrein/dplp.js"]');
        if(externalLink) externalLink.remove();
        if(externalScript) externalScript.remove();
        
        landingPageContainer.style.visibility = 'visible';
    }
});

