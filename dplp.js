/* =================================================================== */
/* KODE JAVASCRIPT LANDING PAGE (FINAL LENGKAP)                        */
/* =================================================================== */

// --- FUNGSI UTILITAS (ditempatkan di luar agar bisa diakses global) ---
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

// --- LISTENER UTAMA: Menunggu seluruh struktur HTML dimuat ---
document.addEventListener("DOMContentLoaded", function() {

  /*=============================================
  =            INISIALISASI & SETUP AWAL          =
  =============================================*/
  const landingPage = document.getElementById('landingpage-edukrein');
  if (landingPage) {
    document.body.prepend(landingPage);
    landingPage.style.visibility = 'visible';
  }

  const navbar = document.querySelector('.navbar-landing');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  /*=============================================
  =            INISIALISASI SWIPER SLIDERS      =
  =============================================*/
  new Swiper('.swiper-logo-slider', {
    loop: true,
    autoplay: { delay: 0, disableOnInteraction: false },
    speed: 8000,
    slidesPerView: 'auto',
    spaceBetween: 60,
    grabCursor: false,
    allowTouchMove: false,
  });
  new Swiper('.swiper-produk', {
    loop: true,
    spaceBetween: 20,
    navigation: { nextEl: '.swiper-produk-wrapper .swiper-button-next', prevEl: '.swiper-produk-wrapper .swiper-button-prev' },
    breakpoints: { 0: { slidesPerView: 1 }, 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }
  });
  new Swiper('.swiper-produk-2', {
    loop: true,
    spaceBetween: 20,
    navigation: { nextEl: '.swiper-produk-wrapper-2 .swiper-button-next-2', prevEl: '.swiper-produk-wrapper-2 .swiper-button-prev-2' },
    breakpoints: { 0: { slidesPerView: 1 }, 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }
  });
  new Swiper('.swiper-testimoni-main', {
    loop: true,
    navigation: { nextEl: '.swiper-testimoni-main .swiper-button-next', prevEl: '.swiper-testimoni-main .swiper-button-prev' }
  });
  new Swiper('.swiper-testimoni-marquee', {
    loop: true,
    spaceBetween: 20,
    slidesPerView: 1.5,
    autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
    breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
  });

  /*=============================================
  =         LOGIKA ALUR FAKTUR & PEMBAYARAN       =
  =============================================*/
  const configPESANAN = {
    appsScript: 'https://script.google.com/macros/s/AKfycbyuefAX9b_PQda4Ch7m_biagqfNya23W-vfAwRBBJYFidWBfqJaOG2X33spHK4OEZgl/exec',
    nomorWhatsapp: '628999897979',
    discountCodes: {
      'DISKON10': { type: 'percent', value: 10 },
      'POTONG50K': { type: 'fixed', value: 50000 },
      'EDUKREIN2025': { type: 'percent', value: 25 }
    }
  };

  const allPackageButtons = document.querySelectorAll('.btn-pilih-paket');
  const formContainer = document.getElementById('payment-flow-container');
  const paymentForm = document.getElementById('payment-form');
  const formLoader = document.querySelector('.payment-form-loader');
  const allFormSteps = document.querySelectorAll('.form-step');
  const closeFormBtn = document.getElementById('close-form-btn');
  const btnCekKode = document.getElementById('btn-cek-kode');
  const kodeDiskonInput = document.getElementById('kode-diskon');
  const waConfirmBtn = document.getElementById('btn-confirm-wa');

  let currentStep = 1;
  let orderData = {};

  function showStep(stepNumber) {
    if(!allFormSteps.length) return;
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
    if (paymentForm) paymentForm.reset();
    orderData = {};
    const feedbackEl = document.getElementById('discount-feedback');
    if (feedbackEl) {
      feedbackEl.textContent = '';
      feedbackEl.className = 'discount-feedback';
    }
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
      'Profesi': orderData.profesi,
      'Metode Pembayaran': orderData.metodePembayaran,
    };
    for (const key in dataToShow) {
      const row = `<div class="summary-row"><div class="summary-label">${key}</div><div class="summary-value">${dataToShow[key]}</div></div>`;
      table.innerHTML += row;
    }
    const fileInput = document.getElementById('bukti-pembayaran');
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const summaryRow = document.createElement('div');
      summaryRow.className = 'summary-row';
      summaryRow.innerHTML = `<div class="summary-label">Bukti Pembayaran</div><div class="summary-value" id="final-summary-image-preview"><span class="text-muted" style="font-size: 0.8rem;">Memuat preview...</span></div>`;
      table.appendChild(summaryRow);
      try {
        const compressedImage = await compressImage(file, 200, 0.7);
        document.getElementById('final-summary-image-preview').innerHTML = `<img src="${compressedImage}" alt="Preview" style="max-width: 100px; border-radius: 5px; margin-top: 5px; border: 1px solid #ddd;" />`;
      } catch (error) {
        document.getElementById('final-summary-image-preview').textContent = 'Gagal memuat preview.';
      }
    }
  }

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

  if (allPackageButtons.length > 0 && formContainer) {
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
          orderData.profesi = document.getElementById('profesi').value;
          orderData.metodePembayaran = document.getElementById('metode-pembayaran').value;
          buildFinalSummary();
        }
        showStep(currentStep + 1);
      }
      if (e.target.matches('.btn-prev')) {
        showStep(currentStep - 1);
      }
    });

    waConfirmBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(this.href, '_blank');
      setTimeout(() => { location.reload(); }, 1000);
    });

    paymentForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (currentStep !== 4) return;
      formLoader.style.display = 'flex';
      const fileInput = document.getElementById('bukti-pembayaran');
      if (fileInput.files.length === 0) {
        alert("Harap unggah bukti pembayaran.");
        formLoader.style.display = 'none';
        return;
      }
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
        fd.append('PROFESI', orderData.profesi);
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
      message += `*Profesi:* ${orderData.profesi}\n`;
      message += `*Metode Pembayaran:* ${orderData.metodePembayaran}\n`;
      message += `*Total Transfer:* ${formatRupiah(orderData.totalPembayaran)}\n\n`;
      message += `Berikut adalah bukti pembayarannya:\n${fileUrl}\n\n`;
      message += `Mohon segera diproses. Terima kasih!`;
      const waURL = `https://api.whatsapp.com/send?phone=${configPESANAN.nomorWhatsapp}&text=${encodeURIComponent(message)}`;
      document.getElementById('btn-confirm-wa').href = waURL;
    }
  }

  /*=============================================
  =            LOGIKA COUNTDOWN TIMER             =
  =============================================*/
  const countdownDate = new Date(2025, 8, 14, 23, 59, 59).getTime();
  const timerInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = countdownDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const elements = {
      days: document.getElementById('days'),
      hours: document.getElementById('hours'),
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds'),
    };
    if (elements.days && elements.hours && elements.minutes && elements.seconds) {
      elements.days.innerHTML = String(days).padStart(2, '0');
      elements.hours.innerHTML = String(hours).padStart(2, '0');
      elements.minutes.innerHTML = String(minutes).padStart(2, '0');
      elements.seconds.innerHTML = String(seconds).padStart(2, '0');
    }
    if (distance < 0) {
      clearInterval(timerInterval);
      const timerEl = document.getElementById('countdown-timer');
      if (timerEl) timerEl.innerHTML = "<p class='promo-ended'>Promo Telah Berakhir!</p>";
    }
  }, 1000);

  const skipBtn = document.getElementById('skip-btn');
  const lanjutBtn = document.getElementById('lanjut-btn');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => { window.location.href = 'https://www.google.com'; });
  }
  if (lanjutBtn) {
    lanjutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const hargaSection = document.getElementById('harga');
      if (hargaSection) hargaSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  /*=============================================
  =         DIKEMBALIKAN: ANIMASI STATISTIK       =
  =============================================*/
  const statistikSection = document.getElementById('statistik');
  if (statistikSection) {
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

  /*=============================================
  =         DIKEMBALIKAN: PENUTUP NAVBAR         =
  =============================================*/
  const landingNav = document.getElementById('landingNav');
  const navToggler = document.querySelector('.navbar-toggler');
  if (landingNav && navToggler) {
    document.addEventListener('click', function (event) {
      const isNavOpen = landingNav.classList.contains('show');
      const targetElement = event.target;
      const isClickOutside = !landingNav.contains(targetElement) && !navToggler.contains(targetElement);
      if (isNavOpen && isClickOutside) {
        navToggler.click();
      }
    });
  }

  /* =================================================================== */
  /* DIKEMBALIKAN: Perbaikan Tombol & Link FAQ di Navbar (Versi Kuat)    */
  /* =================================================================== */
  window.addEventListener('load', function() {
    let attempts = 0;
    const maxAttempts = 50;
    const fixTheFaqLink = setInterval(function() {
      attempts++;
      const faqLink = document.querySelector('#landingpage-edukrein .navbar-nav a.btn[href="#faq-kontak"]');
      if (faqLink) {
        faqLink.removeAttribute('target');
        faqLink.classList.remove('btn');
        faqLink.removeAttribute('role');
        const svgIcon = faqLink.querySelector('svg');
        if (svgIcon) svgIcon.remove();
        clearInterval(fixTheFaqLink);
      }
      if (attempts >= maxAttempts) {
        clearInterval(fixTheFaqLink);
      }
    }, 100);
  });
  
}); // --- AKHIR DARI DOMCONTENTLOADED ---
