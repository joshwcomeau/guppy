// @flow
import { Component } from 'react';

type Props = {
  children: (updateProjectIcon: any, projectIcon: string) => React$Node,
  selected: string,
};
type State = { projectIcon: string };

// This component is currently only being used with Docz
class IconSelector extends Component<Props, State> {
  state = {
    projectIcon: '',
  };

  componentDidMount() {
    this.setState({
      projectIcon: this.props.selected,
    });
  }

  updateProjectIcon = (src: string, ev: SyntheticEvent<*>) => {
    ev.preventDefault();

    this.setState({
      projectIcon: src,
    });
  };

  render() {
    const { projectIcon } = this.state;
    const { children } = this.props;

    return children(this.updateProjectIcon, projectIcon);
  }
}

export default IconSelector;
