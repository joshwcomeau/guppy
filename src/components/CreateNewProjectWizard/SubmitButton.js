// @flow
import React from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { check } from 'react-icons-kit/feather/check';
import { chevronRight } from 'react-icons-kit/feather/chevronRight';

import { COLORS } from '../../constants';

import Button from '../Button';

type Props = {
  readyToBeSubmitted: boolean,
  isDisabled: boolean,
  handleNext: () => void,
  handleSubmit: () => void,
};

const SubmitButton = ({
  readyToBeSubmitted,
  isDisabled,
  handleNext,
  handleSubmit,
}: Props) => (
  <Button
    disabled={isDisabled}
    type="fill"
    size="large"
    color1={readyToBeSubmitted ? COLORS.green[700] : COLORS.blue[700]}
    color2={readyToBeSubmitted ? COLORS.lightGreen[500] : COLORS.blue[500]}
    style={{ color: COLORS.pink[500], width: 200 }}
    onClick={readyToBeSubmitted ? handleSubmit : handleNext}
  >
    <ChildWrapper>{readyToBeSubmitted ? 'Submit' : 'Next'}</ChildWrapper>
    <SubmitButtonIconWrapper>
      <IconBase size={24} icon={readyToBeSubmitted ? check : chevronRight} />
    </SubmitButtonIconWrapper>
  </Button>
);

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
