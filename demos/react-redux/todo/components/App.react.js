import React from 'react';
import TodoList from './TodoList.react';
import * as Actions from '../redux/Actions';

import {connect} from 'react-redux';

function mapStateToProps(state) {
  return {
    loading: state.loading,
    creating: state.creating,
    items: state.items || [],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: () => dispatch(Actions.fetch()),
    update: (id, text) => dispatch(Actions.update(id, text)),
    destroy: (id) => dispatch(Actions.destroy(id)),
    create: (text) => dispatch(Actions.create(text)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);
