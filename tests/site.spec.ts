import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const base='/web-traver-studi/';
const paths={es:['','proyectos/','estudio/','servicios/','contacto/','proyectos/calle-mallorca/'],ca:['','projectes/','estudi/','serveis/','contacte/','projectes/carrer-mallorca/'],en:['','projects/','studio/','services/','contact/','projects/mallorca-street/']};

test('all localized pages, metadata, links and responsive layouts',async({page,request})=>{
 test.setTimeout(240_000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 const links=new Set<string>();
 for(const [lang,routes] of Object.entries(paths))for(const path of routes){
  const url=base+lang+'/'+path;
  expect((await page.goto(url))?.status(),url).toBe(200);
  await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://traver79.github.io'+url);
  await expect(page.locator('link[hreflang]')).toHaveCount(4);
  expect((await page.locator('meta[name="description"]').getAttribute('content'))?.length).toBeGreaterThan(30);
  expect(await page.locator('img:not([alt])').count()).toBe(0);
  for(const width of [320,390,768,1024,1440,1920]){
   await page.setViewportSize({width,height:960});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' @ '+width).toBe(true);
  }
  for(const href of await page.locator('a[href],link[rel="icon"],meta[property="og:image"]').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')||x.getAttribute('content')||''))){
   if(href.startsWith(base))links.add(href.split('#')[0]);
   if(href.startsWith('https://traver79.github.io'))links.add(new URL(href).pathname);
  }
  const anchors=await page.locator('a[href^="#"]').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')!.slice(1)));
  for(const id of anchors)expect(await page.locator(`[id="${id}"]`).count(),`${url} #${id}`).toBeGreaterThan(0);
 }
 for(const href of links)expect((await request.get(href)).status(),href).toBe(200);
 expect(errors).toEqual([]);
});

test('language detection, saved preference and equivalent project',async({browser})=>{
 for(const [locale,target] of [['ca-ES','ca'],['es-ES','es'],['fr-FR','en'],['de-DE','en'],['zh-CN','en'],['it-IT','en']]){
  const context=await browser.newContext({locale});const page=await context.newPage();await page.goto('http://127.0.0.1:4322'+base);await expect(page).toHaveURL(new RegExp('/'+target+'/$'));await context.close();
 }
 const context=await browser.newContext({locale:'fr-FR'});const page=await context.newPage();await page.goto('http://127.0.0.1:4322'+base+'es/proyectos/calle-mallorca/');await page.locator('.site-header [data-language="ca"]').click();await expect(page).toHaveURL(/ca\/projectes\/carrer-mallorca\/$/);expect(await page.evaluate(()=>localStorage.getItem('traver-language'))).toBe('ca');await page.goto('http://127.0.0.1:4322'+base);await expect(page).toHaveURL(/\/ca\/$/);await page.goto('http://127.0.0.1:4322'+base+'en/');await expect(page.locator('html')).toHaveAttribute('lang','en');await context.close();
});

test('mobile menu: keyboard focus, escape, navigation and accessibility',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(base+'es/');await page.locator('[data-menu-open]').click();await expect(page.locator('#mobile-menu')).toBeVisible();await expect(page.locator('[data-menu-open]')).toHaveAttribute('aria-expanded','true');
 const result=await new AxeBuilder({page}).analyze();expect(result.violations).toEqual([]);
 await page.keyboard.press('Escape');await expect(page.locator('#mobile-menu')).not.toBeVisible();await expect(page.locator('[data-menu-open]')).toBeFocused();await page.locator('[data-menu-open]').click();await page.locator('.menu-links a').first().click();await expect(page).toHaveURL(/\/es\/proyectos\/$/);
});

test('gallery has all supplied images and keyboard controls',async({page})=>{
 await page.goto(base+'es/proyectos/calle-mallorca/');await expect(page.locator('[data-gallery-index]')).toHaveCount(15);await page.locator('[data-gallery-index="0"]').click();await expect(page.locator('[data-lightbox]')).toBeVisible();await expect(page.locator('[data-counter]')).toHaveText('01 / 15');await page.keyboard.press('ArrowRight');await expect(page.locator('[data-counter]')).toHaveText('02 / 15');await expect(page.locator('[data-lightbox-image]')).toHaveAttribute('alt',/Salón/);await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowLeft');await expect(page.locator('[data-counter]')).toHaveText('15 / 15');await page.keyboard.press('Escape');await expect(page.locator('[data-lightbox]')).not.toBeVisible();await expect(page.locator('[data-gallery-index="0"]')).toBeFocused();
});

test('intro opens vertically at the horizontal division and repeats when returning home',async({page})=>{
 await page.goto(base+'es/',{waitUntil:'domcontentloaded'});await expect(page.locator('.intro')).toBeVisible();await page.waitForTimeout(1650);const transforms=await page.locator('.intro-half').evaluateAll(xs=>xs.map(x=>new DOMMatrix(getComputedStyle(x).transform).m42));expect(transforms[0]).toBeLessThan(0);expect(transforms[1]).toBeGreaterThan(0);await expect(page.locator('.intro')).not.toBeVisible({timeout:4000});await page.goto(base+'es/proyectos/');await page.locator('.site-header .brand-logo').click();await expect(page.locator('.intro')).toBeVisible();await expect(page.locator('.intro')).not.toBeVisible({timeout:4000});await page.reload({waitUntil:'domcontentloaded'});await expect(page.locator('.intro')).toBeVisible();
});

