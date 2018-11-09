// @flow
import Color from 'color';

import { RAW_COLORS, COLORS } from '../../constants';

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
        base: COLORS.lightSuccess,
        highlight: RAW_COLORS.lime[500],
        pulseBase: COLORS.success,
        pulseHighlight: RAW_COLORS.lime[500],
        shadowLight: Color(RAW_COLORS.green[900])
          .alpha(0.25)
          .rgb()
          .string(),
        shadowDark: Color(RAW_COLORS.green[900])
          .alpha(0.5)
          .rgb()
          .string(),
      };
    }

    case 'failed': {
      return {
        base: RAW_COLORS.red[500],
        highlight: RAW_COLORS.pink[300],
        pulseBase: RAW_COLORS.red[700],
        pulseHighlight: COLORS.lightError,
        shadowLight: Color(RAW_COLORS.red[900])
          .alpha(0.25)
          .rgb()
          .string(),
        shadowDark: Color(RAW_COLORS.red[900])
          .alpha(0.5)
          .rgb()
          .string(),
      };
    }

    default:
    case 'idle': {
      return {
        base: RAW_COLORS.gray[700],
        highlight: RAW_COLORS.gray[500],
        pulseBase: RAW_COLORS.gray[700],
        pulseHighlight: RAW_COLORS.gray[500],
        shadowLight: Color(RAW_COLORS.gray[900])
          .alpha(0.25)
          .rgb()
          .string(),
        shadowDark: Color(RAW_COLORS.gray[900])
          .alpha(0.5)
          .rgb()
          .string(),
      };
    }
  }
};
