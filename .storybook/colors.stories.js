import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import Heading from '../src/components/Heading';
import { contrastingColor } from '../src/utils';
import { COLORS } from '../src/constants';

storiesOf('Colors', module).add('Gradients', () => (
  <div style={{ margin: '-1em', padding: '1em', background: '#eee' }}>
    {Object.entries(COLORS)
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
  </div>
));

const ColorBlock = styled.div`
  background: ${props => props.color};
  border: 1px solid ${COLORS.gray[200]};
  border-radius: 4px;
  color: ${props => contrastingColor(props.color)};
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;
