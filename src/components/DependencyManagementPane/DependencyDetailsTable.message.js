// @flow
import { defineMessages } from 'react-intl';

const messages = {
  cell: {
    lastPublished: {
      id: 'dependencyManagementPane.dependencyDetailsTable.cell.lastPublished',
      defaultMessage: 'Last Published',
      description: 'Text for the cell "Last Published"',
    },
    license: {
      id: 'dependencyManagementPane.dependencyDetailsTable.cell.license',
      defaultMessage: 'License',
      description: 'Text for the cell "License"',
    },
    resources: {
      id: 'dependencyManagementPane.dependencyDetailsTable.cell.resources',
      defaultMessage: 'Resources',
      description: 'Text for the cell "Resources"',
    },
    officialWebsite: {
      id:
        'dependencyManagementPane.dependencyDetailsTable.cell.officialWebsite',
      defaultMessage: 'Official Website',
      description: 'Text for the cell "Official Website"',
    },
    dangerZone: {
      id: 'dependencyManagementPane.dependencyDetailsTable.cell.dangerZone',
      defaultMessage: 'Danger Zone',
      description: 'Text for the cell "Danger Zone"',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
