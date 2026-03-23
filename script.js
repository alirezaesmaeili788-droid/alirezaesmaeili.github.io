// Entry point: Daten laden und UI rendern
document.addEventListener('DOMContentLoaded', () => {
  if (!window.PortfolioStore) {
    return;
  }

  const data = window.PortfolioStore.getPortfolioData();
  renderPortfolio(data);
  setupSkillAnimation();
});

let ticking = false;

// Leichter Parallax-Effekt für den Hintergrund
function updateParallax() {
  const scrolled = window.pageYOffset;
  const rate = scrolled * 0.3;

  document.body.style.setProperty('--scroll-y', `${rate}px`);

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
});

function renderPortfolio(data) {
  setText('site-logo-text', data.profileName);
  renderHeroImage(data.heroImage);
  setText('hero-title', data.heroTitle);
  setText('hero-text', data.heroText);

  renderAbout(data.about);
  renderProjects(data.projects);
  renderSkills(data.skills);
  renderLanguages(data.languages);
  renderContact(data);
  renderFooter(data.footer);
}

// Projekte rendern (inkl. Bild, Tags und externem/internem Link)
function renderProjects(projects) {
  const container = document.getElementById('projects-grid');
  if (!container) {
    return;
  }

  container.innerHTML = projects
    .map((project) => {
      const imageHtml = project.image
        ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}">`
        : '';
      const tags = Array.isArray(project.tags) ? project.tags : [];
      const tagsHtml = tags.length
        ? `<div class="project-tags">${tags.map((tag) => `<span class="project-tag">${escapeHtml(tag)}</span>`).join('')}</div>`
        : '';
      const projectLink = normalizeProjectLink(project.link);
      const isExternal = /^https?:\/\//i.test(projectLink);
      const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';

      return `
        <a class="project-card-link" href="${escapeHtml(projectLink)}"${targetAttr}>
          <article class="project-card">
            <div class="project-image">${imageHtml}</div>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.description)}</p>
            ${tagsHtml}
          </article>
        </a>
      `;
    })
    .join('');
}

  // Link absichern: leere oder javascript:-Links blockieren
function normalizeProjectLink(link) {
  if (typeof link !== 'string') {
    return '#';
  }

  const cleaned = link.trim();
  if (!cleaned) {
    return '#';
  }

  if (/^javascript:/i.test(cleaned)) {
    return '#';
  }

  return cleaned;
}

// Skills rendern und Layout je nach Anzahl anpassen
function renderSkills(skills) {
  const container = document.getElementById('skills-graph');
  if (!container) {
    return;
  }

  container.classList.remove('skills-graph--three-columns');
  const rowsInTwoColumns = Math.ceil(skills.length / 2);
  if (rowsInTwoColumns > 4) {
    container.classList.add('skills-graph--three-columns');
  }

  container.innerHTML = skills
    .map((skill) => {
      const rating = window.PortfolioStore.clampRating(skill.rating);
      const level = window.PortfolioStore.getSkillLevelLabel(rating);
      const blocks = createSkillBlocksHtml(rating);

      return `
        <div class="skill-bar">
          <div class="skill-name">${escapeHtml(skill.name)}</div>
          <div class="skill-level-tag">${escapeHtml(level)} </div>
          <div class="skill-blocks" data-rating="${rating}">
            ${blocks}
          </div>
        </div>
      `;
    })
    .join('');
}

// Sprachen rendern
function renderLanguages(languages) {
  const container = document.getElementById('languages-grid');
  if (!container) {
    return;
  }

  container.innerHTML = languages
    .map((language) => {
      return `
        <div class="language-card">
          <h4>${escapeHtml(language.name)}</h4>
          <p class="language-level">${escapeHtml(language.level)}</p>
        </div>
      `;
    })
    .join('');
}

