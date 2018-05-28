// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectProject } from '../../actions';
import { getSelectedProject } from '../../reducers/projects.reducer';

import type { Action } from 'redux';
import type { Project } from '../../types';

type Props = {
  project: Project,
  selectProject: Action,
  match: any, // provided by react-router
};

class ProjectPage extends Component<Props> {
  render() {
    const { project, match } = this.props;
    const projectIdFromUrl = match.params.projectId;
    return (
      <div>
        <br />
        <br />
        <br />
        <br />
        <br />
        Hello World.
        <br />
        Project ID from URL: <strong>{projectIdFromUrl}</strong>
        <br />
        <br />
        Selected project: {JSON.stringify(project)}
        <br />
        <Link to="/">Back home</Link>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

export default connect(mapStateToProps)(ProjectPage);
