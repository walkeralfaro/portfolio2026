# Pokedex

Explora los primeros 151 Pokémon con información detallada incluyendo tipos, peso, movimientos y cadena de evolución.

## Tech Stack

- **React** 19 - Librería UI
- **TypeScript** - Seguridad de tipos
- **Vite** 8 - Herramienta de build
- **TailwindCSS** 4 - Estilos
- **Zustand** 5 - Gestión de estado
- **React Router** 7 - Navegación
- **Axios** - Cliente HTTP
- **Zod** 4 - Validación de esquemas

## Inicio rápido

```bash
npm install
npm run dev
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Build para producción |
| `npm run lint` | Analizar código |
| `npm run preview` | Previsualizar build de producción |

## Características

- **Lista de Pokémon** - Vista en grid de los 151 Pokémon
- **Detalle de Pokémon** - Página con información completa
- **Badges de tipos** - Indicadores visuales de tipo
- **Cadena de evolución** - Visualización interactiva de evoluciones
- **Navegación** - Botones de inicio y página anterior

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── footer.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── ...
├── services/         # Integraciones con API
│   └── pokeapi.ts
├── schemas/          # Esquemas de Zod
├── store.ts          # Gestión de estado con Zustand
├── route.tsx        # Configuración de React Router
└── views/            # Componentes de página
    ├── Home.tsx
    └── Pokemon.tsx
```

## Detalles Técnicos

### Zustand State Management

El store (`store.ts`) usa el patrón de **proxy-based state** de Zustand:

```typescript
type PokemonsStore = {
  error: string | null;
  pokemon: Pokemon | null;
  pokemons: SimplePokemon[];
  evolutionChain: Species[] | null;
  fetchPokemons: () => Promise<void>;
  fetchPokemonByName: (name: string) => Promise<void>;
};

export const usePokemonsStore = create<PokemonsStore>((set) => ({
  // estado inicial
  error: null,
  pokemon: null,
  pokemons: [],
  evolutionChain: null,
  
  // acciones
  fetchPokemons: async () => {
    const pokemons = await getPokemons();
    set({ pokemons });
  },
  // ...
}));
```

**Patrón usado:**
- **Centralized store** - Un solo store para toda la app
- **Actions as functions** - Las funciones de fetch son parte del store
- **Partial updates** - `set()` permite actualizar solo propiedades necesarias
- **Type safety** - Tipado completo con TypeScript

### Recursive Evolution Chain Parser

La función `extractEvolutionChain` en `utils/evolution.ts` procesa el JSON anidado de PokeAPI:

```typescript
type EvolutionNode = {
  species: Species
  evolves_to: EvolutionNode[];
};

export function extractEvolutionChain(chain: EvolutionNode): Species[] {
  const result: Species[] = [];

  function traverse(node: EvolutionNode) {
    result.push({ name: node.species.name, url: node.species.url });
    if (node.evolves_to.length > 0) {
      node.evolves_to.forEach(traverse);
    }
  }

  traverse(chain);
  return result;
}
```

**Cómo funciona:**
1. **Tipo recursivo** - `EvolutionNode` contiene `evolves_to: EvolutionNode[]`
2. **DFS (Depth-First Search)** - Recorre el árbol en profundidad
3. **Extracción lineal** - Convierte estructura arbórea a array plano
4. **Maneja ramificaciones** - `forEach` procesa todas las evoluciones posibles

**Ejemplo del JSON de PokeAPI:**
```json
{
  "chain": {
    "species": { "name": "bulbasaur", "url": "..." },
    "evolves_to": [
      {
        "species": { "name": "ivysaur", "url": "..." },
        "evolves_to": [...]
      }
    ]
  }
}
```

## API

Datos proporcionados por [PokeAPI](https://pokeapi.co/)

## Autor

**[Walker Alfaro](https://www.walkeralfaro.com)**