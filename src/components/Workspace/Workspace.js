// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { sum } from '../../utils';

import { createPixelFlexConverter } from './Workspace.helpers';
import Resizer from './Resizer';

type FlexMap = { [id: string]: number };

type Props = {
  id: string,
  orientation: 'horizontal' | 'vertical',
  children: React$Node,
};

type State = {
  panelFlexMap: FlexMap,
};

class Workspace extends Component<Props, State> {
  node: HTMLElement;
  parentBox: ClientRect;
  startClientX: ?number;
  startClientY: ?number;
  startPanelFlexMap: FlexMap;
  resizerIndex: ?number;

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
      const panelFlexMap = childrenArray.reduce((acc, child) => {
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

      return { panelFlexMap };
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
        childrenArray.map(child => state.panelFlexMap[child.props.id])
      );

      const panelFlexMap = childrenArray.reduce((acc, child) => {
        // Normalize the flex from 0-100, using cross-multiplication.
        //
        //    flex            newFlex
        // -----------   =   ---------
        //  totalFlex           100
        //
        const normalizedFlex =
          (state.panelFlexMap[child.props.id] * 100) / totalFlex;

        return {
          ...acc,
          [child.props.id]: normalizedFlex,
        };
      }, {});

      return { panelFlexMap };
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
    this.startPanelFlexMap = { ...this.state.panelFlexMap };

    this.resizerIndex = resizerIndex;
  };

  dragResize = (ev: any) => {
    const {
      startClientX,
      startClientY,
      startPanelFlexMap,
      resizerIndex,
    } = this;

    // Impossible conditions for Flow
    if (
      typeof startClientX !== 'number' ||
      typeof startClientY !== 'number' ||
      typeof resizerIndex !== 'number'
    ) {
      console.error('Missing required variables to do panel resizing', this);
      return;
    }

    // We need to convert the window coordinates to the relative positions
    // within this box.
    // Start by getting the raw window coordinates
    const { clientX, clientY } = ev;

    // TODO: totalPixels based on orientation
    const totalWidth = this.parentBox.width;

    const convertPixelsToFlex = createPixelFlexConverter(totalWidth, 100);
    const convertFlexToPixels = createPixelFlexConverter(100, totalWidth);

    const { panelFlexMap } = this.state;

    const panelIds = Object.keys(panelFlexMap);

    // Check and see if this change would push us below our min-width
    const childrenArray = React.Children.toArray(this.props.children);

    // TODO: Handle vertical
    let deltaInPixels = startClientX - clientX;
    let deltaInFlex = convertPixelsToFlex(deltaInPixels);

    const firstAffectedPanelId = panelIds[resizerIndex];
    const secondAffectedPanelId = panelIds[resizerIndex + 1];

    const firstAffectedPanel = childrenArray.find(
      child => child.props.id === firstAffectedPanelId
    );
    const secondAffectedPanel = childrenArray.find(
      child => child.props.id === secondAffectedPanelId
    );

    if (!firstAffectedPanel || !secondAffectedPanel) {
      return;
    }

    const firstAffectedPanelMinWidth = firstAffectedPanel.props.style.minWidth;
    const firstAffectedPanelMaxWidth = firstAffectedPanel.props.style.maxWidth;

    const prospectiveFirstPanelWidth = convertFlexToPixels(
      startPanelFlexMap[firstAffectedPanelId] - deltaInFlex
    );

    if (prospectiveFirstPanelWidth < firstAffectedPanelMinWidth) {
      const overshotByPixels =
        firstAffectedPanelMinWidth - prospectiveFirstPanelWidth;

      const overshotByFlex = convertPixelsToFlex(overshotByPixels);

      deltaInFlex -= overshotByFlex;
    }

    if (prospectiveFirstPanelWidth > firstAffectedPanelMaxWidth) {
      const overshotByPixels =
        prospectiveFirstPanelWidth - firstAffectedPanelMaxWidth;

      const overshotByFlex = convertPixelsToFlex(overshotByPixels);

      deltaInFlex += overshotByFlex;
    }

    const nextpanelFlexMap = {
      ...panelFlexMap,
      [firstAffectedPanelId]:
        startPanelFlexMap[firstAffectedPanelId] - deltaInFlex,
      [secondAffectedPanelId]:
        startPanelFlexMap[secondAffectedPanelId] + deltaInFlex,
    };

    this.setState({
      panelFlexMap: nextpanelFlexMap,
    });
  };

  endResize = (ev: any) => {
    ev.preventDefault();

    document.removeEventListener('mouseup', this.endResize);
    document.removeEventListener('mousemove', this.dragResize);
  };

  render() {
    const { orientation, children, ...delegated } = this.props;
    const { panelFlexMap } = this.state;

    const childrenArray = React.Children.toArray(children).filter(
      child => child
    );

    // Interleave components with Resizer elements
    const interleavedChildren = childrenArray.map(
      (child, index) =>
        index === childrenArray.length - 1
          ? React.cloneElement(child, { flex: panelFlexMap[child.props.id] })
          : [
              React.cloneElement(child, {
                flex: panelFlexMap[child.props.id],
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
  user-select: none;
`;

export default Workspace;
