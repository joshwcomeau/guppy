// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    openApp: {
      id: 'developmentServerStatus.main.openApp',
      defaultMessage: 'Open App',
      description: 'Text for the "Open App" link',
    },
  },
  // might need to add status string here
};

const definedMessages = defineMessages(messages);

export default definedMessages;
