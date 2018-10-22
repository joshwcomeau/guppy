// @flow
/**
 * Find a clear port to run a server on.
 *
 * NOTE: Initially, we tried to copy create-react-app's approach, using the
 * `detect-port-alt` NPM package. For some reason, maybe involving electron,
 * that module didn't work; it would create a test server, but they'd hang;
 * no errors called, but no listeners called either.
 *
 * Instead, we're using platform-specific OS tools:
 * - `lsof` on Mac/Linux
 * - `netstat` on Windows
 */
import * as childProcess from 'child_process';
import { isWin } from './platform.service';

const MAX_ATTEMPTS = 15;

export default () =>
  new Promise<number>((resolve, reject) => {
    const checkPort = (port = 3000, attemptNum = 0) => {
      // For Windows Support
      // Similar command to lsof
      // Finds if the specified port is in use
      const command = isWin
        ? `netstat -aon | find "${port}"`
        : `lsof -i :${port}`;
      const env = isWin
        ? {
            cwd: 'C:\\Windows\\System32',
          }
        : undefined;
      childProcess.exec(command, env, (err, res) => {
        // Ugh, childProcess assumes that no output means that there was an
        // error, and `lsof` emits nothing when the port is empty. So,
        // counterintuitively, an error is good news, and a response is bad.
        if (res) {
          if (attemptNum > MAX_ATTEMPTS) {
            reject(`No available ports after ${MAX_ATTEMPTS} attempts.`);
          }

          checkPort(port + 1, attemptNum + 1);
          return;
        }

        resolve(port);
      });
    };

    checkPort();
  });
