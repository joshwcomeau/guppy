// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import ExternalLink from '../ExternalLink';
import Button from '../Button';
import Label from '../Label';

import type { Dependency } from '../../types';

type Props = {
  dependency: Dependency,
};

class DependencyDetailsTable extends Component<Props> {
  render() {
    const { dependency } = this.props;

    const packageHref = `https://www.npmjs.org/package/${dependency.name}`;
    const githubHref =
      dependency.repository &&
      `https://www.github.com/${dependency.repository}`;

    return (
      <Table>
        {dependency.license && (
          <tr>
            <Cell>
              <Label>License</Label>
            </Cell>
            <Cell>{dependency.license}</Cell>
          </tr>
        )}
        <tr>
          <Cell>
            <Label>Resources</Label>
          </Cell>
          <Cell>
            Learn more about <strong>{dependency.name}</strong> on:<br />
            <ExternalLink href={packageHref}>NPM</ExternalLink> ·{' '}
            <ExternalLink href={githubHref}>GitHub</ExternalLink> ·{' '}
            <ExternalLink href={dependency.homepage}>
              Official Website
            </ExternalLink>
          </Cell>
        </tr>
        <tr>
          <Cell>
            <Label>Actions</Label>
          </Cell>
          <Cell>
            <Button
              size="small"
              type="fill"
              color1={COLORS.hotPink[700]}
              color2={COLORS.pink[300]}
            >
              Delete
            </Button>
          </Cell>
        </tr>
      </Table>
    );
  }
}

const Table = styled.table`
  width: 100%;
`;

const Cell = styled.td`
  padding: 10px 0;
  vertical-align: middle;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  &:first-of-type {
    width: 150px;
    color: ${COLORS.gray[600]};
  }
`;

export default DependencyDetailsTable;
