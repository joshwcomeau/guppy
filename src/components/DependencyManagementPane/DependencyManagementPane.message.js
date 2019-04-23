// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    title: {
      id: 'dependencyManagementPane.dependencyManagementPane.main.title',
      defaultMessage: 'Dependencies',
      description: 'Text for the title "Dependencies"',
    },
    dependency: {
      id: 'dependencyManagementPane.dependencyManagementPane.main.dependency',
      defaultMessage: 'Dependency',
      description: 'Text for "Dependency"',
    },
    addNew: {
      id: 'dependencyManagementPane.dependencyManagementPane.main.addNew',
      defaultMessage: 'Add New',
      description: 'Text for "Add New"',
    },
  },
  error: {
    noDependency: {
      id:
        'dependencyManagementPane.dependencyManagementPane.error.noDependency',
      defaultMessage:
        "Looks like all the dependencies were deleted. Sorry, we aren't set " +
        'up to handle this case yet :(',
      description: 'Text to say sorry when there is no dependency left',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
