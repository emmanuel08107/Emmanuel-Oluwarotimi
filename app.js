/**
 * WISDOM AND KNOWLEDGE SCHOOL - CORE JAVASCRIPT
 * Interactive functionality, multi-step registration, fee estimator,
 * gallery filters, modals, and dynamic state management.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAcademicTabs();
  initGalleryFilters();
  initFeeCalculator();
  initFaqAccordion();
  initScrollSpy();
  setCurrentYear();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('mainHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close mobile menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }
}

// Scroll Spy to highlight active navigation link
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

function setCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   2. ACADEMIC PROGRAM TABS
   ========================================================================== */
function initAcademicTabs() {
  const tabBtns = document.querySelectorAll('.classes-tabs-nav .tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Update button states
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update pane states
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetId) {
          pane.classList.add('active');
        }
      });
    });
  });
}

/* ==========================================================================
   3. FACILITY GALLERY FILTER & LIGHTBOX
   ========================================================================== */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const facilityCards = document.querySelectorAll('.gallery-grid .facility-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      facilityCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function openLightbox(imgSrc, title, description) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const descEl = document.getElementById('lightboxDesc');

  if (modal && img && titleEl && descEl) {
    img.src = imgSrc;
    img.alt = title;
    titleEl.textContent = title;
    descEl.textContent = description;
    modal.classList.add('open');
  }
}

function closeLightboxDirect() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('open');
}

function closeLightbox(e) {
  if (e.target.id === 'lightboxModal') {
    closeLightboxDirect();
  }
}

/* ==========================================================================
   4. MULTI-STEP CANDIDATE REGISTRATION & ADMISSION SLIP GENERATOR
   ========================================================================== */
let currentRegistrationStep = 1;
const storedRegistrations = [
  {
    appId: 'WKS-2026-8821',
    candName: 'Adebayo Oluwaseun David',
    className: 'Basic 1 (Primary 1)',
    dobGender: '14 May 2019 / Male',
    parentName: 'Engr. T. Adebayo',
    phone: '08031234567',
    address: 'Plot 15 Harmony Estate, Adebayo Road, Adebayo',
    examDate: 'Saturday, 10th October 2026 (9:00 AM)',
    status: 'Entrance Assessment Scheduled - Venue: Academic Hall A, Adebayo Campus'
  }
];