test('reduced motion, disabled storage and no JavaScript are usable',async({browser})=>{
 const reduced=await browser.newContext({reducedMotion:'reduce'});const p=await reduced.newPage();await p.goto('http://127.0.0.1:4322'+base+'es/');await expect(p.locator('.intro')).not.toBeVisible();await reduced.close();
 const nojs=await browser.newContext({javaScriptEnabled:false});const q=await nojs.newPage();await q.goto('http://127.0.0.1:4322'+base);await expect(q.locator('nav a')).toHaveCount(3);await q.goto('http://127.0.0.1:4322'+base+'es/proyectos/calle-mallorca/');await expect(q.locator('[data-gallery-index]')).toHaveCount(15);await nojs.close();
 const blocked=await browser.newContext({locale:'ca-ES'});await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('disabled')}});Object.defineProperty(window,'sessionStorage',{get(){throw Error('disabled')}})});const r=await blocked.newPage();await r.goto('http://127.0.0.1:4322'+base);await expect(r).toHaveURL(/\/ca\/$/);await blocked.close();
});

test('accessibility and screenshots for every page template',async({page})=>{
 test.setTimeout(240_000);fs.mkdirSync('.work/screenshots',{recursive:true});
 for(const width of [390,768,1440]){
  await page.setViewportSize({width,height:width===390?844:960});
  for(const [i,path] of paths.es.entries()){
   await page.goto(base+'es/'+path);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(i===0?2800:100);
   // Scroll through each page to exercise lazy images and reveal effects.
   await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,70))}scrollTo({top:0,behavior:'instant'})});
   await page.waitForFunction(()=>[...document.querySelectorAll('img')].filter(x=>!x.closest('dialog')).every(x=>x.complete&&x.naturalWidth>0));
   // Audit the final colors, not a partially transparent frame of a reveal.
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-reveal].is-visible')].every(x=>getComputedStyle(x).opacity==='1'));
   expect(await page.locator('img').evaluateAll(xs=>xs.filter(x=>!x.closest('dialog')).every(x=>(x as HTMLImageElement).complete&&(x as HTMLImageElement).naturalWidth>0))).toBe(true);
   const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations,`${path} @ ${width}`).toEqual([]);
   await page.screenshot({path:`.work/screenshots/es-${i}-${width}.png`,fullPage:true});
  }
 }
});

test('sitemap, robots and responsive image resources',async({request,page})=>{
 const xml=await (await request.get(base+'sitemap.xml')).text();expect((xml.match(/<loc>/g)||[]).length).toBe(18);expect(xml).toContain('hreflang="x-default"');expect(await (await request.get(base+'robots.txt')).text()).toContain('https://traver79.github.io/web-traver-studi/sitemap.xml');
 await page.setViewportSize({width:390,height:844});await page.goto(base+'es/');const image=page.locator('.project-card img');await image.scrollIntoViewIfNeeded();await expect(image).toBeVisible();expect(await image.getAttribute('sizes')).toContain('92vw');expect(await page.locator('.project-card source[type="image/avif"]').count()).toBe(1);await expect.poll(()=>image.evaluate(x=>(x as HTMLImageElement).currentSrc)).not.toBe('');const current=await image.evaluate(x=>(x as HTMLImageElement).currentSrc);expect((await request.get(new URL(current).pathname)).status()).toBe(200);
});

test('contact links and enquiry validation, service selection and copying',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{(window as unknown as {copiedText:string}).copiedText=text}}}));
 await page.goto(base+'es/contacto/?service=4#enquiry');
 await expect(page.locator('#service')).toHaveValue('4');
 await expect(page.locator('a[href="mailto:hola@traverstudi.cat"]').first()).toBeVisible();
 await expect(page.locator('a[href="https://wa.me/34934368515"]').first()).toBeVisible();
 await page.locator('[data-copy-enquiry]').click();
 expect(await page.locator('#name').evaluate(x=>(x as HTMLInputElement).validity.valueMissing)).toBe(true);
 await page.locator('#name').fill('Prueba de validación');
 await page.locator('#email').fill('prueba@example.com');
 await page.locator('#message').fill('Consulta técnica local. No enviar.');
 await page.locator('[data-copy-enquiry]').click();
 await expect(page.locator('[data-form-status]')).toContainText('Consulta copiada');
 expect(await page.evaluate(()=>(window as unknown as {copiedText:string}).copiedText)).toContain('Cocinas DELTA');
 expect(await page.evaluate(()=>(window as unknown as {copiedText:string}).copiedText)).toContain('Consulta técnica local. No enviar.');
 expect(page.url()).not.toContain('prueba@example.com');
});
