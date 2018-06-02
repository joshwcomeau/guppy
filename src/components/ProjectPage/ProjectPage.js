// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Link } from 'react-router-dom';
import styled from 'styled-components';

import { selectProject } from '../../actions';
import { getSelectedProject } from '../../reducers/projects.reducer';
import { extractProjectTabFromUrl } from '../../services/location.service';

import MainContentWrapper from '../MainContentWrapper';
import Heading from '../Heading';
import TabbedNav from '../TabbedNav';
import PixelShifter from '../PixelShifter';
import Spacer from '../Spacer';
import ProjectTasks from '../ProjectTasks';
import ProjectDependencies from '../ProjectDependencies';
import ProjectConfiguration from '../ProjectConfiguration';

import type { Action } from 'redux';
import type { Project } from '../../types';

type Props = {
  project: Project,
  selectProject: Action,
  location: any, // provided by react-router
  match: any, // provided by react-router
};

class ProjectPage extends Component<Props> {
  render() {
    const { project, location, match } = this.props;

    const projectIdFromUrl = match.params.projectId;
    const projectTabFromUrl = extractProjectTabFromUrl(location) || 'tasks';

    return (
      <MainContentWrapper>
        <PixelShifter x={-2}>
          <Heading size="large">{project.name}</Heading>
        </PixelShifter>

        <Spacer size={30} />

        <TabbedNav
          selectedTabId={projectTabFromUrl}
          tabs={[
            { id: 'tasks', label: 'Tasks', href: `${match.url}/tasks` },
            { id: 'deps', label: 'Dependencies', href: `${match.url}/deps` },
            { id: 'conf', label: 'Configuration', href: `${match.url}/conf` },
          ]}
        />

        <Spacer size={10} />

        <Switch>
          <Route path="/project/:projectId/tasks" component={ProjectTasks} />
          <Route
            path="/project/:projectId/deps"
            component={ProjectDependencies}
          />
          <Route
            path="/project/:projectId/conf"
            component={ProjectConfiguration}
          />
          <Route component={ProjectTasks} />
        </Switch>
      </MainContentWrapper>
    );
  }
}

const ChildRoutes = styled.div``;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

export default connect(mapStateToProps)(ProjectPage);
