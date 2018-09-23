// @flow
import React, { Component } from 'react';
import produce from 'immer';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Resizer from './Resizer';

// TODO: this should be a prop!
const RESIZER_WIDTH = 5;

// type PanelWidths = { [id: string]: number };

type Props = {
  size: number,
  orientation: 'horizontal' | 'vertical',
  style: Object,
  children: React$Node,
};

type State = {
  // panelSizes: PanelWidths,
  panelStatus: string,
  panelItems: {
    // todo: a per project panelItems array needed here later
    [panelId: string]: {
      id: string,
      componentName: string,
      component: ?React$Node, // optional as it is only used for testing
    },
  },
  // todo: check if name panels is better instead of columns - but it's OK for now
  columns: Array<{
    id: string,
    panelItemIds: Array<string>,
    width: number,
  }>,
  columnOrder: Array<string>,
};

// beautiful-dnd setup
// DragDropContext -- Panels
//   <Droppable> -- Panels
//      <Draggable> - Panel

// data structure
/*
   initialPanelsState = {
     panelStatus: 'first-render' | 'initialized',
     panelItems: {
       'module-1': {id: 'module-1', componentToRender: 'DevelopmentServerPane'},
       'module-2': {id: 'module-1', componentToRender: 'TaskRunnerPane'},
       'module-3': {id: 'module-1', componentToRender: 'DependencyManagementPane'},
    },
     columns: { // we could also name this panels
       'column-1': {
         id: 'column-1',
         panelItemIds: ['module-1', 'module-2', 'module-3'],
         width: x // calculated if panelStatus === 'first-render'
       },
       'column-2': {
         id: 'column-2',
         panelItemIds: [],
         width: y // calculated if panelStatus === 'first-render'
       },
       'column-3': {
         id: 'column-3',
         panelItemIds: [],
         width: z // calculated if panelStatus === 'first-render'
       }
     }
     columnOrder: ['column-1', 'column-2', 'column-3']
   }

*/

