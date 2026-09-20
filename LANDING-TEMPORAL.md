# Traver Studi · landing temporal

Trabajo aislado en la rama `landing-temporal`, en la carpeta
`web-traver-studi-landing-temporal`, hermana de `web-traver-studi` dentro de OneDrive.
La web en desarrollo sigue en `main`. No se ha mezclado ni publicado esta landing.

## Abrir y generar

Desde esta carpeta, con Node.js instalado (24 LTS recomendado; la landing también
se ha verificado con 22.14.0):

```sh
node landing/build.mjs
node landing/preview.mjs
```

Abrir http://127.0.0.1:4325/ . Detener con Ctrl+C.
La vista previa escucha solo en este ordenador. Si el puerto está ocupado,
cerrar la vista previa anterior o definir la variable de entorno PORT.
Estos dos comandos no necesitan instalar dependencias.

Equivalentes: `npm run landing:build` y `npm run landing:preview`.
No utilizar `npm run build` para esta entrega: ese comando conserva la
compilación Astro de la web completa.

La salida lista para hosting es **`dist/landing/`**:

- `index.html`: primera visita según el primer idioma preferido del navegador,
  CA, ES o EN; cualquier otro utiliza EN.
- `ca/index.html`, `es/index.html`, `en/index.html`: alternativas estáticas.
- `style.css`, `client.js`, `translations.mjs` y `assets/`.

La elección manual queda en `localStorage` bajo `traver-language` y prevalece
al volver a la raíz. Una URL localizada explícita conserva su idioma.
El dominio no interviene. Si se bloquea el almacenamiento, el selector sigue
funcionando. Sin JavaScript, la raíz ofrece inglés y enlaces a los tres idiomas.
Los enlaces mailto utilizan el correo correspondiente al idioma.

## Revisión

Para ejecutar las pruebas, con Node 24 y las dependencias del proyecto:

```sh
npm ci
# En Linux/macOS: npx playwright install --with-deps chromium
npm run landing:build
npm run landing:test
```

En Windows se utiliza Microsoft Edge instalado.
24 pruebas cubren detección, persistencia, textos, mailto, teclado, recursos
locales, JavaScript/almacenamiento bloqueados y accesibilidad WCAG con axe.
Diseño verificado a 320, 390, 768, 1440 y 1920 px en los tres idiomas.
Capturas locales: `.work/landing-screenshots/`; no se suben a Git.

## Publicación futura en Axarnet

**Pendiente de activación del Hosting L de traverstudi.com y de revisión.**
No se ha accedido ni publicado en Axarnet, ni modificado DNS.

Cuando se decida publicar:

1. Ejecutar `node landing/build.mjs` y revisar la vista previa.
2. Guardar copia del contenido que exista en la raíz web del hosting.
3. Subir **el contenido** de `dist/landing/` a la raíz web asignada por Axarnet,
   conservando los subdirectorios. Confirmar esa ubicación en su panel.
4. Comprobar HTTPS, idiomas, recursos y mailto en el dominio.

No subir el repositorio, `.git`, `node_modules`, `.work` ni el resto de `dist`.
El servidor solo necesita servir archivos estáticos; no necesita Node, PHP,
base de datos, formularios ni servicios externos. Las rutas son relativas y
admiten alojar la misma entrega en los tres dominios, sin cambiar los idiomas.

## Estado de GitHub y seguridad

Revisión del 20/09/2026:

- Repositorio público existente: https://github.com/traver79/web-traver-studi .
- Base: `main`, commit `cbee8b98ef4de252db4694307aa4ddc4d4bf4d10`;
  árbol de trabajo original limpio.
- El workflow `.github/workflows/pages.yml` se activa por push a `main`,
  pull request o ejecución manual; el job de despliegue exige `refs/heads/main`.
- La API de Pages devuelve actualmente `build_type: legacy`, fuente
  `main:/`. Difiere de la descripción previa del README que indicaba Actions.
  No se han cambiado esos ajustes. Ambas configuraciones apuntan a `main`,
  no a `landing-temporal`.
- Último despliegue observado: entorno `github-pages`, mismo commit de `main`.
- No hay webhooks configurados en el repositorio.
- Push de esta rama sin merge ni pull request: no activa el workflow de
  publicación ni cambia la rama fuente de Pages.
- Se conserva la visibilidad pública. Solo se añaden código, documentación,
  la fuente local y su licencia OFL; los SVG proceden del repositorio.
  `.env*`, compilados, dependencias y pruebas visuales están ignorados.

## Identidad y edición

Paleta existente: crema `#fff9f2`, oliva `#656440`, tinta `#3a3026`.
SVG originales en `public/brand/`, sin alterar sus vectores.
Inter Tight Variable, subset latino autoalojado con licencia OFL incluida.
No hay analítica ni peticiones a fuentes externas.

Textos: `landing/translations.mjs`. Composición: `landing/template.html`.
Estilos: `landing/style.css`. Detección: `landing/client.js`.
Tras editar, regenerar con `node landing/build.mjs`.
