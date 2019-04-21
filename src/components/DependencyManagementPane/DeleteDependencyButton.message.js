// @flow
import { defineMessages } from 'react-intl';

const messages = {
  delete: {
    idle: {
      id: 'dependencyManagementPane.deleteDependencyButton.delete.idle',
      defaultMessage: 'Delete',
      description: 'Text "Installed" for the idle status',
    },
    queuedDelete: {
      id: 'dependencyManagementPane.deleteDependencyButton.delete.queuedDelete',
      defaultMessage: 'Queued for Delete…',
      description: 'Text "Queued for Delete…" for the queued-delete status',
    },
  },
  dialog: {
    title: {
      id: 'dependencyManagementPane.deleteDependencyButton.dialog.title',
      defaultMessage: 'Are you sure?',
      description: 'Text "Are you sure?" for the title of the dialog',
    },
    message: {
      id: 'dependencyManagementPane.deleteDependencyButton.dialog.message',
      defaultMessage: 'Are you sure you want to delete this dependency?',
      description: 'Text to ask the user whether he does want to do the delete',
    },
    yes: {
      id: 'dependencyManagementPane.deleteDependencyButton.dialog.yes',
      defaultMessage: 'Yeah',
      description: 'Text "Yeah" for the yes option',
    },
    no: {
      id: 'dependencyManagementPane.deleteDependencyButton.dialog.no',
      defaultMessage: 'Nope',
      description: 'Text "Nope" for the no option',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
