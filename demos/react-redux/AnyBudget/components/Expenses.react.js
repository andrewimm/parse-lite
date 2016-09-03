import * as Actions from '../redux/Actions';
import Categories from './Categories';
import ExpenseCreator from './ExpenseCreator.react';
import React from 'react';

import {connect} from 'react-redux';

const EmptyTable = () => (
  <div className='emptyTable'>
    <h2>You have no expenses this month!</h2>
    <h3>(How frugal of you)</h3>
  </div>
);

const ExpenseTable = (props) => (
  <div className='expenseTable'>
    {props.expenses.map((ex) => {
      const costString = '$' + (ex.costCents / 100).toFixed(2);
      return (
        <div key={ex.objectId} className='expenseRow'>
          <span className='expenseName'>{ex.name}</span>
          <span className='expenseCost'>{costString}</span>
          <select
            className='expenseCategory'
            value={ex.category}
            onChange={props.recategorize.bind(this, ex)}>
            {Categories.map((c, i) => i ? <option key={c} value={c}>{c}</option> : null)}
          </select>
          <a
            className='delete'
            onClick={props.deleteExpense.bind(this, ex)}>
            &times;
          </a>
        </div>
      );
    })}
  </div>
);

const Expenses = (props) => (
  <div className='appContent'>
    {!props.expenses ?
      <div className='loading' /> :
      (props.expenses.length ?
      <ExpenseTable {...props} /> :
      <EmptyTable />)}
    <ExpenseCreator />
  </div>
);

function mapStateToProps(state) {
  return {
    expenses: state.expenses,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    recategorize: (ex, e) => dispatch(Actions.recategorize(ex, e.target.value)),
    deleteExpense: (ex) => dispatch(Actions.deleteExpense(ex)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Expenses);
