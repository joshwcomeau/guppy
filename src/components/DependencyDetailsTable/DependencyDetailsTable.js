// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { COLORS } from '../../constants';

import ExternalLink from '../ExternalLink';
import Label from '../Label';
import Middot from '../Middot';
import DeleteDependencyButton from '../DeleteDependencyButton';
import Spinner from '../Spinner';

import type { Dependency } from '../../types';

type Props = {
  projectId: string,
  dependency: Dependency,
  lastUpdatedAt: number,
};

class DependencyDetailsTable extends Component<Props> {
  render() {
    const { projectId, dependency, lastUpdatedAt } = this.props;

    const packageHref = `https://www.npmjs.org/package/${dependency.name}`;
    const githubHref =
      dependency.repository &&
      `https://www.github.com/${dependency.repository}`;

    return (
      <Table>
        <tbody>
          <tr>
            <FirstCell>
              <Label>Last Updated</Label>
            </FirstCell>
            <FirstCell>
              {lastUpdatedAt ? (
                moment(lastUpdatedAt).fromNow()
              ) : (
                <Spinner size={15} />
              )}
            </FirstCell>
          </tr>
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
              <ExternalLink href={packageHref}>NPM</ExternalLink>
              <Middot />
              <ExternalLink href={githubHref}>GitHub</ExternalLink>
              {dependency.homepage && <Middot />}
              {dependency.homepage && (
                <ExternalLink href={dependency.homepage}>
                  Official Website
                </ExternalLink>
              )}
            </Cell>
          </tr>
          <tr>
            <LastCell>
              <Label style={{ color: COLORS.pink[500] }}>Danger Zone</Label>
            </LastCell>
            <LastCell>
              <DeleteDependencyButton
                projectId={projectId}
                dependencyName={dependency.name}
                isBeingDeleted={dependency.isBeingDeleted}
              />
            </LastCell>
          </tr>
        </tbody>
      </Table>
    );
  }
}

const Table = styled.table`
  width: 100%;
`;

const Cell = styled.td`
  padding: 15px 0;
  vertical-align: middle;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  &:first-of-type {
    width: 150px;
    color: ${COLORS.gray[600]};
  }
`;

// TODO: Feels gross to be doing this manually when `tr:first-child td`
// would work.
const FirstCell = Cell.extend`
  padding-top: 0;
`;
const LastCell = Cell.extend`
  padding-bottom: 0;
  border-bottom: none;
`;

export default DependencyDetailsTable;
