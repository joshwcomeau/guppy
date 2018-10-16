// @flow
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import { COLORS } from '../../constants';
import { getSelectedProjectId } from '../../reducers/projects.reducer';
import { getBlockingStatus } from '../../reducers/app-status.reducer';

import IntroScreen from '../IntroScreen';
import Sidebar from '../Sidebar';
import Titlebar from '../Titlebar';
import ApplicationMenu from '../ApplicationMenu';
import ProjectPage from '../ProjectPage';
import CreateNewProjectWizard from '../CreateNewProjectWizard';
import ProjectConfigurationModal from '../ProjectConfigurationModal';
import Initialization from '../Initialization';
import LoadingScreen from '../LoadingScreen';

import type { Project } from '../../types';

type Props = {
  selectedProjectId: ?Project,
  showLoadingScreen: boolean,
};

class App extends PureComponent<Props> {
  render() {
    const { selectedProjectId, showLoadingScreen } = this.props;
    console.log(showLoadingScreen);
    return (
      <Initialization>
        {wasSuccessfullyInitialized =>
          wasSuccessfullyInitialized && (
            <Fragment>
              <Titlebar />
              <Wrapper>
                <ApplicationMenu />
                {showLoadingScreen && <LoadingScreen />}
                <Sidebar />
                <MainContent>
                  {selectedProjectId ? <ProjectPage /> : <IntroScreen />}
                </MainContent>
              </Wrapper>
              <CreateNewProjectWizard />
              <ProjectConfigurationModal />
            </Fragment>
          )
        }
      </Initialization>
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
  showLoadingScreen: getBlockingStatus(state),
});

export default connect(mapStateToProps)(App);
