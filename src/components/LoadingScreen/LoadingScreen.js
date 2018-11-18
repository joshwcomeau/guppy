// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
// import IconBase from 'react-icons-kit';
// import { info } from 'react-icons-kit/feather/info';

// import Spacer from '../Spacer';
import ProgressBar from '../ProgressBar';
import {
  getBlockingStatus,
  getStatusText,
} from '../../reducers/app-status.reducer';

import guppyLoaderSrc from '../../assets/images/guppy-loader.gif';
import { COLORS, Z_INDICES } from '../../constants';

// const INFOTEXT_HEIGHT = 80;

type Props = {
  showLoadingScreen: boolean,
  statusText: string,
};

type State = {
  showStatus: boolean,
  reset: boolean,
};

class LoadingScreen extends PureComponent<Props, State> {
  state = {
    showStatus: false,
    reset: false,
  };

  static defaultProps = {
    statusText: '',
  };

  progress: number = 0;

  toggleStatus = () => {
    this.setState(state => ({
      showStatus: !state.showStatus,
    }));
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.statusText !== this.props.statusText) {
      // new status
      // e.g. progressResult = ["1/4", ...]
      const progressResult = /\d+\/\d+/.exec(nextProps.statusText);
      const total = progressResult && progressResult[0].split('/')[1];
      if (total) {
        this.progress += 1 / parseInt(total);
        // limit progress to 1
        this.progress = Math.min(1, this.progress);
      }
    }

    if (!this.props.showLoadingScreen && nextProps.showLoadingScreen) {
      // About to display
      this.setState({ reset: false });
    }
    if (this.props.showLoadingScreen && !nextProps.showLoadingScreen) {
      // Will hide after a delay
      this.progress = 0;
      this.setState({ reset: true });
    }
  }

  render() {
    const { showLoadingScreen } = this.props;
    /* 
    // Todo: Create a better UI. Code commented for now.
    const {statusText} = this.props;
    const { showStatus } = this.state;
    const ellipsis = statusText.length > 220 ? '...' : '';
    const shortenedText =
      statusText
        .split('')
        .splice(0, 220)
        .join('') + ellipsis;
    */
    return (
      <Window isVisible={showLoadingScreen}>
        <ProgressBarWrapper>
          <ProgressBar progress={this.progress} reset={this.state.reset} />
        </ProgressBarWrapper>
        {/* 
        {showStatus && <InfoText>{shortenedText}</InfoText>}
        <Spacer size={10} />
        <StatusButton icon={info} onClick={this.toggleStatus} size={16} /> 
        */}
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

/*
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
`;*/

const FishSpinner = styled.img`
  width: 150px;
`;

const ProgressBarWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

const mapStateToProps = state => ({
  showLoadingScreen: getBlockingStatus(state),
  statusText: getStatusText(state),
});

export default connect(mapStateToProps)(LoadingScreen);
