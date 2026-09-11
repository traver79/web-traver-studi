import type {APIRoute} from 'astro';import {absolute,withBase} from '../utils/i18n';
export const GET:APIRoute=()=>new Response(`User-agent: *\nAllow: /\nSitemap: ${absolute(withBase('sitemap.xml'))}\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
