// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    alreadyHaveOne: {
      id: 'createNewProjectWizard.importExisting.main.alreadyHaveOne',
      defaultMessage:
        "Already have a project you'd like to manage with Guppy? ",
      description: 'Text asking whether the user already have one project',
    },
    import: {
      id: 'createNewProjectWizard.importExisting.main.building',
      defaultMessage: 'Import it instead',
      description: 'Text asking the user to import it instead',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
