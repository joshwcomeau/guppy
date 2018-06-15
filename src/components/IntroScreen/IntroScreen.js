import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  createNewProjectStart,
  importExistingProjectStart,
} from '../../actions';
import { COLORS } from '../../constants';
import { getOnboardingStatus } from '../../reducers/onboarding-status.reducer';

import Button from '../Button';
import Spacer from '../Spacer';
import Logo from '../Logo';
import Swimming from '../Swimming';

const { dialog } = window.require('electron').remote;

type Props = {
  shouldHideContent: boolean,
  createNewProjectStart: () => any,
  importExistingProjectStart: (path: string) => any,
};

class IntroScreen extends Component<Props> {
  handleImportExisting = () => {
    const { importExistingProjectStart } = this.props;

    dialog.showOpenDialog(
      {
        message: 'Select the directory of an existing React app',
        properties: ['openDirectory'],
      },
      paths => {
        // The user might cancel out without selecting a directory.
        // In that case, do nothing.
        if (!paths) {
          return;
        }

        // Only a single path should be selected
        const [path] = paths;

        importExistingProjectStart(path);
      }
    );
  };

  render() {
    const { shouldHideContent, createNewProjectStart } = this.props;

    return (
      <Fragment>
        <Wrapper isVisible={!shouldHideContent}>
          <Header>
            <Swimming>
              <Logo size="medium" />
            </Swimming>
            <AppName>Guppy</AppName>
          </Header>

          <Actions>
            <Button size="large" onClick={() => createNewProjectStart()}>
              Create new React project
            </Button>
            <Spacer size={40} />
            <div>
              Or,{' '}
              <TextButton onClick={this.handleImportExisting}>
                import an existing project
              </TextButton>
            </div>
          </Actions>
        </Wrapper>
      </Fragment>
    );
  }
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  opacity: ${props => (props.isVisible ? 1 : 0)};
  pointer-events: ${props => (props.isVisible ? 'auto' : 'none')};
  transition: opacity 500ms;
`;

const Header = styled.div`
  text-align: center;
`;

const AppName = styled.div`
  font-size: 42px;
  transform: translateY(-10px);
`;

const Actions = styled.div`
  text-align: center;
  font-size: 20px;
`;

const TextButton = styled.button`
  background: transparent;
  border: none;
  text-decoration: underline;
  padding: 0;
  margin: 0;
  color: ${COLORS.blue[700]};
  font-size: inherit;
`;

const mapStateToProps = state => ({
  shouldHideContent: getOnboardingStatus(state) !== 'brand-new',
});

export default connect(
  mapStateToProps,
  { createNewProjectStart, importExistingProjectStart }
)(IntroScreen);