// Kontaktbereich rendern
function renderContact(data) {
  setText('contact-intro', data.contactIntro);

  const email = data.contact.email;
  const phone = data.contact.phone;
  const address = data.contact.address;

  setLinkTextAndHref('contact-email', email, `mailto:${email}`);
  setLinkTextAndHref('contact-phone', phone, `tel:${phone}`);
  setText('contact-address', address);
}

// Footer rendern
function renderFooter(footer) {
  setText('footer-copyright', `© ${footer.copyrightYear} ${footer.fullName}. Alle Rechte vorbehalten.`);
}

// Hero + Nav Logo Bild setzen
function renderHeroImage(imageUrl) {
  const imageElement = document.getElementById('hero-profile-image');
  const navLogoImage = document.getElementById('nav-logo-image');
  const fallbackImage = 'images/ali.png';
  const normalizedImage = typeof imageUrl === 'string' ? imageUrl.trim().replace(/\\/g, '/') : '';
  const isOversizedDataImage = /^data:image\//i.test(normalizedImage) && normalizedImage.length > 500000;
  const finalImage = !normalizedImage || isOversizedDataImage ? fallbackImage : normalizedImage;

  if (!imageElement) {
    return;
  }

  imageElement.onerror = () => {
    imageElement.onerror = null;
    imageElement.src = fallbackImage;
  };
  imageElement.src = finalImage;

  if (navLogoImage) {
    navLogoImage.onerror = () => {
      navLogoImage.onerror = null;
      navLogoImage.src = fallbackImage;
    };
    navLogoImage.src = finalImage;
  }
}

// About-Bereich mit Tabs rendern
function renderAbout(aboutData) {
  const educationContainer = document.getElementById('about-education-container');
  const careerContainer = document.getElementById('about-career-container');
  const personalContainer = document.getElementById('about-personal-container');

  if (!educationContainer || !careerContainer || !personalContainer) {
    return;
  }

  educationContainer.innerHTML = (aboutData.education || [])
    .map((item) => {
      return `
        <div class="about-item">
          <h3>${escapeHtml(item.title)}</h3>
          ${item.date ? `<p class="about-date">${escapeHtml(item.date)}</p>` : ''}
          <p class="section-text">${escapeHtml(item.description).replace(/\n/g, '<br>')}</p>
        </div>
      `;
    })
    .join('');

  careerContainer.innerHTML = (aboutData.career || [])
    .map((item) => {
      const companyDate = [item.company, item.date].filter(Boolean).join(' | ');
      return `
        <div class="about-item">
          <h3>${escapeHtml(item.title)}</h3>
          ${companyDate ? `<p class="about-date">${escapeHtml(companyDate)}</p>` : ''}
          <p class="section-text">${escapeHtml(item.description).replace(/\n/g, '<br>')}</p>
        </div>
      `;
    })
    .join('');

  const personalInfo = aboutData.personalInfo || {};
  const personalHtml = [
    personalInfo.birthDate ? createPersonalInfoLine('birth', personalInfo.birthDate) : '',
    personalInfo.location ? createPersonalInfoLine('location', personalInfo.location) : '',
    personalInfo.phoneNumber ? createPersonalInfoLine('phone', personalInfo.phoneNumber) : '',
    personalInfo.email ? createPersonalInfoLine('email', personalInfo.email) : '',
    personalInfo.maritalStatus ? createPersonalInfoLine('marital', personalInfo.maritalStatus) : '',
    personalInfo.drivingLicense ? createPersonalInfoLine('license', personalInfo.drivingLicense) : '',
    personalInfo.additionalInfo ? createPersonalInfoLine('info', personalInfo.additionalInfo) : ''
  ]
    .filter(Boolean)
    .join('');

  if (personalHtml) {
    personalContainer.innerHTML = `
      <div class="about-item">
        <h3 class="personal-info-title"><span class="personal-info-icon" aria-hidden="true">•</span>Persönliche Infos</h3>
        <div class="personal-info-text">
          ${personalHtml}
        </div>
      </div>
    `;
  } else {
    personalContainer.innerHTML = '<p class="section-text">Keine persönlichen Infos verfügbar.</p>';
  }

  initAboutTabs();
}

