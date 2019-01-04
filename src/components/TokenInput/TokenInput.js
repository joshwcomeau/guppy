// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { checkCircle } from 'react-icons-kit/feather/checkCircle';
import { xCircle } from 'react-icons-kit/feather/xCircle';
import { config, Spring } from 'react-spring';

import TextInput from '../TextInput';

// Note: Async validation not working.
//       Would be great to allow an async tokenValidator function. But it's not needed here.

type Props = {
  focused: boolean,
  oneTimeDisplay: boolean, // if true only displayed once - next focus will clear the field
  token: string,
  onChange: string => void,
  onFocus: () => void,
  onBlur: string => void,
  tokenValidator: string => boolean,
};

class TokenInputField extends PureComponent<Props> {
  static defaultProps = {
    focused: false,
    oneTimeDisplay: false,
    token: '',
    onChange: (token: string) => {},
    onBlur: () => {},
    tokenValidator: (token: string) => !!token, // we're checking only if it's not '' but with a backend we could check if it's a valid token
  };

  focus = () => {
    if (this.props.oneTimeDisplay && !this.props.focused) {
      this.props.onChange('');
    }

    this.props.onFocus();
  };

  renderIcon = (token: string, valid: number, opacity: number) => {
    const icon = token ? checkCircle : xCircle;
    return (
      <ValidationIcon
        opacity={opacity}
        icon={icon}
        valid={valid}
        size={32}
        onClick={this.focus}
      />
    );
  };

  render() {
    const { focused, onChange, token, onBlur } = this.props;
    const untouched = token === '';
    const showInput = focused || untouched;
    const showValidation = !focused && !untouched;
    const valid = this.props.tokenValidator(token) ? 1 : 0;
    return (
      <Wrapper>
        {showInput && (
          <TextInput
            isFocused={focused}
            onFocus={this.focus}
            onBlur={() => onBlur(token)}
            value={token}
            onChange={evt => onChange(evt.target.value)}
            autoFocus
          />
        )}
        {showValidation && (
          <Spring
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            config={config.slow}
          >
            {({ opacity }) => this.renderIcon(token, valid, opacity)}
          </Spring>
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div``;

const ValidationIcon = styled(IconBase).attrs({
  style: ({ valid, opacity }) => ({
    color: valid ? 'green' : 'red',
    opacity,
  }),
})`
  cursor: pointer;
  height: 47px;
`;

export default TokenInputField;
