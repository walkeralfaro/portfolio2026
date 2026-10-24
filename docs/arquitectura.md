# Arquitectura

El sitio es una aplicación estática de Astro con islas de JavaScript mínimas para el catálogo, el tema y la galería. No hay servidor propio ni base de datos: el contenido se valida en tiempo de build y se publica como HTML.

## Estructura

```text
projects/<slug>/          contenido autocontenido de cada proyecto
src/content.config.ts     colección `projects`, cargada desde projects/*/content.yaml
src/lib/content/          esquema Zod y taxonomía editorial
src/lib/projects.ts       acceso, orden, destacados y adyacencia
src/lib/project-images.ts resolución de portadas y capturas con import.meta.glob
src/lib/project-assets.ts reglas puras de claves de imagen
src/i18n/                 locales, rutas y diccionarios de interfaz
src/pages/                rutas estáticas en español e inglés
src/components/           shell, perfil, catálogo, detalle y primitivas
src/scripts/              catálogo, tema y lightbox
src/styles/               tokens y estilos globales
scripts/                  validadores y utilidades de contenido
tests/unit/               pruebas de Node
tests/e2e/                pruebas de Playwright
docs/                     documentación del proyecto
```

## Contenido

`src/content.config.ts` define una sola colección:

```ts
const projects = defineCollection({
  loader: glob({ pattern: '*/content.yaml', base: './projects' }),
  schema: projectSchema,
});
```

El nombre de la carpeta es el slug. No existe una lista central de proyectos, ni una colección de casos MDX, ni un paso de importación.

- `src/lib/content/schema.ts` valida el registro completo con Zod en modo estricto.
- `src/lib/content/taxonomy.ts` contiene solo los vocabularios finitos: categorías, estados y el patrón de slug.
- `src/lib/projects.ts` expone `getProjects()`, `getFeaturedProjects()`, `getProjectCopy()` y `getAdjacentProjects()`.
- `src/lib/project-images.ts` resuelve `projects/*/cover.*` y `projects/*/screenshots/*` con `import.meta.glob`.
- `src/lib/project-assets.ts` define `PROJECTS_DIRECTORY`, `COVER_FILE_KEY`, `GALLERY_DIRECTORY` y las reglas de claves.

La portada no es un campo del contenido: si existe `projects/<slug>/cover.<ext>`, se usa; si no, se renderiza la portada de reemplazo. La galería sí es contenido porque cada locale escribe su propio `alt`.

El contrato completo está en `docs/contenido.md`.

## Rutas

| Ruta | Español | Inglés |
| --- | --- | --- |
| Inicio | `/` | `/en/` |
| Trabajo | `/work/` | `/en/work/` |
| Trabajo filtrado | `/work/?c=ia` | `/en/work/?c=ia` |
| Detalle | `/work/<slug>/` | `/en/work/<slug>/` |
| Sobre mí | `/about/` | `/en/about/` |
| Colofón | `/colophon/` | `/en/colophon/` |
| No encontrado | `/404` | `/en/404` |

Las páginas de detalle usan `getStaticPaths()` sobre `getProjects()`. Cada slug genera una página en ambos idiomas; un slug desconocido cae en el 404 localizado.

`src/i18n/routes.ts` es el único mapa de rutas:

- `routeHref(locale, route)` construye una URL localizada.
- `parseLocalizedUrl(pathname, search)` resuelve ruta y filtro.
- `switchLocaleHref(targetLocale, pathname, search)` produce el equivalente en el otro idioma.

Los slugs se validan con el patrón kebab-case de `src/lib/content/taxonomy.ts`, no con una lista hardcodeada.

## Internacionalización

Español es el idioma por defecto en la raíz; inglés vive bajo `/en`. Cada proyecto declara `locales.es` y `locales.en`, y cada página tiene título, descripción, canonical, alternates y metadatos sociales localizados.

La interfaz se guarda en dos diccionarios tipados:

- `src/i18n/ui.es.ts`
- `src/i18n/ui.en.ts`

`UiStrings` se deriva del diccionario español y el inglés usa `satisfies UiStrings`, de modo que una clave faltante falla el chequeo de tipos. `src/i18n/ui.ts` expone `getUi(locale)`.

Para añadir una cadena:

1. Añadir la clave en `src/i18n/ui.es.ts`.
2. Añadir la misma clave en `src/i18n/ui.en.ts`.
3. Consumirla con `getUi(locale)`.
4. Ejecutar `npm run check` y `npm run validate:i18n`.

`npm run validate:i18n` compara las claves de ambos diccionarios y también la simetría de `locales.es` y `locales.en` en cada `content.yaml`. La galería queda fuera de esa comparación porque puede publicarse en un idioma y no en el otro; `availability` y `narrative` sí deben ser simétricos.

