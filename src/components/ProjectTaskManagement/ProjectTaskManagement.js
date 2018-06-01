// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { play } from 'react-icons-kit/feather/play';

import { getSelectedProject } from '../../reducers/projects.reducer';
import { COLORS } from '../../constants';

import Heading from '../Heading';
import Button from '../Button';
import BigClickableButton from '../BigClickableButton';
import LargeLED from '../LargeLED';
import Spacer from '../Spacer';

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

    return (
      <Wrapper>
        <Header>
          <div>
            <Heading style={{ display: 'flex', alignItems: 'center' }}>
              {taskId}
            </Heading>
            A task to do things
          </div>
          <RightHeader>
            <BigClickableButton width={128} height={48}>
              <IconBase icon={play} size={24} /> Run task
            </BigClickableButton>
          </RightHeader>
        </Header>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div``;

const Header = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const RightHeader = styled.div`
  display: flex;
`;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

export default connect(mapStateToProps)(ProjectTaskManagement);
