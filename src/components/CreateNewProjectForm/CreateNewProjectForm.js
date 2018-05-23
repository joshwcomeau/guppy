import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import createProject from '../../services/create-project.service';

const steps = [
  'idle',
  'creating-parent-directory',
  'installing-cli-tool',
  'installing-dependencies',
  'done',
];

class CreateNewProjectForm extends Component {
  state = {
    name: '',
    type: 'react',
    step: 'idle',
  };

  updateName = ev => this.setState({ name: ev.target.value });
  generateRandomName = () => null; /* TODO */

  handleSubmit = () => {
    createProject(
      this.state,
      this.handleStatusUpdate,
      this.handleError,
      this.handleComplete
    );
  };

  handleStatusUpdate = output => {
    console.log(`STATUS UPDATE: ${output}`);
  };

  handleError = error => {
    console.error(error);
  };

  handleComplete = () => {
    this.setState({ step: 'done' });
  };

  render() {
    const { name, type, step } = this.state;

    const isLoading = step === 'loading';

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

        <button disabled={step !== 'idle'}>
          {step === 'idle' ? 'Create' : 'Creating...'}
        </button>
      </form>
    );
  }
}

const Label = styled.label`
  display: block;
`;

export default connect(null, { createProject })(CreateNewProjectForm);