El selector de idioma conserva el slug del proyecto y el filtro `?c=`. El script de cliente recalcula el enlace con la URL real para no perder la query.

## Catálogo

`src/components/catalog/WorkIndex.astro` renderiza todas las filas y todos los paneles de vista previa en el servidor. El catálogo:

- Ordena por fecha descendente (`year` y `month`), con `order` como desempate estable.
- Calcula el total y los conteos por categoría desde los mismos datos.
- Usa un layout maestro–detalle de 7/5 columnas desde 900 px.
- Muestra una lista de una columna por debajo de 900 px.
- Filtra con `?c=` y actualiza el conteo sin recargar.
- Mantiene todas las filas visibles y navegables sin JavaScript.

La vista previa cambia tras 90 ms de puntero o inmediatamente con foco de teclado. Solo el panel activo tiene su portada en el documento; los demás la guardan en un `<template>` inerte para no descargar catorce imágenes.

Cada fila navega siempre a la página interna del proyecto. Los enlaces externos son acciones de la página de detalle.

## Detalle

`src/components/case/ProjectDetail.astro` compone:

```text
CaseHeader          título, resumen, año, categoría, estado, stack, acciones, portada
cuerpo              narrativa YAML o summary / role / result
galería             solo si la locale activa declara capturas
ProjectPager        anterior / siguiente con orden envolvente
```

La cabecera lee el mismo registro que el catálogo, así que título, stack, enlaces y portada no pueden divergir. `ProjectActions.astro` solo renderiza una acción cuando el enlace es real; si falta, muestra la nota de `availability`. Nunca genera `href="#"` ni botones deshabilitados.

La galería usa `<dialog>` nativo y `src/scripts/lightbox.ts`: abre con `showModal()`, cierra con Escape o el control de cierre, bloquea el scroll de fondo y devuelve el foco al disparador.

## Inicio y perfil

`src/data/profile-copy.ts` contiene la narrativa del perfil y los slugs que sirven como evidencia de cada capacidad. `FeaturedWork.astro` toma los proyectos con `featured: true`; `IndexExcerpt.astro` toma los primeros cuatro del catálogo ordenado por fecha. Ambos toleran un catálogo vacío para que el build funcione antes de que exista contenido.

Las capacidades se resuelven contra los proyectos presentes: si un slug de evidencia no existe todavía, esa capacidad no se renderiza. Así se evita romper el build durante la redacción del inventario.

`data.js` es la fuente generada y de solo lectura para la trayectoria del CV. Los adaptadores `src/data/cv.es.ts` y `src/data/cv.en.ts` la validan con `src/data/cv.schema.ts`. El CV no es una ruta del sitio: todos los controles apuntan a `https://resume.walkeralfaro.com/`.

## Scripts

| Script | Responsabilidad |
| --- | --- |
| `npm run dev` | Servidor de desarrollo de Astro. |
| `npm run build` | Build estático; ejecuta `prebuild`. |
| `npm run check` | Diagnóstico de TypeScript y contenido de Astro. |
| `npm run validate:content` | Esquema, slugs, placeholders, destacados, enlaces, galerías e imágenes. |
| `npm run content:status` | Inventario generado desde `projects/`. |
| `npm run project:new -- <slug>` | Crea `projects/<slug>/content.yaml` desde la plantilla de la skill. |
| `npm run validate:i18n` | Simetría de diccionarios y de locales de proyecto. |
| `npm run validate:theme` | Contraste y contrato de tema. |
| `npm run validate:cv` | Adaptadores del CV, conteos y datos excluidos. |
| `npm run test:unit` | Pruebas de Node. |
| `npm run test:e2e` | Pruebas de Playwright. |
| `npm run audit:site` | Enlaces, metadatos, sitemap y consola. |
| `npm run audit:performance` | Presupuesto de JavaScript y LCP. |

`prebuild` ejecuta `validate:cv`, `validate:theme` y `validate:i18n`. `validate:content` se ejecuta explícitamente antes de publicar contenido.

## Pruebas

- `tests/unit/` cubre el esquema, las claves de imagen, las rutas y la simetría de i18n.
- `tests/e2e/` cubre el shell, el catálogo, el detalle, el perfil, el tema, la internacionalización y la calidad.
- `tests/e2e/quality.spec.ts` ejecuta axe, teclado, movimiento reducido y la matriz de anchos/temas.

Las pruebas de catálogo y detalle leen el inventario real de `projects/*/content.yaml`, de modo que no duplican una lista de slugs que pueda quedar desactualizada.

El detalle de la estrategia de calidad está en `docs/calidad.md`.
