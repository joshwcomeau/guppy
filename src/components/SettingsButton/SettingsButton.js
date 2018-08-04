import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import chroma from 'chroma-js';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { settings } from 'react-icons-kit/feather/settings';
import { COLORS } from '../../constants';
import type { Project } from '../../types';

// import ProjectConfigurationModal from '../ProjectConfigurationModal';

// type Props = {
//   project: Project,
// };

// type State = {
//   showModal: boolean,
// };

// class ProjectConfigurationButton extends Component<Props, State> {
//   state = {
//     showModal: false,
//   };

//   displaySettings = () => {
//     this.setState({
//       showModal: true,
//     });
//   };

//   handleDismiss = () => {
//     this.setState({
//       showModal: false,
//     });
//   };

//   render() {
//     return (
//       <Wrapper>
//         <Button
//           size="30"
//           color1="rgba(255, 255, 255, 0.1)"
//           color2="rgba(255, 255, 255, 0.1)"
//           onClick={this.displaySettings}
//         >
//           <IconWrapper>
//             <IconBase
//               size={30}
//               icon={settings}
//               style={{ color: COLORS.GRAY }}
//             />
//           </IconWrapper>
//         </Button>
//         <ProjectConfigurationModal
//           project={this.props.project}
//           isVisible={!!this.state.showModal}
//           onDismiss={this.handleDismiss}
//         />
//       </Wrapper>
//     );
//   }
// }

// const Button = styled.button`
//   width: ${props => props.size}px;
//   height: ${props => props.size}px;
//   outline: none;
//   border: none;
//   background: none;
//   cursor: pointer;
// `;

// const IconWrapper = styled.div`
//   transform: translate(1px, 2px);
// `;

// const Wrapper = styled.div`
//   margin-top: -60px;
//   float: right;
// `;

type Props = {
  size: number,
  color: ?string,
  hoverColor: ?string,
};

type State = {
  rotations: number,
  color: number,
  hovered: boolean,
};

class SettingsButton extends Component<Props, State> {
  static defaultProps = {
    size: 30,
    color: COLORS.gray[600],
    hoverColor: COLORS.purple[700], // purple or violet 500/700
  };

  state = {
    rotations: 0,
    color: 0,
    hovered: false,
  };

  handleMouseEnter = () => {
    // We can try a bunch of numbers here.
    // 0.5? 1? 2? 5?
    const numOfRotationsOnHover = 0.3;
    this.setState(state => ({
      hovered: true,
      rotations: state.rotations + numOfRotationsOnHover,
      color: 1,
    }));
  };

  handleMouseLeave = () => {
    // I wonder if we should "unwind" it on mouseout?
    // I'm not sure... maybe try it with/without this?
    this.setState({ hovered: false, rotations: 0, color: 0 });
  };

  render() {
    return (
      // Omitting most of the structure that isn't relevant
      <Motion
        style={{
          rotations: spring(this.state.rotations),
          color: spring(this.state.color),
        }}
      >
        {({ rotations, color }) => (
          <div>
            <IconBase
              size={this.props.size}
              icon={settings}
              style={{
                transform: `rotate(${rotations * 360}deg)`,
                color: chroma
                  .interpolate(this.props.color, this.props.hoverColor, color)
                  .hex(),
              }}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              onClick={this.props.action}
            />
          </div>
        )}
      </Motion>
    );
  }
}

export default SettingsButton;
