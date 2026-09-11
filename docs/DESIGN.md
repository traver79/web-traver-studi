# TRAVER STUDI — decisiones V0.1

## Referencia e interacción

Se navegó https://antoniorabadan.es/ con Microsoft Edge real mediante Playwright: Home, Proyectos, Villa Moët, Estudio, Servicios y Contacto. Se probaron escritorio, tablet, móvil, menú, navegación, scroll y hover. Las capturas de investigación quedan en `.work/`, fuera de Git. No se distribuyen textos, fotografías ni código de la referencia.

La referencia muestra la marca centrada, espera 1,5 s y abre dos cortinas laterales durante 1,6 s. El briefing de TRAVER STUDI modifica la división: **corte horizontal entre el nombre y el subtítulo INTERIORISME, apertura hacia arriba y abajo**. Se conserva la pausa, máscara y revelado; el sello queda después a la izquierda en Home. La apertura dura 1,45 s tras 1,1 s de espera. Se muestra cada vez que se entra en Home, se omite al interactuar, no captura el puntero y desaparece con movimiento reducido. Termina por CSS aunque JavaScript falle.

Se trasladan composición editorial, titulares amplios, navegación discreta, espacios generosos, fotografías dominantes en proyectos, servicios numerados, menú móvil a pantalla completa y ampliación suave en hover. La Home empieza sin fotografía según `home.txt`; las imágenes aparecen al bajar. No hay scroll artificial ni librería de animación.

## Identidad y contenido

- Paleta `#656440` y `#FFF9F2` del PNG, contrastada con SVG/PDF; prevalece sobre la paleta conceptual del PowerPoint.
- SVG originales copiados intactos. Cabecera y menú usan BrandWordmark, que referencia los grupos vectoriales originales del nombre e INTERIORISME y omite el círculo exterior para mejorar la lectura a pequeño tamaño. Verde sobre crema y crema sobre verde. Los sellos completos se conservan en intro, home y pie.
- TRAVER STUDI es el nombre definitivo; no se utiliza la denominación antigua TRAVER STUDIO del manual.
- Inter Tight Variable es la sans serif ligera propuesta con autorización del usuario. Autoalojada, licencia OFL; no hay descargas de Google Fonts en runtime. Nunca se usa para reconstruir el logo.
- Estudio y trayectoria se redactan a partir de los textos suministrados y sus hechos. Claims del manual de 26 diapositivas en Home y manifiesto.
- Servicios: cuatro modalidades pedidas, con redacción propia. SOS no copia el texto de la referencia. No hay tarifas, garantías ni duraciones inventadas.
- Las 15 fotografías reales de Calle Mallorca; los renders conceptuales del manual no se presentan como obras realizadas.
- Portada provisional `_M0A8030.jpg`; galería por numeración. Descripción propia basada en lo visible, por petición del usuario. Metadatos ausentes quedan pendientes.

## Arquitectura

Astro estático, layout global, componentes por plantilla y Content Collections con JSON. El loader valida datos e imágenes en build. `[lang]/[...page].astro` genera HTML para cada ruta, sin SPA ni hidratación adicional.

Las traducciones se guardan en `src/content/site/{es,ca,en}.json` y cada ficha de proyecto. El español es la fuente. Slugs comunes en `src/utils/i18n.ts`, slugs de proyectos en su JSON.

Solo la raíz detecta preferencia guardada o primer idioma del navegador: CA/ES y EN para el resto. Los enlaces localizados explícitos se respetan. El selector conserva la página equivalente. Funciona sin almacenamiento; sin JavaScript hay enlaces de idioma y email directo.

Breakpoints 48rem y 64rem, documentados en tokens. En móvil se apilan fichas y galería. Las imágenes de galería se muestran completas; tarjetas y cabeceras permiten recorte editorial. El contenido esencial no depende de animaciones de scroll.

GitHub Pages: `site=https://traver79.github.io`, `base=/web-traver-studi`. Enlaces y assets usan ese prefijo. Canonical, hreflang, Open Graph y sitemap comparten las rutas.

## Contacto

Datos proporcionados por el usuario; dirección y teléfono corroborados en Google Maps. El formulario valida los campos y prepara un correo que el visitante envía desde su cliente, o permite copiar la consulta. No simula un envío a un servidor. Instagram pendiente. README explica cómo conectar un endpoint real.
