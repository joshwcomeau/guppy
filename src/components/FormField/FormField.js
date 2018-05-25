import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class FormField extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    labelWidth: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    const { label, labelWidth, children } = this.props;

    return (
      <Wrapper>
        <LabelText width={labelWidth}>{label}:</LabelText>
        <Children>{children}</Children>
      </Wrapper>
    );
  }
}

const Wrapper = styled.label`
  display: flex;
  align-items: center;
`;

const LabelText = styled.div`
  flex-basis: ${props => props.width}px;
  text-align: right;
  font-size: 15px;
  padding: 5px;
`;

const Children = styled.div`
  flex: 1;
  padding: 5px;
`;

export default FormField;
