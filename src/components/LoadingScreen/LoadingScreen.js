// @flow
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import ProgressBar from '../ProgressBar';
import Card from '../Card';
import {
  getBlockingStatus,
  getStatusText,
} from '../../reducers/app-status.reducer';

import guppyLoaderSrc from '../../assets/images/guppy-loader.gif';
import { RAW_COLORS, Z_INDICES } from '../../constants';
import { ellipsify } from '../../utils';

type Props = {
  showLoadingScreen: boolean,
  statusText: string,
};

type State = {
  reset: boolean,
};

class LoadingScreen extends PureComponent<Props, State> {
  state = {
    reset: false,
  };

  static defaultProps = {
    statusText: '',
  };

  progress: number = 0;

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
    const { showLoadingScreen, statusText } = this.props;
    const { reset } = this.state;
    const { progress } = this;
    const shortenedText = ellipsify(statusText, 100);

    return (
      <Backdrop isVisible={showLoadingScreen}>
        <StyledCard>
          <FishSpinner src={guppyLoaderSrc} alt="Fish loader" />
          {progress > 0 ? (
            <Fragment>
              <ProgressBarWrapper>
                <ProgressBar height={18} progress={progress} reset={reset} />
              </ProgressBarWrapper>
              <InfoWrapper>
                <InfoText>{shortenedText}</InfoText>
                <InfoText>{progress * 100}%</InfoText>
              </InfoWrapper>
            </Fragment>
          ) : (
            <InfoText>{shortenedText}</InfoText>
          )}
        </StyledCard>
      </Backdrop>
    );
  }
}

const Backdrop = styled.div`
  align-items: center;
  background: ${RAW_COLORS.transparentWhite[300]};
  display: ${props => (props.isVisible ? 'flex' : 'none')};
  height: 100vh;
  justify-content: center;
  position: fixed;
  width: 100vw;
  z-index: ${Z_INDICES.loadingScreen};
`;

const StyledCard = styled(Card)`
  text-align: center;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  width: 600px;
  padding: 30px;
`;

const InfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const InfoText = styled.div`
  color: ${RAW_COLORS.black};
  padding: 0;
`;

const FishSpinner = styled.img`
  width: 150px;
`;

const ProgressBarWrapper = styled.div`
  margin: 60px 0 10px;
  position: relative;
  width: 100%;
`;

const mapStateToProps = state => ({
  showLoadingScreen: getBlockingStatus(state),
  statusText: getStatusText(state),
});

export default connect(mapStateToProps)(LoadingScreen);
