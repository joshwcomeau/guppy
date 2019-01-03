/* eslint-disable flowtype/require-valid-file-annotation */
module.exports = function() {
  let store = {};

  this.clear = jest.fn(() => {
    store = {};
  });

  this.get = jest.fn(key => store[key]);
  this.set = jest.fn((key, val) => {
    store[key] = val;
    return val;
  });
};