function goToStep(step) {
  // Validate before advancing
  if (step > currentRegistrationStep) {
    if (currentRegistrationStep === 1) {
      const sur = document.getElementById('candSurName').value.trim();
      const first = document.getElementById('candFirstName').value.trim();
      const dob = document.getElementById('candDob').value;
      const gender = document.getElementById('candGender').value;
      const classApply = document.getElementById('candClass').value;

      if (!sur || !first || !dob || !gender || !classApply) {
        showToast('Please fill in all required candidate fields (*)', 'error');
        return;
      }
    } else if (currentRegistrationStep === 2) {
      const parentName = document.getElementById('parentName').value.trim();
      const parentPhone = document.getElementById('parentPhone').value.trim();
      const parentEmail = document.getElementById('parentEmail').value.trim();
      const parentAddress = document.getElementById('parentAddress').value.trim();

      if (!parentName || !parentPhone || !parentEmail || !parentAddress) {
        showToast('Please fill in required parent contact information (*)', 'error');
        return;
      }
    }
  }

  // Update Preview in Step 4
  if (step === 4) {
    const sur = document.getElementById('candSurName').value.trim();
    const first = document.getElementById('candFirstName').value.trim();
    const other = document.getElementById('candOtherName').value.trim();
    const fullName = `${sur} ${first} ${other}`.trim();
    const className = document.getElementById('candClass').value;
    const parentName = document.getElementById('parentName').value.trim();
    const phone = document.getElementById('parentPhone').value.trim();
    const address = document.getElementById('parentAddress').value.trim();
    const dayType = document.getElementById('candDayType').value;

    document.getElementById('prevName').textContent = fullName || '---';
    document.getElementById('prevClass').textContent = className || '---';
    document.getElementById('prevParent').textContent = parentName || '---';
    document.getElementById('prevPhone').textContent = phone || '---';
    document.getElementById('prevAddress').textContent = address || '---';
    document.getElementById('prevType').textContent = dayType || '---';
  }

  // Switch step visibility
  for (let i = 1; i <= 4; i++) {
    const stepPane = document.getElementById(`step${i}`);
    const stepInd = document.getElementById(`stepInd${i}`);
    if (stepPane) {
      stepPane.classList.toggle('active', i === step);
    }
    if (stepInd) {
      stepInd.classList.toggle('active', i === step);
      if (i < step) {
        stepInd.classList.add('completed');
      } else {
        stepInd.classList.remove('completed');
      }
    }
  }

  currentRegistrationStep = step;
  const portalSection = document.getElementById('register');
  if (portalSection) {
    portalSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function simulateUpload() {
  const status = document.getElementById('uploadStatusText');
  if (status) {
    status.innerHTML = '<span style="color: var(--emerald-600);"><i class="fa-solid fa-circle-check"></i> Document Attached: Birth_Certificate_Candidate.pdf (1.4 MB)</span>';
    showToast('Document uploaded successfully!', 'success');
  }
}

function handleRegistrationSubmit(event) {
  event.preventDefault();

  const declaration = document.getElementById('declarationCheck');
  if (!declaration.checked) {
    showToast('Please check the declaration box to proceed.', 'error');
    return;
  }

  // Gather Candidate Details
  const sur = document.getElementById('candSurName').value.trim();
  const first = document.getElementById('candFirstName').value.trim();
  const other = document.getElementById('candOtherName').value.trim();
  const fullName = `${sur} ${first} ${other}`.trim();
  const dob = document.getElementById('candDob').value;
  const gender = document.getElementById('candGender').value;
  const className = document.getElementById('candClass').value;
  const parentName = document.getElementById('parentName').value.trim();
  const phone = document.getElementById('parentPhone').value.trim();
  const address = document.getElementById('parentAddress').value.trim();

  // Generate Unique Application ID
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newAppId = `WKS-2026-${randomNum}`;

  const regRecord = {
    appId: newAppId,
    candName: fullName,
    className: className,
    dobGender: `${dob} / ${gender}`,
    parentName: parentName,
    phone: phone,
    address: address,
    examDate: 'Saturday, 17th October 2026 (9:00 AM)',
    status: 'Application Received & Entrance Exam Scheduled at Adebayo Campus Hall A'
  };

  storedRegistrations.push(regRecord);

  // Populate Printable Slip
  document.getElementById('slipAppId').textContent = newAppId;
  document.getElementById('slipCandName').textContent = fullName;
  document.getElementById('slipClass').textContent = className;
  document.getElementById('slipDobGender').textContent = `${dob} / ${gender}`;
  document.getElementById('slipParentName').textContent = parentName;
  document.getElementById('slipPhone').textContent = phone;
  document.getElementById('slipAddress').textContent = address;

  // Open Admission Slip Modal
  const modal = document.getElementById('admissionSlipModal');
  if (modal) modal.classList.add('open');

  showToast(`Congratulations! Registration successful. Application ID: ${newAppId}`, 'success');

  // Reset Form
  document.getElementById('admissionForm').reset();
  goToStep(1);
}

function closeSlipModal() {
  const modal = document.getElementById('admissionSlipModal');
  if (modal) modal.classList.remove('open');
}

/* ==========================================================================
   5. ADMISSION STATUS CHECKER
   ========================================================================== */
function checkAdmissionStatus(event) {
  event.preventDefault();
  const query = document.getElementById('statusQuery').value.trim().toLowerCase();
  if (!query) return;

  const match = storedRegistrations.find(
    r => r.appId.toLowerCase() === query || r.phone.replace(/\s/g, '').includes(query.replace(/\s/g, ''))
  );

  if (match) {
    alert(
      `🎓 WISDOM AND KNOWLEDGE SCHOOL - ADMISSION STATUS\n\n` +
      `Application ID: ${match.appId}\n` +
      `Candidate Name: ${match.candName}\n` +
      `Class: ${match.className}\n` +
      `Status: ${match.status}\n` +
      `Assessment Date: ${match.examDate}\n` +
      `Location: Adebayo Campus`
    );
    showToast(`Status found for ${match.candName}: Application Active`, 'success');
  } else {
    // Generate a friendly mock result for any standard input
    alert(
      `🎓 WISDOM AND KNOWLEDGE SCHOOL - ADMISSION STATUS\n\n` +
      `Query: ${query}\n` +
      `Status: Application Under Active Review for 2026/2027 Session.\n` +
      `Venue: Adebayo Campus Entrance Exam Center.\n` +
      `Contact Admissions Desk (09062174962 / 08107846228) if you need assistance.`
    );
    showToast('Application record retrieved from server.', 'info');
  }
}

/* ==========================================================================
   6. TUITION & FEE CALCULATOR
   ========================================================================== */
function calculateFees() {
  const grade = document.getElementById('calcGrade').value;
  const boarding = document.getElementById('calcBoarding').value;
  const bus = document.getElementById('optBus').checked;
  const lunch = document.getElementById('optLunch').checked;
  const robotics = document.getElementById('optRobotics').checked;
  const uniform = document.getElementById('optUniform').checked;

  let baseTuition = 175000;
  if (grade === 'crèche') baseTuition = 120000;
  else if (grade === 'nursery') baseTuition = 145000;
  else if (grade === 'primary') baseTuition = 175000;
  else if (grade === 'jss') baseTuition = 210000;
  else if (grade === 'sss') baseTuition = 245000;

  let boardingFee = 0;
  if (boarding === 'afterschool') boardingFee = 25000;
  else if (boarding === 'boarding') boardingFee = 180000;

  const devFee = 15000;
  const busFee = bus ? 35000 : 0;
  const lunchFee = lunch ? 30000 : 0;
  const extrasFee = (robotics ? 20000 : 0) + (uniform ? 25000 : 0);

  const grandTotal = baseTuition + devFee + boardingFee + busFee + lunchFee + extrasFee;

  // Update DOM with Naira formatted numbers
  const formatNaira = num => `₦${num.toLocaleString()}`;

  document.getElementById('feeTuition').textContent = formatNaira(baseTuition);
  document.getElementById('feeBoarding').textContent = formatNaira(boardingFee);
  document.getElementById('feeBus').textContent = formatNaira(busFee);
  document.getElementById('feeLunch').textContent = formatNaira(lunchFee);
  document.getElementById('feeExtras').textContent = formatNaira(extrasFee);
  document.getElementById('feeGrandTotal').textContent = formatNaira(grandTotal);
}

function initFeeCalculator() {
  calculateFees();
}

/* ==========================================================================
   7. PARENT TESTIMONIAL / REVIEW SUBMISSION
   ========================================================================== */
function openReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) modal.classList.add('open');
}

function closeReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) modal.classList.remove('open');
}

function handleReviewSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('revName').value.trim();
  const role = document.getElementById('revRole').value.trim();
  const rating = parseInt(document.getElementById('revRating').value, 10);
  const text = document.getElementById('revText').value.trim();

  if (!name || !role || !text) return;

  let starsHtml = '';
  for (let i = 0; i < rating; i++) {
    starsHtml += '<i class="fa-solid fa-star"></i>';
  }

  const reviewGrid = document.getElementById('reviewsGrid');
  if (reviewGrid) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.style.animation = 'fadeIn 0.5s ease';
    card.innerHTML = `
      <div>
        <div class="review-stars">${starsHtml}</div>
        <p class="review-text">"${text}"</p>
      </div>
      <div class="review-author">
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" alt="${name}" class="author-avatar" loading="lazy">
        <div class="author-info">
          <h5>${name}</h5>
          <p>${role}</p>
        </div>
      </div>
    `;
    reviewGrid.prepend(card);
  }

  closeReviewModal();
  showToast('Thank you! Your testimonial has been published.', 'success');
}

/* ==========================================================================
   8. CONTACT FORM & NEWSLETTER
   ========================================================================== */
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contactFullName').value.trim();
  showToast(`Thank you, ${name}! Your inquiry has been sent to our Adebayo admissions team. We will call you shortly.`, 'success');
  document.getElementById('contactForm').reset();
}

function handleNewsletter(event) {
  event.preventDefault();
  showToast('Subscribed to Wisdom & Knowledge School newsletter successfully!', 'success');
  event.target.reset();
}

/* ==========================================================================
   9. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  // Handled via toggleFaq function
}

function toggleFaq(btn) {
  const item = btn.parentElement;
  const isActive = item.classList.contains('active');

  // Close all other items
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

  if (!isActive) {
    item.classList.add('active');
  }
}

/* ==========================================================================
   10. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  let icon = '<i class="fa-solid fa-circle-info" style="color: var(--accent-gold-400);"></i>';
  if (type === 'success') {
    icon = '<i class="fa-solid fa-circle-check" style="color: var(--emerald-500);"></i>';
  } else if (type === 'error') {
    icon = '<i class="fa-solid fa-triangle-exclamation" style="color: var(--rose-500);"></i>';
  }

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}
