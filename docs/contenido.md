# Contenido

Cada proyecto del portfolio es una carpeta autocontenida bajo `projects/`. No hay un inventario central, un importador ni archivos generados: la carpeta y su `content.yaml` son la única fuente de verdad.

## Estructura de un proyecto

```text
projects/<slug>/
  README.md              nota de origen, solo procedencia
  content.yaml           contenido publicado del proyecto
  cover.webp             portada opcional, detectada automáticamente
  screenshots/<clave>.webp capturas opcionales de la galería
```

El nombre de la carpeta es el slug y debe ser kebab-case en minúsculas, por ejemplo `rest-countries-explorer`. El slug de `content.yaml` debe coincidir exactamente con la carpeta.

`README.md` conserva el material de origen. Se lee para redactar el contenido, pero no se renderiza ni se reescribe.

## `content.yaml`

El esquema se define en `src/lib/content/schema.ts` y se valida con Zod. Es estricto: un campo desconocido falla la validación.

| Campo | Tipo | Regla |
| --- | --- | --- |
| `slug` | string | Kebab-case; igual al nombre de la carpeta. |
| `year` | entero o `pending` | `pending` cuando la fuente no documenta fecha. Nunca se adivina. |
| `category` | `ia` \| `producto` \| `frontend` \| `juegos` | Categoría principal del catálogo. |
| `tags` | string[] | Al menos una etiqueta de recuperación. |
| `status` | `live` \| `in-development` \| `archived` | Estado de disponibilidad, no un resultado de negocio. |
| `featured` | boolean | Entre uno y cuatro proyectos destacados en total. |
| `order` | entero positivo | Orden único en el catálogo. |
| `stack` | string[] | Entre tres y cinco tecnologías. |
| `links.live` | URL o `null` | Solo una URL real de despliegue. |
| `links.code` | URL o `null` | Solo una URL real de repositorio. |
| `locales.es` | objeto | Copia en español. |
| `locales.en` | objeto | Copia en inglés. |

Cada objeto de locale contiene:

| Campo | Obligatorio | Regla |
| --- | --- | --- |
| `title` | sí | Título del proyecto en ese idioma. |
| `summary` | sí | Una frase clara sobre qué es el proyecto. |
| `role` | sí | Rol desempeñado. |
| `result` | sí | Resultado o alcance implementado. |
| `availability` | no | Obligatorio cuando ambos enlaces son `null`; debe existir en los dos idiomas o en ninguno. |
| `gallery` | no | Lista ordenada de `{ src, alt }`; por defecto `[]`. |
| `narrative` | no | Bloque Problema / Rol / Decisiones / Resultado; debe existir en los dos idiomas o en ninguno. |

```yaml
slug: mi-proyecto
year: 2026
category: producto
tags: [productividad, accesibilidad]
status: live
featured: false
order: 14
stack: [Astro, TypeScript, SQLite]
links:
  live: https://example.com
  code: https://github.com/example/mi-proyecto
locales:
  es:
    title: Mi proyecto
    summary: Una aplicación que resuelve un flujo concreto.
    role: Diseño y desarrollo individual.
    result: El flujo principal funciona de extremo a extremo.
    gallery: []
  en:
    title: My project
    summary: An application that solves a specific workflow.
    role: Individual design and development.
    result: The main workflow works end to end.
    gallery: []
```

### Narrativa opcional

La narrativa enriquece la página de detalle. No es obligatoria y no decide si el proyecto existe, si tiene portada o si muestra acciones.

```yaml
narrative:
  problem: |
    Qué problema existía y por qué importaba.
  role: |
    Qué parte del trabajo asumió el autor.
  decisions:
    - title: Nombre corto de la decisión
      body: |
        Por qué se tomó y qué cambió.
    - title: Otra decisión
      body: |
        ...
    - title: Tercera decisión
      body: |
        ...
  result: |
    Qué quedó funcionando y qué se aprendió.
```

Reglas:

- `decisions` debe tener entre tres y cuatro elementos.
- Cada decisión tiene `title` y `body`.
- La narrativa existe en `locales.es` y `locales.en`, o en ninguno.
- No se añaden secciones de Stack ni de Galería: el stack se renderiza una sola vez en la cabecera y la galería sale de `gallery`.
- El inglés es una traducción del español, no una fuente nueva de afirmaciones.

Sin narrativa, la página de detalle renderiza `summary`, `role` y `result` como secciones comunes.

## Imágenes

Las imágenes viven dentro de la carpeta del proyecto y las procesa Astro en formato WebP. Nunca se enlazan desde fuera.

| Tipo | Ruta | Regla |
| --- | --- | --- |
| Portada | `projects/<slug>/cover.webp` | Una por proyecto. |
| Captura | `projects/<slug>/screenshots/<clave>.webp` | Muchas por proyecto; la clave es el nombre sin extensión. |

- La portada se detecta automáticamente. No existe un campo `cover`.
- Si no hay portada, todas las superficies usan la portada de reemplazo diseñada.
- La galería se declara por locale con `src: <clave>` y un `alt` descriptivo en el idioma de la página.
- Una clave sin archivo correspondiente falla la validación.
- Un archivo que ningún locale referencia se reporta como aviso, no como error.
- La portada se recorta a 16:10; las capturas conservan su proporción.
- Una locale sin capturas deja `gallery: []` y no renderiza sección, texto pendiente ni sustituto.

## Añadir un proyecto

El flujo recomendado usa la skill `add-project` o el comando `/add-project`:

1. Confirmar el slug y si es un proyecto nuevo o una actualización.
2. Crear la carpeta y el `content.yaml` desde la plantilla:

   ```bash
   npm run project:new -- <slug>
   ```

   El script copia `.opencode/skills/add-project/assets/content.template.yaml` y asigna el siguiente `order`.

3. Leer `projects/<slug>/README.md` y completar todos los campos en español e inglés.
4. Copiar imágenes locales si existen: `cover.webp` y `screenshots/<clave>.webp`.
5. Validar y revisar.

La plantilla canónica es `.opencode/skills/add-project/assets/content.template.yaml`. El ejemplo completo y válido es `.opencode/skills/add-project/assets/content.example.yaml`.

No se edita ninguna lista de slugs, ningún archivo de rutas ni `src/content.config.ts` para añadir un proyecto. El catálogo descubre cada `projects/*/content.yaml`.

## Inventario

El inventario no está escrito a mano en la documentación ni en el código. Se consulta con:

```bash
npm run content:status
```

El comando recorre `projects/`, muestra una tabla con `order`, `slug`, `category`, `status` y `featured`, y lista las carpetas sin `content.yaml` o con contenido inválido. Es la vista operativa del catálogo.

## Validación

`npm run validate:content` comprueba:

- Que cada `content.yaml` cumple el esquema estricto.
- Que el slug coincide con la carpeta.
- Que no quedan marcadores `<...>` ni `TODO`.
- Que `order` es único y que hay entre uno y cuatro destacados.
- Que cada locale tiene enlace o nota de disponibilidad.
- Que las galerías apuntan a claves existentes.
- Que el inglés no contiene fragmentos españoles evidentes.
- Que no aparece el trabajo de cliente excluido.

El comando permite cero proyectos para que el build funcione mientras se redacta el contenido. Cuando haya proyectos, también informa de imágenes de galería sin usar.

```bash
npm run validate:content
npm run content:status
npm run check
npm run build
```

`npm run build` ejecuta además las validaciones de CV, tema e i18n a través de `prebuild`.
