import React from 'react';
import styled from 'styled-components';

const OutlineButton = ({
  color1,
  color2,
  size,
  children,
  icon,
  ...delegated
}) => (
  <ButtonElem color1={color1} color2={color2}>
    <InnerButtonWrapper>
      {children}
      {icon && <IconWrapper>{icon}</IconWrapper>}
    </InnerButtonWrapper>
  </ButtonElem>
);

const ButtonElem = styled.button`
  border: none;
  height: 34px;
  padding: 0;
  background-image: linear-gradient(
    20deg,
    ${props => props.color1},
    ${props => props.color2}
  );
  border-radius: 50px;
`;

const InnerButtonWrapper = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
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
