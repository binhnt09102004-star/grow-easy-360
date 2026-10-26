/**
 * GROW-EASY 360° - Interactive Logic & UI Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initTurntable();
  initThermalSimulator();
  initSleeveSimulator();
  initGrowSimulator();
  initSizeGuideModal();
  initFaqAccordion();
  initPreorderModal();
  initMobileNav();
  initVideoReviews();
  initFloatingMascot();
});

/* ==========================================================================
   1. Interactive 360° Turntable Angle Switcher
   ========================================================================== */
function initTurntable() {
  const turntableImg = document.getElementById('turntableImg');
  const angleBtns = document.querySelectorAll('.angle-btn');
  const frameContainer = document.getElementById('turntableFrame');

  if (!turntableImg) return;

  const angleImages = {
    '0': 'assets/grow-easy-front.png',
    '90': 'assets/grow-easy-right.png',
    '180': 'assets/grow-easy-back.png',
    '270': 'assets/grow-easy-left.png'
  };

  const angleList = ['0', '90', '180', '270'];
  let currentAngleIndex = 0;

  function setAngle(angle) {
    if (!angleImages[angle]) return;
    turntableImg.style.opacity = '0.4';
    turntableImg.style.transform = 'scale(0.98)';

    setTimeout(() => {
      turntableImg.src = angleImages[angle];
      turntableImg.alt = `GROW-EASY 360° - ${angle}° 각도 뷰`;
      turntableImg.style.opacity = '1';
      turntableImg.style.transform = 'scale(1)';
    }, 100);

    angleBtns.forEach(btn => {
      if (btn.dataset.angle === angle) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    currentAngleIndex = angleList.indexOf(angle);
    updateHotspotVisibility(angle);
  }

  // Angle button clicks
  angleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setAngle(btn.dataset.angle);
    });
  });

  // Drag / touch scrub interaction
  if (frameContainer) {
    let startX = 0;
    let isDragging = false;

    frameContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const diffX = e.clientX - startX;
      if (Math.abs(diffX) > 60) {
        if (diffX > 0) {
          // Drag right -> previous angle
          currentAngleIndex = (currentAngleIndex - 1 + angleList.length) % angleList.length;
        } else {
          // Drag left -> next angle
          currentAngleIndex = (currentAngleIndex + 1) % angleList.length;
        }
        setAngle(angleList[currentAngleIndex]);
        startX = e.clientX;
      }
    });

    // Touch support for mobile
    frameContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    frameContainer.addEventListener('touchmove', (e) => {
      const diffX = e.touches[0].clientX - startX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          currentAngleIndex = (currentAngleIndex - 1 + angleList.length) % angleList.length;
        } else {
          currentAngleIndex = (currentAngleIndex + 1) % angleList.length;
        }
        setAngle(angleList[currentAngleIndex]);
        startX = e.touches[0].clientX;
      }
    }, { passive: true });
  }

  function updateHotspotVisibility(angle) {
    const hotspots = document.querySelectorAll('.hotspot-marker');
    // In front view (0°), show all front features. In back view (180°), hide chest patch hotspot.
    hotspots.forEach(hs => {
      if (hs.dataset.type === 'chest-thermal') {
        hs.style.display = (angle === '0' || angle === '270') ? 'flex' : 'none';
      }
    });
  }
}

/* ==========================================================================
   2. Smart Thermal Patch Interactive Simulator (Section 4 USP 3)
   ========================================================================== */
