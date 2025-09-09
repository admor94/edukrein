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
  speed: 8000, // DIPERBARUI: Nilai dinaikkan (misal: 8000ms) agar gerakan lebih lambat
  slidesPerView: 'auto', // Ini sudah benar untuk menampilkan banyak logo
  spaceBetween: 60,
  grabCursor: false,
  allowTouchMove: false,
});

  // 2. Swiper untuk Produk (ORIGINAL)
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

// BARU: Inisialisasi untuk Swiper Produk KEDUA
new Swiper('.swiper-produk-2', { // Menargetkan kelas baru .swiper-produk-2
  loop: true,
  spaceBetween: 20,
  pagination: { el: '.swiper-pagination-2', clickable: true }, // Menggunakan pagination unik
  navigation: { 
    nextEl: '.swiper-button-next-2', // Menggunakan tombol navigasi unik
    prevEl: '.swiper-button-prev-2'  // Menggunakan tombol navigasi unik
  },
  breakpoints: {
    0: { slidesPerView: 1, spaceBetween: 20 },
    640: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 4, spaceBetween: 30 }
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

/* ============================================= */
/* LOGIKA FORMULIR PEMBAYARAN (REVISI FINAL)     */
/* ============================================= */

const configPESANAN = {
  appsScript: 'https://script.google.com/macros/s/AKfycbx_jEuMMuXkeZPb7HdIdKoJvcx6W1svCqqdeAnGdwBBZsgOD-648x5g1D3Ql1G52N1b/exec', // <-- ISI DENGAN URL WEB APP ANDA SETELAH DEPLOY
  nomorWhatsapp: '628999897979',
};

const allPackageButtons = document.querySelectorAll('.btn-pilih-paket');
const formContainer = document.getElementById('payment-form-container');
const paymentForm = document.getElementById('payment-form');
const formLoader = document.querySelector('.payment-form-loader');
const formSteps = document.querySelectorAll('.form-step');
const nextBtn = document.querySelector('.btn-next');
const prevBtn = document.querySelector('.btn-prev');

let currentStep = 1;
let selectedPackage = '';
let collectedData = {};

function showStep(stepNumber) {
  formSteps.forEach(step => step.classList.remove('active'));
  document.querySelector(`.form-step[data-step="${stepNumber}"]`).classList.add('active');
  currentStep = stepNumber;
}

allPackageButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedPackage = button.getAttribute('data-paket');
    document.getElementById('paket-dipilih').textContent = selectedPackage;
    document.getElementById('paket-sukses').textContent = selectedPackage;
    
    paymentForm.reset();
    showStep(1);
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

nextBtn.addEventListener('click', () => {
  if (validateStep1()) {
    collectStep1Data();
    buildSummaryTable();
    showStep(2);
  }
});

prevBtn.addEventListener('click', () => showStep(1));

function validateStep1() {
  let isValid = true;
  const inputs = document.querySelectorAll('.form-step[data-step="1"] [required]');
  for (const input of inputs) {
    if (!input.value.trim()) {
      alert(`Harap isi kolom: ${input.labels[0].textContent}`);
      isValid = false;
      break;
    }
    if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) {
      alert('Format email tidak valid.');
      isValid = false;
      break;
    }
    if (input.type === 'file' && input.files[0] && input.files[0].size > 2 * 1024 * 1024) {
      alert('Ukuran file bukti pembayaran tidak boleh lebih dari 2MB.');
      isValid = false;
      break;
    }
  }
  return isValid;
}

function collectStep1Data() {
  collectedData = {
    'PAKET': selectedPackage,
    'NAMA_LENGKAP': document.getElementById('nama-lengkap').value,
    'NO_WHATSAPP': document.getElementById('no-whatsapp').value,
    'ALAMAT_EMAIL': document.getElementById('email').value,
    'PROFESI': document.getElementById('profesi').value,
  };
}

function buildSummaryTable() {
  const table = document.getElementById('summary-table');
  table.innerHTML = '';
  for (const key in collectedData) {
    const friendlyKey = key.replace(/_/g, ' ');
    const row = `
      <div class="summary-row">
        <div class="summary-label">${friendlyKey}</div>
        <div class="summary-value">: ${collectedData[key]}</div>
      </div>
    `;
    table.innerHTML += row;
  }
}

paymentForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (currentStep !== 2) return;

  formLoader.style.display = 'flex';

  const fileInput = document.getElementById('bukti-pembayaran');
  const file = fileInput.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const fileData = {
      base64: e.target.result.split(',')[1],
      type: file.type,
      name: file.name,
      fieldName: 'BUKTI_PEMBAYARAN' // Nama kolom di Spreadsheet
    };

    const fd = new FormData();
    for (const key in collectedData) {
      fd.append(key, collectedData[key]);
    }
    fd.append('files', JSON.stringify([fileData]));
    
    fetch(configPESANAN.appsScript, {
      method: 'POST',
      body: fd
    })
    .then(res => res.json())
    .then(data => {
      formLoader.style.display = 'none';
      if (data.result === 'success') {
        setupWhatsAppLink();
        showStep(3);
      } else {
        throw new Error(data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengirim data: ' + error.message);
      formLoader.style.display = 'none';
    });
  };

  reader.onerror = function(error) {
    console.error('Error reading file:', error);
    alert('Gagal membaca file bukti pembayaran.');
    formLoader.style.display = 'none';
  };
  
  reader.readAsDataURL(file);
});

function setupWhatsAppLink() {
  let message = `Halo, ini adalah data pesanan saya:\n\n`;
  for(const key in collectedData) {
       const friendlyKey = key.replace(/_/g, ' ');
       message += `*${friendlyKey}*: ${collectedData[key]}\n`;
  }
  
  const waURL = `https://api.whatsapp.com/send?phone=${configPESANAN.nomorWhatsapp}&text=${encodeURIComponent(message)}`;
  document.getElementById('btn-confirm-wa').href = waURL;
}

  
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
