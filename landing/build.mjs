import { mkdir, copyFile, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { translations } from './translations.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist/landing');
await mkdir(path.join(output, 'assets'), { recursive: true });
for (const name of ['inter-tight-latin-wght-normal.woff2', 'INTER-TIGHT-LICENSE.txt']) {
  await copyFile(path.join(root, 'landing/assets', name), path.join(output, 'assets', name));
}
for (const name of ['logo.svg', 'logo-inverse.svg']) {
  await copyFile(path.join(root, 'public/brand', name), path.join(output, 'assets', name));
}
for (const name of ['style.css', 'client.js', 'translations.mjs']) {
  await copyFile(path.join(root, 'landing', name), path.join(output, name));
}
const template = await readFile(path.join(root, 'landing/template.html'), 'utf8');
for (const language of ['root', 'ca', 'es', 'en']) {
  const lang = language === 'root' ? 'en' : language;
  const t = translations[lang];
  const base = language === 'root' ? './' : '../';
  const values = { ...t, lang, base, auto: String(language === 'root'),
    navigation: Object.keys(translations).map(code =>
      `<a href="${base}${code}/" data-language="${code}" aria-label="${t.languages[code]}"${code === lang ? ' aria-current="true"' : ''}>${code.toUpperCase()}</a>`
    ).join('<span aria-hidden="true">·</span>'),
  };
  const html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key]);
  const directory = language === 'root' ? output : path.join(output, language);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), html);
}
console.log('Landing estática generada en dist/landing. No se ha publicado.');

