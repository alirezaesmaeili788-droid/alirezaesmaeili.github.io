const content = {
  de: {
    navAbout: 'Über mich',
    navProjects: 'Projekte',
    navSkills: 'Skills',
    navLanguages: 'Sprachen',
    navContact: 'Kontakt',
    heroLabel: 'Portfolio',
    heroTitle: 'Ich bin Alireza',
    heroText: 'Informatikstudent mit hoher Motivation, praktische Erfahrungen zu sammeln und mich kontinuierlich weiterzuentwickeln. Ich arbeite strukturiert, lerne schnell und setze neue Inhalte eigenständig in Projekten um.',
    heroProjects: 'Projekte ansehen',
    heroContact: 'Kontakt',
    aboutLabel: 'Über mich',
    aboutTitle: 'Ausbildung, Erfahrung und persönliche Infos.',
    projectsLabel: 'Projekte',
    projectsTitle: 'Meine Arbeiten.',
    skillsLabel: 'Skills',
    skillsTitle: 'Technische Kompetenzen.',
    languagesLabel: 'Sprachen',
    languagesTitle: 'Meine Sprachkenntnisse.',
    contactLabel: 'Kontakt',
    contactTitle: 'Mich erreichen.',
    contactIntro: 'Ich freue mich auf Praktikums- und Jobangebote. Kontaktieren Sie mich gerne per E-Mail oder über meine Social-Media-Profile.',
    footer: '© 2025 Alireza Esmaeili. Alle Rechte vorbehalten.',
    about: [
      {
        title: 'Persönliche Infos',
        lines: ['Geb. 14.12.2004', 'Wien, Österreich', 'Verheiratet', 'Führerschein: Klasse B']
      },
      {
        title: 'Ausbildung',
        lines: ['Bachelorstudium Informatik (dual) an der FH Technikum Wien', 'Seit September 2025', 'Fokus auf Programmierung, Webentwicklung und Datenbanken']
      },
      {
        title: 'Berufserfahrung',
        lines: ['MNS Toner & Handel OG: Verkauf, Grafik und Webinhalte', 'Igel Apotheke: Grafikdesign und Social Media Marketing', 'MakeupKala: Produktgrafiken und WordPress-Inhalte']
      }
    ],
    projects: [
      {
        title: 'StudySpot',
        description: 'Datenbankgestützte PHP-Webanwendung zur Verwaltung von Lernorten mit Registrierung, Rollen und Formularverarbeitung.',
        image: 'images/studyspot.png',
        tags: ['PHP', 'HTML', 'CSS'],
        link: 'https://github.com/alirezaesmaeili788-droid/StudySpot.git'
      },
      {
        title: 'Aktienverwaltung mit Hashtabelle',
        description: 'Python-Anwendung zur Verwaltung historischer Aktiendaten mit selbst implementierter Hashtabelle und effizienter Suche.',
        image: 'images/Aktienverwaltung.png',
        tags: ['Python'],
        link: 'https://github.com/alirezaesmaeili788-droid/stock-manager-hashtable.git'
      },
      {
        title: 'Linked List Implementation',
        description: 'Implementierung einer verketteten Liste mit Sortierfunktionen und dynamischer Speicherverwaltung.',
        image: 'images/LinkedLList.png',
        tags: ['C'],
        link: 'https://github.com/alirezaesmaeili788-droid/linked-list-implementation-c.git'
      },
      {
        title: 'Interactive Piano',
        description: 'Browserbasiertes Piano mit Audioausgabe, Tastatursteuerung und JSON-basierter Song-Wiedergabe.',
        image: 'images/interactive piano.png',
        tags: ['JavaScript'],
        link: 'https://github.com/alirezaesmaeili788-droid/interactive-piano-js.git'
      },
      {
        title: 'Memory Game',
        description: 'Ein kleines Memory-Spiel für den Browser mit zwei Spielern, Punktestand, Spielerwechsel und Hinweis-Funktion.',
        image: 'images/Memorygame.png',
        tags: ['JavaScript'],
        link: 'https://github.com/alirezaesmaeili788-droid/Memory-Game.git'
      }
    ],
    languages: [
      ['Farsi', 'Muttersprache'],
      ['Deutsch', 'C1 - Fachkundig'],
      ['Englisch', 'B1 - Fortgeschritten']
    ],
    skillLevels: ['Grundkenntnisse', 'Mittelstufe', 'Fortgeschritten', 'Experte']
  },
  en: {
    navAbout: 'About',
    navProjects: 'Projects',
    navSkills: 'Skills',
    navLanguages: 'Languages',
    navContact: 'Contact',
    heroLabel: 'Portfolio',
    heroTitle: 'I am Alireza',
    heroText: 'Computer science student with strong motivation to gain practical experience and keep growing. I work in a structured way, learn quickly, and turn new knowledge into real projects.',
    heroProjects: 'View projects',
    heroContact: 'Contact',
    aboutLabel: 'About',
    aboutTitle: 'Education, experience and personal details.',
    projectsLabel: 'Projects',
    projectsTitle: 'Selected work.',
    skillsLabel: 'Skills',
    skillsTitle: 'Technical competencies.',
    languagesLabel: 'Languages',
    languagesTitle: 'Language skills.',
    contactLabel: 'Contact',
    contactTitle: 'Get in touch.',
    contactIntro: 'I am interested in internship and entry-level opportunities. Feel free to contact me by email or through my social profiles.',
    footer: '© 2025 Alireza Esmaeili. All rights reserved.',
    about: [
      {
        title: 'Personal Details',
        lines: ['Born 14.12.2004', 'Vienna, Austria', 'Married', 'Driving license: Class B']
      },
      {
        title: 'Education',
        lines: ['Bachelor degree in Computer Science at FH Technikum Wien', 'Since September 2025', 'Focus on programming, web development and databases']
      },
      {
        title: 'Experience',
        lines: ['MNS Toner & Handel OG: sales, graphics and web content', 'Igel Apotheke: graphic design and social media marketing', 'MakeupKala: product graphics and WordPress content']
      }
    ],
    projects: [
      {
        title: 'StudySpot',
        description: 'Database-driven PHP web app for managing study locations with registration, roles and form handling.',
        image: 'images/studyspot.png',
        tags: ['PHP', 'HTML', 'CSS'],
        link: 'https://github.com/alirezaesmaeili788-droid/StudySpot.git'
      },
      {
        title: 'Stock Manager with Hash Table',
        description: 'Python application for managing historical stock data with a custom hash table and efficient search.',
        image: 'images/Aktienverwaltung.png',
        tags: ['Python'],
        link: 'https://github.com/alirezaesmaeili788-droid/stock-manager-hashtable.git'
      },
      {
        title: 'Linked List Implementation',
        description: 'Implementation of a linked list with sorting functions and dynamic memory management.',
        image: 'images/LinkedLList.png',
        tags: ['C'],
        link: 'https://github.com/alirezaesmaeili788-droid/linked-list-implementation-c.git'
      },
      {
        title: 'Interactive Piano',
        description: 'Browser-based piano with audio playback, keyboard controls and JSON-based song playback.',
        image: 'images/interactive piano.png',
        tags: ['JavaScript'],
        link: 'https://github.com/alirezaesmaeili788-droid/interactive-piano-js.git'
      },
      {
        title: 'Memory Game',
        description: 'A small browser memory game for two players with score tracking, turn switching and hint functionality.',
        image: 'images/Memorygame.png',
        tags: ['JavaScript'],
        link: 'https://github.com/alirezaesmaeili788-droid/Memory-Game.git'
      }
    ],
    languages: [
      ['Farsi', 'Native'],
      ['German', 'C1 - Proficient'],
      ['English', 'B1 - Intermediate']
    ],
    skillLevels: ['Basic', 'Intermediate', 'Advanced', 'Expert']
  }
};

