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

/* =================================================================== */
/* LOGIKA ALUR FAKTUR & PEMBAYARAN (FINAL V9 - DENGAN SEMUA PERBAIKAN) */
/* =================================================================== */
function compressImage(file, maxWidth = 1000, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const configPESANAN = {
  appsScript: 'https://script.google.com/macros/s/AKfycbyuefAX9b_PQda4Ch7m_biagqfNya23W-vfAwRBBJYFidWBfqJaOG2X33spHK4OEZgl/exec',
  nomorWhatsapp: '628999897979',
  // POIN 4: Di sinilah Anda mengelola kode diskon
  discountCodes: {
    'DISKON10': { type: 'percent', value: 10 },
    'POTONG50K': { type: 'fixed', value: 50000 },
    'EDUKREIN2025': {type: 'percent', value: 25} // Tambah atau hapus kode di sini
  }
};

// --- DEKLARASI ELEMEN DOM ---
const allPackageButtons = document.querySelectorAll('.btn-pilih-paket');
const formContainer = document.getElementById('payment-flow-container');
const paymentForm = document.getElementById('payment-form');
const formLoader = document.querySelector('.payment-form-loader');
const allFormSteps = document.querySelectorAll('.form-step');
const closeFormBtn = document.getElementById('close-form-btn');
const btnCekKode = document.getElementById('btn-cek-kode');
const kodeDiskonInput = document.getElementById('kode-diskon');
const waConfirmBtn = document.getElementById('btn-confirm-wa');

// --- STATE MANAGEMENT ---
let currentStep = 1;
let orderData = {};

// --- FUNGSI UTAMA ---
function showStep(stepNumber) {
  allFormSteps.forEach(step => step.classList.remove('active'));
  const targetStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
  if (targetStep) targetStep.classList.add('active');
  currentStep = stepNumber;
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
}

function generateUniqueCode() {
  return Math.floor(Math.random() * (999 - 100 + 1) + 100);
}

function calculateTotal() {
  let hargaAwal = orderData.hargaAwal || 0;
  let harga = orderData.harga || 0;
  let diskon = orderData.diskon || 0;
  let subtotal = harga - diskon;
  subtotal = subtotal < 0 ? 0 : subtotal;
  let kodeUnik = orderData.kodeUnik || 0;
  let total = subtotal + kodeUnik;

  // Update UI Faktur
  document.getElementById('invoice-harga-awal').textContent = formatRupiah(hargaAwal);
  document.getElementById('invoice-harga-berlaku').textContent = formatRupiah(harga);
  document.getElementById('calc-harga-awal').textContent = formatRupiah(harga);
  document.getElementById('calc-diskon').textContent = `- ${formatRupiah(diskon)}`;
  document.getElementById('calc-subtotal').textContent = formatRupiah(subtotal);
  document.getElementById('calc-kode-unik').textContent = `+ ${formatRupiah(kodeUnik)}`;
  document.getElementById('calc-total').textContent = formatRupiah(total);
  document.getElementById('payment-total').textContent = formatRupiah(total);
  document.getElementById('data-total').textContent = formatRupiah(total);
  orderData.totalPembayaran = total;
}

function resetForm() {
  paymentForm.reset();
  orderData = {};
  const feedbackEl = document.getElementById('discount-feedback');
  feedbackEl.textContent = '';
  feedbackEl.className = 'discount-feedback';
  showStep(1);
}

function validateDiscountCode() {
  const code = kodeDiskonInput.value.trim().toUpperCase();
  const feedbackEl = document.getElementById('discount-feedback');
  const discountInfo = configPESANAN.discountCodes[code];

  if (discountInfo) {
    if (discountInfo.type === 'percent') {
      orderData.diskon = (orderData.harga * discountInfo.value) / 100;
    } else if (discountInfo.type === 'fixed') {
      orderData.diskon = discountInfo.value;
    }
    orderData.kodeDiskon = code;
    feedbackEl.textContent = `Kode "${code}" berhasil diterapkan!`;
    feedbackEl.className = 'discount-feedback success';
  } else {
    orderData.diskon = 0;
    orderData.kodeDiskon = '';
    feedbackEl.textContent = 'Maaf, kode yang Anda masukkan salah atau expired.';
    feedbackEl.className = 'discount-feedback error';
  }
  calculateTotal();
}

async function buildFinalSummary() {
    const table = document.getElementById('final-summary-table');
    table.innerHTML = '';
    const dataToShow = {
        'Paket': orderData.paket,
        'Total Pembayaran': formatRupiah(orderData.totalPembayaran),
        'Nama Lengkap': orderData.namaLengkap,
        'No WhatsApp': orderData.noWhatsapp,
        'Alamat Email': orderData.email,
        'Metode Pembayaran': orderData.metodePembayaran,
    };

    for (const key in dataToShow) {
        const row = `<div class="summary-row"><div class="summary-label">${key}</div><div class="summary-value">${dataToShow[key]}</div></div>`;
        table.innerHTML += row;
    }

    // POIN 7: Tambahkan preview gambar di sini
    const fileInput = document.getElementById('bukti-pembayaran');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const summaryRow = document.createElement('div');
        summaryRow.className = 'summary-row';
        summaryRow.innerHTML = `
            <div class="summary-label">Bukti Pembayaran</div>
            <div class="summary-value" id="final-summary-image-preview">
                <span class="text-muted" style="font-size: 0.8rem;">Memuat preview...</span>
            </div>`;
        table.appendChild(summaryRow);

        try {
            const compressedImage = await compressImage(file, 200, 0.7);
            const imagePreviewContainer = document.getElementById('final-summary-image-preview');
            imagePreviewContainer.innerHTML = `<img src="${compressedImage}" alt="Preview" style="max-width: 100px; border-radius: 5px; margin-top: 5px; border: 1px solid #ddd;" />`;
        } catch (error) {
            document.getElementById('final-summary-image-preview').textContent = 'Gagal memuat preview.';
        }
    }
}

