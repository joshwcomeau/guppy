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
  taskName: string,
  status: TaskStatus,
  isSelected: boolean,
};

class ProjectTaskNavItem extends PureComponent<Props> {
  render() {
    const { projectId, taskName, status, isSelected } = this.props;

    return (
      <Wrapper to={buildUrlForProjectTask(projectId, taskName)}>
        <Base>
          <SmallLED status={status} isVisible={isSelected} />
          {taskName}
        </Base>

        <Highlighted isVisible={isSelected}>
          <SmallLED status={status} isVisible={true} />
          {taskName}
        </Highlighted>
      </Wrapper>
    );
  }
}

const Wrapper = styled(Link)`
  position: relative;
  left: 0;
  right: 0;
  width: calc(100% - 20px);
  margin: auto;

  text-decoration: none;
  color: inherit;
`;

const Base = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 15px;
  font-size: 18px;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
`;

const Highlighted = styled(Base)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${COLORS.white};
  border-radius: 5px;
  opacity: ${props => (props.isVisible ? 1 : 0)};
`;

export default ProjectTaskNavItem;
