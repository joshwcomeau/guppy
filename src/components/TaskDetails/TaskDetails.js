// @flow
import React from 'react';
import { connect } from 'react-redux';

import { COLORS } from '../../constants';
import { capitalize } from '../../utils';
import { getTaskById } from '../../reducers/tasks.reducer';

import type { Task } from '../../types';

type Props = {
  taskId: ?string,
  task: ?Task,
};
const TaskDetails = ({ task }: Props) => {
  return <div>Hello World, ${task ? task.name : 'No task selected'}</div>;
};

const mapStateToProps = (state, ownProps) => ({
  task: getTaskById(ownProps.taskId, state),
});

export default connect()(TaskDetails);
