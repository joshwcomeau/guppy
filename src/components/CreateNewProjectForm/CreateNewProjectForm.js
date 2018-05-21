import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { createProject } from '../../actions';

class CreateNewProjectForm extends Component {
  state = {
    name: '',
    type: 'react',
  };

  updateName = ev => this.setState({ name: ev.target.value });
  generateRandomName = () => null; /* TODO */

  handleSubmit = () => {
    const id = this.state.name;
    this.props.createProject({ ...this.state, id });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Label>
          <span>Project Name</span>
          <input type="text" onChange={this.updateName} />
        </Label>

        <Label>
          <span>Project Type</span>
          <button>React</button>
        </Label>

        <button>Create</button>
      </form>
    );
  }
}

const Label = styled.label`
  display: block;
`;

export default connect(null, { createProject })(CreateNewProjectForm);
