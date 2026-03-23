const ADMIN_ACCESS_SESSION_KEY = 'adminUnlockedV1';
const ADMIN_PASSWORD_HASH = '300559cc7b065e2fb01703e3e993a49593da8cf6599663c33d6d06d7a62ce42d';

// Globaler Admin-State
let selectedHeroImage = 'images/ali.png';
let currentProjects = [];
let editingProjectIndex = null;
let selectedProjectImage = '';
let currentSkills = [];
let editingSkillIndex = null;
let currentEducation = [];
let currentCareer = [];
let editingEducationIndex = null;
let editingCareerIndex = null;
let currentPersonalInfo = [];
let editingPersonalInfoIndex = null;

const PERSONAL_INFO_FIELDS = [
  { key: 'birthDate', label: 'Geburtsdatum' },
  { key: 'location', label: 'Ort/Stadt' },
  { key: 'phoneNumber', label: 'Telefonnummer' },
  { key: 'email', label: 'E-Mail' },
  { key: 'maritalStatus', label: 'Familienstand' },
  { key: 'drivingLicense', label: 'Führerschein' },
  { key: 'additionalInfo', label: 'Zusätzliche Info' }
];

// App-Initialisierung
document.addEventListener('DOMContentLoaded', async () => {
  if (!window.PortfolioStore) {
    return;
  }

  const hasAccess = await ensureAdminAccess();
  if (!hasAccess) {
    window.location.href = 'Index.html';
    return;
  }

  const form = document.getElementById('admin-form');
  const status = document.getElementById('status');
  const resetButton = document.getElementById('reset-defaults');
  const imageInput = document.getElementById('heroImageUpload');
  const removeImageButton = document.getElementById('remove-hero-image');

  fillForm(window.PortfolioStore.getPortfolioData());
  initProjectManager();
  initSkillManager();
  initEducationManager();
  initCareerManager();
  initPersonalInfoManager();

  imageInput.addEventListener('change', async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      showStatus('Bitte nur Bilddateien hochladen.', true);
      imageInput.value = '';
      return;
    }

    if (file.size > 2_500_000) {
      showStatus('Bild ist zu groß (max. 2.5 MB).', true);
      imageInput.value = '';
      return;
    }

    try {
      selectedHeroImage = await readFileAsDataUrl(file);
      updateHeroImagePreview(selectedHeroImage);
      showStatus('Bild ausgewählt. Bitte auf Speichern klicken.');
    } catch (error) {
      showStatus('Bild konnte nicht geladen werden.', true);
    }
  });

  removeImageButton.addEventListener('click', () => {
    selectedHeroImage = 'images/ali.png';
    imageInput.value = '';
    updateHeroImagePreview(selectedHeroImage);
    showStatus('Bild zurückgesetzt. Bitte auf Speichern klicken.');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    try {
      const data = collectFormData();
      window.PortfolioStore.savePortfolioData(data);
      showStatus('Gespeichert. Änderungen sind auf der Portfolio-Seite sichtbar.');
    } catch (error) {
      showStatus(error.message, true);
    }
  });

  resetButton.addEventListener('click', () => {
    const defaults = window.PortfolioStore.resetPortfolioData();
    fillForm(defaults);
    imageInput.value = '';
    renderProjectsList();
    renderSkillsList();
    renderEducationList();
    renderCareerList();
    renderPersonalInfoList();
    showStatus('Auf Standarddaten zurückgesetzt.');
  });

  function showStatus(message, isError) {
    status.textContent = message;
    status.style.color = isError ? '#cc2f2f' : 'var(--accent)';
  }
});

async function ensureAdminAccess() {
  if (sessionStorage.getItem(ADMIN_ACCESS_SESSION_KEY) === 'true') {
    return true;
  }

  const password = window.prompt('Admin Passwort eingeben:');
  if (!password) {
    return false;
  }

  const hash = await sha256(password);
  const isValid = hash === ADMIN_PASSWORD_HASH;

  if (isValid) {
    sessionStorage.setItem(ADMIN_ACCESS_SESSION_KEY, 'true');
    return true;
  }

  window.alert('Falsches Passwort. Zugriff verweigert.');
  return false;
}

// Utility: SHA-256 für Passwortvergleich
async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hashArray = Array.from(new Uint8Array(digest));

  return hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

