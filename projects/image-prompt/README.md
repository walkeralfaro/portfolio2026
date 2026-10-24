# Image Prompt · Generador de Prompts 7 Líneas

App web en forma de cuestionario guiado que construye un **prompt optimizado de 7 líneas** para generadores de imágenes con IA (ChatGPT Images, DALL-E, Midjourney).

Evita la “cara genérica de IA” (brochazos, pan de oro, destellos, lemas inventados) y produce un texto listo para copiar o descargar en Markdown.

## Links

- live: https://image-prompt-mauve.vercel.app/
- codigo: https://github.com/walkeralfaro/image-prompt

## Year

2026 agosto

## El método 7 líneas

El prompt final sigue siempre este orden estricto:

```text
Formato: [proporción y orientación]
Qué es: [tipo de imagen y para qué se usará]
Tema: [contenido, escena o composición principal]
Estilo: [movimiento, tradición o técnica con nombre propio]
Texto exacto: "[texto 1]", "[texto 2]" y ningún otro texto
Tipografía y paleta: [fuente y 2-3 colores concretos]
Evita: [exclusiones del tema]. Textura desgastada, pinceladas secas, líneas de velocidad, rayos decorando elementos y subrayados de pincel
```

Reglas del motor (`src/utils/formatPrompt.ts`, `src/data/antiTropesData.ts`):

1. **Sin adjetivos vacíos:** prohibido `bonito, moderno, profesional, impactante`. Se exige estilo con nombre propio: Swiss, Constructivismo, Bauhaus, Memphis, Risografía, Ukiyo-e, etc.
2. **Cierre anti-texto basura:** la línea 5 añade automáticamente `y ningún otro texto`, o permite modo `Sin texto en la imagen base (se maquetará en editor externo)`.
3. **Antiguía fija:** la línea 7 termina siempre con `Textura desgastada, pinceladas secas, líneas de velocidad, rayos decorando elementos y subrayados de pincel`, más filtros por temática (Arte, Libros, Fiestas, Deportes, Verano, Concierto, Tech).

Ejemplo de salida:

```text
Formato: Vertical 4:5
Qué es: Cartel de exposición
Tema: Objeto o sujeto central único con datos clave
Estilo: Swiss / International Typographic Style
Texto exacto: "JAZZ EN EL PARQUE", "12 JUL · 20H", "Parque Central" y ningún otro texto
Tipografía y paleta: Sans-serif recta; rojo, negro y crema
Evita: Banderines, farolillos, fuegos artificiales, degradados. Textura desgastada, pinceladas secas, líneas de velocidad, rayos decorando elementos y subrayados de pincel
```

## Funcionalidades

- Cuestionario en 7 pasos + pantalla de revisión (paso 8) y resultado final.
- Opciones predefinidas + respuesta personalizada en cada paso.
- Catálogo de 17 estilos (`src/data/stylesCatalog.ts`): Movimientos, Tradiciones, Técnicas/Digital y Mezclas.
- Filtros anti-tópicos por 7 temáticas (`src/data/antiTropesData.ts`).
- Vista previa en vivo del prompt mientras respondes.
- Detector de adjetivos vacíos.
- Proyectos múltiples, borradores por proyecto, historial de prompts e idioma ES/EN (`formatPromptEn.ts`).
- Persistencia local con Zustand + `persist` (sin backend).
- Tema claro/oscuro.
- Exportación: copiar al portapapeles (`src/hooks/useCopyToClipboard.ts`) y descargar `.md` con prompt + guía de uso.
- Iconografía Lucide, estilos Tailwind CSS v4.

## Flujo de la app / Rutas

Definidas en `src/routes/AppRoutes.tsx`:

