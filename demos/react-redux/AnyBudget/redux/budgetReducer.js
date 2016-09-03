const budgetReducer = (state = {}, action) => {
  const expenses = state.expenses || [];
  switch (action.type) {
    case 'SET_USER_AUTH':
      return {
        ...state,
        user: action.user,
        sessionToken: action.sessionToken,
      };
    case 'FETCH_EXPENSES':
      return {
        ...state,
        expenses: action.expenses,
      };
    case 'CREATE_EXPENSE':
      return {
        ...state,
        expenses: expenses.concat(action.expense),
      };
    case 'UPDATE_EXPENSE':
      const updated = expenses.map(
        (e) => e.objectId === action.expense.objectId ? action.expense : e
      );
      return {
        ...state,
        expenses: updated,
      };
    case 'DELETE_EXPENSE':
      const filtered = expenses.filter(
        (e) => e.objectId !== action.expense.objectId
      );
      return {
        ...state,
        expenses: filtered,
      };
  }
  return state;
};

const debugReducer = function(state, action) {
  console.log('Action:', action);
  console.log('Current State:', state);
  const next = budgetReducer(state, action);
  console.log('New State:', next);
  return next;
}

export default debugReducer;
