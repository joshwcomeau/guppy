// @flow
import { defineMessages } from 'react-intl';

const messages = {
  infoBar: {
    offlinePrompt: {
      id: 'onlineChecker.infoBar.offlinePrompt',
      defaultMessage:
        'You are currently offline, some functions will not be available',
      description: "The prompt telling the user he's offline",
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
