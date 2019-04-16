// @flow
import { defineMessages } from 'react-intl';

const messages = {
  header: {
    appName: {
      id: 'introScreen.header.appName',
      defaultMessage: 'Guppy',
      description: 'Name for the app',
    },
  },
  actions: {
    create: {
      id: 'introScreen.actions.create',
      defaultMessage: 'Create a new web application',
      description: 'Text for the button to create a new web application',
    },
    import: {
      id: 'introScreen.actions.import',
      defaultMessage: 'import an existing project',
      description: 'Text for importing an existing project',
    },
    or: {
      id: 'introScreen.actions.or',
      defaultMessage: 'Or,',
      description: 'Text for "Or,"',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
