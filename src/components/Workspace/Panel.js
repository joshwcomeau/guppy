// @flow
import React, { PureComponent } from 'react';

type Props = {
  initialWidth?: number,
  style: Object,
  children: React$Node,
  // Provided magically by the parent wrapper
  width?: number,
  height?: number,
};

class Panel extends PureComponent<Props> {
  static defaultProps = {
    style: {},
  };

  render() {
    const { width, height, initialWidth, style, ...delegated } = this.props;

    return (
      <div
        {...delegated}
        style={{
          width,
          height,
          ...style,
          userSelect: 'text',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Panel;
