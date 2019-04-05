// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Tooltip } from 'react-tippy';
import IconBase from 'react-icons-kit';
import { u2728 as sparkles } from 'react-icons-kit/noto_emoji_regular/u2728';

import { COLORS } from '../../constants';
import { generateRandomName } from '../../services/project-name.service';
import { range, random } from '../../utils';

import FormField from '../FormField';
import TextInput from '../TextInput';
import HoverableOutlineButton from '../HoverableOutlineButton';

type Props = {
  name: string,
  isFocused: boolean,
  isProjectNameTaken: boolean,
  // TODO: Change to onFocus, onBlur, onChange for consistency
  handleFocus: () => void,
  handleBlur: () => void,
  handleChange: (val: string) => void,
  handleSubmit: () => Promise<any> | void,
};

type State = {
  randomizedOverrideName: ?string,
  randomizeCount: number,
  showRandomizeTooltip: boolean,
};

class ProjectName extends PureComponent<Props, State> {
  state = {
    randomizedOverrideName: null,
    randomizeCount: 0,
    showRandomizeTooltip: false,
  };

  node: HTMLElement;
  timeoutId: number;

  componentDidMount() {
    this.node.focus();

    this.timeoutId = window.setTimeout(() => {
      this.setState({ showRandomizeTooltip: true });
    }, 3500);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeoutId);
  }

  getRidOfRandomizeTooltip = () => {
    // If it hasn't been shown yet, ensure it won't be.
    window.clearTimeout(this.timeoutId);

    if (this.state.showRandomizeTooltip) {
      this.setState({ showRandomizeTooltip: false });
    }
  };

  handleRandomize = () => {
    const { randomizeCount } = this.state;
    const newName = generateRandomName();

    this.getRidOfRandomizeTooltip();

    this.props.handleChange(newName);

    // See note above. $FlowFixMe
    this.node.focus();

    let numOfTicks;
    if (randomizeCount <= 3) {
      numOfTicks = 10;
    } else if (randomizeCount <= 6) {
      numOfTicks = 3;
    } else {
      numOfTicks = 0;
    }

    if (numOfTicks > 0) {
      this.scramble(this.props.name, newName, numOfTicks);
    }
  };

  updateName = (ev: SyntheticInputEvent<*>) => {
    this.getRidOfRandomizeTooltip();

    this.props.handleChange(ev.target.value);
  };

  scramble = (from: string, to: string, numOfTicks: number) => {
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

  maybeHandleSubmit = (ev: SyntheticKeyboardEvent<*>) => {
    if (ev.key === 'Enter') {
      this.props.handleSubmit();

      // See note above. $FlowFixMe
      this.node.blur();
    }
  };

  setRef = (node: HTMLElement) => (this.node = node);

  render() {
    const {
      name,
      isFocused,
      isProjectNameTaken,
      handleFocus,
      handleBlur,
    } = this.props;
    const { randomizedOverrideName, showRandomizeTooltip } = this.state;

    return (
      <FormField
        useLabelTag
        label="Project Name"
        isFocused={isFocused}
        hasError={isProjectNameTaken}
        spacing={15}
      >
        <TextInput
          innerRef={this.setRef}
          type="text"
          value={randomizedOverrideName || name}
          isFocused={isFocused}
          hasError={isProjectNameTaken}
          onChange={this.updateName}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={this.maybeHandleSubmit}
          placeholder="Your Amazing Project Name"
        >
          <ButtonPositionAdjuster>
            <Tooltip
              arrow
              open={showRandomizeTooltip}
              title="Generate a random code-name"
              delay={100}
              distance={24}
              duration={200}
              animation="shift"
              trigger="manual"
            >
              <HoverableOutlineButton
                noPadding
                onMouseDown={() => window.requestAnimationFrame(handleFocus)}
                onClick={this.handleRandomize}
                style={{ width: 32, height: 32 }}
              >
                <IconBase size={22} icon={sparkles} />
              </HoverableOutlineButton>
            </Tooltip>
          </ButtonPositionAdjuster>
        </TextInput>
        {isProjectNameTaken && (
          <ErrorMessage>
            Sorry, a project with this name already exists.
          </ErrorMessage>
        )}
      </FormField>
    );
  }
}

export const ErrorMessage = styled.div`
  margin-top: 6px;
  color: ${COLORS.error};
`;

const ButtonPositionAdjuster = styled.div`
  transform: translateY(5px);
`;

export default ProjectName;
