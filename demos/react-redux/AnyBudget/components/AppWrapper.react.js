import * as Actions from '../redux/Actions';
import Expenses from './Expenses.react';
import Overview from './Overview.react';
import React from 'react';
import Sidebar from './Sidebar.react';

import {connect} from 'react-redux';

class AppWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {currentTab: 0};

    props.fetchExpenses();
  }

  contentsForTab(tab) {
    switch (tab) {
      case 0:
        return <Overview />;
      case 1:
        return <Expenses />;
    }
  }

  render() {
    return (
      <div>
        <div className='menu'>
          <a
            className={this.state.currentTab === 0 ? 'selected' : ''}
            onClick={() => this.setState({currentTab: 0})}>
            Overview
          </a>
          <a
            className={this.state.currentTab === 1 ? 'selected' : ''}
            onClick={() => this.setState({currentTab: 1})}>
            Expenses
          </a>
        </div>
        <Sidebar />
        <div className='mainPanel'>
          {this.contentsForTab(this.state.currentTab)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    fetchExpenses: () => dispatch(Actions.fetchExpenses()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppWrapper);
