// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import styled, { keyframes } from 'styled-components';

import { COLORS } from '../../constants';
import { getSelectedProject } from '../../reducers/projects.reducer';
import { getAppLoaded } from '../../reducers/app-loaded.reducer';

import IntroScreen from '../IntroScreen';
import Sidebar from '../Sidebar';
import Titlebar from '../Titlebar';
import ApplicationMenu from '../ApplicationMenu';
import ProjectPage from '../ProjectPage';
import CreateNewProjectWizard from '../CreateNewProjectWizard';

import type { Project } from '../../types';

type Props = {
  isAppLoaded: boolean,
  selectedProject: ?Project,
};

class App extends Component<Props> {
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
    const { isAppLoaded, selectedProject } = this.props;

    return (
      <Fragment>
        <Titlebar />

        {isAppLoaded && (
          <Wrapper>
            <ApplicationMenu />

            <Sidebar />

            <MainContent>
              {selectedProject ? <ProjectPage /> : <IntroScreen />}
            </MainContent>
          </Wrapper>
        )}

        <CreateNewProjectWizard />
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
  selectedProject: getSelectedProject(state),
  isAppLoaded: getAppLoaded(state),
});

export default connect(mapStateToProps)(App);
