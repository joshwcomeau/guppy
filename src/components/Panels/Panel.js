// @flow
import React, { PureComponent } from 'react';
import { Draggable } from 'react-beautiful-dnd';
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
    const {
      width,
      height,
      initialWidth,
      style,
      panelId,
      ...delegated
    } = this.props;

    return (
      <Draggable
        droppableId={panelId}
        {...delegated}
        style={{
          width,
          height,
          ...style,
          userSelect: 'text',
        }}
      >
        {({ innerRef, draggableProps, dragHandleProps }, snapshot) => (
          <div ref={innerRef} {...draggableProps} {...dragHandleProps}>
            {this.props.children}
          </div>
        )}
      </Draggable>
    );
  }
}

export default Panel;
