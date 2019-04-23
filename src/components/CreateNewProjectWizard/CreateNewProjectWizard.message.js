// @flow
import { defineMessages } from 'react-intl';

const messages = {
  dialogFolderExists: {
    title: {
      id:
        'createNewProjectWizard.createNewProjectWizard.dialogFolderExists.title',
      defaultMessage: 'Project directory exists',
      description: 'Title for the "Project directory exists" dialog',
    },
    message: {
      id:
        'createNewProjectWizard.createNewProjectWizard.dialogFolderExists.message',
      defaultMessage:
        "Looks like there's already a project with that name." +
        ' Did you mean to import it instead?',
      description: 'Tell the user the project name already exists',
    },
    buttonText: {
      id:
        'createNewProjectWizard.createNewProjectWizard.dialogFolderExists.buttonText',
      defaultMessage: 'OK',
      description: 'Text for the "OK" button',
    },
  },
  starterNotFoundError: {
    starter: {
      id:
        'createNewProjectWizard.createNewProjectWizard.starterNotFoundError.starter',
      defaultMessage: 'Starter ',
      description: 'Text for "Starter "',
    },
    notFound: {
      id:
        'createNewProjectWizard.createNewProjectWizard.starterNotFoundError.notFound',
      defaultMessage: ' not found',
      description: 'Text for " not found"',
    },
    recheck: {
      id:
        'createNewProjectWizard.createNewProjectWizard.starterNotFoundError.recheck',
      defaultMessage:
        'Please check your starter url or use the starter selection' +
        ' to pick a starter.',
      description:
        'Ask the user to chekc the stater url or use the starter selction to' +
        ' pick a starter',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
