// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { check } from 'react-icons-kit/feather/check';

import { COLORS } from '../../constants';
import createProject from '../../services/create-project.service';

import ProgressBar from '../ProgressBar';
import Spacer from '../Spacer';
import WhimsicalInstaller from '../WhimsicalInstaller';
import AvailableWidth from '../AvailableWidth';
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

const BUILD_STEP_KEYS: Array<BuildStep> = Object.keys(BUILD_STEPS);

type Props = {
  projectName: string,
  projectType: ?ProjectType,
  projectIcon: ?string,
  status: Status,
  projectHomePath: string,
  handleCompleteBuild: (project: ProjectInternal) => void,
};

type State = {
  currentBuildStep: BuildStep,
  progress: number,
  runInstaller: boolean,
};

class BuildPane extends PureComponent<Props, State> {
  timeoutId: ?number;
  state = {
    currentBuildStep: BUILD_STEPS[0],
    progress: 0,
    runInstaller: false,
  };

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.status === 'filling-in-form' &&
      this.props.status === 'building-project'
    ) {
      this.buildProject();

      // We want to wait a bit before starting the whimsy animation, because
      // at this very moment, the pane is just beginning to unfold. We don't
      // want to re-render mid-animation!
      //
      // Also, WhimsicalInstaller takes its bounding-box measurements when
      // `runInstaller` becomes true, so we want it to be in its final position
      // when this happens. Otherwise, clicking files in the air instantly
      // "teleports" them a couple inches from the mouse :/
      this.timeoutId = window.setTimeout(() => {
        this.setState({ runInstaller: true });
      }, 1000);
    }
  }

  buildProject = () => {
    const { projectName, projectType, projectIcon } = this.props;

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

    createProject(
      { projectName, projectType, projectIcon },
      this.props.projectHomePath,
      this.handleStatusUpdate,
      this.handleError,
      this.handleComplete
    );
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
        progress: 0.4,
      });
      // eslint-disable-next-line no-control-regex
    } else if (message.match(/Installing \[36mreact/i)) {
      this.setState(state => ({
        progress: state.progress + 0.025,
      }));
    } else if (message.match(/No lockfile found/i)) {
      this.setState(state => ({
        progress: state.progress + 0.025,
      }));
    } else if (message.match(/Resolving packages/i)) {
      this.setState(state => ({
        progress: state.progress + 0.05,
      }));
    } else if (message.match(/Fetching packages/i)) {
      this.setState(state => ({
        progress: state.progress + 0.05,
      }));
    } else if (message.match(/Linking dependencies/i)) {
      this.setState(state => ({
        progress: state.progress + 0.05,
      }));
    } else if (message.match(/Building fresh packages/i)) {
      this.setState(state => ({
        progress: state.progress + 0.15,
      }));
    } else if (message.match(/Dependencies installed/i)) {
      this.setState({
        currentBuildStep: BUILD_STEP_KEYS[3],
        progress: 0.9,
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
        progress: 0.2,
      });
    }
  };

  handleComplete = (project: ProjectInternal) => {
    this.setState({ progress: 1 });

    window.setTimeout(() => {
      this.props.handleCompleteBuild(project);
    }, 2000);
  };

  render() {
    const { currentBuildStep, progress, runInstaller } = this.state;

    return (
      <Wrapper>
        <Finished isVisible={progress === 1}>
          <FinishedInnerWrapper>
            <IconBase size={128} icon={check} />
            <Spacer size={20} />
            Project Created!
          </FinishedInnerWrapper>
        </Finished>

        <ProgressBarWrapper>
          <ProgressBar
            progress={progress}
            stiffness={progress === 1 ? 128 : 64}
            damping={progress === 1 ? 22 : 32}
          />
        </ProgressBarWrapper>

        <WhimsicalWrapper>
          <AvailableWidth>
            {width => (
              <WhimsicalInstaller isRunning={runInstaller} width={width} />
            )}
          </AvailableWidth>
        </WhimsicalWrapper>

        <Title>Building Project...</Title>

        <BuildSteps>
          {BUILD_STEP_KEYS.map(stepKey => {
            const step = BUILD_STEPS[stepKey];

            let stepStatus;

            if (progress === 1) {
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
    ${COLORS.blue[900]},
    ${COLORS.blue[800]}
  );
  border: 4px solid ${COLORS.white};
  color: ${COLORS.white};
  box-shadow: 0px 6px 60px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 0;
`;

const ProgressBarWrapper = styled.div`
  position: absolute;
  top: 4px;
  left: 4px;
  right: 4px;
`;

const BuildSteps = styled.div`
  width: 270px;
  padding-bottom: 30px;
`;

const Title = styled.h1`
  padding: 0 40px;
  margin-top: -30px;
  font-size: 36px;
  text-align: center;
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
  border: 4px solid ${COLORS.white};
  background-image: linear-gradient(
    45deg,
    ${COLORS.teal[500]},
    ${COLORS.lightGreen[700]}
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