// Tab-Navigation für About-Bereich initialisieren
function initAboutTabs() {
  const tabsRoot = document.getElementById('about-tabs');
  if (!tabsRoot) {
    return;
  }

  if (tabsRoot.dataset.initialized === 'true') {
    return;
  }

  const buttons = Array.from(tabsRoot.querySelectorAll('[data-about-tab]'));
  const panels = Array.from(tabsRoot.querySelectorAll('[data-about-panel]'));

  const activateTab = (tabName) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.aboutTab === tabName;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.aboutPanel === tabName;
      panel.classList.toggle('active', isActive);
      panel.hidden = !isActive;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      activateTab(button.dataset.aboutTab);
    });
  });

  tabsRoot.dataset.initialized = 'true';
  activateTab('personal');
}

// Eine persönliche Info-Zeile (Icon + Text)
function createPersonalInfoLine(type, text) {
  return `
    <p class="personal-info-line">
      <span class="personal-line-icon" aria-hidden="true">
        ${getPersonalInfoSvg(type)}
      </span>
      <span>${escapeHtml(text)}</span>
    </p>
  `;
}

// Inline-SVG je nach Typ
function getPersonalInfoSvg(type) {
  if (type === 'birth') {
    return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 4V8M16 4V8M4 10H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  }

  if (type === 'location') {
    return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21C12 21 18 15.6 18 10.5C18 7.46 15.31 5 12 5C8.69 5 6 7.46 6 10.5C6 15.6 12 21 12 21Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10.5" r="2" stroke="currentColor" stroke-width="1.8"/></svg>';
  }

  if (type === 'phone') {
    return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.2 5.5H9.9L11.2 8.7L9.7 10.2C10.6 11.9 12.1 13.4 13.8 14.3L15.3 12.8L18.5 14.1V16.8C18.5 17.4 18 17.9 17.4 17.9C11.9 17.9 6.1 12.1 6.1 6.6C6.1 6 6.6 5.5 7.2 5.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  }

  if (type === 'email') {
    return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6.5" width="16" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M5 8L12 13L19 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  if (type === 'marital') {
    return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 19S5.5 14.8 5.5 10.1C5.5 8.1 7.1 6.5 9.1 6.5C10.3 6.5 11.4 7.1 12 8C12.6 7.1 13.7 6.5 14.9 6.5C16.9 6.5 18.5 8.1 18.5 10.1C18.5 14.8 12 19 12 19Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
  }

  if (type === 'license') {
    return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="7" width="16" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="12" r="1.4" stroke="currentColor" stroke-width="1.4"/><path d="M12 10.5H16.5M12 13.5H16.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  }

  return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8"/><path d="M12 11.3V16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="8.4" r="0.9" fill="currentColor"/></svg>';
}

// Skill-Balken beim Scrollen animieren
function setupSkillAnimation() {
  const skillBars = document.querySelectorAll('.skill-bar');
  if (!skillBars.length) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const skillBlocks = entry.target.querySelector('.skill-blocks');
      const rating = Number.parseInt(skillBlocks.dataset.rating, 10);
      const blocks = skillBlocks.querySelectorAll('.block');

      if (entry.isIntersecting) {
        animateBlocks(blocks, rating);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  skillBars.forEach((bar) => observer.observe(bar));
}

function animateBlocks(blocks, rating) {
  const delayPerBlock = 400;

  blocks.forEach((block, index) => {
    if (index < rating) {
      setTimeout(() => {
        block.classList.add('active');
      }, delayPerBlock * (index + 1));
    }
  });
}

// 5 Blöcke für Skill-Anzeige erzeugen
function createSkillBlocksHtml() {
  return new Array(5)
    .fill('<div class="block"></div>')
    .join('');
}

// Text in ein Element setzen
function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

// Linktext + href setzen
function setLinkTextAndHref(id, text, href) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  element.textContent = text;
  element.setAttribute('href', href);
}

// Utility: HTML escapen
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
