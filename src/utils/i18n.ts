import es from '../content/site/es.json';
import ca from '../content/site/ca.json';
import en from '../content/site/en.json';
export const languages = ['es', 'ca', 'en'] as const;
export type Lang = typeof languages[number];
export type PageKey = 'home' | 'projects' | 'studio' | 'services' | 'contact';
export const copy = { es, ca, en };
export const slugs: Record<Lang, Record<PageKey, string>> = {
  es: { home: '', projects: 'proyectos', studio: 'estudio', services: 'servicios', contact: 'contacto' },
  ca: { home: '', projects: 'projectes', studio: 'estudi', services: 'serveis', contact: 'contacte' },
  en: { home: '', projects: 'projects', studio: 'studio', services: 'services', contact: 'contact' },
};
export const pageKeys = ['home', 'projects', 'studio', 'services', 'contact'] as const;
export function withBase(path = '') { return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`; }
export function route(lang: Lang, page: PageKey = 'home', projectSlug?: string) {
  return withBase([lang, slugs[lang][page], projectSlug].filter(Boolean).join('/') + '/');
}
export const absolute = (path: string) => new URL(path, 'https://traver79.github.io').href;
export const locales = { es: 'es_ES', ca: 'ca_ES', en: 'en_GB' };