// Formular mit gespeicherten Daten füllen
function fillForm(data) {
  setValue('profileName', data.profileName);
  setValue('heroTitle', data.heroTitle);
  setValue('heroText', data.heroText);
  selectedHeroImage = data.heroImage || 'images/ali.png';
  updateHeroImagePreview(selectedHeroImage);

  currentProjects = data.projects.map((item) => ({
    title: item.title || '',
    description: item.description || '',
    image: item.image || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    link: item.link || '#'
  }));
  currentSkills = data.skills.map((item) => ({ name: item.name, rating: item.rating }));
  setValue('languages', data.languages.map((item) => `${item.name} | ${item.level}`).join('\n'));

  const aboutData = data.about || {};
  currentEducation = (aboutData.education || []).map((item) => ({
    title: item.title || '',
    date: item.date || '',
    description: item.description || ''
  }));

  currentCareer = (aboutData.career || []).map((item) => ({
    title: item.title || '',
    company: item.company || '',
    date: item.date || '',
    description: item.description || ''
  }));

  const personalInfo = aboutData.personalInfo || {};
  currentPersonalInfo = PERSONAL_INFO_FIELDS
    .map((field) => ({
      type: field.key,
      value: (personalInfo[field.key] || '').trim()
    }))
    .filter((item) => item.value);

  setValue('contactIntro', data.contactIntro);
  setValue('contactEmail', data.contact.email);
  setValue('contactPhone', data.contact.phone);
  setValue('contactAddress', data.contact.address);

  setValue('footerFullName', data.footer.fullName);
  setValue('footerDescription', data.footer.description);
  setValue('footerBirthDate', data.footer.birthDate);
  setValue('footerCity', data.footer.city);
  setValue('footerYear', data.footer.copyrightYear);

  renderProjectsList();
  renderSkillsList();
  renderEducationList();
  renderCareerList();
  renderPersonalInfoList();
}

// Formular in persistierbares Datenobjekt umwandeln
function collectFormData() {
  if (!currentProjects.length) {
    throw new Error('Bitte mindestens ein Projekt hinzufügen.');
  }

  const languages = parseLinePairs(getValue('languages'), 'Sprachen').map((item) => ({
    name: item.left,
    level: item.right
  }));

  return {
    profileName: getValue('profileName'),
    heroImage: selectedHeroImage,
    heroTitle: getValue('heroTitle'),
    heroText: getValue('heroText'),
    about: {
      education: currentEducation,
      career: currentCareer,
      personalInfo: buildPersonalInfoObject(currentPersonalInfo)
    },
    projects: currentProjects,
    skills: currentSkills,
    languages,
    contactIntro: getValue('contactIntro'),
    contact: {
      email: getValue('contactEmail'),
      phone: getValue('contactPhone'),
      address: getValue('contactAddress')
    },
    footer: {
      fullName: getValue('footerFullName'),
      description: getValue('footerDescription'),
      birthDate: getValue('footerBirthDate'),
      city: getValue('footerCity'),
      copyrightYear: getValue('footerYear')
    }
  };
}

// Utility: Zeilen mit "Titel | Wert" parsen (für Sprachen)
function parseLinePairs(raw, label) {
  const rows = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (!rows.length) {
    throw new Error(`${label} dürfen nicht leer sein.`);
  }

  return rows.map((line) => {
    const parts = line.split('|').map((part) => part.trim());
    if (parts.length < 2 || !parts[0] || !parts[1]) {
      throw new Error(`${label}: Jede Zeile muss "Titel | Text" haben.`);
    }

    return {
      left: parts[0],
      right: parts.slice(1).join(' | ')
    };
  });
}

// Utility: DOM value helper
function getValue(id) {
  const element = document.getElementById(id);
  return element.value.trim();
}

// Utility: DOM value setter
function setValue(id, value) {
  const element = document.getElementById(id);
  element.value = value;
}

// Hero Bild Vorschau aktualisieren
function updateHeroImagePreview(imageSrc) {
  const preview = document.getElementById('heroImagePreview');
  if (!preview) {
    return;
  }

  preview.src = imageSrc || 'images/ali.png';
}

// Datei als Base64 DataURL einlesen
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'));
    reader.readAsDataURL(file);
  });
}

