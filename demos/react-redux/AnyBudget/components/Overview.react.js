import BarChart from './BarChart.react';
import React from 'react';

import {connect} from 'react-redux';

const Overview = (props) => {
  const totals = {};
  for (let i = 0; i < props.expenses.length; i++) {
    const cat = props.expenses[i].category;
    totals[cat] = props.expenses[i].costCents + (totals[cat] || 0);
  }
  const segments = [];
  for (let c in totals) {
    segments.push({category: c, total: totals[c]/100});
  }
  const budget = props.user.budget;

  let content = segments.map((s) => (
    <div key={s.category}>
      {s.category}
      <BarChart value={s.total} max={budget} />
    </div>
  ));

  if (!segments.length) {
    content = (
      <div className='emptyTable'>
        <h2>You have no expenses this month!</h2>
      </div>
    );
  }

  return (
    <div className='appContent'>
      {content}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    expenses: state.expenses || [],
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