function initThermalSimulator() {
  const thermalBtns = document.querySelectorAll('.thermal-btn');
  const thermalDisc = document.getElementById('thermalDisc');
  const thermalTemp = document.getElementById('thermalTemp');
  const thermalStatusText = document.getElementById('thermalStatusText');

  if (!thermalDisc) return;

  const thermalStates = {
    green: {
      color: '#10B981',
      temp: '36.5°C',
      status: '🟢 정상 체온 범위 (36.5°C ~ 37.2°C)',
      desc: '아이의 체온이 편안한 정상 상태입니다. 숙면을 취하기에 적합합니다.'
    },
    yellow: {
      color: '#F59E0B',
      temp: '37.8°C',
      status: '🟡 미열 주의 (37.5°C ~ 38.0°C)',
      desc: '태열 또는 미열 징후가 감지되었습니다. 룸웨어 소매 롤업 및 실내 환기를 권장합니다.'
    },
    red: {
      color: '#EF4444',
      temp: '38.5°C',
      status: '🔴 고온 알림 (38.0°C 이상)',
      desc: '정밀 체온계 측정이 필요한 고온 상태입니다. 즉시 체온을 확인하고 조치해주세요.'
    }
  };

  thermalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const stateKey = btn.dataset.state;
      const state = thermalStates[stateKey];
      if (!state) return;

      thermalBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      thermalDisc.style.background = state.color;
      thermalDisc.style.boxShadow = `0 0 16px ${state.color}`;
      if (thermalTemp) thermalTemp.textContent = state.temp;
      if (thermalStatusText) {
        thermalStatusText.innerHTML = `<strong>${state.status}</strong><br><span style="font-size:0.85rem;color:var(--text-secondary);">${state.desc}</span>`;
      }
    });
  });
}

/* ==========================================================================
   3. Modular Sleeve Roll-up Simulator (Section 4 USP 4)
   ========================================================================== */
function initSleeveSimulator() {
  const sleevePills = document.querySelectorAll('.sleeve-pill');
  const sleeveFeedback = document.getElementById('sleeveFeedback');

  if (!sleevePills.length) return;

  const sleeveDescriptions = {
    'long': '긴팔 모드: 쌀쌀한 봄·가을·겨울철 포근한 체온 유지에 적합합니다.',
    'three-quarter': '7부 롤업 모드: 실내 놀이 및 이유식 섭취 시 소매 오염을 방지합니다.',
    'short': '반팔 모드: 여름철 및 실내 난방 환경에서 쾌적하고 시원하게 착용합니다.'
  };

  sleevePills.forEach(pill => {
    pill.addEventListener('click', () => {
      sleevePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const mode = pill.dataset.mode;
      if (sleeveFeedback && sleeveDescriptions[mode]) {
        sleeveFeedback.textContent = sleeveDescriptions[mode];
      }
    });
  });
}

/* ==========================================================================
   4. Grow Panel 3-Stage Simulator & Size Reference Guide (Section 4 USP 1)
   ========================================================================== */
