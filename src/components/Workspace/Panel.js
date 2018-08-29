// @flow
import React, { PureComponent } from 'react';

type Props = {
  flex: number,
};

class Panel extends PureComponent<Props> {
  static defaultProps = {
    initialFlex: 1,
    style: {},
  };
  render() {
    const { flex, style, ...delegated } = this.props;
    return (
      <div {...delegated} style={{ flex, ...style }}>
        {this.props.children}
      </div>
    );
  }
}

export default Panel;
