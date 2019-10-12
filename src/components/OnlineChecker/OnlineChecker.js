//@flow
/*
  This component checks to see if the the user is online or not. 
  Failing to be online should feedback to the user as opposed to leaving them hanging.
*/
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RAW_COLORS, Z_INDICES } from '../../constants';

import * as actions from '../../actions';
import { getOnlineState } from '../../reducers/app-status.reducer';

import type { Dispatch } from '../../actions/types';

type Props = {
  isOnline: boolean,
  setOnlineStatus: Dispatch<typeof actions.setOnlineStatus>,
};

class OnlineChecker extends React.PureComponent<Props> {
  componentDidMount() {
    window.addEventListener('online', this.check);
    window.addEventListener('offline', this.check);
  }
  check = () => {
    this.props.setOnlineStatus(navigator.onLine);
  };
  componentWillUnmount() {
    window.removeEventListener('online', this.check);
    window.removeEventListener('offline', this.check);
  }
  render() {
    const { isOnline } = this.props;
    if (!isOnline) {
      return (
        <InfoBar>
          <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M10.9,1H5.1L1,5.1v5.8L5.1,15h5.8L15,10.9V5.1ZM9,12H7V10H9ZM9,9H7V4H9Z" />
            <rect
              width="16"
              height="16"
              style={{
                fill: 'none',
              }}
            />
          </SVG>
          <p>You are currently offline, some functions will not be available</p>
        </InfoBar>
      );
    }
    return null;
  }
}

const InfoBar = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: ${Z_INDICES.infoBanner};
  background-color: ${RAW_COLORS.transparentWhite[100]};
  padding: 16px;
  align-content: center;
  box-shadow: 0px 2px 2px 0px ${RAW_COLORS.transparentBlack[900]};
`;

const SVG = styled.svg`
  width: 16px;
  height: 16px;
  fill: ${RAW_COLORS.red[500]};
  margin: 2px 8px;
`;

const mapStateToProps = state => ({
  isOnline: getOnlineState(state),
});

export default connect(
  mapStateToProps,
  {
    setOnlineStatus: actions.setOnlineStatus,
  }
)(OnlineChecker);
