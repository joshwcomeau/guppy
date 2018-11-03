const { JSDOM } = require('jsdom');
const { window } = new JSDOM('<!doctype html><html><body></body></html>');

global.window = window;
global.document = window.document;

// Import test framework for styled components for better snapshot messages
require('jest-styled-components');
