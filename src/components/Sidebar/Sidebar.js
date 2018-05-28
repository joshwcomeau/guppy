// @flow
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';

import { COLORS, Z_INDICES } from '../../constants';
import { startCreatingNewProject, dismissSidebarIntro } from '../../actions';
import { getProjectsArray } from '../../reducers/projects.reducer';
import {
  getOnboardingStatus,
  getSidebarVisibility,
} from '../../reducers/onboarding-status.reducer';

import Spacer from '../Spacer';
import SidebarProjectIcon from './SidebarProjectIcon';
import AddProjectButton from './AddProjectButton';
import IntroductionBlurb from './IntroductionBlurb';

import type Project from '../../types';
import type { State as OnboardingStatus } from '../../reducers/onboarding-status.reducer';

type Props = {
  projects: Array<Project>,
  onboardingStatus: OnboardingStatus,
  isVisible: boolean,
  startCreatingNewProject: () => void,
};

type State = {
  introSequenceStep:
    | 'sidebar-slide-in'
    | 'first-project-fall-in'
    | 'add-projects-fade-in'
    | null,
};

const SIDEBAR_ICON_SIZE = 45;
const springSettings = { stiffness: 200, damping: 20, precision: 0.75 };

const INTRO_SEQUENCE_STEPS = [
  'sidebar-slide-in',
  'first-project-fall-in',
  'add-projects-fade-in',
];

class Sidebar extends PureComponent<Props, State> {
  timeoutId: number;
  state = {
    introSequenceStep: null,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.isVisible && nextProps.isVisible) {
      this.setState({ introSequenceStep: 'sidebar-slide-in' });

      // HACK: timeout-based spring animations are a no-no, but I'm in a hurry.
      // Maybe `StaggeredMotion` could help, but it's really meant for things
      // of the same type, not unrelated sequenced animations :/ plus, it's
      // a more confusing API made worse by the fact that these animations
      // are all state-dependent.
      // TODO: Move this to `componentDidUpdate` to avoid setTimeouts.
      this.timeoutId = window.setTimeout(() => {
        this.setState({ introSequenceStep: 'first-project-fall-in' });

        this.timeoutId = window.setTimeout(() => {
          this.setState({ introSequenceStep: 'add-projects-fade-in' });
        }, 600);
      }, 125);
    }
  }

  renderProjects() {
    const { projects, onboardingStatus } = this.props;
  }

  render() {
    const {
      projects,
      isVisible,
      onboardingStatus,
      startCreatingNewProject,
      dismissSidebarIntro,
    } = this.props;
    const { introSequenceStep } = this.state;

    const introSequenceStepIndex = INTRO_SEQUENCE_STEPS.indexOf(
      introSequenceStep
    );

    const finishedOnboarding = onboardingStatus === 'done';

    return (
      <Motion
        style={{
          sidebarOffsetPercentage: finishedOnboarding
            ? 0
            : spring(isVisible ? 0 : -100, springSettings),
          firstProjectPosition: finishedOnboarding
            ? 0
            : spring(introSequenceStepIndex >= 1 ? 0 : -150),
        }}
      >
        {({ sidebarOffsetPercentage, firstProjectPosition }) => (
          <Wrapper offset={`${sidebarOffsetPercentage}%`}>
            <IntroductionBlurb
              isVisible={!finishedOnboarding && introSequenceStepIndex >= 1}
              onDismiss={dismissSidebarIntro}
            />

            <Projects offset={`${firstProjectPosition}px`}>
              {projects.map(project => (
                <Fragment key={project.guppy.id}>
                  <SidebarProjectIcon
                    size={SIDEBAR_ICON_SIZE}
                    id={project.guppy.id}
                    name={project.guppy.name}
                    iconSrc={project.guppy.icon}
                    isSelected={true}
                    onClick={console.log}
                  />
                  <Spacer size={18} />
                </Fragment>
              ))}
              <AddProjectButton
                size={SIDEBAR_ICON_SIZE}
                onClick={startCreatingNewProject}
                isVisible={finishedOnboarding || introSequenceStepIndex >= 2}
              />
            </Projects>
          </Wrapper>
        )}
      </Motion>
    );
  }
}

const Wrapper = styled.nav.attrs({
  style: props => ({
    transform: `translateX(${props.offset})`,
  }),
})`
  position: absolute;
  z-index: ${Z_INDICES.sidebar};
  top: 0;
  left: -20px;
  bottom: 0;
  width: 90px;
  padding-top: 40px;
  padding-left: 20px;
  background-image: linear-gradient(
    85deg,
    ${COLORS.blue[900]},
    ${COLORS.blue[700]}
  );
  transform: translateX(${props => props.offset});
  will-change: transform;
`;

const Projects = styled.div.attrs({
  style: props => ({
    transform: `translateY(${props.offset})`,
  }),
})`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const mapStateToProps = state => ({
  projects: getProjectsArray(state),
  onboardingStatus: getOnboardingStatus(state),
  isVisible: getSidebarVisibility(state),
});

const mapDispatchToProps = { startCreatingNewProject, dismissSidebarIntro };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