function initGrowSimulator() {
  const growSteps = document.querySelectorAll('.grow-step');
  const growFeedback = document.getElementById('growFeedback');
  const growFeatureImg = document.getElementById('growFeatureImg');
  const growStageBadge = document.getElementById('growStageBadge');

  const refTitle = document.getElementById('sizeRefTitle');
  const refTag = document.getElementById('sizeRefTag');
  const refHeight = document.getElementById('refHeight');
  const refWeight = document.getElementById('refWeight');
  const refExtension = document.getElementById('refExtension');
  const refDiaper = document.getElementById('refDiaper');

  if (!growSteps.length) return;

  const sizeData = {
    'step1': {
      img: 'assets/lifestyle/size_fit_step1_6to9m.jpg',
      badge: 'STEP 1 · 6~9개월',
      title: '6~9개월 (기본형 핏)',
      tag: '표준 체형 권장',
      height: '65 ~ 72 cm',
      weight: '7.0 ~ 9.0 kg',
      extension: '기본 0cm (원단 표준핏)',
      diaper: 'M 사이즈 밴드/팬티형',
      desc: '표준 체형에 꼭 맞는 편안한 핏으로 첫 룸웨어 시작. 뒤집기 및 배밀이 활동 시 복부를 따뜻하게 감싸줍니다.'
    },
    'step2': {
      img: 'assets/lifestyle/size_fit_step2_9to12m.jpg',
      badge: 'STEP 2 · 9~12개월 (+4cm)',
      title: '9~12개월 (1단계 확장 핏)',
      tag: '활동성 강화 단계',
      height: '72 ~ 78 cm',
      weight: '9.0 ~ 11.0 kg',
      extension: '+4cm (밑위·소매 1차 확장)',
      diaper: 'L 사이즈 팬티형 여유 대응',
      desc: '기어다니고 잡고 서는 시기. +4cm 확장 패널로 두꺼운 낮/밤기저귀 착용 시에도 밑위 당김 없이 자유로운 움직임을 제공합니다.'
    },
    'step3': {
      img: 'assets/lifestyle/size_fit_step3_12to18m.jpg',
      badge: 'STEP 3 · 12~18개월 (+8cm)',
      title: '12~18개월 (2단계 최대 확장)',
      tag: '걸음마 시기 최적화',
      height: '78 ~ 85 cm',
      weight: '11.0 ~ 13.5 kg',
      extension: '+8cm (밑위·소매 최대 확장)',
      diaper: 'XL 사이즈 활동형 완벽 대응',
      desc: '첫 걸음마와 실내 활동량이 급증하는 시기. +8cm 최대 확장으로 바지가 껑충해지지 않고 18개월까지 한 벌로 완벽하게 착용합니다.'
    }
  };

  growSteps.forEach(step => {
    step.addEventListener('click', () => {
      growSteps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
      const stepKey = step.dataset.step;
      const data = sizeData[stepKey];
      if (!data) return;

      // Update image with smooth crossfade
      if (growFeatureImg && data.img) {
        growFeatureImg.style.opacity = '0.4';
        setTimeout(() => {
          growFeatureImg.src = data.img;
          growFeatureImg.alt = `${data.title} 실착 모습`;
          growFeatureImg.style.opacity = '1';
        }, 120);
      }

      if (growStageBadge) growStageBadge.textContent = data.badge;
      if (refTitle) refTitle.textContent = data.title;
      if (refTag) refTag.textContent = data.tag;
      if (refHeight) refHeight.textContent = data.height;
      if (refWeight) refWeight.textContent = data.weight;
      if (refExtension) refExtension.textContent = data.extension;
      if (refDiaper) refDiaper.textContent = data.diaper;
      if (growFeedback) growFeedback.textContent = data.desc;
    });
  });
}

/* ==========================================================================
   4-1. Size Guide Detailed Modal
   ========================================================================== */
function initSizeGuideModal() {
  const sizeModal = document.getElementById('sizeGuideModal');
  const openBtns = document.querySelectorAll('#btnOpenSizeModal, .btn-open-size-guide');
  const closeBtn = document.getElementById('sizeModalCloseBtn');

  if (!sizeModal) return;

  function openModal() {
    sizeModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    sizeModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  sizeModal.addEventListener('click', (e) => {
    if (e.target === sizeModal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sizeModal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. FAQ Accordion Handler (Contact Page)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Optional accordion behavior: close other items
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      if (isOpen) {
        item.classList.remove('open');
      } else {
        item.classList.add('open');
      }
    });
  });
}

/* ==========================================================================
   6. Pre-order Modal System (사전예약 모달)
   ========================================================================== */
function initPreorderModal() {
  const modalOverlay = document.getElementById('preorderModal');
  const openBtns = document.querySelectorAll('.btn-open-preorder, .cta-preorder');
  const closeBtn = document.getElementById('modalCloseBtn');
  const preorderForm = document.getElementById('preorderForm');
  const toastNotice = document.getElementById('toastNotice');

  if (!modalOverlay) return;

  function openModal(tierName = 'SMART') {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Auto-select tier radio if matches
    const tierRadio = document.querySelector(`input[name="tier"][value="${tierName}"]`);
    if (tierRadio) {
      tierRadio.checked = true;
      updateTierRadios();
    }
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tier = btn.dataset.tier || 'SMART';
      openModal(tier);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // ESC key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Tier radio custom styling
  const tierLabels = document.querySelectorAll('.tier-radio-label');
  function updateTierRadios() {
    tierLabels.forEach(label => {
      const input = label.querySelector('input');
      if (input && input.checked) {
        label.classList.add('selected');
      } else {
        label.classList.remove('selected');
      }
    });
  }

  tierLabels.forEach(label => {
    label.addEventListener('click', () => {
      setTimeout(updateTierRadios, 10);
    });
  });

  // Pre-order form submit
  if (preorderForm) {
    preorderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(preorderForm);
      const orderData = {
        tier: formData.get('tier'),
        color: formData.get('color'),
        name: formData.get('parentName'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        timestamp: new Date().toISOString()
      };

      try {
        const stored = JSON.parse(localStorage.getItem('grow_easy_preorders') || '[]');
        stored.push(orderData);
        localStorage.setItem('grow_easy_preorders', JSON.stringify(stored));
      } catch (err) {
        console.error('Storage error:', err);
      }

      closeModal();
      showToast('🎉 사전예약 신청이 성공적으로 접수되었습니다! (얼리버드 20% 혜택 적용)');
      preorderForm.reset();
      updateTierRadios();
    });
  }

  function showToast(msg) {
    if (!toastNotice) return;
    toastNotice.querySelector('.toast-msg').textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4500);
  }
}

