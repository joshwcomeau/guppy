// @flow
import React from 'react';
import styled from 'styled-components';

type Props = {
  size: 'small' | 'medium' | 'large',
};

const Button = ({ size = 'medium', ...delegated }: Props) => {
  switch (size) {
    case 'small':
      return <SmallButton {...delegated} />;
    case 'medium':
      return <MediumButton {...delegated} />;
    case 'large':
      return <LargeButton {...delegated} />;
  }
};

const ButtonBase = styled.button`
  border: none;
  font-family: 'Futura PT';
  outline: none;
  transform-origin: bottom center;
`;

const SmallButton = styled(ButtonBase)`
  padding: 4px 10px;
  font-size: 16px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;

  &:active {
    border-bottom: 2px solid transparent;
    transform: translateY(2px);
  }
`;

const MediumButton = styled(ButtonBase)`
  padding: 6px 16px;
  font-size: 20px;
  border-bottom: 3px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;

  &:active {
    border-bottom: 3px solid transparent;
    transform: translateY(3px);
  }
`;

const LargeButton = styled(ButtonBase)`
  padding: 5px 32px;
  font-size: 22px;
  border-bottom: 3px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;

  &:active {
    border-bottom: 3px solid transparent;
    transform: translateY(3px);
  }
`;

export default Button;
