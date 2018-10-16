// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getBlockingStatus } from '../../reducers/app-status.reducer';

import guppyLoaderSrc from '../../assets/images/guppy-loader.gif';
import { COLORS, Z_INDICES } from '../../constants';

type Props = {
  showLoadingScreen: boolean,
};

class LoadingScreen extends PureComponent<Props> {
  render() {
    const { showLoadingScreen } = this.props;
    return (
      <Window isVisible={showLoadingScreen}>
        <FishSpinner src={guppyLoaderSrc} alt="Fish loader" />
      </Window>
    );
  }
}

const Window = styled.div`
  align-items: center;
  background: ${COLORS.transparentWhite[300]};
  display: ${props => (props.isVisible ? 'flex' : 'none')};
  height: 100vh;
  justify-content: center;
  position: fixed;
  width: 100vw;
  z-index: ${Z_INDICES.loadingScreen};
`;

const FishSpinner = styled.img`
  width: 150px;
`;

const mapStateToProps = state => ({
  showLoadingScreen: getBlockingStatus(state),
});

export default connect(mapStateToProps)(LoadingScreen);
