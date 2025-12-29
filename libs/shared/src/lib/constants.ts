// API Configuration
export const API_ENDPOINTS = {
  NEOWS: '/neows',
  ASTEROIDS: '/asteroids',
} as const;

// Solar System Constants (in AU for real distances, scaled for visualization)
export const SOLAR_SYSTEM = {
  // Planets orbital radii (scaled for visualization)
  ORBITAL_RADII: {
    MERCURY: 80,
    VENUS: 120,
    EARTH: 160,
    MARS: 220,
    JUPITER: 320,
    SATURN: 420,
    URANUS: 520,
    NEPTUNE: 620,
  },

  // Planet colors
  COLORS: {
    SUN: '#FFD700',
    MERCURY: '#8C7853',
    VENUS: '#FFC649',
    EARTH: '#6B93D6',
    MARS: '#CD5C5C',
    JUPITER: '#D8CA9D',
    SATURN: '#FAD5A5',
    URANUS: '#4FD0E7',
    NEPTUNE: '#4B70DD',
    MOON: '#C0C0C0',
    ASTEROID: '#8C8C8C',
  },

  // Planet sizes (scaled for visualization)
  RADII: {
    SUN: 30,
    MERCURY: 4,
    VENUS: 6,
    EARTH: 8,
    MARS: 6,
    JUPITER: 20,
    SATURN: 16,
    URANUS: 12,
    NEPTUNE: 12,
    MOON: 3,
  },
} as const;

// Viewport Constants
export const VIEWPORT_LIMITS = {
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 5,
  DEFAULT_ZOOM: 1.5,
} as const;