// Projekte Manager (Add/Edit/Delete + Bild + Tags + Link)
function initProjectManager() {
  const titleInput = document.getElementById('projectTitle');
  const descriptionInput = document.getElementById('projectDescription');
  const tagsInput = document.getElementById('projectTags');
  const linkInput = document.getElementById('projectLink');
  const addButton = document.getElementById('add-project-btn');
  const imageInput = document.getElementById('projectImageUpload');
  const removeImageButton = document.getElementById('remove-project-image');

  if (!titleInput || !descriptionInput || !tagsInput || !linkInput || !addButton || !imageInput || !removeImageButton) {
    return;
  }

  if (addButton.dataset.initialized === 'true') {
    return;
  }

  addButton.dataset.initialized = 'true';

  titleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });

  tagsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });

  linkInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });

  imageInput.addEventListener('change', async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Bitte nur Bilddateien hochladen.');
      imageInput.value = '';
      return;
    }

    if (file.size > 2_500_000) {
      alert('Bild ist zu groß (max. 2.5 MB).');
      imageInput.value = '';
      return;
    }

    try {
      selectedProjectImage = await readFileAsDataUrl(file);
      updateProjectImagePreview(selectedProjectImage);
    } catch (error) {
      alert('Bild konnte nicht geladen werden.');
    }
  });

  removeImageButton.addEventListener('click', () => {
    selectedProjectImage = '';
    imageInput.value = '';
    updateProjectImagePreview('');
  });

  addButton.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const tags = parseProjectTags(tagsInput.value);
    const link = sanitizeProjectLink(linkInput.value);

    if (!title || !description) {
      alert('Bitte Titel und Beschreibung für das Projekt eingeben.');
      return;
    }

    const item = {
      title,
      description,
      image: selectedProjectImage || '',
      tags,
      link: link || '#'
    };

    if (editingProjectIndex !== null) {
      currentProjects[editingProjectIndex] = item;
      editingProjectIndex = null;
    } else {
      currentProjects.push(item);
    }

    titleInput.value = '';
    descriptionInput.value = '';
    tagsInput.value = '';
    linkInput.value = '';
    imageInput.value = '';
    selectedProjectImage = '';
    updateProjectImagePreview('');
    addButton.textContent = 'Projekt hinzufügen';
    titleInput.focus();

    renderProjectsList();
  });

  renderProjectsList();
}

// Projekte Liste rendern
function renderProjectsList() {
  const list = document.getElementById('projectsList');
  const addButton = document.getElementById('add-project-btn');

  if (!list) {
    return;
  }

  if (editingProjectIndex !== null && !currentProjects[editingProjectIndex]) {
    editingProjectIndex = null;
  }

  if (addButton) {
    addButton.textContent = editingProjectIndex === null ? 'Projekt hinzufügen' : 'Projekt aktualisieren';
  }

  if (!currentProjects.length) {
    list.innerHTML = '<p class="hint">Noch kein Projekt hinzugefügt.</p>';
    return;
  }

  list.innerHTML = currentProjects
    .map((item, index) => `
      <div class="entry-item">
        <div class="entry-item-header">
          <div>
            <div class="entry-item-title">${escapeHtml(item.title)}</div>
            <div class="entry-item-meta">${escapeHtml(item.link || '#')}</div>
          </div>
          <div class="entry-item-actions">
            <button type="button" class="skill-item-btn" data-project-action="edit" data-index="${index}">Bearbeiten</button>
            <button type="button" class="skill-item-btn delete" data-project-action="delete" data-index="${index}">Löschen</button>
          </div>
        </div>
        ${item.image ? `<img class="entry-item-project-thumb" src="${escapeHtml(item.image)}" alt="Projektbild">` : ''}
        ${(item.tags || []).length ? `<div class="entry-tags">${item.tags.map((tag) => `<span class="entry-tag">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
        <div class="entry-item-text">${escapeHtml(item.description).replace(/\n/g, '<br>')}</div>
      </div>
    `)
    .join('');

  list.querySelectorAll('[data-project-action="delete"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = Number.parseInt(event.target.dataset.index, 10);
      currentProjects.splice(index, 1);
      renderProjectsList();
    });
  });

  list.querySelectorAll('[data-project-action="edit"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = Number.parseInt(event.target.dataset.index, 10);
      const item = currentProjects[index];

      const titleInput = document.getElementById('projectTitle');
      const descriptionInput = document.getElementById('projectDescription');
      const tagsInput = document.getElementById('projectTags');
      const linkInput = document.getElementById('projectLink');
      const imageInput = document.getElementById('projectImageUpload');
      const addButton = document.getElementById('add-project-btn');

      titleInput.value = item.title;
      descriptionInput.value = item.description;
      tagsInput.value = (item.tags || []).join(', ');
      linkInput.value = item.link || '#';
      selectedProjectImage = item.image || '';
      imageInput.value = '';
      updateProjectImagePreview(selectedProjectImage);
      editingProjectIndex = index;
      addButton.textContent = 'Projekt aktualisieren';
      titleInput.focus();
    });
  });
}

