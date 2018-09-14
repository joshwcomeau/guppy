// @flow
/**
 * We currently use Mixpanel for our analytics.
 *
 * The goal of this file is to abstract that API, so that it can easily be
 * swapped in the future for a different provider.
 */

import mixpanel from 'mixpanel-browser';
import uuid from 'uuid/v1';

import electronStore from './electron-store.service';

export const MIXPANEL_KEY = '5840a1a4b9bdcdb518471f0e0830baa2';
const DISTINCT_ID_KEY = 'distinct-id';

export type EventType =
  | 'load-application'
  | 'create-project'
  | 'import-project'
  | 'select-project'
  | 'run-task'
  | 'add-dependency'
  | 'update-dependency'
  | 'delete-dependency'
  | 'clear-console'
  | 'delete-project';

export const createLogger = (environment?: ?string = process.env.NODE_ENV) => {
  mixpanel.init(MIXPANEL_KEY);

  // Every user is given a distinct ID so that we can track return visits.
  // Because electron doesn't persist cookies, we have to do this ourselves.
  let distinctId = electronStore.get(DISTINCT_ID_KEY);
  if (!distinctId) {
    distinctId = uuid();
    electronStore.set(DISTINCT_ID_KEY, distinctId);
  }

  mixpanel.identify(distinctId);

  return {
    logEvent: (event: EventType, data: any) => {
      if (environment !== 'production') {
        console.info('Event tracked', event, data);
        return;
      }

      if (mixpanel.has_opted_out_tracking()) {
        return;
      }

      mixpanel.track(event, data);
    },
  };
};

// Export a singleton so that multiple modules can use the same instance.
// We'll only ever want to create alternatives in tests.
export default createLogger();
