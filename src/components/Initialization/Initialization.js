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
    window.addEventListener('beforeunload', this.killAllRunningProcesses);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.killAllRunningProcesses);
  }

  killAllRunningProcesses = () => {
    ipcRenderer.send('killAllRunningProcesses');
  };

  render() {
    const { children, isAppLoaded } = this.props;
    const { wasSuccessfullyInitialized } = this.state;

    return children(wasSuccessfullyInitialized && isAppLoaded);
  }
}

const mapStateToProps = state => ({
  isAppLoaded: getAppLoaded(state),
});

export default connect(mapStateToProps)(Initialization);
