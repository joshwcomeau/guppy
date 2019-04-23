// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    placeholder: {
      id: 'dependencyManagementPane.addDependencySearchBox.main.placeholder',
      defaultMessage: 'eg. redux, react-router...',
      description: 'Placeholder for the searchBox, showing an example',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
