// @flow
import { Component } from 'react';

import { throttle } from '../../utils';

type State = {
  width: number,
  height: number,
};
type Props = {
  children: (dimensions: State) => React$Node,
};

class WindowDimensions extends Component<Props, State> {
  state = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = throttle(() => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, 500);

  render() {
    return this.props.children(this.state);
  }
}

export default WindowDimensions;