// Projektbild Vorschau aktualisieren
function updateProjectImagePreview(imageSrc) {
  const preview = document.getElementById('projectImagePreview');
  if (!preview) {
    return;
  }

  if (imageSrc) {
    preview.src = imageSrc;
    preview.classList.add('has-image');
  } else {
    preview.src = '';
    preview.classList.remove('has-image');
  }
}

// Kommagetrennte Tags normalisieren und deduplizieren
function parseProjectTags(raw) {
  if (!raw || !raw.trim()) {
    return [];
  }

  const uniqueTags = new Set();

  raw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .forEach((tag) => {
      uniqueTags.add(tag);
    });

  return Array.from(uniqueTags);
}

// Projeklink normalisieren (kein javascript: zulassen)
function sanitizeProjectLink(raw) {
  const value = String(raw || '').trim();
  if (!value || /^javascript:/i.test(value)) {
    return '';
  }

  return value;
}

// Skills Manager
function initSkillManager() {
  const skillNameInput = document.getElementById('skillName');
  const skillRatingInput = document.getElementById('skillRating');
  const skillRatingDisplay = document.getElementById('skillRatingDisplay');
  const addSkillBtn = document.getElementById('add-skill-btn');

  if (!skillNameInput || !skillRatingInput || !skillRatingDisplay || !addSkillBtn) {
    return;
  }

  if (addSkillBtn.dataset.initialized === 'true') {
    return;
  }

  addSkillBtn.dataset.initialized = 'true';

  skillRatingInput.addEventListener('input', () => {
    skillRatingDisplay.textContent = `${skillRatingInput.value}/5`;
    skillRatingInput.style.setProperty('--value', skillRatingInput.value);
  });

  addSkillBtn.addEventListener('click', () => {
    const name = skillNameInput.value.trim();
    const rating = parseInt(skillRatingInput.value, 10);

    if (!name) {
      alert('Bitte einen Skill-Namen eingeben.');
      return;
    }

    const updatedSkill = {
      name,
      rating: window.PortfolioStore.clampRating(rating)
    };

    if (editingSkillIndex !== null) {
      currentSkills[editingSkillIndex] = updatedSkill;
      editingSkillIndex = null;
      addSkillBtn.textContent = 'Skill hinzufügen';
    } else {
      currentSkills.push(updatedSkill);
    }

    skillNameInput.value = '';
    skillRatingInput.value = '3';
    skillRatingDisplay.textContent = '3/5';
    skillRatingInput.style.setProperty('--value', '3');
    skillNameInput.focus();

    renderSkillsList();
  });

  renderSkillsList();
}

// Ausbildung Manager
function initEducationManager() {
  const titleInput = document.getElementById('educationTitle');
  const dateInput = document.getElementById('educationDate');
  const descriptionInput = document.getElementById('educationDescription');
  const addButton = document.getElementById('add-education-btn');

  if (!titleInput || !dateInput || !descriptionInput || !addButton) {
    return;
  }

  if (addButton.dataset.initialized === 'true') {
    return;
  }

  addButton.dataset.initialized = 'true';

  [titleInput, dateInput].forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  });

  addButton.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const date = dateInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title || !description) {
      alert('Bitte Titel und Beschreibung für Ausbildung eingeben.');
      return;
    }

    const item = { title, date, description };

    if (editingEducationIndex !== null) {
      currentEducation[editingEducationIndex] = item;
      editingEducationIndex = null;
    } else {
      currentEducation.push(item);
    }

    titleInput.value = '';
    dateInput.value = '';
    descriptionInput.value = '';
    addButton.textContent = 'Ausbildung hinzufügen';
    titleInput.focus();

    renderEducationList();
  });
}

