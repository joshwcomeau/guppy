import React, { Component } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { checkCircle } from 'react-icons-kit/feather/checkCircle';
import { xCircle } from 'react-icons-kit/feather/xCircle';
import { Transition, Spring } from 'react-spring';

// Note: Async validation not working.
//       Would be great to allow an async tokenValidator function.

class TokenInputField extends Component {
  static defaultProps = {
    oneTimeDisplay: true, // if true only displayed on next enter will clear the field
    value: '',
    onChange: token => {},
    onBlur: () => {},
    tokenValidator: token => token, // we're checking only if it's not '' but with this we could modify validation
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
    }
  }

  tokenInput;
  valid = false;
  REPLACEMENT_CHAR = '\u2022';

  updateToken = () => {
    const tokenVal = this.tokenInput.value;
    this.setToken(tokenVal);
    this.props.onChange(tokenVal);
  };

  displayedValue = () => {
    const { focused } = this.state;
    const token = this.getToken();

    return focused
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
        {/* <pre>
          Debug of input:
          {JSON.stringify(this.state, null, 2)}
          {'\n'}
          Token: {this.getToken()}
        </pre> */}
        <Transition
          items={showInput}
          from={{ width: 0 }}
          enter={{ width: 1.0 }}
          leave={{ width: 0 }}
        >
          {toggle => props =>
            toggle && (
              <Input
                width={props.width}
                onFocus={this.focus}
                onBlur={this.blur}
                ref={ref => (this.tokenInput = ref)}
                value={this.displayedValue()}
                onChange={this.updateToken}
                autoFocus
              />
            )}
        </Transition>

        {showValidation && (
          <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} delay={700}>
            {({ opacity }) => this.renderIcon(token, valid, opacity)}
          </Spring>
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 160px;
`;

const Input = styled.input.attrs({
  style: ({ width }) => ({
    width: `${width * 100}%`,
  }),
})`
  border: 0;
  outline: none;
  padding: 6px 0;
  border-bottom: 3px solid #aaa;
  :focus {
    border-color: blue;
  }
`;

const ValidationIcon = styled(IconBase).attrs({
  style: ({ valid, opacity }) => ({
    color: valid ? 'green' : 'red',
    opacity,
  }),
})`
  flex-direction: row;
  cursor: pointer;
  width: 32px;
`;

export default TokenInputField;
