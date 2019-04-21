// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    title: {
      id: 'developmentServerPane.main.title',
      defaultMessage: 'Development Server',
      description: 'Title for the "Development Server" pane',
    },
    noTask: {
      id: 'developmentServerPane.main.noTask',
      defaultMessage:
        'This project does not appear to have a development server task',
      description:
        'Error message when there is no development server task in the project',
    },
    description: {
      id: 'developmentServerPane.main.description',
      defaultMessage:
        'Runs a local development server that updates' +
        ' whenever you make changes to the files.',
      description: 'Description for the development server',
    },
    viewDoc: {
      id: 'developmentServerPane.main.viewDoc',
      defaultMessage: 'View Documentation',
      description: 'Text for "View Documentation"',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
