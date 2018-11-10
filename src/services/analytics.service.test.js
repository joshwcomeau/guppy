/* eslint-disable flowtype/require-valid-file-annotation */
import mixpanel from 'mixpanel-browser'; // Mocked

import electronStore from './electron-store.service';
import { createLogger, MIXPANEL_KEY } from './analytics.service';

jest.mock('uuid/v1', () => () => 'mocked-uuid-v1');

describe('Analytics service', () => {
  beforeEach(() => {
    mixpanel.init.mockClear();
    mixpanel.identify.mockClear();
    mixpanel.track.mockClear();
    electronStore.get.mockClear();
    electronStore.set.mockClear();
    electronStore.clear();
  });

  describe('initialization', () => {
    it('calls the right Mixpanel methods', () => {
      createLogger();

      // Should initialize once, only passing the MIXPANEL_KEY as an argument.
      expect(mixpanel.init.mock.calls).toEqual([[MIXPANEL_KEY]]);

      // Should try to find the distinct ID from electron-store, but come up
      // empty-handed
      expect(electronStore.get.mock.calls).toEqual([['distinct-id']]);
      expect(electronStore.get.mock.results).toEqual([
        { isThrow: false, value: undefined },
      ]);

      const GENERATED_UUID = 'mocked-uuid-v1';

      // It generates a UUID and sets it in the store
      expect(electronStore.set.mock.calls).toEqual([
        ['distinct-id', GENERATED_UUID],
      ]);

      // Finally, it sets that value for mixpanel's identification
      expect(mixpanel.identify.mock.calls).toEqual([[GENERATED_UUID]]);
    });
  });

  describe('logEvent', () => {
    it('logs to the console in development', () => {
      const logger = createLogger('development');

      const consoleInfoOriginal = global.console.info;

      try {
        global.console.info = jest.fn();

        logger.logEvent('load-application', null);

        expect(console.info).toBeCalled();
        expect(mixpanel.track).not.toBeCalled();
      } finally {
        // restore `console.info` to its original function
        global.console.info = consoleInfoOriginal;
      }
    });

    it('tracks the supplied event', () => {
      const logger = createLogger('production');

      const consoleInfoOriginal = global.console.info;

      try {
        global.console.info = jest.fn();

        logger.logEvent('load-application', {
          hello: 'world',
          hi: 5,
        });

        expect(console.info).not.toBeCalled();
        expect(mixpanel.track.mock.calls).toEqual([
          ['load-application', { hello: 'world', hi: 5 }],
        ]);
      } finally {
        // restore `console.info` to its original function
        global.console.info = consoleInfoOriginal;
      }
    });

    it('does not track when the user has opted out', () => {
      mixpanel.has_opted_out_tracking = jest.fn(() => true);

      const logger = createLogger('production');

      logger.logEvent('load-application', {
        hello: 'world',
        hi: 5,
      });

      expect(mixpanel.track).not.toBeCalled();
    });
  });
});
