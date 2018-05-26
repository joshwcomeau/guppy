// @flow
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { u2728 as shuffle } from 'react-icons-kit/noto_emoji_regular/u2728';

import { COLORS } from '../../constants';
import { createRandomNameGenerator } from '../../services/project-name.service';
import { getInterpolatedValue, range, random } from '../../utils';

import FormField from '../FormField';
import TextInput from '../TextInput';
import CircularOutlineButton from '../CircularOutlineButton';

const generateRandomName = createRandomNameGenerator();

type Props = {
  name: string,
  isFocused: boolean,
  handleFocus: () => void,
  handleBlur: () => void,
  handleChange: (ev: any) => void,
};

type State = {
  randomizedOverrideName: ?string,
};

class ProjectName extends PureComponent<Props, State> {
  state = {
    randomizedOverrideName: null,
    randomizeCount: 0,
  };

  handleRandomize = () => {
    const { randomizeCount } = this.state;
    const newName = generateRandomName();

    this.props.handleChange(newName);

    let numOfTicks;
    if (randomizeCount <= 3) {
      numOfTicks = 10;
    } else if (randomizeCount <= 6) {
      numOfTicks = 5;
    } else {
      numOfTicks = 0;
    }

    if (numOfTicks > 0) {
      this.scramble(this.props.name, newName, numOfTicks);
    }
  };

  updateName = ev => {
    this.props.handleChange(ev.target.value);
  };

  scramble = (from, to, numOfTicks) => {
    const fromNumOfChars = from.length;
    const toNumOfChars = to.length;

    // Start with all spaces revealed
    let revealedLetterIndices = to
      .split('')
      .map((_, i) => i)
      .filter(i => to[i].match(/\s/));

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    const tick = (i = 0) => {
      const progress = i / numOfTicks;

      const isFinished =
        this.state.randomizedOverrideName === to || progress === 1;

      if (isFinished) {
        this.setState({
          randomizedOverrideName: null,
          randomizeCount: this.state.randomizeCount + 1,
        });
        return;
      }

      // As we get closer to the "to" term, letters should be progressively
      // revealed. So we may not want to randomize every letter.
      const numOfRevealedLetters = revealedLetterIndices.length;
      const numOfLettersToReveal = Math.floor(progress * toNumOfChars);

      range(0, numOfLettersToReveal - numOfRevealedLetters).forEach(() => {
        // We want to pick a random index to reveal
        // TODO: Prioritize early-in-the-string letters, for a nicer effect?
        // TODO: Worry about duplicates, so that the timing is more consistent?
        revealedLetterIndices.push(random(0, toNumOfChars));
      });

      const semiRandomString = to
        .split('')
        .map((letter, index) => {
          if (revealedLetterIndices.includes(index)) {
            return letter;
          }

          return letters.charAt(random(0, letters.length));
        })
        .join('');

      this.setState({ randomizedOverrideName: semiRandomString });

      window.setTimeout(() => tick(i + 1), 15 + progress * 100);
    };

    tick();
  };

  render() {
    const {
      name,
      isFocused,
      handleFocus,
      handleBlur,
      handleChange,
    } = this.props;
    const { randomizedOverrideName } = this.state;

    return (
      <FormField label="Project Name" labelWidth={50} focused={isFocused}>
        <FlexWrapper>
          <TextInput
            id="text-input"
            type="text"
            value={randomizedOverrideName || name}
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
