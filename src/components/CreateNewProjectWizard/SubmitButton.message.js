// @flow
import { defineMessages } from 'react-intl';

const messages = {
  buttonText: {
    building: {
      id: 'createNewProjectWizard.submitButton.buttonText.building',
      defaultMessage: 'Building...',
      description: 'Text for the "Building..." button',
    },
    letsDoThis: {
      id: 'createNewProjectWizard.submitButton.buttonText.letsDoThis',
      defaultMessage: "Let's do this",
      description: 'Text for the "Let\'s do this" button',
    },
    next: {
      id: 'createNewProjectWizard.submitButton.buttonText.next',
      defaultMessage: 'Next',
      description: 'Text for the "Next" button',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
