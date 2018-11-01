// @flow
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { info } from 'react-icons-kit/feather/info';

import Spacer from '../Spacer';
import ProgressBar from '../ProgressBar';
import {
  getBlockingStatus,
  getStatusText,
} from '../../reducers/app-status.reducer';

import guppyLoaderSrc from '../../assets/images/guppy-loader.gif';
import { COLORS, Z_INDICES } from '../../constants';

const INFOTEXT_HEIGHT = 80;

type Props = {
  showLoadingScreen: boolean,
  statusText: string,
};

type State = {
  showStatus: boolean,
};

class LoadingScreen extends PureComponent<Props, State> {
  state = {
    showStatus: false,
  };

  toggleStatus = () => {
    this.setState(state => ({
      showStatus: !state.showStatus,
    }));
  };

  render() {
    const { showLoadingScreen, statusText } = this.props;
    const { showStatus } = this.state;
    const ellipsis = statusText.length > 220 ? '...' : '';
    const shortenedText =
      statusText
        .split('')
        .splice(0, 220)
        .join('') + ellipsis;
    const [progressInc = 0, total = 1] = (/\d+\/\d+/.exec(statusText) || [
      '',
    ])[0].split('/');
    const progress = progressInc / total;
    return (
      <Window isVisible={showLoadingScreen}>
        <ProgressBar position="top" progress={progress} />
        {showStatus && <InfoText>{shortenedText}</InfoText>}
        <Spacer size={10} />
        <StatusButton icon={info} onClick={this.toggleStatus} size={16} />
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

const InfoText = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 30%;
  margin: 0 auto;
  border-radius: 10px;
  color: ${COLORS.white};
  background: ${COLORS.transparentBlue[400]};
  width: 500px;
  height: ${INFOTEXT_HEIGHT}px;
  padding: 15px;

  &:before,
  &:after {
    // bubble styles
    position: absolute;
    content: '';
    background: ${COLORS.transparentBlue[700]};
    border-radius: 50% 50%;
  }

  // large bubble
  &:before {
    top: ${INFOTEXT_HEIGHT + 10}px;
    left: 140px;
    width: 20px;
    height: 20px;
  }

  // small bubble
  &:after {
    top: ${INFOTEXT_HEIGHT + 40}px;
    left: 160px;
    width: 10px;
    height: 10px;
  }
`;

const StatusButton = styled(IconBase)`
  margin-bottom: 20px;
  cursor: pointer;
  :hover {
    color: ${COLORS.blue[500]};
  }
`;

const FishSpinner = styled.img`
  width: 150px;
`;

const mapStateToProps = state => ({
  showLoadingScreen: getBlockingStatus(state),
  statusText: getStatusText(state),
});

export default connect(mapStateToProps)(LoadingScreen);
