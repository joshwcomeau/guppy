// @flow
import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import Heading from '../components/Heading';
import { contrastingColor } from '../utils';
import { RAW_COLORS, COLORS, GRADIENTS } from '../constants';

const ColorList = ({ colors }) => (
  <Fragment>
    {Object.entries(colors).map(
      ([name, gradient], i) =>
        typeof gradient === 'string' ? (
          <ColorBlock key={i} color={gradient}>
            {name}
          </ColorBlock>
        ) : Array.isArray(gradient) ? (
          <GradientBlock key={i} colors={gradient}>
            {name}
          </GradientBlock>
        ) : (
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
        )
    )}
  </Fragment>
);

storiesOf('Colors', module)
  .add('Semantics', () => <ColorList colors={COLORS} />)
  .add('Gradients', () => <ColorList colors={GRADIENTS} />)
  .add('All', () => <ColorList colors={RAW_COLORS} />);

const ColorBlock = styled.div`
  background: ${props => props.color};
  border-radius: 4px;
  color: ${props => contrastingColor(props.color)};
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const GradientBlock = styled.div`
  background-image: linear-gradient(15deg, ${props => props.colors.join(', ')});
  border-radius: 4px;
  color: ${props => contrastingColor(props.colors[0])};
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;
