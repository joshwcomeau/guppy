const { JSDOM } = require('jsdom');
const { window } = new JSDOM('<!doctype html><html><body></body></html>');

global.window = window;
global.document = window.document;

global.navigator = {
  userAgent: 'node.js',
};

// Import test framework for styled components for better snapshot messages
require('jest-styled-components');

require('jest-dom/extend-expect');
require('react-testing-library/cleanup-after-each');
