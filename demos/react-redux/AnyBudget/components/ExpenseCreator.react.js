import * as Actions from '../redux/Actions';
import Categories from './Categories';
import React from 'react';

import {connect} from 'react-redux';

class ExpenseCreator extends React.Component {
  constructor() {
    super();

    this.state = {fileData: ''};

    this.addExpense = this.addExpense.bind(this);
  }

  render() {
    return (
      <div className='expenseCreator centered'>
        <input
          className='name'
          type='text'
          ref={r => this.name = r}
          placeholder='File a new expense' />
        <input
          className='cost'
          type='text'
          ref={r => this.cost = r}
          placeholder='$0.00' />
        <select ref={r => this.category = r}>
          {Categories.map((c, i) => {
            return <option key={c} value={i ? c : ''}>{c}</option>;
          })}
        </select>
        <a className='button' onClick={this.addExpense}>
          Add Expense +
        </a>
      </div>
    );
  }

  addExpense() {
    if (
      this.name.value === '' ||
      this.cost.value === '' ||
      this.category.value === ''
    ) {
      return;
    }
    if (!this.cost.value.match(/^\$?\d+(\.\d*)?$/)) {
      return;
    }
    const costCents = Number(this.cost.value.replace('$', '')) * 100;
    this.props.createExpense({
      name: this.name.value,
      category: this.category.value,
      costCents: costCents
    }).then(()=> {
      this.name.value = '';
      this.cost.value = '';
      this.category.value = '';
    });
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    createExpense: (ex) => dispatch(Actions.createExpense(ex)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpenseCreator);
