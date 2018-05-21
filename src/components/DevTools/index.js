/* eslint-disable no-undef */
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  module.exports = require('./index.prod');
} else {
  // eslint-disable-next-line global-require
  module.exports = require('./index.dev');
}
