/*
  ===================================================================
 START HERE!
  ===================================================================
*/
document.addEventListener('DOMContentLoaded', function() {
    // Pastikan kode hanya berjalan di dalam wrapper landing page
    const landingPageWrapper = document.querySelector('.lp-digital-product');
    
    if (landingPageWrapper) {
        const faqItems = landingPageWrapper.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Tutup semua item FAQ lainnya terlebih dahulu
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Jika item yang diklik tidak aktif, maka buka
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
});
