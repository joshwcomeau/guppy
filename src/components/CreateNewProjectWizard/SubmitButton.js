// @flow
import React from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { check } from 'react-icons-kit/feather/check';
import { chevronRight } from 'react-icons-kit/feather/chevronRight';

import { COLORS } from '../../constants';

import { FillButton } from '../Button';
import Spinner from '../Spinner';

type Props = {
  readyToBeSubmitted: boolean,
  hasBeenSubmitted: boolean,
  isDisabled: boolean,
  onSubmit: () => ?Promise<any>,
};

const SubmitButton = ({
  readyToBeSubmitted,
  hasBeenSubmitted,
  isDisabled,
  onSubmit,
}: Props) => {
  const buttonText = hasBeenSubmitted
    ? 'Building...'
    : readyToBeSubmitted
      ? "Let's do this"
      : 'Next';

  return (
    <FillButton
      disabled={isDisabled || hasBeenSubmitted}
      size="large"
      colors={[
        readyToBeSubmitted ? COLORS.green[700] : COLORS.blue[700],
        readyToBeSubmitted ? COLORS.lightGreen[500] : COLORS.blue[500],
      ]}
      style={{ width: 200 }}
      onClick={onSubmit}
    >
      <ChildWrapper>{buttonText}</ChildWrapper>

      <SubmitButtonIconWrapper>
        {hasBeenSubmitted ? (
          <Spinner size={24} />
        ) : (
          <IconBase
            size={24}
            icon={readyToBeSubmitted ? check : chevronRight}
          />
        )}
      </SubmitButtonIconWrapper>
    </FillButton>
  );
};

const SubmitButtonIconWrapper = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  right: 10px;
  top: 0;
  bottom: 0;
  margin: auto;
`;

const ChildWrapper = styled.div`
  line-height: 48px;
`;

export default SubmitButton;
