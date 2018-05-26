import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLORS } from '../../constants';

class FormField extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    labelWidth: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    const { label, labelWidth, focused, children } = this.props;

    return (
      <Wrapper>
        <LabelText width={labelWidth} focused={focused}>
          {label}:
        </LabelText>
        <Children>{children}</Children>
      </Wrapper>
    );
  }
}

const Wrapper = styled.label`
  display: block;
  margin-bottom: 30px;
`;

const LabelText = styled.div`
  flex-basis: ${props => props.width}px;
  font-size: 13px;
  color: ${props => (props.focused ? COLORS.pink[500] : COLORS.gray[500])};
  padding: 0px 5px;
  text-transform: uppercase;
  font-weight: 500;
`;

const Children = styled.div`
  flex: 1;
  padding: 0px 5px 5px;
`;

export default FormField;
