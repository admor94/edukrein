document.addEventListener("DOMContentLoaded", function() {
  // === 1. Pindahkan konten landing page ===
  const landingPage = document.getElementById('landingpage-edukrein');
  if (landingPage) {
    document.body.prepend(landingPage);
    landingPage.style.visibility = 'visible';
  }

  // === 2. Navbar Scroll ===
  const navbar = document.querySelector('.navbar-landing');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // === 3. Swiper Produk ===
  new Swiper('.swiper-produk', {
    loop: true,
    spaceBetween: 20,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 20 },
      640: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 4, spaceBetween: 30 }
    }
  });

  // === 4. Swiper Testimoni Main ===
  new Swiper('.swiper-testimoni-main', {
    loop: true,
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
  });

  // === 5. Swiper Testimoni Marquee ===
  new Swiper('.swiper-testimoni-marquee', {
    loop: true,
    spaceBetween: 20,
    centeredSlides: true,
    slidesPerView: 1.5,
    autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 30 }
    }
  });

  // === 6. Form Kontak ===
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Terima kasih! Pesan Anda akan segera kami proses.');
      contactForm.reset();
    });
  }

  // === 7. Statistik Animasi ===
  const statistikSection = document.getElementById('statistik');

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

function animateTyping(element) {
  const text = element.textContent.trim(); // ambil teks asli dengan spasi
  element.textContent = ''; // kosongkan dulu
  element.classList.add('typing-effect');
  let i = 0;

  const typing = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typing);
      setTimeout(() => {
        element.classList.remove('typing-effect');
      }, 1000);
    }
  }, 75);
}

  if (statistikSection) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statistikSection.classList.add('is-visible');
          statistikSection.querySelectorAll('.stat-number').forEach(num => animateCounter(num));
          statistikSection.querySelectorAll('.stat-text').forEach(text => animateTyping(text));
          obs.unobserve(statistikSection);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(statistikSection);
  }
});
