(function () {
  // Storage-Key für alle Portfolio-Daten im Browser
  const STORAGE_KEY = 'portfolioDataV1';

  const defaultData = {
    profileName: 'Alireza',
    heroImage: 'images/ali.png',
    heroTitle: 'Informatikstudent mit Interesse an Webentwicklung und Programmierung.',
    heroText: 'Ich suche ein Praktikum oder einen Berufseinstieg, um meine Kenntnisse in realen Projekten weiter auszubauen.',
    about: {
      education: [
        {
          title: 'Aktuelle Ausbildung',
          date: 'September 2025 - heute',
          description: 'Bachelorstudium Informatik (dual) an der FH Technikum Wien im 2. Semester. Fokus auf Programmierung, Webentwicklung und Datenbanken.'
        }
      ],
      career: [
        {
          title: 'Mitarbeiter Verkauf & Grafik',
          company: 'MNS Toner & Handel OG, Wien',
          date: 'April 2025 - heute',
          description: 'Pflege und Aktualisierung von Webinhalten • Kundenberatung • Visuelles Design mit Adobe'
        },
        {
          title: 'Grafikdesigner & Social Media Marketing',
          company: 'Igel Apotheke, Wien',
          date: 'Mai 2025 - November 2025',
          description: 'Gestaltung von Grafikmaterialien • Social Media Content • Visuelle Kommunikation'
        }
      ],
      personalInfo: {
        birthDate: 'Geb. 14.12.2004',
        location: 'Wien, Österreich',
        additionalInfo: 'Informatik-Student mit Fokus auf Webentwicklung',
        phoneNumber: '+43 660 2859975',
        email: 'alirezaesmaeili788@gmail.com',
        maritalStatus: 'Ledig',
        drivingLicense: 'Klasse B'
      }
    },
    projects: [
      {
        title: 'Webanwendungen',
        description: 'Entwicklung mit HTML, CSS, Bootstrap und PHP inkl. Formularverarbeitung',
        image: '',
        tags: ['HTML', 'CSS', 'Bootstrap', 'PHP'],
        link: '#'
      },
      {
        title: 'Interaktive Features',
        description: 'JavaScript Funktionen für DOM-Manipulation und Benutzerinteraktion',
        image: '',
        tags: ['JavaScript'],
        link: '#'
      },
      {
        title: 'Programmierübungen',
        description: 'C, C++, Python - Grundlagen und algorithmisches Denken',
        image: '',
        tags: ['C', 'C++', 'Python'],
        link: '#'
      }
    ],
    skills: [
      { name: 'HTML', rating: 5 },
      { name: 'CSS', rating: 5 },
      { name: 'JavaScript', rating: 4 },
      { name: 'Bootstrap', rating: 4 },
      { name: 'PHP', rating: 4 },
      { name: 'SQL/MySQL', rating: 4 },
      { name: 'C', rating: 4 },
      { name: 'C++', rating: 4 },
      { name: 'C#', rating: 3 },
      { name: 'Python', rating: 3 },
      { name: 'Photoshop', rating: 4 },
      { name: 'Illustrator', rating: 4 }
    ],
    languages: [
      { name: 'Farsi', level: 'Muttersprache' },
      { name: 'Deutsch', level: 'C1 - Fachkundig' },
      { name: 'Englisch', level: 'B1 - Fortgeschritten' }
    ],
    contactIntro: 'Ich freue mich auf Praktikums- und Jobangebote. Kontaktieren Sie mich gerne per E-Mail oder über meine Social-Media-Profile.',
    contact: {
      email: 'alirezaesmaeili788@gmail.com',
      phone: '+43 660 2859975',
      address: 'Morelliagasse 1-3/3/7, 1210 Wien, Österreich'
    },
    footer: {
      fullName: 'Alireza Esmaeili',
      description: 'Informatik-Student an der FH Technikum Wien mit Fokus auf Webentwicklung und Programmierung.',
      birthDate: 'Geb. 14.12.2004',
      city: 'Wien, Österreich',
      copyrightYear: '2025'
    }
  };

  function clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  // Utility: String-Feld sicher aus Objekt lesen
  function pickString(source, key, fallback) {
    return source && Object.prototype.hasOwnProperty.call(source, key)
      ? String(source[key] || '')
      : fallback;
  }

  // Eingehende Daten auf erwartete Struktur normalisieren
  function normalizeData(data) {
    const merged = clone(defaultData);

    merged.profileName = data && typeof data.profileName === 'string' ? data.profileName : merged.profileName;
    merged.heroImage = data && typeof data.heroImage === 'string' && data.heroImage.trim() ? data.heroImage : merged.heroImage;
    merged.heroTitle = data && typeof data.heroTitle === 'string' ? data.heroTitle : merged.heroTitle;
    merged.heroText = data && typeof data.heroText === 'string' ? data.heroText : merged.heroText;
    merged.contactIntro = data && typeof data.contactIntro === 'string' ? data.contactIntro : merged.contactIntro;

    if (data && data.about) {
      if (Array.isArray(data.about.education)) {
        merged.about.education = data.about.education
          .filter((item) => item && item.title && item.description)
          .map((item) => ({
            title: String(item.title),
            date: String(item.date || ''),
            description: String(item.description)
          }));
      }

      if (Array.isArray(data.about.career)) {
        merged.about.career = data.about.career
          .filter((item) => item && item.title && item.description)
          .map((item) => ({
            title: String(item.title),
            company: String(item.company || ''),
            date: String(item.date || ''),
            description: String(item.description)
          }));
      }

      if (data.about.personalInfo) {
        const personalInfo = data.about.personalInfo;
        merged.about.personalInfo = {
          birthDate: pickString(personalInfo, 'birthDate', merged.about.personalInfo.birthDate),
          location: pickString(personalInfo, 'location', merged.about.personalInfo.location),
          additionalInfo: pickString(personalInfo, 'additionalInfo', merged.about.personalInfo.additionalInfo),
          phoneNumber: pickString(personalInfo, 'phoneNumber', merged.about.personalInfo.phoneNumber),
          email: pickString(personalInfo, 'email', merged.about.personalInfo.email),
          maritalStatus: pickString(personalInfo, 'maritalStatus', merged.about.personalInfo.maritalStatus),
          drivingLicense: pickString(personalInfo, 'drivingLicense', merged.about.personalInfo.drivingLicense)
        };
      }
    }

    if (data && Array.isArray(data.projects)) {
      merged.projects = data.projects
        .filter((item) => item && item.title && item.description)
        .map((item) => ({
          title: String(item.title),
          description: String(item.description),
          image: item.image ? String(item.image) : '',
          tags: Array.isArray(item.tags)
            ? item.tags.map((tag) => String(tag).trim()).filter(Boolean)
            : [],
          link: typeof item.link === 'string' && item.link.trim() ? item.link.trim() : '#'
        }));
    }

    if (data && Array.isArray(data.skills)) {
      merged.skills = data.skills
        .filter((item) => item && item.name)
        .map((item) => ({
          name: String(item.name),
          rating: clampRating(item.rating)
        }));
    }

    if (data && Array.isArray(data.languages)) {
      merged.languages = data.languages
        .filter((item) => item && item.name && item.level)
        .map((item) => ({
          name: String(item.name),
          level: String(item.level)
        }));
    }

    if (data && data.contact) {
      merged.contact.email = data.contact.email ? String(data.contact.email) : merged.contact.email;
      merged.contact.phone = data.contact.phone ? String(data.contact.phone) : merged.contact.phone;
      merged.contact.address = data.contact.address ? String(data.contact.address) : merged.contact.address;
    }

    if (data && data.footer) {
      merged.footer.fullName = data.footer.fullName ? String(data.footer.fullName) : merged.footer.fullName;
      merged.footer.description = data.footer.description ? String(data.footer.description) : merged.footer.description;
      merged.footer.birthDate = data.footer.birthDate ? String(data.footer.birthDate) : merged.footer.birthDate;
      merged.footer.city = data.footer.city ? String(data.footer.city) : merged.footer.city;
      merged.footer.copyrightYear = data.footer.copyrightYear ? String(data.footer.copyrightYear) : merged.footer.copyrightYear;
    }

    if (!merged.projects.length) {
      merged.projects = clone(defaultData.projects);
    }

    if (!merged.skills.length) {
      merged.skills = clone(defaultData.skills);
    }

    if (!merged.languages.length) {
      merged.languages = clone(defaultData.languages);
    }

    return merged;
  }

  // Skill-Rating auf 1..5 begrenzen
  function clampRating(value) {
    const number = Number.parseInt(value, 10);
    if (Number.isNaN(number)) {
      return 3;
    }

    if (number < 1) {
      return 1;
    }

    if (number > 5) {
      return 5;
    }

    return number;
  }

  function getPortfolioData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return clone(defaultData);
      }

      const parsed = JSON.parse(raw);
      return normalizeData(parsed);
    } catch (error) {
      return clone(defaultData);
    }
  }

  function savePortfolioData(data) {
    const normalized = normalizeData(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  }

  function resetPortfolioData() {
    localStorage.removeItem(STORAGE_KEY);
    return clone(defaultData);
  }

  function getSkillLevelLabel(rating) {
    if (rating <= 2) {
      return 'Grundkenntnisse';
    }

    if (rating === 3) {
      return 'Mittelstufe';
    }

    if (rating === 4) {
      return 'Fortgeschritten';
    }

    return 'Experte';
  }

  window.PortfolioStore = {
    getDefaultData: function () {
      return clone(defaultData);
    },
    getPortfolioData,
    savePortfolioData,
    resetPortfolioData,
    getSkillLevelLabel,
    clampRating
  };
})();
