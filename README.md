# Walker Alfaro — portfolio

Portfolio estático bilingüe construido con Astro y Tailwind CSS. Cada proyecto es una carpeta autocontenida en `projects/`.

## Desarrollo

```sh
npm install
npm run dev
npm run build
```

El sitio se publica como HTML estático. Las rutas base son `/` para español y `/en/` para inglés.

## Proyectos

```text
projects/<slug>/
  README.md              nota de origen
  content.yaml           contenido publicado
  cover.webp             portada opcional
  screenshots/<clave>.webp capturas opcionales
```

- La carpeta es el slug; no hay una lista central de proyectos.
- `content.yaml` es la única fuente de contenido publicado.
- La portada se detecta automáticamente.
- Añadir un proyecto no requiere tocar rutas ni configuración de Astro.

Para añadir un proyecto, usa la skill `add-project` o el comando `/add-project`, o crea el archivo base con:

```bash
npm run project:new -- <slug>
```

Después completa `content.yaml` y valida:

```bash
npm run validate:content
npm run content:status
npm run check
npm run build
```

El contrato de contenido está en [docs/contenido.md](docs/contenido.md). El inventario se consulta con `npm run content:status`, no se mantiene escrito a mano.

## Documentación

- [docs/contenido.md](docs/contenido.md): modelo de contenido, imágenes, skill y validación.
- [docs/arquitectura.md](docs/arquitectura.md): rutas, i18n, catálogo, detalle y scripts.
- [docs/diseno.md](docs/diseno.md): tokens, tipografía, layout y contrato de tema.
- [docs/calidad.md](docs/calidad.md): pruebas, accesibilidad, rendimiento y despliegue.
- [projects/README.md](projects/README.md): flujo corto para añadir proyectos.

## Configuración

`astro.config.mjs` fija `site` en `https://walkeralfaro.com` para canonical, sitemap y metadatos. El CV es externo en `https://resume.walkeralfaro.com/`.
