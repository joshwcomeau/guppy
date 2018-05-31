import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { COLORS } from '../../constants';
import { extractSelectedTaskFromUrl } from '../../services/location.service';
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

    const taskIds = Object.keys(project.scripts);

    const selectedTaskId = extractSelectedTaskFromUrl(location) || taskIds[0];

    return (
      <Wrapper>
        <TaskList>
          {taskIds.map(taskId => (
            <ProjectTaskNavItem
              key={taskId}
              projectId={project.guppy.id}
              taskId={taskId}
              status="running"
              isSelected={taskId === selectedTaskId}
            />
          ))}
        </TaskList>
        <TaskInfoWrapper>
          <Switch>
            <Route
              path="/project/:projectId/tasks/:taskId"
              component={ProjectTaskManagement}
            />
            <Redirect to={`/project/:projectId/tasks/${selectedTaskId}`} />
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
  box-shadow: inset -4px 0px 0px rgba(0, 0, 0, 0.1);
`;

const Task = styled.div`
  display: block;
`;
const TaskInfoWrapper = styled.div`
  flex: 1;
  padding: 30px;
`;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

export default connect(mapStateToProps)(ProjectTasks);
