import React, { Component } from 'react';
import styled from 'styled-components';

class CreateNewProjectForm extends Component {
  state = {
    name: '',
    type: 'react',
  };

  updateName = ev => this.setState({ name: ev.target.value });
  generateRandomName = () => null; /* TODO */

  handleSubmit = () => {
    console.log(this.state);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <span>Project Name</span>
          <input type="text" onChange={this.updateName} />
        </label>

        <label>
          <span>Project Type</span>
          <button>React</button>
        </label>

        <button>Create</button>
      </form>
    );
  }
}

const Label = styled.label`
  display: block;
`;

export default CreateNewProjectForm;
