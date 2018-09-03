// @flow
import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { decorateAction } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import Showcase from '../../../.storybook/components/Showcase';
import { COLORS } from '../../constants';
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
            background={COLORS.blue[700]}
            hoverBackground={COLORS.violet[700]}
            textColor={COLORS.yellow[500]}
            onClick={targetAction('button-clicked')}
          >
            Colourful!
          </ButtonBase>
        </Showcase>
        <Showcase label="Gradients">
          <ButtonBase
            background={`linear-gradient(0deg, ${COLORS.blue[700]}, ${
              COLORS.violet[500]
            })`}
            hoverBackground={`linear-gradient(0deg, ${COLORS.red[700]}, ${
              COLORS.orange[500]
            })`}
            textColor={COLORS.yellow[500]}
            onClick={targetAction('button-clicked')}
          >
            Colourful!
          </ButtonBase>
        </Showcase>
      </Fragment>
    ))
  );
