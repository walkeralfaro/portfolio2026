export function validIntake(): Record<string, any> {
  return {
    slug: 'pokedex',
    year: 'pending',
    category: 'frontend',
    tags: ['pokeapi'],
    status: 'in-development',
    featured: false,
    order: 6,
    stack: ['React 19', 'TypeScript', 'Vite'],
    links: { live: null, code: null },
    cover: null,
    locales: {
      es: {
        title: 'Pokedex',
        summary: 'Explorador de Pokémon.',
        role: 'Desarrollo individual.',
        result: 'Lista y detalle de Pokémon.',
        availability: 'Demo y código pendientes.',
        gallery: [],
      },
      en: {
        title: 'Pokedex',
        summary: 'Pokémon explorer.',
        role: 'Individual development.',
        result: 'Pokémon list and detail.',
        availability: 'Demo and code pending.',
        gallery: [],
      },
    },
  };
}

export function narrative() {
  return {
    problem: 'Faltaba una forma rápida de consultar Pokémon.',
    role: 'Desarrollo individual del proyecto.',
    decisions: [
      'Consumir PokeAPI con un servicio tipado.',
      'Centralizar el estado con Zustand.',
      'Resolver la cadena de evolución de forma recursiva.',
    ],
    result: 'La aplicación permite explorar y consultar los primeros 151 Pokémon.',
  };
}

export function intakeWithNarrative(): Record<string, any> {
  const intake = validIntake();
  intake.locales.es.narrative = narrative();
  intake.locales.en.narrative = {
    problem: 'There was no quick way to browse Pokémon.',
    role: 'Individual development of the project.',
    decisions: [
      'Consume PokeAPI through a typed service.',
      'Centralize state with Zustand.',
      'Resolve the evolution chain recursively.',
    ],
    result: 'The application lets visitors browse and inspect the first 151 Pokémon.',
  };

  return intake;
}
