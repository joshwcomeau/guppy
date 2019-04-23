// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    placeholder: {
      id:
        'createNewProjectWizard.gatsby.projectStarterSelection.main.placeholder',
      defaultMessage: 'Pick a starter e.g. type blog ...',
      description:
        'The placeholder to prompt to user to pick a starter like blog',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