| Ruta | Página | Descripción |
|---|---|---|
| `/` | `HomePage` | Landing, explicación del método e inicio |
| `/cuestionario` | `QuestionnairePage` | Pasos 1-7: Formato, Qué es, Tema, Estilo, Texto exacto, Tipografía y paleta, Evita |
| `/revision` | `ReviewPage` | Paso 8: resumen editable antes de generar |
| `/resultado` | `ResultPage` | Prompt final ES/EN, copiar y descargar `.md` |
| `*` | redirect `/` | — |

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19 + TypeScript + Vite 8 |
| Rutas | React Router v7 declarativo (`BrowserRouter`, `Routes`, `Route`) |
| Estilos | Tailwind CSS v4 + `@tailwindcss/vite` |
| Estado | Zustand v5 (`usePromptStore`, `useProjectsStore`, `useThemeStore`) |
| Iconos | Lucide React |
| Utils | `clsx`, `tailwind-merge` |
| Lint | Oxlint |

Ver versiones exactas en `package.json`.

## Requisitos

- Node.js 20+ (recomendado LTS)
- npm 10+

## Instalación y uso

```bash
# instalar dependencias
npm install

# desarrollo con HMR
npm run dev

# compilación + build producción (tsc + vite)
npm run build

# previsualizar build
npm run preview

# lint
npm run lint
```

Abre `http://localhost:5173` (puerto por defecto de Vite).

### Uso típico

1. Entra en `/cuestionario` y completa los 7 pasos.
2. En cada paso puedes elegir una tarjeta o escribir tu opción personalizada.
3. Paso 5: añade uno o varios textos (se entrecomillan solos) o activa “sin texto”.
4. Paso 7: marca una o varias temáticas para añadir sus anti-tópicos.
5. Revisa en `/revision`, confirma y ve a `/resultado`.
6. Copia el prompt o descarga `prompt_*.md` para pegarlo en ChatGPT / DALL-E / Midjourney en un chat nuevo.

Buenas prácticas incluidas en el `.md` exportado: usar chat nuevo, adjuntar foto de referencia si hay marca/producto, revisar tildes y re-maquetar en Canva/Figma si la IA falla el texto.

## Estructura del proyecto

```text
src/
├── App.tsx                 # <AppRoutes />
├── main.tsx                # bootstrap + initTheme()
├── index.css               # Tailwind v4
├── components/
│   ├── layout/             # Header, Footer, Layout
│   ├── questionnaire/     # StepCard, OptionCard, CustomInput, LivePreview, ProgressTracker...
│   ├── result/            # visor Markdown, botones copiar/descargar, guía
│   ├── history/           # historial de prompts
│   └── projects/          # selector/CRUD de proyectos
├── routes/
│   ├── AppRoutes.tsx
│   └── pages/             # Home, Questionnaire, Review, Result
├── store/
│   ├── usePromptStore.ts  # paso actual, answers/customAnswers, textList, topics, historial
│   ├── useProjectsStore.ts# proyectos múltiples + proyecto activo
│   └── useThemeStore.ts   # claro/oscuro
├── data/
│   ├── stepsData.ts       # config de los 7 pasos
│   ├── stylesCatalog.ts   # 17 estilos
│   └── antiTropesData.ts  # tópicos por tema + FIXED_ANTI_GUIDE
├── hooks/
│   └── useCopyToClipboard.ts
├── utils/
│   ├── formatPrompt.ts    # generateOptimizedPrompt + generateMarkdownDocument
│   ├── formatPromptEn.ts  # versión EN
│   └── cn.ts              # clsx + tailwind-merge
└── assets/
```

## Personalización

- **Pasos/opciones:** edita `src/data/stepsData.ts` (`StepConfig`, `StepOption`). El campo `value: 'custom'` reserva la opción libre.
- **Estilos:** añade entradas en `src/data/stylesCatalog.ts` con `name, category, description`.
- **Anti-tópicos:** amplía `TOPICS`, `antiTropesData` y `TOPIC_EXAMPLES` en `src/data/antiTropesData.ts`. La constante `FIXED_ANTI_GUIDE` no debería cambiarse (es parte del método).
- **Motor:** `generateOptimizedPrompt({ answers, customAnswers, textList, noText, selectedTopics })` en `src/utils/formatPrompt.ts`.

## Estado y persistencia

`usePromptStore` guarda `currentStep, answers, customAnswers, textList, noText, selectedTopics, projectName, confirmedSteps, history, projectDrafts` con `zustand/middleware persist` en `localStorage`. Cada proyecto conserva su borrador independiente vía `useProjectsStore`.
