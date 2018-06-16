// @flow
import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import SelectableImage from '../SelectableImage';
import SelectableItem from '../SelectableItem';

type Props = {
  id: string,
  size: number,
  name: string,
  color?: string,
  iconSrc?: string,
  isSelected: boolean,
};

const SidebarProjectIcon = ({
  id,
  size,
  name,
  color,
  iconSrc,
  isSelected,
}: Props) => {
  if (!iconSrc) {
    return (
      <SelectableItem
        size={size}
        color1={COLORS.white}
        color2={COLORS.white}
        status={isSelected ? 'highlighted' : 'faded'}
      >
        {status => (
          <ProjectNameIcon style={{ backgroundColor: color }}>
            {name.slice(0, 1).toUpperCase()}
          </ProjectNameIcon>
        )}
      </SelectableItem>
    );
  }
  return (
    <SelectableImage
      src={iconSrc}
      size={size}
      color1={COLORS.white}
      color2={COLORS.white}
      status={isSelected ? 'highlighted' : 'faded'}
    />
  );
};

const ProjectNameIcon = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: ${COLORS.white};
  border-radius: 50%;
`;

export default SidebarProjectIcon;
