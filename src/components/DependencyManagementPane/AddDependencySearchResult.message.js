// @flow
import { defineMessages } from 'react-intl';

const messages = {
  action: {
    idle: {
      id: 'dependencyManagementPane.addDependencySearchResult.action.idle',
      defaultMessage: 'Installed',
      description: 'Text "Installed" for the idle action',
    },
    installing: {
      id:
        'dependencyManagementPane.addDependencySearchResult.action.installing',
      defaultMessage: 'Installing…',
      description: 'Text "Installing…" for the installing action',
    },
    updating: {
      id: 'dependencyManagementPane.addDependencySearchResult.action.updating',
      defaultMessage: 'Updating…',
      description: 'Text "Updating…" for the updating action',
    },
    deleting: {
      id: 'dependencyManagementPane.addDependencySearchResult.action.deleting',
      defaultMessage: 'Deleting…',
      description: 'Text "Deleting…" for the deleting action',
    },
    queuedInstall: {
      id:
        'dependencyManagementPane.addDependencySearchResult.action.queuedInstall',
      defaultMessage: 'Queued for Install',
      description: 'Text "Queued for Install" for the queued-install action',
    },
    queuedUpdate: {
      id:
        'dependencyManagementPane.addDependencySearchResult.action.queuedUpdate',
      defaultMessage: 'Queued for Update',
      description: 'Text "Queued for Update" for the queued-update action',
    },
    queuedDelete: {
      id:
        'dependencyManagementPane.addDependencySearchResult.action.queuedDelete',
      defaultMessage: 'Queued for Delete',
      description: 'Text "Queued for Delete" for the queued-delete action',
    },
  },
  result: {
    installed: {
      id: 'dependencyManagementPane.addDependencySearchResult.result.installed',
      defaultMessage: 'Installed',
      description: 'Text "Installed" when the dependency is already installed',
    },
    addToProject: {
      id:
        'dependencyManagementPane.addDependencySearchResult.result.addToProject',
      defaultMessage: 'Add To Project',
      description: 'Text for the button "Add To Project"',
    },
    downloadsAMonth: {
      id:
        'dependencyManagementPane.addDependencySearchResult.result.downloadsAMonth',
      defaultMessage: 'downloads a month',
      description: 'Text for "downloads a month"',
    },
    published: {
      id: 'dependencyManagementPane.addDependencySearchResult.result.published',
      defaultMessage: 'Published ',
      description: 'Text for "Published "',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
