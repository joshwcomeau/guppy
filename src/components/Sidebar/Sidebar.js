// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import type Projects from '../../types';

type Props = {
  projects: Array<Projects>,
};

type State = {
  isVisible: boolean,
};

class Sidebar extends Component<Props, State> {
  state = {
    isVisible: this.props.projects.length > 0,
  };

  render() {
    const { projects } = this.props;
    const { isVisible } = this.state;

    console.log(projects);

    return (
      <Motion style={{ translate: isVisible ? 0 : -100 }}>
        {({ translate }) => <Wrapper>Hello</Wrapper>}
      </Motion>
    );
  }
}

const Wrapper = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 72px;
  background-image: linear-gradient(
    45deg,
    ${COLORS.blue[900]},
    ${COLORS.blue[800]}
  );
`;

const mapStateToProps = state => ({
  projects: state.projects,
});

export default connect(mapStateToProps)(Sidebar);
