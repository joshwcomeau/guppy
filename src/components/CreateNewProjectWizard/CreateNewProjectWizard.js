import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { u2728 as shuffle } from 'react-icons-kit/noto_emoji_regular/u2728';
import { COLORS } from '../../constants';

import TwoPaneModal from '../TwoPaneModal';
import Paragraph from '../Paragraph';
import FormField from '../FormField';
import TextInput from '../TextInput';
import ButtonWithIcon from '../ButtonWithIcon';
import OutlineButton from '../OutlineButton';
import CircularOutlineButton from '../CircularOutlineButton';

class CreateNewProjectWizard extends Component {
  state = {
    activeField: null,
    folded: false,
    name: '',
    type: 'react',
    status: 'idle',
    currentBuildStep: null,
  };

  updateName = ev => this.setState({ name: ev.target.value });

  renderRightPane() {
    const { name, activeField } = this.state;

    return (
      <Fragment>
        <FormField
          label="Project Name"
          labelWidth={50}
          focused={activeField === 'name'}
        >
          <FlexWrapper>
            <TextInput
              type="text"
              value={name}
              focused={activeField === 'name'}
              onChange={this.updateName}
              onFocus={() => this.setState({ activeField: 'name' })}
              onBlur={() => this.setState({ activeField: null })}
              placeholder="Some Fantastic Project Name"
            >
              <ButtonWrapper>
                <CircularOutlineButton size={32}>
                  <IconBase size={22} icon={shuffle} />
                </CircularOutlineButton>
              </ButtonWrapper>

              {/* <ButtonWithIcon
                icon={shuffle}
                size="small"
                style={{
                  color: COLORS.white,
                  backgroundImage: `linear-gradient(
                    -80deg,
                    ${COLORS.pink[700]},
                    ${COLORS.violet[500]})
                  `,
                }}
              >
                Randomize
              </ButtonWithIcon> */}
            </TextInput>
          </FlexWrapper>
        </FormField>

        <FormField label="Project Type" labelWidth={50} />
      </Fragment>
    );
  }

  render() {
    return (
      <TwoPaneModal
        isFolded={false}
        leftPane={
          <Fragment>
            <Title>Create New Project</Title>

            <Paragraph>Hello World</Paragraph>
          </Fragment>
        }
        rightPane={this.renderRightPane()}
        backface={"I'm in the back"}
      />
    );
  }
}

const Title = styled.h1`
  font-size: 36px;
`;

const FlexWrapper = styled.div`
  display: flex;
`;

const StandaloneIcon = styled.div`
  position: absolute;
  top: 6px;
  left: 6px;
`;

const ButtonHider = styled.div`
  opacity: 0;
  transition: opacity 250ms;

  &:hover {
    opacity: 1;
    transition: opacity 500ms 100ms;
  }
`;

const ButtonWrapper = styled.div`
  transform: translateY(5px);
`;

export default CreateNewProjectWizard;
