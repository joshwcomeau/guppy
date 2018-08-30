// @flow
import React, { PureComponent } from 'react';

type Props = {
  initialFlex: number,
  style: Object,
  flex: number,
  children: React$Node,
};

class Panel extends PureComponent<Props> {
  static defaultProps = {
    initialFlex: 1,
    style: {},
  };
  render() {
    const { flex, initialFlex, style, ...delegated } = this.props;
    return (
      <div {...delegated} style={{ flex, ...style }}>
        {this.props.children}
      </div>
    );
  }
}

export default Panel;
