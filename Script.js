document.addEventListener('DOMContentLoaded', () => {
  const translations = {
    pt: {
      navAbout: 'Sobre',
      navPortfolio: 'Portfólio',
      navContact: 'Contato',
      heroEyebrow: 'Portfolio',
      heroTitle: 'Dando forma ao imaginário.',
      heroText: 'Ilustrador focado em fantasia, RPG e arte de quadrinhos. Crio personagens, mundos, mapas e storytelling visual para projetos editoriais e criativos.',
      heroCtaPrimary: 'Instagram',
      heroCtaSecondary: 'Email',
      galleryEyebrow: '',
      galleryTitle: 'Veja alguns trabalhos',
      galleryIntro: 'Clique na imagem para ver em tamanho maior.',
      viewFullSize: 'Ver em tamanho real',
      footerTitle: 'Email',
      lightboxDialog: 'Visualizador da obra',
      lightboxClose: 'Fechar visualizador',
      lightboxPrev: 'Obra anterior',
      lightboxNext: 'Próxima obra',
      lightboxZoomIn: 'Aumentar zoom',
      lightboxZoomOut: 'Diminuir zoom',
      profileAlt: 'Retrato do artista',
      artAlt: [
        'Ilustração 1',
        'Ilustração 2',
        'Ilustração 3',
        'Ilustração 4',
        'Ilustração 5',
        'Ilustração 6',
        'Ilustração 7',
        'Ilustração 8'
      ]
    },
    en: {
      navAbout: 'About',
      navPortfolio: 'Portfolio',
      navContact: 'Contact',
      heroEyebrow: 'Portfolio',
      heroTitle: 'Shaping the imaginary.',
      heroText: 'Illustrator focused on fantasy, RPG and comic art. Creating characters, worlds, maps and visual storytelling for editorial and creative projects.',
      heroCtaPrimary: 'Instagram',
      heroCtaSecondary: 'Email',
      galleryEyebrow: '',
      galleryTitle: 'See some works',
      galleryIntro: 'Click the image to view it at full size.',
      viewFullSize: 'View at full size',
      footerTitle: 'Email',
      lightboxDialog: 'Artwork viewer',
      lightboxClose: 'Close viewer',
      lightboxPrev: 'Previous artwork',
      lightboxNext: 'Next artwork',
      lightboxZoomIn: 'Zoom in',
      lightboxZoomOut: 'Zoom out',
      profileAlt: 'Artist portrait',
      artAlt: [
        'Illustration 1',
        'Illustration 2',
        'Illustration 3',
        'Illustration 4',
        'Illustration 5',
        'Illustration 6',
        'Illustration 7',
        'Illustration 8'
      ]
    }
  };

  const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeButtons = document.querySelectorAll('[data-lightbox-close]');
  const zoomInButton = document.querySelector('[data-lightbox-zoom-in]');
  const zoomOutButton = document.querySelector('[data-lightbox-zoom-out]');

  const blockImageActions = (event) => {
    if (!(event.target instanceof HTMLElement) || event.target.tagName !== 'IMG') {
      return;
    }

    if (event.type === 'contextmenu' || event.type === 'dragstart') {
      event.preventDefault();
      return;
    }

    if ((event.type === 'mousedown' || event.type === 'pointerdown') && event.button === 2) {
      event.preventDefault();
    }
  };

  document.addEventListener('contextmenu', blockImageActions);
  document.addEventListener('dragstart', blockImageActions);
  document.addEventListener('mousedown', blockImageActions);
  document.addEventListener('pointerdown', blockImageActions);
  const prevButton = document.querySelector('[data-lightbox-prev]');
  const nextButton = document.querySelector('[data-lightbox-next]');
  const langButtons = document.querySelectorAll('.lang-toggle');

  let currentIndex = 0;
  let currentLang = 'en';
  let currentZoom = 1;
  const minZoom = 1;
  const maxZoom = 4;
  const zoomStep = 0.25;

  function getCardTitle(card) {
    return currentLang === 'pt' ? card.dataset.titlePt : card.dataset.titleEn;
  }

  function applyTranslations() {
    const t = translations[currentLang];

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      if (t[element.dataset.i18n]) {
        element.textContent = t[element.dataset.i18n];
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      if (t[element.dataset.i18nAria]) {
        element.setAttribute('aria-label', t[element.dataset.i18nAria]);
      }
    });

    const profileImage = document.querySelector('[data-alt-pt]');
    if (profileImage) {
      profileImage.alt = t.profileAlt;
    }

    galleryCards.forEach((card, index) => {
      const img = card.querySelector('img');
      const label = card.querySelector('[data-i18n="viewFullSize"]');

      if (label) {
        label.textContent = t.viewFullSize;
      }

      if (img) {
        img.alt = t.artAlt[index];
      }
    });

    document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : 'en-US';

    langButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.lang === currentLang);
    });
  }

  function updateLightbox() {
    const card = galleryCards[currentIndex];
    const src = card.dataset.lightboxImage;
    const title = getCardTitle(card);

    currentZoom = 1;
    lightboxImage.style.transform = 'scale(1)';
    lightboxImage.src = src;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;
    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryCards.length}`;
  }

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentZoom = 1;
    lightboxImage.style.transform = 'scale(1)';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryCards.length;
    updateLightbox();
  }

  function showPrev() {
    currentIndex = currentIndex === 0 ? galleryCards.length - 1 : currentIndex - 1;
    updateLightbox();
  }

  function changeZoom(direction) {
    currentZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom + direction * zoomStep));
    lightboxImage.style.transform = `scale(${currentZoom})`;
  }

  function handleLightboxWheel(event) {
    if (!lightbox.classList.contains('is-open')) {
      return;
    }

    if (event.target === lightboxImage || lightboxImage.contains(event.target)) {
      event.preventDefault();
      changeZoom(event.deltaY < 0 ? 1 : -1);
    }
  }

  galleryCards.forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(index));
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeLightbox);
  });

  prevButton.addEventListener('click', showPrev);
  nextButton.addEventListener('click', showNext);
  zoomInButton.addEventListener('click', () => changeZoom(1));
  zoomOutButton.addEventListener('click', () => changeZoom(-1));

  lightbox.addEventListener('wheel', handleLightboxWheel, { passive: false });

  lightbox.addEventListener('click', (event) => {
    const closingTarget = event.target.closest('[data-lightbox-close]');

    if (closingTarget || event.target.classList.contains('lightbox-overlay')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key === 'ArrowRight') {
      showNext();
    }

    if (event.key === 'ArrowLeft') {
      showPrev();
    }
  });

  langButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentLang = button.dataset.lang;
      applyTranslations();

      if (lightbox.classList.contains('is-open')) {
        updateLightbox();
      }
    });
  });

  applyTranslations();
});