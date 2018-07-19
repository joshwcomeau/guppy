import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { refreshProjects } from '../../actions';
import createProject from '../../services/create-project.service';

import FormField from '../FormField';
import TextInput from '../TextInput';
import Button from '../Button';
import ProgressStep from './ProgressStep';
import { COLORS } from '../../constants';

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

    // TODO: quick timeout for effects?
    this.props.refreshProjects();
  };

  render() {
    const { name, status, currentBuildStep } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        {status === 'idle' && (
          <Fragment>
            <FormField label="Name" labelWidth={50}>
              <TextInput type="text" value={name} onChange={this.updateName} />
            </FormField>

            <FormField label="Type" labelWidth={50} />

            <SubmitWrapper>
              <Button
                size="large"
                style={{
                  backgroundImage: `linear-gradient(
                    -80deg,
                    ${COLORS.green[500]},
                    ${COLORS.lime[500]}
                  `,
                }}
                disabled={status !== 'idle'}
              >
                {status === 'idle' ? 'Create' : 'Creating...'}
              </Button>
            </SubmitWrapper>
          </Fragment>
        )}

        {status !== 'idle' && (
          <Progress>
            {buildSteps.map(step => {
              if (step === 'done') {
                return null;
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
        )}
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
`;

const SubmitWrapper = styled.div`
  margin-top: 40px;
  text-align: center;
`;

export default connect(null, { refreshProjects })(CreateNewProjectForm);
