// @flow
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';
import { Tooltip } from 'react-tippy';
import { Scrollbars } from 'react-custom-scrollbars';

import { COLORS, Z_INDICES } from '../../constants';
import * as actions from '../../actions';
import {
  getProjectsArray,
  getSelectedProjectId,
} from '../../reducers/projects.reducer';
import {
  getOnboardingStatus,
  getSidebarVisibility,
} from '../../reducers/onboarding-status.reducer';

import Spacer from '../Spacer';
import SidebarProjectIcon from './SidebarProjectIcon';
import AddProjectButton from './AddProjectButton';
import IntroductionBlurb from './IntroductionBlurb';

import type { Project } from '../../types';
import type { Dispatch } from '../../actions/types';
import type { State as OnboardingStatus } from '../../reducers/onboarding-status.reducer';

type Props = {
  projects: Array<Project>,
  selectedProjectId: ?string,
  onboardingStatus: OnboardingStatus,
  isVisible: boolean,
  createNewProjectStart: Dispatch<typeof actions.createNewProjectStart>,
  selectProject: Dispatch<typeof actions.selectProject>,
};

type State = {
  introSequenceStep:
    | 'sidebar-slide-in'
    | 'first-project-fall-in'
    | 'add-projects-fade-in'
    | null,
};

export const SIDEBAR_WIDTH = 70;
const SIDEBAR_OVERFLOW = 20;
const SIDEBAR_ICON_SIZE = 45;

const springSettings = { stiffness: 200, damping: 20, precision: 0.75 };

const INTRO_SEQUENCE_STEPS = [
  'sidebar-slide-in',
  'first-project-fall-in',
  'add-projects-fade-in',
];

// TODO: this component re-renders whenever _anything_ with a project changes
// (like adding a log to a task). It might be prudent to add a selector that
// only provides the fields necessary for the sidebar.
class Sidebar extends PureComponent<Props, State> {
  static defaultProps = {
    projects: [],
  };

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

    // Reset all!
    // Required to hide the IntroductionBlurb after `Reset state`.
    if (this.props.isVisible && nextProps.onboardingStatus === 'brand-new') {
      this.setState({ introSequenceStep: null });
    }
  }

  render() {
    const {
      projects,
      selectedProjectId,
      isVisible,
      onboardingStatus,
      createNewProjectStart,
      selectProject,
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
          <Fragment>
            <Wrapper offset={`${sidebarOffsetPercentage}%`}>
              <ScrollbarOnlyVertical
                autoHide
                renderThumbVertical={({ style, ...props }) => (
                  // Info: Styled-components not working here yet
                  //       --> PR 286 @ react-custom-scrollbars will fix this
                  <div
                    {...props}
                    style={{
                      ...style,
                      background: COLORS.transparentWhite[700],
                      borderRadius: '6px',
                    }}
                    className="thumb-vertical"
                  />
                )}
                renderTrackHorizontal={props => (
                  <div {...props} style={{ display: 'none' }} />
                )}
              >
                <IntroductionBlurb
                  isVisible={!finishedOnboarding && introSequenceStepIndex >= 1}
                />

                <Projects offset={`${firstProjectPosition}px`}>
                  {projects.map(project => (
                    <Fragment key={project.id}>
                      <Tooltip
                        title={project.name}
                        position="right"
                        transitionFlip={false}
                      >
                        <SidebarProjectIcon
                          size={SIDEBAR_ICON_SIZE}
                          id={project.id}
                          name={project.name}
                          color={project.color}
                          iconSrc={project.icon}
                          isSelected={
                            finishedOnboarding &&
                            project.id === selectedProjectId
                          }
                          handleSelect={() => selectProject(project.id)}
                        />
                      </Tooltip>
                      <Spacer size={18} />
                    </Fragment>
                  ))}
                  <AddProjectButton
                    size={SIDEBAR_ICON_SIZE}
                    onClick={createNewProjectStart}
                    isVisible={
                      finishedOnboarding || introSequenceStepIndex >= 2
                    }
                  />
                </Projects>
              </ScrollbarOnlyVertical>
            </Wrapper>
            {isVisible && <SidebarSpacer />}
          </Fragment>
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
  position: fixed;
  z-index: ${Z_INDICES.sidebar};
  top: 0;
  left: -${SIDEBAR_OVERFLOW}px;
  bottom: 0;
  width: ${SIDEBAR_WIDTH + SIDEBAR_OVERFLOW}px;
  padding-left: ${SIDEBAR_OVERFLOW}px;
  background-image: linear-gradient(
    85deg,
    ${COLORS.blue[900]},
    ${COLORS.blue[700]}
  );
  transform: translateX(${props => props.offset});
  will-change: transform;
  height: 100vh;
`;

const SidebarSpacer = styled.div`
  position: relative;
  height: 100vh;
  width: ${SIDEBAR_WIDTH}px;
`;

const ScrollbarOnlyVertical = styled(Scrollbars)`
  // hide overflow-x so left/right scrolling is disabled
  > div:first-child {
    overflow-x: hidden !important;
  }
`;

const Projects = styled.div.attrs({
  style: props => ({
    transform: `translateY(${props.offset})`,
  }),
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
`;

const mapStateToProps = state => ({
  projects: getProjectsArray(state),
  onboardingStatus: getOnboardingStatus(state),
  isVisible: getSidebarVisibility(state),
  selectedProjectId: getSelectedProjectId(state),
});

const mapDispatchToProps = {
  createNewProjectStart: actions.createNewProjectStart,
  selectProject: actions.selectProject,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
