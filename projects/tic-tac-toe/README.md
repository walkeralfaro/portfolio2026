# Tic-Tac-Toe (Tres en Línea)

Juego clásico de tres en línea implementado con React 19 y Next.js 16.

## Descripción

El jugador compite contra otro jugador (local) en un tablero de 3x3. Los jugadores alternan turnos colocando "X" y "O" hasta que alguien forme una línea de tres o se declare empate.

## Links

- live: https://tictactoe-walker.vercel.app/
- codigo: https://github.com/walkeralfaro/tictactoe

## Year

2025

## Arquitectura

### Componentes

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| `Game` | `components/game.tsx` | Componente principal que gestiona el estado global del juego |
| `Board` | `components/board.tsx` | Renderiza el tablero 3x3 y muestra el estado actual |
| `Square` | `components/square.tsx` | Celda individual del tablero |
| `MiniBoard` | `components/mini-board.tsx` | Versión miniatura del tablero para el historial |

### Tipos

```typescript
type SquareValue = "X" | "O" | null
```

### Utilidades

- `lib/calculateWinner.ts` - Verifica las 8 combinaciones ganadoras (3 horizontales, 3 verticales, 2 diagonales)

## Estado y Gestión

### Estado Principal (Game.tsx)

```typescript
const [history, setHistory] = useState<SquareValue[][]>(initialHistory)
const [currentMove, setCurrentMove] = useState(0)
const [isHistoryOpen, setIsHistoryOpen] = useState(false)
```

- **history**: Array de estados del tablero en cada movimiento
- **currentMove**: Índice del movimiento actual (permite "viaje en el tiempo")
- **isHistoryOpen**: Controla el panel de historial en móvil

### Estado Derivado

```typescript
const xIsNext = currentMove % 2 === 0
const currentSquares = history[currentMove]
const winner = calculateWinner(currentSquares)
const isDraw = !winner && currentSquares.every(square => square !== null)
```

## Características

- **Turnos alternados**: Los jugadores X y O alternan automáticamente
- **Detector de ganador**: Notifica cuando un jugador forma 3 en línea
- **Detector de empate**: Detecta cuando el tablero está lleno sin ganador
- **Historial de movimientos**: Panel lateral con mini-tableros de cada estado
- **Viaje en el tiempo**: Click en cualquier movimiento del historial para revisar
- **Notificaciones toast**: Muestra el resultado con `sonner`
- **Diseño responsivo**: Adaptable a móvil y escritorio
- **Reiniciar juego**: Botón para empezar de nuevo

## Lógica del Juego

### Verificación de Ganador

```typescript
const lines = [
  [0, 1, 2], // horizontal
  [3, 4, 5], // horizontal
  [6, 7, 8], // horizontal
  [0, 3, 6], // vertical
  [1, 4, 7], // vertical
  [2, 5, 8], // vertical
  [0, 4, 8], // diagonal
  [2, 4, 6], // diagonal
];
```

### Manejo de Movimiento

1. Se verifica si la celda está vacía y no hay ganador/empate
2. Se crea una copia inmutable del array de celdas
3. Se asigna "X" u "O" según el turno
4. Se actualiza el historial y el movimiento actual

## Tecnologías

- **React 19** - Biblioteca de UI
- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos
- **sonner** - Notificaciones toast
- **next/font** - Fuente Geist

## Estilos

- Colores: X = cyan-400, O = pink-400
- Fondo: slate-900 (modo oscuro)
- Bordes: slate-700
- Animaciones: transiciones suaves y bounce en celdas
