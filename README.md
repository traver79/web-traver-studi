# TRAVER STUDI — WEB V0.1

Web corporativa estática en español, catalán e inglés, construida con **Astro 7.3.2**, TypeScript y CSS. Home, Proyectos, ficha de proyecto, Estudio, Servicios y Contacto. No utiliza CMS, SPA, React, backend ni servicios de traducción en runtime.

Repositorio: https://github.com/traver79/web-traver-studi

URL prevista de publicación: https://traver79.github.io/web-traver-studi/

**Publicación:** repositorio público con autorización del propietario y GitHub Pages configurado mediante GitHub Actions. Cada push a `main` valida y despliega la web. Consultar Actions para conocer el resultado del último despliegue.

## Requisitos y puesta en marcha

- Node.js **24 LTS** recomendado, mínimo 22.19.0. El Node 22.14 instalado inicialmente en el equipo queda por debajo del requisito de una dependencia de Astro.
- npm 10 o posterior y Git.
- En Windows las pruebas usan Microsoft Edge; en Linux/macOS requieren Chromium de Playwright.

```sh
git clone https://github.com/traver79/web-traver-studi.git
cd web-traver-studi
npm install
npm run dev
```

Abrir `http://localhost:4321/web-traver-studi/`. La raíz selecciona el idioma del navegador. Para revisión directa: `/web-traver-studi/es/`, `/ca/` o `/en/`.

```sh
npm run check
npm run build
npm run preview
```

El resultado se genera en `dist/`. Preview sirve la compilación, normalmente en el puerto 4321; consultar la URL que imprime Astro. Si el puerto está ocupado, puede indicarse `npm run preview -- --port 4322`.

Astro 7 puede mantener los servidores como procesos en segundo plano. Para consultarlos o detenerlos:

```sh
npx astro dev status
npx astro dev stop
npx astro preview status
npx astro preview stop
```

La primera compilación convierte las fotografías y tarda más. Las siguientes reutilizan la caché. Para instalación reproducible en otro equipo o CI se utiliza `npm ci`, conservando `package-lock.json`.

## Arquitectura

```text
src/
  assets/projects/        Fotografías fuente, sin sobrescribir los originales recibidos
  components/            Header, Footer, Photo, galería y plantillas de página
  content/
    projects/            Un JSON por proyecto, con ES/CA/EN
    site/                Textos corporativos y etiquetas, un JSON por idioma
    contact.json         Datos de contacto compartidos
  content.config.ts      Esquema validado de Content Collections
  layouts/               HTML, metadatos, cabecera y pie globales
  pages/
    [lang]/[...page].astro Generación de páginas e idiomas
    index.astro          Detección de idioma y alternativa sin JavaScript
    404.astro
    sitemap.xml.ts
    robots.txt.ts
  styles/                Tokens y estilos globales
  utils/                 Rutas, consultas de proyectos e interacción nativa
public/brand/            SVG originales de marca
public/social.jpg        Fotografía real para compartir enlaces
tests/                   Validaciones de navegador y accesibilidad
docs/                    Decisiones y contenido pendiente
.github/workflows/       Validación y publicación automática
```

## Añadir un proyecto

1. Crear `src/assets/projects/nombre-del-proyecto/` y copiar sus fotografías. Conservar los archivos originales fuera del repositorio si son archivos maestros de gran tamaño; no sobrescribirlos.
2. Duplicar `src/content/projects/calle-mallorca.json` en `src/content/projects/nombre-del-proyecto.json`.
3. Cambiar `projectId`, `order`, `featured`, `year`, `credits`, `cover`, `coverAlt` y `gallery`.
4. Rellenar `translations.es`, `.ca` y `.en`: título, slug, ubicación, categoría, párrafos y SEO.
5. Ejecutar `npm run build` y revisar con `npm run preview`.

El listado, destacados, ficha, selector de idioma, navegación al siguiente proyecto y sitemap se generan solos. `order` menor aparece primero; `featured: true` lo muestra en Home. Los slugs deben ser únicos en cada idioma, en minúsculas y separados con guiones. `year`, `credits`, `location` y `category` admiten `null` y se muestran como pendientes; `description` es una lista de párrafos.

Una imagen se referencia desde el JSON, por ejemplo:

```json
{
  "src": "../../assets/projects/nombre-del-proyecto/01.jpg",
  "alt": {
    "es": "Descripción concreta del espacio fotografiado",
    "ca": "Descripció concreta de l’espai fotografiat",
    "en": "A specific description of the photographed space"
  }
}
```

El orden de `gallery` determina el orden visible. `cover` marca la portada. La ampliación permite teclado, botones y gesto horizontal. La galería no recorta las fotografías. Astro produce AVIF, WebP y JPEG responsivos, con anchuras máximas de 1600 px o la anchura original si es menor. Los originales no se modifican. `Photo.astro` centraliza calidad, formatos y tamaños.

## Editar textos, traducciones y contacto

Editar `src/content/site/es.json` para español y los archivos equivalentes `ca.json` y `en.json`. La versión española es la fuente; actualizar siempre las otras dos al cambiarla. Las traducciones quedan guardadas en Git, sin traducción automática en visitas. Los proyectos tienen las traducciones dentro de su propia ficha.

Los datos se editan en `src/content/contact.json`: email, teléfono/WhatsApp y dirección suministrados, y enlace al perfil real de Instaltraver en Google Maps. Instagram está pendiente de creación; no se muestra un perfil inventado. Al crearlo, añadir su URL y el enlace correspondiente en ContactPage/Footer.

