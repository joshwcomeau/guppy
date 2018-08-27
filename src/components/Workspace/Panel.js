// @flow
import React, { PureComponent } from 'react';

type Props = {
  flex: number,
};

class Panel extends PureComponent<Props> {
  static defaultProps = {
    initialFlex: 1,
  };
  render() {
    const { flex } = this.props;
    return <div style={{ flex }}>{this.props.children}</div>;
  }
}

export default Panel;
