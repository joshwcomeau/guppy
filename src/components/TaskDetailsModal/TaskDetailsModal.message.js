// @flow
import { defineMessages } from 'react-intl';

const messages = {
  status: {
    task: {
      id: 'taskDetailsModal.status.task',
      defaultMessage: 'Task ',
      description: 'Text for "Task " in the primary status',
    },
    taskIs: {
      id: 'taskDetailsModal.status.taskIs',
      defaultMessage: 'Task is ',
      description: 'Text for "Task is " in the primary status',
    },
    idle: {
      id: 'taskDetailsModal.status.idle',
      defaultMessage: 'idle',
      description: 'Text for "idle" in the primary status',
    },
    running: {
      id: 'taskDetailsModal.status.running',
      defaultMessage: 'running',
      description: 'Text for "running" in the primary status',
    },
    success: {
      id: 'taskDetailsModal.status.success',
      defaultMessage: 'completed successfully',
      description: 'Text for "completed successfully" in the primary status',
    },
    failed: {
      id: 'taskDetailsModal.status.failed',
      defaultMessage: 'failed',
      description: 'Text for "failed" in the primary status',
    },
    error: {
      id: 'taskDetailsModal.status.error',
      defaultMessage: 'Unrecognized status in TaskDetailsModal.',
      description:
        'Error text when there is an unrecognized status in TaskDetailsModal',
    },
  },
  timeStamp: {
    lastRun: {
      id: 'taskDetailsModal.timeStamp.lastRun',
      defaultMessage: 'Last run: ',
      description: 'Text for "Last run " in the timeStamp part',
    },
  },
  content: {
    output: {
      id: 'taskDetailsModal.content.output',
      defaultMessage: 'Output',
      description: 'Title "Output" for the main content of ouput',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
