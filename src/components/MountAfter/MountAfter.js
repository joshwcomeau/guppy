// @flow
/**
 * This is a hacky little component that helps us avoid rendering bugs and
 * other issues by offsetting the mount of a component by a certain amount of
 * time.
 */
import { Component } from 'react';

type Props = {
  delay: number,
  reason: string,
  children: React$Node,
};

type State = {
  hasTimeElapsed: boolean,
};

class MountAfter extends Component<Props, State> {
  state = {
    hasTimeElapsed: false,
  };

  timeoutId: number;

  componentDidMount() {
    this.timeoutId = window.setTimeout(() => {
      this.setState({ hasTimeElapsed: true });
    }, this.props.delay);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeoutId);
  }

  render() {
    const { children } = this.props;
    const { hasTimeElapsed } = this.state;

    return hasTimeElapsed ? children : null;
  }
}

export default MountAfter;
