// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import { COLORS } from '../../constants';
import { getSelectedProject } from '../../reducers/projects.reducer';
import { getAppLoaded } from '../../reducers/app-loaded.reducer';

import IntroScreen from '../IntroScreen';
import Sidebar from '../Sidebar';
import ApplicationMenu from '../ApplicationMenu';
import ProjectPage from '../ProjectPage';
import CreateNewProjectWizard from '../CreateNewProjectWizard';

import type { Project } from '../../types';

type Props = {
  isAppLoaded: boolean,
  selectedProject: ?Project,
};

// TODO: add in blank draggable Titlebar while
// application is loading
class App extends Component<Props> {
  render() {
    const { isAppLoaded, selectedProject } = this.props;

    return (
      <ApplicationMenuWrapper>
        <ApplicationMenu />
        {isAppLoaded && (
          <Wrapper>
            <Sidebar />

            <MainContent>
              {selectedProject ? <ProjectPage /> : <IntroScreen />}
            </MainContent>
          </Wrapper>
        )}

        <CreateNewProjectWizard />
      </ApplicationMenuWrapper>
    );
  }
}

const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const ApplicationMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  overflow: hidden;
  height: 100vh;
`;

const Wrapper = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
  background: ${COLORS.gray[50]};
  overflow-x: hidden;
  overflow-y: auto;

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
