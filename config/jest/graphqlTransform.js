// @flow
const loader = require('graphql-tag/loader');

module.exports = {
  process(src: any) {
    return loader.call({ cacheable() {} }, src);
  },
};
