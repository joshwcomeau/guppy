// @flow
import React from 'react';
import styled from 'styled-components';

import guppyLoaderSrc from '../../assets/images/guppy-loader.gif';
import { COLORS, Z_INDICES } from '../../constants';

const LoadingScreen = () => (
  <Window>
    <FishSpinner src={guppyLoaderSrc} alt="Fish loader" />
  </Window>
);

const Window = styled.div`
  align-items: center;
  background: ${COLORS.transparentWhite[300]};
  display: flex;
  height: 100vh;
  justify-content: center;
  position: fixed;
  width: 100vw;
  z-index: ${Z_INDICES.loadingScreen};
`;

const FishSpinner = styled.img`
  width: 150px;
`;

export default LoadingScreen;
