import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { COLORS } from '../../constants';
import {
  extractSelectedTaskFromUrl,
  buildUrlForProjectTask,
} from '../../services/location.service';
import { getSelectedProject } from '../../reducers/projects.reducer';

import ProjectTaskNavItem from '../ProjectTaskNavItem';
import ProjectTaskManagement from '../ProjectTaskManagement';

import type { Project } from '../../types';

type Props = {
  project: Project,
  location: any, // provided by react-router
};

class ProjectTasks extends PureComponent<Props> {
  render() {
    const { project, location } = this.props;

    const taskNames = project.tasks.map(task => task.taskName);

    const selectedTaskName =
      extractSelectedTaskFromUrl(location) || taskNames[0];

    return (
      <Wrapper>
        <TaskList>
          {taskNames.map(taskName => (
            <ProjectTaskNavItem
              key={taskName}
              projectId={project.id}
              taskName={taskName}
              status="running"
              isSelected={taskName === selectedTaskName}
            />
          ))}
        </TaskList>
        <TaskInfoWrapper>
          <Switch>
            <Route
              path="/project/:projectId/tasks/:taskName"
              component={ProjectTaskManagement}
            />
            <Redirect
              to={buildUrlForProjectTask(project.id, selectedTaskName)}
            />
          </Switch>
        </TaskInfoWrapper>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
`;

const TaskList = styled.div`
  width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: ${COLORS.gray[100]};
  padding-top: 10px;
  padding-bottom: 10px;
  border-right: 4px solid rgba(0, 0, 0, 0.1);
`;

const Task = styled.div`
  display: block;
`;
const TaskInfoWrapper = styled.div`
  flex: 1;
  padding-left: 30px;
`;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

export default connect(mapStateToProps)(ProjectTasks);
