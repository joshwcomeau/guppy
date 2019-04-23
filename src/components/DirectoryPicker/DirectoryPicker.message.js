// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    selectDirectory: {
      id: 'directoryPicker.main.selectDirectory',
      defaultMessage: 'Select the directory',
      description: 'Text to prompt the user to "Select the Directory"',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
