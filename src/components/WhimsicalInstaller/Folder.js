// @flow
import React, { Fragment, Component } from 'react';

type Props = {
  size?: number,
};

export const FolderBase = ({ size }: Props) => (
  <svg
    width={size}
    viewBox="0 0 379 261"
    fill="none"
    style={{ position: 'absolute', zIndex: 1 }}
  >
    <path
      d="M0 52C0 37.8579 0 30.7868 4.3934 26.3934C8.7868 22 15.8579 22 30 22H349C363.142 22 370.213 22 374.607 26.3934C379 30.7868 379 37.8579 379 52V231C379 245.142 379 252.213 374.607 256.607C370.213 261 363.142 261 349 261H30C15.8579 261 8.7868 261 4.3934 256.607C0 252.213 0 245.142 0 231V52Z"
      fill="#E8D07B"
    />
    <path
      d="M21 15.9C21 10.3938 21 7.64071 22.0546 5.53021C23.0225 3.59308 24.5931 2.02249 26.5302 1.05455C28.6407 0 31.3938 0 36.9 0H108.1C113.606 0 116.359 0 118.47 1.05455C120.407 2.02249 121.978 3.59308 122.945 5.53021C124 7.64071 124 10.3938 124 15.9V22H21V15.9Z"
      fill="#E8D07B"
    />
  </svg>
);

export const FolderTop = ({ size }: Props) => (
  <svg
    width={size}
    viewBox="0 0 379 261"
    fill="none"
    style={{ position: 'absolute', zIndex: 3 }}
  >
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="189.5"
        y1="33"
        x2="189.5"
        y2="261"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#FBE57F" />
        <stop offset="1" stop-color="#F8DC78" />
      </linearGradient>
    </defs>

    <rect y="33" width="379" height="228" rx="15" fill="url(#paint0_linear)" />
  </svg>
);

class Folder extends Component<Props> {
  render() {
    const { size } = this.props;

    return (
      <Fragment>
        <FolderBase size={size} />
        <FolderTop size={size} />
      </Fragment>
    );
  }
}

export default Folder;
