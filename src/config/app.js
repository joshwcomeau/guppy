// @flow
// app-wide settings (no user changable settings here)
module.exports = {
  IN_APP_FEEDBACK_URL: 'https://guppy.nolt.io',
  PACKAGE_MANAGER: 'yarn',
  // Enable logging, if enabled all terminal responses are visible in the console (useful for debugging)
  LOGGING: false,
  // Enable usage of window.navigator.language - disabled until we're having more translations
  USE_NAVIGATOR_LANGUAGE: false,
};
