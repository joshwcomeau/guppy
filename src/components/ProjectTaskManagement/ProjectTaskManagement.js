// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getSelectedProject } from '../../reducers/projects.reducer';

import Heading from '../Heading';

import type { Project } from '../../types';

type Props = {
  project: Project,
  match: any, // from react-router
};

class ProjectTaskManagement extends Component<Props> {
  render() {
    const { project, match } = this.props;
    const { taskId } = match.params;

    const task = project.scripts[taskId];

    console.log('PROJECT TASK MANAGEMENT GO');

    return (
      <Wrapper>
        <Heading>{taskId}</Heading>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div``;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

export default connect(mapStateToProps)(ProjectTaskManagement);
