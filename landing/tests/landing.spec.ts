import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';

const content = {
  ca: ['Estem preparant el nostre nou web.', 'Aviat compartirem amb tu els nostres projectes.', 'Contacta amb nosaltres', 'hola@traverstudi.cat'],
  es: ['Estamos preparando nuestra nueva web.', 'Pronto compartiremos contigo nuestros proyectos.', 'Contacta con nosotros', 'hola@traverstudi.es'],
  en: ['We’re working on our new website.', 'We’ll be sharing our projects with you soon.', 'Get in touch', 'hola@traverstudi.com'],
};
for (const [locale, language] of [['ca-ES', 'ca'], ['es-MX', 'es'], ['en-GB', 'en'], ['fr-FR', 'en']]) {
  test('browser language ' + locale, async ({ browser }) => {
    const context = await browser.newContext({ locale });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    const text = content[language as keyof typeof content];
    await expect(page.locator('h1')).toHaveText(text[0]);
    await expect(page.locator('.description')).toHaveText(text[1]);
    await expect(page.locator('.contact')).toHaveText(text[2]);
    await expect(page.locator('.contact')).toHaveAttribute('href', 'mailto:' + text[3]);
    await expect(page.locator('.email')).toHaveText(text[3]);
    await expect(page.locator('.email')).toHaveAttribute('href', 'mailto:' + text[3]);
    await context.close();
  });
}

test('manual choice, reload, new visit and translated accessibility', async ({ page }) => {
  await page.goto('/');
  for (const language of ['ca', 'es', 'en'] as const) {
    await page.locator('[data-language="' + language + '"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('h1')).toHaveText(content[language][0]);
    await expect(page.locator('.contact')).toHaveAttribute('href', 'mailto:' + content[language][3]);
    await expect(page.locator('.email')).toHaveAttribute('href', 'mailto:' + content[language][3]);
    await expect(page.locator('[aria-current]')).toHaveText(language.toUpperCase());
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', language);
  }
  await page.locator('[data-language="ca"]').click();
  await expect(page.locator('nav')).toHaveAttribute('aria-label', 'Selecciona l’idioma');
  await expect(page.locator('[data-language="en"]')).toHaveAttribute('aria-label', 'Anglès');
  await expect(page.locator('.skip')).toHaveText('Ves al contingut');
});

test('blocked storage and unsupported first preference', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'fr-FR' });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'languages', { get: () => ['fr-FR', 'ca-ES'] });
    Storage.prototype.getItem = () => { throw new Error('blocked'); };
    Storage.prototype.setItem = () => { throw new Error('blocked'); };
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('[data-language="es"]').click();
  await expect(page.locator('h1')).toHaveText(content.es[0]);
  expect(errors).toEqual([]);
  await context.close();
});

test('invalid saved choice falls back to browser', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('traver-language', 'invalid'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('static pages and language links work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  for (const language of ['ca', 'es', 'en'] as const) {
    await page.locator('[data-language="' + language + '"]').click();
    await expect(page.locator('h1')).toHaveText(content[language][0]);
    await expect(page.locator('.contact')).toHaveAttribute('href', 'mailto:' + content[language][3]);
  }
  await context.close();
});

test('keyboard navigation and local resources only', async ({ page }) => {
  const external: string[] = [];
  const failures: string[] = [];
  page.on('request', request => {
    if (!request.url().startsWith('http://127.0.0.1:4325/')) external.push(request.url());
  });
  page.on('pageerror', error => failures.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-language="ca"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
  await page.evaluate(() => document.fonts.ready);
  expect(external).toEqual([]);
  expect(failures).toEqual([]);
});

for (const width of [320, 390, 768, 1440, 1920]) {
  for (const language of ['ca', 'es', 'en'] as const) {
    test('layout and accessibility ' + width + ' ' + language, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
      await page.goto('/' + language + '/');
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.locator('.contact')).toBeVisible();
      expect(await page.locator('.seal img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
      const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(report.violations).toEqual([]);
      await mkdir('.work/landing-screenshots', { recursive: true });
      await page.screenshot({ path: '.work/landing-screenshots/' + language + '-' + width + '.png', fullPage: true });
    });
  }
}
