// @flow
import React from 'react';
import styled from 'styled-components';

import SelectableImage from '../SelectableImage';
import { COLORS } from '../../constants';

type Props = {
  id: string,
  size: number,
  name: string,
  iconSrc: string,
  isSelected: boolean,
  onClick: (id: string) => void,
};

const SidebarProjectIcon = ({
  id,
  size,
  name,
  iconSrc,
  isSelected,
  onClick,
}: Props) => {
  return (
    <SelectableImage
      src={iconSrc}
      size={size}
      color1={COLORS.white}
      color2={COLORS.white}
      status={isSelected ? 'highlighted' : 'faded'}
      onClick={() => onClick(id)}
    />
  );
};

export default SidebarProjectIcon;