// POIN 6: Validasi email dan WA dikembalikan
function validateStep(step) {
    if (step === 3) {
        const inputs = document.querySelectorAll('.form-step[data-step="3"] [required]');
        for (const input of inputs) {
            const value = input.value.trim();
            if (!value) {
                alert(`Harap isi kolom: ${input.labels?.[0]?.textContent || 'Input'}`);
                return false;
            }
            if (input.id === 'email' && !value.toLowerCase().endsWith('@gmail.com')) {
                alert('Mohon gunakan alamat email Gmail (@gmail.com).');
                return false;
            }
            if (input.id === 'no-whatsapp' && !/^08\d{8,11}$/.test(value)) {
                alert('Format No. WhatsApp tidak valid (awali "08", 10-13 digit).');
                return false;
            }
            if (input.type === 'file' && input.files.length === 0) {
                alert('Harap unggah bukti pembayaran.');
                return false;
            }
        }
    }
    return true;
}

// --- EVENT LISTENERS ---
allPackageButtons.forEach(button => {
  button.addEventListener('click', () => {
    resetForm();
    orderData = {
      paket: button.dataset.paket,
      harga: parseInt(button.dataset.harga),
      hargaAwal: parseInt(button.dataset.hargaAwal),
      kodeUnik: generateUniqueCode(),
      diskon: 0,
      kodeDiskon: ''
    };
    document.getElementById('invoice-paket').textContent = orderData.paket;
    document.getElementById('invoice-harga-awal').textContent = formatRupiah(orderData.hargaAwal);
    calculateTotal();
    document.getElementById('price-cards-container').style.display = 'none';
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

closeFormBtn.addEventListener('click', () => {
  formContainer.style.display = 'none';
  document.getElementById('price-cards-container').style.display = 'flex';
});

btnCekKode.addEventListener('click', validateDiscountCode);

paymentForm.addEventListener('click', function(e) {
    if (e.target.matches('.btn-next')) {
        if (currentStep === 3) {
            if (!validateStep(3)) return;
            orderData.namaLengkap = document.getElementById('nama-lengkap').value.trim();
            orderData.noWhatsapp = document.getElementById('no-whatsapp').value.trim();
            orderData.email = document.getElementById('email').value.trim();
            orderData.metodePembayaran = document.getElementById('metode-pembayaran').value;
            buildFinalSummary();
        }
        showStep(currentStep + 1);
    }
    if (e.target.matches('.btn-prev')) {
        showStep(currentStep - 1);
    }
});

// POIN 8: Listener untuk refresh halaman ditambahkan di sini
waConfirmBtn.addEventListener('click', function(e) {
  e.preventDefault();
  window.open(this.href, '_blank');
  setTimeout(() => { location.reload(); }, 1000);
});

// Submit Form (Logika Pengiriman Data)
paymentForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  if (currentStep !== 4) return;

  formLoader.style.display = 'flex';

  const fileInput = document.getElementById('bukti-pembayaran');
  const file = fileInput.files[0];
  
  try {
    const compressedBase64 = await compressImage(file);
    const fileData = {
      base64: compressedBase64.split(',')[1],
      type: 'image/jpeg',
      name: file.name.replace(/\.[^/.]+$/, "") + ".jpg",
      fieldName: 'BUKTI_PEMBAYARAN'
    };

    const fd = new FormData();
    fd.append('PAKET', orderData.paket);
    fd.append('NAMA_LENGKAP', orderData.namaLengkap);
    fd.append('NO_WHATSAPP', orderData.noWhatsapp);
    fd.append('ALAMAT_EMAIL', orderData.email);
    fd.append('METODE_PEMBAYARAN', orderData.metodePembayaran);
    fd.append('KODE_DISKON', orderData.kodeDiskon);
    fd.append('KODE_UNIK', orderData.kodeUnik);
    fd.append('TOTAL_PEMBAYARAN', orderData.totalPembayaran);
    fd.append('files', JSON.stringify([fileData]));
    
    const response = await fetch(configPESANAN.appsScript, { method: 'POST', body: fd, redirect: 'follow' });
    const data = await response.json();
    
    formLoader.style.display = 'none';
    if (data.result === 'success' && data.fileUrl) {
      document.getElementById('paket-sukses').textContent = orderData.paket;
      setupWhatsAppLink(data.fileUrl);
      showStep(5);
    } else {
      throw new Error(data.error || 'Terjadi kesalahan di server.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Terjadi kesalahan saat mengirim data: ' + error.message);
    formLoader.style.display = 'none';
  }
});

function setupWhatsAppLink(fileUrl) {
  let message = `*KONFIRMASI PESANAN - EDUKREIN*\n\n`;
  message += `Halo, saya sudah melakukan pembayaran untuk pesanan berikut:\n\n`;
  message += `*Paket:* ${orderData.paket}\n`;
  message += `*Nama:* ${orderData.namaLengkap}\n`;
  message += `*No. WhatsApp:* ${orderData.noWhatsapp}\n`;
  message += `*Email:* ${orderData.email}\n`;
  message += `*Metode Pembayaran:* ${orderData.metodePembayaran}\n`;
  message += `*Total Transfer:* ${formatRupiah(orderData.totalPembayaran)}\n\n`;
  message += `Berikut adalah bukti pembayarannya:\n${fileUrl}\n\n`;
  message += `Mohon segera diproses. Terima kasih!`;
  
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
