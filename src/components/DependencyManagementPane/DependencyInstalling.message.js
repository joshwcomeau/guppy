// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    queued: {
      id: 'dependencyManagementPane.dependencyInstalling.main.queued',
      defaultMessage: ' is queued for install',
      description: 'Text for " is queued for install"',
    },
    installing: {
      id: 'dependencyManagementPane.dependencyInstalling.main.installing',
      defaultMessage: 'Installing ',
      description: 'Text for "Installing "',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
