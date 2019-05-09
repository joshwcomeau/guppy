/* eslint-disable flowtype/require-valid-file-annotation */
import React, { Fragment } from 'react';
import styled from 'styled-components';

import Heading from '../../components/Heading';
import { contrastingColor } from '../../utils';
import { RAW_COLORS, COLORS, GRADIENTS } from '../../constants';

// Calling ColorList from mdx files do not trigger Flow errors, so no need to annotate
const ColorList = ({ type }) => {
  let COLOR;
  if (type === 'raw') {
    COLOR = RAW_COLORS;
  } else if (type === 'semantic') {
    COLOR = COLORS;
  } else {
    COLOR = GRADIENTS;
  }

  return (
    <Fragment>
      {Object.entries(COLOR)
        .filter(
          // docz adds __filemeta property to all exports, so have to filter it out
          ([_, gradient]) => {
            return type === 'raw'
              ? typeof gradient === 'object' && _ !== '__filemeta'
              : _ !== '__filemeta';
          }
        )
        .map(([name, gradient], i) => (
          <Fragment key={i}>
            {type === 'raw' && (
              <Fragment>
                <Heading
                  style={{
                    marginTop: i === 0 ? 0 : '20px',
                    marginBottom: '10px',
                  }}
                >
                  {name}
                </Heading>
                {Object.entries(gradient).map(([interval, color], j) => (
                  <ColorBlock key={j} color={color}>
                    {interval}
                  </ColorBlock>
                ))}
              </Fragment>
            )}

            {/* Semantic Colors */}
            {type === 'semantic' && (
              <ColorBlock key={i} color={gradient}>
                {name}
              </ColorBlock>
            )}

            {/* Gradient Colors */}
            {type === 'gradient' && (
              <GradientBlock key={i} colors={gradient}>
                {name}
              </GradientBlock>
            )}
          </Fragment>
        ))}
    </Fragment>
  );
};

export default ColorList;

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
