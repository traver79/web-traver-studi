import { translations } from './translations.mjs';

const storageKey = 'traver-language';
const supported = language => Object.hasOwn(translations, language);
function applyLanguage(language) {
  const text = translations[language];
  document.documentElement.lang = language;
  document.title = text.title + ' — Traver Studi';
  document.querySelector('meta[name="description"]').content = text.description;
  document.querySelector('h1').textContent = text.title;
  document.querySelector('.description').textContent = text.description;
  document.querySelector('.contact span').textContent = text.contact;
  document.querySelector('.contact').href = 'mailto:' + text.email;
  document.querySelector('.email').textContent = text.email;
  document.querySelector('.email').href = 'mailto:' + text.email;
  document.querySelector('.skip').textContent = text.skip;
  document.querySelector('nav').setAttribute('aria-label', text.selector);
  document.querySelectorAll('[data-language]').forEach(link => {
    const code = link.dataset.language;
    link.setAttribute('aria-label', text.languages[code]);
    if (code === language) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}
if (document.documentElement.dataset.autoLanguage === 'true') {
  let saved;
  try { saved = localStorage.getItem(storageKey); } catch {}
  const browser = (navigator.languages?.[0] || navigator.language || 'en').split('-')[0].toLowerCase();
  applyLanguage(supported(saved) ? saved : supported(browser) ? browser : 'en');
}
document.querySelectorAll('[data-language]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const language = link.dataset.language;
    try { localStorage.setItem(storageKey, language); } catch {}
    // Follow the real localized link: selection also works without JavaScript.
  });
});

