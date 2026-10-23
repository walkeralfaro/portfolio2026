# Diseño

El sistema visual vive en `src/styles/tokens.css` y `src/styles/global.css`. Los componentes consumen tokens semánticos; no introducen colores, tamaños de texto, espaciados ni anchos de una sola vez.

## Reglas

- Usar los tokens semánticos de color en todos los componentes.
- Usar la escala de tipo, espaciado y layout existente. No crear una segunda escala.
- Los temas claro y oscuro son paletas independientes; el oscuro no se obtiene invirtiendo el claro.
- El foco global usa `--signal`, 3 px de grosor y 3 px de separación. No se elimina sin un reemplazo igual de visible.
- Los iconos son decorativos por defecto. Un control interactivo siempre tiene una etiqueta de texto visible.
- El movimiento es opcional y se desactiva con `prefers-reduced-motion: reduce`.

## Color

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `--paper` | `#f2f4f1` | `#0e1110` | Fondo de página |
| `--surface` | `#fafbf8` | `#151918` | Tarjetas, portadas, badges |
| `--ink` | `#101314` | `#e8ebe6` | Texto principal |
| `--muted` | `#666e69` | `#9aa39d` | Metadatos y texto secundario |
| `--line` | `#d8dcd6` | `#2a302d` | Bordes y separadores |
| `--signal` | `#2447e8` | `#8b9bff` | Acciones, enlaces, foco, marcas |
| `--signal-ink` | `#ffffff` | `#0e1110` | Texto sobre `--signal` |
| `--live` | `#16794f` | `#5bd39a` | Punto de estado live |
| `--wip` | `#8a5300` | `#f0b35a` | Punto de estado en desarrollo |
| `--archived` | `#6c746f` | `#9aa39d` | Punto de estado archivado |

Los colores de estado son puntos decorativos; el estado siempre lleva una etiqueta textual. El texto de los badges usa `--ink` sobre `--surface`.

## Tipografía

| Token | Valor | Rol |
| --- | --- | --- |
| `--font-family-sans` | Archivo, Arial | Índice, navegación, títulos, etiquetas |
| `--font-family-serif` | Source Serif 4, Georgia | Prosa de casos y perfil |
| `--type-display-size` | `clamp(2.75rem, 6vw, 5.5rem)` | Declaración de portada |
| `--type-display-leading` | `0.95` | Interlineado de portada |
| `--type-display-tracking` | `-0.03em` | Tracking de portada |
| `--type-h2-size` | `2rem` | Títulos de sección y página |
| `--type-h2-leading` | `1.1` | Interlineado de H2 |
| `--type-h3-size` | `1.375rem` | Subtítulos |
| `--type-h3-leading` | `1.25` | Interlineado de H3 |
| `--type-row-size` | `1.25rem` | Título de fila de proyecto |
| `--type-row-leading` | `1.3` | Interlineado de fila |
| `--type-body-size` | `1.125rem` | Cuerpo |
| `--type-body-leading` | `1.65` | Interlineado de cuerpo |
| `--type-meta-size` | `0.8125rem` | Metadatos y etiquetas |
| `--type-meta-leading` | `1.3` | Interlineado de metadatos |

Los números de años, conteos y metadatos usan `font-variant-numeric: tabular-nums`. La sans se usa para explorar y estructurar; la serif, para leer. `Prose` es el único componente que activa la serif por defecto.

## Espaciado

| Token | Valor |
| --- | --- |
| `--space-1` | `0.25rem` |
| `--space-2` | `0.5rem` |
| `--space-3` | `0.75rem` |
| `--space-4` | `1rem` |
| `--space-6` | `1.5rem` |
| `--space-8` | `2rem` |
| `--space-12` | `3rem` |
| `--space-16` | `4rem` |
| `--space-24` | `6rem` |
| `--space-32` | `8rem` |

El espaciado pequeño ordena el interior de un componente; `--space-8` a `--space-12` separan bloques; `--space-16` a `--space-32` separan secciones.

## Layout

| Token | Valor | Rol |
| --- | --- | --- |
| `--page-margin` | `clamp(20px, 5vw, 64px)` | Márgenes laterales |
| `--content-max` | `82.5rem` (1320 px) | Ancho máximo |
| `--grid-columns` | `12` | Columnas |
| `--grid-gutter` | `1rem`, `1.5rem` a 640 px, `2rem` a 1200 px | Separación |
| `--measure-prose` | `65ch` | Medida de lectura |
| `--cover-aspect` | `16 / 10` | Proporción de portada |
| `--control-min-size` | `2.75rem` (44 px) | Objetivo táctil mínimo |

