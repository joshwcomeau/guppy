export const COLORS = {
  pink: {
    '100': '#FF80AB',
    '300': '#FF4081',
    '500': '#f40088',
    '700': '#cc0072',
  },
  red: {
    '500': '#EF5350',
    '700': '#D50000',
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
  green: {
    '500': '#00E676',
    '700': '#00C853',
  },
  blue: {
    '500': '#3D5AFE',
    '700': '#304FFE',
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
