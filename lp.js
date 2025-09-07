document.addEventListener("DOMContentLoaded", function() {

  // 1. Pindahkan konten landing page keluar dari pembungkus tema
  const landingPage = document.getElementById('landingpage-edukrein');
  if (landingPage) {
    document.body.prepend(landingPage);
    landingPage.style.visibility = 'visible';
  }

  // 2. Tambahkan efek scroll pada navbar
  const navbar = document.querySelector('.navbar-landing');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 3. Inisialisasi Swiper Slider untuk produk
  const swiperProduk = new Swiper('.swiper-produk', {
    loop: true,
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 30
      }
    }
  });

  // 4. Inisialisasi Swiper Slider untuk Testimoni Utama
  const swiperTestimoniMain = new Swiper('.swiper-testimoni-main', {
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  // 5. Inisialisasi Swiper Slider untuk Testimoni Bawah (Marquee)
  const swiperTestimoniMarquee = new Swiper('.swiper-testimoni-marquee', {
    loop: true,
    spaceBetween: 20,
    centeredSlides: true,
    slidesPerView: 1.5,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    },
  });

  // 6. Menangani Pengiriman Form Kontak
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();

      // PENTING: Untuk membuat form ini benar-benar mengirim email,
      // Anda perlu menggunakan layanan pihak ketiga seperti Formspree, Netlify Forms,
      // atau membuat backend Anda sendiri.

      // Kode di bawah ini hanya simulasi.
      alert('Terima kasih! Pesan Anda akan segera kami proses.');
      contactForm.reset();
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const statistikSection = document.getElementById('statistik');

  // Animasi angka (efek lotere)
  function animateCounter(element) {
    const target = +element.getAttribute('data-target');
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let currentFrame = 0;

    const counter = () => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      const currentValue = Math.round(target * progress);

      element.innerText = currentValue.toLocaleString('id-ID');

      if (currentFrame < totalFrames) {
        requestAnimationFrame(counter);
      } else {
        element.innerText = target.toLocaleString('id-ID');
      }
    };
    requestAnimationFrame(counter);
  }

  // Animasi teks (efek mengetik)
  function animateTyping(element) {
    const text = element.innerText;
    element.innerText = '';
    element.classList.add('typing-effect');
    let i = 0;

    const typing = setInterval(() => {
      if (i < text.length) {
        element.innerText += text.charAt(i);
        i++;
      } else {
        clearInterval(typing);
        setTimeout(() => {
          element.classList.remove('typing-effect');
        }, 1000);
      }
    }, 75);
  }

  // Observer untuk memicu animasi saat muncul di layar
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statistikSection.classList.add('is-visible');

        const statNumbers = statistikSection.querySelectorAll('.stat-number');
        const statTexts = statistikSection.querySelectorAll('.stat-text');

        statNumbers.forEach(num => animateCounter(num));
        statTexts.forEach(text => animateTyping(text));

        obs.unobserve(statistikSection);
      }
    });
  }, { threshold: 0.4 });

  if (statistikSection) {
    observer.observe(statistikSection);
  }
});
