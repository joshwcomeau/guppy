// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { runTask, abortTask } from '../../actions';
import { getSelectedProject } from '../../reducers/projects.reducer';
import { getTaskByProjectIdAndTaskName } from '../../reducers/tasks.reducer';

import Module from '../Module';

import type { Project } from '../../types';

type Props = {
  project: Project,
};

class DependencyManagementPane extends PureComponent<Props> {
  render() {
    return (
      <Module title="Dependencies" primaryActionChildren={'Action'}>
        Dependency things
      </Module>
    );
  }
}

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

const mapDispatchToProps = { runTask, abortTask };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DependencyManagementPane);
