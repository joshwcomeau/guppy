// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';
import createProject from '../../services/create-project.service';

import BuildStepProgress from './BuildStepProgress';

import type { BuildStep } from './types';
import type { SubmittedProject } from '../../types';

const BUILD_STEPS = {
  creatingParentDirectory: {
    copy: 'Creating parent directory',
  },
  installingCliTool: {
    copy: 'Installing build tool',
  },
  creatingProjectDirectory: {
    copy: 'Creating project directory',
  },
  installingDependencies: {
    copy: 'Installing dependencies.',
    additionalCopy: 'This step can take a while...',
  },
};

const BUILD_STEP_KEYS: Array<BuildStep> = Object.keys(BUILD_STEPS);

type Props = {
  project: SubmittedProject,
  handleCompleteBuild: () => void,
};

type State = {
  currentBuildStep: BuildStep,
  completed: boolean,
};

class BuildPane extends PureComponent<Props, State> {
  static defaultProps = {
    handleCompleteBuild: () => console.log('DONE!'),
  };

  state = {
    currentBuildStep: BUILD_STEPS[0],
    completed: false,
  };

  componentDidMount() {
    createProject(
      this.props.project,
      this.handleStatusUpdate,
      this.handleError,
      this.handleComplete
    );
  }

  handleStatusUpdate = (output: any) => {
    // HACK: So, I need some way of translating the raw output from CRA
    // (and any other updates) to the `step` enums in this component.
    // It feels really gross to parse the strings in search of terms...
    // but I don't have any better ideas.
    const message = output.toString();

    if (message.match(/Created parent directory/i)) {
      this.setState({ currentBuildStep: BUILD_STEP_KEYS[1] });
    } else if (message.match(/Installing packages/i)) {
      this.setState({ currentBuildStep: BUILD_STEP_KEYS[3] });
    }
  };

  handleError = (error: any) => {
    const message = error.toString();

    if (message.match(/npx: installed/i)) {
      // For unknown reasons, npx installation throws an error?
      // Everything appears to work though, so I'm just going to treat this
      // as a success.
      this.setState({ currentBuildStep: BUILD_STEP_KEYS[2] });
    }
  };

  handleComplete = () => {
    this.setState({ completed: true });
    // TODO: quick timeout for effects?
    this.props.handleCompleteBuild();
  };

  render() {
    const { currentBuildStep, completed } = this.state;

    return (
      <Wrapper>
        <Title>Building Project...</Title>

        <BuildSteps>
          {BUILD_STEP_KEYS.map(stepKey => {
            const step = BUILD_STEPS[stepKey];

            let stepStatus;

            if (completed) {
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
  padding: 40px;
  background-image: linear-gradient(
    45deg,
    ${COLORS.gray[900]},
    ${COLORS.blue[900]}
  );
  border: 4px solid ${COLORS.white};
  color: ${COLORS.white};
  box-shadow: 0px 6px 60px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 0;
`;

const BuildSteps = styled.div`
  width: 250px;
  padding-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 36px;
  text-align: center;
`;

export default BuildPane;
