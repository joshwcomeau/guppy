import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer, remote } from 'electron';

import logger from '../../services/analytics.service';
import { getNodeJsVersion } from '../../services/shell.service';
import { getAppLoaded } from '../../reducers/app-loaded.reducer';

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
    window.addEventListener('beforeunload', this.appWillClose);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.appWillClose);
  }

  appWillClose = async evt => {
    const { isQueueEmpty } = this.props;

    if (!isQueueEmpty) {
      // warn user
      // todo: check if create project is in progress
      const result = await dialog.showMessageBox({
        type: 'warn',
        message:
          'Queue not empty do you really want to quit? <Add open actions here...>',
        buttons: ['Abort', 'Proceed (UNSAFE)'],
      });

      evt.returnVal = result === 1; // proceed selected
      if (result === 0) {
        return;
      }
    }

    // if we're here queue is empty or user wants to proceed
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
});

export default connect(mapStateToProps)(Initialization);
