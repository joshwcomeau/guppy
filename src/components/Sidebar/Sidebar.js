/* eslint-disable no-unexpected-multiline */
// @flow
import React, { PureComponent, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Spring, animated, config } from 'react-spring';
import styled from 'styled-components';
import { Tooltip } from 'react-tippy';
import { Scrollbars } from 'react-custom-scrollbars';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { RAW_COLORS, Z_INDICES } from '../../constants';
import * as actions from '../../actions';
import {
  getProjectsArray,
  getSelectedProjectId,
} from '../../reducers/projects.reducer';
import {
  getOnboardingStatus,
  getSidebarVisibility,
} from '../../reducers/onboarding-status.reducer';
import { getOnlineState } from '../../reducers/app-status.reducer';

import Spacer from '../Spacer';
import SidebarProjectIcon from './SidebarProjectIcon';
import AddProjectButton from './AddProjectButton';
import IntroductionBlurb from './IntroductionBlurb';

import type { Project } from '../../types';
import type { Dispatch } from '../../actions/types';
import type { State as OnboardingStatus } from '../../reducers/onboarding-status.reducer';
import type { Responders } from 'react-beautiful-dnd';

type Props = {
  projects: Array<Project>,
  selectedProjectId: ?string,
  onboardingStatus: OnboardingStatus,
  isVisible: boolean,
  isOnline: boolean,
  createNewProjectStart: Dispatch<typeof actions.createNewProjectStart>,
  selectProject: Dispatch<typeof actions.selectProject>,
  rearrangeProjects: Dispatch<typeof actions.rearrangeProjectsInSidebar>,
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

const springConfig = key =>
  key === 'sidebarOffsetPercentage'
    ? {
        tension: 200,
        friction: 20,
        precision: 0.75,
      }
    : config.default;

const INTRO_SEQUENCE_STEPS = [
  'sidebar-slide-in',
  'first-project-fall-in',
  'add-projects-fade-in',
];

// Creating a portal to get around an issue with position fixed and transform property
// which creates a weird offset while dragging
// Ref https://github.com/atlassian/react-beautiful-dnd/issues/499
let portal: HTMLElement = document.createElement('div');
portal.id = 'sidebarDndPortal';
if (document.body) {
  document.body.appendChild(portal);
}

// TODO: this component re-renders whenever _anything_ with a project changes
// (like adding a log to a task). It might be prudent to add a selector that
// only provides the fields necessary for the sidebar.
export class Sidebar extends PureComponent<Props, State> {
  static defaultProps = {
    projects: [],
  };

  timeoutId: number;
  state = {
    introSequenceStep: null,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.isVisible && nextProps.isVisible) {
      this.setState({
        introSequenceStep: 'sidebar-slide-in',
      });

      // HACK: timeout-based spring animations are a no-no, but I'm in a hurry.
      // Maybe `StaggeredMotion` could help, but it's really meant for things
      // of the same type, not unrelated sequenced animations :/ plus, it's
      // a more confusing API made worse by the fact that these animations
      // are all state-dependent.
      // TODO: Move this to `componentDidUpdate` to avoid setTimeouts.
      this.timeoutId = window.setTimeout(() => {
        this.setState({
          introSequenceStep: 'first-project-fall-in',
        });

        this.timeoutId = window.setTimeout(() => {
          this.setState({
            introSequenceStep: 'add-projects-fade-in',
          });
        }, 600);
      }, 125);
    }

    // Reset all!
    // Required to hide the IntroductionBlurb after `Reset state`.
    if (this.props.isVisible && nextProps.onboardingStatus === 'brand-new') {
      this.setState({
        introSequenceStep: null,
      });
    }
  }

  onDragEnd = (result: Responders.onDragEnd) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    this.props.rearrangeProjects(result.source.index, result.destination.index);
  };

  render() {
    const {
      projects,
      selectedProjectId,
      isVisible,
      onboardingStatus,
      createNewProjectStart,
      selectProject,
      isOnline,
    } = this.props;
    const { introSequenceStep } = this.state;

    const introSequenceStepIndex = INTRO_SEQUENCE_STEPS.indexOf(
      introSequenceStep
    );

    const finishedOnboarding = onboardingStatus === 'done';

    return (
      <Spring
        to={{
          sidebarOffsetPercentage: finishedOnboarding || isVisible ? 0 : -100,
          firstProjectPosition:
            finishedOnboarding || introSequenceStepIndex >= 1 ? 0 : -150,
        }}
        config={springConfig}
      >
        {interpolated => (
          <Fragment>
            <Wrapper offset={`${interpolated.sidebarOffsetPercentage}%`}>
              <IntroductionBlurb
                isVisible={!finishedOnboarding && introSequenceStepIndex >= 1}
              />
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Scrollbars autoHide>
                  <Droppable droppableId="droppable">
                    {provided => (
                      <div ref={provided.innerRef}>
                        <Projects
                          offset={`${interpolated.firstProjectPosition}px`}
                        >
                          {projects.map((project, index) => (
                            <Draggable
                              key={project.id}
                              draggableId={project.id}
                              index={index}
                              disableInteractiveElementBlocking
                              isDragDisabled={projects.length === 1}
                            >
                              {(providedInn, snapshot) => {
                                const child = (
                                  <div
                                    ref={providedInn.innerRef}
                                    {...providedInn.draggableProps}
                                    {...providedInn.dragHandleProps}
                                    style={{
                                      userSelect: 'none',
                                      ...providedInn.draggableProps.style,
                                    }}
                                  >
                                    <Fragment key={project.id}>
                                      <Tooltip
                                        title={project.name}
                                        position="right"
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
                                          handleSelect={() =>
                                            selectProject(project.id)
                                          }
                                        />
                                      </Tooltip>
                                      <Spacer size={18} />
                                    </Fragment>
                                  </div>
                                );

                                // If it's not dragging, just return the child
                                if (!snapshot.isDragging) return child;

                                // if dragging - put the item in a portal
                                return ReactDOM.createPortal(child, portal);
                              }}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          <AddProjectButton
                            size={SIDEBAR_ICON_SIZE}
                            onClick={createNewProjectStart}
                            isVisible={
                              finishedOnboarding || introSequenceStepIndex >= 2
                            }
                            isOnline={isOnline}
                          />
                        </Projects>
                      </div>
                    )}
                  </Droppable>
                </Scrollbars>
              </DragDropContext>
            </Wrapper>
            {isVisible && <SidebarSpacer />}
          </Fragment>
        )}
      </Spring>
    );
  }
}

const Wrapper = animated(styled.nav.attrs({
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
    ${RAW_COLORS.blue[900]},
    ${RAW_COLORS.blue[700]}
  );
  will-change: transform;
  height: 100vh;
`);

const SidebarSpacer = styled.div`
  position: relative;
  height: 100vh;
  width: ${SIDEBAR_WIDTH}px;
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
  isOnline: getOnlineState(state),
});

const mapDispatchToProps = {
  createNewProjectStart: actions.createNewProjectStart,
  selectProject: actions.selectProject,
  rearrangeProjects: actions.rearrangeProjectsInSidebar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
