import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer, remote } from 'electron';

import logger from '../../services/analytics.service';
import { getNodeJsVersion } from '../../services/shell.service';
import { getAppLoaded } from '../../reducers/app-loaded.reducer';
import { getProjectsArray } from '../../reducers/projects.reducer';

const { dialog, shell } = remote;

type Props = {
  isAppLoaded: boolean,
};

type State = {
  wasSuccessfullyInitialized: boolean,
};

class Initialization extends PureComponent<Props, State> {
  state = {
    wasSuccessfullyInitialized: false,
  };

  async componentDidMount() {
    const nodeVersion = await getNodeJsVersion();

    if (!nodeVersion) {
      dialog.showErrorBox(
        'Node missing',
        'It looks like Node.js isn\'t installed. Node is required to use Guppy.\nWhen you click "OK", you\'ll be directed to instructions to download and install Node.'
      );
      shell.openExternal(
        'https://github.com/joshwcomeau/guppy/blob/master/README.md#installation'
      );
    }

    this.setState({ wasSuccessfullyInitialized: !!nodeVersion });
    logger.logEvent('load-application', {
      node_version: nodeVersion,
    });

    ipcRenderer.on('app-will-close', this.appWillClose);
  }

  appWillClose = () => {
    const { isQueueEmpty, queue, projects } = this.props;

    const activeActions = Object.keys(queue).map(projectId => ({
      name: projects.find(project => project.id === projectId).name,
      pending: queue[projectId],
    }));

    const actionCaption = {
      install: 'Installing',
    };

    // Map actions to the following string format (multiple projects & multiple queued tasks). For each project it will be a string like:
    // Task in project <project.name>:\n
    // - <Installing or Queued> <count> task(s)\n
    const mapActionsToString = activeActions.map(
      actionItem =>
        'Tasks in project ' +
        actionItem.name +
        ':\n' +
        actionItem.pending.map(
          task =>
            '* ' +
            (task.active
              ? actionCaption[task.action] || task.action
              : 'Queued') +
            ' ' +
            task.dependencies.length +
            ' task(s)\n'
        ) +
        '\n'
    );

    if (!isQueueEmpty) {
      // warn user
      // todo: check if create project is in progress
      const result = dialog.showMessageBox({
        type: 'warning',
        message:
          'mapActionsToStringThere are active tasks. Do you really want to quit?\n\n' +
          mapActionsToString,
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

    console.log('app init', this.props.isQueueEmpty);
    return children(wasSuccessfullyInitialized && isAppLoaded);
  }
}

const mapStateToProps = state => ({
  isAppLoaded: getAppLoaded(state),
  isQueueEmpty: Object.keys(state.queue).length === 0,
  queue: state.queue,
  projects: getProjectsArray(state),
});

export default connect(mapStateToProps)(Initialization);
