// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import Logo from '../Logo';

import Icon from 'react-icons-kit';
import { minus, minimize2, maximize2, x } from 'react-icons-kit/feather';
import { COLORS, Z_INDICES } from '../../constants';
import { remote } from 'electron';
import {
  execute,
  getDefaultLabel,
  getDefaultAccelerator,
} from './menu-item-roles';
import { isMac } from '../../services/platform.service';

type MenuItem = {
  role?: string,
  type?: string,
  click?: () => void,
  label?: string,
  accelerator?: string,
};

type Props = {
  template: any,
};
type State = {
  windowIsMaximized: boolean,
  altIsPressed: boolean,
};

class FramelessMenu extends Component<Props, State> {
  // is `context: any` the correct way to do this?
  constructor(props: Props, context: any) {
    super(props, context);

    this.state = {
      windowIsMaximized: remote.getCurrentWindow().isMaximized(),
      altIsPressed: false,
    };
  }

  componentDidMount() {
    const appWindow = remote.getCurrentWindow();
    appWindow.on('maximize', this.updateWindowIsMaximized);
    appWindow.on('restore', this.updateWindowIsMaximized);

    window.addEventListener('keydown', this.pressAlt, true);
    window.addEventListener('keyup', this.releaseAlt, true);
  }

  componentWillUnmount() {
    const appWindow = remote.getCurrentWindow();
    appWindow.removeListener('maximize', this.updateWindowIsMaximized);
    appWindow.removeListener('restore', this.updateWindowIsMaximized);

    window.removeEventListener('keydown', this.pressAlt);
    window.removeEventListener('keyup', this.releaseAlt);
  }

  updateWindowIsMaximized = () =>
    this.setState({
      windowIsMaximized: remote.getCurrentWindow().isMaximized(),
    });

  pressAlt = (e: SyntheticKeyboardEvent<>) =>
    e.key === 'Alt' && this.setState({ altIsPressed: true });

  releaseAlt = (e: SyntheticKeyboardEvent<>) =>
    e.key === 'Alt' && this.setState({ altIsPressed: false });

  minimize = () => remote.getCurrentWindow().minimize();

  toggleMaximize = () => {
    const window = remote.getCurrentWindow();
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }

    this.updateWindowIsMaximized();
  };

  close = () => remote.getCurrentWindow().close();

  renderMenuBar = () => {
    const { template } = this.props;
    if (!template) return null;

    return template.map((menu, menuIndex) => (
      <MenuBarItem key={menuIndex}>
        {this.renderLabel(menu.label)}
        {this.renderMenu(menu.submenu)}
      </MenuBarItem>
    ));
  };

  renderMenu = (menu: Array<MenuItem>) => {
    return (
      <SubMenu>
        {menu.map((item, itemIndex) => this.renderMenuItem(item, itemIndex))}
      </SubMenu>
    );
  };

  renderMenuItem = (
    { role, type, click, label, accelerator }: MenuItem,
    key: number
  ) => {
    const window = remote.getCurrentWindow();

    return type === 'separator' ? (
      <SubMenuSeparator key={key} />
    ) : role ? (
      <SubMenuItem
        key={key}
        onClick={() => execute(role, window, window.webContents)}
      >
        {label ? label : getDefaultLabel(role)}
        {this.renderAccelerator(
          accelerator ? accelerator : getDefaultAccelerator(role)
        )}
      </SubMenuItem>
    ) : (
      <SubMenuItem key={key} onClick={click}>
        {this.renderLabel(label)}
        {this.renderAccelerator(accelerator)}
      </SubMenuItem>
    );
  };

  renderLabel = (label?: string) => {
    if (!label) return label;

    if (!label.includes('&')) {
      return label;
    }

    const { altIsPressed } = this.state;
    if (!altIsPressed) return label.replace('&', '');

    const parts = label.split('&');
    if (parts.length !== 2) {
      throw new Error(
        `Labels must contain exactly 1 or 0 Windows accelarators ('&')`
      );
    }

    return (
      <span>
        {parts[0]}
        <u>{parts[1].charAt(0)}</u>
        {parts[1].substring(1)}
      </span>
    );
  };

  renderAccelerator = (accelerator?: string) => {
    if (!accelerator) return accelerator;

    return (
      <span>
        {accelerator.replace(
          /CmdOrCtrl|CommandOrControl/,
          isMac ? 'Cmd' : 'Ctrl'
        )}
      </span>
    );
  };

  render() {
    const { windowIsMaximized } = this.state;
    return (
      <TitleBar>
        <TitleBarSection left>
          <LogoPad>
            <Logo size="icon" />
          </LogoPad>
          {this.renderMenuBar()}
        </TitleBarSection>
        <TitleBarSection right>
          <MenuBarItem onClick={this.minimize}>
            <Icon icon={minus} />
          </MenuBarItem>
          <MenuBarItem onClick={this.toggleMaximize}>
            <Icon icon={windowIsMaximized ? minimize2 : maximize2} />
          </MenuBarItem>
          <MenuBarItem close onClick={this.close}>
            <Icon icon={x} />
          </MenuBarItem>
        </TitleBarSection>
      </TitleBar>
    );
  }
}

const TitleBar = styled.nav`
  z-index: ${Z_INDICES.titlebar};
  width: 100%;
  height: 30px;
  flex-shrink: 0;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: ${COLORS.gray[800]};
`;

const TitleBarSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  justify-content: ${props => (props.right ? 'flex-end' : 'flex-start')};
  -webkit-app-region: no-drag;
`;

const LogoPad = styled.div`
  -webkit-app-region: drag;
  padding: 0 10px;
  margin-top: 3px;
`;

const MenuBarItem = styled.button`
  position: relative;
  display: block;
  padding: 0 10px;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: ${COLORS.white};

  &:hover {
    background: ${props => (props.close ? COLORS.red[500] : COLORS.gray[700])};
  }

  > ul {
    display: none;
  }

  &:focus > ul {
    display: block;
  }
`;

const SubMenu = styled.ul`
  position: absolute;
  top: 30px;
  left: 0;
  min-width: 250px;
  background: ${COLORS.gray[900]};
  margin: 0;
  padding: 4px 0;
  box-shadow: 0px 6px 60px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.05);
`;

const SubMenuItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  margin: 0;
  padding: 4px 25px;
  color: ${COLORS.white};

  &:hover {
    background: ${COLORS.gray[700]};
    color: ${COLORS.teal[500]};
  }

  > :last-child {
    color: ${COLORS.transparentWhite[500]};
  }
`;

const SubMenuSeparator = styled.li`
  display: block;
  box-sizing: content-box;
  width: calc(100% - 20px);
  height: 1px;
  margin: 4px 10px;
  background: ${COLORS.transparentWhite[700]};
`;

export default FramelessMenu;
