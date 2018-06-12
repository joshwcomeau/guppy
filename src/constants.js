export const COLORS = {
  hotPink: {
    '500': '#F50057',
    '700': '#C51162',
  },
  pink: {
    '100': '#FF80AB',
    '300': '#ff416c',
    '500': '#f40041',
    '700': '#cc004a',
  },
  red: {
    '500': '#ff4b2b',
    '700': '#c41d00',
    '900': '#5b0400',
  },
  orange: {
    '500': '#FF9100',
    '700': '#FF6D00',
  },
  yellow: {
    '500': '#FFC400',
    '700': '#FFAB00',
  },
  lime: {
    '500': '#C6FF00',
    '700': '#AEEA00',
  },
  lightGreen: {
    '400': '#a0fc20',
    '500': '#69db0d',
    '700': '#64DD17',
  },
  green: {
    '500': '#00E676',
    '700': '#00C853',
    '900': '#007540',
  },
  teal: {
    '500': '#1ce9d1',
    '700': '#00bfb5',
  },
  blue: {
    '500': '#3f6cff',
    '700': '#304FFE',
    '800': '#143a80',
    '900': '#151942',
  },
  violet: {
    '500': '#D500F9',
    '700': '#AA00FF',
  },
  purple: {
    '500': '#651fff',
    '700': '#4919b7',
  },
  gray: {
    '50': '#f8f8f8',
    '100': '#f2f2f2',
    '200': '#eaeaea',
    '300': '#cccccc',
    '400': '#aaaaaa',
    '500': '#888888',
    '600': '#666666',
    '700': '#444444',
    '800': '#2A2A2A',
    '900': '#111111',
  },
  white: '#FFF',
  black: '#000',
};

export const BREAKPOINT_SIZES = {
  xs: 320,
  sm: 540,
  md: 900,
  lg: 1024,
  xl: 1440,
};

export const BREAKPOINTS = {
  xs: `(max-width: ${BREAKPOINT_SIZES.xs}px)`,
  sm: `(max-width: ${BREAKPOINT_SIZES.sm}px)`,
  md: `(max-width: ${BREAKPOINT_SIZES.md}px)`,
  lg: `(max-width: ${BREAKPOINT_SIZES.lg}px)`,
  xl: `(max-width: ${BREAKPOINT_SIZES.xl}px)`,
  xsMin: `(min-width: ${BREAKPOINT_SIZES.xs + 1}px)`,
  smMin: `(min-width: ${BREAKPOINT_SIZES.sm + 1}px)`,
  mdMin: `(min-width: ${BREAKPOINT_SIZES.md + 1}px)`,
  lgMin: `(min-width: ${BREAKPOINT_SIZES.lg + 1}px)`,
  xlMin: `(min-width: ${BREAKPOINT_SIZES.xl + 1}px)`,
  desktop: `(min-width: ${BREAKPOINT_SIZES.sm + 1}px)`,
};

export const Z_INDICES = {
  sidebar: 100,
  modal: 1000,
  titlebar: 10000,
};

// NOTE: This looks private, but it's not :)
// this is meant to be embedded in client-side code.
export const ALGOLIA_KEYS = {
  appId: 'OFCNCOG2CU',
  apiKey: '7492903b80561e70bff1359d7052b4ae',
  indexName: 'npm-search',
};
