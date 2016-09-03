import React from 'react';
import LoginWrapper from './LoginWrapper.react';
import * as Actions from '../redux/Actions';

import {connect} from 'react-redux';

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logIn: (username, password) => dispatch(Actions.logIn(username, password)),
    logOut: () => dispatch(Actions.logOut()),
    signUp: (username, password) => dispatch(Actions.signUp(username, password)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginWrapper);
