// @flow
import React from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { u2753 as questionMarkIcon } from 'react-icons-kit/noto_emoji_regular/u2753';
import { shell } from 'electron';

import { RAW_COLORS, COLORS } from '../../constants';

type Props = {
  size?: number,
  href: string,
};

const HelpButton = ({ size = 18, href }: Props) => (
  <Help
    size={size}
    onClick={() => {
      shell.openExternal(href);
    }}
  >
    <IconBase icon={questionMarkIcon} size={size - 4} />
  </Help>
);

const Help = styled.button`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  margin-left: 15px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 50%;
  color: ${COLORS.textOnBackground};
  background: ${RAW_COLORS.gray[500]};
  padding: 0;
  cursor: pointer;

  &:hover {
    background: ${COLORS.link};
  }
`;

export default HelpButton;