// Ausbildung Liste rendern
function renderEducationList() {
  const list = document.getElementById('educationList');
  const addButton = document.getElementById('add-education-btn');
  if (!list) {
    return;
  }

  if (editingEducationIndex !== null && !currentEducation[editingEducationIndex]) {
    editingEducationIndex = null;
  }

  if (addButton) {
    addButton.textContent = editingEducationIndex === null ? 'Ausbildung hinzufügen' : 'Ausbildung aktualisieren';
  }

  if (!currentEducation.length) {
    list.innerHTML = '<p class="hint">Noch keine Ausbildung hinzugefügt.</p>';
    return;
  }

  list.innerHTML = currentEducation
    .map((item, index) => `
      <div class="entry-item">
        <div class="entry-item-header">
          <div>
            <div class="entry-item-title">${escapeHtml(item.title)}</div>
            <div class="entry-item-meta">${escapeHtml(item.date || '')}</div>
          </div>
          <div class="entry-item-actions">
            <button type="button" class="skill-item-btn" data-edu-action="edit" data-index="${index}">Bearbeiten</button>
            <button type="button" class="skill-item-btn delete" data-edu-action="delete" data-index="${index}">Löschen</button>
          </div>
        </div>
        <div class="entry-item-text">${escapeHtml(item.description).replace(/\n/g, '<br>')}</div>
      </div>
    `)
    .join('');

  list.querySelectorAll('[data-edu-action="delete"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = Number.parseInt(event.target.dataset.index, 10);
      currentEducation.splice(index, 1);
      renderEducationList();
    });
  });

  list.querySelectorAll('[data-edu-action="edit"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = Number.parseInt(event.target.dataset.index, 10);
      const item = currentEducation[index];

      const titleInput = document.getElementById('educationTitle');
      const dateInput = document.getElementById('educationDate');
      const descriptionInput = document.getElementById('educationDescription');
      const addButton = document.getElementById('add-education-btn');

      titleInput.value = item.title;
      dateInput.value = item.date;
      descriptionInput.value = item.description;
      editingEducationIndex = index;
      addButton.textContent = 'Ausbildung aktualisieren';
      titleInput.focus();
    });
  });
}

// Karriere Manager
function initCareerManager() {
  const titleInput = document.getElementById('careerTitle');
  const companyInput = document.getElementById('careerCompany');
  const dateInput = document.getElementById('careerDate');
  const descriptionInput = document.getElementById('careerDescription');
  const addButton = document.getElementById('add-career-btn');

  if (!titleInput || !companyInput || !dateInput || !descriptionInput || !addButton) {
    return;
  }

  if (addButton.dataset.initialized === 'true') {
    return;
  }

  addButton.dataset.initialized = 'true';

  [titleInput, companyInput, dateInput].forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  });

  addButton.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const company = companyInput.value.trim();
    const date = dateInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title || !description) {
      alert('Bitte Titel und Beschreibung für Job eingeben.');
      return;
    }

    const item = { title, company, date, description };

    if (editingCareerIndex !== null) {
      currentCareer[editingCareerIndex] = item;
      editingCareerIndex = null;
    } else {
      currentCareer.push(item);
    }

    titleInput.value = '';
    companyInput.value = '';
    dateInput.value = '';
    descriptionInput.value = '';
    addButton.textContent = 'Job hinzufügen';
    titleInput.focus();

    renderCareerList();
  });
}

