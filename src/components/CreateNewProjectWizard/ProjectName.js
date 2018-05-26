// @flow
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { u2728 as shuffle } from 'react-icons-kit/noto_emoji_regular/u2728';

import { COLORS } from '../../constants';
import { createRandomNameGenerator } from '../../services/project-name.service';

import FormField from '../FormField';
import TextInput from '../TextInput';
import CircularOutlineButton from '../CircularOutlineButton';

const generateRandomName = createRandomNameGenerator();

console.log(createRandomNameGenerator, generateRandomName);

type Props = {
  name: string,
  isFocused: boolean,
  handleFocus: () => void,
  handleBlur: () => void,
  handleChange: (ev: any) => void,
};

type State = {};

class ProjectName extends PureComponent<Props, State> {
  state = {};

  handleRandomize = () => {
    const newName = generateRandomName();

    console.log({ newName });

    this.props.handleChange(newName);
  };

  updateName = ev => {
    this.props.handleChange(ev.target.value);
  };

  render() {
    const {
      name,
      isFocused,
      handleFocus,
      handleBlur,
      handleChange,
    } = this.props;

    return (
      <FormField label="Project Name" labelWidth={50} focused={isFocused}>
        <FlexWrapper>
          <TextInput
            type="text"
            value={name}
            focused={isFocused}
            onChange={this.updateName}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Some Fantastic Project Name"
          >
            <ButtonPositionAdjuster>
              <CircularOutlineButton
                drawOutlineOnHover
                onClick={this.handleRandomize}
                size={32}
              >
                <IconBase size={22} icon={shuffle} />
              </CircularOutlineButton>
            </ButtonPositionAdjuster>
          </TextInput>
        </FlexWrapper>
      </FormField>
    );
  }
}

const FlexWrapper = styled.div`
  display: flex;
`;

const ButtonPositionAdjuster = styled.div`
  transform: translateY(5px);
`;

export default ProjectName;
