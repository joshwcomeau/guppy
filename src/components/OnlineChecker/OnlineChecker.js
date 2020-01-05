//@flow
/*
  This component checks to see if the the user is online or not. 
  Failing to be online should feedback to the user as opposed to leaving them hanging.
*/
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { getOnlineState } from '../../reducers/app-status.reducer';

import type { Dispatch } from '../../actions/types';

type Props = {
  isOnline: boolean,
  setOnlineStatus: Dispatch<typeof actions.setOnlineStatus>,
  setInfoBarString: Dispatch<typeof actions.setInfoBarString>,
};

const OFFLINE_STRING =
  'You are currently offline, some functions will not be available';

class OnlineChecker extends React.PureComponent<Props> {
  componentDidMount() {
    window.addEventListener('online', this.check);
    window.addEventListener('offline', this.check);
  }

  check = () => {
    const { setOnlineStatus, setInfoBarString } = this.props;
    setOnlineStatus(navigator.onLine);
    if (!navigator.onLine) {
      setInfoBarString(OFFLINE_STRING);
    } else {
      setInfoBarString(null);
    }
  };

  componentWillUnmount() {
    window.removeEventListener('online', this.check);
    window.removeEventListener('offline', this.check);
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  isOnline: getOnlineState(state),
});

export default connect(
  mapStateToProps,
  {
    setOnlineStatus: actions.setOnlineStatus,
    setInfoBarString: actions.setInfoBarString,
  }
)(OnlineChecker);
