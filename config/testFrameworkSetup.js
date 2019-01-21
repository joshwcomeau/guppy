const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;
const fetch = require('jest-fetch-mock');

global.document = window.document;
global.window = window;

global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};

// Import BrowserAPI to Node env
require('jsdom-global')();
// Import test framework for styled components for better snapshot messages
require('jest-styled-components');

jest.setMock('node-fetch', fetch);