// Karriere Liste rendern
function renderCareerList() {
  const list = document.getElementById('careerList');
  const addButton = document.getElementById('add-career-btn');
  if (!list) {
    return;
  }

  if (editingCareerIndex !== null && !currentCareer[editingCareerIndex]) {
    editingCareerIndex = null;
  }

  if (addButton) {
    addButton.textContent = editingCareerIndex === null ? 'Job hinzufügen' : 'Job aktualisieren';
  }

  if (!currentCareer.length) {
    list.innerHTML = '<p class="hint">Noch kein Job hinzugefügt.</p>';
    return;
  }

  list.innerHTML = currentCareer
    .map((item, index) => `
      <div class="entry-item">
        <div class="entry-item-header">
          <div>
            <div class="entry-item-title">${escapeHtml(item.title)}</div>
            <div class="entry-item-meta">${escapeHtml([item.company, item.date].filter(Boolean).join(' | '))}</div>
          </div>
          <div class="entry-item-actions">
            <button type="button" class="skill-item-btn" data-career-action="edit" data-index="${index}">Bearbeiten</button>
            <button type="button" class="skill-item-btn delete" data-career-action="delete" data-index="${index}">Löschen</button>
          </div>
        </div>
        <div class="entry-item-text">${escapeHtml(item.description).replace(/\n/g, '<br>')}</div>
      </div>
    `)
    .join('');

  list.querySelectorAll('[data-career-action="delete"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = Number.parseInt(event.target.dataset.index, 10);
      currentCareer.splice(index, 1);
      renderCareerList();
    });
  });

  list.querySelectorAll('[data-career-action="edit"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = Number.parseInt(event.target.dataset.index, 10);
      const item = currentCareer[index];

      const titleInput = document.getElementById('careerTitle');
      const companyInput = document.getElementById('careerCompany');
      const dateInput = document.getElementById('careerDate');
      const descriptionInput = document.getElementById('careerDescription');
      const addButton = document.getElementById('add-career-btn');

      titleInput.value = item.title;
      companyInput.value = item.company;
      dateInput.value = item.date;
      descriptionInput.value = item.description;
      editingCareerIndex = index;
      addButton.textContent = 'Job aktualisieren';
      titleInput.focus();
    });
  });
}

// Persönliche Infos Manager
function initPersonalInfoManager() {
  const typeInput = document.getElementById('personalInfoType');
  const valueInput = document.getElementById('personalInfoValue');
  const addButton = document.getElementById('add-personal-info-btn');

  if (!typeInput || !valueInput || !addButton) {
    return;
  }

  if (addButton.dataset.initialized === 'true') {
    return;
  }

  addButton.dataset.initialized = 'true';

  valueInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });

  addButton.addEventListener('click', () => {
    const type = typeInput.value;
    const value = valueInput.value.trim();

    if (!value) {
      alert('Bitte einen Wert für persönliche Infos eingeben.');
      return;
    }

    if (editingPersonalInfoIndex === null) {
      const existingIndex = currentPersonalInfo.findIndex((item) => item.type === type);
      if (existingIndex !== -1) {
        alert('Dieses Feld existiert bereits. Bitte bearbeiten oder löschen.');
        return;
      }

      currentPersonalInfo.push({ type, value });
    } else {
      const duplicateIndex = currentPersonalInfo.findIndex((item, index) => item.type === type && index !== editingPersonalInfoIndex);
      if (duplicateIndex !== -1) {
        alert('Dieses Feld existiert bereits. Bitte einen anderen Typ wählen.');
        return;
      }

      currentPersonalInfo[editingPersonalInfoIndex] = { type, value };
      editingPersonalInfoIndex = null;
    }

    typeInput.value = PERSONAL_INFO_FIELDS[0].key;
    valueInput.value = '';
    addButton.textContent = 'Info hinzufügen';
    valueInput.focus();

    renderPersonalInfoList();
  });
}

