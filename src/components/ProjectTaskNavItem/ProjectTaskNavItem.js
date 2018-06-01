// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { COLORS } from '../../constants';
import { buildUrlForProjectTask } from '../../services/location.service';

import SmallLED from '../SmallLED';

import type { TaskStatus } from '../../types';

type Props = {
  projectId: string,
  taskId: string,
  status: TaskStatus,
  isSelected: boolean,
};

class ProjectTaskNavItem extends PureComponent<Props> {
  render() {
    const { projectId, taskId, status, isSelected } = this.props;

    return (
      <Wrapper to={buildUrlForProjectTask(projectId, taskId)}>
        <Base>
          <SmallLED status={status} isVisible={isSelected} />
          {taskId}
        </Base>

        <Highlighted isVisible={isSelected}>
          <SmallLED status={status} isVisible={true} />
          {taskId}
        </Highlighted>
      </Wrapper>
    );
  }
}

const Wrapper = styled(Link)`
  position: relative;
  display: flex;
  justify-content: flex-end;
  text-decoration: none;
  color: inherit;
`;

const Base = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  font-size: 18px;
  font-weight: 500;
  width: 90%;
  -webkit-font-smoothing: antialiased;
`;

const Highlighted = styled(Base)`
  position: absolute;
  top: 0;
  right: 0;
  background: ${COLORS.white};
  border-radius: 5px 0 0 5px;
  opacity: ${props => (props.isVisible ? 1 : 0)};
`;

export default ProjectTaskNavItem;
