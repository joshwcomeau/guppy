// @flow
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import styled, { keyframes } from 'styled-components';

import { COLORS } from '../../constants';
import { getSelectedProjectId } from '../../reducers/projects.reducer';
import { getAppLoaded } from '../../reducers/app-loaded.reducer';

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

class App extends PureComponent<Props> {
  componentDidMount() {
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

        <CreateNewProjectWizard />
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
