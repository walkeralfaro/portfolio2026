# Cheatsheet Editor

Una aplicación web para crear, organizar y administrar cheat sheets de atajos de teclado.
Todo se guarda localmente en tu navegador — 100% local, sin servidores, sin registro, sin Internet necesaria.

> Built with **Astro** + **React** + **Tailwind CSS v4** + **TypeScript**.

---

## Links

- live: https://cheatsheet.walkeralfaro.com/
- codigo: https://github.com/walkeralfaro/cheatsheet-editor

## Year

2026 julio

## Cómo funciona

La aplicación tiene tres áreas principales:

| Panel lateral | Editor | Vista previa |
|---|---|---|
| Lista tus cheat sheets. Creá nuevas, renombrálas, borralas. | Agregá secciones y dentro de cada una agregá atajos: la combinación de teclas y qué hace. | Una tabla limpia que muestra todos los atajos agrupados por sección. Ideal para imprimir o consultar rápido. |

### Flujo rápido

1. **New Cheatsheet** desde la barra superior
2. **Add Section** — ej: "File Operations", "Text Editing"
3. **Add Shortcut** — escribí la tecla (ej: `Ctrl+S`) y la acción (ej: "Save file")
4. **Editá inline** — hacé clic directo sobre cualquier tecla o acción en la tabla de preview para modificarlo
5. **Imprimí** — la vista previa tiene un layout optimizado para papel (2 columnas, sin colores de fondo innecesarios)

## Características

- **Múltiples cheat sheets** — cada una con sus propias secciones y atajos
- **Edición inline** — clickeá sobre el texto en la tabla y editalo al instante
- **Vista previa en vivo** — los cambios aparecen al instante en formato tabla con agrupación por secciones
- **Modo oscuro** — se adapta automáticamente a la preferencia de tu sistema, sin flash al cargar la página
- **Imprimible** — diseño optimizado para PDF, 2 columnas, listo para llevar
- **100% local** — todo se guarda en el navegador (localStorage). Sin backend, sin registro, sin Internet

## Tech Stack

| | |
|---|---|
| Framework | [Astro](https://astro.build/) + [React](https://react.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Storage | localStorage (100% cliente) |

## Desarrollo

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo → http://localhost:4321
npm run build      # compilar para producción → dist/
npm run preview    # previsualizar el build
```

## Estructura del proyecto

```
src/
├── components/     # Componentes React (App, ShortcutCard, LivePreview, Editor, Sidebar, Toolbar)
├── layouts/        # Layout Astro con detección de tema oscuro
├── lib/            # Tipos, reducer, lógica de almacenamiento
├── pages/          # index.astro (punto de entrada)
└── styles/         # CSS global con tokens de Tailwind
```