// Persönliche Infos Liste rendern
function renderPersonalInfoList() {
  const list = document.getElementById('personalInfoList');
  const addButton = document.getElementById('add-personal-info-btn');
  const typeInput = document.getElementById('personalInfoType');
  const valueInput = document.getElementById('personalInfoValue');

  if (!list) {
    return;
  }

  if (editingPersonalInfoIndex !== null && !currentPersonalInfo[editingPersonalInfoIndex]) {
    editingPersonalInfoIndex = null;
  }

  if (addButton) {
    addButton.textContent = editingPersonalInfoIndex === null ? 'Info hinzufügen' : 'Info aktualisieren';
  }

  if (!currentPersonalInfo.length) {
    list.innerHTML = '<p class="hint">Noch keine persönliche Info hinzugefügt.</p>';
    return;
  }

  list.innerHTML = currentPersonalInfo
    .map((item, index) => `
      <div class="entry-item">
        <div class="entry-item-header">
          <div>
            <div class="entry-item-title">${escapeHtml(getPersonalInfoLabel(item.type))}</div>
          </div>
          <div class="entry-item-actions">
            <button type="button" class="skill-item-btn" data-personal-action="edit" data-index="${index}">Bearbeiten</button>
            <button type="button" class="skill-item-btn delete" data-personal-action="delete" data-index="${index}">Löschen</button>
          </div>
        </div>
        <div class="entry-item-text">${escapeHtml(item.value)}</div>
      </div>
    `)
    .join('');

  list.querySelectorAll('[data-personal-action="delete"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = Number.parseInt(event.target.dataset.index, 10);
      currentPersonalInfo.splice(index, 1);
      renderPersonalInfoList();
    });
  });

  list.querySelectorAll('[data-personal-action="edit"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = Number.parseInt(event.target.dataset.index, 10);
      const item = currentPersonalInfo[index];

      if (typeInput) {
        typeInput.value = item.type;
      }

      if (valueInput) {
        valueInput.value = item.value;
        valueInput.focus();
      }

      editingPersonalInfoIndex = index;
      if (addButton) {
        addButton.textContent = 'Info aktualisieren';
      }
    });
  });
}

// Label für Personal-Info-Typ
function getPersonalInfoLabel(type) {
  const field = PERSONAL_INFO_FIELDS.find((item) => item.key === type);
  return field ? field.label : type;
}

// Einträge in das persistente personalInfo Objekt übertragen
function buildPersonalInfoObject(entries) {
  const personalInfo = {
    birthDate: '',
    location: '',
    additionalInfo: '',
    phoneNumber: '',
    email: '',
    maritalStatus: '',
    drivingLicense: ''
  };

  entries.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(personalInfo, item.type)) {
      personalInfo[item.type] = item.value;
    }
  });

  return personalInfo;
}

function renderSkillsList() {
  const listContainer = document.getElementById('skillsList');
  const addSkillBtn = document.getElementById('add-skill-btn');
  if (!listContainer) {
    return;
  }

  if (editingSkillIndex !== null && !currentSkills[editingSkillIndex]) {
    editingSkillIndex = null;
  }

  if (addSkillBtn) {
    addSkillBtn.textContent = editingSkillIndex === null ? 'Skill hinzufügen' : 'Skill aktualisieren';
  }

  if (!currentSkills.length) {
    listContainer.innerHTML = '<p class="hint">Keine Skills hinzugefügt. Verwende das Formular oben.</p>';
    return;
  }

  listContainer.innerHTML = currentSkills
    .map((skill, index) => {
      const levelLabel = window.PortfolioStore.getSkillLevelLabel(skill.rating);
      return `
        <div class="skill-item">
          <div class="skill-item-info">
            <div class="skill-item-name">${escapeHtml(skill.name)}</div>
            <div class="skill-item-rating">${levelLabel} (${skill.rating}/5)</div>
          </div>
          <div class="skill-item-actions">
            <button type="button" class="skill-item-btn" data-action="edit" data-index="${index}">Bearbeiten</button>
            <button type="button" class="skill-item-btn delete" data-action="delete" data-index="${index}">Löschen</button>
          </div>
        </div>
      `;
    })
    .join('');

  document.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const index = parseInt(event.target.dataset.index, 10);
      currentSkills.splice(index, 1);
      renderSkillsList();
    });
  });

  document.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const index = parseInt(event.target.dataset.index, 10);
      const skill = currentSkills[index];

      const skillNameInput = document.getElementById('skillName');
      const skillRatingInput = document.getElementById('skillRating');
      const skillRatingDisplay = document.getElementById('skillRatingDisplay');
      const addSkillBtn = document.getElementById('add-skill-btn');

      skillNameInput.value = skill.name;
      skillRatingInput.value = skill.rating;
      skillRatingDisplay.textContent = `${skill.rating}/5`;
      skillRatingInput.style.setProperty('--value', skill.rating);
      editingSkillIndex = index;
      addSkillBtn.textContent = 'Skill aktualisieren';

      skillNameInput.focus();
    });
  });
}

// HTML Escaping für sichere Ausgabe
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