const skills = [
  ['HTML', 4],
  ['CSS', 4],
  ['JavaScript', 2],
  ['PHP', 2],
  ['SQL/MySQL', 2],
  ['C', 4],
  ['C++', 1],
  ['C#', 1],
  ['Python', 1],
  ['Photoshop', 5],
  ['Illustrator', 4],
  ['Video Editing', 3],
  ['MS Office', 4],
  ['WordPress', 3],
  ['Bootstrap', 4]
];

const contact = [
  ['E-Mail', 'alirezaesmaeili788@gmail.com', 'mailto:alirezaesmaeili788@gmail.com'],
  ['Telefon', '+43 660 2859975', 'tel:+436602859975'],
  ['GitHub', 'github.com/alirezaesmaeili788-droid', 'https://github.com/alirezaesmaeili788-droid'],
  ['Adresse', '1210 Wien, Österreich', null]
];

const state = {
  language: localStorage.getItem('portfolioLanguage') || 'de',
  theme: localStorage.getItem('portfolioTheme') || 'light'
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('language-toggle').addEventListener('click', toggleLanguage);
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  applyTheme();
  render();
});

function render() {
  const data = content[state.language];
  document.documentElement.lang = state.language;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = data[key];
  });

  document.getElementById('language-toggle').textContent = state.language === 'de' ? 'EN' : 'DE';
  document.getElementById('footer-text').textContent = data.footer;
  renderAbout(data.about);
  renderProjects(data.projects);
  renderSkills(data.skillLevels);
  renderLanguages(data.languages);
  renderContact();
}

