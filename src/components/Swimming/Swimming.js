// @flow
import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
  children: React$Node,
};

const Swimming = ({ children }: Props) => (
  <Bobber>
    <Rocker>{children}</Rocker>
  </Bobber>
);

const rocking = keyframes`
  0% {
    transform: rotate(4deg);
    transform-origin: bottom center;
  }
  50% {
    transform: rotate(-4deg);
    transform-origin: bottom center;
  }
  100% {
    transform: rotate(4deg);
    transform-origin: bottom center;
  }
`;

const bobbing = keyframes`
  0% {
    transform: translateY(-4%);
  }
  50% {
    transform: translateY(4%);
  }
  100% {
    transform: translateY(-4%);
  }
`;

const Bobber = styled.div`
  display: inline-block;
  animation: ${bobbing} 8s infinite both cubic-bezier(0.7, 0, 0.3, 1);
`;

const Rocker = styled.div`
  display: inline-block;
  animation: ${rocking} 8s infinite both cubic-bezier(0.36, -0.14, 0.61, 1.19) -2s;
`;

export default Swimming;
