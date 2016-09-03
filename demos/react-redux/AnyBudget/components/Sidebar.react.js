import * as Actions from '../redux/Actions';
import DonutChart from './DonutChart.react';
import React from 'react';

import {connect} from 'react-redux';

class Sidebar extends React.Component {
  constructor() {
    super();

    this.state = {editingBudget: false};

    this.budgetKeyDown = this.budgetKeyDown.bind(this);
    this.updateBudget = this.updateBudget.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
  }

  render() {
    const budget = '$' + (this.props.user.budget || 0);
    const totals = {};
    for (let i = 0; i < this.props.expenses.length; i++) {
      const cat = this.props.expenses[i].category;
      totals[cat] = this.props.expenses[i].costCents + (totals[cat] || 0);
    }
    const segments = [];
    for (let c in totals) {
      segments.push({id: c, total: totals[c]});
    }

    return (
      <div className='sidebar'>
        <h3>Monthly Budget:</h3>
        {this.state.editingBudget ?
          <input
            ref={r => this.budget = r}
            type='text'
            defaultValue={budget}
            onBlur={this.updateBudget}
            onKeyDown={this.budgetKeyDown} /> :
          <div className='budget' onClick={this.toggleEditing}>{budget}</div>}
        <DonutChart width={120} height={120} segments={segments} />
      </div>
    );
  }

  budgetKeyDown(e) {
    if (e.keyCode === 13) {
      this.updateBudget(e);
    }
  }

  updateBudget(e) {
    const newBudget = e.target.value.replace(/\.\d*/g, '').replace(/[^\d]/g, '');
    this.props.updateBudget(newBudget);
    this.setState({editingBudget: false});
  }

  toggleEditing() {
    const shouldFocus = !this.state.editingBudget;
    this.setState({editingBudget: !this.state.editingBudget}, () => {
      if (shouldFocus) {
        this.budget.focus();
      }
    });
  }
}

function mapStateToProps(state) {
  return {
    expenses: state.expenses || [],
    user: state.user,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    updateBudget: (budget) => dispatch(Actions.updateBudget(budget)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