function toggleLanguage() {
  state.language = state.language === 'de' ? 'en' : 'de';
  localStorage.setItem('portfolioLanguage', state.language);
  render();
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('portfolioTheme', state.theme);
  applyTheme();
}

function applyTheme() {
  document.body.classList.toggle('dark', state.theme === 'dark');
  document.getElementById('theme-toggle').textContent = state.theme === 'dark' ? '☀' : '☾';
}

function renderAbout(items) {
  document.getElementById('about-grid').innerHTML = items.map((item) => `
    <article class="info-card">
      <h3>${escapeHtml(item.title)}</h3>
      ${item.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}
    </article>
  `).join('');
}

function renderProjects(projects) {
  document.getElementById('projects-grid').innerHTML = projects.map((project) => `
    <a class="project-card" href="${escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer">
      <div class="project-image">
        <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}">
      </div>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <div class="tags">
        ${project.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
    </a>
  `).join('');
}

function renderSkills(levelLabels) {
  document.getElementById('skills-grid').innerHTML = skills.map(([name, rating]) => `
    <article class="skill-card">
      <div class="skill-head">
        <strong>${escapeHtml(name)}</strong>
        <span class="skill-level">${escapeHtml(getSkillLabel(rating, levelLabels))}</span>
      </div>
      <div class="skill-blocks" aria-label="${rating} of 5">
        ${Array.from({ length: 5 }, (_, index) => `<span class="skill-block${index < rating ? ' active' : ''}"></span>`).join('')}
      </div>
    </article>
  `).join('');
}

function renderLanguages(languages) {
  document.getElementById('languages-grid').innerHTML = languages.map(([name, level]) => `
    <article class="language-card">
      <strong>${escapeHtml(name)}</strong>
      <span class="muted">${escapeHtml(level)}</span>
    </article>
  `).join('');
}

function renderContact() {
  document.getElementById('contact-grid').innerHTML = contact.map(([label, value, href]) => `
    <article class="contact-card">
      <h3>${escapeHtml(label)}</h3>
      ${href ? `<a href="${escapeHtml(href)}" target="${href.startsWith('http') ? '_blank' : '_self'}" rel="noopener noreferrer">${escapeHtml(value)}</a>` : `<p>${escapeHtml(value)}</p>`}
    </article>
  `).join('');
}

function getSkillLabel(rating, labels) {
  if (rating <= 2) {
    return labels[0];
  }

  if (rating === 3) {
    return labels[1];
  }

  if (rating === 4) {
    return labels[2];
  }

  return labels[3];
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
