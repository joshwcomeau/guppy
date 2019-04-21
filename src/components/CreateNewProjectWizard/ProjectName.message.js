// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    title: {
      id: 'createNewProjectWizard.projectName.main.title',
      defaultMessage: 'Project Name',
      description: 'Title for the part "Porject Name"',
    },
    placeholder: {
      id: 'createNewProjectWizard.projectName.main.placeholder',
      defaultMessage: 'Your Amazing Project Name',
      description: 'Placeholder for the project name',
    },
    randomize: {
      id: 'createNewProjectWizard.mainPane.main.randomize',
      defaultMessage: 'Generate a random code-name',
      description: 'Text for "Generate a random code-name"',
    },
    repeated: {
      id: 'createNewProjectWizard.mainPane.main.repeated',
      defaultMessage: 'Sorry, a project with this name already exists.',
      description: 'Text when a project with the same name already exists',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
