import {App, Destroy, Ops, Query, Save, User} from 'parse-lite';

// INITIALIZE HERE
const app = new App({
  host: '', // The path to your Parse Server
  applicationId: '', // Your Application ID
});

export function logIn(username, password) {
  return function(dispatch) {
    return User.logIn(app, {username, password}).then((auth) => {
      dispatch({
        type: 'SET_USER_AUTH',
        user: auth.user,
        sessionToken: auth.sessionToken,
      });
    });
  };
}

export function logOut() {
  return function(dispatch, getState) {
    const {sessionToken} = getState();
    dispatch({type: 'SET_USER_AUTH', user: null});
    return User.logOut(app, sessionToken);
  };
}

export function signUp(username, password) {
  return function(dispatch) {
    return User.signUp(app, {username, password}).then((auth) => {
      dispatch({
        type: 'SET_USER_AUTH',
        user: auth.user,
        sessionToken: auth.sessionToken,
      });
    });
  };
}

export function fetchExpenses() {
  return function(dispatch, getState) {
    const {sessionToken} = getState();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 0, 0, 0);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 0, 0);
    let q = Query.ascending({}, 'createdAt');
    q = Query.greaterThan(q, 'createdAt', monthStart);
    q = Query.lessThan(q, 'createdAt', monthEnd);
    return Query.find(app, 'Expense', q, {sessionToken}).then((results) => {
      dispatch({
        type: 'FETCH_EXPENSES',
        expenses: results,
      });
    });
  };
}

export function createExpense({name, category, costCents}) {
  return function(dispatch, getState) {
    const {user} = getState();
    // Create an ACL, so that this object is only accessible to the current user
    const acl = {[user.objectId]: {read: true, write: true}};
    return Save(app, 'Expense', {
      name: name,
      category: category,
      costCents: costCents,
      ACL: acl,
    }).then((ex) => {
      dispatch({
        type: 'CREATE_EXPENSE',
        expense: ex,
      });
    });
  };
}

export function recategorize(ex, category) {
  return function(dispatch, getState) {
    const {sessionToken} = getState();
    const updated = Ops.set(ex, {category});
    dispatch({type: 'UPDATE_EXPENSE', expense: updated});
    return Save(app, 'Expense', updated, {sessionToken}).catch(() => {
      // If fails, reset to old value
      dispatch({type: 'UPDATE_EXPENSE', expense: ex});
    });
  };
}

export function deleteExpense(ex) {
  return function(dispatch, getState) {
    const {sessionToken} = getState();
    dispatch({type: 'DELETE_EXPENSE', expense: ex});
    return Destroy(app, 'Expense', ex, {sessionToken});
  };
}

export function updateBudget(budget) {
  return function(dispatch, getState) {
    const {sessionToken, user} = getState();
    const updated = Ops.set(user, {budget});
    return Save(app, '_User', updated, {sessionToken}).then((u) => {
      dispatch({type: 'SET_USER_AUTH', user: u, sessionToken: sessionToken});
    });
  };
}