Los breakpoints compartidos son 640 px, 900 px y 1200 px. A 900 px el catálogo pasa de una columna a maestro–detalle; a 1200 px crece el gutter.

## Tema

El sitio tiene tres modos: `system`, `light` y `dark`. La preferencia se guarda en una sola clave y se aplica antes del primer pintado.

| Elemento | Valor |
| --- | --- |
| Clave de almacenamiento | `portfolio-theme` |
| Valores guardados | `system`, `light`, `dark` |
| Atributo de tema resuelto | `data-theme="light"` o `data-theme="dark"` |
| Atributo de preferencia | `data-theme-preference="system"`, `"light"` o `"dark"` |
| Media query del sistema | `(prefers-color-scheme: dark)` |
| Esquema nativo | `color-scheme: light` o `color-scheme: dark` |

Un valor ausente o inválido se resuelve como `system`. En modo `system`, `data-theme` sigue la preferencia del sistema y nunca vale `system`.

Las constantes viven en `src/lib/theme-contract.ts`. `src/components/shell/ThemeScript.astro` genera el script inline, sin dependencias, dentro de `<head>` y antes de la hoja de estilos. El control vive en `ThemeControl.astro` y la interacción en `src/scripts/theme.ts`.

### Primer pintado

1. Leer `portfolio-theme` de `localStorage`; si falta, es inválido o el almacenamiento no está disponible, usar `system`.
2. Resolver `system` contra `(prefers-color-scheme: dark)`.
3. Escribir `data-theme`, `data-theme-preference` y `color-scheme` en `<html>`.

Sin JavaScript no hay atributo de tema y se aplica la paleta clara base. La selección manual y el seguimiento del sistema requieren JavaScript.

### Control

`ThemeControl.astro` renderiza un `fieldset` nativo con tres radios llamados `theme`. Cada opción tiene etiqueta visible e icono decorativo:

- `system`: sigue al sistema operativo.
- `light`: siempre claro.
- `dark`: siempre oscuro.

El grupo nativo aporta navegación con flechas, nombre accesible y estado seleccionado. El cambio actualiza los atributos, guarda la preferencia y mantiene los radios sincronizados. En modo `system`, un listener de `matchMedia` vuelve a resolver el tema sin recargar.

## Componentes

| Componente | Responsabilidad |
| --- | --- |
| `Container.astro` | Grid de 12 columnas con márgenes, ancho máximo y gutter. |
| `Section.astro` | Sección semántica con ritmo vertical, eyebrow opcional y H2. |
| `Prose.astro` | Contenedor serif limitado a `--measure-prose`. |
| `ButtonLink.astro` | Enlace con objetivo mínimo de 44 px y variantes `primary`, `secondary`, `quiet`. |
| `MetaLabel.astro` | Metadato pequeño, en mayúsculas y tabular. |
| `StatusBadge.astro` | Etiqueta de estado con punto decorativo. |
| `StackList.astro` | Lista semántica de tecnologías con separadores. |
| `PlaceholderCover.astro` | Portada 16:10 determinista para proyectos sin imagen. |
| `ProjectCover.astro` | Portada real con `srcset`, dimensiones y carga diferida. |
| `Icon.astro` | Iconos inline de 24×24; decorativos salvo que reciban `label`. |

`PlaceholderCover` deriva su geometría del slug con FNV-1a en `src/lib/placeholder-mark.ts`: el mismo proyecto siempre recibe la misma marca. `ProjectCover` usa `astro:assets` y solo la primera portada visible carga con prioridad.

## Shell

- `SkipLink.astro` es el primer elemento enfocable y apunta a `#main`.
- `SiteHeader.astro` contiene nombre, navegación, CV, tema e idioma. A 900 px o más la navegación siempre está visible; por debajo se abre con un `details` nativo y sigue usable sin JavaScript.
- `SiteFooter.astro` contiene email, LinkedIn, GitHub, CV, ubicación y colofón. No incluye teléfono.
- `SeoHead.astro` emite título, descripción, canonical, `hreflang`, Open Graph y Twitter una sola vez por página.
- `PersonJsonLd.astro` añade el `Person` localizado solo en la portada.

## Verificación

```bash
npm run validate:theme
npm run check
npm run build
npx playwright test tests/e2e/theme.spec.ts tests/e2e/quality.spec.ts
```

`npm run validate:theme` comprueba los pares de contraste en ambas paletas y que este documento mencione la clave, los atributos y los tres modos implementados. Se ejecuta en `prebuild`, así que una regresión de contraste o de contrato falla el build.

El detalle de las pruebas de accesibilidad, teclado y movimiento reducido está en `docs/calidad.md`.
