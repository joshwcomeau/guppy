// @flow
import React from 'react';
import styled from 'styled-components';

type Props = {
  color1: string,
};

const OutlineButton = ({
  color1,
  color2,
  size,
  children,
  icon,
  ...delegated
}) => (
  <ButtonElem color1={color1} color2={color2} {...delegated}>
    <InnerButtonWrapper>
      {children}
      {icon && <IconWrapper>{icon}</IconWrapper>}
    </InnerButtonWrapper>
  </ButtonElem>
);

const ButtonElem = styled.button`
  border: none;
  height: 36px;
  padding: 0;
  background-image: linear-gradient(
    -20deg,
    ${props => props.color1},
    ${props => props.color2}
  );
  border-radius: 50px;
  font-size: 16px;
  outline: none;
`;

const InnerButtonWrapper = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  line-height: 32px;
  margin: 2px;
  padding: 2px 15px 2px 33px;
  background: #fff;
  border-radius: 50px;
`;

const IconWrapper = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default OutlineButton;
