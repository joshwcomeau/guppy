import * as path from 'path';
module.exports = {
  remote: {
    app: {
      getAppPath: () => path.resolve(__dirname, '..', '..', '..'),
      getPath: () =>
        process.env.APPDATA ||
        (process.platform == 'darwin'
          ? process.env.HOME + 'Library/Preferences'
          : '/var/local'),
    },
  },
};
