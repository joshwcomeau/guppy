import React, { Component } from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants';

export default styled.input`
  width: 100%;
  padding: 8px;
  border: none;
  border-bottom: 2px solid ${COLORS.gray[700]};
  border-radius: 2px;
  outline: none;

  &:focus {
    border-bottom: 2px solid ${COLORS.pink[500]};
  }
`;
