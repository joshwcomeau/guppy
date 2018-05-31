// @flow
/**
 * This app requires knowledge of where certain elements are on the page.
 * It should contain a map of critical HTML element nodes, and should provide
 * a consumer that can provide ref-capturers so that they can be gathered.
 * Also, resize handling presumably?
 */
import React, { Component } from 'react';

// $FlowFixMe
const NodeContext = React.createContext('node');

export type Nodes = { [key: string]: HTMLElement };
export type BoundingBoxes = { [key: string]: ClientRect };

type Props = { children: React$Node };
type State = {
  nodes: Nodes,
  boundingBoxes: BoundingBoxes,
};

class NodeProvider extends Component<Props, State> {
  state = {
    nodes: {},
    boundingBoxes: {},
    refCapturer: (id: string, node: HTMLElement) => {
      if (!node) {
        return;
      }

      if (this.state.nodes[id]) {
        return;
      }

      this.setState({
        nodes: {
          ...this.state.nodes,
          [id]: node,
        },
        boundingBoxes: {
          ...this.state.boundingBoxes,
          [id]: node.getBoundingClientRect(),
        },
      });
    },
  };

  render() {
    return (
      <NodeContext.Provider value={this.state}>
        {this.props.children}
      </NodeContext.Provider>
    );
  }
}

export const NodeConsumer = NodeContext.Consumer;

export default NodeProvider;
