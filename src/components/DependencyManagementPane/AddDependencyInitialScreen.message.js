// @flow
import { defineMessages } from 'react-intl';

const messages = {
  instruction: {
    searchPackage: {
      id:
        'dependencyManagementPane.addDependencyInitialScreen.instruction.searchPackage',
      defaultMessage:
        'You can use the input above to search the Node Package Manager' +
        ' (NPM) registry for packages that have been published.',
      description: 'Text to instuct the user to search for packages by NPM',
    },
    howToSearch: {
      id:
        'dependencyManagementPane.addDependencyInitialScreen.instruction.howToSearch',
      defaultMessage:
        'Search by package name, description, keyword, or author.',
      description: 'Text to instuct the user about how to search for packages',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
