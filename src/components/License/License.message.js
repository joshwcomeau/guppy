// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    license: {
      id: 'license.main.license',
      defaultMessage: 'license',
      description: 'Text for "license"',
    },
    noLicenseFound: {
      id: 'license.main.noLicenseFound',
      defaultMessage: 'No license found',
      description: 'Text for "No license found"',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
