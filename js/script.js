/* ============================================
   ARTHANTA — Premium Tech Agency
   Script Sheet v2
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Loader ----------
  const loader = document.querySelector('.loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 600);
  }

  // ---------- Custom Cursor ----------
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (cursorDot && cursorRing && window.innerWidth > 992) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .service-card, .service-detailed-card, .superpower-tag, .testimonial-btn, .testimonial-dot, .faq-question, input, textarea, select, .floating-btn'
    );
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursorRing.classList.add('hide');
      cursorDot.classList.add('hide');
    });
    document.addEventListener('mouseenter', () => {
      cursorRing.classList.remove('hide');
      cursorDot.classList.remove('hide');
    });
  } else {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  }

  // ---------- Scroll Progress ----------
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ---------- Navbar Scroll Effect ----------
  const navbar = document.querySelector('.navbar');
  const updateNavbar = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ---------- Mobile Menu ----------
  const toggleBtn = document.querySelector('.navbar-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');

  const openMobileMenu = () => {
    toggleBtn.classList.add('active');
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    toggleBtn.classList.remove('active');
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ---------- Text Scramble Effect ----------
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => this.resolve = resolve);
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.queue[i].char = char;
          }
          output += '<span style="opacity:0.5">' + char + '</span>';
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        if (this.resolve) this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
  }

  const heroTitle = document.querySelector('.hero-title .text-scramble');
  if (heroTitle) {
    const phrases = [
      'Cutting-Edge Technology',
      'Digital Products',
      'AI-Powered Solutions',
      'Scalable Platforms'
    ];
    const scramble = new TextScramble(heroTitle);
    let counter = 0;
    const nextPhrase = () => {
      scramble.setText(phrases[counter]).then(() => {
        setTimeout(nextPhrase, 3000);
      });
      counter = (counter + 1) % phrases.length;
    };
    setTimeout(nextPhrase, 2000);
  }

  // ---------- Scroll Reveal Animations ----------
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-up, .reveal-clip, .stagger-children'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.06,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- Animated Counters ----------
  const counters = document.querySelectorAll('.counter-number');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => counterObserver.observe(c));

  // ---------- Modal System ----------
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.modal-close');
  const modalBody = modalOverlay ? modalOverlay.querySelector('.modal-body') : null;

  const serviceModalData = {
    'mobile-app': {
      title: 'Mobile App Development',
      icon: 'fa-mobile-screen',
      description: 'We build apps people love to use. Native and cross-platform, we handle everything from the first sketch to App Store launch — pixel-perfect UI, rock-solid backend, and performance that feels native.',
      tech: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'GraphQL'],
      benefits: [
        'Native performance on both iOS & Android',
        'Scalable architecture built for growth',
        'Pixel-perfect UI/UX that users love',
        'App Store optimization & submission',
        'Post-launch support & maintenance',
        'Real-time analytics & crash reporting'
      ]
    },
    'fullstack': {
      title: 'Full Stack Development',
      icon: 'fa-code',
      description: 'From single-page apps to enterprise platforms — we build the full stack. Modern frontends, battle-tested backends, and cloud infrastructure that scales without breaking a sweat.',
      tech: ['React / Next.js', 'Node.js', 'Python / Django', 'PostgreSQL', 'AWS', 'Docker'],
      benefits: [
        'End-to-end development, zero handoffs',
        'Responsive, accessible interfaces',
        'High-performance API design',
        'Cloud-native, auto-scaling infra',
        'Comprehensive test coverage',
        'CI/CD pipelines out of the box'
      ]
    },
    'social-media': {
      title: 'Social Media Management',
      icon: 'fa-share-nodes',
      description: 'We turn followers into communities and likes into revenue. Data-driven content strategies, engagement that sticks, and campaigns that actually move the needle.',
      tech: ['Content Strategy', 'Analytics & Insights', 'SEO', 'Brand Identity', 'Community Mgmt', 'Paid Ads'],
      benefits: [
        'Custom content calendars that convert',
        'Consistent brand voice, every post',
        'Organic community growth strategies',
        'Weekly performance reporting',
        'Targeted ad spend optimization',
        'Reputation monitoring & crisis mgmt'
      ]
    },
    'ml-ai': {
      title: 'ML / AI Integration',
      icon: 'fa-brain',
      description: 'This is where we get really excited. Custom models, LLM integrations, computer vision — we help you harness AI not just as a feature, but as a genuine competitive advantage.',
      tech: ['TensorFlow', 'PyTorch', 'OpenAI / GPT', 'LangChain', 'Computer Vision', 'NLP'],
      benefits: [
        'Custom models trained on your data',
        'Intelligent process automation',
        'Natural language understanding',
        'Real-time computer vision pipelines',
        'Seamless API integration',
        'Ongoing model monitoring & retraining'
      ]
    },
    'saas': {
      title: 'SaaS Product Development',
      icon: 'fa-cloud',
      description: 'We\'ve built SaaS platforms serving thousands of users. Multi-tenant architecture, subscription billing, real-time features — everything you need to launch and scale a successful cloud product.',
      tech: ['Microservices', 'React / Angular', 'Node.js / Python', 'AWS / GCP', 'Stripe', 'Auth0'],
      benefits: [
        'Multi-tenant from day one',
        'Subscription & billing out of the box',
        'Auto-scaling cloud infrastructure',
        'Real-time collaboration features',
        'Built-in analytics dashboards',
        'SOC2-ready security practices'
      ]
    },
    'video-editing': {
      title: 'Video Editing & Motion Graphics',
      icon: 'fa-film',
      description: 'We make your brand move. Product demos, explainers, social content, brand films — every frame designed to captivate, communicate, and convert.',
      tech: ['After Effects', 'Premiere Pro', 'DaVinci Resolve', 'Blender', 'Cinema 4D', 'Figma'],
      benefits: [
        'Cinematic-grade production quality',
        'Custom motion graphics & animation',
        'Brand-aligned visual storytelling',
        'Explainer & product demo videos',
        'Platform-optimized social content',
        'Fast turnaround without cutting corners'
      ]
    }
  };

  const openModal = (serviceKey) => {
    if (!modalOverlay || !modalBody) return;

    const data = serviceModalData[serviceKey];
    if (!data) return;

    const headerIcon = document.querySelector('.modal-header-icon');
    if (headerIcon) {
      headerIcon.innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
    }

    const techTags = data.tech.map(t => `<span class="modal-tag">${t}</span>`).join('');
    const benefitsList = data.benefits.map(b => `<li><i class="fa-solid fa-check"></i> ${b}</li>`).join('');

    modalBody.innerHTML = `
      <h2>${data.title}</h2>
      <p class="modal-desc">${data.description}</p>
      <h4>Technologies</h4>
      <div class="modal-tags">${techTags}</div>
      <h4>Key Benefits</h4>
      <ul class="modal-benefits">${benefitsList}</ul>
    `;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.service-card, .service-detailed-card');
    if (card) {
      const service = card.getAttribute('data-service');
      if (service) openModal(service);
    }
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ---------- FAQ Accordion ----------
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // ---------- Marquee Duplication ----------
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    const clone = marqueeTrack.cloneNode(true);
    marqueeTrack.parentElement.appendChild(clone);
  }

  // ---------- Contact Form ----------
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      try {
        const data = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
          btn.style.background = 'linear-gradient(135deg, #00e676, #00c853)';
          contactForm.reset();

          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        } else {
          throw new Error('Formspree error');
        }
      } catch (err) {
        btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Failed — try again';
        btn.style.background = 'linear-gradient(135deg, #ff5252, #d50000)';

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }
    });
  }

  // ---------- Newsletter Form ----------
  const newsletterForm = document.querySelector('.footer-newsletter form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const btn = newsletterForm.querySelector('button');
      const originalHtml = btn.innerHTML;

      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      btn.disabled = true;

      try {
        const data = new FormData(newsletterForm);
        const response = await fetch(newsletterForm.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          btn.innerHTML = '<i class="fa-solid fa-check"></i>';
          btn.style.background = 'linear-gradient(135deg, #00e676, #00c853)';
          if (input) input.value = '';

          setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.background = '';
            btn.disabled = false;
          }, 2500);
        } else {
          throw new Error('Formspree error');
        }
      } catch (err) {
        btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        btn.style.background = 'linear-gradient(135deg, #ff5252, #d50000)';

        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.style.background = '';
          btn.disabled = false;
        }, 2500);
      }
    });
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 72;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ---------- Hero Parallax ----------
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && window.innerWidth > 992) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 4;
      const y = (e.clientY / window.innerHeight - 0.5) * 4;
      heroContent.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ---------- Active Nav Link ----------
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });

  // ---------- Resize handler ----------
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ---------- Console Branding ----------
  console.log(
    '%c Arthanta %c v2.0 ',
    'background: linear-gradient(135deg, #6366F1, #4F46E5); color: #fff; font-size: 1.1rem; font-weight: bold; padding: 6px 12px; border-radius: 4px 0 0 4px;',
    'background: #172033; color: #9494b8; font-size: 1.1rem; font-weight: bold; padding: 6px 12px; border-radius: 0 4px 4px 0;'
  );
  console.log(
    '%c Built with precision in India. Let\'s build something great together.',
    'color: #6b6b8d; font-size: 0.8rem;'
  );

});
