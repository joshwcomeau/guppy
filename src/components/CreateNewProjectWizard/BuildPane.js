// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { check } from 'react-icons-kit/feather/check';

import { COLORS, RAW_COLORS } from '../../constants';
import createProject from '../../services/create-project.service';
import { replaceProjectStarterStringWithUrl } from './helpers';

import Spacer from '../Spacer';
import WhimsicalInstaller from '../WhimsicalInstaller';
import BuildStepProgress from './BuildStepProgress';

import type { BuildStep, Status } from './types';
import type { ProjectType, ProjectInternal } from '../../types';

const BUILD_STEPS = {
  installingCliTool: {
    copy: 'Installing build tool',
  },
  creatingProjectDirectory: {
    copy: 'Creating project directory',
  },
  installingDependencies: {
    copy: 'Installing dependencies',
    additionalCopy: 'This step can take a while...',
  },
  guppification: {
    copy: 'Persisting project info',
  },
};

export const BUILD_STEP_KEYS: Array<BuildStep> = Object.keys(BUILD_STEPS);

type Props = {
  projectName: string,
  projectType: ?ProjectType,
  projectIcon: ?string,
  projectStarter: string,
  status: Status,
  projectHomePath: string,
  handleCompleteBuild: (project: ProjectInternal) => void,
};

type State = {
  currentBuildStep: BuildStep,
  isCompleted: boolean,
  runInstaller: boolean,
};

class BuildPane extends PureComponent<Props, State> {
  timeoutId: ?number;
  state = {
    currentBuildStep: BUILD_STEPS[0],
    isCompleted: false,
    runInstaller: false,
  };

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.status === 'filling-in-form' &&
      this.props.status === 'building-project'
    ) {
      // We want to wait a bit before starting the whimsy animation, because
      // at this very moment, the pane is just beginning to unfold. We don't
      // want to re-render mid-animation!
      //
      // Also, WhimsicalInstaller takes its bounding-box measurements when
      // `runInstaller` becomes true, so we want it to be in its final position
      // when this happens. Otherwise, clicking files in the air instantly
      // "teleports" them a couple inches from the mouse :/
      this.timeoutId = window.setTimeout(() => {
        this.buildProject();

        this.timeoutId = window.setTimeout(() => {
          this.setState({ runInstaller: true });
        }, 500);
      }, 600);
    }
  }

  buildProject = () => {
    const {
      projectName,
      projectType,
      projectIcon,
      projectStarter: projectStarterInput,
    } = this.props;

    if (!projectName || !projectType || !projectIcon) {
      console.error('Missing one of:', {
        projectName,
        projectType,
        projectIcon,
      });
      throw new Error(
        'Tried to build project with insufficient data. See console for more info'
      );
    }

    // Replace starter string with URL.
    // No need to check if it exists as this already happend before we're here.
    const projectStarter = replaceProjectStarterStringWithUrl(
      projectStarterInput
    );

    createProject(
      { projectName, projectType, projectIcon, projectStarter },
      this.props.projectHomePath,
      this.handleStatusUpdate,
      this.handleError,
      this.handleComplete
    );

    return true;
  };

  handleStatusUpdate = (output: any) => {
    // HACK: So, I need some way of translating the raw output from CRA
    // (and any other updates) to the `step` enums in this component.
    // It feels really gross to parse the strings in search of terms...
    // but I don't have any better ideas.
    const message = output.toString();

    if (message.match(/Installing packages/i)) {
      this.setState({
        currentBuildStep: BUILD_STEP_KEYS[2],
      });
    } else if (message.match(/Dependencies installed/i)) {
      this.setState({
        currentBuildStep: BUILD_STEP_KEYS[3],
      });
    }
  };

  handleError = (error: any) => {
    const message = error.toString();

    if (message.match(/npx: installed/i)) {
      // For unknown reasons, npx installation throws an error?
      // Everything appears to work though, so I'm just going to treat this
      // as a success.
      this.setState({
        currentBuildStep: BUILD_STEP_KEYS[1],
      });
    }
  };

  handleComplete = (project: ProjectInternal) => {
    this.setState({ isCompleted: true });

    window.setTimeout(() => {
      // Allow for the "Succeeded!" message to flash before closing the modal
      this.props.handleCompleteBuild(project);
    }, 2000);
  };

  render() {
    const { currentBuildStep, isCompleted, runInstaller } = this.state;

    return (
      <Wrapper>
        <Finished isVisible={isCompleted}>
          <FinishedInnerWrapper>
            <IconBase size={128} icon={check} />
            <Spacer size={20} />
            Project Created!
          </FinishedInnerWrapper>
        </Finished>

        <Title>Building Project...</Title>

        <WhimsicalWrapper>
          {/*
            NOTE: Hardcoding a width because the performance suffers if it's
            computed dynamically
          */}
          <WhimsicalInstaller isRunning={runInstaller} width={420} />
        </WhimsicalWrapper>

        <BuildSteps>
          {BUILD_STEP_KEYS.map(stepKey => {
            const step = BUILD_STEPS[stepKey];

            let stepStatus;

            if (isCompleted) {
              stepStatus = 'done';
            } else if (stepKey === currentBuildStep) {
              stepStatus = 'in-progress';
            } else if (
              BUILD_STEP_KEYS.indexOf(currentBuildStep) >
              BUILD_STEP_KEYS.indexOf(stepKey)
            ) {
              stepStatus = 'done';
            } else {
              stepStatus = 'upcoming';
            }

            return (
              <BuildStepProgress
                key={stepKey}
                step={step}
                status={stepStatus}
              />
            );
          })}
        </BuildSteps>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  background-image: linear-gradient(
    45deg,
    ${RAW_COLORS.blue[900]},
    ${RAW_COLORS.blue[800]}
  );
  border: 4px solid ${COLORS.textOnBackground};
  color: ${COLORS.textOnBackground};
  box-shadow: 0px 6px 60px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 0;
  user-select: none;
`;

const BuildSteps = styled.div`
  width: 270px;
  padding-bottom: 30px;
`;

const Title = styled.h1`
  padding: 0 40px;
  font-size: 36px;
  text-align: center;
  pointer-events: none;
`;

const WhimsicalWrapper = styled.div`
  position: relative;
  width: 100%;
  /* Make sure it sits below the "Finished" overlay, when completed */
  z-index: 1;
`;

const Finished = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  border: 4px solid ${COLORS.textOnBackground};
  background-image: linear-gradient(
    45deg,
    ${RAW_COLORS.teal[500]},
    ${RAW_COLORS.lightGreen[700]}
  );
  font-size: 32px;
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
  will-change: clip-path;
  clip-path: polygon(
    ${props =>
      props.isVisible
        ? '-100% 0%, 100% 200%, 100% 0%'
        : '100% 0%, 100% 0%, 100% 0%'}
  );
  transition: clip-path 1000ms 350ms;
`;

const FinishedInnerWrapper = styled.div`
  text-align: center;
`;

export default BuildPane;
