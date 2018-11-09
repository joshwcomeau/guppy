// @flow
import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import Heading from '../components/Heading';
import { contrastingColor } from '../utils';
import { COLORS } from '../constants';

const COMMON_COLORS = {
  pink: {
    '300': COLORS.pink[300],
    '500': COLORS.pink[500],
    '700': COLORS.pink[700],
  },
  red: {
    '500': COLORS.red[500],
    '700': COLORS.red[700],
  },
  orange: {
    '500': COLORS.orange[500],
    '700': COLORS.orange[700],
  },
  lime: {
    '500': COLORS.lime[500],
  },
  lightGreen: {
    '500': COLORS.lightGreen[500],
  },
  green: {
    '500': COLORS.green[500],
    '700': COLORS.green[700],
  },
  teal: {
    '500': COLORS.teal[500],
    '700': COLORS.teal[700],
  },
  blue: {
    '700': COLORS.blue[700],
    '900': COLORS.blue[900],
  },
  violet: {
    '500': COLORS.violet[500],
    '700': COLORS.violet[700],
  },
  purple: {
    '500': COLORS.purple[500],
    '700': COLORS.purple[700],
  },
  gray: {
    '50': COLORS.gray[50],
    '100': COLORS.gray[100],
    '200': COLORS.gray[200],
    '300': COLORS.gray[300],
    '400': COLORS.gray[400],
    '500': COLORS.gray[500],
    '600': COLORS.gray[600],
    '700': COLORS.gray[700],
    '800': COLORS.gray[800],
    '900': COLORS.gray[900],
  },
};

const ColorList = ({ colors }) => (
  <Fragment>
    {Object.entries(colors)
      .filter(([_, gradient]) => typeof gradient === 'object')
      .map(([name, gradient], i) => (
        <Fragment key={i}>
          <Heading
            style={{ marginTop: i === 0 ? 0 : '20px', marginBottom: '10px' }}
          >
            {name}
          </Heading>
          {Object.entries(gradient).map(([interval, color], j) => (
            <ColorBlock key={j} color={color}>
              {interval}
            </ColorBlock>
          ))}
        </Fragment>
      ))}
  </Fragment>
);

storiesOf('Colors', module)
  .add('Commonly-used', () => <ColorList colors={COMMON_COLORS} />)
  .add('All', () => <ColorList colors={COLORS} />);

const ColorBlock = styled.div`
  background: ${props => props.color};
  border-radius: 4px;
  color: ${props => contrastingColor(props.color)};
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;
