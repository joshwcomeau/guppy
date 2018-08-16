/**
 * NOTE: This service is used both by the Electron client
 * and server, so it must only contain Node-compatible (read: non-ES6)
 * code. If at some future time this requires some large amount
 * of ES6 code, we can make a client-side wrapper.
 */
const childProcess = require('child_process');
const os = require('os');
const psTree = require('ps-tree');

const isWin = /^win/.test(os.platform());

// Kill the process with the given pid, as well as all
// its descendants down through the entire tree.
const killProcessId = doomedProcessId => {
  if (isWin) {
    // For Windows Support
    // On Windows there is only one process so no need for psTree (see below)
    // We use /f for focefully terminate process because it ask for confirmation
    // We use /t to kill all child processes
    // More info https://ss64.com/nt/taskkill.html
    childProcess.spawn('taskkill', ['/pid', doomedProcessId, '/f', '/t']);
  } else {
    // Child node processes will persist after their parent's death
    // if they are not killed first, so we need to use `psTree` to build
    // a tree of children and kill them that way.
    psTree(doomedProcessId, (err, children) => {
      if (err) {
        console.error('Could not gather process children:', err);
      }

      const childrenPIDs = children.map(child => child.PID);
      childProcess.spawn('kill', ['-9', doomedProcessId, ...childrenPIDs]);
    });
  }
};

module.exports = killProcessId;
