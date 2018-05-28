import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { startCreatingNewProject } from '../../actions';
import { getOnboardingStatus } from '../../reducers/onboarding-status.reducer';

import Button from '../Button';

type Props = {
  shouldHideContent: boolean,
  startCreatingNewProject: () => void,
};

class IntroScreen extends Component<Props> {
  render() {
    const { shouldHideContent, startCreatingNewProject } = this.props;

    return (
      <Fragment>
        <Wrapper isVisible={!shouldHideContent}>
          <Logo>Guppy</Logo>

          <Button size="large" onClick={() => startCreatingNewProject()}>
            Create new React project
          </Button>
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

const Logo = styled.div`
  font-size: 42px;
`;

const mapStateToProps = state => ({
  shouldHideContent: getOnboardingStatus(state) !== 'brand-new',
});

export default connect(
  mapStateToProps,
  { startCreatingNewProject }
)(IntroScreen);
