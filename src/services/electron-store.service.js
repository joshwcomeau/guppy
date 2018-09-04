// @flow
// Need to use commonjs so that `main.js` can use this module as well.
const ElectronStore = require('electron-store');

// Expose a singleton store instance.
module.exports = new ElectronStore();
