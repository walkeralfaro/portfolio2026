# Proyectos

Cada carpeta de este directorio es un proyecto del portfolio. El nombre de la carpeta es el slug público y debe ser kebab-case en minúsculas.

```text
<slug>/
  README.md              nota de origen, solo procedencia
  content.yaml           contenido publicado en español e inglés
  cover.webp             portada opcional, detectada automáticamente
  screenshots/<clave>.webp capturas opcionales de la galería
```

## Añadir un proyecto

1. Confirmar el slug y la fuente.
2. Crear el archivo base:

   ```bash
   npm run project:new -- <slug>
   ```

   El script copia la plantilla de `.opencode/skills/add-project/assets/content.template.yaml` y asigna el siguiente `order`.

3. Leer `README.md` y completar `content.yaml`. No inventar años, enlaces, capturas ni resultados.
4. Copiar las imágenes locales si existen.
5. Validar:

   ```bash
   npm run validate:content
   npm run content:status
   npm run check
   npm run build
   ```

6. Revisar `/work/<slug>/` y `/en/work/<slug>/`.

También puedes pedir la skill `add-project` o usar el comando `/add-project`, que sigue el mismo flujo y conoce el esquema completo.

## Reglas rápidas

- El slug de `content.yaml` debe coincidir con la carpeta.
- `month` (1–12) es obligatorio cuando `year` es numérico y debe omitirse cuando `year` es `pending`.
- El catálogo se ordena por fecha descendente, usando `order` como desempate.
- `locales.es` y `locales.en` son obligatorios.
- `availability` es obligatoria cuando no hay enlace de demo ni de código.
- `narrative` es opcional, pero debe existir en ambos idiomas o en ninguno.
- `gallery: []` cuando no hay capturas.
- No hay campo `cover`: el archivo `cover.webp` es la portada.
- No se edita ninguna lista central de slugs.

El contrato completo está en [../docs/contenido.md](../docs/contenido.md).
