// @flow
import { defineMessages } from 'react-intl';

const messages = {
  mount: {
    nodeMissing: {
      id: 'initialization.mount.nodeMissing',
      defaultMessage: 'Node missing',
      description: 'Error message to show that Node is missing',
    },
    installNode: {
      id: 'initialization.mount.installNode',
      defaultMessage:
        "It looks like Node.js isn't installed. Node is required to use Guppy." +
        '\nWhen you click "OK", you\'ll be directed to instructions to download and install Node.',
      description: 'Text to prompt the user to install Node.js',
    },
  },
  close: {
    confirmForceQuit: {
      id: 'initialization.close.confirmForceQuit',
      defaultMessage: 'There are active tasks. Do you really want to quit?\n\n',
      description:
        'Prompt to let the user confirm the force quit with active tasks',
    },
    abort: {
      id: 'initialization.close.abort',
      defaultMessage: 'Abort',
      description: 'Text for the "Abort" button',
    },
    proceed: {
      id: 'initialization.close.proceed',
      defaultMessage: 'Yes, proceed (UNSAFE)',
      description: 'Text for the "Yes, proceed (UNSAFE)" button',
    },
  },
  action: {
    install: {
      id: 'initialization.action.install',
      defaultMessage: 'Installing',
      description: 'Text for "Installing"',
    },
    uninstall: {
      id: 'initialization.action.uninstall',
      defaultMessage: 'Uninstalling',
      description: 'Text for "Uninstalling"',
    },
    task: {
      id: 'initialization.action.task',
      defaultMessage: 'task',
      description: 'Text for the singular "task"',
    },
    tasks: {
      id: 'initialization.action.tasks',
      defaultMessage: 'tasks',
      description: 'Text for the plural "tasks"',
    },
    queued: {
      id: 'initialization.action.queued',
      defaultMessage: 'Queued',
      description: 'Text for "Queued" to show tasks in queue',
    },
    tasksInProject: {
      id: 'initialization.action.tasksInProject',
      defaultMessage: 'Tasks in project ',
      description: 'Text for "Tasks in project " to show the active tasks',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