const initialPanelsState = {
  panelStatus: 'first-render' | 'initialized',
  panelItems: {
    'module-1': { id: 'module-1', component: <div>1</div> }, //componentName: 'DevelopmentServerPane' },
    'module-2': { id: 'module-2', component: <div>2</div> }, //componentName: 'TaskRunnerPane' },
    'module-3': {
      id: 'module-3',
      component: <div>3</div>,
      // componentName: 'DependencyManagementPane',
    },
  },
  // we could also name this panels instead of columns
  columns: [
    {
      id: 'column-1',
      panelItemIds: ['module-1', 'module-2', 'module-3'],
      width: 0, // calculated if panelStatus === 'first-render'
    },
    {
      id: 'column-2',
      panelItemIds: [],
      width: 0, // calculated if panelStatus === 'first-render'
    },
    {
      id: 'column-3',
      panelItemIds: [],
      width: 0, // calculated if panelStatus === 'first-render'
    },
  ],
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

class Panels extends Component<Props, State> {
  node: HTMLElement;
  parentBox: ClientRect;
  startClientCoordinate: ?number;
  startPanelWidths: PanelWidths;
  resizerIndex: ?number;

  state = initialPanelsState;

  static defaultProps = {
    style: {},
  };

  // static getDerivedStateFromProps(props: Props, state: State) {
  //   const isFirstRender = state.panelStatus === 'first-render';

  //   if (isFirstRender) {
  //     return {
  //       panelStatus: 'initialized',
  //       columns: Panels.calculateInitialSizes(props, state),
  //     };
  //   }

  //   // If new panels are introduced, it's not really clear what should happen.
  //   // For now, we're just having it split up the right-most panel
  //   const panelIds = Object.keys(state.panelSizes);
  //   const childrenArray = React.Children.toArray(props.children);

  //   // For now, we are assuming that no more than 1 child will be added
  //   // or removed per update. This assumption makes life easier, and fits
  //   // the currently-planned usecase.

  //   // Is a panel removed in this update?
  //   if (panelIds.length > childrenArray.length) {
  //     const disappearingPanelIndex = panelIds.findIndex(
  //       id => !childrenArray.find(child => child.props.id === id)
  //     );
  //     const disappearingPanelId = panelIds[disappearingPanelIndex];
  //     const disappearingPanelSize = state.panelSizes[disappearingPanelId];

  //     const siblingIndexToGiveSizeTo =
  //       disappearingPanelIndex === 0 ? 0 : disappearingPanelIndex - 1;
  //     const siblingId = panelIds[siblingIndexToGiveSizeTo];

  //     const nextPanelWidths = panelIds.reduce((panelSizes, id) => {
  //       if (id === disappearingPanelId) {
  //         return panelSizes;
  //       }

  //       let size;
  //       if (id === siblingId) {
  //         size = state.panelSizes[id] + disappearingPanelSize + RESIZER_WIDTH;
  //       } else {
  //         size = state.panelSizes[id];
  //       }

  //       return {
  //         ...panelSizes,
  //         [id]: size,
  //       };
  //     }, {});

  //     return {
  //       panelSizes: nextPanelWidths,
  //     };
  //   }

  // Is a panel added in this update?
  //   if (panelIds.length < childrenArray.length) {
  //     const newChildIndex = childrenArray.findIndex(
  //       child => !panelIds.includes(child.props.id)
  //     );
  //     const newChildId = childrenArray[newChildIndex].props.id;

  //     // This new child will steal half of the size of its left-most sibling.
  //     // If this is the first child, it steals from its right-most sibling.
  //     const siblingIndexToStealFrom =
  //       newChildIndex === 0 ? 0 : newChildIndex - 1;

  //     const siblingPanelId = panelIds[siblingIndexToStealFrom];
  //     const siblingPanelSize = state.panelSizes[siblingPanelId];

  //     const nextPanelWidths = childrenArray.reduce((panelSizes, child) => {
  //       const { id } = child.props;

  //       let size;
  //       if (id === newChildId) {
  //         size = Math.floor(siblingPanelSize / 2) - RESIZER_WIDTH;
  //       } else if (id === siblingPanelId) {
  //         size = Math.ceil(siblingPanelSize / 2);
  //       } else {
  //         size = state.panelSizes[id];
  //       }

  //       return {
  //         ...panelSizes,
  //         [id]: size,
  //       };
  //     }, {});

  //     return {
  //       panelSizes: nextPanelWidths,
  //     };
  //   }
  // }

  static calculateInitialSizes = (
    { size, orientation, children }: Props,
    { columns }
  ) => {
    const childrenArray = React.Children.toArray(children);

    const numOfResizers = childrenArray.length - 1;
    const availableSize = size - numOfResizers * RESIZER_WIDTH;

    const initialSizeKey =
      orientation === 'horizontal' ? 'initialWidth' : 'initialHeight';

    // TODO: vertical
    const childrenWithSpecifiedSize = childrenArray.filter(
      child => typeof child.props[initialSizeKey] === 'number'
    );
    const childrenWithoutSpecifiedSize = childrenArray.filter(
      child => typeof child.props[initialSizeKey] === 'undefined'
    );

    const totalClaimedSpace = childrenWithSpecifiedSize.reduce(
      (acc, child) => acc + child.props[initialSizeKey],
      0
    );

    const widthPerUnspecifiedChildren =
      (availableSize - totalClaimedSpace) / childrenWithoutSpecifiedSize.length;

    return childrenArray.reduce((panelSizes, child) => {
      const { id } = child.props;
      const initialSize = child.props[initialSizeKey];

      if (typeof initialSize === 'number') {
        return {
          ...panelSizes,
          [id]: initialSize,
        };
      }

      return {
        ...panelSizes,
        [id]: widthPerUnspecifiedChildren,
      };
    }, {});
  };

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.dragResize);
    document.removeEventListener('mouseup', this.endResize);
  }

  startResize = (ev: any, resizerIndex: number) => {
    const { orientation } = this.props;
    document.addEventListener('mousemove', this.dragResize);
    document.addEventListener('mouseup', this.endResize);

    // TODO: Clean these up, make them all part of 1 property, Flow-tracked
    this.startClientCoordinate =
      orientation === 'horizontal' ? ev.clientX : ev.clientY;
    this.startPanelWidths = { ...this.state.panelSizes };

    this.resizerIndex = resizerIndex;
  };

  dragResize = (ev: any) => {
    const { startClientCoordinate, startPanelWidths, resizerIndex } = this;
    const { orientation } = this.props;
    const { panelSizes } = this.state;

    // Impossible conditions for Flow
    if (
      typeof startClientCoordinate !== 'number' ||
      typeof resizerIndex !== 'number'
    ) {
      console.error('Missing required variables to do panel resizing', this);
      return;
    }

    // We need to convert the window coordinates to the relative positions
    // within this box.
    // Start by getting the raw window coordinates
    const clientCoordinate =
      orientation === 'horizontal' ? ev.clientX : ev.clientY;

    const panelIds = Object.keys(panelSizes);

    // Check and see if this change would push us below our min-width
    const childrenArray = React.Children.toArray(this.props.children);

    let delta = startClientCoordinate - clientCoordinate;

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

    const prospectiveFirstPanelWidth =
      startPanelWidths[firstAffectedPanelId] - delta;

    if (prospectiveFirstPanelWidth < firstAffectedPanelMinWidth) {
      const overshotBy =
        firstAffectedPanelMinWidth - prospectiveFirstPanelWidth;

      delta -= overshotBy;
    }

    if (prospectiveFirstPanelWidth > firstAffectedPanelMaxWidth) {
      const overshotBy =
        prospectiveFirstPanelWidth - firstAffectedPanelMaxWidth;

      delta += overshotBy;
    }

    const nextPanelWidths = {
      ...panelSizes,
      [firstAffectedPanelId]: startPanelWidths[firstAffectedPanelId] - delta,
      [secondAffectedPanelId]: startPanelWidths[secondAffectedPanelId] + delta,
    };

    this.setState({
      panelSizes: nextPanelWidths,
    });
  };

  endResize = (ev: any) => {
    ev.preventDefault();

    document.removeEventListener('mouseup', this.endResize);
    document.removeEventListener('mousemove', this.dragResize);
  };

  onDragEnd = ({ destination, source }) => {
    console.log('dragend', destination, source);
    if (!destination) {
      return;
    }

    const { index: sourceIndex } = source;
    const column = this.state.columns.find(
      col => col.id === destination.droppableId
    );
    const colIndex = this.state.columns.indexOf(column);
    const { index: targetIndex } = destination;
    const panelItemIds = this.state.columns[colIndex].panelItemIds;

    if (source.droppableId === destination.droppableId) {
      // same column
      // columns:
      // [
      //   {id: , ...},
      //   {id: , ...}
      // ]
      this.setState({
        columns: [
          ...this.state.columns.slice(0, colIndex),
          {
            ...column,
            panelItemIds: reorder(panelItemIds, sourceIndex, targetIndex),
          },
          ...this.state.columns.slice(colIndex + 1),
        ],
      });
    } else {
      // other column
      let sourceColumn = this.state.columns.find(
        col => col.id === source.droppableId
      );
      const sourceColumnIndex = this.state.columns.indexOf(sourceColumn);
      let newColumns = this.state.columns.slice();

      // remove item from sourceColumn
      newColumns[sourceColumnIndex] = {
        ...sourceColumn,
      };
      const itemToMove =
        newColumns[sourceColumnIndex].panelItemIds[sourceIndex];
      newColumns[sourceColumnIndex].panelItemIds.splice(sourceIndex, 1);

      // add item to targetColumn
      newColumns[colIndex].panelItemIds = [
        ...newColumns[colIndex].panelItemIds.slice(0, targetIndex),
        itemToMove,
        ...newColumns[colIndex].panelItemIds.slice(targetIndex),
      ];

      this.setState(state => ({ columns: newColumns }));
    }
  };

  render() {
    const { size, children, style, orientation, ...delegated } = this.props;
    const { columns, panelItems } = this.state;

    // console.log({ panelSizes });

    const dimension = orientation === 'horizontal' ? 'width' : 'height';

    // const childrenArray = React.Children.toArray(children).filter(
    //   child => child
    // );

    // todo: re-add resizing of panels
    // Interleave components with Resizer elements
    // const interleavedChildren =
    //   this.state &&
    //   childrenArray.map(
    //     (child, index) =>
    //       index === childrenArray.length - 1
    //         ? React.cloneElement(child, {
    //             [dimension]: Math.round(panelSizes[child.props.id]),
    //           })
    //         : [
    //             React.cloneElement(child, {
    //               [dimension]: Math.round(panelSizes[child.props.id]),
    //             }),
    //             <Resizer
    //               key={index}
    //               index={index}
    //               orientation={orientation}
    //               startResize={this.startResize}
    //             />,
    //           ]
    //   );

    // todo: map over columnOrder later
    const panels = columns.map(column => (
      <Droppable droppableId={column.id} key={column.id}>
        {(provided, snapshot) => (
          <Column innerRef={provided.innerRef}>
            {column.panelItemIds.map((id, index) => {
              // console.log('mapping', column, id);
              // const PanelComponent = <div>{id}</div>; //panelItems[id].component;
              // ||
              //require(`../${panelItems[id].componentName}`);
              // todo: check why is it not possible to pass <PanelComponent/>?
              return (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided, snapshot) => (
                    <ModuleContainer
                      innerRef={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {id}
                      {/* <PanelComponent /> */}
                    </ModuleContainer>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Column>
        )}
      </Droppable>
    ));

    return (
      <Wrapper>
        <DragDropContext
          {...delegated}
          orientation={orientation}
          style={{ ...style, [dimension]: size }}
          innerRef={node => (this.node = node)}
          onDragEnd={this.onDragEnd}
        >
          {/* {interleavedChildren} */}
          {panels}
          {/* {this.props.children} */}
        </DragDropContext>
      </Wrapper>
    );
  }
}

// helpers
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// styles
const Wrapper = styled.div`
  display: flex;
  flex-direction: ${props =>
    props.orientation === 'horizontal' ? 'row' : 'column'};
  flex: 1;
  height: 100%;
  overflow: hidden;
  user-select: none;
`;

const ModuleContainer = styled.div`
  border: 1px solid black;
`;

const Column = styled.div`
  border: 1px solid black;
  padding: 8em;
  margin: 1em;
`;

export default Panels;
