import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import createProject from '../../services/create-project.service';

import ProgressStep from './ProgressStep';

const buildSteps = [
  'creating-parent-directory',
  'installing-cli-tool',
  'creating-project-directory',
  'installing-dependencies',
  'done',
];

class CreateNewProjectForm extends Component {
  state = {
    name: '',
    type: 'react',
    status: 'idle',
    currentBuildStep: null,
  };

  componentDidUpdate(prevProps, prevState) {
    // console.log('FROM:', prevState.status, prevState.currentBuildStep);
    // console.log('TO:', this.state.status, this.state.currentBuildStep);
    // console.log('------------');
  }

  updateName = ev => this.setState({ name: ev.target.value });
  generateRandomName = () => null; /* TODO */

  handleSubmit = () => {
    this.setState({
      status: 'building',
      currentBuildStep: buildSteps[0],
    });

    createProject(
      this.state,
      this.handleStatusUpdate,
      this.handleError,
      this.handleComplete
    );
  };

  handleStatusUpdate = output => {
    // HACK: So, I need some way of translating the raw output from CRA
    // (and any other updates) to the `step` enums in this component.
    // It feels really gross to parse the strings in search of terms...
    // but I don't have any better ideas.
    const message = output.toString();

    if (message.match(/Created parent directory/i)) {
      this.setState({ currentBuildStep: buildSteps[1] });
    } else if (message.match(/Installing packages/i)) {
      this.setState({ currentBuildStep: buildSteps[3] });
    }

    console.log(output.toString());
  };

  handleError = error => {
    const message = error.toString();

    if (message.match(/npx: installed/i)) {
      // For unknown reasons, npx installation throws an error?
      // Everything appears to work though, so I'm just going to treat this
      // as a success.
      this.setState({ currentBuildStep: buildSteps[2] });
    }
  };

  handleComplete = () => {
    this.setState({
      currentBuildStep: buildSteps[buildSteps.length - 1],
      status: 'done',
    });
  };

  render() {
    const { name, type, status, currentBuildStep } = this.state;

    const isLoading = currentBuildStep === 'loading';

    return (
      <form onSubmit={this.handleSubmit}>
        <Label>
          <span>Project Name</span>
          <input type="text" value={name} onChange={this.updateName} />
        </Label>

        <Label>
          <span>Project Type</span>
          <button>React</button>
        </Label>

        <Progress isVisible={true}>
          {buildSteps.map(step => {
            if (step === 'done') {
              return;
            }

            let stepStatus;

            if (step === currentBuildStep) {
              stepStatus = 'in-progress';
            } else if (
              buildSteps.indexOf(currentBuildStep) > buildSteps.indexOf(step)
            ) {
              stepStatus = 'done';
            } else {
              stepStatus = 'upcoming';
            }

            return (
              <ProgressStep key={step} status={stepStatus}>
                {step}
              </ProgressStep>
            );
          })}
        </Progress>

        <button disabled={status !== 'idle'}>
          {status === 'idle' ? 'Create' : 'Creating...'}
        </button>
      </form>
    );
  }
}

const Label = styled.label`
  display: block;
`;

const Progress = styled.div`
  width: 400px;
  margin: auto;
  padding: 10px;
  opacity: ${props => (props.isVisible ? 1 : 0)};
`;

export default connect(null, { createProject })(CreateNewProjectForm);