Los servicios son los cuatro solicitados: SOS, diseño de interiores, proyecto completo y cocinas DELTA. Su redacción es propia. Cada llamada a contacto preselecciona el servicio correspondiente.

El formulario valida nombre, email, servicio y mensaje, y prepara un `mailto:` a `hola@traverstudi.cat`. El visitante debe enviarlo desde su aplicación de correo; se explica expresamente. También permite copiar la consulta o contactar por WhatsApp. No almacena consultas ni afirma haberlas enviado. Para envío directo, conectar un endpoint propio o un servicio de formularios con recepción, antispam e información de privacidad configurados. No existe un endpoint ficticio. Sin JavaScript se ofrece email directo.

## Cambiar diseño

- Colores, tipografía, tamaños, espacios, márgenes, anchos, tiempos y curvas de animación: `src/styles/tokens.css`.
- Composición y responsive: `src/styles/global.css`. Los breakpoints de 48rem y 64rem están documentados en tokens y se expresan de forma literal en media queries porque CSS no permite variables en sus condiciones.
- Fuente actual: **Inter Tight Variable**, autoalojada, licencia OFL. Para cambiarla, instalar una fuente con licencia web o añadir WOFF2 propios, modificar su importación en `BaseLayout.astro` y `--font-body`.
- Marca: `public/brand/logo.svg` y `logo-inverse.svg`, copias de los SVG suministrados, intactos. No reconstruir ni rasterizar para su uso en la página.
- Intro: `Intro.astro`, reglas `.intro*` y variables `--intro-*`. Corte horizontal entre nombre y subtítulo, apertura hacia arriba/abajo. `--intro-logo-cut` sitúa el corte sin alterar el SVG. CSS y `client.ts` resuelven movimiento reducido y repetición al volver a Home.

Consultar `docs/DESIGN.md` para la investigación de la referencia, decisiones y procedencia de contenidos.

## Idiomas y SEO

Rutas: `/es/proyectos/`, `/ca/projectes/`, `/en/projects/`; equivalentes para Estudio, Servicios, Contacto y proyectos individuales. Se configuran en `src/utils/i18n.ts` y las fichas.

Solo la raíz detecta el primer idioma del navegador: catalán → CA, español → ES, resto → EN. Una elección manual se guarda localmente y se aplica al regresar a la raíz. Los enlaces a páginas de un idioma concreto se respetan. No se hace geolocalización.

Cada página tiene título, descripción, canonical, hreflang ES/CA/EN y x-default, Open Graph y `html lang`. El sitemap contiene las 18 páginas localizadas iniciales y sus alternates. Los datos estructurados no incluyen dirección, teléfono o estadísticas inventadas. El `robots.txt` se publica dentro del subdirectorio del proyecto; en GitHub Pages el archivo del dominio raíz corresponde al repositorio de usuario, si existe. En Search Console se puede enviar directamente `.../web-traver-studi/sitemap.xml`.

## Validación

```sh
npm run build
# Linux/macOS y CI:
npx playwright install --with-deps chromium
npm test
```

Las pruebas cubren rutas, enlaces, imágenes, metadatos, detección/persistencia de idioma, navegación equivalente, menú, teclado, galería, intro, movimiento reducido, JavaScript/almacenamiento desactivados y accesibilidad con axe. Revisan anchos de 320, 390, 768, 1024, 1440 y 1920 px. Las capturas y trazas se guardan en `.work/`, ignorado por Git. Las comprobaciones automáticas no sustituyen la revisión editorial y visual.

## GitHub Pages y publicar cambios

`astro.config.mjs` define `site: https://traver79.github.io`, `base: /web-traver-studi` y barras finales. `withBase()` y `route()` construyen los enlaces; no introducir rutas absolutas como `/proyectos/` que ignoren el prefijo.

En GitHub: **Settings → Pages → Build and deployment → GitHub Actions**. Hace falta un plan compatible si el repositorio permanece privado. No es necesario un segundo repositorio, una rama `gh-pages` ni subir `dist` a Git.

El workflow instala con `npm ci`, compila, ejecuta pruebas, guarda evidencia visual y sube `dist` como artefacto. Si Pages está activado, despliega automáticamente los cambios de `main`. Si todavía no está habilitado, valida la web y deja una nota; el despliegue queda omitido. Tras habilitarlo, lanzar **Actions → Validate and publish TRAVER STUDI → Run workflow**, o hacer un nuevo push.

```sh
git add .
git commit -m "Actualiza contenido de Traver Studi"
git push origin main
```

Para otro dominio o repositorio, modificar `site`/`base` en `astro.config.mjs` y el origen de `absolute()` en `src/utils/i18n.ts`, y comprobar metadatos y enlaces. Para dominio propio también habrá que configurar DNS y `CNAME`.

## Antes de lanzamiento definitivo

Ver `docs/CONTENT-STATUS.md`. Revisar redacción, traducciones, alcance comercial y ciudad/año/tipo/créditos de Calle Mallorca. Añadir Instagram cuando exista. Para envío directo del formulario hay que conectar un servicio; ahora prepara un correo o copia la consulta. Incorporar información legal adaptada antes del lanzamiento comercial. No hay analítica ni cookies de terceros; solo se guarda la preferencia de idioma.
