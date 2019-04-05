// @flow
import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { decorateAction } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import Showcase from '../../../.storybook/components/Showcase';
import { RAW_COLORS } from '../../constants';
import ButtonBase from './ButtonBase';

const targetAction = decorateAction([args => [args[0].target]]);

const SIZES = ['xsmall', 'small', 'medium', 'large'];

storiesOf('Button / Base', module)
  .add(
    'default',
    withInfo()(() => (
      <ButtonBase onClick={targetAction('clicked')}>Vanilla Button</ButtonBase>
    ))
  )
  .add(
    'sizes',
    withInfo()(() =>
      SIZES.map((size, i) => (
        <Showcase label={size} key={i}>
          <ButtonBase onClick={targetAction('button-clicked')} size={size}>
            Button
          </ButtonBase>
        </Showcase>
      ))
    )
  )
  .add(
    'Colors',
    withInfo()(() => (
      <Fragment>
        <Showcase label="Solid Colours">
          <ButtonBase
            background={RAW_COLORS.blue[700]}
            hoverBackground={RAW_COLORS.violet[700]}
            textColor={RAW_COLORS.yellow[500]}
            onClick={targetAction('button-clicked')}
          >
            Colourful!
          </ButtonBase>
        </Showcase>
        <Showcase label="Gradients">
          <ButtonBase
            background={`linear-gradient(0deg, ${RAW_COLORS.blue[700]}, ${
              RAW_COLORS.violet[500]
            })`}
            hoverBackground={`linear-gradient(0deg, ${RAW_COLORS.red[700]}, ${
              RAW_COLORS.orange[500]
            })`}
            textColor={RAW_COLORS.yellow[500]}
            onClick={targetAction('button-clicked')}
          >
            Colourful!
          </ButtonBase>
        </Showcase>
      </Fragment>
    ))
  );
