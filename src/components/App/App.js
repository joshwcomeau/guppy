// @flow
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer, remote } from 'electron';
import styled, { keyframes } from 'styled-components';

import { COLORS } from '../../constants';
import { getSelectedProjectId } from '../../reducers/projects.reducer';
import { getAppLoaded } from '../../reducers/app-loaded.reducer';
import logger from '../../services/analytics.service';
import { checkIfNodeIsAvailable } from '../../services/shell.service';

import IntroScreen from '../IntroScreen';
import Sidebar from '../Sidebar';
import Titlebar from '../Titlebar';
import ApplicationMenu from '../ApplicationMenu';
import ProjectPage from '../ProjectPage';
import CreateNewProjectWizard from '../CreateNewProjectWizard';
import ProjectConfigurationModal from '../ProjectConfigurationModal';

import type { Project } from '../../types';

type Props = {
  isAppLoaded: boolean,
  selectedProjectId: ?Project,
};

type State = {
  isNodeJsMissing: boolean,
};

const { dialog, shell } = remote;

class App extends PureComponent<Props, State> {
  state = {
    isNodeJsMissing: false,
  };

  componentDidMount() {
    const logAppLoaded = node_version => {
      logger.logEvent('load-application', {
        node_version: node_version || 'missing',
      });
    };

    checkIfNodeIsAvailable()
      .then(result => {
        logAppLoaded(result.trim());
        this.setState({ isNodeJsMissing: false });
      })
      .catch(error => {
        this.setState({
          isNodeJsMissing: true,
        });
        dialog.showErrorBox(
          'Node missing',
          'It looks like Node.js isn\'t installed. Node is required to use Guppy.\nWhen you click "OK", you\'ll be directed to instructions to download and install Node.'
        );
        shell.openExternal(
          'https://github.com/joshwcomeau/guppy/blob/master/README.md#installation'
        );
        logAppLoaded();
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
    const { isAppLoaded, selectedProjectId } = this.props;
    const { isNodeJsMissing } = this.state;

    return (
      <Fragment>
        <Titlebar />

        {isAppLoaded && (
          <Wrapper>
            <ApplicationMenu />

            <Sidebar />

            <MainContent>
              {selectedProjectId ? <ProjectPage /> : <IntroScreen />}
            </MainContent>
          </Wrapper>
        )}

        {/* Only show wizard if Node.js is available */}
        {!isNodeJsMissing && <CreateNewProjectWizard />}
        <ProjectConfigurationModal />
      </Fragment>
    );
  }
}

const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const Wrapper = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
  background: ${COLORS.gray[50]};

  animation: ${fadeIn} 500ms ease-in;
`;

const MainContent = styled.div`
  position: relative;
  min-height: 100vh;
  flex: 1;
`;

const mapStateToProps = state => ({
  selectedProjectId: getSelectedProjectId(state),
  isAppLoaded: getAppLoaded(state),
});

export default connect(mapStateToProps)(App);
