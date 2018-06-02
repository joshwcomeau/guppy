// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { play } from 'react-icons-kit/feather/play';

import { getSelectedProject } from '../../reducers/projects.reducer';
import { getTasksForProject } from '../../reducers/tasks.reducer';
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
    const { taskName } = match.params;

    const task = project.tasks[taskName];

    return (
      <Wrapper>
        <Header>
          <LeftHeader>
            <TaskName>{taskName}</TaskName>
            <TaskDescription>Run a local development server.</TaskDescription>
          </LeftHeader>
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TaskName = styled(Heading)`
  margin-top: -4px;
`;

const TaskDescription = styled.div`
  font-size: 18px;
  color: ${COLORS.gray[400]};
  margin-left: 20px;
`;

const LeftHeader = styled.div`
  display: flex;
  line-height: 54px;
`;

const RightHeader = styled.div`
  display: flex;
`;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

export default connect(mapStateToProps)(ProjectTaskManagement);
