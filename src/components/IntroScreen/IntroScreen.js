// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';
import { COLORS } from '../../constants';
import { getOnboardingStatus } from '../../reducers/onboarding-status.reducer';

import { StrokeButton } from '../Button';
import ImportProjectButton from '../ImportProjectButton';
import Spacer from '../Spacer';
import Logo from '../Logo';

import type { Dispatch } from '../../actions/types';

type Props = {
  shouldHideContent: boolean,
  createNewProjectStart: Dispatch<typeof actions.createNewProjectStart>,
};

class IntroScreen extends Component<Props> {
  render() {
    const { shouldHideContent, createNewProjectStart } = this.props;

    return (
      <Fragment>
        <Wrapper isVisible={!shouldHideContent}>
          <Header>
            <Logo size="large" />

            <AppName>Guppy</AppName>
          </Header>

          <Actions>
            <StrokeButton size="large" onClick={() => createNewProjectStart()}>
              Create a new web application
            </StrokeButton>
            <Spacer size={40} />
            <div>
              Or,{' '}
              <ImportProjectButton color={COLORS.link}>
                import an existing project
              </ImportProjectButton>
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
`;

const Actions = styled.div`
  text-align: center;
  font-size: 20px;
`;

const mapStateToProps = state => ({
  shouldHideContent: getOnboardingStatus(state) !== 'brand-new',
});

export default connect(
  mapStateToProps,
  { createNewProjectStart: actions.createNewProjectStart }
)(IntroScreen);
