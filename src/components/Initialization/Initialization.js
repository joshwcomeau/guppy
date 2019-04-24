// @flow
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer, remote } from 'electron';

import logger from '../../services/analytics.service';
import { getNodeJsVersion } from '../../services/shell.service';
import { getAppLoaded } from '../../reducers/app-loaded.reducer';
import { getProjectsArray } from '../../reducers/projects.reducer';
import { initializePath } from '../../services/platform.service';

import { GUPPY_REPO_URL } from '../../constants';

import type { Project } from '../../types';
import type { State as Queue, QueueEntry } from '../../reducers/queue.reducer';

const { dialog, shell } = remote;

type Props = {
  isAppLoaded: boolean,
  isQueueEmpty: boolean,
  queue: Queue,
  projects: Array<Project>,
  children: (wasSuccessfullyInitialized: boolean) => React$Node,
};

type State = {
  wasSuccessfullyInitialized: boolean,
};

class Initialization extends PureComponent<Props, State> {
  state = {
    wasSuccessfullyInitialized: false,
  };

  componentDidMount() {
    initializePath()
      .then(getNodeJsVersion)
      .then(nodeVersion => {
        this.setState({
          wasSuccessfullyInitialized: !!nodeVersion,
        });

        logger.logEvent('load-application', {
          node_version: nodeVersion,
        });

        if (!nodeVersion) {
          throw new Error('node-not-found');
        }

        ipcRenderer.on('app-will-close', this.appWillClose);
      })
      .catch(e => {
        switch (e.message) {
          case 'node-not-found': {
            dialog.showErrorBox(
              'Node missing',
              'It looks like Node.js isn\'t installed. Node is required to use Guppy.\nWhen you click "OK", you\'ll be directed to instructions to download and install Node.'
            );
            shell.openExternal(
              `${GUPPY_REPO_URL}/blob/master/README.md#installation`
            );
            break;
          }
          default: {
            // Path initialization can reject if no valid Node version is found.
            // This isn't really an error, though, so we can swallow it.
          }
        }
      });
  }

  appWillClose = () => {
    const { isQueueEmpty, queue, projects } = this.props;

    const activeActions = Object.keys(queue).reduce((prev, projectId) => {
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        return prev;
      }
      prev.push({
        name: project.name,
        pending: queue[projectId],
      });
      return prev;
    }, []);

    if (!isQueueEmpty) {
      // warn user
      // todo: check if create project is in progress
      const result = dialog.showMessageBox({
        type: 'warning',
        message:
          'There are active tasks. Do you really want to quit?\n\n' +
          mapActionsToString(activeActions),
        buttons: ['Abort', 'Yes, proceed (UNSAFE)'],
      });

      if (result === 0) {
        ipcRenderer.send('triggerClose', false);
        return;
      }
    }

    ipcRenderer.send('triggerClose', true);
    ipcRenderer.send('killAllRunningProcesses');
  };

  render() {
    const { children, isAppLoaded } = this.props;
    const { wasSuccessfullyInitialized } = this.state;

    return children(wasSuccessfullyInitialized && isAppLoaded);
  }
}

// helpers
export const actionCaption = {
  install: 'Installing',
  uninstall: 'Uninstalling',
};

export const mapTasksPerProjectToString = (task: QueueEntry) => {
  const pluralizedTask = task.dependencies.length > 1 ? 'tasks' : 'task';
  const actionName = task.active
    ? actionCaption[task.action] || task.action
    : 'Queued'; // task.action install or uninstall will be mapped to Installing or Uninstalling if active
  return `- ${actionName} ${task.dependencies.length} ${pluralizedTask}`;
};

// Map actions to the following string format (multiple projects & multiple queued tasks). For each project it will be a string like:
// Task in project <project.name>:\n
// - <Installing or Queued> <count> task(s)\n
export const mapActionsToString = (
  activeActions: Array<{ name: string, pending: Array<QueueEntry> }>
) =>
  activeActions
    .map(actionItem =>
      [
        `Tasks in project ${actionItem.name}:`,
        actionItem.pending.map(mapTasksPerProjectToString).join('\n'),
        '',
      ].join('\n')
    )
    .join('\n');

const mapStateToProps = state => ({
  isAppLoaded: getAppLoaded(state),
  isQueueEmpty: Object.keys(state.queue).length === 0,
  queue: state.queue,
  projects: getProjectsArray(state),
});

export default connect(mapStateToProps)(Initialization);
