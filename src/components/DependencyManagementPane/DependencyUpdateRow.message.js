// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    update: {
      id: 'dependencyManagementPane.dependencyUpdateRow.main.update',
      defaultMessage: 'Update',
      description: 'Text for "Update"',
    },
    upToDate: {
      id: 'dependencyManagementPane.dependencyUpdateRow.main.upToDate',
      defaultMessage: 'Up-to-date',
      description: 'Text for "Up-to-date"',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