/* ==========================================================================
   7. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Close when clicking nav link on mobile
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

/* ==========================================================================
   8. Video Review Player Interactions
   ========================================================================== */
function initVideoReviews() {
  const cards = document.querySelectorAll('.video-review-card');

  cards.forEach(card => {
    const video = card.querySelector('.video-element');
    const overlay = card.querySelector('.video-play-overlay');

    if (!video || !overlay) return;

    overlay.addEventListener('click', () => {
      // Pause any other playing review video
      document.querySelectorAll('.video-element').forEach(otherVideo => {
        if (otherVideo !== video && !otherVideo.paused) {
          otherVideo.pause();
          const otherOverlay = otherVideo.closest('.video-wrapper')?.querySelector('.video-play-overlay');
          if (otherOverlay) otherOverlay.classList.remove('playing');
        }
      });

      if (video.paused) {
        video.play().then(() => {
          overlay.classList.add('playing');
        }).catch(err => {
          console.log('Video play error:', err);
        });
      } else {
        video.pause();
        overlay.classList.remove('playing');
      }
    });

    video.addEventListener('click', () => {
      if (!video.paused) {
        video.pause();
        overlay.classList.remove('playing');
      }
    });

    video.addEventListener('ended', () => {
      overlay.classList.remove('playing');
      video.currentTime = 0;
    });

    video.addEventListener('pause', () => {
      overlay.classList.remove('playing');
    });
  });
}



/* ==========================================================================
   10. Floating Bouncing Mascot Interaction
   ========================================================================== */
function initFloatingMascot() {
  const container = document.getElementById('floatingMascot');
  const bubble = document.getElementById('mascotBubble');
  const img = document.getElementById('mascotImg');

  if (!container || !bubble || !img) return;

  const messages = [
    '새벽 10분의 여유! 🌱',
    '사전예약 20% 할인 중! 🎉',
    '폭신폭신 숙면 파트너! 💫',
    '우리 아이 꿀잠 케어 🌙',
    '360° 인체공학 핏 ✨',
    '클릭해주셔서 감사해요! 💖'
  ];

  let currentMsgIdx = 0;
  let isSpinning = false;

  // Click mascot to spin and switch cute message
  container.addEventListener('click', (e) => {
    currentMsgIdx = (currentMsgIdx + 1) % messages.length;
    bubble.textContent = messages[currentMsgIdx];

    // Trigger bubble pulse
    bubble.style.animation = 'none';
    void bubble.offsetWidth;
    bubble.style.animation = 'bubbleFloat 2.4s ease-in-out infinite';

    // Mascot 360 jump celebrate spin
    if (!isSpinning) {
      isSpinning = true;
      img.classList.add('spin-celebrate');
      setTimeout(() => {
        img.classList.remove('spin-celebrate');
        isSpinning = false;
      }, 800);
    }
  });

  // Cycle speech bubble automatically every 5 seconds if not hovered
  setInterval(() => {
    if (!container.matches(':hover')) {
      currentMsgIdx = (currentMsgIdx + 1) % messages.length;
      bubble.textContent = messages[currentMsgIdx];
    }
  }, 5000);
}
