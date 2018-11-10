// @flow
import Color from 'color';

import { COLORS } from '../../constants';

import type { TaskStatus } from '../../types';

export type ColorData = {
  base: string,
  highlight: string,
  pulseBase: string,
  pulseHighlight: string,
  shadowLight: string,
  shadowDark: string,
};

export const getColorsForStatus = (status: TaskStatus): ColorData => {
  switch (status) {
    case 'success': {
      return {
        base: COLORS.green[500],
        highlight: COLORS.lime[500],
        pulseBase: COLORS.green[700],
        pulseHighlight: COLORS.lime[500],
        shadowLight: Color(COLORS.green[900])
          .alpha(0.25)
          .rgb()
          .string(),
        shadowDark: Color(COLORS.green[900])
          .alpha(0.5)
          .rgb()
          .string(),
      };
    }

    case 'failed': {
      return {
        base: COLORS.red[500],
        highlight: COLORS.pink[300],
        pulseBase: COLORS.red[700],
        pulseHighlight: COLORS.pink[500],
        shadowLight: Color(COLORS.red[900])
          .alpha(0.25)
          .rgb()
          .string(),
        shadowDark: Color(COLORS.red[900])
          .alpha(0.5)
          .rgb()
          .string(),
      };
    }

    default:
    case 'idle': {
      return {
        base: COLORS.gray[700],
        highlight: COLORS.gray[500],
        pulseBase: COLORS.gray[700],
        pulseHighlight: COLORS.gray[500],
        shadowLight: Color(COLORS.gray[900])
          .alpha(0.25)
          .rgb()
          .string(),
        shadowDark: Color(COLORS.gray[900])
          .alpha(0.5)
          .rgb()
          .string(),
      };
    }
  }
};
