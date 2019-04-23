// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    projectStarter: {
      id: 'createNewProjectWizard.mainPane.main.projectStarter',
      defaultMessage: 'Project Starter',
      description: 'Label for the part "Porject Starter"',
    },
    projectType: {
      id: 'createNewProjectWizard.mainPane.main.projectType',
      defaultMessage: 'Project Type',
      description: 'Label for the part "Porject Type"',
    },
    projectIcon: {
      id: 'createNewProjectWizard.mainPane.main.projectIcon',
      defaultMessage: 'Project Icon',
      description: 'Label for the part "Porject Icon"',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
