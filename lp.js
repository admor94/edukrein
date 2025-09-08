document.addEventListener("DOMContentLoaded", function() {

  /*=============================================
  =            INISIALISASI & SETUP AWAL          =
  =============================================*/

  // Memindahkan konten landing page ke awal <body> agar tidak terpengaruh oleh elemen tema lain.
  const landingPage = document.getElementById('landingpage-edukrein');
  if (landingPage) {
    document.body.prepend(landingPage);
    landingPage.style.visibility = 'visible';
  }

  // Memberi efek scroll pada navbar.
  const navbar = document.querySelector('.navbar-landing');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  /*=============================================
  =            INISIALISASI SWIPER SLIDERS      =
  =============================================*/

  // 1. Swiper untuk Logo Slider (Efek Marquee)
  new Swiper('.swiper-logo-slider', {
    loop: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    speed: 4000,
    slidesPerView: 'auto',
    spaceBetween: 60,
    grabCursor: false,
    allowTouchMove: false,
  });

  // 2. Swiper untuk Produk
  new Swiper('.swiper-produk', {
    loop: true,
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
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

  // 3. Swiper untuk Testimoni Utama
  new Swiper('.swiper-testimoni-main', {
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });

  // 4. Swiper untuk Testimoni Marquee
  new Swiper('.swiper-testimoni-marquee', {
    loop: true,
    spaceBetween: 20,
    centeredSlides: true,
    slidesPerView: 1.5,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
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
    }
  });

  /*=============================================
  =            FORM KONTAK WHATSAPP             =
  =============================================*/

  const waForm = document.getElementById('waForm');
  if (waForm) {
    waForm.addEventListener('submit', e => {
      e.preventDefault();

      const name = document.getElementById('waName').value.trim();
      const message = document.getElementById('waMessage').value.trim();
      const phoneNumber = "6281234567890"; // Ganti dengan nomor WhatsApp tujuan Anda

      const waUrl = `https://wa.me/${phoneNumber}?text=Halo, saya ${encodeURIComponent(name)}.%0A${encodeURIComponent(message)}`;

      window.open(waUrl, '_blank');
      waForm.reset();
    });
  }

  /*=============================================
  =            ANIMASI SECTION STATISTIK        =
  =============================================*/

  const statistikSection = document.getElementById('statistik');

  if (statistikSection) {
    // Fungsi untuk animasi counter angka
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
        element.textContent = currentValue.toLocaleString('id-ID');

        if (currentFrame < totalFrames) {
          requestAnimationFrame(counter);
        } else {
          element.textContent = target.toLocaleString('id-ID');
        }
      };
      requestAnimationFrame(counter);
    }

    // Fungsi untuk animasi efek mengetik
    function animateTyping(element) {
      const text = element.textContent.trim();
      element.textContent = '';
      element.classList.add('typing-effect');
      let i = 0;

      const typing = setInterval(() => {
        if (i < text.length) {
          element.innerHTML += (text[i] === ' ') ? '&nbsp;' : text[i];
          i++;
        } else {
          clearInterval(typing);
          setTimeout(() => {
            element.classList.remove('typing-effect');
          }, 1000);
        }
      }, 75);
    }

    // Observer untuk memicu animasi saat section terlihat
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statistikSection.classList.add('is-visible');
          statistikSection.querySelectorAll('.stat-number').forEach(num => animateCounter(num));
          statistikSection.querySelectorAll('.stat-text').forEach(text => animateTyping(text));
          obs.unobserve(statistikSection); // Hentikan observasi setelah animasi berjalan
        }
      });
    }, {
      threshold: 0.4
    });

    observer.observe(statistikSection);

    // Fallback untuk browser lama yang tidak mendukung IntersectionObserver
    window.addEventListener('load', () => {
      statistikSection.querySelectorAll('.stat-number').forEach(num => {
        if (num.textContent.trim() === '0') {
          num.textContent = num.getAttribute('data-target');
        }
      });
    });
  }

/*=============================================
=      PENUTUP NAVBAR SAAT KLIK DI LUAR       =
=============================================*/

const landingNav = document.getElementById('landingNav');
const navToggler = document.querySelector('.navbar-toggler');

document.addEventListener('click', function (event) {
  // Cek apakah menu sedang terbuka
  const isNavOpen = landingNav.classList.contains('show');
  
  // Target elemen yang di-klik
  const targetElement = event.target;

  // Cek apakah klik terjadi di luar area navbar dan bukan pada tombol toggler
  const isClickOutside = !landingNav.contains(targetElement) && !navToggler.contains(targetElement);

  if (isNavOpen && isClickOutside) {
    // Jika semua kondisi terpenuhi, tutup navbar
    navToggler.click();
  }
});

/* =================================================================== */
/* REVISI: Perbaikan Tombol & Link FAQ di Navbar (Versi Lebih Kuat) */
/* =================================================================== */
window.addEventListener('load', function() {
  let attempts = 0;
  const maxAttempts = 50; // Mencoba selama 5 detik (50 x 100ms)

  // Terus jalankan fungsi ini setiap 100ms
  const fixTheFaqLink = setInterval(function() {
    attempts++;

    // Cari link FAQ yang SUDAH diubah menjadi tombol oleh skrip tema
    const faqLink = document.querySelector('#landingpage-edukrein .navbar-nav a.btn[href="#faq-kontak"]');

    // Jika linknya sudah ditemukan...
    if (faqLink) {
      // 1. Hapus atribut 'target' agar tidak membuka tab baru
      faqLink.removeAttribute('target');

      // 2. Hapus kelas 'btn' yang membuatnya jadi tombol
      faqLink.classList.remove('btn');
      faqLink.removeAttribute('role');

      // 3. Hapus ikon SVG di dalamnya
      const svgIcon = faqLink.querySelector('svg');
      if (svgIcon) {
        svgIcon.remove();
      }
      
      // 4. HENTIKAN PENCARIAN KARENA SUDAH BERHASIL
      clearInterval(fixTheFaqLink);
    }

    // Berhenti mencoba setelah 5 detik untuk mencegah loop tak terbatas
    if (attempts >= maxAttempts) {
      clearInterval(fixTheFaqLink);
    }
  }, 100); // Interval pengecekan
});
  
});
