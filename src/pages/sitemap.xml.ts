import type { APIRoute } from 'astro';
import { getProjects } from '../utils/projects';
import { languages,pageKeys,route,absolute,withBase } from '../utils/i18n';
export const GET: APIRoute = async () => {
 const projects=await getProjects();
 const groups=[...pageKeys.map(k=>languages.map(l=>({lang:l,url:absolute(route(l,k))}))),...projects.map(p=>languages.map(l=>({lang:l,url:absolute(route(l,'projects',p.data.translations[l].slug))})))];
 const entries=groups.flatMap((g,i)=>g.map(entry=>`<url><loc>${entry.url}</loc>${g.map(a=>`<xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.url}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${i===0?absolute(withBase()):g.find(x=>x.lang==='en')!.url}"/></url>`));
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
