// @flow
import { defineMessages } from 'react-intl';

const messages = {
  button: {
    label: {
      id: 'terminalOutput.button.label',
      defaultMessage: 'Clear',
      description: 'Label for the "clear" button in TerminalOutput',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
