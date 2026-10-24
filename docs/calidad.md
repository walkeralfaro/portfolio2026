# Calidad

La calidad se verifica en cuatro capas: validación de contenido, chequeo de tipos, pruebas automatizadas y auditorías sobre el build de producción. Ninguna capa sustituye a las otras.

## Comandos

```bash
npm run validate:content
npm run validate:cv
npm run validate:i18n
npm run validate:theme
npm run check
npm run test:unit
npm run test:e2e
npm run build
npm run audit:site
npm run audit:performance
```

`npm run build` ejecuta `prebuild`, que corre las validaciones de CV, tema e i18n. `validate:content` se ejecuta antes de publicar contenido y no forma parte de `prebuild` para permitir builds con el catálogo todavía vacío.

## Contenido

`npm run validate:content` es la puerta principal del inventario:

- Esquema Zod estricto para cada `projects/<slug>/content.yaml`.
- Slug igual al nombre de la carpeta.
- Sin marcadores `<...>` ni `TODO`.
- `month` obligatorio con `year` numérico y ausente con `year: pending`.
- `order` único y entre uno y cuatro destacados cuando hay proyectos.
- Orden del catálogo por fecha descendente, con `order` como desempate.
- `availability` obligatoria si ambos enlaces son `null`.
- `availability` y `narrative` simétricos entre español e inglés.
- Claves de galería existentes en `projects/<slug>/screenshots/`.
- Avisos de imágenes de galería sin usar.
- Rechazo de fragmentos españoles evidentes en el contenido inglés.
- Ausencia del trabajo de cliente excluido.

`npm run content:status` muestra el inventario real y las carpetas pendientes o inválidas. Es la forma correcta de responder “¿qué proyectos hay?”: no se mantiene una lista duplicada en la documentación.

## Unidad

`npm run test:unit` ejecuta las pruebas de Node:

| Archivo | Cobertura |
| --- | --- |
| `tests/unit/content-schema.test.ts` | Campos requeridos, campos desconocidos, stack de 3–5, narrativa simétrica. |
| `tests/unit/project-assets.test.ts` | Claves sin extensión, duplicados, claves válidas e inválidas. |
| `tests/unit/routes.test.ts` | Rutas localizadas, filtros, slugs y cambio de idioma. |
| `tests/unit/i18n.test.ts` | Simetría de claves entre diccionarios. |

Las pruebas unitarias no leen el inventario: usan fixtures pequeños y verifican reglas puras.

## Extremo a extremo

`npm run test:e2e` levanta el build y ejecuta Playwright. Las pruebas de catálogo y detalle leen `projects/*/content.yaml` para construir sus expectativas, así que no duplican slugs ni conteos.

| Archivo | Cobertura |
| --- | --- |
| `tests/e2e/shell.spec.ts` | Skip link, cabecera, menú móvil, tema, idioma, footer, JSON-LD y metadatos. |
| `tests/e2e/catalog.spec.ts` | Inventario, filas, layout 7/5, vista previa, filtros, estados vacíos, móvil, sin JavaScript, portadas y acciones. |
| `tests/e2e/detail.spec.ts` | Rutas, cabecera, stack, narrativa o secciones base, galería, lightbox, acciones y paginación. |
| `tests/e2e/profile.spec.ts` | Primera pantalla, destacados, extracto, capacidades, skills y contacto. |
| `tests/e2e/i18n.spec.ts` | Rutas equivalentes, cambio de idioma, filtros y metadatos recíprocos. |
| `tests/e2e/theme.spec.ts` | Primer pintado, persistencia, sistema, teclado y estado seleccionado. |
| `tests/e2e/quality.spec.ts` | axe, teclado, movimiento reducido y matriz de anchos/temas. |

Cuando el catálogo está vacío, las pruebas que dependen de proyectos se omiten y las que cubren el shell, el tema y las rutas base siguen ejecutándose.

## Accesibilidad

`tests/e2e/quality.spec.ts` ejecuta axe con las etiquetas `wcag2a`, `wcag2aa`, `wcag21a` y `wcag21aa` sobre inicio, trabajo, detalle y sobre mí, en ambos idiomas y en tema claro y oscuro. El criterio de bloqueo es cualquier violación de impacto `critical` o `serious`.

Puntos que la suite verifica explícitamente:

- El skip link es el primer tab stop y mueve el foco a `main`.
- Navegación, CV, radios de tema y selector de idioma son alcanzables con teclado y muestran anillo de foco.
- Los filtros cambian el conteo con Enter.
- Las filas actualizan la vista previa al recibir foco.
- El lightbox abre con teclado, cierra con Escape y devuelve el foco al disparador.
- Los controles de CV abren el sitio externo con `rel="noopener noreferrer"`.
- Cada página tiene un solo `h1` y un solo `main`.

## Movimiento reducido

`src/styles/global.css` reduce animaciones y transiciones cuando `prefers-reduced-motion: reduce` está activo. La prueba confirma que filtros, paneles de vista previa y botones no tienen transición medible. Ningún contenido o cambio de estado depende del movimiento.

## Rendimiento

`npm run audit:performance` mide el build servido localmente con emulación de red y CPU. Los presupuestos son:

| Métrica | Presupuesto |
| --- | --- |
| JavaScript inicial, gzip | ≤ 30 KB |
| Largest Contentful Paint | ≤ 2,0 s |
| Desplazamiento de layout por fuentes | ≤ 0,01 |

El JavaScript inicial se limita al catálogo, el tema y los scripts inline del shell. Las portadas usan `srcset`, dimensiones intrínsecas y carga diferida; solo la primera portada visible carga con prioridad.

## Auditoría del sitio

`npm run build && npm run audit:site` comprueba:

- Enlaces internos y referencias a assets resueltos.
- Una URL canónica por página.
- Alternates `hreflang` recíprocos y `x-default`.
- Open Graph, Twitter y la imagen social por defecto.
- Sitemap y `robots.txt`.
- Páginas 404 localizadas con enlaces de recuperación.
- Ausencia de errores de consola, peticiones fallidas o enlaces `#`.
- Ausencia del trabajo de cliente excluido en el sitemap y los metadatos.

## Matriz de revisión

La matriz de `quality.spec.ts` cubre:

- Anchos: 320, 768, 1024 y 1440 px.
- Idiomas: español e inglés.
- Temas: claro y oscuro.
- Rutas: inicio, trabajo, un detalle y sobre mí.

En cada combinación se comprueba que no hay overflow horizontal y que hay exactamente un `h1`.

## Contenido editorial

Antes de publicar un proyecto:

1. `npm run validate:content` sin errores.
2. `npm run content:status` con el proyecto en la tabla y sin avisos de contenido inválido.
3. Revisión visual de `/work/<slug>/` y `/en/work/<slug>/`.
4. Revisión de la portada y de cada captura en ambos idiomas.
5. Confirmación de que los enlaces externos son reales y de que las notas de disponibilidad son honestas.

No se publican años, enlaces, capturas ni resultados inventados. Un dato desconocido se queda en `pending` o `null` con una nota de disponibilidad.

## Despliegue

El sitio es estático. El origen canónico se configura en `astro.config.mjs`, `src/lib/site.ts` y `robots.txt`. Antes de publicar:

```bash
npm run build
npm run audit:site
npm run audit:performance
```

Verificar en el host elegido la URL canónica, las redirecciones y el sitemap. El CV sigue siendo externo en `https://resume.walkeralfaro.com/`; el portfolio no genera una página de CV ni un PDF.
