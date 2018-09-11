// @flow
import path from 'path';

import { getBaseProjectEnvironment } from './platform.service';

describe('Platform service', () => {
  describe('getBaseProjectEnvironment', () => {
    it('returns a valid PATH', () => {
      const baseEnv = getBaseProjectEnvironment('hello-world', {});

      expect(baseEnv.PATH).toBeTruthy();
      expect(
        baseEnv.PATH.indexOf(path.join('hello-world', 'node_modules', '.bin'))
      ).toBeGreaterThan(0);
    });

    it('includes FORCE_COLOR: true', () => {
      const baseEnv = getBaseProjectEnvironment('hello-world', {});

      expect(baseEnv.FORCE_COLOR).toBe(true);
    });
  });
});
