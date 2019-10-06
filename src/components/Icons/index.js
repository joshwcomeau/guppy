// @flow
import React from 'react';
import styled from 'styled-components';
import reactIconSrc from '../../assets/images/react-icon.svg';
import gatsbyIconSrc from '../../assets/images/gatsby_small.png';
import nextjsIconSrc from '../../assets/images/nextjs_small.png';

const Icon = styled.img`
  width: 22px;
  height: 22px;
`;

const SizedReactIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const ReactIcon = <SizedReactIcon src={reactIconSrc} />;

const GatsbyIcon = <Icon src={gatsbyIconSrc} />;

const NextjsIcon = <Icon src={nextjsIconSrc} />;

export { GatsbyIcon, NextjsIcon, ReactIcon };
