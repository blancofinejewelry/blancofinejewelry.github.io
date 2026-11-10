'use strict';

const element = (id) => document.getElementById(id);
const baseURL = new URL('./', location.href);
let installationPrompt = null;
let lastFocusedElement = null;

function text(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function imageURL(value) {
  if (!text(value)) return null;
  try {
    const url = new URL(value, baseURL);
    const imageRoot = new URL('images/', baseURL).pathname;
    if (url.origin !== location.origin || url.username || url.password) return null;
    if (!url.pathname.startsWith(imageRoot) || !/\.(avif|webp|jpe?g|png)$/i.test(url.pathname)) return null;
    return url.href;
  } catch { return null; }
}

function instagramURL(value) {
  try {
    const url = new URL(text(value));
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    return ['instagram.com', 'www.instagram.com'].includes(url.hostname) ? url.href : null;
  } catch { return null; }
}

function photo(src, alt, eager = false) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = eager ? 'eager' : 'lazy';
  img.decoding = 'async';
  if (eager) img.fetchPriority = 'high';
  return img;
}

function openDialog(dialog, trigger) {
  lastFocusedElement = trigger || document.activeElement;
  dialog.showModal();
  document.body.classList.add('dialog-open');
}

function openPiece(piece, trigger) {
  element('piece-title').textContent = piece.title;
  element('piece-description').textContent = piece.description;
  element('piece-material').textContent = piece.material;
  element('piece-material').hidden = !piece.material;
  const gallery = element('piece-gallery');
  gallery.replaceChildren(...piece.gallery.map((url, index) => photo(url, `${piece.title} — photograph ${index + 1}`, index === 0)));
  openDialog(element('piece-dialog'), trigger);
}

function renderContact(data) {
  const links = element('contact-links');
  links.replaceChildren();
  const email = text(data?.email);
  if (/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) && !/[?&#]/.test(email)) {
    const link = document.createElement('a');
    link.className = 'text-link';
    link.href = `mailto:${email}`;
    link.textContent = email;
    links.append(link);
  }
  const instagram = instagramURL(data?.instagramUrl);
  if (instagram) {
    const link = document.createElement('a');
    link.className = 'text-link';
    link.href = instagram;
    link.rel = 'noopener noreferrer';
    link.target = '_blank';
    link.textContent = 'Instagram ↗';
    link.setAttribute('aria-label', 'Instagram, opens in a new tab');
    links.append(link);
  }
  element('contact').hidden = !links.childElementCount;
  element('contact-link').hidden = !links.childElementCount;
}

function renderSite(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid portfolio data');
  const homepage = data.homepage || {};
  element('page-title').textContent = text(homepage.title) || 'A study in jewelry.';
  element('introduction').textContent = text(homepage.description);
  element('introduction').hidden = !text(homepage.description);
  document.querySelector('meta[name="description"]').content = text(homepage.description) || 'Blanco Fine Jewelry — a personal jewelry portfolio.';

  const hero = element('hero');
  const heroSource = imageURL(homepage.heroImage);
  hero.replaceChildren();
  hero.hidden = !heroSource;
  document.querySelector('.opening').classList.toggle('has-image', Boolean(heroSource));
  if (heroSource) hero.append(photo(heroSource, text(homepage.heroAlt) || 'Jewelry by Blanco', true));

  const pieces = (Array.isArray(data.jewelry) ? data.jewelry : [])
    .filter((piece) => piece && piece.visible === true && text(piece.title))
    .map((piece) => ({
      title: text(piece.title),
      description: text(piece.description),
      material: text(piece.material),
      order: Number.isFinite(Number(piece.order)) ? Number(piece.order) : 0,
      gallery: (Array.isArray(piece.gallery) ? piece.gallery : []).map(imageURL).filter(Boolean)
    }))
    .filter((piece) => piece.gallery.length)
    .sort((a, b) => a.order - b.order);

  const grid = element('portfolio-grid');
  grid.replaceChildren();
  for (const piece of pieces) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'piece-card';
    button.setAttribute('aria-label', `View ${piece.title}`);
    button.setAttribute('aria-haspopup', 'dialog');
    const picture = document.createElement('span');
    picture.className = 'card-photo';
    picture.append(photo(piece.gallery[0], piece.title));
    const title = document.createElement('span');
    title.className = 'card-title';
    title.textContent = piece.title;
    button.append(picture, title);
    if (piece.material) {
      const material = document.createElement('span');
      material.className = 'card-material';
      material.textContent = piece.material;
      button.append(material);
    }
    button.addEventListener('click', () => openPiece(piece, button));
    grid.append(button);
  }
  element('portfolio-status').hidden = pieces.length > 0;
  element('work').hidden = !pieces.length;
  element('work-link').hidden = !pieces.length;
  element('explore-link').hidden = !pieces.length;
  const about = text(data.about);
  element('about-copy').textContent = about;
  element('about').hidden = !about;
  element('about-link').hidden = !about;
  renderContact(data.contact);
}

async function loadPortfolio() {
  element('retry-load').disabled = true;
  try {
    const response = await fetch(new URL('site.json', baseURL), {cache: 'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    renderSite(await response.json());
    element('load-notice').hidden = true;
  } catch {
    element('load-message').textContent = navigator.onLine
      ? 'The portfolio could not be loaded. Please try again.'
      : 'You’re offline. Please reconnect to load the latest portfolio.';
    element('load-notice').hidden = false;
  } finally {
    element('retry-load').disabled = false;
  }
}

for (const [dialogID, closeID] of [['piece-dialog', 'close-piece'], ['install-dialog', 'close-install']]) {
  const dialog = element(dialogID);
  element(closeID).addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    lastFocusedElement?.focus();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
}

element('year').textContent = new Date().getFullYear();
element('retry-load').addEventListener('click', loadPortfolio);
window.addEventListener('online', loadPortfolio);

const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
if ('serviceWorker' in navigator && window.isSecureContext && !standalone) element('install-button').hidden = false;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installationPrompt = event;
  element('install-button').hidden = false;
});
window.addEventListener('appinstalled', () => {
  installationPrompt = null;
  element('install-button').hidden = true;
});
element('install-button').addEventListener('click', async () => {
  if (installationPrompt) {
    await installationPrompt.prompt();
    await installationPrompt.userChoice;
    installationPrompt = null;
  } else {
    openDialog(element('install-dialog'), element('install-button'));
  }
});

loadPortfolio();
if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('service-worker.js', baseURL), {updateViaCache: 'none'})
      .catch(() => { /* Browsing remains available if offline support cannot be installed. */ });
  });
}
