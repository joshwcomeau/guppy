// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { runTask, abortTask } from '../../actions';
import { getSelectedProjectId } from '../../reducers/projects.reducer';
import { getTaskByProjectIdAndTaskName } from '../../reducers/tasks.reducer';

import Pane from '../Pane';

import type { Project } from '../../types';

type Props = {
  project: Project,
};

class DependencyManagementPane extends PureComponent<Props> {
  render() {
    return (
      <Pane
        title="Dependencies"
        primaryActionChildren={'Action'}
        leftSideChildren="Stuff"
        rightSideChildren="Other stuff"
      />
    );
  }
}

const mapStateToProps = state => {
  const selectedProjectId = getSelectedProjectId(state);

  // For now, I'm assuming that the dev server task will be named `start`.
  // This is not universally true, not even for Gatsby projects! So this will
  // need to be customizable (or at least based on type).
  const taskName = 'start';

  return {
    task: getTaskByProjectIdAndTaskName(selectedProjectId, taskName, state),
  };
};

const mapDispatchToProps = { runTask, abortTask };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DependencyManagementPane);
