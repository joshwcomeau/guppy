// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Spacer from '../Spacer';
import {
  getBlockingStatus,
  getStatusText,
} from '../../reducers/app-status.reducer';

import guppyLoaderSrc from '../../assets/images/guppy-loader.gif';
import { COLORS, Z_INDICES } from '../../constants';

type Props = {
  showLoadingScreen: boolean,
  statusText: string,
};

class LoadingScreen extends PureComponent<Props> {
  render() {
    const { showLoadingScreen, statusText } = this.props;
    return (
      <Window isVisible={showLoadingScreen}>
        <Wrapper>
          <FishSpinner src={guppyLoaderSrc} alt="Fish loader" />
          <Spacer size={10} />
          <InfoText>{statusText}</InfoText>
        </Wrapper>
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoText = styled.p`
  text-align: center;
`;

const FishSpinner = styled.img`
  width: 150px;
`;

const mapStateToProps = state => ({
  showLoadingScreen: getBlockingStatus(state),
  statusText: getStatusText(state),
});

export default connect(mapStateToProps)(LoadingScreen);
