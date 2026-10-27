/**
 * APP.JS - Main Application Controller
 * Handles UI interactions, custom cursor, modals, GSAP triggers, project filtering, and sound FX.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize Lucide Icons Safely & Robustly
  function refreshIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }
  refreshIcons();

  // 1.1 Header Scroll Effect & Active Section Spy
  const mainHeader = document.getElementById('main-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  function handleHeaderScrollSpy() {
    const scrollY = window.scrollY;

    // Header background intensity
    if (mainHeader) {
      if (scrollY > 50) {
        mainHeader.style.background = 'rgba(6, 9, 17, 0.92)';
        mainHeader.style.borderBottomColor = 'rgba(0, 240, 255, 0.25)';
        mainHeader.style.boxShadow = '0 12px 35px -5px rgba(0, 0, 0, 0.8)';
      } else {
        mainHeader.style.background = 'rgba(6, 9, 17, 0.82)';
        mainHeader.style.borderBottomColor = 'rgba(0, 240, 255, 0.15)';
        mainHeader.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.7)';
      }
    }

    // Scroll Spy for Nav Links
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleHeaderScrollSpy, { passive: true });
  handleHeaderScrollSpy();

  // 2. Custom Magnetic Glow Cursor
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('cursor-follower');

  if (cursor && follower && window.innerWidth > 768) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function renderFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      requestAnimationFrame(renderFollower);
    }
    renderFollower();

    // Hover effect for interactive elements
    const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .pos-item-card, .btn-geo, .lab-tab');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        if (el.getAttribute('data-sound') === 'hover' && window.soundEngine) {
          window.soundEngine.playHover();
        }
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
      el.addEventListener('click', () => {
        if (el.getAttribute('data-sound') === 'click' && window.soundEngine) {
          window.soundEngine.playClick();
        }
      });
    });
  }

  // 3. Audio Toggle Switch
  const soundToggle = document.getElementById('sound-toggle');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (window.soundEngine) {
        const isEnabled = window.soundEngine.toggle();
        if (isEnabled) {
          soundIconOn.classList.remove('hidden');
          soundIconOff.classList.add('hidden');
          document.body.classList.add('audio-active');
          window.soundEngine.playClick();
        } else {
          soundIconOn.classList.add('hidden');
          soundIconOff.classList.remove('hidden');
          document.body.classList.remove('audio-active');
        }
      }
    });
  }

  // 4. Dynamic Headline Typewriter Effect
  const headlineEl = document.getElementById('dynamic-headline');
  if (headlineEl) {
    const roles = [
      "Scalable Frontend Systems",
      "Reactive Angular Architectures",
      "High-Performance Next.js Apps",
      "Immersive 3D WebGL Experiences",
      "Decoupled Enterprise Portals"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        headlineEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        headlineEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 1800; // Pause at end of text
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(typeEffect, typingSpeed);
    }
    typeEffect();
  }

  // 5. Animated Metrics HUD Counter on Scroll
  const hudNumbers = document.querySelectorAll('.hud-number');
  let animatedHUD = false;

  const hudObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedHUD) {
        animatedHUD = true;
        hudNumbers.forEach(num => {
          const target = parseInt(num.getAttribute('data-target'), 10);
          let count = 0;
          const increment = Math.ceil(target / 40) || 1;
          const interval = setInterval(() => {
            count += increment;
            if (count >= target) {
              num.textContent = target;
              clearInterval(interval);
            } else {
              num.textContent = count;
            }
          }, 35);
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsCard = document.querySelector('.metrics-hud-card');
  if (metricsCard) hudObserver.observe(metricsCard);

  // 6. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // 7. Projects Grid Rendering & Filtering
  const projectsContainer = document.getElementById('projects-container');
  const filterButtons = document.querySelectorAll('.filter-btn');

  function renderProjects(filter = 'all') {
    if (!projectsContainer || !window.projectsData) return;
    projectsContainer.innerHTML = '';

    const filtered = filter === 'all' 
      ? window.projectsData 
      : window.projectsData.filter(p => p.category === filter || (filter === 'fullstack' && p.category === 'fullstack'));

    filtered.forEach(project => {
      const card = document.createElement('div');
      card.className = 'glass-card project-card';
      
      const techTagsHtml = project.tech.map(t => `<span class="p-tag">${t}</span>`).join('');
      const highlightsHtml = project.impact.slice(0, 2).map(imp => `
        <div class="highlight-row">
          <i data-lucide="check-circle-2"></i>
          <span>${imp}</span>
        </div>
      `).join('');

      card.innerHTML = `
        <div>
          <div class="project-card-header">
            <span class="project-category-tag">${project.categoryLabel}</span>
            <div class="project-links-row">
              ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn-card-icon" title="View Source Code"><i data-lucide="github"></i></a>` : ''}
              <button class="btn-card-icon open-case-study" data-id="${project.id}" title="Deep Case Study"><i data-lucide="external-link"></i></button>
            </div>
          </div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-highlights-box">
            ${highlightsHtml}
          </div>
        </div>

        <div>
          <div class="project-tech-tags">
            ${techTagsHtml}
          </div>
          <button class="btn-view-case-study open-case-study" data-id="${project.id}">
            <i data-lucide="layers"></i>
            <span>Architecture & Case Study</span>
          </button>
        </div>
      `;

      projectsContainer.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Attach case study modal triggers
    document.querySelectorAll('.open-case-study').forEach(btn => {
      btn.addEventListener('click', () => {
        const projId = btn.getAttribute('data-id');
        openProjectModal(projId);
      });
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderProjects(filter);
      if (window.soundEngine) window.soundEngine.playClick();
    });
  });

  renderProjects('all');

  // 8. Project Detail Modal Controller
  const projectModal = document.getElementById('project-modal');
  const projectModalBody = document.getElementById('project-modal-body');
  const closeProjectModalBtn = document.getElementById('close-project-modal');

  function openProjectModal(projectId) {
    const project = window.projectsData.find(p => p.id === projectId);
    if (!project || !projectModal || !projectModalBody) return;

    const impactList = project.impact.map(i => `<li><i data-lucide="check-circle" class="text-cyan"></i> <span>${i}</span></li>`).join('');
    const techPills = project.tech.map(t => `<span class="badge-chip">${t}</span>`).join('');

    projectModalBody.innerHTML = `
      <div class="modal-header">
        <div>
          <span class="role-badge">${project.categoryLabel}</span>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff; margin-top: 6px;">${project.title}</h2>
          <p style="color: var(--cyan-soft); font-size: 0.95rem; margin-top: 2px;"><strong>Company/Context:</strong> ${project.company} &bull; <strong>Role:</strong> ${project.role}</p>
        </div>
      </div>

      <div style="margin: 20px 0; color: var(--text-body); font-size: 1rem; line-height: 1.7;">
        <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 8px;">Architecture Overview</h4>
        <p>${project.description}</p>
      </div>

      <div style="margin: 20px 0;">
        <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 12px;">Key Accomplishments & Impact Metrics</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.95rem; color: var(--text-body);">
          ${impactList}
        </ul>
      </div>

      <div style="margin: 20px 0;">
        <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 10px;">Tech Stack & Paradigms</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${techPills}
        </div>
      </div>

      <div class="modal-footer" style="padding-top: 14px; border-top: 1px solid var(--border-subtle);">
        ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn-primary-glow"><i data-lucide="github"></i> View GitHub Repo</a>` : ''}
        <a href="#contact" class="btn-outline-glow" onclick="document.getElementById('project-modal').classList.add('hidden')"><i data-lucide="message-square"></i> Inquire About Architecture</a>
      </div>
    `;

    if (typeof lucide !== 'undefined') lucide.createIcons();
    projectModal.classList.remove('hidden');
    if (window.soundEngine) window.soundEngine.playClick();
  }

  if (closeProjectModalBtn) {
    closeProjectModalBtn.addEventListener('click', () => {
      projectModal.classList.add('hidden');
    });
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) projectModal.classList.add('hidden');
    });
  }

  // 9. CV Modal Controller
  const cvModal = document.getElementById('cv-modal');
  const openCvBtn = document.getElementById('open-cv-btn');
  const closeCvModalBtn = document.getElementById('close-cv-modal');
  const copyEmailCvBtn = document.getElementById('copy-email-cv-modal');

  if (openCvBtn && cvModal) {
    openCvBtn.addEventListener('click', () => {
      cvModal.classList.remove('hidden');
    });
  }

  if (closeCvModalBtn && cvModal) {
    closeCvModalBtn.addEventListener('click', () => {
      cvModal.classList.add('hidden');
    });
  }

  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) cvModal.classList.add('hidden');
    });
  }

  if (copyEmailCvBtn) {
    copyEmailCvBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('ali.sdarwish97@gmail.com');
      copyEmailCvBtn.innerHTML = '<i data-lucide="check"></i> <span>Copied!</span>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      if (window.soundEngine) window.soundEngine.playSuccess();
      setTimeout(() => {
        copyEmailCvBtn.innerHTML = '<i data-lucide="mail"></i> <span>Copy Email Address</span>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 2000);
    });
  }

  // 10. Copy-to-Clipboard Buttons
  document.querySelectorAll('.btn-copy-mini').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        btn.innerHTML = '<i data-lucide="check" class="text-green"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        if (window.soundEngine) window.soundEngine.playSuccess();
        setTimeout(() => {
          btn.innerHTML = '<i data-lucide="copy"></i>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 2000);
      }
    });
  });

  // 11. Contact Form Submission Handling
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitContactBtn = document.getElementById('submit-contact-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('user-name').value;
      const email = document.getElementById('user-email').value;
      const type = document.getElementById('project-type').value;
      const message = document.getElementById('user-message').value;

      if (!name || !email || !message) return;

      if (submitContactBtn) {
        submitContactBtn.disabled = true;
        submitContactBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> <span>Encrypting & Dispatching...</span>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }

      setTimeout(() => {
        if (window.confetti) {
          window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        }
        if (window.soundEngine) window.soundEngine.playSuccess();

        if (formFeedback) {
          formFeedback.className = 'form-feedback success';
          formFeedback.innerHTML = `<strong>Thank you, ${name}!</strong> Your inquiry regarding <em>${type}</em> has been logged. Ali will respond to <strong>${email}</strong> shortly.`;
          formFeedback.classList.remove('hidden');
        }

        contactForm.reset();
        if (submitContactBtn) {
          submitContactBtn.disabled = false;
          submitContactBtn.innerHTML = '<i data-lucide="check"></i> <span>Message Sent Successfully</span>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
          setTimeout(() => {
            submitContactBtn.innerHTML = '<i data-lucide="send"></i> <span>Send Another Message</span>';
            if (typeof lucide !== 'undefined') lucide.createIcons();
          }, 3000);
        }
      }, 1000);
    });
  }

});
