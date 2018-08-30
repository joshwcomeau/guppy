// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { sum } from '../../utils';

import Resizer from './Resizer';

type Props = {
  id: string,
  orientation: 'horizontal' | 'vertical',
  children: React$Node,
};

type State = {
  panelFlexList: { [id: string]: number },
};

class Workspace extends Component<Props, State> {
  node: HTMLElement;
  parentBox: ClientRect;

  static getDerivedStateFromProps(props: Props, state: State) {
    const childrenArray = React.Children.toArray(props.children);

    const isFirstRender = !state;

    if (isFirstRender) {
      // For our very first render, we'll use `initialFlex` specified on
      // the child.
      const totalFlex = sum(
        childrenArray.map(child => child.props.initialFlex)
      );

      // The user can initially specify whichever Flex values they want.
      // For example:
      //
      //   <Workspace>
      //     <Panel flex={2} />
      //     <Panel flex={1} />
      //     <Panel flex={1} />
      //   </Workspace>
      //
      // In this case, the `totalFlex` is 4.
      // We want to normalize this to be 100, though, so we need to update
      // each flex entity to be out of 100.
      const panelFlexList = childrenArray.reduce((acc, child) => {
        // Normalize the flex from 0-100, using cross-multiplication.
        //
        //    flex            newFlex
        // -----------   =   ---------
        //  totalFlex           100
        //
        const normalizedFlex = (child.props.initialFlex * 100) / totalFlex;

        return {
          ...acc,
          [child.props.id]: normalizedFlex,
        };
      }, {});

      return { panelFlexList };
    } else {
      // This can happen when the actual number of childen changes (say, if
      // a panel is toggled off, or a new one is added). We want to recalculate
      // the flex values, to normalize them.

      /**
       * TODO:
       * We need to iterate through the children, get the ID, and look up
       * the ID in our state. Need to change the state from an array to a map.
       */

      const totalFlex = sum(
        childrenArray.map(child => state.panelFlexList[child.props.id])
      );

      const panelFlexList = childrenArray.reduce((acc, child) => {
        // Normalize the flex from 0-100, using cross-multiplication.
        //
        //    flex            newFlex
        // -----------   =   ---------
        //  totalFlex           100
        //
        const normalizedFlex =
          (state.panelFlexList[child.props.id] * 100) / totalFlex;

        return {
          ...acc,
          [child.props.id]: normalizedFlex,
        };
      }, {});

      return { panelFlexList };
    }
  }

  componentDidMount() {
    this.parentBox = this.node.getBoundingClientRect();
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.dragResize);
    document.removeEventListener('mouseup', this.endResize);
  }

  startResize = (ev: any, resizerIndex: number) => {
    document.addEventListener('mousemove', this.dragResize);
    document.addEventListener('mouseup', this.endResize);

    // TODO: Clean these up, make them all part of 1 property, Flow-tracked
    this.startClientX = ev.clientX;
    this.startClientY = ev.clientY;

    this.resizerIndex = resizerIndex;
    this.panelFlexListSnapshot = { ...this.state.panelFlexList };
  };

  dragResize = (ev: any) => {
    // We need to convert the window coordinates to the relative positions
    // within this box.
    // Start by getting the raw window coordinates
    const { clientX, clientY } = ev;
    // Get them relative to the box they're in
    const relativeX = clientX - this.parentBox.left;
    const relativeY = clientY - this.parentBox.top;

    const { panelFlexList } = this.state;

    const panelIds = Object.keys(panelFlexList);
    const panelValues = panelIds.map(id => panelFlexList[id]);

    // TODO: Generalize for vertical
    // Convert them to work in the Flex system we've defined.
    // This is cross-multiplication, solving for X:
    //
    //    relativeX          X
    //  -------------   = -------
    //   parentWidth        100
    //

    // This will give us the amount of flex between the left edge and the
    // cursor position:
    //  ___________________________________
    // |        |                |        |
    // |        |                |        |
    // |        |                |        |
    // |________|________________|________|
    //                           ^ Cursor
    // <------------------------>
    //    newProportionOfSpace
    //
    const newProportionOfSpace = (relativeX * 100) / this.parentBox.width;

    // Now, get the actual flex for the left-hand element
    //  ___________________________________
    // |        |                |        |
    // |        |                |        |
    // |        |                |        |
    // |________|________________|________|
    //                           ^ Cursor
    //          <--------------->
    //               newFlex
    //
    const sumOfLeftOrTopPanels = sum(
      panelValues.filter((_, i) => i < this.resizerIndex)
    );

    const newFlex = newProportionOfSpace - sumOfLeftOrTopPanels;

    // Get the difference between the current flex for this panel, and the new
    // flex
    const difference = newFlex - panelValues[this.resizerIndex];

    const leftOfResizer = panelIds[this.resizerIndex];
    const rightOfResizer = panelIds[this.resizerIndex + 1];

    const nextPanelFlexList = {
      ...panelFlexList,
      [leftOfResizer]: panelFlexList[leftOfResizer] + difference,
      [rightOfResizer]: panelFlexList[rightOfResizer] - difference,
    };

    this.setState({
      panelFlexList: nextPanelFlexList,
    });
  };

  endResize = (ev: any) => {
    ev.preventDefault();

    document.removeEventListener('mouseup', this.endResize);
    document.removeEventListener('mousemove', this.dragResize);
  };

  render() {
    const { orientation, children, ...delegated } = this.props;
    const { panelFlexList } = this.state;

    const childrenArray = React.Children.toArray(children).filter(
      child => child
    );

    // Interleave components with Resizer elements
    const interleavedChildren = childrenArray.map(
      (child, index) =>
        index === childrenArray.length - 1
          ? React.cloneElement(child, { flex: panelFlexList[child.props.id] })
          : [
              React.cloneElement(child, {
                flex: panelFlexList[child.props.id],
              }),
              <Resizer
                key={index}
                index={index}
                startResize={this.startResize}
              />,
            ]
    );

    return (
      <Wrapper
        {...delegated}
        innerRef={node => (this.node = node)}
        orientation={orientation}
      >
        {interleavedChildren}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: ${props =>
    props.orientation === 'horizontal' ? 'row' : 'column'};
  flex: 1;
  height: 100%;
  overflow: hidden;
  user-select: text;
`;

export default Workspace;
