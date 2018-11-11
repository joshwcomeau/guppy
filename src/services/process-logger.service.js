// @flow
import { LOGGING } from '../config/app';

import type { ChildProcess } from 'child_process';

export const processLogger = (child: ChildProcess, label: string) => {
  if (!LOGGING || process.env.NODE_ENV === 'production') {
    return; // no logging
  }

  if (!child.stdout) {
    return; // needed during tests
  }

  // Todo: Handle color codes in logging to console (if supported). There are many control characters in the console output.
  child.stdout.on('data', data => {
    // data is an uint8 array --> decode to string
    console.log('[%s]: %s', label, data.toString());
  });

  child.stderr.on('data', data => {
    console.error('[%s]: %s', label, data.toString());
  });
};
