/* eslint-disable flowtype/require-valid-file-annotation */
import path from 'path';

import { getBaseProjectEnvironment, isWin } from './platform.service';

const pathKey = isWin ? 'Path' : 'PATH';

describe('Platform service', () => {
  describe('getBaseProjectEnvironment', () => {
    it('returns a valid PATH', () => {
      const baseEnv = getBaseProjectEnvironment('hello-world', {});

      expect(baseEnv[pathKey]).toBeTruthy();
      expect(
        baseEnv[pathKey].indexOf(
          path.join('hello-world', 'node_modules', '.bin')
        )
      ).toBeGreaterThan(0);
    });

    it('includes FORCE_COLOR: true', () => {
      const baseEnv = getBaseProjectEnvironment('hello-world', {});

      expect(baseEnv.FORCE_COLOR).toBe(true);
    });
  });
});
