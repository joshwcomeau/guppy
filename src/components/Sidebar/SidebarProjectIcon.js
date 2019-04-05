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
  handleSelect: () => void,
};

const SidebarProjectIcon = ({
  id,
  size,
  name,
  color,
  iconSrc,
  isSelected,
  handleSelect,
}: Props) => {
  const sharedProps = {
    size,
    colors: [COLORS.lightBackground],
    status: isSelected ? 'highlighted' : 'faded',
    onClick: handleSelect,
  };

  // For projects with an icon, we want to render a selectable image, with
  // that icon. For imported projects with no icon, we instead want to render
  // a circle with the first letter of that project name.
  return (
    <Wrapper>
      {iconSrc ? (
        <SelectableImage src={iconSrc} {...sharedProps} />
      ) : (
        <SelectableItem {...sharedProps}>
          {status => (
            <ProjectNameIcon style={{ backgroundColor: color }}>
              {name.slice(0, 1).toUpperCase()}
            </ProjectNameIcon>
          )}
        </SelectableItem>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  img {
    pointer-events: none;
  }
`;

export const ProjectNameIcon = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: ${COLORS.textOnBackground};
  border-radius: 50%;
`;

export default SidebarProjectIcon;
