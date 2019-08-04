// @flow
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';

import { COLORS } from '../../constants';
import { getSelectedProjectId } from '../../reducers/projects.reducer';

import IntroScreen from '../IntroScreen';
import Sidebar from '../Sidebar';
import Titlebar from '../Titlebar';
import ApplicationMenu from '../ApplicationMenu';
import ProjectPage from '../ProjectPage';
import CreateNewProjectWizard from '../CreateNewProjectWizard';
import ProjectConfigurationModal from '../ProjectConfigurationModal';
import AppSettingsModal from '../AppSettingsModal';
import Initialization from '../Initialization';
import LoadingScreen from '../LoadingScreen';
import FeedbackButton from '../FeedbackButton';
import OnlineChecker from '../OnlineChecker';
import { isMac } from '../../services/platform.service';

import type { Project } from '../../types';

type Props = {
  selectedProjectId: ?Project,
  modalVisible: boolean,
};

class App extends PureComponent<Props> {
  render() {
    const { selectedProjectId, modalVisible } = this.props;
    return (
      <Initialization>
        {wasSuccessfullyInitialized =>
          wasSuccessfullyInitialized && (
            <Fragment>
              <OnlineChecker />
              {isMac && <Titlebar />}
              <Wrapper>
                <ApplicationMenu />
                <LoadingScreen />
                <Sidebar />
                <MainContent disableScroll={modalVisible}>
                  {selectedProjectId ? (
                    <Scrollbars>
                      <ProjectPage />
                    </Scrollbars>
                  ) : (
                    <IntroScreen />
                  )}
                </MainContent>
              </Wrapper>
              <CreateNewProjectWizard />
              <ProjectConfigurationModal />
              <AppSettingsModal />
              <FeedbackButton />
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
  background: ${COLORS.background};

  animation: ${fadeIn} 500ms ease-in;
`;

const MainContent = styled.div`
  position: relative;
  flex: 1;
  ${props =>
    props.disableScroll
      ? `
    height: 100vh;
    overflow: hidden;
  `
      : 'min-height: 100vh;'};
`;

const mapStateToProps = state => ({
  selectedProjectId: getSelectedProjectId(state),
  modalVisible: !!state.modal,
});

export default connect(mapStateToProps)(App);
