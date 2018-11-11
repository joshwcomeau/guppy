import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { checkCircle } from 'react-icons-kit/feather/checkCircle';
import { xCircle } from 'react-icons-kit/feather/xCircle';
import { config, Spring } from 'react-spring';

import TextInput from '../TextInput';

// Note: Async validation not working.
//       Would be great to allow an async tokenValidator function.

class TokenInputField extends PureComponent {
  static defaultProps = {
    focused: false,
    oneTimeDisplay: true, // if true only displayed on next enter will clear the field
    hideDuringTyping: true, // todo need to save both in token weakmap
    value: '',
    onChange: token => {},
    onBlur: () => {},
    tokenValidator: token => token, // we're checking only if it's not '' but with a backend we could check if it's a valid token
  };

  state = {
    focused: false,
    untouched: true,
  };

  constructor(props) {
    super(props);

    let token = props.value;

    this.setToken = newToken => {
      token = newToken;
      this.forceUpdate();
    };
    this.getToken = () => token;

    if (this.props.value) {
      this.state = {
        untouched: false,
        focused: false,
      };
    } else {
      this.state = {
        untouched: true,
        focused: props.focused,
      };
    }
  }

  tokenInput;
  valid = false;
  REPLACEMENT_CHAR = '\u2022';

  updateToken = evt => {
    const tokenVal = evt.target.value;
    this.setToken(tokenVal);
    this.props.onChange(tokenVal);
  };

  displayedValue = () => {
    const { focused } = this.state;
    const token = this.getToken();

    return focused // && !hideDuringTyping
      ? token
      : token
          .split('')
          .map(char => this.REPLACEMENT_CHAR)
          .join('');
  };

  focus = () => {
    if (this.props.oneTimeDisplay && !this.state.focused) {
      this.setToken('');
    }

    this.setState({
      focused: true,
      untouched: false,
    });
  };

  blur = () => {
    this.setState({
      focused: false,
    });

    this.props.onBlur(this.getToken());
  };

  renderIcon = (token, valid, opacity) => {
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

  /*async componentWillReceiveProps() {
    const token = this.getToken();
    this.valid = await this.props.tokenValidator(token);
  }*/

  render() {
    const { focused, untouched } = this.state;
    const token = this.getToken();
    const showInput = focused || untouched;
    const showValidation = !focused && !untouched;
    const valid = this.props.tokenValidator(token);
    return (
      <Wrapper>
        {showInput && (
          <TextInput
            isFocused={focused}
            onFocus={this.focus}
            onBlur={this.blur}
            value={this.displayedValue()}
            onChange={this.updateToken}
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
