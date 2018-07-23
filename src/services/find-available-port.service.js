/**
 * Find a clear port to run a server on.
 *
 * NOTE: My initial approach to this problem was to copy create-react-app,
 * and use the NPM package `detect-port-alt`. For some reason (maybe because
 * this is electron, not a "pure" Node instance?), that module didn't work; it
 * uses the Node module `net` to create a server, but the servers created
 * always hang for me; no errors called, but no listeners called either.
 *
 * Instead I wrote up this quick approach that uses `lsof`. I have no idea how
 * this'd work if we port this app to Windows :( but hopefully it won't be too
 * hard of a problem!
 */
const childProcess = window.require('child_process');
const os = window.require('os');
const MAX_ATTEMPTS = 15;

export default () =>
  new Promise((resolve, reject) => {
    const checkPort = (port = 3000, attemptNum = 0) => {
      // For Windows Support
      // Similar command to lsof
      // Finds if the specified port is in use
      const command = /^win/.test(os.platform())
        ? `netstat -aon | find "${port}"`
        : `lsof -i :${port}`;
      childProcess.exec(command, (err, res) => {
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
