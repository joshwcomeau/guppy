// @flow
import React from 'react';

import SelectableImage from '../SelectableImage';
import { COLORS } from '../../constants';

type Props = {
  id: string,
  size: number,
  name: string,
  iconSrc: string,
  isSelected: boolean,
};

const SidebarProjectIcon = ({ id, size, name, iconSrc, isSelected }: Props) => {
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

export default SidebarProjectIcon;
